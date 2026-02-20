import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TeacherReportsDashboard.css";

const TeacherReportsDashboard = () => {
  const [reports, setReports] = useState([]);
  const [viewMode, setViewMode] = useState("CHR"); 
  const [loading, setLoading] = useState(true);
  
  const teacherID = localStorage.getItem("userId");

  const fetchReports = async () => {
    if (!teacherID) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/teacher/TeacherCHR?teacherID=${teacherID}`);
      setReports(res.data.CHR_Reports || []);
    } catch (err) {
      console.error("Error fetching reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [teacherID]);

  return (
    <div className="reports-full-page">
      <header className="reports-header">
        <div className="header-left">
          <h1>Faculty Performance Dashboard</h1>
          <p className="teacher-id-tag">ID: <strong>{teacherID}</strong></p>
          <p className="date-display">
            📅 {new Date().toLocaleDateString()} | {new Date().toLocaleDateString('en-US', {weekday: 'long'})}
          </p>
        </div>
        
        <div className="toggle-container">
          <button 
            className={`toggle-btn ${viewMode === "CHR" ? "active" : ""}`}
            onClick={() => setViewMode("CHR")}
          >
            Class Held (CHR)
          </button>
          <button 
            className={`toggle-btn ${viewMode === "CAR" ? "active" : ""}`}
            onClick={() => setViewMode("CAR")}
          >
            Class Activity (CAR)
          </button>
        </div>
      </header>

      <main className="reports-grid">
        {loading ? (
          <div className="loader-container">
            <div className="premium-spinner"></div>
            <p>Analyzing Classroom Data...</p>
          </div>
        ) : reports.length > 0 ? (
          reports.map((report, index) => (
            <div key={index} className="report-card-premium">
              <div className="card-accent-line"></div>
              <h2 className="report-title">
                {viewMode === "CHR" ? "Class Held Report" : "Class Activity Report"}
              </h2>
              
              <div className="report-details">
                <div className="detail-row"><span>Course:</span> <strong>{report.Course}</strong></div>
                <div className="detail-row"><span>Discipline:</span> <strong>{report.Discipline}</strong></div>
                <div className="detail-row"><span>Venue:</span> <strong>{report.Venue}</strong></div>
                <div className="detail-row"><span>Schedule:</span> <strong>{report.Class_time}</strong></div>
                
                <hr className="section-divider" />

                {viewMode === "CHR" ? (
                  /* CHR Layout: 4 Time Fields (Teacher Presence + Class Timing) */
                  <div className="stats-box-wrapper">
                    <div className="time-grid-4">
                      <div className="time-item teacher-row">
                        <span className="stat-label">First Entry</span>
                        <span className="stat-value entry-color">{report.Class_Time_In}</span>
                      </div>
                      <div className="time-item teacher-row">
                        <span className="stat-label">Last Exit</span>
                        <span className="stat-value exit-color">{report.Class_Time_Out}</span>
                      </div>
                      <div className="time-item class-row">
                        <span className="stat-label">Class In</span>
                        <span className="stat-value in-color">{report.Time_in}</span>
                      </div>
                      <div className="time-item class-row">
                        <span className="stat-label">Class Out</span>
                        <span className="stat-value out-color">{report.Time_out}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* CAR Layout: Sitting/Standing perfectly aligned */
                  <div className="stats-box-wrapper">
                    <div className="activity-grid-premium">
                      <div className="activity-box stand">
                        <span className="act-icon">🚶</span>
                        <span className="stat-label">Stand Time</span>
                        <span className="stat-value stand-text">{report.Stand_time}</span>
                      </div>
                      <div className="activity-box sit">
                        <span className="act-icon">🪑</span>
                        <span className="stat-label">Sit Time</span>
                        <span className="stat-value sit-text">{report.Sit_time}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="card-footer-layout">
                   <div className={`status-pill ${report.Status?.toLowerCase().replace(/\s+/g, '-').replace('+', '-')}`}>
                     {report.Status}
                   </div>
                   
                   <button className="check-media-btn">
                     Check Media
                   </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data-view">
            <p>No reports found for <strong>{teacherID}</strong> today.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherReportsDashboard;