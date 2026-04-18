# 🎓 eduguard - Early Academic Risk Detection & Student Intervention Platform

A **hackathon-winning, production-quality full-stack web application** for universities and colleges to predict, detect, and prevent academic failure through AI-powered risk scoring and intelligent intervention tracking.

## 🌟 Features

### 🎯 Core Capabilities
- **AI Risk Prediction**: Advanced scoring engine calculating real-time risk scores (0-100)
- **Early Warning System**: Automated alerts via email and dashboard notifications
- **Personalized Action Plans**: Task-based intervention recommendations with quantified impact
- **What-If Simulation**: Interactive scenario modeling to project future scores
- **Intervention Tracking**: Monitor intervention effectiveness with before/after metrics
- **Institution Analytics**: System-wide insights and systemic issue detection

### 🔐 Multi-Role Access
- **Students**: Personal dashboard with risk breakdown, action plans, and progress tracking
- **Faculty Mentors**: View at-risk students, log interventions, track effectiveness
- **Subject Teachers**: Upload marks/attendance, manage student performance by subject
- **Academic Coordinators**: Institution-wide analytics, reports, and systemic issue detection

### 📊 Advanced Features
- Real-time risk score calculations with Redis caching
- Weekly risk history tracking (8-week trend visualization)
- Automated alert system with SMTP email notifications
- OTP-based email verification
- JWT token-based authentication
- Role-based access control (RBAC)
- PDF and CSV export functionality
- Responsive design (desktop & tablet)

---

## 🏗️ Tech Stack

### 📱 Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Charts**: Recharts, Chart.js, D3.js
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: Lucide React

### 🖥️ Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Authentication**: JWT + OTP
- **Email**: Nodemailer (SMTP)
- **ML**: TensorFlow.js (pattern detection)
- **Scheduling**: node-cron (background jobs)

### 🗄️ Database Schema
- **Users**: Authentication & role management
- **Students**: Student profiles & enrollments
- **RiskScores**: Weekly risk calculations with history
- **AcademicData**: Subject-specific performance metrics
- **Interventions**: Logged mentoring activities
- **Alerts**: Push notifications & alerts
- **Subjects**: Course information & syllabus
- **Assignments**: Assignment definitions & submissions

---

## 📋 Risk Scoring Formula

```
Risk Score = (0.40 × attendance_risk) + (0.30 × marks_risk) + (0.20 × assignment_risk) + (0.10 × lms_risk)

Where:
- attendance_risk = ((75 - attendance_percentage) / 75) × 100, clamped 0-100
- marks_risk = ((50 - avg_internal_marks) / 50) × 100, clamped 0-100
- assignment_risk = (pending_assignments / total_assignments) × 100, clamped 0-100
- lms_risk = ((5 - lms_logins_per_week) / 5) × 100, clamped 0-100

Risk Levels:
- 0-39   → Low Risk (Green)
- 40-64  → Medium Risk (Amber)
- 65-100 → High Risk (Red)
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v16+
- MongoDB (local or cloud)
- Redis (local or cloud)
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your MongoDB URI, Redis URL, SMTP credentials, etc.
nano .env

# Start MongoDB and Redis (if local)
# In separate terminals:
mongod
redis-server

# Seed database with sample data
npm run seed

# Start server (will auto-seed if database is empty)
npm run dev
# Backend runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF

# Start React app
npm start
# Frontend runs on http://localhost:3000
```

---

## 🔑 Demo Credentials

All demo users use the same password for easy testing:

**Password**: `password123`

### Available Accounts (auto-created on first login):
- **Student**: `student123@acadwatch.edu` → Goes to `/student/dashboard`
- **Mentor**: `mentor.computerengineering@acadwatch.edu` → Goes to `/mentor/dashboard`
- **Teacher**: `teacher1.computerengineering@acadwatch.edu` → Goes to `/teacher/dashboard`
- **Coordinator**: `coordinator.computerengineering@acadwatch.edu` → Goes to `/coordinator/dashboard`

Or create new accounts with any email during first login!

---

## 📱 API Endpoints

### Authentication
```
POST   /api/auth/login              - Login user
POST   /api/auth/verify-otp         - Verify OTP
POST   /api/auth/forgot-password    - Send password reset link
```

### Risk Scoring
```
GET    /api/risk/students/:id/risk       - Get current risk score
GET    /api/risk/students/:id/history    - Get 8-week risk history
POST   /api/risk/simulate                - What-if simulation
```

### Interventions
```
POST   /api/interventions           - Log new intervention
GET    /api/interventions/:studentId - Get student interventions
```

### Alerts
```
GET    /api/alerts/unread           - Get unread alerts for mentor
PATCH  /api/alerts/:id/read         - Mark alert as read
PATCH  /api/alerts/read-all         - Mark all as read
```

### Coordinator
```
GET    /api/coordinator/summary     - Institution summary stats
GET    /api/coordinator/systemic-issues - Detect systemic issues
```

### Reports
```
GET    /api/reports/pdf/:studentId  - Generate student PDF report
GET    /api/reports/csv             - Export all data as CSV
```

### Health
```
GET    /api/health                  - Server health check
```

---

## 📊 Dashboard Pages

### 🎓 Student Dashboard
- **Components**:
  - Circular risk score gauge with color coding
  - Risk breakdown by factor (Attendance, Marks, Assignments, LMS)
  - Personalized action plan with completion tracking
  - What-if simulation panel with live score projection
  - 8-week risk trend line chart
  - Tabbed academic data (Subjects, Assignments, Attendance, Marks)
  - Intervention history timeline
  - Real-time alert notifications

### 👥 Faculty Mentor Dashboard
- **Components**:
  - Summary stats (Total Students, High Risk, Interventions)
  - Right-side alert panel with high-risk students
  - Filterable at-risk student table
  - Student detail modal with full breakdown
  - Intervention logging form with validation
  - Intervention effectiveness summary
  - AI-generated plain English explanations per student

### 📚 Subject Teacher Dashboard
- **Components**:
  - Subject selector dropdown
  - CSV upload + manual inline spreadsheet entry
  - Upload history tracking
  - Class analytics (avg marks, completion rate, at-risk count)
  - Performance heatmap
  - Marks distribution bar chart
  - Assignment completion pie chart
  - Weak topic detection
  - Student performance table

### 🏫 Academic Coordinator Dashboard
- **Components**:
  - Department/Semester filters with date range
  - Institution summary cards
  - Risk distribution by department (stacked bar)
  - 12-week institution trend line
  - Intervention type breakdown (pie)
  - Top 5 at-risk subjects chart
  - Systemic issue detection cards
  - PDF report download
  - CSV data export

---

## 🎨 Design System

### Color Palette
```
Sidebar Background:     #0F172A (Deep Navy)
Main Background:        #F8FAFC (Light)
Primary Accent:         #6366F1 (Indigo)
High Risk:             #EF4444 (Red)
Medium Risk:           #F59E0B (Amber)
Low Risk:              #22C55E (Green)
Card Background:       White (#FFFFFF)
```

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: 12px → 48px
- **Weights**: 400, 500, 600, 700

### Components
- Loading: Skeleton shimmer placeholders
- Modals: Close on Escape + outside click
- Forms: Client-side validation with inline errors
- Tables: Sortable columns, hover highlight, 10-row pagination
- Charts: Hover tooltips, legends, responsive sizing

---

## 🗄️ Seed Data

The application seeds 360+ realistic student records on first start:

- **3 Departments**: Computer Engineering, IT, Electronics
- **4 Semesters** per department
- **30 Students** per class
- **5 Subjects** per class
- **Realistic Data**:
  - Attendance: 40-95%
  - Marks: 30-90
  - Pending Assignments: 0-5
  - LMS Logins: 1-10 per week
- **4 Faculty Mentors** (1 per department)
- **3 Subject Teachers** per department
- **1 Academic Coordinator**
- **15 Pre-logged Interventions** with before/after scores
- **8 Pre-triggered High-Risk Alerts**
- **10 Weeks** of historical risk data per student

---

## 🔄 Automated Features

### Daily Background Job (node-cron)
- Detects students crossing into High Risk (score ≥ 65)
- Sends SMTP alerts to assigned mentors
- Flags "Rapid Decline" when score increases ≥ 15 points
- Pre-exam alerts for at-risk students

### Real-Time Features
- Alert badge count on navbar (polls every 30 seconds)
- Instantaneous what-if simulation calculations
- Risk score recalculation on data uploads
- Intervention effectiveness tracking (14-day post-intervention)

---

## 🔐 Security Features

- JWT-based authentication with 7-day expiry
- OTP verification for email confirmation
- Role-based access control (RBAC) middleware
- Password hashing with bcryptjs
- CORS enabled for frontend origin
- Request logging with Morgan
- Helmet for HTTP security headers

---

## 📦 Project Structure

```
EDUGUARD/
├── backend/
│   ├── src/
│   │   ├── index.js                 # Express server entry
│   │   ├── routes/                  # API route handlers
│   │   │   ├── auth.js
│   │   │   ├── risk.js
│   │   │   ├── interventions.js
│   │   │   ├── alerts.js
│   │   │   ├── coordinator.js
│   │   │   └── reports.js
│   │   ├── controllers/             # Business logic
│   │   ├── models/                  # Mongoose schemas
│   │   ├── middleware/              # Auth, errors, logging
│   │   ├── services/                # Risk engine, email
│   │   ├── config/                  # Database, email config
│   │   ├── utils/                   # Helpers
│   │   └── scripts/                 # Seed data
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── index.js                 # React root
│   │   ├── App.js                   # Main app with routing
│   │   ├── pages/                   # Page components
│   │   │   ├── Landing.js
│   │   │   ├── Login.js
│   │   │   ├── StudentDashboard.js
│   │   │   ├── MentorDashboard.js
│   │   │   ├── TeacherDashboard.js
│   │   │   └── CoordinatorDashboard.js
│   │   ├── components/              # Reusable components
│   │   │   ├── DashboardLayout.js
│   │   │   └── PrivateRoute.js
│   │   ├── services/                # API & auth
│   │   │   ├── api.js
│   │   │   └── authContext.js
│   │   ├── hooks/                   # Custom hooks
│   │   ├── utils/                   # Helpers
│   │   └── index.css                # Global styles
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── .env
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── jsconfig.json
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB
mongod --dbpath /path/to/data
```

### Redis Connection Error
```bash
# Start Redis
redis-server
```

### CORS Issues
- Ensure `frontend` URL matches CORS origin in `backend/src/index.js`
- Check `.env` `REACT_APP_API_URL` matches backend URL

### Email Not Sending
- Verify SMTP credentials in `.env`
- For Gmail: Use [App Passwords](https://myaccount.google.com/apppasswords)
- Check `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

### OTP Not Appearing
- Check backend console for email errors
- Verify email is being sent (check spam folder)

---

## 🎯 Future Enhancements

- [ ] **WebSocket** integration for real-time alerts
- [ ] **Advanced ML Models** (LSTM, XGBoost) for risk prediction
- [ ] **Mobile App** (React Native)
- [ ] **Parent Portal** for guardians
- [ ] **Video Consultations** with mentors
- [ ] **Peer Learning Groups** matching
- [ ] **Advanced NLP** for parsing text-based feedback
- [ ] **Predictive Analytics** for course recommendations
- [ ] **Cloud Deployment** (AWS, Azure, GCP)
- [ ] **Multi-language Support**

---

## 📄 License

MIT License - Built for educational excellence.

---

## 👥 Contributing

Contributions welcome! Please submit pull requests with:
- Clear commit messages
- Updated documentation
- Test coverage (where applicable)

---

## 🏆 Built for Hackathons

This application is a **production-quality prototype** designed to win hackathons. All features are fully functional, visually impressive, and demo-ready.

**Key Highlights**:
- ✅ Complete end-to-end implementation
- ✅ Realistic production data
- ✅ Beautiful, responsive UI
- ✅ Comprehensive feature set
- ✅ Real-time capabilities
- ✅ Extensible architecture

---

## 📞 Support

For issues, questions, or feature requests, please open an issue or contact the development team.

**Happy Academic Success! 🎓**
