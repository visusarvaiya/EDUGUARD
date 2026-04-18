const AcademicData = require('../models/AcademicData');
const RiskScore = require('../models/RiskScore');
const { redisClient } = require('./database');

const calculateRiskScore = async (studentId) => {
  try {
    // Get cached risk if available
    const cachedRisk = await redisClient.get(`risk:${studentId}`);
    if (cachedRisk) {
      return JSON.parse(cachedRisk);
    }

    const academicData = await AcademicData.find({ studentId });

    if (academicData.length === 0) {
      return null;
    }

    let totalAttendanceRisk = 0,
      totalMarksRisk = 0,
      totalAssignmentRisk = 0,
      totalLmsRisk = 0;
    let count = 0;

    for (const data of academicData) {
      // Calculate attendance risk
      const attendancePercentage = data.totalClasses > 0 
        ? (data.attendance / data.totalClasses) * 100 
        : 0;
      const attendanceRisk = Math.max(0, Math.min(100, ((75 - attendancePercentage) / 75) * 100));

      // Calculate marks risk
      const marksRisk = Math.max(0, Math.min(100, ((50 - data.internalMarks) / 50) * 100));

      // Calculate assignment risk
      const assignmentRisk = data.assignmentsTotal > 0
        ? Math.max(0, Math.min(100, (data.assignmentsPending / data.assignmentsTotal) * 100))
        : 0;

      // Calculate LMS risk
      const lmsRisk = Math.max(0, Math.min(100, ((5 - data.lmsLoginsPerWeek) / 5) * 100));

      totalAttendanceRisk += attendanceRisk;
      totalMarksRisk += marksRisk;
      totalAssignmentRisk += assignmentRisk;
      totalLmsRisk += lmsRisk;
      count++;
    }

    const avgAttendanceRisk = totalAttendanceRisk / count;
    const avgMarksRisk = totalMarksRisk / count;
    const avgAssignmentRisk = totalAssignmentRisk / count;
    const avgLmsRisk = totalLmsRisk / count;

    const overallRisk =
      0.4 * avgAttendanceRisk +
      0.3 * avgMarksRisk +
      0.2 * avgAssignmentRisk +
      0.1 * avgLmsRisk;

    const riskScore = Math.max(0, Math.min(100, overallRisk));

    let level = 'Low';
    if (riskScore >= 65) level = 'High';
    else if (riskScore >= 40) level = 'Medium';

    // Check for declining trend
    const recentScores = await RiskScore.find({ studentId })
      .sort({ calculatedAt: -1 })
      .limit(3);

    let trendFlag = null;
    if (
      recentScores.length >= 3 &&
      recentScores[0].score > recentScores[1].score &&
      recentScores[1].score > recentScores[2].score
    ) {
      trendFlag = 'Consistently Declining';
      if (level !== 'High') level = 'High'; // Elevate to high if declining trend
    }

    const riskData = {
      studentId,
      score: riskScore,
      level,
      attendanceRisk: avgAttendanceRisk,
      marksRisk: avgMarksRisk,
      assignmentRisk: avgAssignmentRisk,
      lmsRisk: avgLmsRisk,
      trendFlag,
      calculatedAt: new Date(),
    };

    // Cache for 1 hour
    await redisClient.setEx(`risk:${studentId}`, 3600, JSON.stringify(riskData));

    return riskData;
  } catch (error) {
    console.error('Risk calculation error:', error);
    return null;
  }
};

const simulateRisk = async (studentId, attendancePercentage, assignmentsPending, assignmentsTotal, marksImprovement) => {
  try {
    const academicData = await AcademicData.findOne({ studentId });
    if (!academicData) return null;

    // Simulate with new values
    const simAttendanceRisk = Math.max(0, Math.min(100, ((75 - attendancePercentage) / 75) * 100));
    const simMarksRisk = Math.max(0, Math.min(100, ((50 - (academicData.internalMarks + marksImprovement)) / 50) * 100));
    const simAssignmentRisk = assignmentsTotal > 0
      ? Math.max(0, Math.min(100, (assignmentsPending / assignmentsTotal) * 100))
      : 0;
    const simLmsRisk = Math.max(0, Math.min(100, ((5 - academicData.lmsLoginsPerWeek) / 5) * 100));

    const simulatedRisk = 0.4 * simAttendanceRisk + 0.3 * simMarksRisk + 0.2 * simAssignmentRisk + 0.1 * simLmsRisk;

    return {
      currentScore: (await calculateRiskScore(studentId))?.score || 0,
      projectedScore: Math.max(0, Math.min(100, simulatedRisk)),
      improvements: {
        attendance: attendancePercentage,
        marksImprovement,
        assignmentsPending,
      },
    };
  } catch (error) {
    console.error('Risk simulation error:', error);
    return null;
  }
};

module.exports = { calculateRiskScore, simulateRisk };
