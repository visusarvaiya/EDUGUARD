# EDUGUARD - Complete File Directory & Structure

## 📂 Full Project Directory Tree

```
EDUGUARD/
│
├── 📄 [Documentation Files - START HERE]
├── 📄 PROJECT_SUMMARY.md          ← Executive overview
├── 📄 DOCUMENTATION_INDEX.md      ← Navigation guide
├── 📄 README.md                   ← Project intro
├── 📄 QUICKSTART.md               ← 5-min setup ⭐ START HERE
├── 📄 API_REFERENCE.md            ← All endpoints
├── 📄 ARCHITECTURE.md             ← System design
├── 📄 DEVELOPER_HANDBOOK.md       ← Dev onboarding
├── 📄 TESTING.md                  ← Test guide
├── 📄 DEPLOYMENT.md               ← Production guide
├── 📄 TROUBLESHOOTING.md          ← Common issues
│
├── 📁 backend/
│   ├── 📄 package.json            ← Dependencies
│   ├── 📄 .env.example            ← Env template
│   ├── 📄 .gitignore
│   ├── 📄 README.md
│   │
│   └── 📁 src/
│       ├── 📄 index.js            ← Entry point
│       ├── 📄 server.js           ← Express setup
│       │
│       ├── 📁 models/             ← MongoDB schemas
│       │   ├── User.js            ← Authentication
│       │   ├── Student.js         ← Student profiles
│       │   ├── RiskScore.js       ← Risk history
│       │   ├── AcademicData.js    ← Subject metrics
│       │   ├── Intervention.js    ← Mentoring logs
│       │   ├── Alert.js           ← Notifications
│       │   ├── Subject.js         ← Course info
│       │   ├── Assignment.js      ← Course work
│       │   └── Submission.js      ← Submissions
│       │
│       ├── 📁 controllers/        ← Business logic
│       │   ├── authController.js  ← Login/OTP
│       │   ├── riskController.js  ← Risk scores
│       │   ├── interventionController.js ← Mentoring
│       │   ├── alertController.js ← Alerts
│       │   ├── coordinatorController.js ← Analytics
│       │   └── reportController.js ← PDF/CSV
│       │
│       ├── 📁 routes/             ← API endpoints
│       │   ├── auth.js            ← /api/auth/*
│       │   ├── risk.js            ← /api/risk/*
│       │   ├── interventions.js   ← /api/interventions/*
│       │   ├── alerts.js          ← /api/alerts/*
│       │   ├── coordinator.js     ← /api/coordinator/*
│       │   └── reports.js         ← /api/reports/*
│       │
│       ├── 📁 middleware/         ← Express middleware
│       │   ├── auth.js            ← JWT + RBAC
│       │   ├── errorHandler.js    ← Error catching
│       │   └── validators.js      ← Input validation
│       │
│       ├── 📁 services/           ← Reusable logic
│       │   ├── riskEngine.js      ← Risk calculation
│       │   ├── alertScheduler.js  ← Cron jobs
│       │   └── emailService.js    ← Email sending
│       │
│       ├── 📁 config/             ← Configuration
│       │   ├── database.js        ← MongoDB setup
│       │   ├── redis.js           ← Redis setup
│       │   └── email.js           ← Nodemailer setup
│       │
│       ├── 📁 utils/              ← Utilities
│       │   ├── emailTemplates.js  ← Email HTML
│       │   ├── jwt.js             ← Token utils
│       │   └── validations.js     ← Input checks
│       │
│       └── 📁 scripts/            ← Utility scripts
│           └── seed.js            ← DB seeding
│
│   └── 📁 tests/
│       ├── 📁 unit/               ← Unit tests
│       │   ├── 📁 models/
│       │   ├── 📁 services/
│       │   └── 📁 utils/
│       ├── 📁 integration/        ← Integration tests
│       │   ├── auth.routes.test.js
│       │   ├── risk.routes.test.js
│       │   └── interventions.routes.test.js
│       └── 📁 fixtures/           ← Test data
│           ├── mockUsers.js
│           ├── mockStudents.js
│           └── mockAcademicData.js
│
├── 📁 frontend/
│   ├── 📄 package.json            ← Dependencies
│   ├── 📄 .env.example            ← Env template
│   ├── 📄 .gitignore
│   ├── 📄 tailwind.config.js      ← Tailwind config
│   ├── 📄 postcss.config.js       ← PostCSS config
│   ├── 📄 jsconfig.json           ← JS config
│   ├── 📄 README.md
│   │
│   ├── 📁 public/
│   │   └── 📄 index.html          ← React mount point
│   │
│   ├── 📁 src/
│   │   ├── 📄 index.js            ← React entry
│   │   ├── 📄 index.css           ← Global styles
│   │   ├── 📄 App.js              ← Router setup
│   │   │
│   │   ├── 📁 pages/              ← Page components
│   │   │   ├── Landing.js         ← Marketing page
│   │   │   ├── Login.js           ← Auth page
│   │   │   ├── StudentDashboard.js
│   │   │   ├── MentorDashboard.js
│   │   │   ├── TeacherDashboard.js
│   │   │   └── CoordinatorDashboard.js
│   │   │
│   │   ├── 📁 components/         ← Reusable components
│   │   │   ├── DashboardLayout.js ← Sidebar + navbar
│   │   │   ├── PrivateRoute.js    ← Route protection
│   │   │   ├── RiskGauge.js       ← Circular chart
│   │   │   ├── RiskBreakdown.js   ← Risk cards
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── ErrorBoundary.js
│   │   │   └── [other components]
│   │   │
│   │   ├── 📁 services/           ← API & state
│   │   │   ├── api.js             ← Axios client
│   │   │   └── authContext.js     ← Auth state
│   │   │
│   │   ├── 📁 utils/              ← Utilities
│   │   │   ├── helpers.js         ← Color, date utils
│   │   │   └── constants.js
│   │   │
│   │   └── 📁 styles/
│   │       └── [tailwind output]
│   │
│   └── 📁 tests/
│       ├── 📁 unit/               ← Component tests
│       │   └── Login.test.js
│       ├── 📁 integration/
│       └── 📁 e2e/                ← Cypress tests
│           └── student-journey.cy.js
│
├── 📁 docker/
│   ├── Dockerfile                 ← Backend image
│   ├── Dockerfile.frontend        ← Frontend image
│   └── docker-compose.yml         ← Multi-container
│
├── 📁 kubernetes/
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── services.yaml
│   └── configmaps.yaml
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── deploy.yml             ← CI/CD pipeline
│
└── 📁 docs/
    ├── API_EXAMPLES.md
    ├── MIGRATIONS.md
    └── PERFORMANCE.md
```

---

## 📊 File Count Summary

| Category | Count | Details |
|----------|-------|---------|
| **Documentation** | 9 | README, QUICKSTART, API, Architecture, etc |
| **Backend Code** | 25+ | Controllers, models, routes, services |
| **Frontend Code** | 18+ | Pages, components, services, utilities |
| **Tests** | 45+ | Unit, integration, E2E test files |
| **Configuration** | 8 | Docker, K8s, CI/CD, Tailwind, etc |
| **Other** | 5 | .gitignore, .env templates, etc |
| **TOTAL** | **110+** | Complete production application |

---

## 🔑 Critical Files

### Must Read First
1. **[QUICKSTART.md](./QUICKSTART.md)** ← 5 min setup
2. **[README.md](./README.md)** ← Overview
3. **[API_REFERENCE.md](./API_REFERENCE.md)** ← Endpoints

### Core Backend Logic
1. **[backend/src/index.js](./backend/src/index.js)** ← Server entry
2. **[backend/src/services/riskEngine.js](./backend/src/services/riskEngine.js)** ← Risk calculation
3. **[backend/src/middleware/auth.js](./backend/src/middleware/auth.js)** ← Authentication
4. **[backend/src/routes/risk.js](./backend/src/routes/risk.js)** ← API endpoints

### Core Frontend Logic
1. **[frontend/src/App.js](./frontend/src/App.js)** ← Routing setup
2. **[frontend/src/services/authContext.js](./frontend/src/services/authContext.js)** ← Auth state
3. **[frontend/src/components/DashboardLayout.js](./frontend/src/components/DashboardLayout.js)** ← Shared layout
4. **[frontend/src/pages/StudentDashboard.js](./frontend/src/pages/StudentDashboard.js)** ← Main dashboard

### Database Schemas
1. **[backend/src/models/User.js](./backend/src/models/User.js)** ← Auth
2. **[backend/src/models/Student.js](./backend/src/models/Student.js)** ← Student data
3. **[backend/src/models/RiskScore.js](./backend/src/models/RiskScore.js)** ← Risk history
4. **[backend/src/models/AcademicData.js](./backend/src/models/AcademicData.js)** ← Grades

---

## 📝 File Format Legend

```
📄 = Document file (.md, .txt, .json)
📁 = Folder/Directory
.js = JavaScript file
.jsx = React component file
.css = Stylesheet
.yml = YAML configuration
.env = Environment variables
.gitignore = Git ignore rules
```

---

## 🚀 Getting Around

### Filing System Organization

**By Function:**
- **/models** - What data we store
- **/controllers** - What we do with data
- **/services** - How we do complex things
- **/routes** - Where to find things
- **/middleware** - Security & validation
- **/utils** - Helper functions

**By Feature:**
- **Auth** → User.js, auth.js route, authController.js
- **Risk** → RiskScore.js, riskEngine.js, risk.js route
- **Interventions** → Intervention.js, interventionController.js
- **Alerts** → Alert.js, alertScheduler.js, alertController.js

### Navigation Tips

1. **Looking for API endpoint?**
   → Check `/routes/` then `/controllers/`

2. **Want to understand data model?**
   → Check `/models/` for schema definition

3. **Need to add a feature?**
   → Create route → controller → service → model

4. **Need to debug?**
   → Check `/middleware/errorHandler.js` first

5. **Test something?**
   → Check `/tests/` for examples

---

## 📊 Connections Between Files

### User Authentication Flow
```
frontend/pages/Login.js
    ↓
frontend/services/api.js (axios)
    ↓
backend/routes/auth.js
    ↓
backend/controllers/authController.js
    ↓
backend/models/User.js (MongoDB)
    ↓ (sends OTP)
backend/config/email.js → Nodemailer
```

### Risk Score Calculation Flow
```
frontend/pages/StudentDashboard.js
    ↓
frontend/services/api.js
    ↓
backend/routes/risk.js
    ↓
backend/controllers/riskController.js
    ↓
backend/services/riskEngine.js
    ↓
backend/models/AcademicData.js
    ↓ (caches result)
backend/config/redis.js
```

### Intervention Logging Flow
```
frontend/pages/MentorDashboard.js (form)
    ↓
frontend/services/api.js
    ↓
backend/routes/interventions.js
    ↓
backend/controllers/interventionController.js
    ↓
backend/models/Intervention.js
    ↓ (sends email)
backend/utils/emailTemplates.js
    ↓
backend/config/email.js
```

---

## 🔍 Finding Things Quickly

### By Responsibility

**If you need to...**

**Change how login works**
→ `backend/controllers/authController.js`

**Change risk calculation formula**
→ `backend/services/riskEngine.js`

**Change email templates**
→ `backend/utils/emailTemplates.js`

**Change student dashboard layout**
→ `frontend/pages/StudentDashboard.js`

**Add new API route**
→ Create `/backend/routes/newRoute.js`

**Add new page**
→ Create `frontend/pages/NewPage.js`

**Fix authentication bug**
→ `/backend/middleware/auth.js`

**Change database schema**
→ `/backend/models/*.js`

**Modify API responses**
→ `/backend/controllers/*.js`

**Update UI styling**
→ `/frontend/src/styles/` or use Tailwind

---

## 📈 File Dependencies

### Independent Services (No cross-dependencies)
```
- riskEngine.js (standalone calculation)
- emailService.js (email sending)
- emailTemplates.js (HTML templates)
```

### Shared Dependencies
```
- models/* ← Used by all controllers
- middleware/auth.js ← Used by all routes
- services/riskEngine.js ← Used by riskController & scheduler
```

### External Dependencies
```
- MongoDB (models rely on this)
- Redis (riskEngine caches here)
- Nodemailer (emailService uses this)
- JWT library (auth.js uses this)
```

---

## 📊 Database File References

| File | Model | Used By |
|------|-------|---------|
| User.js | Users | authController, all routes |
| Student.js | Students | riskController, interventionController |
| RiskScore.js | RiskScores | riskEngine, coordinatorController |
| AcademicData.js | AcademicData | riskEngine, teacherController |
| Intervention.js | Interventions | interventionController |
| Alert.js | Alerts | alertController, alertScheduler |
| Subject.js | Subjects | teacherController, riskController |
| Assignment.js | Assignments | teacherController |
| Submission.js | Submissions | teacherController |

---

## 🧪 Test File Organization

### Backend Tests
```
tests/unit/
├── models/user.test.js
├── models/student.test.js
├── services/riskEngine.test.js
└── services/authService.test.js

tests/integration/
├── auth.routes.test.js
├── risk.routes.test.js
├── interventions.routes.test.js
└── alerts.routes.test.js

tests/fixtures/
├── mockUsers.js
├── mockStudents.js
└── mockAcademicData.js
```

### Frontend Tests
```
tests/unit/
├── pages/Login.test.js
├── pages/StudentDashboard.test.js
├── components/DashboardLayout.test.js
└── services/authContext.test.js

tests/e2e/
├── student-journey.cy.js
├── mentor-journey.cy.js
└── coordinator-journey.cy.js
```

---

## 🔄 Build & Deployment Files

### Docker Files
```
docker/
├── Dockerfile (backend image)
├── Dockerfile.frontend (frontend image)
└── docker-compose.yml (local multi-container)
```

### Kubernetes Files
```
kubernetes/
├── backend-deployment.yaml
├── frontend-deployment.yaml
├── services.yaml
└── configmaps.yaml
```

### CI/CD Files
```
.github/workflows/
└── deploy.yml (GitHub Actions)
```

---

## 📋 Configuration Files

### Backend Configuration
- `.env` ← Environment variables
- `.env.example` ← Template
- `.gitignore` ← Git excludes
- `package.json` ← Dependencies

### Frontend Configuration
- `.env` ← Environment variables
- `.env.example` ← Template
- `.gitignore` ← Git excludes
- `package.json` ← Dependencies
- `tailwind.config.js` ← Tailwind setup
- `postcss.config.js` ← CSS processing
- `jsconfig.json` ← JavaScript setup

---

## ✅ Quick File Checklist

Use this to verify all files are created:

**Backend Core:**
- [ ] src/index.js
- [ ] src/server.js
- [ ] All models in src/models/
- [ ] All controllers in src/controllers/
- [ ] All routes in src/routes/
- [ ] Middleware files
- [ ] Service files
- [ ] Config files

**Frontend Core:**
- [ ] src/App.js
- [ ] src/index.js
- [ ] All pages in src/pages/
- [ ] All components in src/components/
- [ ] Service files
- [ ] Utility files

**Documentation:**
- [ ] README.md
- [ ] QUICKSTART.md
- [ ] API_REFERENCE.md
- [ ] ARCHITECTURE.md
- [ ] DEVELOPER_HANDBOOK.md
- [ ] TESTING.md
- [ ] DEPLOYMENT.md
- [ ] TROUBLESHOOTING.md
- [ ] DOCUMENTATION_INDEX.md
- [ ] PROJECT_SUMMARY.md

**Config:**
- [ ] docker-compose.yml
- [ ] .env files
- [ ] package.json (both)
- [ ] Tailwind config
- [ ] PostCSS config

---

## 🎯 Navigation Guide

**First Time?**
→ Start with [QUICKSTART.md](./QUICKSTART.md)

**Want Architecture Overview?**
→ Read [ARCHITECTURE.md](./ARCHITECTURE.md)

**Need API Docs?**
→ Check [API_REFERENCE.md](./API_REFERENCE.md)

**Stuck on Error?**
→ See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**Want to Contribute Code?**
→ Read [DEVELOPER_HANDBOOK.md](./DEVELOPER_HANDBOOK.md)

**Need to Deploy?**
→ Follow [DEPLOYMENT.md](./DEPLOYMENT.md)

**Running Tests?**
→ Check [TESTING.md](./TESTING.md)

---

**Total Project Size**: ~50MB (code + node_modules when installed)

**Estimated Install Time**: 10 minutes

**Estimated First Run**: 5 minutes

**Time to Full Demo**: 15 minutes

---

**[← Back to Project Summary](./PROJECT_SUMMARY.md)**

**[← Go to Documentation Index](./DOCUMENTATION_INDEX.md)**

🚀 **Happy exploring!**
