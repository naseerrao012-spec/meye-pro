import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AllocatedCourses.css";

const AllocatedCourses = ({ teacherId }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Placeholder teacherId agar props se na aaye (testing ke liye)
  const id = teacherId || "T-001"; 

  const fetchAllocatedCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`http://localhost:8000/teacher/allocateCourses?teacherId=${id}`);
      
      // Agar backend 200 par error detail bhej raha hai
      if (res.data.detail) {
        setError(res.data.detail);
        setCourses([]);
      } else {
        setCourses(res.data);
      }
    } catch (err) {
      setError("Failed to load courses. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocatedCourses();
  }, [id]);

  return (
    <div className="courses-container">
      <header className="courses-header">
        <div className="header-info">
          <h1>My Allocated Courses</h1>
          {courses.length > 0 && <span className="session-badge">Session: {courses[0].Session}</span>}
        </div>
        <button className="refresh-link" onClick={fetchAllocatedCourses}>🔄 Sync Courses</button>
      </header>

      {loading ? (
        <div className="loader-container"><div className="spinner"></div></div>
      ) : error ? (
        <div className="empty-state-box">
          <span className="empty-icon">📚</span>
          <p>{error}</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course, index) => (
            <div key={index} className="course-card">
              <div className="course-card-top">
                <div className="course-code">{course.Course_Id}</div>
                <div className="course-tag">Active</div>
              </div>
              
              <h2 className="course-title">{course.Course_Name}</h2>
              
              <div className="course-details-grid">
                <div className="detail-item">
                  <span className="label">Discipline</span>
                  <span className="value">{course.Discipline}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Semester</span>
                  <span className="value">{course.Semester}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Section</span>
                  <span className="value">{course.Section}</span>
                </div>
              </div>

              <div className="course-footer">
                <button className="view-attendance-btn">View Attendance</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllocatedCourses;