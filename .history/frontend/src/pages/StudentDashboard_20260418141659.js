import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../services/authContext';
import { riskAPI, alertAPI } from '../services/api';
import { getRiskColor, getRiskLevel, getRiskBadgeColor, formatDate } from '../utils/helpers';
import DashboardLayout from '../components/DashboardLayout';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [riskData, setRiskData] = useState(null);
  const [riskHistory, setRiskHistory] = useState([]);
  const [academicData, setAcademicData] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [activeTab, setActiveTab] = useState('Subjects');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sliders, setSliders] = useState({
    attendance: 75,
    assignmentsPending: 2,
    marksImprovement: 0,
  });

  useEffect(() => {
    loadData();
    loadAlerts();
  }, [user]);

  const loadData = async () => {
    try {
      // Mock data for demo - in production would fetch from API
      setRiskData({
        studentId: 'mock-id',
        score: Math.floor(Math.random() * 100),
        level: 'Medium',
        attendanceRisk: 45,
        marksRisk: 35,
        assignmentRisk: 28,
        lmsRisk: 22,
      });

      setRiskHistory(
        Array.from({ length: 8 }, (_, i) => ({
          week: `Week ${i + 1}`,
          score: Math.floor(Math.random() * 60) + 30,
        }))
      );

      setAcademicData({
        subjects: [
          { id: 1, name: 'Data Structures', teacher: 'Dr. Smith', credits: 4, status: 'Active' },
          { id: 2, name: 'Algorithms', teacher: 'Dr. Johnson', credits: 3, status: 'Active' },
        ],
        assignments: [
          { id: 1, title: 'Assignment 1', subject: 'Data Structures', dueDate: '2024-12-25', status: 'Pending', marks: null },
          { id: 2, title: 'Assignment 2', subject: 'Algorithms', dueDate: '2024-12-20', status: 'Submitted', marks: 45 },
        ],
        attendance: [
          { subject: 'Data Structures', attended: 32, total: 40, percentage: 80 },
          { subject: 'Algorithms', attended: 35, total: 40, percentage: 87.5 },
        ],
        marks: [
          { subject: 'Data Structures', mid1: 40, mid2: 42, internal: 85, viva: 18, total: 125 },
          { subject: 'Algorithms', mid1: 38, mid2: 40, internal: 80, viva: 16, total: 118 },
        ],
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const loadAlerts = async () => {
    try {
      // Mock alerts
      setAlerts([
        {
          id: 1,
          message: 'Your attendance in Mathematics dropped below 75%',
          timestamp: new Date(),
          isRead: false,
        },
        {
          id: 2,
          message: '2 assignments are due in 48 hours',
          timestamp: new Date(Date.now() - 3600000),
          isRead: true,
        },
      ]);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const handleSimulate = async () => {
    try {
      // Mock simulation
      const currentScore = riskData.score;
      const newScore = Math.max(0, Math.min(100, currentScore - 15));

      setSimulationResult({
        currentScore,
        projectedScore: newScore,
        improvement: currentScore - newScore,
      });
    } catch (error) {
      console.error('Error simulating:', error);
    }
  };

  const actionPlans = [
    { action: 'Attend next 5 classes in Mathematics', impact: 12, done: false },
    { action: 'Complete pending assignments', impact: 8, done: false },
    { action: 'Join study group sessions', impact: 6, done: true },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Risk Score Card */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center border-l-4 border-indigo-600">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="60" fill="none" stroke="#e0e7ff" strokeWidth="8" />
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  fill="none"
                  stroke={getRiskColor(riskData.score)}
                  strokeWidth="8"
                  strokeDasharray={`${(riskData.score / 100) * 377} 377`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{riskData.score}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-2">Current Risk Score</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRiskBadgeColor(riskData.score)}`}>
              {getRiskLevel(riskData.score)} Risk
            </span>
          </div>

          {/* Risk Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4">Risk Breakdown</h3>
            <div className="space-y-2">
              {[
                { label: 'Attendance Risk', value: riskData.attendanceRisk, weight: '40%' },
                { label: 'Marks Risk', value: riskData.marksRisk, weight: '30%' },
                { label: 'Assignment Risk', value: riskData.assignmentRisk, weight: '20%' },
                { label: 'LMS Risk', value: riskData.lmsRisk, weight: '10%' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-gray-900">{item.value.toFixed(0)}</p>
                    <p className="text-xs text-gray-500">{item.weight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Explanation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: 'Attendance', value: '68%', impact: '+28', desc: 'Below 75% threshold' },
            { title: 'Marks', value: '52', impact: '+22', desc: 'Internal assessment average' },
            { title: 'Assignments', value: '2 pending', impact: '+15', desc: 'Out of 5 total' },
          ].map((card, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <h4 className="font-semibold text-gray-900 mb-2">{card.title}</h4>
              <p className="text-2xl font-bold text-gray-900 mb-2">{card.value}</p>
              <p className="text-sm text-gray-600 mb-3">{card.desc}</p>
              <div className="inline-block px-2 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded">
                Contributes {card.impact} points
              </div>
            </div>
          ))}
        </div>

        {/* Action Plan */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Personalized Action Plan</h3>
          <div className="space-y-3">
            {actionPlans.map((plan, idx) => (
              <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  defaultChecked={plan.done}
                  className="w-5 h-5 text-indigo-600 rounded outline-none"
                />
                <div className="flex-1 ml-4">
                  <p className={`font-medium ${plan.done ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {plan.action}
                  </p>
                </div>
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded">
                  -{plan.impact} points
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* What-If Simulation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-6">Simulate Your Future Score</h3>
          <div className="space-y-6">
            {[
              { label: 'Attendance', key: 'attendance', min: 0, max: 100, unit: '%' },
              { label: 'Pending Assignments', key: 'assignmentsPending', min: 0, max: 5, unit: '' },
              { label: 'Marks Improvement', key: 'marksImprovement', min: 0, max: 20, unit: 'pts' },
            ].map((slider, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">{slider.label}</label>
                  <span className="text-sm font-bold text-indigo-600">
                    {sliders[slider.key]} {slider.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  value={sliders[slider.key]}
                  onChange={(e) => setSliders({ ...sliders, [slider.key]: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}

            <button
              onClick={handleSimulate}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Simulate & See Impact
            </button>

            {simulationResult && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-gray-600 text-sm">Current Score</p>
                    <p className="text-2xl font-bold text-gray-900">{simulationResult.currentScore}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Projected Score</p>
                    <p className="text-2xl font-bold text-green-600">{simulationResult.projectedScore}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Improvement</p>
                    <p className="text-2xl font-bold text-green-600">↓ {simulationResult.improvement}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Graph */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">8-Week Risk Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={riskHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
              <Line type="monotone" dataKey="threshold" stroke="#ef4444" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Academic Data Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {['Subjects', 'Assignments', 'Attendance', 'Marks'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold transition border-b-2 ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Subjects Table */}
          {activeTab === 'Subjects' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Subject</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Teacher</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Credits</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {academicData.subjects.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                      <td className="px-4 py-3 text-gray-600">{row.teacher}</td>
                      <td className="px-4 py-3 text-gray-600">{row.credits}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Assignments Table */}
          {activeTab === 'Assignments' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Assignment</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Subject</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Due Date</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {academicData.assignments.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.title}</td>
                      <td className="px-4 py-3 text-gray-600">{row.subject}</td>
                      <td className="px-4 py-3 text-gray-600">{row.dueDate}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            row.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900">{row.marks ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Attendance Table */}
          {activeTab === 'Attendance' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Subject</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Attended</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Total</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Percentage</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {academicData.attendance.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.subject}</td>
                      <td className="px-4 py-3 text-gray-600">{row.attended}</td>
                      <td className="px-4 py-3 text-gray-600">{row.total}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.percentage}%</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            row.percentage >= 75
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {row.percentage >= 75 ? 'Good' : 'Low'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Marks Table */}
          {activeTab === 'Marks' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Subject</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Mid 1</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Mid 2</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Internal</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Viva</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {academicData.marks.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.subject}</td>
                      <td className="px-4 py-3 text-gray-600">{row.mid1}</td>
                      <td className="px-4 py-3 text-gray-600">{row.mid2}</td>
                      <td className="px-4 py-3 text-gray-600">{row.internal}</td>
                      <td className="px-4 py-3 text-gray-600">{row.viva}</td>
                      <td className="px-4 py-3 text-gray-900 font-bold">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
