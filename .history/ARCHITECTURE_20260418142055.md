# AcadWatch - System Architecture

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Client Layer (React)                         │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────────┐       │
│  │   Landing    │  │    Login    │  │  Dashboards (4)  │       │
│  └──────────────┘  └─────────────┘  └──────────────────┘       │
│                         ↕ Axios                                  │
├─────────────────────────────────────────────────────────────────┤
│            API Layer (Express.js + Node.js)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐         │
│  │ Auth API │  │ Risk API │  │Alert API │  │Reports  │         │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘         │
│         ↓ JWT Authentication + RBAC                             │
├─────────────────────────────────────────────────────────────────┤
│      Business Logic Layer (Controllers + Services)              │
│  ┌─────────────┐  ┌────────────┐  ┌──────────────┐             │
│  │ Risk Engine │  │ Scheduler  │  │Auth Service  │             │
│  └─────────────┘  └────────────┘  └──────────────┘             │
├─────────────────────────────────────────────────────────────────┤
│          Data Access Layer (Mongoose ODM)                       │
│  ┌─────────┐  ┌───────┐  ┌───────────┐  ┌────────┐            │
│  │ User    │  │Risk   │  │Intervention│ │Alert   │            │
│  └─────────┘  └───────┘  └───────────┘  └────────┘            │
├─────────────────────────────────────────────────────────────────┤
│           Data Layer (MongoDB + Redis)                          │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │   MongoDB (8 cols)   │  │  Redis Cache (1hr)   │            │
│  └──────────────────────┘  └──────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Diagram

### Authentication Flow
```
User Input (Email/Password)
         ↓
    Validate Email
         ↓
    Check User Exists?
    ├─ NO → Create User + Generate OTP
    └─ YES → Verify Password
         ↓
    Send OTP via SMTP
         ↓
    User Enters OTP
         ↓
    Verify OTP Hash
         ↓
    Generate JWT Token
         ↓
    Store in localStorage
         ↓
    Redirect to Dashboard
```

### Risk Calculation Flow
```
New Academic Data Received
         ↓
    Fetch Student's Academic Records
         ↓
    Calculate Risk Factors:
    ├─ attendance_risk = ((75 - attendance%) / 75) × 100
    ├─ marks_risk = ((50 - avg_marks) / 50) × 100
    ├─ assignment_risk = (pending / total) × 100
    └─ lms_risk = ((5 - logins/week) / 5) × 100
         ↓
    Weighted Average:
    score = 0.40×att + 0.30×marks + 0.20×assign + 0.10×lms
         ↓
    Check Trend:
    3 consecutive increases → Flag "Declining"
         ↓
    Cache in Redis (1 hour)
         ↓
    Store in MongoDB
         ↓
    Trigger Alerts if:
    ├─ score >= 65 (High Risk)
    └─ score ↑ >= 15 (Rapid Decline)
```

### What-If Simulation Flow
```
User Adjusts Sliders (Attendance, Marks, Assignments)
         ↓
    Debounced API Call (500ms)
         ↓
    Backend receives: { attendance, assignmentsPending, marksImprovement }
         ↓
    Recalculate risk factors with new values
         ↓
    Compute simulated score
         ↓
    Compare with current score
         ↓
    Return delta + improvement indicator
         ↓
    Frontend shows instantly: "New Score: X (↓Y points)"
```

---

## 🗄️ Database Schema Design

### Collections Overview

```
Users (Auth)
├── _id: ObjectId
├── name: String
├── email: String (unique)
├── passwordHash: String (bcrypt)
├── role: Enum ['Student', 'Faculty Mentor', 'Subject Teacher', 'Academic Coordinator']
├── department: String
├── isVerified: Boolean
├── otpHash: String (SHA256)
├── otpExpiry: Date
└── timestamps: { createdAt, updatedAt }

Students (Student Records)
├── _id: ObjectId
├── userId: ObjectId (ref: User)
├── class: String (e.g., "CS-Sem2")
├── semester: Number
├── department: String
├── assignedMentorId: ObjectId (ref: User)
├── subjectIds: [ObjectId] (ref: Subject)
└── timestamps: { createdAt, updatedAt }

RiskScores (Historical Records)
├── _id: ObjectId
├── studentId: ObjectId (ref: Student)
├── score: Number (0-100)
├── level: Enum ['Low', 'Medium', 'High']
├── attendanceRisk: Number (weighted)
├── marksRisk: Number (weighted)
├── assignmentRisk: Number (weighted)
├── lmsRisk: Number (weighted)
├── trendFlag: String (null or "Consistently Declining")
├── calculatedAt: Date
└── timestamps: { createdAt, updatedAt }

AcademicData (Per Subject)
├── _id: ObjectId
├── studentId: ObjectId (ref: Student)
├── subjectId: ObjectId (ref: Subject)
├── attendance: Number (attended classes)
├── totalClasses: Number
├── internalMarks: Number (0-100)
├── midTest1: Number
├── midTest2: Number
├── internalAssessment: Number
├── vivaMarks: Number
├── assignmentsPending: Number
├── assignmentsTotal: Number
├── lmsLoginsPerWeek: Number
├── lastYearFinalMarks: Number
└── timestamps: { createdAt, updatedAt }

Interventions (Mentor Actions)
├── _id: ObjectId
├── studentId: ObjectId (ref: Student)
├── mentorId: ObjectId (ref: User)
├── type: Enum ['Counselling', 'Remedial Class', ...]
├── date: Date
├── remarks: String (≥20 chars)
├── outcomeExpected: String
├── followUpRequired: Boolean
├── followUpDate: Date
├── preInterventionScore: Number
├── postInterventionScore: Number (auto-calc after 14 days)
└── timestamps: { createdAt, updatedAt }

Alerts (Notifications)
├── _id: ObjectId
├── studentId: ObjectId (ref: Student)
├── mentorId: ObjectId (ref: User)
├── type: Enum ['High Risk', 'Rapid Decline', 'Pre-Exam', 'Assignment Due']
├── message: String
├── isRead: Boolean
├── linkedStudentId: ObjectId (for mentor alerts)
└── timestamps: { createdAt, updatedAt }

Subjects (Course Info)
├── _id: ObjectId
├── name: String
├── teacherId: ObjectId (ref: User)
├── department: String
├── semester: Number
├── syllabus: [{
│   ├── unit: String
│   ├── topics: [String]
│   ├── covered: Boolean
│   └── examWeightage: Number
│ }]
└── timestamps: { createdAt, updatedAt }

Assignments (Assignment Metadata)
├── _id: ObjectId
├── subjectId: ObjectId (ref: Subject)
├── title: String
├── dueDate: Date
├── totalMarks: Number
├── description: String
└── timestamps: { createdAt, updatedAt }

Submissions (Assignment Submissions)
├── _id: ObjectId
├── assignmentId: ObjectId (ref: Assignment)
├── studentId: ObjectId (ref: Student)
├── submittedAt: Date
├── status: Enum ['Submitted', 'Pending', 'Late']
├── marksObtained: Number
└── timestamps: { createdAt, updatedAt }
```

### Indexing Strategy
```javascript
// Frequently queried fields
db.users.createIndex({ email: 1 })
db.students.createIndex({ userId: 1, department: 1, semester: 1 })
db.riskscores.createIndex({ studentId: 1, calculatedAt: -1 })
db.academicdata.createIndex({ studentId: 1, subjectId: 1 })
db.interventions.createIndex({ studentId: 1, createdAt: -1 })
db.alerts.createIndex({ mentorId: 1, isRead: 1, createdAt: -1 })
```

---

## 🔐 Security Architecture

### Authentication & Authorization
```
User Login
  ↓
Validate Email Format (Regex)
  ↓
Hash Password (bcryptjs, 10 rounds)
  ↓
Generate JWT: { userId, email, role }
  ↓
Token stored in localStorage
  ↓
RBAC Middleware checks user.role on protected routes
  ↓
Error responses for unauthorized access
```

### Data Protection
- **Passwords**: bcryptjs hashing (10 salt rounds)
- **OTP**: SHA256 hash (never stored plain)
- **JWT**: HS256 signing with secret key
- **HTTPS**: Enforced in production (helmet.js)
- **CORS**: Origin whitelist
- **Request Logging**: Morgan middleware logs all requests

---

## ⚡ Performance Optimization

### Caching Strategy
```
Redis Cache Layer
├── risk:{studentId} → Risk score (1 hour TTL)
├── alerts:{mentorId} → Unread alerts (30 min TTL)
└── dashboard:{userId} → Dashboard data (15 min TTL)
```

### Database Optimization
- **Indexes**: All frequently queried fields indexed
- **Pagination**: 10 rows per table by default
- **Lazy Loading**: Dashboard sections load independently
- **Aggregation Pipeline**: Used for complex queries (coordinator stats)

### Frontend Optimization
- **Code Splitting**: Lazy load pages on route change
- **Debouncing**: What-if simulator (500ms debounce)
- **Shimmer Skeleton**: Loading placeholders instead of spinners
- **Responsive Images**: Optimized for desktop/tablet
- **React.memo**: Prevents unnecessary re-renders

---

## 🔄 Background Jobs

### Alert Scheduler (Daily at 2 AM)
```javascript
FOR EACH STUDENT:
  1. Check if risk_score >= 65
     → Create HIGH_RISK alert
     → Send mentor email
  
  2. Check if score increased >= 15 points in 1 week
     → Create RAPID_DECLINE alert
  
  3. Check if pre-exam date is 14 days away
     → Create PRE_EXAM alert for all Medium/High risk students
  
  4. Recalculate all risk scores
```

### Intervention Follow-Up (Every 14 days)
```javascript
FOR EACH INTERVENTION marked followUpRequired:
  IF 14 days have passed since intervention:
    1. Fetch current risk score
    2. Calculate delta: pre_score - current_score
    3. Mark as "Improved" if delta > 0
    4. Update postInterventionScore in DB
```

---

## 📊 Data Flow Examples

### Example 1: Student Checks Risk Score
```
Frontend: Click "Dashboard"
    ↓
API: GET /api/risk/students/:id/risk
    ↓
Backend:
  1. Check Redis cache (risk:{studentId})
  2. If not found:
     a. Fetch academicData from MongoDB
     b. Calculate risk score using formula
     c. Save to RiskScore collection
     d. Cache in Redis for 1 hour
  3. Return { score, level, breakdown, history }
    ↓
Frontend: Render gauge + breakdown cards + graph
```

### Example 2: Mentor Logs Intervention
```
Frontend: Submit intervention form
    ↓
Validation: Check remarks length >= 20 chars
    ↓
API: POST /api/interventions
    ↓
Backend:
  1. Get current risk score (preInterventionScore)
  2. Save intervention to MongoDB
  3. Clear risk cache for this student
  4. Send email to student
  5. Schedule follow-up check for 14 days later
    ↓
Frontend: Show success toast, refresh interventions list
```

### Example 3: Teacher Uploads Marks
```
Frontend: Drop CSV file
    ↓
API: POST /api/marks/upload { file, subjectId }
    ↓
Backend:
  1. Parse CSV into records
  2. FOR EACH RECORD:
     a. Find student by ID
     b. Update/create AcademicData
     c. Recalculate risk score
     d. Clear risk cache
  3. Return { recordsProcessed: 35 }
    ↓
API: POST /api/risk/simulate (auto-triggered)
    ↓
MongoDB: New RiskScores created
    ↓
Frontend: Show "35 records uploaded" confirmation
    ↓
Scheduler: High-risk alerts sent if score crossed 65
```

---

## 🚀 Scalability Considerations

### Horizontal Scaling
- **Stateless API**: Each request can go to any server
- **Database**: MongoDB scalable via sharding
- **Cache**: Redis Cluster for distributed caching
- **Load Balancer**: Nginx/HAProxy in front

### Performance Bottlenecks
- **Risk Calculation**: O(n) for n subjects
  - Solution: Async calculation + background jobs
- **Alert Sending**: 360+ emails daily
  - Solution: Queue system (Bull/RabbitMQ)
- **Dashboard Queries**: Multiple aggregations
  - Solution: Pre-computed snapshots every hour

### Recommended Optimizations for Production
1. **ElasticSearch**: For full-text search on student names
2. **Message Queue**: For async email/notification sending
3. **CDN**: For static assets (CSS, JS, images)
4. **Database Replication**: MongoDB replica set
5. **API Rate Limiting**: Prevent abuse
6. **APM (New Relic, Datadog)**: Monitor performance

---

## 🔌 Integration Points

### Third-Party Services
- **SMTP Service**: Nodemailer (email delivery)
- **Payment** (future): Stripe for premium features
- **Analytics** (future): Mixpanel/Amplitude
- **Storage** (future): AWS S3 for PDFs/CSVs

### Extension Hooks
```javascript
// Custom risk calculation weights
const WEIGHTS = {
  attendance: 0.40,      // Easily customizable
  marks: 0.30,
  assignments: 0.20,
  lms: 0.10,
};

// Add new alert types
const ALERT_TYPES = ['High Risk', 'Rapid Decline', 'Pre-Exam', 'Custom'];

// Add new intervention types
const INTERVENTIONS = ['Counselling', 'Remedial', 'Custom'];
```

---

## 📖 Design Patterns Used

| Pattern | Usage | Benefit |
|---------|-------|---------|
| **MVC** | Controllers, Models, Views | Separation of concerns |
| **Factory** | UserFactory, RiskFactory | Consistent object creation |
| **Observer** | Alert system | Decoupled event handling |
| **Strategy** | Multiple risk algorithms | Flexible calculations |
| **Singleton** | Database connection | Single instance reuse |
| **Service Locator** | API service | Centralized API calls |
| **Repository** | Mongoose models | Data access abstraction |

---

**The architecture is designed for:**
- ✅ Scalability (horizontal scaling via stateless design)
- ✅ Maintainability (clear separation of concerns)
- ✅ Testability (decoupled services)
- ✅ Extensibility (easy to add features)
- ✅ Performance (caching, indexing, async jobs)
