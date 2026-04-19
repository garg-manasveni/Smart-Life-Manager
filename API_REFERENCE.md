# 📖 Smart Life Manager - API Reference Guide

Complete reference for all available services and functions.

---

## 🔐 Authentication Service (`authService.js`)

### signup()
Create a new user account.

```javascript
import { signup } from './services/authService';

const signup = async (email, password, displayName) => {
  try {
    const user = await signup('john@example.com', 'password123', 'John Doe');
    console.log(user);
  } catch (error) {
    console.error(error.message);
  }
};
```

**Parameters:**
- `email` (string): User email
- `password` (string): User password (8+ chars)
- `displayName` (string): User's display name

**Returns:** Firebase User object

---

### login()
Sign in with email and password.

```javascript
import { login } from './services/authService';

const login = async (email, password) => {
  try {
    const user = await login('john@example.com', 'password123');
    console.log('Logged in:', user.email);
  } catch (error) {
    console.error(error.message);
  }
};
```

**Parameters:**
- `email` (string): User email
- `password` (string): User password

**Returns:** Firebase User object

---

### logout()
Sign out the current user.

```javascript
import { logout } from './services/authService';

const handleLogout = async () => {
  try {
    await logout();
    console.log('Logged out successfully');
  } catch (error) {
    console.error(error.message);
  }
};
```

**Returns:** void

---

### getCurrentUser()
Get the current authenticated user.

```javascript
import { getCurrentUser } from './services/authService';

const user = getCurrentUser();
if (user) {
  console.log('User:', user.email);
}
```

**Returns:** Firebase User object or null

---

### onAuthChange()
Monitor authentication state changes.

```javascript
import { onAuthChange } from './services/authService';

onAuthChange((user) => {
  if (user) {
    console.log('User logged in:', user.email);
  } else {
    console.log('User logged out');
  }
});
```

**Parameters:**
- `callback` (function): Called when auth state changes

**Returns:** Unsubscribe function

---

## 📋 Data Service (`dataService.js`)

### Tasks

#### addTask()
Create a new task.

```javascript
import { addTask } from './services/dataService';

const taskId = await addTask(userId, {
  title: 'Complete project',
  description: 'Finish React app',
  dueDate: '2026-04-30',
  priority: 'high',
  category: 'studies'
});
```

**Parameters:**
- `userId` (string): Current user ID
- `taskData` (object): Task details

**Returns:** Task ID (string)

---

#### getTasks()
Get all tasks for a user.

```javascript
import { getTasks } from './services/dataService';

const tasks = await getTasks(userId);
tasks.forEach(task => {
  console.log(task.title, task.dueDate);
});
```

**Parameters:**
- `userId` (string): Current user ID

**Returns:** Array of task objects

---

#### updateTask()
Update an existing task.

```javascript
import { updateTask } from './services/dataService';

await updateTask(taskId, {
  completed: true,
  priority: 'medium'
});
```

**Parameters:**
- `taskId` (string): Task ID to update
- `updates` (object): Fields to update

**Returns:** void

---

#### deleteTask()
Delete a task.

```javascript
import { deleteTask } from './services/dataService';

await deleteTask(taskId);
```

**Parameters:**
- `taskId` (string): Task ID to delete

**Returns:** void

---

### Habits

#### addHabit()
Create a new habit.

```javascript
import { addHabit } from './services/dataService';

const habitId = await addHabit(userId, {
  name: 'Morning Exercise',
  description: 'Run for 30 minutes',
  frequency: 'daily',
  color: 'blue'
});
```

**Parameters:**
- `userId` (string): Current user ID
- `habitData` (object): Habit details

**Returns:** Habit ID (string)

---

#### getHabits()
Get all habits for a user.

```javascript
import { getHabits } from './services/dataService';

const habits = await getHabits(userId);
habits.forEach(habit => {
  console.log(`${habit.name}: ${habit.streak} days`);
});
```

**Parameters:**
- `userId` (string): Current user ID

**Returns:** Array of habit objects

---

#### markHabitComplete()
Mark a habit as completed for the day.

```javascript
import { markHabitComplete } from './services/dataService';

await markHabitComplete(habitId, habitData);
```

**Parameters:**
- `habitId` (string): Habit ID
- `habitData` (object): Current habit data

**Returns:** void

---

#### deleteHabit()
Delete a habit.

```javascript
import { deleteHabit } from './services/dataService';

await deleteHabit(habitId);
```

**Parameters:**
- `habitId` (string): Habit ID to delete

**Returns:** void

---

### Study Logs

#### addStudyLog()
Log a study session.

```javascript
import { addStudyLog } from './services/dataService';

const logId = await addStudyLog(userId, {
  date: '2026-04-19',
  duration: 60, // minutes
  subject: 'Mathematics',
  notes: 'Completed chapter 5'
});
```

**Parameters:**
- `userId` (string): Current user ID
- `logData` (object): Study session details

**Returns:** Log ID (string)

---

#### getStudyLogs()
Get study logs for a date range.

```javascript
import { getStudyLogs } from './services/dataService';

const startDate = new Date('2026-04-12');
const endDate = new Date('2026-04-19');

const logs = await getStudyLogs(userId, startDate, endDate);
logs.forEach(log => {
  console.log(`${log.subject}: ${log.duration} mins`);
});
```

**Parameters:**
- `userId` (string): Current user ID
- `startDate` (Date): Start date
- `endDate` (Date): End date

**Returns:** Array of study log objects

---

#### deleteStudyLog()
Delete a study log.

```javascript
import { deleteStudyLog } from './services/dataService';

await deleteStudyLog(logId);
```

**Parameters:**
- `logId` (string): Log ID to delete

**Returns:** void

---

### Moods

#### addMood()
Log a mood entry.

```javascript
import { addMood } from './services/dataService';

const moodId = await addMood(userId, {
  date: '2026-04-19',
  mood: 4, // 1-5 scale
  notes: 'Feeling productive today'
});
```

**Parameters:**
- `userId` (string): Current user ID
- `moodData` (object): Mood entry details

**Returns:** Mood ID (string)

---

#### getMoods()
Get mood entries for a date range.

```javascript
import { getMoods } from './services/dataService';

const startDate = new Date('2026-04-12');
const endDate = new Date('2026-04-19');

const moods = await getMoods(userId, startDate, endDate);
const avgMood = moods.reduce((sum, m) => sum + m.mood, 0) / moods.length;
console.log('Average mood:', avgMood);
```

**Parameters:**
- `userId` (string): Current user ID
- `startDate` (Date): Start date
- `endDate` (Date): End date

**Returns:** Array of mood objects

---

### Burnout Alerts

#### addBurnoutAlert()
Create a burnout alert.

```javascript
import { addBurnoutAlert } from './services/dataService';

await addBurnoutAlert(userId, {
  severity: 'high',
  date: new Date(),
  metrics: {
    completionRate: 25,
    totalStudyHours: 3,
    avgMood: 2.5
  }
});
```

**Parameters:**
- `userId` (string): Current user ID
- `alertData` (object): Alert details

**Returns:** Alert ID (string)

---

#### getBurnoutAlerts()
Get all burnout alerts for a user.

```javascript
import { getBurnoutAlerts } from './services/dataService';

const alerts = await getBurnoutAlerts(userId);
alerts.forEach(alert => {
  console.log(`${alert.severity} burnout risk`);
});
```

**Parameters:**
- `userId` (string): Current user ID

**Returns:** Array of alert objects

---

## 🎣 Custom Hooks

### useAuth()
Access authentication context.

```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return <div>Logged in as: {currentUser?.email}</div>;
}
```

**Returns:**
```javascript
{
  currentUser: User | null,
  loading: boolean,
  error: string | null,
  setError: function
}
```

---

### useApp()
Access app data context.

```javascript
import { useApp } from './context/AppContext';

function MyComponent() {
  const { tasks, habits, studyLogs, moods } = useApp();
  
  return <div>Tasks: {tasks.length}</div>;
}
```

**Returns:**
```javascript
{
  // Tasks
  tasks: Array,
  createTask: function,
  updateTaskStatus: function,
  removeTask: function,
  
  // Habits
  habits: Array,
  createHabit: function,
  completeHabit: function,
  removeHabit: function,
  
  // Study Logs
  studyLogs: Array,
  addStudyLog: function,
  
  // Moods
  moods: Array,
  addMoodEntry: function,
  
  // Burnout
  burnoutAlerts: Array,
  checkBurnout: function
}
```

---

### useTasks()
Quick access to tasks.

```javascript
import { useTasks } from './hooks/useData';

function TaskList() {
  const { tasks, createTask, updateTaskStatus, removeTask } = useTasks();
  
  return tasks.map(task => (
    <div key={task.id}>
      <h3>{task.title}</h3>
    </div>
  ));
}
```

---

### useHabits()
Quick access to habits.

```javascript
import { useHabits } from './hooks/useData';

function HabitList() {
  const { habits, createHabit, completeHabit, removeHabit } = useHabits();
  
  return habits.map(habit => (
    <div key={habit.id}>
      <h3>{habit.name}</h3>
      <button onClick={() => completeHabit(habit.id, habit)}>
        Complete
      </button>
    </div>
  ));
}
```

---

### useStudyLogs()
Quick access to study logs.

```javascript
import { useStudyLogs } from './hooks/useData';

function StudyTracker() {
  const { studyLogs, addStudyLog, loadStudyLogs } = useStudyLogs();
  
  return <div>Total sessions: {studyLogs.length}</div>;
}
```

---

### useMoods()
Quick access to moods.

```javascript
import { useMoods } from './hooks/useData';

function MoodChart() {
  const { moods, addMoodEntry, loadMoods } = useMoods();
  
  const avgMood = moods.length > 0
    ? moods.reduce((s, m) => s + m.mood, 0) / moods.length
    : 0;
    
  return <div>Average mood: {avgMood}/5</div>;
}
```

---

## 💡 Common Usage Patterns

### Create and Display Tasks

```javascript
import { useTasks } from './hooks/useData';
import { Plus } from 'lucide-react';

function TasksPage() {
  const { tasks, createTask } = useTasks();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleCreateTask = async () => {
    await createTask({
      title,
      dueDate,
      priority: 'medium',
      category: 'studies'
    });
    setTitle('');
    setDueDate('');
  };

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button onClick={handleCreateTask}>
        <Plus /> Add Task
      </button>
      
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Track Habit Streaks

```javascript
import { useHabits } from './hooks/useData';

function HabitCard({ habit }) {
  const { completeHabit } = useHabits();
  
  const today = new Date().toISOString().split('T')[0];
  const completedToday = habit.completionHistory?.includes(today);

  return (
    <div>
      <h3>{habit.name}</h3>
      <p>Streak: {habit.streak} days 🔥</p>
      <button
        onClick={() => completeHabit(habit.id, habit)}
        disabled={completedToday}
      >
        {completedToday ? 'Done!' : 'Mark Complete'}
      </button>
    </div>
  );
}
```

---

### Generate Weekly Statistics

```javascript
import { useTasks, useStudyLogs, useMoods } from './hooks/useData';

function WeeklyStats() {
  const { tasks } = useTasks();
  const { studyLogs } = useStudyLogs();
  const { moods } = useMoods();

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalStudyHours = studyLogs.reduce((sum, log) => 
    sum + (log.duration / 60), 0
  );
  const avgMood = moods.length > 0
    ? moods.reduce((sum, m) => sum + m.mood, 0) / moods.length
    : 0;

  return (
    <div>
      <p>Tasks: {completedTasks}/{tasks.length}</p>
      <p>Study: {totalStudyHours.toFixed(1)} hours</p>
      <p>Mood: {avgMood.toFixed(1)}/5</p>
    </div>
  );
}
```

---

## 🔗 Relationships

```
User
├── Tasks (userId)
├── Habits (userId)
├── StudyLogs (userId)
├── Moods (userId)
└── BurnoutAlerts (userId)
```

---

## 📊 Data Types

### Task
```javascript
{
  id: string,
  userId: string,
  title: string,
  description: string,
  dueDate: date,
  completed: boolean,
  priority: 'low' | 'medium' | 'high',
  category: string,
  createdAt: Timestamp
}
```

### Habit
```javascript
{
  id: string,
  userId: string,
  name: string,
  description: string,
  frequency: 'daily' | 'weekly' | 'monthly',
  streak: number,
  totalDays: number,
  lastCompletedDate: Timestamp | null,
  completionHistory: string[],
  color: string,
  createdAt: Timestamp
}
```

### StudyLog
```javascript
{
  id: string,
  userId: string,
  date: date,
  duration: number, // minutes
  subject: string,
  notes: string,
  createdAt: Timestamp
}
```

### Mood
```javascript
{
  id: string,
  userId: string,
  date: date,
  mood: number, // 1-5
  notes: string,
  createdAt: Timestamp
}
```

### BurnoutAlert
```javascript
{
  id: string,
  userId: string,
  severity: 'low' | 'medium' | 'high',
  date: date,
  metrics: {
    completionRate: number,
    totalStudyHours: number,
    avgMood: number
  },
  acknowledged: boolean,
  createdAt: Timestamp
}
```

---

## 🚀 Best Practices

1. **Always use custom hooks** - Makes code cleaner
2. **Handle errors** - Always wrap in try-catch
3. **Use loading states** - Show feedback to user
4. **Optimize re-renders** - Use useCallback for functions
5. **Validate input** - Before sending to database
6. **Batch updates** - When possible
7. **Use indexes** - For frequently queried fields

---

**Happy coding! 🚀**
