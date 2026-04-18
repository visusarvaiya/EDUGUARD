const mongoose = require('mongoose');

const academicDataSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    attendance: { type: Number, default: 0 },
    totalClasses: { type: Number, default: 0 },
    internalMarks: { type: Number, default: 0 },
    midTest1: { type: Number, default: 0 },
    midTest2: { type: Number, default: 0 },
    internalAssessment: { type: Number, default: 0 },
    vivaMarks: { type: Number, default: 0 },
    assignmentsPending: { type: Number, default: 0 },
    assignmentsTotal: { type: Number, default: 0 },
    lmsLoginsPerWeek: { type: Number, default: 0 },
    lastYearFinalMarks: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AcademicData', academicDataSchema);
