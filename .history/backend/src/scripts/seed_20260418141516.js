require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const AcademicData = require('../models/AcademicData');
const Intervention = require('../models/Intervention');
const Alert = require('../models/Alert');
const RiskScore = require('../models/RiskScore');

const departments = ['Computer Engineering', 'Information Technology', 'Electronics'];
const semesters = [1, 2, 3, 4];
const subjects = {
  'Computer Engineering': [
    'Data Structures',
    'Algorithms',
    'Database Management',
    'Web Development',
    'Operating Systems',
  ],
  'Information Technology': [
    'Software Engineering',
    'Cloud Computing',
    'Data Science',
    'Cybersecurity',
    'Mobile App Development',
  ],
  Electronics: ['Digital Electronics', 'Signals & Systems', 'Microcontrollers', 'Communication Systems', 'Power Electronics'],
};

const interventionTypes = ['Counselling', 'Remedial Class', 'Assignment Extension', 'Parent Meeting', 'Extra Study Session'];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Subject.deleteMany({});
    await AcademicData.deleteMany({});
    await Intervention.deleteMany({});
    await Alert.deleteMany({});
    await RiskScore.deleteMany({});

    // Create admin users
    const coordinators = [];
    const mentors = [];
    const teachers = [];

    for (const dept of departments) {
      // Create 1 coordinator per department
      const coordinator = new User({
        name: `${dept} Coordinator`,
        email: `coordinator.${dept.toLowerCase().replace(/\s+/g, '')}@EDUGUARD.edu`,
        passwordHash: 'password123',
        role: 'Academic Coordinator',
        department: dept,
        isVerified: true,
      });
      await coordinator.save();
      coordinators.push(coordinator);

      // Create 1 mentor per department
      const mentor = new User({
        name: `${dept} Mentor`,
        email: `mentor.${dept.toLowerCase().replace(/\s+/g, '')}@EDUGUARD.edu`,
        passwordHash: 'password123',
        role: 'Faculty Mentor',
        department: dept,
        isVerified: true,
      });
      await mentor.save();
      mentors.push(mentor);

      // Create 3 teachers per department
      for (let i = 0; i < 3; i++) {
        const teacher = new User({
          name: `Teacher ${i + 1} - ${dept}`,
          email: `teacher${i + 1}.${dept.toLowerCase().replace(/\s+/g, '')}@EDUGUARD.edu`,
          passwordHash: 'password123',
          role: 'Subject Teacher',
          department: dept,
          isVerified: true,
        });
        await teacher.save();
        teachers.push(teacher);
      }
    }

    console.log('✅ Created admin users');

    // Create subjects
    const subjectMap = {};
    let teacherIndex = 0;

    for (const dept of departments) {
      for (const semester of semesters) {
        for (const subjectName of subjects[dept]) {
          const subject = new Subject({
            name: `${subjectName} (${dept} - Sem ${semester})`,
            teacherId: teachers[teacherIndex % teachers.length]._id,
            department: dept,
            semester,
            syllabus: [
              { unit: 'Unit 1', topics: ['Topic 1', 'Topic 2'], covered: true, examWeightage: 25 },
              { unit: 'Unit 2', topics: ['Topic 3', 'Topic 4'], covered: true, examWeightage: 25 },
              { unit: 'Unit 3', topics: ['Topic 5', 'Topic 6'], covered: false, examWeightage: 25 },
              { unit: 'Unit 4', topics: ['Topic 7', 'Topic 8'], covered: false, examWeightage: 25 },
            ],
          });
          await subject.save();
          subjectMap[`${dept}-${semester}`] = subjectMap[`${dept}-${semester}`] || [];
          subjectMap[`${dept}-${semester}`].push(subject._id);
          teacherIndex++;
        }
      }
    }

    console.log('✅ Created subjects');

    // Create students
    const allStudents = [];
    let studentIdCounter = 1000;

    for (const dept of departments) {
      for (const semester of semesters) {
        const className = `${dept}-Sem${semester}`;

        for (let i = 0; i < 30; i++) {
          const user = new User({
            name: `Student ${studentIdCounter}`,
            email: `student${studentIdCounter}@EDUGUARD.edu`,
            passwordHash: 'password123',
            role: 'Student',
            department: dept,
            isVerified: true,
          });
          await user.save();

          const student = new Student({
            userId: user._id,
            class: className,
            semester,
            department: dept,
            assignedMentorId: mentors.find((m) => m.department === dept)?._id,
            subjectIds: subjectMap[`${dept}-${semester}`] || [],
          });
          await student.save();
          allStudents.push(student);

          studentIdCounter++;
        }
      }
    }

    console.log(`✅ Created ${allStudents.length} students`);

    // Create academic data for each student
    for (const student of allStudents) {
      const subjectIds = student.subjectIds;

      for (const subjectId of subjectIds) {
        const academicData = new AcademicData({
          studentId: student._id,
          subjectId,
          attendance: Math.floor(Math.random() * 55) + 40, // 40-95
          totalClasses: 40,
          internalMarks: Math.floor(Math.random() * 60) + 30, // 30-90
          midTest1: Math.floor(Math.random() * 50) + 20,
          midTest2: Math.floor(Math.random() * 50) + 20,
          internalAssessment: Math.floor(Math.random() * 50) + 20,
          vivaMarks: Math.floor(Math.random() * 20) + 10,
          assignmentsPending: Math.floor(Math.random() * 6), // 0-5
          assignmentsTotal: 5,
          lmsLoginsPerWeek: Math.floor(Math.random() * 10) + 1, // 1-10
        });
        await academicData.save();
      }
    }

    console.log('✅ Created academic data');

    // Create interventions
    for (let i = 0; i < 15; i++) {
      const randomStudent = allStudents[Math.floor(Math.random() * allStudents.length)];
      const randomMentor = mentors.find((m) => m.department === randomStudent.department);

      const intervention = new Intervention({
        studentId: randomStudent._id,
        mentorId: randomMentor._id,
        type: interventionTypes[Math.floor(Math.random() * interventionTypes.length)],
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        remarks: 'Student showing improvement potential with focused intervention strategy.',
        outcomeExpected: 'Marks Recovery',
        followUpRequired: Math.random() > 0.5,
        followUpDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        preInterventionScore: Math.floor(Math.random() * 50) + 50,
      });
      await intervention.save();
    }

    console.log('✅ Created interventions');

    // Create risk scores
    for (const student of allStudents) {
      const riskScore = Math.floor(Math.random() * 100);
      let level = 'Low';
      if (riskScore >= 65) level = 'High';
      else if (riskScore >= 40) level = 'Medium';

      for (let week = 0; week < 8; week++) {
        const historicalScore = new RiskScore({
          studentId: student._id,
          score: Math.max(0, Math.min(100, riskScore + (Math.random() - 0.5) * 20)),
          level,
          attendanceRisk: Math.random() * 100,
          marksRisk: Math.random() * 100,
          assignmentRisk: Math.random() * 100,
          lmsRisk: Math.random() * 100,
          calculatedAt: new Date(Date.now() - (8 - week) * 7 * 24 * 60 * 60 * 1000),
        });
        await historicalScore.save();
      }
    }

    console.log('✅ Created risk scores');

    // Create alerts
    const highRiskStudents = allStudents.slice(0, 8);
    for (const student of highRiskStudents) {
      const mentor = mentors.find((m) => m.department === student.department);
      const alert = new Alert({
        studentId: student._id,
        mentorId: mentor?._id,
        type: 'High Risk',
        message: `Student ${student.userId.name} has been flagged as high risk with a score of 75.`,
        isRead: false,
      });
      await alert.save();
    }

    console.log('✅ Created alerts');

    console.log('🌱 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
