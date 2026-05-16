import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AllocatedCourses.css";

const AllocatedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentHistory, setStudentHistory] = useState([]);

  const userId = localStorage.getItem("userId");

  const fetchAllocatedCourses = async () => {
    if (!userId) {
      setError("Session expired.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/teacher/allocateCourses`, {
        params: { teacherId: userId }
      });
      setCourses(res.data.detail ? [] : res.data);
    } catch (err) {
      setError("Database connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllocatedCourses(); }, [userId]);

  const handleViewAttendance = async (course) => {
    try {
      setReportLoading(true);
      const res = await axios.get(`http://localhost:8000/teacher/getAttendanceReport`, {
        params: {
          course_id: course.Course_Id,
          session: course.Session,
          semester: course.Semester,
          section: course.Section
        }
      });
      setSelectedReport({ ...res.data, display_name: course.Course_Name });
    } catch (err) { alert("Error fetching attendance report"); } finally { setReportLoading(false); }
  };

  const handleStudentClick = async (student) => {
    try {
      const res = await axios.get(`http://localhost:8000/student/getCourseAttendance`, {
        params: { regno: student.registration_no, course_id: selectedReport.course_id }
      });
      setStudentHistory(res.data.Attendance || []);
      setSelectedStudent(student);
      console.log(student)
    } catch (err) { alert("Error fetching student history"); }
  };

  const filteredStudents = selectedReport?.data?.filter(student =>
    student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registration_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="premium-dashboard-wrapper">
      <div className="main-content-area">
        
        {/* VIEW 1: COURSES GRID */}
        {!selectedReport ? (
          <>
            <header className="page-hero">
              <div className="hero-text">
                <h1>My Allocated Courses</h1>
                {/* <p>Manage your classes and monitor real-time student attendance.</p> */}
              </div>
              <div className="teacher-id-badge">
                <span className="label">Teacher ID</span>
                <span className="value">{userId}</span>
              </div>
            </header>
            
            {loading ? (
              <div className="premium-loader"><div className="double-ring-spinner"></div></div>
            ) : (
              <div className="premium-courses-grid">
                {courses.map((course, index) => (
                  <div key={index} className="premium-card-glass">
                    <div className="card-accent-bar"></div>
                    <div className="card-body">
                      <div className="card-top-row">
                        <span className="code-pill">{course.Course_Id}</span>
                        <span className="status-dot">Active</span>
                      </div>
                      <h2 className="course-main-title">{course.Course_Name}</h2>
                      <div className="course-stats-container">
                        <div className="stat-box"><label>Sec</label><span>{course.Section}</span></div>
                        <div className="stat-box"><label>Sem</label><span>{course.Semester}</span></div>
                        <div className="stat-box"><label>Disc</label><span>{course.Discipline}</span></div>
                      </div>
                    </div>
                    <div className="card-footer-action">
                      <button className="action-btn-primary" onClick={() => handleViewAttendance(course)}>
                        {reportLoading ? "Loading..." : "View Detailed Attendance"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : selectedStudent ? (
          /* VIEW 3: STUDENT FULL HISTORY SCREEN */
          <div className="report-screen">
            <header className="report-screen-header">
              <div className="header-left">
                <button className="back-button" onClick={() => setSelectedStudent(null)}>← Back</button>
              </div>
              <div className="report-header-meta">
                <h2>{selectedStudent.student_name}</h2>
                <span className="arid-no-header">{selectedStudent.registration_no}</span>
              </div>
              <div className="header-right-search">
                 <div className="total-classes-badge">Classes: {studentHistory.length}</div>
              </div>
            </header>

            <div className="student-report-list">
              {studentHistory.map((item, index) => (
                <div key={index} className="student-list-item history-item">
                  <div className="item-details">
                    <span className="history-date">{item.Date} ({item.Day})</span>
                    <span className="history-time">{item.Time}</span>
                  </div>
                  <div className="item-status">
                    <span className={`status-pill ${item.Status === 'P' ? 'present' : 'absent'}`}>
                      {item.Status === 'P' ? 'P' : 'A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* VIEW 2: DETAILED REPORT VIEW */
          <div className="report-screen">
            <header className="report-screen-header">
              <div className="header-left">
                <button className="back-button" onClick={() => setSelectedReport(null)}>← Back</button>
              </div>
              <div className="report-header-meta">
                <h2>{selectedReport.display_name}</h2>
                <div className="meta-sub">
                  <span className="course-id-tag">{selectedReport.course_id}</span>
                  <span className="total-badge">{selectedReport.total_students} Students</span>
                </div>
              </div>
              <div className="header-right-search">
                <div className="search-wrapper-premium">
                  <span className="search-icon">🔍</span>
                  <input type="text" placeholder="Search..." className="premium-input-field" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
            </header>

            <div className="student-report-list">
              {filteredStudents?.map((student, index) => {
                const percentage = parseFloat(student.attendance_percentage) || 0;
                const circumference = 150.8;
                const offset = circumference - (percentage / 100) * circumference;
                return (
                  <div key={index} className="student-list-item clickable-item" onClick={() => handleStudentClick(student)}>
                    <div className="item-details">
                      <span className="arid-no">{student.registration_no}</span>
                      <h4 className="student-name">{student.student_name}</h4>
                      <p className="counts">Present: {student.present_count} / {student.classes_held}</p>
                    </div>
                    <div className="item-progress">
                      <div className="circular-progress-box">
                        <svg width="60" height="60">
                          <circle className="bg" cx="30" cy="30" r="24" />
                          <circle className="bar" cx="30" cy="30" r="24" 
                            strokeDasharray={circumference} strokeDashoffset={offset}
                            stroke={percentage < 75 ? "#ee5d50" : "#05cd99"} />
                        </svg>
                        <span className="percentage">{student.attendance_percentage}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllocatedCourses;