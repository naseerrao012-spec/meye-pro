import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TeacherSchedule.css";

const TeacherSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Teacher ID session/localStorage se le rahe hain
  const teacherID = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!teacherID) return;
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8000/teacher/getTeacherSchedule?teacherId=${teacherID}`);
        // Aapke backend structure ke mutabiq "Lectures" array nikal rahe hain
        setSchedule(res.data.Lectures || []);
      } catch (err) {
        console.error("Error fetching schedule:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [teacherID]);

  return (
    <div className="schedule-page-container">
      <header className="schedule-top-bar">
        <div className="title-section">
          <h1>Today's Schedule</h1>
          <p className="current-day">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="stats-badge">
          Total Classes: <span>{schedule.length}</span>
        </div>
      </header>

      <main className="schedule-full-view">
        {loading ? (
          <div className="schedule-loader">Loading your lectures...</div>
        ) : schedule.length > 0 ? (
          <div className="schedule-grid">
            {schedule.map((lecture, index) => (
              <div key={index} className="lecture-card-web">
                <div className="card-sidebar"></div>
                <div className="card-main-content">
                  <h3 className="course-name">{lecture["Course Name"]}</h3>
                  <p className="discipline-tag">{lecture.Discipline}</p>
                  
                  <div className="lecture-footer">
                    <div className="info-item">
                      <span className="icon">🕒</span>
                      <span className="text">{lecture["Class Start time"]} - {lecture["Class End time"]}</span>
                    </div>
                    <div className="info-item">
                      <span className="icon">📍</span>
                      <span className="text">Venue: {lecture.Venue}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-schedule">
            <p>No classes scheduled for today.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherSchedule;