const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    submittedAt: { type: Date },
    status: {
      type: String,
      enum: ['Submitted', 'Pending', 'Late'],
      default: 'Pending',
    },
    marksObtained: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
