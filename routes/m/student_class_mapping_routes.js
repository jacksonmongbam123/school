const express = require("express");
const router = express.Router();
const studentClassSchema = require("../../schemas/m/student_class_mapping_schema");

// POST: Assign student to class and section
router.post("/assign", async (req, res) => {
  try {
    const { student_id, organization_id, class_id, section_id } = req.body;

    if (!student_id || !class_id || !section_id) {
      return res.status(400).json({ error: "student_id, class_id, and section_id are required" });
    }

    // Check if already assigned
    const existing = await studentClassSchema.findOne({ 
      student_id, 
      class_id, 
      section_id,
      is_active: true 
    });

    if (existing) {
      return res.status(409).json({ error: "Student already assigned to this class and section" });
    }

    const mapping = new studentClassSchema({
      student_id,
      organization_id,
      class_id,
      section_id
    });

    const saved = await mapping.save();
    res.json({ message: "Student assigned successfully", mapping: saved });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

// GET: Get assignment for a student
router.get("/student/:student_id", async (req, res) => {
  try {
    const mapping = await studentClassSchema.findOne({ 
      student_id: req.params.student_id,
      is_active: true 
    });

    if (!mapping) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json(mapping);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

// GET: Get all students in a class/section
router.get("/class/:class_id/section/:section_id", async (req, res) => {
  try {
    const mappings = await studentClassSchema.find({ 
      class_id: req.params.class_id,
      section_id: req.params.section_id,
      is_active: true 
    });

    res.json(mappings);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

// PUT: Update student assignment
router.put("/update/:student_id", async (req, res) => {
  try {
    const { class_id, section_id } = req.body;
    const mapping = await studentClassSchema.findOneAndUpdate(
      { student_id: req.params.student_id, is_active: true },
      { class_id, section_id },
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
router.delete("/remove/:student_id", async (req, res) => {
  try {
    const mapping = await studentClassSchema.findOneAndUpdate(
      { student_id: req.params.student_id, is_active: true },
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
