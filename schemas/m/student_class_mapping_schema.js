const mongoose = require("mongoose");

const studentClassSchema = new mongoose.Schema({
  student_id: {
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
  assigned_date: {
    type: Date,
    default: Date.now
  },
  is_active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("student_class_mappings", studentClassSchema);
