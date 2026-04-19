import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const useCurrentUser = () => {
  const { currentUser } = useAuth();
  return currentUser;
};

export const useTasks = () => {
  const { tasks, createTask, updateTaskStatus, removeTask } = useApp();
  return { tasks, createTask, updateTaskStatus, removeTask };
};

export const useHabits = () => {
  const { habits, createHabit, completeHabit, removeHabit } = useApp();
  return { habits, createHabit, completeHabit, removeHabit };
};

export const useStudyLogs = () => {
  const { studyLogs, addStudyLog, loadStudyLogs } = useApp();
  return { studyLogs, addStudyLog, loadStudyLogs };
};

export const useMoods = () => {
  const { moods, addMoodEntry, loadMoods } = useApp();
  return { moods, addMoodEntry, loadMoods };
};

export const useBurnout = () => {
  const { burnoutAlerts, checkBurnout } = useApp();
  return { burnoutAlerts, checkBurnout };
};
