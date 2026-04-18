# AcadWatch - Troubleshooting Guide

## 🆘 Common Issues & Solutions

### Database & Connection Issues

#### MongoDB Connection Failed
**Error**: `MongooseError: Cannot connect to MongoDB`

**Causes & Solutions**:
```bash
# 1. MongoDB not running
# On Windows:
mongod  # Start MongoDB from command line

# On Mac:
brew services start mongodb-community

# 2. Incorrect connection string
# Check .env file - should be:
MONGODB_URI=mongodb://localhost:27017/acadwatch
# Or for Atlas:
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/acadwatch

# 3. Network issue
ping localhost
# If failing, check firewall settings

# 4. Port already in use
netstat -an | grep 27017  # Check if 27017 is listening
```

**Verification:**
```bash
# In MongoDB shell
mongo
> db.adminCommand("ping")
{ "ok" : 1 }
```

---

#### Redis Connection Failed
**Error**: `RedisError: NOAUTH Authentication required`

**Causes & Solutions**:
```bash
# 1. Redis not running
# On Windows:
redis-server  # Start Redis from command line

# On Mac:
brew services start redis

# 2. Wrong Redis URL
# Check .env - should be:
REDIS_URL=redis://localhost:6379
# Or for Redis Cloud:
REDIS_URL=redis://:password@host:port

# 3. Redis not accepting connections
redis-cli ping
# Should return: PONG
```

**Clear Redis Cache**:
```bash
redis-cli FLUSHALL
```

---

### Authentication Issues

#### "Invalid Email Format" on Login
**Possible Causes**:
- Email regex validation failing
- Special characters in email
- Whitespace before/after email

**Solution**:
```javascript
// In backend validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log(emailRegex.test(email)); // Debug output

// Trim whitespace
email = email.trim();
```

---

#### "OTP Expired" After Entering Correct Code
**Possible Causes**:
- System time out of sync
- OTP validity window too short (10 min default)
- Clock skew between server and client

**Solution**:
```bash
# Check server time
date

# Sync time (on Linux)
sudo ntpdate -s time.nist.gov

# Extend OTP validity in code
const OTP_VALIDITY = 15 * 60 * 1000; // 15 minutes
```

---

#### "JWT Token Invalid" After Login
**Possible Causes**:
- Token expired (7 days)
- Token tampered/corrupted
- Wrong JWT secret on different server

**Solution**:
```javascript
// Check token expiry
const decoded = jwt.decode(token, { complete: true });
console.log(decoded.payload.exp);

// Clear localStorage and re-login
localStorage.removeItem('token');
localStorage.removeItem('user');
// Then redirect to /login
```

---

### Email & Notification Issues

#### "Connection Refused" When Sending Email
**Error**: `Error: connect ECONNREFUSED 127.0.0.1:587`

**Causes & Solutions**:
```bash
# 1. Wrong SMTP credentials
# For Gmail:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # NOT regular password!

# Generate Gmail App Password:
# 1. Go to Google Account Security
# 2. Enable 2-factor authentication
# 3. Generate app-specific password
# 4. Use this password in .env

# 2. Firewall blocking SMTP
# Check if port 587 is open for outbound connections

# 3. Wrong email service provider
# For SendGrid:
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxx
```

---

#### OTP Email Not Arriving
**Possible Causes**:
- Email service not configured
- Going to spam folder
- Email address misspelled
- Rate limiting on SMTP server

**Solution**:
```javascript
// 1. Check if email sending is working
const testEmail = 'test@gmail.com';
const result = await sendEmail({
  to: testEmail,
  subject: 'Test',
  html: 'Test email'
});
console.log('Email sent:', result);

// 2. Check email templates
// See backend/src/utils/emailTemplates.js

// 3. Check spam folder
// Some emails might be marked as spam

// 4. Verify SMTP logs
// Enable SMTP debug:
const transporter = nodemailer.createTransport({
  // ... credentials
  logger: true,
  debug: true
});
```

---

### API & Response Issues

#### "401 Unauthorized" on Protected Routes
**Causes & Solutions**:
```javascript
// 1. No token in header
const response = await axios.get(url, {
  headers: { Authorization: `Bearer ${token}` }  // ✅ Correct
});

// 2. Token expired
// Check if token.exp < Date.now()
const decoded = jwt.decode(token);
if (decoded.exp < Date.now() / 1000) {
  // Token expired, re-login
}

// 3. Wrong token format
// Should be: "Bearer eyJhbGc..."
// NOT: "eyJhbGc..." or "JWT eyJhbGc..."

// 4. Token not stored in localStorage
console.log(localStorage.getItem('token'));
```

---

#### "403 Forbidden" on Coordinator Routes
**Causes & Solutions**:
```javascript
// 1. User role not "Academic Coordinator"
const user = JSON.parse(localStorage.getItem('user'));
console.log(user.role);  // Should be "Academic Coordinator"

// 2. Role-based middleware failing
// In backend/src/middleware/auth.js
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// 3. Create user with correct role on first login:
POST /api/auth/login
{
  "email": "coordinator@example.com",
  "password": "password123",
  "role": "Academic Coordinator"  // ← Important
}
```

---

#### "404 Not Found" on API Endpoint
**Causes & Solutions**:
```bash
# 1. Endpoint not registered in index.js
# Check backend/src/index.js for:
app.use('/api/risk', require('./routes/risk'));

# 2. Wrong URL path
# Check API_REFERENCE.md for exact path

# 3. Typo in route definition
# Route: /api/risk/students/:id/risk
# Request: /api/risk/students/123/risk  ✅
# Request: /api/risks/students/123/risk  ❌ (typo)

# 4. Case sensitivity
# Routes are case-sensitive
# /api/Alerts ≠ /api/alerts
```

---

### Frontend & UI Issues

#### Charts Not Displaying
**Possible Causes**:
- Recharts data format incorrect
- Container height/width issues
- Missing dependencies

**Solution**:
```javascript
// 1. Verify data format
const validChartData = [
  { name: 'Week 1', score: 50 },
  { name: 'Week 2', score: 55 },
];

// 2. Ensure container has dimensions
<div style={{ width: 400, height: 300 }}>
  <LineChart data={data} width={400} height={300}>...</LineChart>
</div>

// 3. Check Recharts is installed
npm list recharts
npm install recharts  // If missing

// 4. Verify data keys match properties
<Line dataKey="score" />  // "score" must exist in data
```

---

#### Tailwind CSS Not Applying
**Causes & Solutions**:
```bash
# 1. Tailwind not processed
npm run build  # Should run PostCSS

# 2. Webpack/build cache
rm -rf node_modules/.cache
npm start

# 3. Check tailwind.config.js
# Verify content paths:
content: [
  './src/**/*.{js,jsx}',  // ← Must include your files
  './public/index.html'
]

# 4. CSS file not imported
// In src/index.js or App.js:
import './index.css';  // ← Must import

# 5. Build Tailwind manually
npx tailwindcss -i ./src/index.css -o ./src/output.css
```

---

#### "useAuth is not defined" in Component
**Causes & Solutions**:
```javascript
// 1. Not inside AuthProvider
// In App.js:
import { AuthProvider } from './services/authContext';

<AuthProvider>
  <Routes>
    {/* routes */}
  </Routes>
</AuthProvider>

// 2. Wrong import
import { useAuth } from './services/authContext';  // ✅

// 3. Using in non-React component
// useAuth only works in React functional components
// Not in regular .js files

// 4. Component not wrapped properly
function Dashboard() {
  const { user } = useAuth();  // ✅ Works here
  return <div>{user.name}</div>;
}
```

---

### Data & Seed Issues

#### Database Empty (No Seed Data)
**Causes & Solutions**:
```bash
# 1. Run seed script manually
cd backend
npm run seed

# 2. Check if seeding failed
# Run with debug output:
node -e "
  require('dotenv').config();
  const seed = require('./src/scripts/seed');
  seed().catch(console.error);
"

# 3. Verify MongoDB connection first
mongo
> db.users.find()

# 4. Check seed script for errors
# Review backend/src/scripts/seed.js for any issues
```

---

#### Risk Scores All Zero
**Causes & Solutions**:
```javascript
// 1. No AcademicData records
// Check if student has academic data:
db.academicdata.find({ studentId: ObjectId("...") })

// 2. Risk cache issue
// Clear Redis cache:
redis-cli FLUSHALL

// 3. Risk formula returning NaN
// Check riskEngine.js calculateRiskScore function
// Verify all academic data fields are proper numbers

// 4. Recalculate risk manually
POST /api/risk/students/:id/risk?forceRecalculate=true
```

---

#### What-If Simulation Not Working
**Causes & Solutions**:
```javascript
// 1. API endpoint not being called
// Check browser network tab in DevTools

// 2. Simulated data not being sent
const payload = {
  studentId: studentId,
  simulatedData: {
    attendance: 90,  // 0-100
    assignmentsPending: 0,  // 0-5
    marksImprovement: 10,  // 0-50
    lmsLoginsPerWeek: 5  // 0-7
  }
};

// 3. Response not being processed
console.log('Simulation response:', response); // Debug

// 4. Component not re-rendering
// Use useState for projected score
const [projectedScore, setProjectedScore] = useState(null);
```

---

### Performance Issues

#### Slow Dashboard Loading
**Possible Causes**:
- Fetching too much data
- No pagination
- Missing database indexes
- Redis not caching

**Solution**:
```bash
# 1. Check database query performance
mongo
> db.riskscores.find().explain("executionStats")

# 2. Verify indexes exist
> db.students.getIndexes()

# 3. Monitor Network in Chrome DevTools
# Should see API response < 200ms

# 4. Enable Redis caching
# Verify Redis is running and connected
redis-cli PING  # Should return PONG

# 5. Use pagination
?limit=10&skip=0

# 6. Use database projection (.select)
Student.find().select('name email riskScore')
```

---

#### High Memory Usage
**Possible Causes**:
- Large dataset in memory
- Memory leak in loop
- Redis not clearing cache

**Solution**:
```bash
# Monitor Node process
node --inspect backend/src/index.js
# Open chrome://inspect

# Check memory usage
process.memoryUsage()

# Heap snapshots
node --max-old-space-size=4096 backend/src/index.js  # 4GB limit
```

---

### Email Issues

#### SMTP Authentication Failures
**Error**: `Error: Invalid login - 535 Authentication failed`

**Solution**:
```bash
# For Gmail:
1. Go to https://myaccount.google.com/apppasswords
2. Select Mail and Windows Computer
3. Generate 16-character password
4. Use this in SMTP_PASS (spaces will be auto-removed)

# For SendGrid:
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxx

# For Office 365:
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@company.com
SMTP_PASS=your-password
```

---

### Scheduler Issues

#### Alert Scheduler Not Running
**Error**: No alerts created at 2 AM

**Diagnosis**:
```javascript
// 1. Check if scheduler is initialized
// In backend/src/index.js
const { startAlertScheduler } = require('./services/alertScheduler');
startAlertScheduler();  // Should be called

// 2. Verify cron job is scheduled
// In alertScheduler.js
cron.schedule('0 2 * * *', async () => {
  console.log('Alert scheduler running...');
});

// 3. Check logs at 2 AM
// Enable logging:
const logger = require('winston');
logger.info('Scheduler started');

// 4. Manual trigger for testing
// In backend/src/services/alertScheduler.js:
(async () => {
  await runAlertCheck();
  console.log('Alert check completed');
})();
```

---

### Docker Issues

#### Container Fails to Start
```bash
# Check logs
docker logs container_name

# Common issues:
# 1. Port already in use
docker ps  # Check running containers
docker stop container_id

# 2. Missing environment variables
docker run -e MONGODB_URI="..." ...

# 3. Network issues
docker network inspect bridge
```

---

## 🔍 Debugging Checklist

When something breaks:

1. **Check Logs**
   ```bash
   # Backend
   npm run dev  # Stdout will show errors
   
   # Frontend
   npm start  # Check console in DevTools
   
   # Browser console
   F12 → Console tab
   ```

2. **Verify Connections**
   ```bash
   mongodb://<uri> ✅
   redis://<uri> ✅
   SMTP credentials ✅
   ```

3. **Check Environment**
   ```bash
   cat .env  # Verify variables
   echo $PORT  # Check if set
   ```

4. **Test Endpoints**
   ```bash
   curl -X GET http://localhost:5000/api/health
   # Should return 200
   ```

5. **Check Browser DevTools**
   - Network tab: API calls
   - Console tab: Errors
   - Application tab: localStorage
   - React tab: Component state

6. **Review Recent Changes**
   ```bash
   git diff HEAD~1
   git log --oneline -n 5
   ```

7. **Stack Overflow Search**
   - Copy exact error message
   - Search with technology name
   - Check date (prefer recent answers)

---

## 📞 Getting Help

If the above doesn't work:

1. **Document the issue**
   - What were you doing?
   - What happens?
   - What should happen?
   - Error message (if any)

2. **Gather information**
   - OS: Windows/Mac/Linux
   - Node version: `node -v`
   - npm version: `npm -v`
   - MongoDB version: `mongod --version`

3. **Run test suite**
   - `npm test` to find broken tests
   - Check TESTING.md for test documentation

4. **Post in team chat**
   - Include error message
   - Include steps to reproduce
   - Include environment details

---

## 🐛 Reporting Bugs

Create GitHub issue with:
- **Title**: Clear, descriptive
- **Description**: What, when, expected vs actual
- **Steps to Reproduce**: Numbered list
- **Error Message**: Full stack trace
- **Environment**: OS, Node, npm versions
- **Screenshots**: If UI-related

---

**Still stuck?**
- Check [DEVELOPER_HANDBOOK.md](./DEVELOPER_HANDBOOK.md) - Debugging Guide
- Check [API_REFERENCE.md](./API_REFERENCE.md) - Request/Response examples
- Check [TESTING.md](./TESTING.md) - Test examples
- Ask in team chat with detailed description

Happy debugging! 🔧
