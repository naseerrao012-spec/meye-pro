import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TeacherReportsDashboard.css";

const TeacherReportsDashboard = () => {
  const [reports, setReports] = useState([]);
  const [viewMode, setViewMode] = useState("CHR");
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null); // Single URL for the current active view
  const [rawVids, setRawVids] = useState({ in: null, out: null });
  const [activeVideo, setActiveVideo] = useState("in");
  const [modalLoading, setModalLoading] = useState(false);

  const teacherID = localStorage.getItem("userId");

  const fetchReports = async (date) => {
    if (!teacherID) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/teacher/TeacherCHRByDate?teacherID=${teacherID}&date=${date}`);
      setReports(res.data.CHR_Reports || []);
    } catch (err) {
      console.error("Error fetching reports", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckMedia = async (schId) => {
    try {
      setModalLoading(true);
      setShowVideoModal(true);
      const res = await axios.get(`http://localhost:8000/teacher/getScheduleVideo?date=${selectedDate}&scheduleId=${schId}`);
      
      const vids = res.data.Videos;
      setRawVids({
        in: vids.Time_in_video,
        out: vids.Time_out_video
      });
      
      loadVideo(vids.Time_in_video); // Default to "in" video
      setActiveVideo("in");
    } catch (err) {
      alert("Media files not accessible.");
      setShowVideoModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  // Function to load video as a Blob to bypass codec/partial content issues
  const loadVideo = async (path) => {
    if (!path) {
      setVideoUrl(null);
      return;
    }
    try {
      const cleanPath = path.replace(/\\/g, '/').replace(/^\/+/, '');
      const fullUrl = `http://localhost:8000/${cleanPath}`;
      
      // Fetch as blob to force browser to handle the file data directly
      const response = await axios.get(fullUrl, { responseType: 'blob' });
      const blobUrl = URL.createObjectURL(response.data);
      setVideoUrl(blobUrl);
    } catch (error) {
      console.error("Blob Loading Error:", error);
      setVideoUrl(null);
    }
  };

  // Switch between In and Out videos
  const toggleVideo = (type) => {
    setActiveVideo(type);
    loadVideo(rawVids[type]);
  };

  useEffect(() => {
    fetchReports(selectedDate);
  }, [selectedDate, teacherID]);

  // Cleanup Blob URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  return (
    <div className="reports-full-page">
      <header className="reports-header">
        <div className="header-left">
          <h1>Faculty Performance Dashboard</h1>
          <div className="date-picker-wrapper">
            <label>Select Report Date: </label>
            <input 
              type="date" 
              className="custom-date-input"
              value={selectedDate}
              max={new Date().toISOString().split('T')[0]} 
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
        
        <div className="toggle-container">
          <button className={`toggle-btn ${viewMode === "CHR" ? "active" : ""}`} onClick={() => setViewMode("CHR")}>Class Held (CHR)</button>
          <button className={`toggle-btn ${viewMode === "CAR" ? "active" : ""}`} onClick={() => setViewMode("CAR")}>Class Activity (CAR)</button>
        </div>
      </header>

      <main className="reports-grid">
        {loading ? (
          <div className="loader-container"><div className="premium-spinner"></div><p>Fetching Data...</p></div>
        ) : reports.length > 0 ? (
          reports.map((report, index) => (
            <div key={index} className="report-card-premium">
              <div className="card-accent-line"></div>
              <h2 className="report-title">{viewMode === "CHR" ? "Class Held Report" : "Class Activity Report"}</h2>
              
              <div className="report-details">
                <div className="detail-row"><span>Course:</span> <strong>{report.Course}</strong></div>
                <div className="detail-row"><span>Discipline:</span> <strong>{report.Discipline}</strong></div>
                <div className="detail-row"><span>Venue:</span> <strong>{report.Venue}</strong></div>
                <div className="detail-row"><span>Schedule:</span> <strong>{report.Class_time}</strong></div>
                <hr className="section-divider" />

                {viewMode === "CHR" ? (
                  <div className="stats-box-wrapper">
                    <div className="time-grid-4">
                      <div className="time-item teacher-row"><span className="stat-label">First Entry</span><span className="stat-value entry-color">{report.Class_Time_In || "--:--"}</span></div>
                      <div className="time-item teacher-row"><span className="stat-label">Last Exit</span><span className="stat-value exit-color">{report.Class_Time_Out || "--:--"}</span></div>
                      <div className="time-item class-row"><span className="stat-label">Class In</span><span className="stat-value in-color">{report.Time_in || "--:--"}</span></div>
                      <div className="time-item class-row"><span className="stat-label">Class Out</span><span className="stat-value out-color">{report.Time_out || "--:--"}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="stats-box-wrapper">
                    <div className="activity-grid-premium">
                      <div className="activity-box stand"><span className="act-icon">🚶</span><span className="stat-label">Stand Time</span><span className="stat-value stand-text">{report.Stand_time}</span></div>
                      <div className="activity-box sit"><span className="act-icon">🪑</span><span className="stat-label">Sit Time</span><span className="stat-value sit-text">{report.Sit_time}</span></div>
                    </div>
                  </div>
                )}

                <div className="card-footer-layout">
                    <div className={`status-pill ${report.Status?.toLowerCase().replace(/\s+/g, '-').replace('+', '-')}`}>{report.Status}</div>
                    <button className="check-media-btn" onClick={() => handleCheckMedia(report.SchduleId)}>Check Media</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data-view"><p>No reports found for <strong>{selectedDate}</strong>.</p></div>
        )}
      </main>

      {showVideoModal && (
        <div className="video-modal-overlay">
          <div className="video-modal-container">
            <button className="close-modal" onClick={() => setShowVideoModal(false)}>×</button>
            {modalLoading ? <p>Loading Evidence...</p> : (
              <>
                <h3>Evidence: {selectedDate}</h3>
                <div className="video-switch">
                  <button className={activeVideo === "in" ? "active" : ""} onClick={() => toggleVideo("in")}>Entry View</button>
                  <button className={activeVideo === "out" ? "active" : ""} onClick={() => toggleVideo("out")}>Exit View</button>
                </div>

                <div className="video-player-wrapper">
                  {videoUrl ? (
                    <video 
                      key={videoUrl}
                      controls 
                      autoPlay 
                      className="main-video"
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="no-video-msg">Video not captured for this segment.</div>
                  )}
                </div>

                <div className="modal-footer">
                   <button className="claim-btn" onClick={() => alert("Claim submitted!")}>Claim Discrepancy</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherReportsDashboard;