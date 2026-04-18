# AcadWatch - Quick Start in 5 Minutes

## Prerequisites
- Node.js v16+ installed
- MongoDB running locally OR MongoDB Atlas URL
- Redis running locally OR Redis Cloud URL

## Step 1: Setup Backend (Terminal 1)

```bash
cd backend

# Install dependencies
npm install

# Create .env file with database credentials
cat > .env << 'EOF'
PORT=5000
MONGODB_URI=mongodb://localhost:27017/acadwatch
REDIS_URL=redis://localhost:6379
JWT_SECRET=acadwatch_dev_secret_2024
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@acadwatch.com
NODE_ENV=development
EOF

# Start backend (will auto-seed database)
npm run dev
# ✅ Server running on http://localhost:5000
```

## Step 2: Setup Frontend (Terminal 2)

```bash
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
# ✅ Frontend running on http://localhost:3000
```

## Step 3: Open Browser

Visit **http://localhost:3000** and login with:

| Role | Email | Password |
|------|-------|----------|
| Student | `student123@acadwatch.edu` | `password123` |
| Mentor | `mentor.computerengineering@acadwatch.edu` | `password123` |
| Teacher | `teacher1.computerengineering@acadwatch.edu` | `password123` |
| Coordinator | `coordinator.computerengineering@acadwatch.edu` | `password123` |

First login requires OTP verification via email.

## 🎉 Done!

You now have a fully functional AcadWatch instance with:
- ✅ 360+ seeded students
- ✅ 12 departments
- ✅ Pre-logged interventions
- ✅ Risk score history
- ✅ Alert notifications
- ✅ Mock academic data

## 🔧 Optional: Local Development

### Using Local MongoDB & Redis

**MongoDB Installation:**
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install -y mongodb
sudo systemctl start mongod

# Windows
# Download from https://www.mongodb.com/try/download/community
```

**Redis Installation:**
```bash
# macOS
brew install redis
brew services start redis

# Linux
sudo apt-get install -y redis-server
sudo systemctl start redis-server

# Windows
# Download from https://github.com/microsoftarchive/redis/releases
```

### Cloud Alternatives (MongoDB Atlas + Redis Cloud)

1. Create [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (free tier available)
2. Create [Redis Cloud](https://redis.com/cloud/) database (free trial)
3. Update `.env` with URIs:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/acadwatch
   REDIS_URL=redis://user:pass@host:port
   ```

## 📊 Exploring the Application

### 1. **Landing Page** (`/`)
- Marketing overview
- Feature highlights
- Call-to-action

### 2. **Login** (`/login`)
- Email verification with OTP
- Role-based routing
- Demo credentials provided

### 3. **Student Dashboard** (`/student/dashboard`)
- Risk score visualization
- 8-week trend chart
- Interactive what-if simulator
- Academic performance tables
- Personalized action plans

### 4. **Mentor Dashboard** (`/mentor/dashboard`)
- At-risk student list
- Risk distribution analytics
- Intervention logging form
- Effectiveness tracking

### 5. **Teacher Dashboard** (`/teacher/dashboard`)
- Subject selector
- CSV upload & manual entry
- Performance analytics
- Class average tracking
- Weak topic detection

### 6. **Coordinator Dashboard** (`/coordinator/dashboard`)
- Institution-wide statistics
- Risk by department
- 12-week trend analysis
- Systemic issue detection
- PDF & CSV export

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| `Cannot connect to MongoDB` | Ensure `mongod` is running or update MONGODB_URI |
| `Cannot connect to Redis` | Ensure `redis-server` is running or update REDIS_URL |
| `OTP not received` | Check SMTP credentials; try Gmail App Password |
| `CORS error` | Verify `REACT_APP_API_URL` matches backend URL
| `Port 5000 in use` | Kill process: `lsof -ti:5000 \| xargs kill -9` |
| `Port 3000 in use` | Kill process: `lsof -ti:3000 \| xargs kill -9` |

## 🚀 Next Steps

1. **Customize Seed Data**: Edit `backend/src/scripts/seed.js`
2. **Add Your Email**: Update `SMTP_*` in `.env` for real email sending
3. **Deploy**: Host on Heroku, Render, AWS, Azure, or GCP
4. **Integrate Real Data**: Connect to your institution's database
5. **Add Features**: Extend with your own requirements

---

**Questions?** Check the main [README.md](./README.md) for detailed documentation.

**Happy Learning! 🎓**
