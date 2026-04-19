import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as dataService from '../services/dataService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [studyLogs, setStudyLogs] = useState([]);
  const [moods, setMoods] = useState([]);
  const [burnoutAlerts, setBurnoutAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==================== TASKS ====================
  const loadTasks = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const tasksData = await dataService.getTasks(currentUser.uid);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const createTask = useCallback(async (taskData) => {
    if (!currentUser) return;
    try {
      const taskId = await dataService.addTask(currentUser.uid, taskData);
      await loadTasks();
      return taskId;
    } catch (err) {
      setError(err.message);
    }
  }, [currentUser, loadTasks]);

  const updateTaskStatus = useCallback(async (taskId, completed) => {
    try {
      await dataService.updateTask(taskId, { completed });
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }, [loadTasks]);

  const removeTask = useCallback(async (taskId) => {
    try {
      await dataService.deleteTask(taskId);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }, [loadTasks]);

  // ==================== HABITS ====================
  const loadHabits = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const habitsData = await dataService.getHabits(currentUser.uid);
      setHabits(habitsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const createHabit = useCallback(async (habitData) => {
    if (!currentUser) return;
    try {
      const habitId = await dataService.addHabit(currentUser.uid, habitData);
      await loadHabits();
      return habitId;
    } catch (err) {
      setError(err.message);
    }
  }, [currentUser, loadHabits]);

  const completeHabit = useCallback(async (habitId, habitData) => {
    try {
      await dataService.markHabitComplete(habitId, habitData);
      await loadHabits();
    } catch (err) {
      setError(err.message);
    }
  }, [loadHabits]);

  const removeHabit = useCallback(async (habitId) => {
    try {
      await dataService.deleteHabit(habitId);
      await loadHabits();
    } catch (err) {
      setError(err.message);
    }
  }, [loadHabits]);

  // ==================== STUDY LOGS ====================
  const loadStudyLogs = useCallback(async (startDate, endDate) => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const logsData = await dataService.getStudyLogs(currentUser.uid, startDate, endDate);
      setStudyLogs(logsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const addStudyLog = useCallback(async (logData) => {
    if (!currentUser) return;
    try {
      const logId = await dataService.addStudyLog(currentUser.uid, logData);
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      await loadStudyLogs(thirtyDaysAgo, today);
      return logId;
    } catch (err) {
      setError(err.message);
    }
  }, [currentUser, loadStudyLogs]);

  // ==================== MOODS ====================
  const loadMoods = useCallback(async (startDate, endDate) => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const moodsData = await dataService.getMoods(currentUser.uid, startDate, endDate);
      setMoods(moodsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const addMoodEntry = useCallback(async (moodData) => {
    if (!currentUser) return;
    try {
      const moodId = await dataService.addMood(currentUser.uid, moodData);
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      await loadMoods(thirtyDaysAgo, today);
      return moodId;
    } catch (err) {
      setError(err.message);
    }
  }, [currentUser, loadMoods]);

  // ==================== BURNOUT DETECTION ====================
  const loadBurnoutAlerts = useCallback(async () => {
    if (!currentUser) return;
    try {
      const alertsData = await dataService.getBurnoutAlerts(currentUser.uid);
      setBurnoutAlerts(alertsData);
    } catch (err) {
      setError(err.message);
    }
  }, [currentUser]);

  const checkBurnout = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      // Get last 7 days of data
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const recentTasks = await dataService.getTasks(currentUser.uid);
      const recentStudyLogs = await dataService.getStudyLogs(currentUser.uid, sevenDaysAgo, today);
      const recentMoods = await dataService.getMoods(currentUser.uid, sevenDaysAgo, today);
      
      // Calculate metrics
      const completedTasks = recentTasks.filter(t => t.completed).length;
      const totalTasksWeek = recentTasks.length;
      const completionRate = totalTasksWeek > 0 ? (completedTasks / totalTasksWeek) * 100 : 0;
      
      const totalStudyHours = recentStudyLogs.reduce((acc, log) => acc + (log.duration || 0), 0) / 60;
      
      const avgMood = recentMoods.length > 0
        ? recentMoods.reduce((acc, m) => acc + (m.mood || 0), 0) / recentMoods.length
        : 5;
      
      // Burnout detection logic
      if (completionRate < 30 && totalStudyHours < 5 && avgMood < 2.5) {
        // High burnout risk
        const alert = {
          severity: 'high',
          date: today,
          metrics: {
            completionRate,
            totalStudyHours,
            avgMood,
          },
        };
        await dataService.addBurnoutAlert(currentUser.uid, alert);
        await loadBurnoutAlerts();
      } else if (completionRate < 50 && avgMood < 3) {
        // Medium burnout risk
        const alert = {
          severity: 'medium',
          date: today,
          metrics: {
            completionRate,
            totalStudyHours,
            avgMood,
          },
        };
        await dataService.addBurnoutAlert(currentUser.uid, alert);
        await loadBurnoutAlerts();
      }
    } catch (err) {
      setError(err.message);
    }
  }, [currentUser, loadBurnoutAlerts]);

  // Load initial data when user logs in
  useEffect(() => {
    if (currentUser) {
      loadTasks();
      loadHabits();
      loadBurnoutAlerts();
      
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      loadStudyLogs(thirtyDaysAgo, today);
      loadMoods(thirtyDaysAgo, today);
    }
  }, [currentUser, loadTasks, loadHabits, loadStudyLogs, loadMoods, loadBurnoutAlerts]);

  const value = {
    // Tasks
    tasks,
    createTask,
    updateTaskStatus,
    removeTask,
    loadTasks,
    
    // Habits
    habits,
    createHabit,
    completeHabit,
    removeHabit,
    loadHabits,
    
    // Study Logs
    studyLogs,
    addStudyLog,
    loadStudyLogs,
    
    // Moods
    moods,
    addMoodEntry,
    loadMoods,
    
    // Burnout
    burnoutAlerts,
    checkBurnout,
    loadBurnoutAlerts,
    
    // General
    loading,
    error,
    setError,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
