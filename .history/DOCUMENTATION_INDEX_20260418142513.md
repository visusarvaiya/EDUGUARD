# EDUGUARD Documentation Index

Welcome to EDUGUARD documentation! This page serves as a comprehensive guide to all project documentation.

---

## 📖 Documentation Structure

### 🚀 Getting Started
1. **[QUICKSTART.md](./QUICKSTART.md)** ⭐ **START HERE**
   - 5-minute setup guide
   - Demo credentials
   - First run instructions
   - Common errors

2. **[README.md](./README.md)**
   - Project overview
   - Features breakdown
   - Tech stack details
   - File structure
   - Troubleshooting

### 💻 Development

3. **[DEVELOPER_HANDBOOK.md](./DEVELOPER_HANDBOOK.md)**
   - Development environment setup
   - Project structure explanation
   - Coding standards
   - Git workflow
   - Common development tasks
   - Debugging guide
   - Performance optimization tips

4. **[API_REFERENCE.md](./API_REFERENCE.md)**
   - Complete API endpoint documentation
   - Request/response examples
   - Authentication details
   - Error handling
   - Rate limiting
   - cURL examples

### 🏗️ Architecture & Design

5. **[ARCHITECTURE.md](./ARCHITECTURE.md)**
   - High-level system architecture
   - Database schema design
   - Risk calculation algorithm
   - Security architecture
   - Performance optimization
   - Scalability considerations
   - Design patterns used

### 🧪 Testing

6. **[TESTING.md](./TESTING.md)**
   - Testing strategy & pyramid
   - Backend unit tests (Jest)
   - Backend integration tests (Supertest)
   - Frontend unit tests (React Testing Library)
   - E2E tests (Cypress)
   - Running tests & coverage reports
   - Pre-production checklist

### 🚢 Deployment & Operations

7. **[DEPLOYMENT.md](./DEPLOYMENT.md)**
   - Production deployment steps
   - Heroku deployment
   - Docker containerization
   - Kubernetes orchestration
   - CI/CD pipeline (GitHub Actions)
   - Monitoring & logging
   - Security checklist
   - Disaster recovery procedures

### 🆘 Troubleshooting

8. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** (This document)
   - Common issues and solutions
   - Error messages reference
   - Performance problems
   - Database issues
   - Email delivery problems
   - Authentication issues

---

## 📋 Quick Reference

### For Different Roles

**🎓 Student Developer (New to Project)**
1. Read [QUICKSTART.md](./QUICKSTART.md) (5 min)
2. Review [README.md](./README.md) overview (10 min)
3. Follow [DEVELOPER_HANDBOOK.md](./DEVELOPER_HANDBOOK.md) setup (15 min)
4. Explore project structure
5. Start with small bug fixes or UI improvements

**👨‍💼 Backend Developer**
1. Review [ARCHITECTURE.md](./ARCHITECTURE.md) - Database schema (15 min)
2. Study [API_REFERENCE.md](./API_REFERENCE.md) - Endpoints (20 min)
3. Read [DEVELOPER_HANDBOOK.md](./DEVELOPER_HANDBOOK.md) - Standards (15 min)
4. Review [TESTING.md](./TESTING.md) - Backend tests (20 min)
5. Run backend locally: `npm run dev` + `npm run seed`

**🎨 Frontend Developer**
1. Review [ARCHITECTURE.md](./ARCHITECTURE.md) - Frontend stack (10 min)
2. Study [API_REFERENCE.md](./API_REFERENCE.md) - API calls (15 min)
3. Read [DEVELOPER_HANDBOOK.md](./DEVELOPER_HANDBOOK.md) - React standards (15 min)
4. Review [TESTING.md](./TESTING.md) - Frontend tests (20 min)
5. Run frontend locally: `npm start`

**🏭 DevOps/Operations**
1. Review [DEPLOYMENT.md](./DEPLOYMENT.md) - Entire document (1 hour)
2. Study [ARCHITECTURE.md](./ARCHITECTURE.md) - System design (30 min)
3. Reference [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues (30 min)
4. Set up monitoring per deployment guide

**🧪 QA/Tester**
1. Review [TESTING.md](./TESTING.md) - Test strategy (30 min)
2. Study [API_REFERENCE.md](./API_REFERENCE.md) - All endpoints (30 min)
3. Read [QUICKSTART.md](./QUICKSTART.md) - Setup (5 min)
4. Reference [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Known issues (20 min)
5. Run test suites: `npm test`

**👔 Project Manager**
1. Read [README.md](./README.md) - Features & scope (15 min)
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical overview (20 min)
3. Read [DEPLOYMENT.md](./DEPLOYMENT.md) - Release process (20 min)

---

## 🔑 Key Information at a Glance

### Risk Calculation Formula
```
Risk Score = (0.40 × Attendance Risk) 
           + (0.30 × Marks Risk) 
           + (0.20 × Assignments Risk) 
           + (0.10 × LMS Risk)

Scale: 0-100 (Higher = More at-risk)
Level: Low (<45), Medium (45-65), High (>65)
```

### Database Collections (8)
- Users (authentication)
- Students (student profiles)
- RiskScores (weekly history)
- AcademicData (subject-level metrics)
- Interventions (mentoring logs)
- Alerts (notifications)
- Subjects (courses)
- Assignments & Submissions (coursework)

### API Routes (6 modules)
- `/api/auth/*` - Authentication
- `/api/risk/*` - Risk scoring
- `/api/interventions/*` - Intervention logging
- `/api/alerts/*` - Notifications
- `/api/coordinator/*` - Analytics
- `/api/reports/*` - PDF/CSV exports

### Key Services
- **Risk Engine**: Calculates student risk scores with 1-hour Redis caching
- **Alert Scheduler**: Daily 2 AM cron job for risk detection
- **Email Service**: Nodemailer SMTP for OTP & alerts
- **Auth Service**: JWT + OTP-based authentication

### Demo Credentials
```
Email: student@example.com
Password: password123
OTP (first login): 123456
```

---

## 📊 Technology Stack Summary

```
Frontend:
├── React 18 (UI library)
├── React Router v6 (routing)
├── Tailwind CSS (styling)
├── Recharts (charts)
├── Axios (HTTP client)
└── Context API (state management)

Backend:
├── Node.js (runtime)
├── Express.js (web framework)
├── MongoDB (document database)
├── Redis (caching)
├── Nodemailer (email)
├── node-cron (scheduled jobs)
└── bcryptjs (password hashing)

DevOps:
├── Docker (containerization)
├── Kubernetes (orchestration)
├── GitHub Actions (CI/CD)
├── Heroku/AWS/Azure (hosting)
└── Sentry (error monitoring)
```

---

## 🎯 Common Workflows

### 1. Local Development Setup (First Time)
```bash
# See QUICKSTART.md for detailed steps
cd backend && npm install && npm run dev    # Terminal 1
cd frontend && npm install && npm start     # Terminal 2
# Database auto-seeded on first run
```

### 2. Adding a New Feature
1. Create feature branch: `git checkout -b feature/new-feature`
2. Design database schema if needed (see ARCHITECTURE.md)
3. Create API endpoint (see DEVELOPER_HANDBOOK.md)
4. Create frontend component (see DEVELOPER_HANDBOOK.md)
5. Write tests (see TESTING.md)
6. Create PR with description

### 3. Fixing a Bug
1. Reproduce issue locally
2. Check TROUBLESHOOTING.md for similar issues
3. Set breakpoint in debugger (see DEVELOPER_HANDBOOK.md)
4. Fix and write test case
5. Verify fix doesn't break other tests
6. Create PR with bug description

### 4. Performance Investigation
1. Check PERFORMANCE.md recommendations
2. Use Chrome DevTools (frontend) or Node profiler (backend)
3. Monitor database queries
4. Check Redis cache hit rates
5. Apply optimizations from ARCHITECTURE.md

### 5. Deploying to Production
1. Review DEPLOYMENT.md production checklist
2. Run full test suite
3. Create release branch: `release/v1.0.0`
4. Build Docker images
5. Deploy to staging first
6. Test critical user journeys
7. Deploy to production

---

## 🔍 Finding Answers

**"How do I...?"**
→ Check [DEVELOPER_HANDBOOK.md](./DEVELOPER_HANDBOOK.md) Common Tasks section

**"What's the API for...?"**
→ Check [API_REFERENCE.md](./API_REFERENCE.md)

**"How does the risk algorithm work?"**
→ Check [ARCHITECTURE.md](./ARCHITECTURE.md) Database Schema section

**"How do I test this?"**
→ Check [TESTING.md](./TESTING.md)

**"What error does this code throw?"**
→ Check [ERROR_CODES.md](#) or [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**"How do I deploy this?"**
→ Check [DEPLOYMENT.md](./DEPLOYMENT.md)

**"I'm getting an error"**
→ Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) error reference

---

## 📈 Documentation Maintenance

This documentation is maintained by the EDUGUARD development team. 

**To Update Documentation:**
1. Make changes to relevant .md files
2. Include links to related sections
3. Update this index if adding new docs
4. Commit with message: `📝 docs: Update [section]`
5. Get approval in PR

**Version History:**
- **v1.0.0** (Jan 2024) - Initial documentation suite
- Schema consistent across all docs
- All APIs documented with examples
- Testing guide completed
- Deployment procedures finalized

---

## 🎓 Learning Paths

### Path 1: Full Stack Developer (4 hours)
1. QUICKSTART.md (5 min)
2. README.md - Features section (5 min)
3. ARCHITECTURE.md - High-level overview (20 min)
4. DEVELOPER_HANDBOOK.md - Setup + Coding Standards (45 min)
5. API_REFERENCE.md - Authentication endpoints (15 min)
6. Build a simple feature frontend → backend (3 hours)

### Path 2: Backend Specialist (3 hours)
1. QUICKSTART.md (5 min)
2. ARCHITECTURE.md - Database schema (30 min)
3. API_REFERENCE.md - All endpoints (30 min)
4. DEVELOPER_HANDBOOK.md - Backend standards (30 min)
5. TESTING.md - Backend tests (30 min)
6. Implement a new API endpoint (1 hour)

### Path 3: Frontend Specialist (3 hours)
1. QUICKSTART.md (5 min)
2. ARCHITECTURE.md - Frontend stack (15 min)
3. API_REFERENCE.md - React component examples (20 min)
4. DEVELOPER_HANDBOOK.md - React standards (30 min)
5. TESTING.md - React tests (30 min)
6. Add new dashboard widget (1 hour)

### Path 4: DevOps/Infrastructure (2 hours)
1. README.md - Tech stack (10 min)
2. ARCHITECTURE.md - Security & Performance (30 min)
3. DEPLOYMENT.md - Complete (90 min)

---

## 🆘 Emergency Contacts

- **Tech Lead**: [Contact info]
- **DevOps**: [Contact info]
- **Security**: [Contact info]

---

## ✅ Documentation Checklist

When adding new features, ensure:
- [ ] Add API endpoint to API_REFERENCE.md
- [ ] Update ARCHITECTURE.md if schema changes
- [ ] Add test examples to TESTING.md
- [ ] Update DEVELOPER_HANDBOOK.md if new standards
- [ ] Add deployment steps to DEPLOYMENT.md
- [ ] Document error cases in TROUBLESHOOTING.md
- [ ] Update this index if major feature

---

## 📞 Contributing to Documentation

Found an issue or want to improve docs?
1. Create GitHub issue with tag `documentation`
2. Propose changes in PR with `📝 docs:` prefix
3. Get approval from tech lead
4. Merge to main branch

---

**Last Updated**: January 2024  
**Maintained By**: EDUGUARD Development Team  
**Latest Version**: 1.0.0

---

**Next Steps:**
- Start with [QUICKSTART.md](./QUICKSTART.md) if new to project
- Review your role's learning path above
- Bookmark this page for quick reference
- Ask questions in team chat if stuck

Happy coding! 🚀
