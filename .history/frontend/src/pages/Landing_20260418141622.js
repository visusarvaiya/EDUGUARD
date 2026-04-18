import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [taglineIndex, setTaglineIndex] = useState(0);

  const taglines = [
    'Our system doesn\'t just detect risk — it predicts and prevents it',
    'We provide explainable insights, not black-box scores',
    'We track intervention effectiveness, not just suggestions',
    'We simulate future outcomes before they happen',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [taglines.length]);

  const features = [
    { icon: '🤖', title: 'AI Risk Prediction', desc: 'Advanced algorithms detect at-risk students early' },
    { icon: '⚠️', title: 'Early Warning System', desc: 'Real-time alerts notify mentors immediately' },
    { icon: '📋', title: 'Personalized Action Plans', desc: 'Customized interventions for each student' },
    { icon: '📊', title: 'Intervention Tracking', desc: 'Monitor effectiveness of all interventions' },
  ];

  const roles = [
    { icon: '👤', title: 'Student', desc: 'Monitor your progress and track improvements' },
    { icon: '👨‍🏫', title: 'Faculty Mentor', desc: 'Manage at-risk students and interventions' },
    { icon: '📚', title: 'Teacher', desc: 'Upload marks and track performance' },
    { icon: '🏫', title: 'Coordinator', desc: 'Institution-wide analytics and insights' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">AcadWatch</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Predict Academic Risk
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
              Before It's Too Late
            </span>
          </h1>

          {/* Rotating Taglines */}
          <div className="h-16 mb-12 flex items-center justify-center">
            <p
              key={taglineIndex}
              className="text-xl text-gray-600 max-w-2xl animate-fade-in"
              style={{
                animation: 'fadeInOut 3s ease-in-out',
              }}
            >
              "{taglines[taglineIndex]}"
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition transform hover:scale-105"
          >
            Get Started
          </button>

          {/* feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-16">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition border border-gray-100"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Upload Data', desc: 'Feed student attendance, marks, and engagement data' },
              { step: '2', title: 'Generate Risk Score', desc: 'AI analyzes patterns and calculates risk levels' },
              { step: '3', title: 'Take Action', desc: 'Mentors log interventions and track progress' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who Uses It */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Who Uses AcadWatch</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {roles.map((role, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition border-l-4 border-indigo-600 text-center"
              >
                <div className="text-4xl mb-4">{role.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{role.title}</h3>
                <p className="text-gray-600 text-sm">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8 px-6 text-center">
        <p className="text-gray-400">
          AcadWatch © 2024 - Hackathon Winning Project for Academic Excellence
        </p>
      </div>

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Landing;
