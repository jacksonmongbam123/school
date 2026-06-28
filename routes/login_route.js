const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authSchema = require("../schemas/auth_schema");
const tokenSchema = require("../schemas/token_schema");

router.post("/", async (req, res) => {
  try {
    const username = req.body.username ? req.body.username.trim() : "";
    const password = req.body.password || "";

    if (!username || !password) {
      return res.status(400).json({ status: 400, message: "Username and password are required!" });
    }



    // Resilient case-insensitive regex query against MongoDB Atlas
    const userList = await authSchema.find({
      $or: [
        { nic: new RegExp('^' + username + '$', "i") },
        { phone: new RegExp('^' + username + '$', "i") },
        { reg_no: new RegExp('^' + username + '$', "i") }
      ]
    });

    if (!userList || userList.length < 1) {
      return res.status(401).json({ status: 401, message: "401 Authorization Failed! Portal ID not found in MongoDB database." });
    }

    const user = userList[0];
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ status: 401, message: "401 Authorization Failed! Incorrect password." });
    }

    const token = jwt.sign({ user_id: user._id, role: user.user_type }, process.env.JWT_SECRET || "abms_secret", { expiresIn: "12h" });

    // Save token to database
    try {
      const tokenModel = new tokenSchema({
        user_id: String(user.user_id || user._id),
        token: token,
        user_type: user.user_type
      });
      await tokenModel.save();
    } catch (tokenErr) {
      console.error("Token save error:", tokenErr);
    }
    return res.status(200).json({ status: 200, message: "Login Successful", token, user });
  } catch (err) {
    console.error("Login route exception:", err);
    return res.status(500).json({ status: 500, message: "Internal cloud backend error." });
  }
});

module.exports = router;