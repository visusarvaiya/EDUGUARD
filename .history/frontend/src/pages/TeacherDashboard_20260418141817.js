import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Upload, Plus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const TeacherDashboard = () => {
  const [selectedSubject, setSelectedSubject] = useState('Data Structures');

  const subjects = ['Data Structures', 'Algorithms', 'Database Management'];

  const stats = [
    { label: 'Class Average', value: '72%', icon: '📊' },
    { label: 'Assignment Completion', value: '85%', icon: '✅' },
    { label: 'Below Passing', value: '8', icon: '⚠️' },
    { label: 'At-Risk Students', value: '5', icon: '📉' },
  ];

  const marksDistribution = [
    { name: '0-40', value: 3 },
    { name: '41-60', value: 8 },
    { name: '61-80', value: 15 },
    { name: '81-100', value: 9 },
  ];

  const assignmentStatus = [
    { name: 'Submitted', value: 28, fill: '#22c55e' },
    { name: 'Pending', value: 5, fill: '#f59e0b' },
    { name: 'Late', value: 2, fill: '#ef4444' },
  ];

  const assessmentData = [
    { assess: 'Assessment 1', avg: 65 },
    { assess: 'Assessment 2', avg: 68 },
    { assess: 'Assessment 3', avg: 72 },
    { assess: 'Assessment 4', avg: 75 },
  ];

  const performanceTable = [
    { id: 1, name: 'John Doe', mid1: 40, mid2: 42, internal: 85, assignment: 'Submitted', atRisk: true },
    { id: 2, name: 'Jane Smith', mid1: 38, mid2: 40, internal: 80, assignment: 'Submitted', atRisk: false },
    { id: 3, name: 'Mike Johnson', mid1: 35, mid2: 38, internal: 75, assignment: 'Pending', atRisk: true },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Subject Selector */}
        <div className="mb-6 flex items-center gap-4">
          <label className="font-semibold text-gray-700">Select Subject:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Data Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Data Upload</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CSV Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="font-semibold text-gray-700">CSV Upload</p>
              <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
              <input type="file" accept=".csv" className="hidden" />
            </div>

            {/* Manual Entry */}
            <div className="border-2 border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition cursor-pointer">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="font-semibold text-gray-700">Manual Entry</p>
              <p className="text-sm text-gray-600">Add data directly in spreadsheet</p>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p className="font-semibold mb-2">📁 Recent Uploads:</p>
            <ul className="space-y-1">
              <li>• marks_data_20241220.csv (35 records)</li>
              <li>• assignments_update_20241219.csv (28 records)</li>
            </ul>
          </div>
        </div>

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Marks Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Marks Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marksDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Assignment Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Assignment Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={assignmentStatus} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {assignmentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Assessment Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Assessment Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assessmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="assess" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avg" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Student Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Student</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Mid 1</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Mid 2</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Internal</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Assignment</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">At-Risk</th>
                </tr>
              </thead>
              <tbody>
                {performanceTable.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                    <td className="px-4 py-3 text-gray-600">{row.mid1}</td>
                    <td className="px-4 py-3 text-gray-600">{row.mid2}</td>
                    <td className="px-4 py-3 text-gray-600">{row.internal}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          row.assignment === 'Submitted'
                            ? 'bg-green-100 text-green-800'
                            : row.assignment === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {row.assignment}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {row.atRisk ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">⚠️ Yes</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">✓ No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
