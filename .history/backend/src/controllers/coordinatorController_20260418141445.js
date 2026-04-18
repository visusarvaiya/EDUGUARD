const Student = require('../models/Student');
const RiskScore = require('../models/RiskScore');
const Intervention = require('../models/Intervention');
const Subject = require('../models/Subject');
const AcademicData = require('../models/AcademicData');

const getCoordinatorSummary = async (req, res) => {
  try {
    const { department, semester } = req.query;

    const query = {};
    if (department) query.department = department;
    if (semester) query.semester = parseInt(semester);

    const students = await Student.find(query);
    const studentIds = students.map((s) => s._id);

    const riskScores = await RiskScore.find({ studentId: { $in: studentIds } })
      .sort({ createdAt: -1 });

    const highRiskCount = riskScores.filter((r) => r.level === 'High').length;
    const mediumRiskCount = riskScores.filter((r) => r.level === 'Medium').length;
    const lowRiskCount = riskScores.filter((r) => r.level === 'Low').length;

    const interventions = await Intervention.find({ studentId: { $in: studentIds } });

    const improvedCount = interventions.filter(
      (i) => i.postInterventionScore && i.postInterventionScore < i.preInterventionScore
    ).length;

    res.status(200).json({
      totalStudents: students.length,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      percentHighRisk: students.length > 0 ? ((highRiskCount / students.length) * 100).toFixed(2) : 0,
      totalInterventions: interventions.length,
      improvedAfterIntervention: improvedCount,
      percentImproved: interventions.length > 0 ? ((improvedCount / interventions.length) * 100).toFixed(2) : 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSystemicIssues = async (req, res) => {
  try {
    const issues = [];

    // Find departments/semesters with low average scores
    const groupStats = await RiskScore.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student',
        },
      },
      { $unwind: '$student' },
      {
        $group: {
          _id: { department: '$student.department', semester: '$student.semester' },
          avgRisk: { $avg: '$score' },
          count: { $sum: 1 },
        },
      },
      { $match: { avgRisk: { $gt: 60 } } },
    ]);

    for (const stat of groupStats) {
      issues.push(
        `${stat._id.department} - Semester ${stat._id.semester}: Average risk score is ${stat.avgRisk.toFixed(2)} (${stat.count} students)`
      );
    }

    res.status(200).json({ systemicIssues: issues });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCoordinatorSummary, getSystemicIssues };
