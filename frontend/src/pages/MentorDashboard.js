import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, ChevronRight } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const MentorDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showInterventionModal, setShowInterventionModal] = useState(false);

  // Mock data
  const stats = [
    { label: 'Total Students', value: '45', icon: '👥' },
    { label: 'High Risk', value: '12', icon: '⚠️' },
    { label: 'This Month', value: '8', icon: '📋' },
    { label: 'Improved', value: '5', icon: '📈' },
  ];

  const atRiskStudents = [
    { id: 1, name: 'John Doe', score: 72, reason: 'Low Attendance', date: '2024-12-20' },
    { id: 2, name: 'Jane Smith', score: 68, reason: 'Low Marks', date: '2024-12-19' },
    { id: 3, name: 'Mike Johnson', score: 75, reason: 'Multiple Issues', date: '2024-12-18' },
  ];

  const riskDistribution = [
    { name: 'High', value: 12, fill: '#ef4444' },
    { name: 'Medium', value: 20, fill: '#f59e0b' },
    { name: 'Low', value: 13, fill: '#22c55e' },
  ];

  const interventionTypes = [
    { name: 'Counselling', value: 15 },
    { name: 'Remedial Class', value: 12 },
    { name: 'Assignment Ext.', value: 8 },
    { name: 'Parent Meeting', value: 5 },
  ];

  const trendData = [
    { week: 'Week 1', avgRisk: 55 },
    { week: 'Week 2', avgRisk: 58 },
    { week: 'Week 3', avgRisk: 52 },
    { week: 'Week 4', avgRisk: 49 },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Risk Distribution Pie */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Intervention Types Bar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Intervention Effectiveness</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={interventionTypes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-8">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">8 Students at High Risk This Week</h4>
              <p className="text-sm text-red-700 mt-1">3 became high risk for the first time. Review and take immediate action.</p>
            </div>
          </div>
        </div>

        {/* At-Risk Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Students at High Risk</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Risk Score</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Top Reason</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Flagged</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {atRiskStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                        {student.score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{student.reason}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{student.date}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setShowInterventionModal(true)}
                        className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs"
                      >
                        Log Intervention <ChevronRight className="w-3 h-3 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Intervention Modal */}
        {showInterventionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Log Intervention</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Intervention Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Counselling</option>
                    <option>Remedial Class</option>
                    <option>Assignment Extension</option>
                    <option>Parent Meeting</option>
                    <option>Extra Study Session</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Min 20 chars)</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" rows="3" placeholder="Enter intervention details..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Outcome</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Attendance Improvement</option>
                    <option>Marks Recovery</option>
                    <option>Assignment Completion</option>
                    <option>General Support</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="followup" className="w-4 h-4" />
                  <label htmlFor="followup" className="text-sm text-gray-700">
                    Schedule a follow-up
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowInterventionModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    Log Intervention
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MentorDashboard;
