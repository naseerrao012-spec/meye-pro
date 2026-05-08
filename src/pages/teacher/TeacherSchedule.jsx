import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Bell, X, User, BookOpen, MapPin, 
  Calendar, PlayCircle, CheckCircle, XCircle 
} from "lucide-react"; 
import "./TeacherSchedule.css";

const TeacherSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifCount, setNotifCount] = useState(0); 
  
  // Sidebar States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  // Media Modal States
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [activeNotif, setActiveNotif] = useState(null);

  const teacherID = localStorage.getItem("userId");
  const base_url = "http://localhost:8000";

  useEffect(() => {
    fetchSchedule();
    fetchNotifCount();
  }, [teacherID]);

  const fetchSchedule = async () => {
    if (!teacherID) return;
    try {
      setLoading(true);
      const res = await axios.get(`${base_url}/teacher/getTeacherSchedule?teacherId=${teacherID}`);
      setSchedule(res.data.Lectures || []);
    } catch (err) {
      console.error("Error fetching schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifCount = async () => {
    if (!teacherID) return;
    try {
      const res = await axios.get(`${base_url}/teacher/notification-count?teacher_id=${teacherID}`);
      setNotifCount(res.data.pending_claims_count || 0);
    } catch (err) {
      console.error("Error fetching notification count:", err);
    }
  };

  const handleBellClick = async () => {
    setIsSidebarOpen(true);
    if (!teacherID) return;
    try {
      setNotifLoading(true);
      const res = await axios.get(`${base_url}/teacher/student-claim-notifications?teacher_id=${teacherID}`);
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Error fetching claim details:", err);
    } finally {
      setNotifLoading(false);
    }
  };

  // 🎥 Handle Media Modal
  const openMediaModal = (notif) => {
    setActiveNotif(notif);
    setShowMediaModal(true);
  };

  // ✅ ❌ Handle Accept/Reject Actions
  const handleClaimAction = async (notificationId, action) => {
    try {
      if (action === 'accept') {
        const res = await axios.put(`${base_url}/teacher/claimStudentAccepted?notificationId=${notificationId}`);
        alert(res.data.Status);
      } else {
        const comment = prompt("Please enter reason for rejection:");
        if (comment === null) return; // Cancelled by user
        const res = await axios.put(`${base_url}/teacher/claimStudentRejected?notificationId=${notificationId}&comment=${comment || "No Reason"}`);
        alert(res.data.Status);
      }

      // UI Refresh
      setShowMediaModal(false);
      handleBellClick(); // Reload notifications list
      fetchNotifCount(); // Update bell badge
    } catch (err) {
      console.error("Action failed:", err);
      alert("Error processing claim action.");
    }
  };

  return (
    <div className="schedule-page-container">
      
      {/* 🔹 Media Verification Modal */}
      {showMediaModal && activeNotif && (
        <div className="media-modal-overlay">
          <div className="media-modal-card">
            <div className="media-modal-header">
              <h3>Evidence Verification</h3>
              <button className="close-btn" onClick={() => setShowMediaModal(false)}><X size={20}/></button>
            </div>
            <div className="media-modal-body">
              <p className="student-label">Checking media for: <strong>{activeNotif.student_name}</strong></p>
              <div className="video-box">
                {activeNotif.video_path ? (
                  <video key={activeNotif.video_path} controls autoPlay className="main-video">
                   <source src={`${base_url}/CapturedFrames/${activeNotif.video_path}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                ) : (
                  <div className="no-video-error">No Video Evidence Found</div>
                )}
              </div>
            </div>
            <div className="media-modal-footer">
              <button className="modal-btn reject" onClick={() => handleClaimAction(activeNotif.notification_id, 'reject')}>
                <XCircle size={18} /> Reject
              </button>
              <button className="modal-btn accept" onClick={() => handleClaimAction(activeNotif.notification_id, 'accept')}>
                <CheckCircle size={18} /> Accept Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Notification Sidebar */}
      <div className={`notification-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Attendance Claims</h3>
          <button className="close-btn" onClick={() => setIsSidebarOpen(false)}><X size={22} /></button>
        </div>
        <div className="sidebar-content">
          {notifLoading ? (
            <div className="sidebar-loader">Fetching claims...</div>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif.notification_id} className="claim-card-blue">
                <div className="claim-header">
                   <span className="student-name"><User size={16}/> {notif.student_name}</span>
                   <span className="claim-date">{notif.date}</span>
                </div>
                <div className="claim-body">
                  <p><BookOpen size={14}/> {notif.course_name}</p>
                  <p><Calendar size={14}/> {notif.class_info} | <MapPin size={14}/> Venue: {notif.venue_info}</p>
                  <div className="status-badge-pending">Status: Pending Approval</div>
                </div>
                <button className="check-media-btn" onClick={() => openMediaModal(notif)}>
                  <PlayCircle size={18} /> Check Media Evidence
                </button>
              </div>
            ))
          ) : (
            <div className="no-claims">No pending claims found.</div>
          )}
        </div>
      </div>

      <header className="schedule-top-bar">
        <div className="title-section">
          <h1>Today's Schedule</h1>
          <p className="current-day">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <div className="header-actions">
          <div className="notification-wrapper" onClick={handleBellClick}>
            <Bell className="bell-icon" size={28} />
            {notifCount > 0 && (
              <span className="notification-badge">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
          </div>
          <div className="stats-badge">
            Total Classes: <span>{schedule.length}</span>
          </div>
        </div>
      </header>

      <main className="schedule-full-view">
        {loading ? (
          <div className="schedule-loader">
            <div className="spinner"></div>
            <p>Loading your lectures...</p>
          </div>
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