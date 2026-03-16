// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Pages
// import Login from './pages/Auth/Login';
// import AddStudent from './pages/datacell/AddStudent';
// import Enrollment from './pages/datacell/Enrollment';
// import CourseAllocation from './pages/datacell/CourseAllocation';
// import AddTeacher from './pages/admin/teacher/AddTeacher';
// import FacultyList from './pages/admin/teacher/getAllTeachers';
// import DVRManagement from './pages/admin/Camera/getALLDVR';
// import DVRDetails from './pages/admin/Camera/DVRDetails'; 
// import Venue from './pages/admin/Venue/VenueDashboard';
// import TeacherReportsDashboard from './pages/teacher/TeacherReportsDashboard';
// import TeacherSchedule from './pages/teacher/TeacherSchedule';
// import TeacherTimetableUpload from './pages/admin/TeacherTimetableUpload';
// import EnrolledCourses from "./pages/students/EnrolledCourses";
// import AllocatedCourses from './pages/teacher/AllocatedCourses';


// // Layout
// import MainLayout from './layouts/MainLayout';

// import './App.css';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/Login" />} />
//         <Route path="/Login" element={<Login />} />

//         {/* Protected / app routes use main layout */}
//         <Route element={<MainLayout />}>
//           <Route path="/add-student" element={<AddStudent />} />
//           <Route path="/enrollment" element={<Enrollment />} />
//           <Route path="/allocation" element={<CourseAllocation />} />
//           <Route path="/add-teacher" element={<AddTeacher />} />
//          <Route path="upload" element={<TeacherTimetableUpload />} />
          
//           <Route path="/getAllTeachers" element={<FacultyList />} />
//           <Route path="/dvr-management" element={<DVRManagement />} />
//           <Route path="/dvr-details" element={<DVRDetails />} />
//           <Route path="/venue-dashboard" element={<Venue />} /> 
//           <Route path="/teacher-schedule" element={<TeacherSchedule />} />
//           <Route path="/teacher-reports" element={<TeacherReportsDashboard teacherID={123} />} />
//           <Route path="/enrolled-courses" element={<EnrolledCourses />} />
//           <Route path="/Allocate_courses" element={<AllocatedCourses/>}/>
          
          
//         </Route>
//       </Routes>
//     </Router>
//   );
// }


// export default App;

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
import TeacherSchedule from './pages/teacher/TeacherSchedule'; // Teacher View
import TeacherTimetableUpload from './pages/admin/TeacherTimetableUpload';
import EnrolledCourses from "./pages/students/EnrolledCourses";
import AllocatedCourses from './pages/teacher/AllocatedCourses';

// 🔹 Yahan Alias use kiya hai (AdminTeacherSchedule) conflict khatam karne ke liye
import AdminTeacherSchedule from "./pages/admin/teacher/Getteacherschedule"; 

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
          
          {/* Ye teacher ka apna view hai */}
          <Route path="/teacher-schedule" element={<TeacherSchedule />} />
          
          <Route path="/teacher-reports" element={<TeacherReportsDashboard teacherID={123} />} />
          <Route path="/enrolled-courses" element={<EnrolledCourses />} />
          <Route path="/Allocate_courses" element={<AllocatedCourses/>}/>
      
          {/* 🔹 Ye Admin wala view hai jahan ID pass ho rahi hai */}
          <Route path="/Get_teacher_schedule" element={<AdminTeacherSchedule />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;