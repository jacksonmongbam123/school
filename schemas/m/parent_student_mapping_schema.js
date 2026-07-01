const mongoose = require("mongoose");

const parentStudentSchema = new mongoose.Schema({
  parent_id: {
    type: String,
    required: true
  },
  student_id: {
    type: String,
    required: true
  },
  organization_id: {
    type: String
  },
  relationship: {
    type: String,
    enum: ["father", "mother", "guardian"],
    default: "guardian"
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

module.exports = mongoose.model("parent_student_mappings", parentStudentSchema);
