import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/authContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/student/dashboard"
            element={
              <PrivateRoute requiredRole="Student">
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/mentor/dashboard"
            element={
              <PrivateRoute requiredRole="Faculty Mentor">
                <MentorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/dashboard"
            element={
              <PrivateRoute requiredRole="Subject Teacher">
                <TeacherDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/coordinator/dashboard"
            element={
              <PrivateRoute requiredRole="Academic Coordinator">
                <CoordinatorDashboard />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
