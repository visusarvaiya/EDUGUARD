const mongoose = require('mongoose');

const riskScoreSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    level: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    attendanceRisk: { type: Number, required: true },
    marksRisk: { type: Number, required: true },
    assignmentRisk: { type: Number, required: true },
    lmsRisk: { type: Number, required: true },
    trendFlag: { type: String }, // 'Consistently Declining', etc.
    calculatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RiskScore', riskScoreSchema);
