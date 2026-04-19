import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Share2, TrendingUp } from 'lucide-react';
import MainLayout from '../components/common/MainLayout';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';

export default function Reports() {
  const { tasks, habits, studyLogs, moods } = useApp();
  const [weekNumber, setWeekNumber] = useState(0);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    generateWeeklyReport();
  }, [tasks, habits, studyLogs, moods]);

  const getWeekDates = (weeksAgo) => {
    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const daysBack = currentDayOfWeek + weeksAgo * 7;
    const startDate = new Date(now.setDate(now.getDate() - daysBack));
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  };

  const generateWeeklyReport = () => {
    const { startDate, endDate } = getWeekDates(weekNumber);

    // Filter data for the week
    const weekTasks = tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate >= startDate && dueDate <= endDate;
    });

    const completedTasks = weekTasks.filter(t => t.completed).length;
    const taskCompletionRate = weekTasks.length > 0 ? (completedTasks / weekTasks.length) * 100 : 0;

    const weekStudyLogs = studyLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= startDate && logDate <= endDate;
    });

    const totalStudyMinutes = weekStudyLogs.reduce((acc, log) => acc + (log.duration || 0), 0);
    const totalStudyHours = Math.round((totalStudyMinutes / 60) * 10) / 10;

    const weekMoods = moods.filter(mood => {
      const moodDate = new Date(mood.date);
      return moodDate >= startDate && moodDate <= endDate;
    });

    const avgMood = weekMoods.length > 0 ? Math.round((weekMoods.reduce((acc, m) => acc + (m.mood || 0), 0) / weekMoods.length) * 10) / 10 : 0;

    const habitActivities = habits.map(habit => {
      const completedDays = habit.completionHistory?.filter(date => {
        const d = new Date(date);
        return d >= startDate && d <= endDate;
      }).length || 0;
      return {
        name: habit.name,
        completedDays,
        streak: habit.streak || 0,
      };
    });

    const studyBySubject = {};
    weekStudyLogs.forEach(log => {
      const subject = log.subject || 'Other';
      studyBySubject[subject] = (studyBySubject[subject] || 0) + (log.duration || 0);
    });

    const subjectData = Object.entries(studyBySubject)
      .map(([subject, duration]) => ({
        subject,
        hours: Math.round((duration / 60) * 10) / 10,
      }))
      .sort((a, b) => b.hours - a.hours);

    setReportData({
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      taskCompletionRate: Math.round(taskCompletionRate),
      completedTasks,
      totalTasks: weekTasks.length,
      totalStudyHours,
      studySessionsCount: weekStudyLogs.length,
      avgMood,
      habitActivities,
      subjectData,
      weekMoods: weekMoods.length,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const generatePDF = () => {
    // This is a simple text export. In a production app, use libraries like jsPDF
    const reportText = `
SMART LIFE MANAGER - WEEKLY REPORT
${reportData?.period}

TASK SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tasks Completed: ${reportData?.completedTasks}/${reportData?.totalTasks}
Completion Rate: ${reportData?.taskCompletionRate}%

STUDY SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Study Hours: ${reportData?.totalStudyHours} hours
Study Sessions: ${reportData?.studySessionsCount}

${reportData?.subjectData.length > 0 ? `STUDY BY SUBJECT
${reportData?.subjectData.map(s => `${s.subject}: ${s.hours} hours`).join('\n')}` : ''}

MOOD TRACKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Average Mood: ${reportData?.avgMood}/5
Mood Entries: ${reportData?.weekMoods}

HABIT TRACKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${reportData?.habitActivities.map(h => `${h.name}: ${h.completedDays} days completed (Streak: ${h.streak})`).join('\n')}
    `;

    // Create a blob and download
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-report-${reportData?.period}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!reportData) {
    return <MainLayout>Loading...</MainLayout>;
  }

  const getMoodEmoji = (mood) => {
    if (mood >= 4) return '😊';
    if (mood >= 3) return '😐';
    if (mood >= 2) return '😟';
    return '😢';
  };

  const pieChartData = [
    { name: 'Completed', value: reportData.completedTasks, color: '#10b981' },
    { name: 'Pending', value: reportData.totalTasks - reportData.completedTasks, color: '#ef4444' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📊 Weekly Reports</h1>
          <p className="text-gray-600 mt-2">Comprehensive analysis of your week</p>
        </div>

        {/* Week Navigation */}
        <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
          <button
            onClick={() => setWeekNumber(weekNumber + 1)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            ← Previous Week
          </button>
          <h2 className="text-lg font-bold text-gray-800">{reportData.period}</h2>
          <button
            onClick={() => setWeekNumber(Math.max(0, weekNumber - 1))}
            disabled={weekNumber === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Week →
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Download size={20} />
            Print Report
          </button>
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Share2 size={20} />
            Export as Text
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-2">Task Completion</p>
            <p className="text-4xl font-bold text-blue-600">{reportData.taskCompletionRate}%</p>
            <p className="text-sm text-gray-600 mt-2">{reportData.completedTasks}/{reportData.totalTasks} tasks</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-2">Study Hours</p>
            <p className="text-4xl font-bold text-green-600">{reportData.totalStudyHours}h</p>
            <p className="text-sm text-gray-600 mt-2">{reportData.studySessionsCount} sessions</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 mb-2">Average Mood</p>
            <p className="text-4xl font-bold text-purple-600">{reportData.avgMood}/5</p>
            <p className="text-2xl mt-2">{getMoodEmoji(reportData.avgMood)}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600 mb-2">Mood Entries</p>
            <p className="text-4xl font-bold text-yellow-600">{reportData.weekMoods}</p>
            <p className="text-sm text-gray-600 mt-2">entries logged</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Completion Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">✅ Task Completion Status</h2>
            {reportData.totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieChartData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No task data this week</p>
            )}
          </div>

          {/* Study by Subject */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📚 Study Distribution</h2>
            {reportData.subjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.subjectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No study data this week</p>
            )}
          </div>
        </div>

        {/* Habit Tracking */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🔥 Habit Tracking</h2>
          {reportData.habitActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportData.habitActivities.map((habit, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{habit.name}</h3>
                    <span className="text-2xl">🔥</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {habit.completedDays} days completed this week
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition"
                      style={{ width: `${(habit.completedDays / 7) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Current streak: {habit.streak} days</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No habits tracked</p>
          )}
        </div>

        {/* Summary Notes */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow p-6 border-l-4 border-indigo-500">
          <h2 className="text-lg font-bold text-gray-800 mb-4">💡 Weekly Summary</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ You completed {reportData.taskCompletionRate}% of your tasks this week</li>
            <li>📚 You studied for {reportData.totalStudyHours} hours across {reportData.studySessionsCount} sessions</li>
            <li>😊 Your average mood this week was {reportData.avgMood}/5</li>
            {reportData.taskCompletionRate > 80 && <li>🌟 Excellent task completion! Keep up the momentum!</li>}
            {reportData.totalStudyHours > 15 && <li>📖 You're investing great time in studies!</li>}
            {reportData.avgMood >= 3.5 && <li>😊 You're maintaining a positive mood. Great work!</li>}
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
