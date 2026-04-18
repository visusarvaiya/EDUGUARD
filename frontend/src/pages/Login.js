import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../services/authContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError('');
    setGeneralError('');

    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(email.trim(), password.trim(), role);
      setUserId(response.data.userId);

      if (response.data.requiresOTP) {
        setShowOTPModal(true);
      } else if (response.data.token && response.data.user) {
        // Direct login for verified accounts
        login(response.data.user, response.data.token);
        const dashboardRoutes = {
          Student: '/student/dashboard',
          'Faculty Mentor': '/mentor/dashboard',
          'Subject Teacher': '/teacher/dashboard',
          'Academic Coordinator': '/coordinator/dashboard',
        };
        navigate(dashboardRoutes[response.data.user.role]);
      }
    } catch (error) {
      setGeneralError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.verifyOTP(userId, otp);
      login(response.data.user, response.data.token);

      const dashboardRoutes = {
        Student: '/student/dashboard',
        'Faculty Mentor': '/mentor/dashboard',
        'Subject Teacher': '/teacher/dashboard',
        'Academic Coordinator': '/coordinator/dashboard',
      };

      navigate(dashboardRoutes[response.data.user.role]);
    } catch (error) {
      setGeneralError(error.response?.data?.error || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="glass-card rounded-2xl p-8 mb-6">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GraduationCap className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">EDUGUARD</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Early Academic Risk Detection</p>
          </div>

          {!showOTPModal ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    className={`w-full pl-10 pr-4 py-2 bg-white/50 border rounded-lg focus:outline-none focus:ring-2 ${
                      emailError
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-indigo-500'
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Student</option>
                  <option>Faculty Mentor</option>
                  <option>Subject Teacher</option>
                  <option>Academic Coordinator</option>
                </select>
              </div>

              {/* Error Message */}
              {generalError && (
                <div className="p-3 bg-red-50/80 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{generalError}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-4"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              {/* Forgot Password Link */}
              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => alert('Check your email for password reset link')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <p className="text-center text-gray-600 text-sm mb-4">
                We've sent a 6-digit OTP to your email. Please enter it below.
              </p>

              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OTP Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-2xl tracking-widest font-mono"
                  autoFocus
                />
              </div>

              {/* Error Message */}
              {generalError && (
                <div className="p-3 bg-red-50/80 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{generalError}</p>
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="btn-primary w-full"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => {
                  setShowOTPModal(false);
                  setOtp('');
                  setGeneralError('');
                }}
                className="btn-outline w-full mt-2"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>

        {/* Demo Credentials Info */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-indigo-500">
          <p className="text-indigo-900 text-sm font-semibold mb-3">🚀 Easy Test Logins:</p>
          <ul className="text-gray-700 text-sm space-y-1 mb-2 list-none">
            <li><strong>Student:</strong> student@eduguard.com</li>
            <li><strong>Mentor:</strong> mentor@eduguard.com</li>
            <li><strong>Teacher:</strong> teacher@eduguard.com</li>
            <li><strong>Coordinator:</strong> coordinator@eduguard.com</li>
          </ul>
          <p className="text-indigo-800 text-sm mt-3 border-t border-indigo-100 pt-2">
            <strong>Password:</strong> password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
