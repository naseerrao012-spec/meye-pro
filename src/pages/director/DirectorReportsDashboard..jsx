import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DirectorReportsDashboard.css";

function DirectorReportsDashboard() {
  const base_url = "http://localhost:8000/";
  
  const [search, setSearch] = useState("");
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState("CHR");

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrls, setVideoUrls] = useState({ in: null, out: null });
  const [activeVideo, setActiveVideo] = useState("in");
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = () => {
    axios.get(`${base_url}director/getAllTeachers`)
      .then((res) => {
        setFacultyMembers(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchCHRData = async (tId, date) => {
    try {
      setReportLoading(true);
      const res = await axios.get(`${base_url}director/TeacherCHR?teacherID=${tId}&date=${date}`);
      setReports(res.data.CHR_Reports || []);
    } catch (err) {
      console.error(err);
      setReports([]);
    } finally {
      setReportLoading(false);
    }
  };

  const handleCheckMedia = async (scheduleId) => {
    try {
      setShowVideoModal(true);
      setModalLoading(true);
      const res = await axios.get(`${base_url}teacher/getScheduleVideo?date=${selectedDate}&scheduleId=${scheduleId}`);
      
      const vids = res.data.Videos;
      const formatPath = (path) => path ? `${base_url}${path.replace(/\\/g, '/')}` : null;

      setVideoUrls({
        in: formatPath(vids.Time_in_video),
        out: formatPath(vids.Time_out_video)
      });
      setActiveVideo("in");
    } catch (err) {
      alert("Media files not found or database error.");
      setShowVideoModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewReports = (teacher) => {
    setSelectedTeacher(teacher);
    fetchCHRData(teacher.User_ID, selectedDate);
  };

  const handleBack = () => {
    setSelectedTeacher(null);
    setReports([]);
  };

  const filteredFaculty = facultyMembers.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedTeacher) {
    return (
      <div className="reports-full-page">
        <header className="reports-header">
          <div className="header-left">
            <button className="back-btn-premium" onClick={handleBack}>← Back to List</button>
            <h1>{selectedTeacher.name} - Reports</h1>
            <div className="date-picker-wrapper">
              <label>Report Date:</label>
              <input 
                type="date" 
                className="custom-date-input"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  fetchCHRData(selectedTeacher.User_ID, e.target.value);
                }} 
              />
            </div>
          </div>
          
          <div className="toggle-container">
            <button className={`toggle-btn ${viewMode === "CHR" ? "active" : ""}`} onClick={() => setViewMode("CHR")}>CHR</button>
            <button className={`toggle-btn ${viewMode === "CAR" ? "active" : ""}`} onClick={() => setViewMode("CAR")}>CAR</button>
          </div>
        </header>

        <main className="reports-grid">
          {reportLoading ? (
            <div className="loader-container">
              <div className="premium-spinner"></div>
              <p>Fetching Data...</p>
            </div>
          ) : reports.length > 0 ? (
            reports.map((report, index) => (
              <div key={index} className="report-card-premium">
                <div className="card-accent-line"></div>
                <h2 className="report-title">{viewMode === "CHR" ? "Class Held Report" : "Class Activity Report"}</h2>
                
                <div className="report-details">
                  <div className="detail-row"><span>Course:</span> <strong>{report.Course}</strong></div>
                  <div className="detail-row"><span>Venue:</span> <strong>{report.Venue}</strong></div>
                  <div className="detail-row"><span>Schedule:</span> <strong>{report.Class_time}</strong></div>
                  <hr className="section-divider" />

                  {viewMode === "CHR" ? (
                    <div className="time-grid-4">
                      <div className="time-item teacher-row"><span className="stat-label">First Entry</span><span className="stat-value entry-color">{report.Class_Time_In}</span></div>
                      <div className="time-item teacher-row"><span className="stat-label">Last Exit</span><span className="stat-value exit-color">{report.Class_Time_Out}</span></div>
                      <div className="time-item class-row"><span className="stat-label">Class In</span><span className="stat-value in-color">{report.Time_in}</span></div>
                      <div className="time-item class-row"><span className="stat-label">Class Out</span><span className="stat-value out-color">{report.Time_out}</span></div>
                    </div>
                  ) : (
                    <div className="activity-grid-premium">
                      <div className="activity-box stand"><span className="act-icon">🚶</span><span className="stat-label">Stand Time</span><span className="stat-value stand-text">{report.Stand_time}</span></div>
                      <div className="activity-box sit"><span className="act-icon">🪑</span><span className="stat-label">Sit Time</span><span className="stat-value sit-text">{report.Sit_time}</span></div>
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
            <div className="no-data-view">
              <p>No reports found for this date.</p>
            </div>
          )}
        </main>

        {showVideoModal && (
          <div className="video-modal-overlay">
            <div className="video-modal-container">
              <div className="modal-header">
                <h3>Class Evidence - {selectedDate}</h3>
                <button className="close-modal" onClick={() => setShowVideoModal(false)}>&times;</button>
              </div>

              {modalLoading ? (
                <div className="modal-loader">Loading Video Data...</div>
              ) : (
                <>
                  <div className="video-tabs">
                    <button className={activeVideo === "in" ? "active" : ""} onClick={() => setActiveVideo("in")}>Entry Video</button>
                    <button className={activeVideo === "out" ? "active" : ""} onClick={() => setActiveVideo("out")}>Exit Video</button>
                  </div>

                  <div className="video-viewport">
                    {videoUrls[activeVideo] ? (
                      <video key={videoUrls[activeVideo]} controls autoPlay className="main-video">
                        <source src={videoUrls[activeVideo]} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="no-video-placeholder">No video recorded for this action.</div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="faculty-dashboard-stage">
      <div className="faculty-container">
        <div className="faculty-header-section">
          <div className="title-group">
            <h2 className="faculty-title">Director Dashboard</h2>
            {/* <p className="faculty-subtitle">Select a faculty member to view detailed reports</p> */}
          </div>

          <div className="header-right-actions">
            <div className="faculty-search-wrapper">
              <input 
                type="text" 
                placeholder="Search staff..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading Faculty Data...</div>
        ) : (
          <div className="faculty-grid">
            {filteredFaculty.map((faculty, index) => (
              <div key={index} className="faculty-card-premium">
                <div className="card-inner">
                  <div className="image-holder">
                    <img
                      src={faculty.pic ? `${base_url}${faculty.pic.replace(/\\/g, '/')}` : "/images/default-user.png"}
                      alt={faculty.name}
                      onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${faculty.name}`; }}
                    />
                  </div>
                  <div className="info-holder">
                    <h3 className="staff-name">{faculty.name}</h3>
                    <p className="staff-dept">ID: {faculty.User_ID}</p>
                    <button className="view-profile-btn" onClick={() => handleViewReports(faculty)}>View Reports</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DirectorReportsDashboard;