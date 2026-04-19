import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, TrendingUp, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/common/StatCard';
import BurnoutWarning from '../components/common/BurnoutWarning';

export default function Dashboard() {
  const { tasks, habits, studyLogs, moods, burnoutAlerts, checkBurnout } = useApp();
  const [stats, setStats] = useState({
    completedTasks: 0,
    totalTasks: 0,
    completionRate: 0,
    activeHabits: 0,
    bestHabitStreak: 0,
    totalStudyHours: 0,
    avgMood: 0,
  });

  useEffect(() => {
    // Calculate statistics
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const activeHabits = habits.filter(h => h.streak > 0).length;
    const bestHabitStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;

    const totalStudyHours = studyLogs.reduce((acc, log) => acc + (log.duration || 0), 0) / 60;

    const avgMood = moods.length > 0
      ? Math.round((moods.reduce((acc, m) => acc + (m.mood || 0), 0) / moods.length) * 10) / 10
      : 0;

    setStats({
      completedTasks,
      totalTasks,
      completionRate,
      activeHabits,
      bestHabitStreak,
      totalStudyHours: Math.round(totalStudyHours * 10) / 10,
      avgMood,
    });

    // Check burnout every time stats update
    checkBurnout();
  }, [tasks, habits, studyLogs, moods, checkBurnout]);

  const getMoodEmoji = (mood) => {
    if (mood >= 4) return '😊';
    if (mood >= 3) return '😐';
    if (mood >= 2) return '😟';
    return '😢';
  };

  const recentBurnoutAlert = burnoutAlerts.length > 0 ? burnoutAlerts[0] : null;

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-900 to-sky-700 p-8 text-white shadow-2xl ring-1 ring-white/10 overflow-hidden">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="uppercase tracking-[0.3em] text-sky-200 text-xs">Smart Life Dashboard</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">Stay focused, productive, and balanced.</h1>
            <p className="mt-4 text-slate-200 leading-relaxed">See your task completion, habit momentum, study progress, and mood trends in one beautifully organized view.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-[1.5rem] bg-white/10 p-4 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-sky-100">Tasks</p>
              <p className="mt-3 text-2xl font-semibold">{stats.completedTasks}</p>
              <p className="text-xs text-slate-200 mt-1">Completed</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/10 p-4 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-sky-100">Habits</p>
              <p className="mt-3 text-2xl font-semibold">{stats.activeHabits}</p>
              <p className="text-xs text-slate-200 mt-1">Active</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/10 p-4 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-sky-100">Study</p>
              <p className="mt-3 text-2xl font-semibold">{stats.totalStudyHours}h</p>
              <p className="text-xs text-slate-200 mt-1">Logged</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/10 p-4 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-sky-100">Mood</p>
              <p className="mt-3 text-2xl font-semibold">{stats.avgMood}/5</p>
              <p className="text-xs text-slate-200 mt-1">Average</p>
            </div>
          </div>
        </div>
      </section>

      {recentBurnoutAlert && !recentBurnoutAlert.acknowledged && (
        <BurnoutWarning alert={recentBurnoutAlert} />
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            detail={`Tasks: ${stats.completedTasks}/${stats.totalTasks}`}
            subtitle="Overall progress"
            icon={<CheckCircle className="text-blue-500" size={28} />}
            bgColor="bg-gradient-to-br from-sky-50 to-sky-100"
            borderClass="border-sky-200"
          />

          <StatCard
            title="Habit Streak"
            value={`${stats.bestHabitStreak} days`}
            detail={`${stats.activeHabits} active habits`}
            subtitle="Habit momentum"
            icon={<Zap className="text-yellow-500" size={28} />}
            bgColor="bg-gradient-to-br from-amber-50 to-yellow-100"
            borderClass="border-amber-200"
          />

          <StatCard
            title="Weekly Study"
            value={`${stats.totalStudyHours}h`}
            detail={`${studyLogs.length} sessions this week`}
            subtitle="Study time"
            icon={<TrendingUp className="text-emerald-500" size={28} />}
            bgColor="bg-gradient-to-br from-emerald-50 to-emerald-100"
            borderClass="border-emerald-200"
          />

          <StatCard
            title="Mood Score"
            value={`${stats.avgMood}/5`}
            detail="Mood average"
            subtitle={getMoodEmoji(stats.avgMood)}
            icon={<span className="text-3xl">{getMoodEmoji(stats.avgMood)}</span>}
            bgColor="bg-gradient-to-br from-violet-50 to-fuchsia-100"
            borderClass="border-violet-200"
          />
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-xl border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick access</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link
              to="/tasks"
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center text-slate-900 transition hover:bg-slate-100 hover:shadow-md"
            >
              <CheckCircle className="mx-auto text-blue-600" size={24} />
              <p className="mt-3 font-semibold">Tasks</p>
              <p className="text-sm text-slate-500 mt-1">Mark complete items</p>
            </Link>
            <Link
              to="/habits"
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center text-slate-900 transition hover:bg-slate-100 hover:shadow-md"
            >
              <Zap className="mx-auto text-yellow-600" size={24} />
              <p className="mt-3 font-semibold">Habits</p>
              <p className="text-sm text-slate-500 mt-1">Complete or add habits</p>
            </Link>
            <Link
              to="/study"
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center text-slate-900 transition hover:bg-slate-100 hover:shadow-md"
            >
              <TrendingUp className="mx-auto text-emerald-600" size={24} />
              <p className="mt-3 font-semibold">Study</p>
              <p className="text-sm text-slate-500 mt-1">Log study sessions</p>
            </Link>
            <Link
              to="/mood"
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center text-slate-900 transition hover:bg-slate-100 hover:shadow-md"
            >
              <AlertCircle className="mx-auto text-violet-600" size={24} />
              <p className="mt-3 font-semibold">Mood</p>
              <p className="text-sm text-slate-500 mt-1">Log emotional check-ins</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500 mb-2">Productivity trend</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.completionRate > 75 ? 'Strong' : stats.completionRate > 50 ? 'Steady' : 'Needs focus'}</p>
            <p className="text-sm text-slate-500 mt-2">{stats.completionRate > 75 ? 'Excellent completion this week.' : stats.completionRate > 50 ? 'Keep pushing ahead.' : 'Try a short task sprint today.'}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500 mb-2">Habit momentum</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.bestHabitStreak} days</p>
            <p className="text-sm text-slate-500 mt-2">A longer streak helps build consistency.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500 mb-2">Mood score</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.avgMood}/5</p>
            <p className="text-sm text-slate-500 mt-2">Keep logging mood for better clarity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
