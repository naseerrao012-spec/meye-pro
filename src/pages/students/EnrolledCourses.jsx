import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EnrolledCourses.css"; // Aapki main premium CSS file

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const regno = localStorage.getItem("userId") || "STUDENT_REG_NO"; 

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        // Aapka backend endpoint integration
        const response = await axios.get(`http://localhost:8000/student/getenrolledCourses?regno=${regno}`);
        setCourses(response.data.Courses || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.response?.data?.detail || "Failed to load courses");
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [regno]);

  return (
    <main className="app-content">
      <div className="page-title">
        <h1>Enrolled Courses</h1>
        <p>Overview of your registered courses and attendance performance.</p>
      </div>

      <section className="courses-grid-container">
        {loading ? (
          <div className="loader-container">
            <div className="premium-spinner"></div>
            <p>Fetching your academic records...</p>
          </div>
        ) : error ? (
          <div className="error-view">
            <p>{error}</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="premium-grid">
            {courses.map((course, index) => (
              <div key={index} className="enroll-card-main course-card-web">
                <div className="card-accent-line"></div>
                
                <div className="course-card-header">
                  <span className="course-id-tag">{course.Course_Id}</span>
                  <div className="attendance-circle-wrapper">
                    {/* Progress Ring Logic */}
                    <svg className="progress-ring" width="60" height="60">
                      <circle className="progress-ring__background" stroke="#e6f2ff" strokeWidth="4" fill="transparent" r="26" cx="30" cy="30"/>
                      <circle 
                        className="progress-ring__bar" 
                        stroke="var(--primary)" 
                        strokeWidth="4" 
                        fill="transparent" 
                        r="26" cx="30" cy="30"
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
                  <button className="register-action-btn view-details-btn">
                    View Course Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data-view">
            <p>No enrolled courses found for {regno}.</p>
          </div>
        )}
      </section>
      <div className="footer-spacer"></div>
    </main>
  );
};

export default EnrolledCourses;