const jsPDF = require('jspdf');
const Student = require('../models/Student');
const RiskScore = require('../models/RiskScore');
const Intervention = require('../models/Intervention');
const AcademicData = require('../models/AcademicData');
const User = require('../models/User');

const generatePDFReport = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).populate('userId');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const riskScore = await RiskScore.findOne({ studentId }).sort({ createdAt: -1 });
    const interventions = await Intervention.find({ studentId });
    const academicData = await AcademicData.find({ studentId }).populate('subjectId');

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('AcadWatch Risk Report', 20, 20);

    doc.setFontSize(12);
    doc.text(`Student: ${student.userId.name}`, 20, 40);
    doc.text(`Class: ${student.class}`, 20, 50);
    doc.text(`Department: ${student.department}`, 20, 60);

    if (riskScore) {
      doc.text(`Current Risk Score: ${riskScore.score.toFixed(2)} (${riskScore.level})`, 20, 80);
      doc.text(`Attendance Risk: ${riskScore.attendanceRisk.toFixed(2)}`, 20, 90);
      doc.text(`Marks Risk: ${riskScore.marksRisk.toFixed(2)}`, 20, 100);
      doc.text(`Assignment Risk: ${riskScore.assignmentRisk.toFixed(2)}`, 20, 110);
    }

    doc.text(`Total Interventions: ${interventions.length}`, 20, 130);

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="report_${studentId}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateCSVExport = async (req, res) => {
  try {
    const { department, semester } = req.query;

    const query = {};
    if (department) query.department = department;
    if (semester) query.semester = parseInt(semester);

    const students = await Student.find(query).populate('userId');
    const studentIds = students.map((s) => s._id);

    const riskScores = await RiskScore.find({ studentId: { $in: studentIds } })
      .sort({ createdAt: -1 });

    const latestRisks = {};
    for (const risk of riskScores) {
      if (!latestRisks[risk.studentId]) {
        latestRisks[risk.studentId] = risk;
      }
    }

    const interventions = await Intervention.find({ studentId: { $in: studentIds } });
    const latestInterventions = {};
    for (const intervention of interventions.sort((a, b) => b.createdAt - a.createdAt)) {
      if (!latestInterventions[intervention.studentId]) {
        latestInterventions[intervention.studentId] = intervention;
      }
    }

    let csv = 'Name,Department,Class,Risk Score,Risk Level,Top Reason,Last Intervention Date\n';

    for (const student of students) {
      const risk = latestRisks[student._id];
      const intervention = latestInterventions[student._id];

      const topReason = risk
        ? risk.marksRisk > risk.attendanceRisk
          ? 'Low Marks'
          : 'Low Attendance'
        : 'N/A';

      const interventionDate = intervention ? intervention.createdAt.toLocaleDateString() : 'N/A';

      csv += `${student.userId.name},${student.department},${student.class},${risk ? risk.score.toFixed(2) : 'N/A'},${risk ? risk.level : 'N/A'},${topReason},${interventionDate}\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="acadwatch_report.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generatePDFReport, generateCSVExport };
