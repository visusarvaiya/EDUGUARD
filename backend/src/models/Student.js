const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    class: { type: String, required: true },
    semester: { type: Number, required: true },
    department: { type: String, required: true },
    assignedMentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
