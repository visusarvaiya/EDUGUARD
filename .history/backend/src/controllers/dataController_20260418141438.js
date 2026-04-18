const AcademicData = require('../models/AcademicData');
const RiskScore = require('../models/RiskScore');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const csv = require('csv-parser');
const { Readable } = require('stream');

const uploadMarks = async (req, res) => {
  try {
    const { subjectId } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const records = [];
    const stream = Readable.from([req.file.buffer.toString()]);

    stream
      .pipe(csv())
      .on('data', (row) => {
        records.push(row);
      })
      .on('end', async () => {
        try {
          for (const record of records) {
            const student = await Student.findOne({ class: record.StudentID });
            if (student) {
              let academicData = await AcademicData.findOne({
                studentId: student._id,
                subjectId,
              });

              if (!academicData) {
                academicData = new AcademicData({
                  studentId: student._id,
                  subjectId,
                });
              }

              academicData.internalMarks = parseFloat(record.Marks) || 0;
              academicData.assignmentsPending = 
                record['Assignment Status'] === 'Pending' ? 1 : 0;
              academicData.lmsLoginsPerWeek = parseFloat(record['LMS Logins']) || 0;

              await academicData.save();

              // Recalculate risk
              const { calculateRiskScore } = require('../services/riskEngine');
              await calculateRiskScore(student._id);
            }
          }

          res.status(200).json({ message: 'Marks uploaded successfully', recordsProcessed: records.length });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const manualUpdate = async (req, res) => {
  try {
    const { academicDataUpdates } = req.body; // Array of updates

    for (const update of academicDataUpdates) {
      const academicData = await AcademicData.findByIdAndUpdate(
        update._id,
        {
          internalMarks: update.internalMarks,
          assignmentsPending: update.assignmentsPending,
          lmsLoginsPerWeek: update.lmsLoginsPerWeek,
        },
        { new: true }
      );

      if (academicData) {
        const { calculateRiskScore } = require('../services/riskEngine');
        await calculateRiskScore(academicData.studentId);
      }
    }

    res.status(200).json({ message: 'Data updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadMarks, manualUpdate };
