const mongoose = require('mongoose');

const interventionSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['Counselling', 'Remedial Class', 'Assignment Extension', 'Parent Meeting', 'Extra Study Session', 'Other'],
      required: true,
    },
    date: { type: Date, required: true },
    remarks: { type: String, required: true, minlength: 20 },
    outcomeExpected: {
      type: String,
      enum: ['Attendance Improvement', 'Marks Recovery', 'Assignment Completion', 'General Support'],
    },
    followUpRequired: { type: Boolean, default: false },
    followUpDate: { type: Date },
    preInterventionScore: { type: Number },
    postInterventionScore: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Intervention', interventionSchema);
