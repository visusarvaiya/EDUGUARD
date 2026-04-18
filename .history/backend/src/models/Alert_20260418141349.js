const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: ['High Risk', 'Rapid Decline', 'Pre-Exam', 'Assignment Due'],
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    linkedStudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
