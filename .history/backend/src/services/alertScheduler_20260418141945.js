const cron = require('node-cron');
const RiskScore = require('../models/RiskScore');
const Alert = require('../models/Alert');
const Student = require('../models/Student');
const { sendEmail } = require('../config/email');
const { calculateRiskScore } = require('./riskEngine');

// Run every day at 2 AM
const startAlertScheduler = () => {
  cron.schedule('0 2 * * *', async () => {
    console.log('🔔 Running alert scheduler...');

    try {
      const students = await Student.find().populate('userId').populate('assignedMentorId');

      for (const student of students) {
        const latestRisk = await RiskScore.findOne({ studentId: student._id }).sort({ createdAt: -1 });

        if (!latestRisk) continue;

        // Alert 1: High Risk (>= 65)
        if (latestRisk.score >= 65) {
          const existingAlert = await Alert.findOne({
            studentId: student._id,
            type: 'High Risk',
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          });

          if (!existingAlert && student.assignedMentorId) {
            const alert = new Alert({
              studentId: student._id,
              mentorId: student.assignedMentorId._id,
              type: 'High Risk',
              message: `${student.userId.name} has been flagged as HIGH RISK with score ${latestRisk.score.toFixed(0)}`,
              isRead: false,
            });
            await alert.save();

            // Send email to mentor
            const emailHtml = `
              <h2>High Risk Alert</h2>
              <p><strong>${student.userId.name}</strong> (${student.class}) has been flagged as HIGH RISK.</p>
              <p><strong>Risk Score:</strong> ${latestRisk.score.toFixed(2)}/100</p>
              <p><strong>Top Factors:</strong></p>
              <ul>
                <li>Attendance: ${latestRisk.attendanceRisk.toFixed(0)} risk points</li>
                <li>Marks: ${latestRisk.marksRisk.toFixed(0)} risk points</li>
                <li>Assignments: ${latestRisk.assignmentRisk.toFixed(0)} risk points</li>
              </ul>
              <p>Please log in to AcadWatch and take immediate action.</p>
            `;

            await sendEmail(
              student.assignedMentorId.email,
              `⚠️ High Risk Alert — ${student.userId.name}`,
              emailHtml
            );
          }
        }

        // Alert 2: Rapid Decline (score increased by 15+ in a week)
        const previousRisk = await RiskScore.find({ studentId: student._id })
          .sort({ createdAt: -1 })
          .limit(2);

        if (previousRisk.length === 2 && previousRisk[1].score - previousRisk[0].score >= 15) {
          const existingAlert = await Alert.findOne({
            studentId: student._id,
            type: 'Rapid Decline',
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          });

          if (!existingAlert) {
            const alert = new Alert({
              studentId: student._id,
              mentorId: student.assignedMentorId?._id,
              type: 'Rapid Decline',
              message: `${student.userId.name} shows rapid risk increase (↑${(previousRisk[1].score - previousRisk[0].score).toFixed(0)} points)`,
              isRead: false,
            });
            await alert.save();
          }
        }

        // Recalculate risk scores
        await calculateRiskScore(student._id);
      }

      console.log('✅ Alert scheduler completed');
    } catch (error) {
      console.error('❌ Error in alert scheduler:', error);
    }
  });

  console.log('⏰ Alert scheduler started (runs daily at 2 AM)');
};

module.exports = { startAlertScheduler };
