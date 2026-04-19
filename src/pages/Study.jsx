import React, { useState, useEffect } from 'react';
import { useStudyLogs } from '../hooks/useData';
import { Plus, Trash2, BookOpen, TrendingUp } from 'lucide-react';
import MainLayout from '../components/common/MainLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Study() {
  const { studyLogs, addStudyLog, loadStudyLogs } = useStudyLogs();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '',
    subject: '',
    notes: '',
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Generate chart data from study logs
    const groupedByDate = {};
    const groupedBySubject = {};

    studyLogs.forEach(log => {
      const date = log.date;
      if (!groupedByDate[date]) {
        groupedByDate[date] = 0;
      }
      groupedByDate[date] += log.duration || 0;

      const subject = log.subject || 'Other';
      if (!groupedBySubject[subject]) {
        groupedBySubject[subject] = 0;
      }
      groupedBySubject[subject] += log.duration || 0;
    });

    const dateChartData = Object.entries(groupedByDate)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .slice(-7)
      .map(([date, duration]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        'Hours': Math.round((duration / 60) * 10) / 10,
        'Minutes': duration,
      }));

    setChartData(dateChartData);
  }, [studyLogs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.duration || !formData.subject) {
      alert('Please fill in all required fields');
      return;
    }
    
    await addStudyLog({
      date: formData.date,
      duration: parseInt(formData.duration),
      subject: formData.subject,
      notes: formData.notes,
    });

    setFormData({
      date: new Date().toISOString().split('T')[0],
      duration: '',
      subject: '',
      notes: '',
    });
    setShowForm(false);

    // Reload logs for the week
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    await loadStudyLogs(sevenDaysAgo, today);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const totalHours = studyLogs.reduce((acc, log) => acc + (log.duration || 0), 0) / 60;
  const avgHoursPerDay = studyLogs.length > 0 ? totalHours / 7 : 0;
  const studyBySubject = {};

  studyLogs.forEach(log => {
    const subject = log.subject || 'Other';
    studyBySubject[subject] = (studyBySubject[subject] || 0) + (log.duration || 0);
  });

  const subjectData = Object.entries(studyBySubject)
    .map(([subject, duration]) => ({
      subject,
      hours: Math.round((duration / 60) * 10) / 10,
    }))
    .sort((a, b) => b.hours - a.hours);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">📚 Study Hours Tracker</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Log Study Session
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-2">Total Study Hours (7 days)</p>
            <p className="text-4xl font-bold text-blue-600">{Math.round(totalHours * 10) / 10}</p>
            <p className="text-xs text-gray-600 mt-2">hours</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 mb-2">Average Per Day</p>
            <p className="text-4xl font-bold text-purple-600">{Math.round(avgHoursPerDay * 10) / 10}</p>
            <p className="text-xs text-gray-600 mt-2">hours</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-2">Study Sessions</p>
            <p className="text-4xl font-bold text-green-600">{studyLogs.length}</p>
            <p className="text-xs text-gray-600 mt-2">sessions</p>
          </div>
        </div>

        {/* Add Study Log Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Log Study Session</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., 60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Mathematics"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="What did you study?"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Log Session
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Study Hours Over Time */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📈 Study Hours (Last 7 Days)</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Hours" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No data yet</p>
            )}
          </div>

          {/* Study by Subject */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📚 Study Distribution</h2>
            {subjectData.length > 0 ? (
              <div className="space-y-3">
                {subjectData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-700">{item.subject}</span>
                    <span className="text-lg font-bold text-blue-600">{item.hours}h</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No study data yet</p>
            )}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🕐 Recent Sessions</h2>
          {studyLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No study sessions logged yet</p>
          ) : (
            <div className="space-y-2">
              {[...studyLogs].reverse().map((log, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition">
                  <div>
                    <p className="font-semibold text-gray-800">{log.subject}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(log.date).toLocaleDateString()} • {log.duration} minutes
                    </p>
                    {log.notes && <p className="text-sm text-gray-500 mt-1 italic">{log.notes}</p>}
                  </div>
                  <p className="text-lg font-bold text-blue-600">{Math.round((log.duration / 60) * 10) / 10}h</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
