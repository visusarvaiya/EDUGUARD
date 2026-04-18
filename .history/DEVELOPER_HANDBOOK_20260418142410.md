# EDUGUARD - Developer Handbook

Welcome to the EDUGUARD development team! This handbook covers everything you need to know to contribute effectively to the project.

---

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Development Setup](#development-setup)
3. [Project Structure](#project-structure)
4. [Coding Standards](#coding-standards)
5. [Git Workflow](#git-workflow)
6. [Common Tasks](#common-tasks)
7. [Debugging Guide](#debugging-guide)
8. [Performance Tips](#performance-tips)

---

## 🎯 Project Overview

**EDUGUARD** is an Early Academic Risk Detection and Student Intervention Platform for universities and colleges.

### Core Features
- **Risk Scoring**: ML-based algorithm predicting student dropout risk (0-100 scale)
- **Role-Based Dashboards**: Student, Mentor, Teacher, Coordinator views
- **Intervention Tracking**: Log and measure effectiveness of mentoring activities
- **Automated Alerts**: Daily 2 AM scan for high-risk students
- **Analytics & Reports**: PDF reports, CSV exports, trend analysis

### Tech Stack
- **Frontend**: React 18 + Tailwind CSS + Recharts
- **Backend**: Node.js + Express + MongoDB + Redis
- **Authentication**: JWT + OTP email verification
- **Jobs**: node-cron for background tasks

### Key Metrics
- **Students**: 360 (3 departments × 4 semesters)
- **Risk Formula**: 40% attendance + 30% marks + 20% assignments + 10% LMS
- **Cache TTL**: 1 hour for risk scores
- **Alert Frequency**: Daily at 2 AM
- **API Response Goal**: < 200ms

---

## 🚀 Development Setup

### Prerequisites
- Node.js 18.x LTS
- MongoDB running locally or MongoDB Atlas
- Redis running locally or Redis Cloud
- Git
- VS Code (recommended)

### First-Time Setup

```bash
# 1. Clone repository
git clone https://github.com/EDUGUARD/EDUGUARD.git
cd EDUGUARD

# 2. Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials

# 3. Frontend setup
cd ../frontend
npm install
cp .env.example .env

# 4. Start services
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start

# 5. Seed database (first time only)
# Terminal 3: Another backend terminal
cd backend
npm run seed
```

### Environment Variables

**Backend (.env):**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/EDUGUARD
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@EDUGUARD.com
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Demo Credentials
```
Email: student@example.com
Password: password123
OTP: 123456 (for first login)
```

---

## 📁 Project Structure

### Backend
```
backend/
├── src/
│   ├── index.js                    # Entry point
│   ├── models/                     # MongoDB schemas
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── RiskScore.js
│   │   ├── AcademicData.js
│   │   ├── Intervention.js
│   │   ├── Alert.js
│   │   └── Subject.js
│   ├── controllers/                # Business logic
│   │   ├── authController.js
│   │   ├── riskController.js
│   │   ├── interventionController.js
│   │   ├── alertController.js
│   │   ├── coordinatorController.js
│   │   └── reportController.js
│   ├── routes/                     # API routes
│   │   ├── auth.js
│   │   ├── risk.js
│   │   ├── interventions.js
│   │   ├── alerts.js
│   │   ├── coordinator.js
│   │   └── reports.js
│   ├── middleware/                 # Express middleware
│   │   ├── auth.js                 # JWT + RBAC
│   │   ├── errorHandler.js
│   │   └── validators.js
│   ├── services/                   # Reusable services
│   │   ├── riskEngine.js           # Core risk calculation
│   │   ├── alertScheduler.js       # Cron jobs
│   │   └── emailService.js
│   ├── config/                     # Configuration
│   │   ├── database.js
│   │   ├── redis.js
│   │   └── email.js
│   ├── utils/                      # Utilities
│   │   ├── emailTemplates.js
│   │   ├── jwt.js
│   │   └── validations.js
│   └── scripts/
│       └── seed.js                 # Database seeding
├── tests/                          # Test files
├── .env
├── .gitignore
├── package.json
└── README.md
```

### Frontend
```
frontend/
├── src/
│   ├── App.js                      # Root component + routing
│   ├── index.js                    # Entry point
│   ├── pages/
│   │   ├── Landing.js
│   │   ├── Login.js
│   │   ├── StudentDashboard.js
│   │   ├── MentorDashboard.js
│   │   ├── TeacherDashboard.js
│   │   └── CoordinatorDashboard.js
│   ├── components/
│   │   ├── DashboardLayout.js      # Sidebar + Navbar
│   │   ├── PrivateRoute.js         # Route protection
│   │   └── [other reusable components]
│   ├── services/
│   │   ├── api.js                  # Axios API client
│   │   └── authContext.js          # Auth state
│   ├── utils/
│   │   └── helpers.js              # Color, date formatting
│   ├── styles/
│   │   └── index.css
│   └── [other assets]
├── public/
│   └── index.html
├── tests/                          # Test files
├── .env
├── .gitignore
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
├── package.json
└── README.md
```

---

## 📝 Coding Standards

### General Rules
- **Naming**: camelCase for variables/functions, PascalCase for classes/components
- **Line Length**: Max 100 characters
- **Indentation**: 2 spaces (no tabs)
- **Semicolons**: Required
- **Comments**: Meaningful, not obvious code
- **Console.log**: Remove before PR

### Backend JavaScript

```javascript
// ✅ Good
async function calculateRiskScore(studentId) {
  const academicData = await AcademicData.find({ studentId });
  if (!academicData || academicData.length === 0) {
    throw new Error('No academic data found');
  }
  
  // Calculate weighted score
  const score = calculateWeightedScore(academicData);
  return score;
}

// ❌ Bad
async function calcRisk(sid) {
  let data = await AcademicData.find({ studentId: sid });
  let s = 0;
  for (let d of data) {
    s += d.score;
  }
  console.log('Score:', s); // Don't leave console logs
  return s;
}
```

### Error Handling

```javascript
// ✅ Good
try {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
} catch (error) {
  logger.error('Database error:', error);
  throw error;
}

// ❌ Bad
const user = User.findById(userId); // Missing await
return user; // Might be undefined
```

### React Component Standards

```javascript
// ✅ Good
function StudentDashboard() {
  const { user } = useAuth();
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRiskData();
  }, [user.id]);

  async function loadRiskData() {
    try {
      const data = await riskAPI.getStudentRisk(user.id);
      setRiskData(data);
    } catch (error) {
      console.error('Error loading risk data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (!riskData) return <ErrorMessage />;

  return (
    <div className="p-6">
      <RiskGauge score={riskData.score} />
      <RiskBreakdown breakdown={riskData.breakdown} />
    </div>
  );
}

export default StudentDashboard;

// ❌ Bad
function Dashboard() {
  const [data, setData] = useState();
  
  // Effect runs every render!
  useEffect(() => {
    fetch('/api/risk').then(r => r.json()).then(setData);
  });

  return <div>{data && data.score}</div>;
}
```

### MongoDB Query Best Practices

```javascript
// ✅ Good - Indexed field, lean(), single query
const students = await Student
  .find({ semester: 2 })
  .lean()
  .select('name email riskScore')
  .limit(10);

// ✅ Good - Population only when needed
const intervention = await Intervention
  .findById(id)
  .populate('studentId', 'name email');

// ❌ Bad - N+1 query problem
const interventions = await Intervention.find();
for (let intervention of interventions) {
  intervention.student = await Student.findById(intervention.studentId);
}

// ❌ Bad - Fetching all fields when only need 2
const students = await Student.find({ semester: 2 });
```

---

## 🔄 Git Workflow

### Branch Naming
```
feature/feature-name
fix/bug-description
refactor/component-name
docs/documentation-update
```

### Commit Messages
```
✨ feat: Add risk simulation feature
🐛 fix: Correct risk formula weights
📝 docs: Update API documentation
♻️ refactor: Simplify risk calculation
🧪 test: Add unit tests for riskEngine
```

### Pull Request Process
1. Create feature branch from `develop`
2. Make changes
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Push to branch
6. Open PR with description
7. Code review by 2+ teammates
8. Merge only after approvals

### Pre-commit Checks
```bash
# Run before committing
npm run test
npm run lint
npm run build
```

---

## 🛠️ Common Tasks

### Adding a New API Endpoint

1. **Create model** (if needed):
```javascript
// backend/src/models/NewModel.js
const schema = new mongoose.Schema({
  // fields
});
```

2. **Create controller**:
```javascript
// backend/src/controllers/newController.js
async function getData(req, res) {
  try {
    const data = await NewModel.find();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getData };
```

3. **Create route**:
```javascript
// backend/src/routes/newRoute.js
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getData } = require('../controllers/newController');

router.get('/', authenticate, authorize(['Coordinator']), getData);

module.exports = router;
```

4. **Register route** in `index.js`:
```javascript
app.use('/api/new', require('./routes/newRoute'));
```

### Adding a New Frontend Page

1. **Create page component**:
```javascript
// frontend/src/pages/NewPage.js
import { useAuth } from '../services/authContext';
import DashboardLayout from '../components/DashboardLayout';

function NewPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout title="New Page">
      <div className="p-6">
        {/* Content */}
      </div>
    </DashboardLayout>
  );
}

export default NewPage;
```

2. **Add route** in `App.js`:
```javascript
import NewPage from './pages/NewPage';

<Route 
  path="/new-page" 
  element={<PrivateRoute requiredRole="Student"><NewPage /></PrivateRoute>} 
/>
```

### Database Migration

For schema changes:
1. Create migration file: `backend/migrations/001_add_field.js`
2. Test migration locally
3. Document migration in `MIGRATIONS.md`
4. Run in staging before production
5. Keep backup of original data

---

## 🐛 Debugging Guide

### Backend Debugging

**Using VS Code Debugger:**
```javascript
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Backend",
      "program": "${workspaceFolder}/backend/src/index.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

**Common Issues:**

| Issue | Solution |
|-------|----------|
| MongoDB connection failed | Check `MONGODB_URI` in .env, verify MongoDB is running |
| Redis connection failed | Check `REDIS_URL` in .env, verify Redis is running |
| JWT token invalid | Token might be expired; clear localStorage and re-login |
| Email not sending | Check SMTP credentials, use app password for Gmail |
| Risk calculation is 0 | Check if academic data exists in database |

### Frontend Debugging

**Using Chrome DevTools:**
1. Open DevTools (F12)
2. Inspect Network tab for API calls
3. Check Console tab for errors
4. Set breakpoints in Sources tab

**React DevTools:**
```bash
npm install -D react-devtools
# In browser extension: React tab
```

**Common Issues:**

| Issue | Solution |
|-------|----------|
| Page shows login even when logged in | Check localStorage for token, verify JWT expiration |
| Charts not rendering | Verify Recharts data format matches schema |
| Styles not applying | Check Tailwind config, verify CSS is built |
| API returns 401 | Token might be expired, clear and re-login |

---

## ⚡ Performance Tips

### Backend
```javascript
// ✅ Use database indexes
db.students.createIndex({ semester: 1, department: 1 });

// ✅ Use .lean() for read-only queries
Student.find().lean();

// ✅ Batch operations
await Promise.all([query1, query2, query3]);

// ✅ Cache frequently accessed data
const cachedData = await redis.get('key') || computeAndCache();

// ❌ Avoid nested loops
for (let s of students) {
  for (let a of assignments) { // O(n²) complexity
    // ...
  }
}
```

### Frontend
```javascript
// ✅ Use React.memo for expensive components
const DataTable = React.memo(({ data }) => {
  return <table>{/* render data */}</table>;
});

// ✅ Lazy load pages
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));

// ✅ Debounce API calls
const debouncedSearch = useCallback(
  debounce((query) => searchAPI(query), 500),
  []
);

// ✅ Use virtualization for large lists
import { FixedSizeList } from 'react-window';

// ❌ Create new functions in render
function Component() {
  return <Child onClick={() => handleClick()} />; // Creates new function every render
}
```

---

## 📞 Getting Help

- **Questions**: Check documentation first, then ask in team chat
- **Bugs**: Open GitHub issue with reproduction steps
- **Ideas**: Discuss in weekly team sync
- **Emergency**: Contact tech lead

---

## ✅ Checklist Before Committing

- [ ] Code follows standards
- [ ] Tests pass locally
- [ ] No console.log statements
- [ ] No hardcoded values
- [ ] Error handling complete
- [ ] Comments added for complex logic
- [ ] PR description written
- [ ] All files follow naming convention

---

**Happy coding! 🚀**

For more information, refer to:
- [README.md](./README.md) - Project overview
- [API_REFERENCE.md](./API_REFERENCE.md) - API documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [TESTING.md](./TESTING.md) - Testing guidelines
