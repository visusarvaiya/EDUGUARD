const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    syllabus: [
      {
        unit: { type: String },
        topics: [{ type: String }],
        covered: { type: Boolean, default: false },
        examWeightage: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subject', subjectSchema);
