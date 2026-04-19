import React, { useState } from 'react';
import { useHabits } from '../hooks/useData';
import { Plus, Trash2, Flame, Check } from 'lucide-react';
import MainLayout from '../components/common/MainLayout';

export default function Habits() {
  const { habits, createHabit, completeHabit, removeHabit } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    color: 'blue',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter habit name');
      return;
    }
    
    await createHabit(formData);
    setFormData({ name: '', description: '', frequency: 'daily', color: 'blue' });
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCompleteHabit = async (habit) => {
    await completeHabit(habit.id, habit);
  };

  const getStreakEmoji = (streak) => {
    if (streak === 0) return '🌱';
    if (streak < 7) return '📈';
    if (streak < 30) return '🔥';
    return '🚀';
  };

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-300',
    purple: 'bg-purple-50 border-purple-300',
    green: 'bg-green-50 border-green-300',
    yellow: 'bg-yellow-50 border-yellow-300',
    red: 'bg-red-50 border-red-300',
  };

  const habitsByStreak = [...habits].sort((a, b) => (b.streak || 0) - (a.streak || 0));

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">🔥 Habit Tracker</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Add Habit
          </button>
        </div>

        {/* Add Habit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Create New Habit</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Habit Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Morning Exercise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                    <option value="red">Red</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Why do you want this habit?"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create Habit
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

        {/* Habits Grid */}
        <div className="space-y-4">
          {habitsByStreak.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 text-lg mb-4">No habits yet. Start building good habits! 💪</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={20} />
                Create First Habit
              </button>
            </div>
          ) : (
            habitsByStreak.map(habit => {
              const today = new Date().toISOString().split('T')[0];
              const completedToday = habit.completionHistory?.includes(today);

              return (
                <div
                  key={habit.id}
                  className={`bg-white rounded-lg shadow p-6 border-l-4 ${colorClasses[habit.color || 'blue']} hover:shadow-lg transition`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{habit.name}</h3>
                        <span className="text-2xl">{getStreakEmoji(habit.streak || 0)}</span>
                      </div>

                      {habit.description && (
                        <p className="text-gray-600 text-sm mb-3">{habit.description}</p>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600">Current Streak</p>
                          <p className="text-2xl font-bold text-blue-600">{habit.streak || 0}</p>
                          <p className="text-xs text-gray-600">days</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600">Total Days</p>
                          <p className="text-2xl font-bold text-purple-600">{habit.totalDays || 0}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600">Frequency</p>
                          <p className="text-lg font-bold text-green-600 capitalize">{habit.frequency || 'Daily'}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600">Last Completed</p>
                          <p className="text-sm font-bold text-orange-600">
                            {habit.lastCompletedDate
                              ? new Date(habit.lastCompletedDate.toDate?.() || habit.lastCompletedDate).toLocaleDateString()
                              : 'Never'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleCompleteHabit(habit)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                          completedToday
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        <Check size={18} />
                        {completedToday ? 'Done' : 'Complete'}
                      </button>
                      <button
                        onClick={() => removeHabit(habit.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
}
