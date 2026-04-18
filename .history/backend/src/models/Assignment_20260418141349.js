const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    title: { type: String, required: true },
    dueDate: { type: Date, required: true },
    totalMarks: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
