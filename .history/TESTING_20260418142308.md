# EDUGUARD - Testing Guide

## 🧪 Testing Strategy

### Test Pyramid
```
        ╱╲
       ╱  ╲    E2E Tests (10%)
      ╱────╲   - Full user journeys
     ╱      ╲  - Chrome/Firefox/Safari
    ╱────────╲
   ╱          ╲  Integration Tests (30%)
  ╱────────────╲ - API endpoints
 ╱              ╲ - Database operations
╱────────────────╲ Unit Tests (60%)
                  - Individual functions
                  - Business logic
                  - Utilities
```

**Test Coverage Goals:**
- Unit Tests: 80%+ coverage
- Integration Tests: 70%+ API coverage
- E2E Tests: 5 critical user journeys

---

## 🔧 Setup

### Install Testing Dependencies

**Backend:**
```bash
cd backend
npm install --save-dev jest supertest mongodb-memory-server
```

**Frontend:**
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom jest-mock-extended
```

---

## 📝 Backend Unit Tests

### Test File Structure
```
backend/
├── src/
├── tests/
│   ├── unit/
│   │   ├── models/
│   │   │   ├── user.test.js
│   │   │   └── student.test.js
│   │   ├── services/
│   │   │   ├── riskEngine.test.js
│   │   │   └── authService.test.js
│   │   └── utils/
│   │       └── emailTemplates.test.js
│   ├── integration/
│   │   ├── auth.routes.test.js
│   │   ├── risk.routes.test.js
│   │   └── interventions.routes.test.js
│   └── fixtures/
│       ├── mockUsers.js
│       ├── mockStudents.js
│       └── mockAcademicData.js
└── jest.config.js
```

### Jest Configuration
```javascript
// backend/jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000,
};
```

### Example: Risk Engine Unit Tests
```javascript
// backend/tests/unit/services/riskEngine.test.js
const { calculateRiskScore, simulateRisk } = require('../../../src/services/riskEngine');
const AcademicData = require('../../../src/models/AcademicData');
const RiskScore = require('../../../src/models/RiskScore');

jest.mock('../../../src/models/AcademicData');
jest.mock('../../../src/models/RiskScore');

describe('Risk Engine Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateRiskScore', () => {
    it('should calculate risk score with correct weights', async () => {
      const mockAcademicData = [
        {
          attendance: 60,
          totalClasses: 100,
          internalMarks: 45,
          assignmentsPending: 2,
          assignmentsTotal: 5,
          lmsLoginsPerWeek: 2,
        },
      ];

      AcademicData.find.mockResolvedValue(mockAcademicData);
      RiskScore.findOne.mockResolvedValue(null);
      RiskScore.create.mockResolvedValue({ score: 68.75 });

      const result = await calculateRiskScore('student123');

      expect(result.score).toBe(68.75);
      expect(result.level).toBe('High');
      expect(result.attendanceRisk).toBeCloseTo(40, 1);
      expect(result.marksRisk).toBeCloseTo(90, 1);
    });

    it('should cache results in Redis for 1 hour', async () => {
      // Arrange
      const mockData = [{ attendance: 80, totalClasses: 100, ... }];
      AcademicData.find.mockResolvedValue(mockData);

      // Act
      await calculateRiskScore('student123');
      const cachedResult = await calculateRiskScore('student123');

      // Assert
      expect(cachedResult).toEqual(expectedResult);
      expect(AcademicData.find).toHaveBeenCalledTimes(1); // Called only once due to caching
    });

    it('should detect "Consistently Declining" trend', async () => {
      // Setup: 3 consecutive weeks with increasing scores
      const mockScores = [
        { score: 45, calculatedAt: new Date('2024-01-01') },
        { score: 55, calculatedAt: new Date('2024-01-08') },
        { score: 65, calculatedAt: new Date('2024-01-15') },
      ];

      RiskScore.find.mockResolvedValue(mockScores);

      const result = await calculateRiskScore('student123');

      expect(result.trendFlag).toBe('Consistently Declining');
    });
  });

  describe('simulateRisk', () => {
    it('should project risk score with improved parameters', async () => {
      const result = await simulateRisk('student123', {
        attendance: 90,       // Improve from 60
        assignmentsPending: 0, // Complete all
        marksImprovement: 10,  // +10 points
      });

      expect(result.projectedScore).toBeLessThan(50);
      expect(result.delta).toBeLessThan(0);
    });

    it('should not modify database during simulation', async () => {
      await simulateRisk('student123', { ... });

      expect(RiskScore.create).not.toHaveBeenCalled();
    });
  });
});
```

### Example: Model Validation Tests
```javascript
// backend/tests/unit/models/user.test.js
const User = require('../../../src/models/User');

describe('User Model', () => {
  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'plaintext123',
        role: 'Student',
      });

      await user.save();

      expect(user.passwordHash).not.toBe('plaintext123');
      expect(user.passwordHash).toMatch(/^\$2[aby]\$/); // Bcrypt hash format
    });

    it('should compare passwords correctly', async () => {
      const user = await User.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'secure123',
        role: 'Faculty Mentor',
      });

      const isMatch = await user.comparePassword('secure123');
      expect(isMatch).toBe(true);

      const isMismatch = await user.comparePassword('wrong123');
      expect(isMismatch).toBe(false);
    });
  });

  describe('Validation', () => {
    it('should require email', async () => {
      const user = new User({
        name: 'No Email',
        role: 'Student',
      });

      expect(user.validate()).rejects.toThrow('User validation failed');
    });

    it('should enforce unique email', async () => {
      await User.create({
        name: 'First User',
        email: 'duplicate@example.com',
        password: 'pass123',
        role: 'Student',
      });

      const duplicateUser = new User({
        name: 'Second User',
        email: 'duplicate@example.com',
        password: 'pass123',
        role: 'Student',
      });

      expect(duplicateUser.save()).rejects.toThrow();
    });
  });
});
```

---

## 🔗 Backend Integration Tests

### API Testing Setup
```javascript
// backend/tests/setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
```

### Example: Authentication API Tests
```javascript
// backend/tests/integration/auth.routes.test.js
const request = require('supertest');
const app = require('../../../src/index');
const User = require('../../../src/models/User');

describe('Authentication Routes', () => {
  describe('POST /api/auth/login', () => {
    it('should create new user and return OTP requirement', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          role: 'Student',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('userId');
      expect(response.body.requiresOTP).toBe(true);

      // Verify user was created
      const user = await User.findOne({ email: 'newuser@example.com' });
      expect(user).toBeDefined();
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
          role: 'Student',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid email');
    });

    it('should reject weak passwords', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: '12345',  // Too short
          role: 'Student',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Password');
    });
  });

  describe('POST /api/auth/verify-otp', () => {
    beforeEach(async () => {
      // Create user with OTP
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'Student',
      });
      this.userId = user._id;
      this.testOTP = '123456';
      await user.setOTP(this.testOTP); // Custom method to set OTP hash
    });

    it('should verify OTP and return JWT', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          userId: this.userId.toString(),
          otp: this.testOTP,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toMatch(/^eyJhbGc/); // JWT format
    });

    it('should reject invalid OTP', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          userId: this.userId.toString(),
          otp: '000000',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid OTP');
    });

    it('should reject expired OTP', async () => {
      const user = await User.findById(this.userId);
      user.otpExpiry = new Date(Date.now() - 10 * 60 * 1000); // 10 min ago
      await user.save();

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          userId: this.userId.toString(),
          otp: this.testOTP,
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Expired');
    });
  });
});
```

### Example: Risk API Tests
```javascript
// backend/tests/integration/risk.routes.test.js
const request = require('supertest');
const app = require('../../../src/index');
const { generateToken } = require('../../../src/utils/jwt');

describe('Risk API Routes', () => {
  let authToken;
  let studentId;

  beforeEach(async () => {
    // Create test user and token
    const user = await User.create({...});
    authToken = generateToken({ userId: user._id, role: 'Student' });
    
    // Create student
    const student = await Student.create({
      userId: user._id,
      semester: 2,
      department: 'Computer Science',
    });
    studentId = student._id;
  });

  describe('GET /api/risk/students/:id/risk', () => {
    it('should return calculated risk score', async () => {
      // Create academic data
      await AcademicData.create({
        studentId,
        subjectId: new mongoose.Types.ObjectId(),
        attendance: 75,
        totalClasses: 100,
        internalMarks: 65,
        assignmentsPending: 1,
        assignmentsTotal: 5,
        lmsLoginsPerWeek: 3,
      });

      const response = await request(app)
        .get(`/api/risk/students/${studentId}/risk`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('score');
      expect(response.body).toHaveProperty('level');
      expect(response.body.breakdown).toHaveProperty('attendance');
      expect(response.body.breakdown).toHaveProperty('marks');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get(`/api/risk/students/${studentId}/risk`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/risk/students/:id/history', () => {
    it('should return 8-week risk history', async () => {
      // Create 8 weeks of risk scores
      for (let i = 0; i < 8; i++) {
        await RiskScore.create({
          studentId,
          score: 50 + i * 5,
          level: 'Medium',
          calculatedAt: new Date(Date.now() - (7 - i) * 7 * 24 * 60 * 60 * 1000),
        });
      }

      const response = await request(app)
        .get(`/api/risk/students/${studentId}/history`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.history).toHaveLength(8);
      expect(response.body.history[0].score).toBe(50);
      expect(response.body.history[7].score).toBe(85);
    });
  });

  describe('POST /api/risk/simulate', () => {
    it('should project risk with improved parameters', async () => {
      const response = await request(app)
        .post('/api/risk/simulate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          studentId: studentId.toString(),
          attendance: 90,
          assignmentsPending: 0,
          marksImprovement: 15,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('currentScore');
      expect(response.body).toHaveProperty('projectedScore');
    });
  });
});
```

---

## 🎨 Frontend Unit Tests

### React Testing Setup
```javascript
// frontend/src/setupTests.js
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

// Mock API calls
jest.mock('./services/api', () => ({
  authAPI: {},
  riskAPI: {},
  interventionAPI: {},
  alertAPI: {},
}));
```

### Example: Component Tests
```javascript
// frontend/src/components/__tests__/Login.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../pages/Login';
import * as authService from '../../services/api';

jest.mock('../../services/api');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Login Component', () => {
  it('should render email input and login button', () => {
    render(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should show error for invalid email', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it('should call login API with correct data', async () => {
    const user = userEvent.setup();
    authService.authAPI.login.mockResolvedValue({
      userId: '123',
      requiresOTP: true,
    });

    render(<Login />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(authService.authAPI.login).toHaveBeenCalledWith(
      'user@example.com',
      'password123'
    );
  });

  it('should show OTP modal after successful login', async () => {
    const user = userEvent.setup();
    authService.authAPI.login.mockResolvedValue({
      userId: '123',
      requiresOTP: true,
    });

    render(<Login />);

    // Perform login
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Wait for OTP modal
    await screen.findByText(/enter otp/i);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

### Example: Context Tests
```javascript
// frontend/src/services/__tests__/authContext.test.js
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../authContext';

describe('Auth Context', () => {
  it('should provide auth context', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('token');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');
  });

  it('should persist token in localStorage', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login({
        user: { id: '123', name: 'Test User' },
        token: 'test-token',
      });
    });

    expect(localStorage.getItem('token')).toBe('test-token');
  });

  it('should clear token on logout', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem('token')).toBeNull();
    expect(result.current.user).toBeNull();
  });
});
```

---

## 🌐 E2E Tests (Cypress)

### Setup
```bash
cd frontend
npm install --save-dev cypress
npx cypress open
```

### Critical User Journeys
```javascript
// frontend/cypress/e2e/student-journey.cy.js
describe('Student Dashboard Journey', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.Login('student@example.com', 'password123');
  });

  it('should display risk score and breakdown', () => {
    cy.visit('/student/dashboard');

    // Check risk gauge
    cy.get('[data-testid="risk-gauge"]').should('exist');

    // Check breakdown cards
    cy.get('[data-testid="attendance-card"]').should('contain', 'Attendance');
    cy.get('[data-testid="marks-card"]').should('contain', 'Marks');
    cy.get('[data-testid="assignments-card"]').should('contain', 'Assignments');
  });

  it('should simulate risk with what-if inputs', () => {
    cy.visit('/student/dashboard');

    // Adjust sliders
    cy.get('input[type="range"]').first().clear().type('90');

    // Check projected score updates
    cy.get('[data-testid="projected-score"]')
      .should('exist')
      .invoke('text')
      .then((text) => {
        expect(parseInt(text)).toBeLessThan(50);
      });
  });

  it('should show 8-week risk trend', () => {
    cy.visit('/student/dashboard');

    // Check chart exists
    cy.get('[data-testid="risk-trend-chart"]').should('exist');

    // Check threshold line at 65
    cy.get('[data-testid="high-risk-threshold"]').should('exist');
  });
});
```

```javascript
// frontend/cypress/e2e/mentor-journey.cy.js
describe('Mentor Intervention Journey', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.login('mentor@example.com', 'password123');
  });

  it('should log intervention for at-risk student', () => {
    cy.visit('/mentor/dashboard');

    // Find at-risk student
    cy.contains('button', 'Log Intervention').first().click();

    // Fill intervention form
    cy.get('select[name="type"]').select('Counselling');
    cy.get('input[name="date"]').type('2024-01-15');
    cy.get('textarea[name="remarks"]').type('Had a discussion about study habits');
    cy.get('select[name="outcome"]').select('Improved');
    cy.get('input[name="followUp"]').check();

    // Submit
    cy.contains('button', 'Log Intervention').click();

    // Verify success
    cy.contains('Intervention logged successfully').should('be.visible');
  });

  it('should filter high-risk students', () => {
    cy.visit('/mentor/dashboard');

    // Apply high-risk filter
    cy.get('select[name="riskFilter"]').select('High');

    // Verify only high-risk students shown
    cy.get('[data-testid="risk-badge"]').each(($badge) => {
      cy.wrap($badge).should('contain', 'High');
    });
  });
});
```

---

## 🚀 Running Tests

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/unit/services/riskEngine.test.js

# Watch mode (re-run on file change)
npm test -- --watch

# Run only integration tests
npm test -- tests/integration
```

### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run E2E tests
npx cypress open

# Run E2E headless
npx cypress run
```

---

## 📊 Coverage Reports

### View Coverage
```bash
# Backend
cd backend
npm run test:coverage
open coverage/lcov-report/index.html

# Frontend
cd frontend
npm test -- --coverage
open coverage/lcov-report/index.html
```

---

## ✅ Test Checklist Before Production

- [ ] All unit tests pass (backend & frontend)
- [ ] All integration tests pass
- [ ] Code coverage >= 80% for critical paths
- [ ] All E2E critical journeys tested
- [ ] Load testing (1000+ concurrent users)
- [ ] Security penetration testing
- [ ] Browser compatibility tested (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness tested
- [ ] Performance profiling complete
- [ ] Error logging and monitoring verified

---

**Happy testing! 🧪**
