const express = require("express");
const router = express.Router();
const parentStudentSchema = require("../../schemas/m/parent_student_mapping_schema");

// POST: Assign students to a parent
router.post("/assign", async (req, res) => {
  try {
    const { parent_id, student_id, organization_id, relationship } = req.body;

    if (!parent_id || !student_id) {
      return res.status(400).json({ error: "parent_id and student_id are required" });
    }

    // Check if already assigned
    const existing = await parentStudentSchema.findOne({ 
      parent_id, 
      student_id,
      is_active: true 
    });

    if (existing) {
      return res.status(409).json({ error: "Student already assigned to this parent" });
    }

    const mapping = new parentStudentSchema({
      parent_id,
      student_id,
      organization_id,
      relationship: relationship || "guardian"
    });

    const saved = await mapping.save();
    res.json({ message: "Student assigned to parent successfully", mapping: saved });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

// GET: Get all students for a parent
router.get("/parent/:parent_id", async (req, res) => {
  try {
    const mappings = await parentStudentSchema.find({ 
      parent_id: req.params.parent_id,
      is_active: true 
    });

    res.json(mappings);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

// GET: Get all parents for a student
router.get("/student/:student_id", async (req, res) => {
  try {
    const mappings = await parentStudentSchema.find({ 
      student_id: req.params.student_id,
      is_active: true 
    });

    res.json(mappings);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

// PUT: Update parent-student relationship
router.put("/update/:parent_id/:student_id", async (req, res) => {
  try {
    const { relationship } = req.body;
    const mapping = await parentStudentSchema.findOneAndUpdate(
      { parent_id: req.params.parent_id, student_id: req.params.student_id, is_active: true },
      { relationship },
      { new: true }
    );

    if (!mapping) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json({ message: "Updated successfully", mapping });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

// DELETE: Remove assignment
router.delete("/remove/:parent_id/:student_id", async (req, res) => {
  try {
    const mapping = await parentStudentSchema.findOneAndUpdate(
      { parent_id: req.params.parent_id, student_id: req.params.student_id, is_active: true },
      { is_active: false },
      { new: true }
    );

    if (!mapping) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json({ message: "Assignment removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

module.exports = router;
