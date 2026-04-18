const Student = require('../models/Student');
const RiskScore = require('../models/RiskScore');
const AcademicData = require('../models/AcademicData');
const Intervention = require('../models/Intervention');
const { calculateRiskScore, simulateRisk } = require('../services/riskEngine');

const getStudentRisk = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).populate('userId');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const riskData = await calculateRiskScore(studentId);
    if (!riskData) {
      return res.status(404).json({ error: 'No academic data found' });
    }

    // Save risk score to database
    const riskScore = new RiskScore(riskData);
    await riskScore.save();

    const academicData = await AcademicData.find({ studentId }).populate('subjectId');

    res.status(200).json({
      risk: riskData,
      academicBreakdown: academicData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRiskHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    const riskHistory = await RiskScore.find({ studentId })
      .sort({ calculatedAt: -1 })
      .limit(8);

    res.status(200).json(riskHistory.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const simulateStudentRisk = async (req, res) => {
  try {
    const { studentId } = req.user;
    const { attendance, assignmentsPending, marksImprovement } = req.body;

    const student = await Student.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const academics = await AcademicData.findOne({ studentId: student._id });
    if (!academics) {
      return res.status(404).json({ error: 'Academic data not found' });
    }

    const simulation = await simulateRisk(
      student._id,
      attendance,
      assignmentsPending,
      academics.assignmentsTotal,
      marksImprovement
    );

    res.status(200).json(simulation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getStudentRisk,
  getRiskHistory,
  simulateStudentRisk,
};
