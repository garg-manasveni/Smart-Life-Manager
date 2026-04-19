import React, { useState, useEffect } from 'react';
import { useMoods } from '../hooks/useData';
import { Plus, TrendingUp } from 'lucide-react';
import MainLayout from '../components/common/MainLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Mood() {
  const { moods, addMoodEntry, loadMoods } = useMoods();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: 3,
    notes: '',
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Generate chart data
    const sortedMoods = [...moods]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7);

    const data = sortedMoods.map(mood => ({
      date: new Date(mood.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: mood.mood || 0,
      emoji: getMoodEmoji(mood.mood),
    }));

    setChartData(data);
  }, [moods]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addMoodEntry({
      date: formData.date,
      mood: parseInt(formData.mood),
      notes: formData.notes,
    });

    setFormData({
      date: new Date().toISOString().split('T')[0],
      mood: 3,
      notes: '',
    });
    setShowForm(false);

    // Reload moods
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    await loadMoods(thirtyDaysAgo, today);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getMoodEmoji = (mood) => {
    if (mood >= 4) return '😊';
    if (mood >= 3) return '😐';
    if (mood >= 2) return '😟';
    return '😢';
  };

  const getMoodLabel = (mood) => {
    if (mood >= 4) return 'Excellent';
    if (mood >= 3) return 'Good';
    if (mood >= 2) return 'Okay';
    return 'Poor';
  };

  const avgMood = moods.length > 0 ? (moods.reduce((acc, m) => acc + (m.mood || 0), 0) / moods.length) : 0;
  const bestMood = moods.length > 0 ? Math.max(...moods.map(m => m.mood || 0)) : 0;
  const worstMood = moods.length > 0 ? Math.min(...moods.map(m => m.mood || 0)) : 0;

  const moodDistribution = {
    excellent: moods.filter(m => m.mood >= 4).length,
    good: moods.filter(m => m.mood >= 3 && m.mood < 4).length,
    okay: moods.filter(m => m.mood >= 2 && m.mood < 3).length,
    poor: moods.filter(m => m.mood < 2).length,
  };

  const distributionData = [
    { name: 'Excellent 😊', value: moodDistribution.excellent },
    { name: 'Good 😐', value: moodDistribution.good },
    { name: 'Okay 😟', value: moodDistribution.okay },
    { name: 'Poor 😢', value: moodDistribution.poor },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">😊 Mood Tracker</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Log Mood
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 mb-2">Average Mood</p>
            <p className="text-4xl font-bold text-purple-600">{Math.round(avgMood * 10) / 10}/5</p>
            <p className="text-2xl mt-2">{getMoodEmoji(avgMood)}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-2">Best Mood</p>
            <p className="text-4xl font-bold text-green-600">{bestMood}/5</p>
            <p className="text-2xl mt-2">😊</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow p-6 border-l-4 border-orange-500">
            <p className="text-sm text-gray-600 mb-2">Lowest Mood</p>
            <p className="text-4xl font-bold text-orange-600">{worstMood}/5</p>
            <p className="text-2xl mt-2">{getMoodEmoji(worstMood)}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-2">Entries</p>
            <p className="text-4xl font-bold text-blue-600">{moods.length}</p>
            <p className="text-xs text-gray-600 mt-2">mood entries</p>
          </div>
        </div>

        {/* Add Mood Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Log Your Mood</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">How are you feeling? *</label>
                <div className="flex justify-between items-center gap-4">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, mood: level }))}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg transition ${
                        formData.mood === level
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-4xl">{getMoodEmoji(level)}</span>
                      <span className="text-sm font-semibold">{getMoodLabel(level)}</span>
                      <span className="text-xs">{level}</span>
                    </button>
                  ))}
                </div>
              </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="What's on your mind?"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save Mood
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
          {/* Mood Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📈 Mood Trend (Last 7 Days)</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No mood data yet</p>
            )}
          </div>

          {/* Mood Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📊 Mood Distribution</h2>
            {moods.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No mood data yet</p>
            )}
          </div>
        </div>

        {/* Recent Entries */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📔 Recent Mood Entries</h2>
          {moods.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No mood entries yet. Start tracking your mood!</p>
          ) : (
            <div className="space-y-3">
              {[...moods].reverse().map((entry, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {getMoodLabel(entry.mood)} ({entry.mood}/5)
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(entry.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {entry.notes && (
                        <p className="text-gray-700 text-sm mt-2 italic">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
