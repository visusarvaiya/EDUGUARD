import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Bell, GraduationCap } from 'lucide-react';
import { useAuth } from '../services/authContext';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      // Mock alerts
      const mockAlerts = [
        {
          id: 1,
          message: 'Your attendance in Mathematics dropped below 75%',
          timestamp: new Date(),
          isRead: false,
        },
        {
          id: 2,
          message: 'New intervention logged by your mentor',
          timestamp: new Date(Date.now() - 3600000),
          isRead: false,
        },
        {
          id: 3,
          message: 'Assignment due tomorrow',
          timestamp: new Date(Date.now() - 7200000),
          isRead: true,
        },
      ];
      setAlerts(mockAlerts);
      setUnreadCount(mockAlerts.filter((a) => !a.isRead).length);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const markAlertAsRead = (alertId) => {
    setAlerts(alerts.map((a) => (a.id === alertId ? { ...a, isRead: true } : a)));
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, isRead: true })));
    setUnreadCount(0);
  };

  const sidebarItems = {
    Student: [
      { label: 'Dashboard', icon: '📊', path: '/student/dashboard' },
      { label: 'My Progress', icon: '📈', path: '#' },
      { label: 'Interventions', icon: '📋', path: '#' },
    ],
    'Faculty Mentor': [
      { label: 'Dashboard', icon: '👥', path: '/mentor/dashboard' },
      { label: 'At-Risk Students', icon: '⚠️', path: '#' },
      { label: 'Interventions', icon: '🛠️', path: '#' },
    ],
    'Subject Teacher': [
      { label: 'Dashboard', icon: '📚', path: '/teacher/dashboard' },
      { label: 'Upload Data', icon: '📤', path: '#' },
      { label: 'Analytics', icon: '📊', path: '#' },
    ],
    'Academic Coordinator': [
      { label: 'Dashboard', icon: '🏫', path: '/coordinator/dashboard' },
      { label: 'Reports', icon: '📄', path: '#' },
      { label: 'Settings', icon: '⚙️', path: '#' },
    ],
  };

  const sidebarLinks = sidebarItems[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="md:flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 w-64 bg-slate-900 text-white min-h-screen transform transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6" />
            <span className="text-lg font-bold">EDUGUARD</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1">
          {sidebarLinks.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.path !== '#') navigate(item.path);
              }}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition mb-2 flex items-center gap-3"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setAlertsOpen(!alertsOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Alert Dropdown */}
              {alertsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {alerts.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No alerts</div>
                    ) : (
                      alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                            !alert.isRead ? 'bg-blue-50 font-semibold' : ''
                          }`}
                          onClick={() => markAlertAsRead(alert.id)}
                        >
                          <p className="text-sm text-gray-900">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.role}</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
