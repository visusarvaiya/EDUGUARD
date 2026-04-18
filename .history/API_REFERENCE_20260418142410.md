# EDUGUARD - Complete API Reference

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Authentication Endpoints

#### 1. User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "role": "Student"  // Optional: creates user with this role on first login
}
```

**Response (201):**
```json
{
  "success": true,
  "userId": "507f1f77bcf86cd799439011",
  "email": "student@example.com",
  "requiresOTP": true,
  "message": "OTP sent to registered email"
}
```

**Errors:**
- `400`: Invalid email format
- `400`: Password too weak
- `500`: Email service unavailable

---

#### 2. Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "student@example.com",
    "name": "John Doe",
    "role": "Student",
    "department": "Computer Science"
  }
}
```

**Errors:**
- `401`: Invalid OTP
- `401`: OTP expired (valid for 10 minutes)
- `404`: User not found

---

#### 3. Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "student@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

---

## 📊 Risk Management Endpoints

### 1. Get Student Risk Score
```http
GET /api/risk/students/:studentId/risk
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "score": 68.5,
  "level": "High",
  "breakdown": {
    "attendanceRisk": 40,
    "marksRisk": 90,
    "assignmentRisk": 60,
    "lmsRisk": 70
  },
  "trendFlag": "Consistently Declining",
  "factors": {
    "attendance": {
      "value": 60,
      "totalClasses": 100,
      "percentage": 60,
      "impact": -40
    },
    "marks": {
      "avgMarks": 45,
      "impact": -90
    },
    "assignments": {
      "pending": 3,
      "total": 5,
      "completionRate": 40,
      "impact": -60
    },
    "lmsLoginsPerWeek": 2,
    "impact": -70
  },
  "calculatedAt": "2024-01-15T10:30:00Z"
}
```

**Query Parameters:**
- `forceRecalculate` (boolean): Skip cache and recalculate
- `selectedSubjects` (array): Limit to specific subjects

**Errors:**
- `401`: Unauthorized (no valid token)
- `403`: Forbidden (student can only view own score)
- `404`: Student not found

---

### 2. Get Risk History (8 Weeks)
```http
GET /api/risk/students/:studentId/history
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "studentId": "507f1f77bcf86cd799439011",
  "history": [
    {
      "week": 1,
      "date": "2024-01-01T00:00:00Z",
      "score": 50,
      "level": "Medium",
      "trend": "stable"
    },
    {
      "week": 2,
      "date": "2024-01-08T00:00:00Z",
      "score": 55,
      "level": "Medium",
      "trend": "increasing"
    },
    // ... 6 more weeks
  ],
  "currentTrend": "Consistently Declining",
  "improvement": null
}
```

---

### 3. Simulate Risk (What-If)
```http
POST /api/risk/simulate
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "507f1f77bcf86cd799439011",
  "simulatedData": {
    "attendance": 90,           // 0-100%
    "assignmentsPending": 0,    // 0-5
    "marksImprovement": 10,     // 0-50
    "lmsLoginsPerWeek": 5       // 0-7
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "currentScore": 68.5,
  "currentLevel": "High",
  "simulatedScore": 45.2,
  "simulatedLevel": "Medium",
  "delta": -23.3,
  "improvements": {
    "attendance": {
      "from": 60,
      "to": 90,
      "scoreReduction": 12
    },
    "assignments": {
      "from": 3,
      "to": 0,
      "scoreReduction": 8
    },
    "marks": {
      "from": 45,
      "to": 55,
      "scoreReduction": 3
    }
  }
}
```

---

## 🎯 Intervention Endpoints

### 1. Log Intervention
```http
POST /api/interventions
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "507f1f77bcf86cd799439012",
  "type": "Counselling",
  "date": "2024-01-15",
  "remarks": "Discussed study techniques and time management strategies for 30 minutes",
  "outcomeExpected": "Improved",
  "followUpRequired": true,
  "followUpDate": "2024-01-29"
}
```

**Response (201):**
```json
{
  "success": true,
  "intervention": {
    "id": "507f1f77bcf86cd799439013",
    "studentId": "507f1f77bcf86cd799439012",
    "mentorId": "507f1f77bcf86cd799439011",
    "type": "Counselling",
    "date": "2024-01-15",
    "remarks": "Discussed study techniques...",
    "preInterventionScore": 68.5,
    "outcomeExpected": "Improved",
    "followUpRequired": true,
    "followUpDate": "2024-01-29",
    "createdAt": "2024-01-15T14:00:00Z"
  }
}
```

**Validation:**
- remarks >= 20 characters
- type must be valid enum
- outcomeExpected must be one of: Improved, No Change, Declined

---

### 2. Get Interventions
```http
GET /api/interventions?studentId=507f1f77bcf86cd799439012&limit=10&skip=0
Authorization: Bearer <token>
```

**Query Parameters:**
- `studentId`: Required for mentors
- `limit`: Results per page (default: 10, max: 50)
- `skip`: Pagination offset (default: 0)
- `sortBy`: Field to sort by (default: -createdAt)

**Response (200):**
```json
{
  "success": true,
  "total": 3,
  "interventions": [
    {
      "id": "507f1f77bcf86cd799439013",
      "studentName": "Alice Johnson",
      "type": "Counselling",
      "date": "2024-01-15",
      "remarks": "Discussed study techniques...",
      "preInterventionScore": 68.5,
      "postInterventionScore": null,
      "status": "pending_followup",
      "followUpDate": "2024-01-29"
    },
    // ... more interventions
  ]
}
```

---

## 🔔 Alert Endpoints

### 1. Get Unread Alerts
```http
GET /api/alerts/unread?limit=10
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "unreadCount": 5,
  "alerts": [
    {
      "id": "507f1f77bcf86cd799439014",
      "type": "High Risk",
      "message": "Student John Doe has entered high-risk zone (Score: 72)",
      "linkedStudentId": "507f1f77bcf86cd799439012",
      "linkedStudentName": "John Doe",
      "createdAt": "2024-01-15T14:00:00Z",
      "isRead": false
    },
    {
      "id": "507f1f77bcf86cd799439015",
      "type": "Rapid Decline",
      "message": "Risk score increased by 18 points in 1 week",
      "linkedStudentId": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-14T10:00:00Z",
      "isRead": false
    }
  ]
}
```

---

### 2. Mark Alert as Read
```http
PATCH /api/alerts/:alertId/read
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Alert marked as read"
}
```

---

### 3. Mark All Alerts as Read
```http
PATCH /api/alerts/read-all
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "updated": 5,
  "message": "5 alerts marked as read"
}
```

---

## 📋 Coordinator Analytics Endpoints

### 1. Get Dashboard Summary
```http
GET /api/coordinator/summary?department=CS&semester=2&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Query Parameters:**
- `department`: Filter by department (optional)
- `semester`: Filter by semester (optional)
- `startDate`, `endDate`: Date range filter (ISO format)

**Response (200):**
```json
{
  "success": true,
  "summary": {
    "totalStudents": 360,
    "highRiskPercentage": 18,
    "mediumRiskPercentage": 35,
    "lowRiskPercentage": 47,
    "improvedCount": 127,
    "declinedCount": 45,
    "stableCount": 188,
    "interventionsThisMonth": 89,
    "avgAttendance": 72.5,
    "avgMarks": 65.3,
    "departmentBreakdown": [
      {
        "department": "Computer Science",
        "totalStudents": 120,
        "highRisk": 20,
        "mediumRisk": 40,
        "lowRisk": 60
      }
    ]
  }
}
```

---

### 2. Get Systemic Issues
```http
GET /api/coordinator/systemic-issues?department=CS
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "issues": [
    {
      "title": "Low Attendance in Physics Lab",
      "affectedStudents": 42,
      "severity": "High",
      "rootCause": "Tuesday lab schedule conflicts with other courses",
      "recommendation": "Reschedule physics lab to Wednesday",
      "students": [
        { "id": "...", "name": "Student 1", "attendance": 35 },
        { "id": "...", "name": "Student 2", "attendance": 40 }
      ]
    },
    {
      "title": "Poor Assignment Submission Rate",
      "affectedStudents": 58,
      "severity": "High",
      "rootCause": "Unclear submission guidelines",
      "recommendation": "Create video tutorial on assignment submission"
    }
  ]
}
```

---

## 📄 Report Generation Endpoints

### 1. Download PDF Report
```http
GET /api/reports/pdf/:studentId
Authorization: Bearer <token>
```

**Query Parameters:**
- `weeks`: Number of weeks to include (default: 8)
- `includeInterventions`: Include intervention log (default: true)

**Response:**
- File download (application/pdf)
- Filename: `EDUGUARD-report-{studentId}-{date}.pdf`

**Content includes:**
- Student profile
- Current risk score with breakdown
- 8-week trend chart
- Intervention history
- Recommendations

---

### 2. Download CSV Export
```http
GET /api/reports/csv?department=CS&semester=2
Authorization: Bearer <token>
```

**Query Parameters:**
- `department`: Filter by department
- `semester`: Filter by semester
- `includeContactInfo`: Include student emails (default: false)

**Response:**
- File download (text/csv)
- Filename: `EDUGUARD-export-{department}-{date}.csv`

**Columns:**
- Student ID
- Name
- Risk Score
- Risk Level
- Attendance %
- Avg Marks
- Assignments Pending
- Last Intervention
- Mentor Name

---

## 📧 Email Notifications

### OTP Verification Email
```
Subject: Your EDUGUARD OTP Verification Code
From: noreply@EDUGUARD.com

Your OTP: 123456
Valid for: 10 minutes
```

### High Risk Alert Email
```
Subject: High Risk Alert - Immediate Action Required
From: alerts@EDUGUARD.com

Student: John Doe
Risk Score: 72/100 (High Risk)
Reason: Low attendance (45%), Poor marks (38%)
Action: Please meet with the student to discuss intervention plan
```

### Intervention Logged Email
```
Subject: Your Mentor Logged an Intervention
From: noreply@EDUGUARD.com

Intervention Type: Counselling
Date: 2024-01-15
Remarks: Discussed study strategies and time management
Next Follow-up: 2024-01-29
```

---

## ⚙️ Rate Limiting

All APIs are rate-limited:
- **Default**: 100 requests per hour per user
- **Auth endpoint**: 5 attempts per 15 minutes
- **Report generation**: 10 per day per user

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1705334400
```

**Rate Limit Exceeded (429):**
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 3600
}
```

---

## 🔍 Pagination

Endpoints returning lists support pagination:

```http
GET /api/interventions?limit=10&skip=20
```

**Response:**
```json
{
  "success": true,
  "total": 150,
  "limit": 10,
  "skip": 20,
  "data": [...]
}
```

---

## ❌ Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Invalid email format",
  "code": "VALIDATION_ERROR",
  "statusCode": 400
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Rate Limit Exceeded |
| 500 | Server Error |
| 503 | Service Unavailable |

---

## 🧪 API Testing

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123","role":"Student"}'
```

**Get Risk Score:**
```bash
curl -X GET http://localhost:5000/api/risk/students/507f1f77bcf86cd799439011/risk \
  -H "Authorization: Bearer eyJhbGc..."
```

**Simulate Risk:**
```bash
curl -X POST http://localhost:5000/api/risk/simulate \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "studentId":"507f1f77bcf86cd799439011",
    "simulatedData":{"attendance":90,"assignmentsPending":0}
  }'
```

### Postman Collection

Import `EDUGUARD.postman_collection.json` to Postman:
1. Create collection
2. Add requests for each endpoint
3. Set up environment variables: `{{base_url}}`, `{{token}}`
4. Use pre-request scripts for authentication

---

**API Version**: 1.0.0  
**Last Updated**: 2024-01-15  
**Maintained By**: EDUGUARD Dev Team
