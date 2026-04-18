import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const CoordinatorDashboard = () => {
  const [department, setDepartment] = useState('All');
  const [semester, setSemester] = useState('All');

  const summaryCards = [
    { label: 'Total Students', value: '360', icon: '👥' },
    { label: '% High Risk', value: '18%', icon: '⚠️' },
    { label: '% Improved', value: '35%', icon: '📈' },
    { label: 'Interventions', value: '127', icon: '🛠️' },
  ];

  const riskByDepartment = [
    { dept: 'CS', high: 12, medium: 18, low: 20 },
    { dept: 'IT', high: 10, medium: 16, low: 24 },
    { dept: 'EC', high: 8, medium: 14, low: 23 },
  ];

  const institutionTrend = [
    { week: 'Week 1', avgRisk: 58 },
    { week: 'Week 2', avgRisk: 56 },
    { week: 'Week 3', avgRisk: 54 },
    { week: 'Week 4', avgRisk: 52 },
    { week: 'Week 5', avgRisk: 50 },
    { week: 'Week 6', avgRisk: 48 },
    { week: 'Week 7', avgRisk: 47 },
    { week: 'Week 8', avgRisk: 46 },
    { week: 'Week 9', avgRisk: 45 },
    { week: 'Week 10', avgRisk: 44 },
    { week: 'Week 11', avgRisk: 43 },
    { week: 'Week 12', avgRisk: 42 },
  ];

  const interventionTypes = [
    { name: 'Counselling', value: 35, fill: '#6366f1' },
    { name: 'Remedial', value: 28, fill: '#ec4899' },
    { name: 'Extension', value: 22, fill: '#f59e0b' },
    { name: 'Parent Meet', value: 18, fill: '#10b981' },
    { name: 'Study Group', value: 24, fill: '#06b6d4' },
  ];

  const topAtRiskSubjects = [
    { subject: 'Advanced Mathematics', count: 18 },
    { subject: 'Data Structures', count: 15 },
    { subject: 'Algorithms', count: 12 },
    { subject: 'Database Systems', count: 10 },
    { subject: 'Operating Systems', count: 9 },
  ];

  const systemicIssues = [
    {
      issue: '2nd year CS students show consistently low scores in Mathematics',
      impact: '3 consecutive semesters',
      action: '📊 Review curriculum',
    },
    {
      issue: 'Assignment completion rate in IT dropped 20% this month',
      impact: 'Urgent - 35 pending',
      action: '⏰ Extend deadlines',
    },
    {
      issue: 'Electronics department showing improvement post-intervention',
      impact: 'Positive - 40% improvement rate',
      action: '✅ Continue strategy',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>All</option>
              <option>Computer Engineering</option>
              <option>Information Technology</option>
              <option>Electronics</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>All</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl mb-2">{card.icon}</div>
              <p className="text-gray-600 text-sm mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Risk by Department */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Risk Distribution by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskByDepartment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dept" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="high" fill="#ef4444" />
                <Bar dataKey="medium" fill="#f59e0b" />
                <Bar dataKey="low" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Institution Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Institution Trend (12 Weeks)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={institutionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgRisk" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* More Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Intervention Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Intervention Types</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={interventionTypes} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {interventionTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top At-Risk Subjects */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Top At-Risk Subjects</h3>
            <div className="space-y-3">
              {topAtRiskSubjects.map((subject, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{subject.subject}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="h-2 rounded-full bg-red-500"
                        style={{ width: `${(subject.count / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">{subject.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Systemic Issues */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Detected Systemic Issues
          </h3>
          <div className="space-y-4">
            {systemicIssues.map((issue, idx) => (
              <div key={idx} className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                <p className="font-medium text-gray-900">{issue.issue}</p>
                <p className="text-sm text-gray-600 mt-1">Impact: {issue.impact}</p>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold mt-2">
                  {issue.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Downloadable Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition font-medium">
              <Download className="w-5 h-5" />
              Download PDF Report
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition font-medium">
              <Download className="w-5 h-5" />
              Download CSV Data
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorDashboard;
