import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Auth/Login';
import AddStudent from './pages/datacell/AddStudent';
import Enrollment from './pages/datacell/Enrollment';
import CourseAllocation from './pages/datacell/CourseAllocation';
import AddTeacher from './pages/admin/teacher/AddTeacher';
import FacultyList from './pages/admin/teacher/getAllTeachers';
import DVRManagement from './pages/admin/Camera/getALLDVR';
import DVRDetails from './pages/admin/Camera/DVRDetails'; 
import Venue from './pages/admin/Venue/VenueDashboard';
import TeacherReportsDashboard from './pages/teacher/TeacherReportsDashboard';
import TeacherSchedule from './pages/teacher/TeacherSchedule';
import TeacherTimetableUpload from './pages/admin/TeacherTimetableUpload';

// Layout
import MainLayout from './layouts/MainLayout';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<Login />} />

        {/* Protected / app routes use main layout */}
        <Route element={<MainLayout />}>
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/enrollment" element={<Enrollment />} />
          <Route path="/allocation" element={<CourseAllocation />} />
          <Route path="/add-teacher" element={<AddTeacher />} />
         <Route path="upload" element={<TeacherTimetableUpload />} />
          
          <Route path="/getAllTeachers" element={<FacultyList />} />
          <Route path="/dvr-management" element={<DVRManagement />} />
          <Route path="/dvr-details" element={<DVRDetails />} />
          <Route path="/venue-dashboard" element={<Venue />} /> 
          <Route path="/teacher-schedule" element={<TeacherSchedule />} />
          <Route path="/teacher-reports" element={<TeacherReportsDashboard teacherID={123} />} />

        </Route>
      </Routes>
    </Router>
  );
}


export default App;