import { db } from './firebaseConfig';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  getDoc,
} from 'firebase/firestore';

// ==================== TASKS ====================

export const addTask = async (userId, taskData) => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...taskData,
      userId,
      completed: false,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error('Failed to add task: ' + error.message);
  }
};

export const getTasks = async (userId) => {
  try {
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      orderBy('dueDate', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error('Failed to fetch tasks: ' + error.message);
  }
};

export const updateTask = async (taskId, updates) => {
  try {
    await updateDoc(doc(db, 'tasks', taskId), updates);
  } catch (error) {
    throw new Error('Failed to update task: ' + error.message);
  }
};

export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
  } catch (error) {
    throw new Error('Failed to delete task: ' + error.message);
  }
};

// ==================== HABITS ====================

export const addHabit = async (userId, habitData) => {
  try {
    const docRef = await addDoc(collection(db, 'habits'), {
      ...habitData,
      userId,
      streak: 0,
      totalDays: 0,
      lastCompletedDate: null,
      createdAt: Timestamp.now(),
      completionHistory: [],
    });
    return docRef.id;
  } catch (error) {
    throw new Error('Failed to add habit: ' + error.message);
  }
};

export const getHabits = async (userId) => {
  try {
    const q = query(
      collection(db, 'habits'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error('Failed to fetch habits: ' + error.message);
  }
};

export const updateHabit = async (habitId, updates) => {
  try {
    await updateDoc(doc(db, 'habits', habitId), updates);
  } catch (error) {
    throw new Error('Failed to update habit: ' + error.message);
  }
};

export const deleteHabit = async (habitId) => {
  try {
    await deleteDoc(doc(db, 'habits', habitId));
  } catch (error) {
    throw new Error('Failed to delete habit: ' + error.message);
  }
};

export const markHabitComplete = async (habitId, habitData) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const lastCompleted = habitData.lastCompletedDate?.split('T')[0];
    
    let newStreak = habitData.streak || 0;
    if (lastCompleted !== today) {
      // Check if it's a consecutive day
      if (lastCompleted) {
        const lastDate = new Date(lastCompleted);
        const todayDate = new Date(today);
        const diffTime = todayDate - lastDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }
    }

    const completionHistory = habitData.completionHistory || [];
    if (!completionHistory.includes(today)) {
      completionHistory.push(today);
    }

    await updateDoc(doc(db, 'habits', habitId), {
      lastCompletedDate: Timestamp.now(),
      streak: newStreak,
      totalDays: completionHistory.length,
      completionHistory,
    });
  } catch (error) {
    throw new Error('Failed to mark habit complete: ' + error.message);
  }
};

// ==================== STUDY LOGS ====================

export const addStudyLog = async (userId, logData) => {
  try {
    const docRef = await addDoc(collection(db, 'studyLogs'), {
      ...logData,
      userId,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error('Failed to add study log: ' + error.message);
  }
};

export const getStudyLogs = async (userId, startDate, endDate) => {
  try {
    const q = query(
      collection(db, 'studyLogs'),
      where('userId', '==', userId),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error('Failed to fetch study logs: ' + error.message);
  }
};

export const deleteStudyLog = async (logId) => {
  try {
    await deleteDoc(doc(db, 'studyLogs', logId));
  } catch (error) {
    throw new Error('Failed to delete study log: ' + error.message);
  }
};

// ==================== MOODS ====================

export const addMood = async (userId, moodData) => {
  try {
    const docRef = await addDoc(collection(db, 'moods'), {
      ...moodData,
      userId,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error('Failed to add mood: ' + error.message);
  }
};

export const getMoods = async (userId, startDate, endDate) => {
  try {
    const q = query(
      collection(db, 'moods'),
      where('userId', '==', userId),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error('Failed to fetch moods: ' + error.message);
  }
};

// ==================== BURNOUT ALERTS ====================

export const addBurnoutAlert = async (userId, alertData) => {
  try {
    const docRef = await addDoc(collection(db, 'burnoutAlerts'), {
      ...alertData,
      userId,
      acknowledged: false,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error('Failed to add burnout alert: ' + error.message);
  }
};

export const getBurnoutAlerts = async (userId) => {
  try {
    const q = query(
      collection(db, 'burnoutAlerts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error('Failed to fetch burnout alerts: ' + error.message);
  }
};

export const acknowledgeBurnoutAlert = async (alertId) => {
  try {
    await updateDoc(doc(db, 'burnoutAlerts', alertId), {
      acknowledged: true,
    });
  } catch (error) {
    throw new Error('Failed to acknowledge alert: ' + error.message);
  }
};
