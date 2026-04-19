# 🧪 Smart Life Manager - Testing Guide

Complete testing procedures for all features.

---

## ✅ Pre-Testing Setup

### 1. Start Application
```bash
cd "c:\Users\gargm\OneDrive\Desktop\Smart Life\smart-life-manager"
npm run dev
```

### 2. Update Firebase Config
- Add your Firebase credentials to `src/services/firebaseConfig.js`

### 3. Open Browser
- Navigate to http://localhost:5173

---

## 🔐 Test 1: Authentication

### Test Signup
1. Click "Sign up here" link
2. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPassword123
   - Confirm: TestPassword123
3. Click "Sign Up"

**Expected Result:**
- ✅ Account created successfully
- ✅ Redirected to Dashboard
- ✅ User name visible in header

### Test Login with New Account
1. Logout (click Logout button)
2. Enter credentials from signup
3. Click "Sign In"

**Expected Result:**
- ✅ Successfully logged in
- ✅ Dashboard displays

### Test Invalid Credentials
1. Try logging in with wrong password
2. Try logging in with non-existent email

**Expected Result:**
- ✅ Error message displays
- ✅ User remains on login page

### Test Logout
1. Click "Logout" button
2. Confirm you're redirected to login

**Expected Result:**
- ✅ Session cleared
- ✅ Logged out successfully

---

## 📋 Test 2: Tasks

### Test Create Task
1. Go to Tasks page
2. Click "Add Task"
3. Fill in form:
   - Title: "Complete React Project"
   - Due Date: 2026-05-15
   - Priority: High
   - Category: Studies
   - Description: "Finish Smart Life Manager"
4. Click "Create Task"

**Expected Result:**
- ✅ Task appears in list
- ✅ Priority color shows correctly
- ✅ Due date displays

### Test Mark Task Complete
1. Find created task
2. Click the circle icon
3. Verify it shows checkmark

**Expected Result:**
- ✅ Task marked complete
- ✅ Appears crossed out
- ✅ List reorganized (completed at bottom)

### Test Delete Task
1. Click trash icon on a task
2. Confirm deletion

**Expected Result:**
- ✅ Task removed from list
- ✅ No confirmation needed (instant)

### Test Task Filtering
1. Create multiple tasks with different priorities
2. Observe sorting

**Expected Result:**
- ✅ Tasks sorted by due date
- ✅ Incomplete tasks first
- ✅ Complete tasks at bottom

### Test Dashboard Integration
1. Create 5 tasks, complete 3
2. Go to Dashboard
3. Check stat card

**Expected Result:**
- ✅ Shows "3/5" completed
- ✅ Shows "60%" completion rate

---

## 🔥 Test 3: Habits

### Test Create Habit
1. Go to Habits page
2. Click "Add Habit"
3. Fill in form:
   - Name: "Morning Exercise"
   - Frequency: Daily
   - Color: Blue
   - Description: "30 min run"
4. Click "Create Habit"

**Expected Result:**
- ✅ Habit appears in list
- ✅ Shows 0 streak
- ✅ Shows "Never" for last completed

### Test Mark Habit Complete
1. Click "Complete" button
2. Habit should show as completed

**Expected Result:**
- ✅ Button changes to green "Done"
- ✅ Streak increases to 1
- ✅ Last completed date updates to today

### Test Consecutive Completion
1. Mark same habit complete next day
2. Check streak

**Expected Result:**
- ✅ Streak increases to 2
- ✅ Total days increments

### Test Habit Color Coding
1. Create habits with different colors
2. Verify each has correct background

**Expected Result:**
- ✅ Blue habit has blue background
- ✅ Purple habit has purple background
- ✅ etc.

### Test Delete Habit
1. Click trash icon on a habit
2. Habit should be removed

**Expected Result:**
- ✅ Habit deleted immediately
- ✅ No longer in list

### Test Dashboard Habit Stats
1. Create 3 habits
2. Complete 2 of them today
3. Go to Dashboard

**Expected Result:**
- ✅ Shows "2 Active Habits"
- ✅ Shows best streak count

---

## 📚 Test 4: Study Hours

### Test Log Study Session
1. Go to Study Hours page
2. Click "Log Study Session"
3. Fill in:
   - Date: Today
   - Duration: 60 (minutes)
   - Subject: Mathematics
   - Notes: "Completed chapter 5"
4. Click "Log Session"

**Expected Result:**
- ✅ Log appears in recent sessions
- ✅ Statistics update
- ✅ Duration converts to hours correctly

### Test Multiple Subjects
1. Log sessions for different subjects
2. Check study distribution chart

**Expected Result:**
- ✅ Chart shows each subject
- ✅ Hours calculated correctly
- ✅ Sorted by hours descending

### Test Date Selection
1. Log sessions for different dates
2. Check 7-day trend chart

**Expected Result:**
- ✅ Chart shows last 7 days
- ✅ Bars represent hours correctly
- ✅ Dates labeled properly

### Test Stats Calculation
1. Log 3 sessions: 60, 90, 45 minutes
2. Check total hours stat

**Expected Result:**
- ✅ Total: 3.25 hours (195/60)
- ✅ Average: ~1.08 hours per day

### Test Dashboard Integration
1. After logging study time
2. Go to Dashboard

**Expected Result:**
- ✅ Shows total study hours
- ✅ Shows "This week" label

---

## 😊 Test 5: Mood Tracking

### Test Log Mood
1. Go to Mood page
2. Click "Log Mood"
3. Select mood level (e.g., 4 - Excellent)
4. Select date: Today
5. Add notes: "Feeling productive"
6. Click "Save Mood"

**Expected Result:**
- ✅ Mood appears in recent entries
- ✅ Emoji shows correct mood level
- ✅ Notes display correctly

### Test Mood Levels
1. Log different mood levels (1-5)
2. Check emoji displays

**Expected Result:**
- ✅ 1-2: Sad emoji 😢
- ✅ 2-3: Okay emoji 😟
- ✅ 3-4: Neutral emoji 😐
- ✅ 4-5: Happy emoji 😊

### Test Mood Trend Chart
1. Log moods for 7 different days
2. Check trend chart

**Expected Result:**
- ✅ Line chart shows mood progression
- ✅ Y-axis goes 0-5
- ✅ Last 7 days displayed

### Test Mood Statistics
1. Log 5 moods: 5, 4, 3, 2, 1
2. Check statistics

**Expected Result:**
- ✅ Average: 3/5
- ✅ Best: 5
- ✅ Lowest: 1

### Test Mood Distribution
1. Log multiple moods across categories
2. Check distribution chart

**Expected Result:**
- ✅ Bar chart shows count for each level
- ✅ All moods accounted for

---

## 🚨 Test 6: Burnout Detection

### Trigger High Burnout
1. Create 10 tasks, complete only 2 (20%)
2. Log only 1 hour of study
3. Log mood as 2 for multiple days
4. Go to Dashboard

**Expected Result:**
- ✅ Red burnout warning appears
- ✅ Shows "High Burnout Risk"
- ✅ Lists metrics
- ✅ Has dismiss button

### Trigger Medium Burnout
1. Complete 40% of tasks
2. Log 4 hours study
3. Log average mood of 2.5
4. Go to Dashboard

**Expected Result:**
- ✅ Orange burnout warning appears
- ✅ Shows "Moderate Burnout Risk"

### No Burnout Alert
1. Complete 80% of tasks
2. Log 10 hours study
3. Log average mood of 4
4. Go to Dashboard

**Expected Result:**
- ✅ No burnout warning
- ✅ Only positive recommendations

### Acknowledge Alert
1. With active burnout warning
2. Click X button to dismiss

**Expected Result:**
- ✅ Alert disappears
- ✅ Won't show again until new alert

---

## 📊 Test 7: Weekly Reports

### Test Current Week Report
1. Go to Reports page
2. Verify period shows current week dates
3. Check all metrics display

**Expected Result:**
- ✅ Period dates correct
- ✅ Task completion percentage shows
- ✅ Study hours calculated
- ✅ Average mood displayed

### Test Previous Week Navigation
1. Click "Previous Week"
2. Period should change to previous week
3. Check all metrics update

**Expected Result:**
- ✅ Date range shifts back 7 days
- ✅ New data loads
- ✅ Can go back multiple weeks

### Test Next Week (if available)
1. If in past, click "Next Week"
2. Period should advance

**Expected Result:**
- ✅ Date range shifts forward 7 days
- ✅ Button disabled for future weeks

### Test Charts in Reports
1. With data for a week
2. Check task pie chart
3. Check study distribution chart

**Expected Result:**
- ✅ Pie chart shows completion split
- ✅ Bar chart shows subjects/hours
- ✅ Charts render without errors

### Test Report Export
1. Click "Export as Text"
2. Check file downloads

**Expected Result:**
- ✅ File downloads as .txt
- ✅ Contains all report data
- ✅ Readable format

### Test Report Print
1. Click "Print Report"
2. Print dialog appears
3. Print to PDF

**Expected Result:**
- ✅ Print preview shows formatted report
- ✅ All content visible
- ✅ Professional appearance

---

## 🖥️ Test 8: Responsive Design

### Test Mobile View (< 640px)
1. Open DevTools (F12)
2. Set device: iPhone 12
3. Test each page:

**Expected Results:**
- ✅ Sidebar collapses to hamburger menu
- ✅ All text readable (no overflow)
- ✅ Buttons easy to tap (48px minimum)
- ✅ Charts responsive
- ✅ Forms stack vertically

### Test Tablet View (640px - 1024px)
1. Set device: iPad
2. Test each page:

**Expected Results:**
- ✅ Layout adjusts appropriately
- ✅ 2-column layouts work
- ✅ Sidebar visible (not hamburger)
- ✅ Responsive spacing

### Test Desktop View (> 1024px)
1. Full browser window
2. Verify layout optimal

**Expected Results:**
- ✅ Sidebar always visible
- ✅ Multi-column layouts work
- ✅ Charts have space
- ✅ Grid layouts 4+ columns

### Test Rotation
1. On mobile, rotate to landscape
2. All content should adapt

**Expected Results:**
- ✅ Layout adjusts for landscape
- ✅ No horizontal scroll
- ✅ Text readable

---

## 🎨 Test 9: UI/UX Polish

### Test Loading States
1. Create task while watching network tab
2. Check if loading indicator appears

**Expected Result:**
- ✅ Loading spinner or skeleton shows
- ✅ Disappears when complete
- ✅ Smooth transition

### Test Error Handling
1. Attempt signup with invalid email
2. Try duplicate email signup
3. Create task without required fields

**Expected Results:**
- ✅ Error messages clear
- ✅ Validation prevents submission
- ✅ Messages in readable location

### Test Colors & Contrast
1. Check all text readable
2. Color combinations accessible

**Expected Results:**
- ✅ WCAG AA compliant
- ✅ No text hard to read
- ✅ Consistent color scheme

### Test Transitions
1. Navigate between pages
2. Open/close dropdowns

**Expected Results:**
- ✅ Smooth transitions
- ✅ No jarring changes
- ✅ Professional feel

---

## 🔗 Test 10: Data Persistence

### Test Data Saves to Firebase
1. Create task
2. Refresh page (F5)
3. Task should still appear

**Expected Result:**
- ✅ Data persists
- ✅ No data loss
- ✅ Loaded on page refresh

### Test Real-time Updates
1. Open app in two browser tabs
2. Create task in Tab 1
3. Check if visible in Tab 2 without refresh

**Expected Result:**
- ✅ Updates propagate real-time
- ✅ Both tabs in sync (Firebase Firestore)

### Test Logout/Login Persistence
1. Create multiple items
2. Logout
3. Login with same account
4. All data present

**Expected Result:**
- ✅ All data preserved
- ✅ Associated with correct user
- ✅ No data mixing between users

---

## 📝 Test 11: Form Validation

### Test Required Fields
1. Try creating task without title
2. Try logging mood without selecting level

**Expected Result:**
- ✅ Form doesn't submit
- ✅ Error message shows
- ✅ Highlights problematic field

### Test Date Validation
1. Try setting past due date
2. Try invalid date format

**Expected Result:**
- ✅ Validation works
- ✅ Can't set invalid dates
- ✅ Clear feedback

### Test Number Inputs
1. Try entering text in duration field
2. Try negative numbers

**Expected Result:**
- ✅ Accepts only numbers
- ✅ Validates reasonable values
- ✅ Shows error if invalid

---

## 🚀 Test 12: Performance

### Test Page Load Speed
1. Open DevTools → Network tab
2. Load each page
3. Check load time

**Expected Result:**
- ✅ < 2 seconds initial load
- ✅ < 500ms for navigation
- ✅ Smooth 60fps animations

### Test Large Data Sets
1. Create 50+ tasks
2. Create 20+ habits
3. Check performance

**Expected Result:**
- ✅ Still responsive
- ✅ No lag
- ✅ Scrolling smooth

### Test Charts with Data
1. Create 30+ study logs
2. Check chart renders
3. Interaction smooth

**Expected Result:**
- ✅ Charts render quickly
- ✅ Hover interactions smooth
- ✅ No jank

---

## 📋 Test Checklist

### Authentication
- [ ] Signup works
- [ ] Login works
- [ ] Logout works
- [ ] Error handling works

### Tasks
- [ ] Create task
- [ ] Complete task
- [ ] Delete task
- [ ] Dashboard shows stats

### Habits
- [ ] Create habit
- [ ] Mark complete
- [ ] Streak updates
- [ ] Delete habit

### Study
- [ ] Log session
- [ ] See statistics
- [ ] Charts display
- [ ] Distribution shows

### Mood
- [ ] Log mood
- [ ] See trend
- [ ] Statistics calculate
- [ ] Distribution shows

### Burnout
- [ ] Alert triggers
- [ ] Can dismiss
- [ ] Recommendations show

### Reports
- [ ] Weekly summary
- [ ] Navigate weeks
- [ ] Export works
- [ ] Print works

### Responsive
- [ ] Mobile works
- [ ] Tablet works
- [ ] Desktop works
- [ ] Rotation works

### Data
- [ ] Persists after refresh
- [ ] Real-time sync works
- [ ] Logout/login works

---

## 🐛 Bug Report Template

If you find issues, document them:

```
**Bug Title**: [Brief description]

**Steps to Reproduce:**
1. ...
2. ...
3. ...

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
[If applicable]

**Environment:**
- Browser: [Chrome/Firefox/Safari]
- Device: [Mobile/Tablet/Desktop]
- OS: [Windows/Mac/Linux]

**Severity:**
[ ] Critical | [ ] High | [ ] Medium | [ ] Low
```

---

## ✅ Sign-off

Once all tests pass, the application is ready for:
- [ ] Development environment
- [ ] Testing environment
- [ ] Production deployment

---

**Testing Complete! 🎉**
