const Intervention = require('../models/Intervention');
const Student = require('../models/Student');
const RiskScore = require('../models/RiskScore');
const { sendEmail } = require('../config/email');

const logIntervention = async (req, res) => {
  try {
    const { studentId, type, remarks, outcomeExpected, followUpRequired, followUpDate } = req.body;
    const { userId } = req.user;

    const student = await Student.findById(studentId).populate('userId');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const preScore = await RiskScore.findOne({ studentId }).sort({ createdAt: -1 });

    const intervention = new Intervention({
      studentId,
      mentorId: userId,
      type,
      date: new Date(),
      remarks,
      outcomeExpected,
      followUpRequired,
      followUpDate,
      preInterventionScore: preScore?.score,
    });

    await intervention.save();

    // Send email to student
    const emailHtml = `
      <h2>Academic Intervention Logged</h2>
      <p>Dear ${student.userId.name},</p>
      <p>An intervention has been logged for you:</p>
      <p><strong>Type:</strong> ${type}</p>
      <p><strong>Remarks:</strong> ${remarks}</p>
      <p>Please follow up with your mentor for more details.</p>
    `;

    await sendEmail(student.userId.email, 'AcadWatch Intervention Logged', emailHtml);

    res.status(201).json(intervention);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInterventions = async (req, res) => {
  try {
    const { studentId } = req.params;

    const interventions = await Intervention.find({ studentId })
      .populate('mentorId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(interventions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { logIntervention, getInterventions };
