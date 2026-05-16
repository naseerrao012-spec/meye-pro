import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bell, X, Video, Calendar, MapPin, User, BookOpen, PlayCircle, CheckCircle, XCircle } from "lucide-react"; 
import "./getAllTeachers.css";

function FacultyList() {
  const base_url = "http://localhost:8000/";
  const navigate = useNavigate();

  // 🔹 Local variable for teacher ID
  const [globalTeacherId, setGlobalTeacherId] = useState(null);

  const [search, setSearch] = useState("");
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [notifCount, setNotifCount] = useState(0);
  const [claims, setClaims] = useState([]);
  const [showNotifSidebar, setShowNotifSidebar] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [activeMedia, setActiveMedia] = useState(null);

  useEffect(() => {
    fetchTeachers();
    fetchNotificationCount();
  }, []);

  const fetchTeachers = () => {
    axios.get(`${base_url}admin/getAllTeachers`)
      .then((res) => {
        setFacultyMembers(res.data.teachers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching teachers:", err);
        setLoading(false);
      });
  };

  const fetchNotificationCount = async () => {
    try {
      const response = await axios.get(`${base_url}admin/countNotifications`);
      setNotifCount(response.data);
    } catch (err) {
      console.error("Error fetching count:", err);
    }
  };

  const handleBellClick = async () => {
    setShowNotifSidebar(true);
    try {
      const res = await axios.get(`${base_url}admin/teacherClaimNotifications`);
      if (res.data && res.data.Claims) {
        setClaims(res.data.Claims);
      }
    } catch (err) {
      console.error("Error fetching claims:", err);
    }
  };

  const openMediaPopup = (claim) => {
    setActiveMedia(claim);
    setShowMediaModal(true);
  };

  const handleClaimAction = async (claimId, actionType) => {
    try {
      if (actionType === 'Accepted') {
        await axios.put(`${base_url}admin/claimAccepted?notificationId=${claimId}`);
        alert("Claim Accepted Successfully!");
      } 
      else if (actionType === 'Rejected') {
        const comment = prompt("Please enter a reason for rejection:");
        if (comment === null) return; 
        await axios.put(`${base_url}admin/claimRejected?notificationId=${claimId}&comment=${comment || "No reason provided"}`);
        alert("Claim Rejected Successfully!");
      }
      setShowMediaModal(false);
      fetchNotificationCount();
      handleBellClick(); 
    } catch (err) {
      console.error(`${actionType} action failed:`, err);
    }
  };

  // 🔹 ID Assignment logic
  const openPopup = (faculty) => {
    setSelectedFaculty(faculty);
    // Click par ID assign ho rahi hai
    setGlobalTeacherId(faculty.User_ID); 
    setShowModal(true);
  };

  const filteredFaculty = facultyMembers.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="faculty-dashboard-stage">
      {/* Pending Claims Sidebar */}
      <div className={`notif-sidebar ${showNotifSidebar ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Pending Claims ({claims.length})</h3>
          <button className="close-sidebar" onClick={() => setShowNotifSidebar(false)}><X /></button>
        </div>
        <div className="sidebar-content">
          {claims.length > 0 ? (
            claims.map((claim) => (
              <div key={claim.notification_id} className="claim-card">
                <div className="claim-header">
                  <User size={16} /> <strong>{claim.teacher_name}</strong>
                </div>
                <div className="claim-actions">
                  <button onClick={() => openMediaPopup(claim)}>
                    <Video size={14} /> Check Media
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-notif">No pending claims found.</div>
          )}
        </div>
      </div>

      <div className="faculty-container">
        <div className="faculty-header-section">
          <div className="title-group">
            <h2 className="faculty-title">Faculty List</h2>
            {/* <p className="faculty-subtitle">Manage and monitor faculty performance</p> */}
          </div>
          <div className="header-right-actions">
            <div className="faculty-search">
              <input type="text" placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="notification-bell-wrapper" onClick={handleBellClick}>
              <Bell className="admin-bell-icon" size={40} />
              {notifCount > 0 && <span className="notif-badge-dot">{notifCount}</span>}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading Teachers...</div>
        ) : (
          <div className="faculty-grid">
            {filteredFaculty.map((faculty, index) => (
              <div key={index} className="faculty-card-premium" onClick={() => openPopup(faculty)}>
                <div className="card-inner">
                  <div className="image-holder">
                    <img src={faculty.pic ? `${base_url}${faculty.pic.replace(/\\/g, '/')}` : "/images/default-user.png"} alt={faculty.name} />
                  </div>
                  <div className="info-holder">
                    <h3 className="staff-name">{faculty.name}</h3>
                    <button className="view-profile-btn">Manage</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showModal && selectedFaculty && (
        <div className="faculty-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="faculty-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-icon" onClick={() => setShowModal(false)}>&times;</button>
            <div className="modal-main-content">
              <div className="modal-profile-section">
                <img src={selectedFaculty.pic ? `${base_url}${selectedFaculty.pic.replace(/\\/g, '/')}` : "/images/default-user.png"} alt={selectedFaculty.name} />
                <h2 className="modal-teacher-name">{selectedFaculty.name}</h2>
              </div>
              <div className="modal-options-section">
                <h3 className="options-title">Management Options</h3>
                <div className="options-grid">
                  {/* 🔹 Passing ID to reports view */}
                  <button className="option-btn" onClick={() => navigate("/teacher-reports", { state: { teacherId: globalTeacherId } })}>
                    <div className="opt-icon">🎥</div>
                    <div className="opt-text"><strong>View Reports</strong></div>
                  </button>
                  <button className="option-btn" onClick={() => navigate("/Get_teacher_schedule", { state: { teacherId: globalTeacherId } })}>
                    <div className="opt-icon">📅</div>
                    <div className="opt-text"><strong>View Schedule</strong></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyList;