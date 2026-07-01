const mongoose = require("mongoose");

const teacherClassSubjectSchema = new mongoose.Schema({
  teacher_id: {
    type: String,
    required: true
  },
  organization_id: {
    type: String
  },
  class_id: {
    type: String,
    required: true
  },
  section_id: {
    type: String,
    required: true
  },
  subject_id: {
    type: String,
    required: true
  },
  assigned_date: {
    type: Date,
    default: Date.now
  },
  is_active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("teacher_class_subject_mappings", teacherClassSubjectSchema);
