const express = require("express");
const router = express.Router();
const teacherClassSubjectSchema = require("../../schemas/m/teacher_class_subject_mapping_schema");

// POST: Assign teacher to class, section, and subject
router.post("/assign", async (req, res) => {
  try {
    const { teacher_id, organization_id, class_id, section_id, subject_id } = req.body;

    if (!teacher_id || !class_id || !section_id || !subject_id) {
      return res.status(400).json({ error: "teacher_id, class_id, section_id, and subject_id are required" });
    }

    // Check if already assigned
    const existing = await teacherClassSubjectSchema.findOne({ 
      teacher_id, 
      class_id, 
      section_id,
      subject_id,
      is_active: true 
    });

    if (existing) {
      return res.status(409).json({ error: "Teacher already assigned to this class, section, and subject" });
    }

    const mapping = new teacherClassSubjectSchema({
      teacher_id,
      organization_id,
      class_id,
      section_id,
      subject_id
    });

    const saved = await mapping.save();
    res.json({ message: "Teacher assigned successfully", mapping: saved });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

// GET: Get assignments for a teacher
router.get("/teacher/:teacher_id", async (req, res) => {
  try {
    const mappings = await teacherClassSubjectSchema.find({ 
      teacher_id: req.params.teacher_id,
      is_active: true 
    });

    res.json(mappings);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

// GET: Get all teachers for a class/section/subject
router.get("/class/:class_id/section/:section_id/subject/:subject_id", async (req, res) => {
  try {
    const mappings = await teacherClassSubjectSchema.find({ 
      class_id: req.params.class_id,
      section_id: req.params.section_id,
      subject_id: req.params.subject_id,
      is_active: true 
    });

    res.json(mappings);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

// PUT: Update teacher assignment
router.put("/update/:teacher_id", async (req, res) => {
  try {
    const { class_id, section_id, subject_id } = req.body;
    const mapping = await teacherClassSubjectSchema.findOneAndUpdate(
      { teacher_id: req.params.teacher_id, is_active: true },
      { class_id, section_id, subject_id },
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
router.delete("/remove/:teacher_id", async (req, res) => {
  try {
    const mapping = await teacherClassSubjectSchema.findOneAndUpdate(
      { teacher_id: req.params.teacher_id, is_active: true },
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
