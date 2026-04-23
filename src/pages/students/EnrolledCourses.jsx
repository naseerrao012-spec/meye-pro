// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./EnrolledCourses.css"; // Aapki main premium CSS file

// const EnrolledCourses = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);


//   const regno = localStorage.getItem("userId") || "STUDENT_REG_NO"; 

//   useEffect(() => {
//     const fetchEnrolledCourses = async () => {
//       try {
//         setLoading(true);
//         // Aapka backend endpoint integration
//         const response = await axios.get(`http://localhost:8000/student/getenrolledCourses?regno=${regno}`);
//         setCourses(response.data.Courses || []);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching courses:", err);
//         setError(err.response?.data?.detail || "Failed to load courses");
//         setLoading(false);
//       }
//     };

//     fetchEnrolledCourses();
//   }, [regno]);

//   return (
//     <main className="app-content">
//       <div className="page-title">
//         <h1>Enrolled Courses</h1>
//         <p>Overview of your registered courses and attendance performance.</p>
//       </div>

//       <section className="courses-grid-container">
//         {loading ? (
//           <div className="loader-container">
//             <div className="premium-spinner"></div>
//             <p>Fetching your academic records...</p>
//           </div>
//         ) : error ? (
//           <div className="error-view">
//             <p>{error}</p>
//           </div>
//         ) : courses.length > 0 ? (
//           <div className="premium-grid">
//             {courses.map((course, index) => (
//               <div key={index} className="enroll-card-main course-card-web">
//                 <div className="card-accent-line"></div>
                
//                 <div className="course-card-header">
//                   <span className="course-id-tag">{course.Course_Id}</span>
//                   <div className="attendance-circle-wrapper">
//                     {/* Progress Ring Logic */}
//                     <svg className="progress-ring" width="60" height="60">
//                       <circle className="progress-ring__background" stroke="#e6f2ff" strokeWidth="4" fill="transparent" r="26" cx="30" cy="30"/>
//                       <circle 
//                         className="progress-ring__bar" 
//                         stroke="var(--primary)" 
//                         strokeWidth="4" 
//                         fill="transparent" 
//                         r="26" cx="30" cy="30"
//                         style={{
//                           strokeDasharray: `${2 * Math.PI * 26}`,
//                           strokeDashoffset: `${2 * Math.PI * 26 * (1 - course.Attendance_Percentage / 100)}`
//                         }}
//                       />
//                     </svg>
//                     <span className="percentage-text">{course.Attendance_Percentage}%</span>
//                   </div>
//                 </div>

//                 <div className="course-card-body">
//                   <h2 className="course-name-display">{course.Course_Name}</h2>
//                   <div className="teacher-info-row">
//                     <span className="nav-icon">👤</span>
//                     <p className="teacher-name-text">{course.Teacher_Name}</p>
//                   </div>
//                 </div>

//                 <div className="course-card-footer">
//                   <button className="register-action-btn view-details-btn">
//                     View Course Attendance
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="no-data-view">
//             <p>No enrolled courses found for {regno}.</p>
//           </div>
//         )}
//       </section>
//       <div className="footer-spacer"></div>
//     </main>
//   );
// };

// export default EnrolledCourses;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, PlayCircle, Calendar, Clock } from "lucide-react"; 
import "./EnrolledCourses.css";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for Detail View
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'details'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const base_url = "http://localhost:8000";
  const regno = localStorage.getItem("userId") || "STUDENT_REG_NO";

  useEffect(() => {
    fetchEnrolledCourses();
  }, [regno]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}/student/getenrolledCourses?regno=${regno}`);
      setCourses(response.data.Courses || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load courses");
      setLoading(false);
    }
  };

  // 🔹 Attendance History fetch karne ka function
  const handleViewAttendance = async (course) => {
    setSelectedCourse(course);
    setDetailLoading(true);
    setViewMode("details");
    try {
      const response = await axios.get(`${base_url}/student/getCourseAttendance?regno=${regno}&course_id=${course.Course_Id}`);
      setAttendanceHistory(response.data.Attendance || []);
      setDetailLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setDetailLoading(false);
    }
  };

  // --- DETAIL VIEW RENDER ---
  if (viewMode === "details") {
    return (
      <main className="app-content">
        <div className="detail-header">
          <button className="back-btn-premium" onClick={() => setViewMode("grid")}>
            <ArrowLeft size={20} /> Back to Courses
          </button>
          <div className="course-title-box">
            <h1 className="detail-course-name">{selectedCourse?.Course_Name}</h1>
            <span className="detail-course-id">{selectedCourse?.Course_Id}</span>
          </div>
        </div>

        <section className="attendance-list-container">
          {detailLoading ? (
            <div className="loader-container"><div className="premium-spinner"></div></div>
          ) : (
            <div className="attendance-rows">
              {attendanceHistory.map((record, index) => (
                <div key={index} className="attendance-premium-row">
                  <div className="row-date-info">
                    <div className="date-main">
                      <Calendar size={16} className="text-muted" />
                      <span>{record.Date} <small>({record.Day})</small></span>
                    </div>
                    <div className="time-sub">
                      <Clock size={14} className="text-muted" />
                      <span>{record.Time}</span>
                    </div>
                  </div>

                  <div className="row-status-action">
                    {record.Status === "P" ? (
                      <span className="status-badge present">P</span>
                    ) : (
                      <div className="absent-container">
                        <span className="status-badge absent">A</span>
                        <button className="evidence-btn" onClick={() => alert(`Opening Media for ID: ${record.Attendance_id}`)}>
                           <PlayCircle size={14} /> Check Media Evidence
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {attendanceHistory.length === 0 && <p className="no-data">No records found for this course.</p>}
            </div>
          )}
        </section>
      </main>
    );
  }

  // --- GRID VIEW RENDER ---
  return (
    <main className="app-content">
      <div className="page-title">
        <h1>Enrolled Courses</h1>
        <p>Overview of your registered courses and attendance performance.</p>
      </div>

      <section className="courses-grid-container">
        {loading ? (
          <div className="loader-container"><div className="premium-spinner"></div></div>
        ) : error ? (
          <div className="error-view"><p>{error}</p></div>
        ) : (
          <div className="premium-grid">
            {courses.map((course, index) => (
              <div key={index} className="enroll-card-main course-card-web">
                <div className="card-accent-line"></div>
                <div className="course-card-header">
                  <span className="course-id-tag">{course.Course_Id}</span>
                  <div className="attendance-circle-wrapper">
                    <svg className="progress-ring" width="60" height="60">
                      <circle className="progress-ring__background" stroke="#e6f2ff" strokeWidth="4" fill="transparent" r="26" cx="30" cy="30"/>
                      <circle 
                        className="progress-ring__bar" 
                        stroke="var(--primary)" strokeWidth="4" fill="transparent" r="26" cx="30" cy="30"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 26}`,
                          strokeDashoffset: `${2 * Math.PI * 26 * (1 - course.Attendance_Percentage / 100)}`
                        }}
                      />
                    </svg>
                    <span className="percentage-text">{course.Attendance_Percentage}%</span>
                  </div>
                </div>
                <div className="course-card-body">
                  <h2 className="course-name-display">{course.Course_Name}</h2>
                  <div className="teacher-info-row">
                    <span className="nav-icon">👤</span>
                    <p className="teacher-name-text">{course.Teacher_Name}</p>
                  </div>
                </div>
                <div className="course-card-footer">
                  <button className="register-action-btn view-details-btn" onClick={() => handleViewAttendance(course)}>
                    View Course Attendance
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default EnrolledCourses;