// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Bell, X, Video, Calendar, MapPin, User, BookOpen, PlayCircle, CheckCircle, XCircle } from "lucide-react"; 
// import "./getAllTeachers.css";

// function FacultyList() {
//   const base_url = "http://localhost:8000/";
//   const navigate = useNavigate();
//   const [search, setSearch] = useState("");
//   const [facultyMembers, setFacultyMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedFaculty, setSelectedFaculty] = useState(null);
//   const [showModal, setShowModal] = useState(false);
  
//   const [notifCount, setNotifCount] = useState(0);
//   const [claims, setClaims] = useState([]);
//   const [showNotifSidebar, setShowNotifSidebar] = useState(false);

//   const [showMediaModal, setShowMediaModal] = useState(false);
//   const [activeMedia, setActiveMedia] = useState(null);

//   useEffect(() => {
//     fetchTeachers();
//     fetchNotificationCount();
//   }, []);

//   const fetchTeachers = () => {
//     axios.get(`${base_url}admin/getAllTeachers`)
//       .then((res) => {
//         setFacultyMembers(res.data.teachers || []);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching teachers:", err);
//         setLoading(false);
//       });
//   };

//   const fetchNotificationCount = async () => {
//     try {
//       const response = await axios.get(`${base_url}admin/countNotifications`);
//       setNotifCount(response.data);
//     } catch (err) {
//       console.error("Error fetching count:", err);
//     }
//   };

//   const handleBellClick = async () => {
//     setShowNotifSidebar(true);
//     try {
//       const res = await axios.get(`${base_url}admin/teacherClaimNotifications`);
//       if (res.data && res.data.Claims) {
//         setClaims(res.data.Claims);
//       }
//     } catch (err) {
//       console.error("Error fetching claims:", err);
//     }
//   };

//   const openMediaPopup = (claim) => {
//     setActiveMedia(claim);
//     setShowMediaModal(true);
//   };

//   // Naya function Claim Accept/Reject karne ke liye
//   const handleClaimAction = async (claimId, status) => {
//     try {
//       // In progress API call example:
//       // await axios.post(`${base_url}admin/updateClaimStatus`, { claimId, status });
//       alert(`Claim ${status} successfully!`);
//       setShowMediaModal(false);
//       fetchNotificationCount();
//       handleBellClick(); // Refresh claims list
//     } catch (err) {
//       console.error("Action failed:", err);
//     }
//   };

//   const openPopup = (faculty) => {
//     setSelectedFaculty(faculty);
//     setShowModal(true);
//   };

//   const filteredFaculty = facultyMembers.filter((f) =>
//     f.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="faculty-dashboard-stage">
//       {/* 🔹 Notification Sidebar */}
//       <div className={`notif-sidebar ${showNotifSidebar ? "open" : ""}`}>
//         <div className="sidebar-header">
//           <h3>Pending Claims ({claims.length})</h3>
//           <button className="close-sidebar" onClick={() => setShowNotifSidebar(false)}><X /></button>
//         </div>
//         <div className="sidebar-content">
//           {claims.length > 0 ? (
//             claims.map((claim) => (
//               <div key={claim.notification_id} className="claim-card">
//                 <div className="claim-header">
//                   <User size={16} /> <strong>{claim.teacher_name}</strong>
//                   <span className="claim-date">{claim.date}</span>
//                 </div>
//                 <div className="claim-body">
//                   <p><BookOpen size={14} /> {claim.course_name} ({claim.class})</p>
//                   <p><MapPin size={14} /> Venue: {claim.venue}</p>
//                   <div className="time-info">
//                     <span><b>Sch:</b> {claim.class_time_in} - {claim.class_time_out}</span>
//                     <span><b>Act:</b> {claim.time_in || "N/A"} - {claim.time_out || "N/A"}</span>
//                   </div>
//                 </div>
//                 <div className="claim-actions">
//                   <button onClick={() => openMediaPopup(claim)}>
//                     <Video size={14} /> Check Media
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="no-notif">No pending claims found.</div>
//           )}
//         </div>
//       </div>

//       <div className="faculty-container">
//         {/* Header Section */}
//         <div className="faculty-header-section">
//           <div className="title-group">
//             <h2 className="faculty-title">Faculty List</h2>
//             <p className="faculty-subtitle">Manage and monitor faculty performance</p>
//           </div>

//           <div className="header-right-actions">
//             <div className="faculty-search-wrapper">
//               <div className="faculty-search">
//                 <input 
//                   type="text" 
//                   placeholder="Search staff..." 
//                   value={search} 
//                   onChange={(e) => setSearch(e.target.value)} 
//                 />
//               </div>
              
//               <div className="notification-bell-wrapper" onClick={handleBellClick}>
//                 <Bell className="admin-bell-icon" size={40} />
//                 {notifCount > 0 && (
//                   <span className="notif-badge-dot">{notifCount > 99 ? "99+" : notifCount}</span>
//                 )}
//               </div>
//               <div className="staff-count">Total: <strong>{filteredFaculty.length}</strong></div>
//             </div>
//           </div>
//         </div>

//         {loading ? (
//           <div className="loading-state">Loading Teachers...</div>
//         ) : (
//           <div className="faculty-grid">
//             {filteredFaculty.map((faculty, index) => (
//               <div key={index} className="faculty-card-premium" onClick={() => openPopup(faculty)}>
//                 <div className="card-inner">
//                   <div className="image-holder">
//                     <img
//                       src={faculty.pic ? `${base_url}${faculty.pic.replace(/\\/g, '/')}` : "/images/default-user.png"}
//                       alt={faculty.name}
//                       onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + faculty.name; }}
//                     />
//                   </div>
//                   <div className="info-holder">
//                     <h3 className="staff-name">{faculty.name}</h3>
//                     <p className="staff-dept">Faculty Member</p>
//                     <button className="view-profile-btn">Manage</button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* 🔹 Media Comparison Modal (Adjusted Length & Actions) */}
//       {showMediaModal && activeMedia && (
//         <div className="media-modal-overlay" onClick={() => setShowMediaModal(false)}>
//           <div className="media-modal-card" onClick={(e) => e.stopPropagation()}>
//             <div className="media-modal-header">
//               <h3>Media Verification - {activeMedia.teacher_name}</h3>
//               <button className="close-media" onClick={() => setShowMediaModal(false)}><X /></button>
//             </div>
            
//             <div className="media-scroll-area">
//               <div className="media-grid"> {/* Direct grid use karein */}
//                <div className="media-box">
//                  <span className="media-label"><PlayCircle size={12}/> Arrival (Time In)</span>
//                  <video controls src={`${base_url}${activeMedia.video_paths.time_in_path}`} />
//                  <p>Recorded at: {activeMedia.time_in || "N/A"}</p>
//                </div>
//               <div className="media-box">
//                 <span className="media-label"><PlayCircle size={12}/> Departure (Time Out)</span>
//                 <video controls src={`${base_url}${activeMedia.video_paths.time_out_path}`} />
//                 <p>Recorded at: {activeMedia.time_out || "N/A"}</p>
//              </div>
//             </div>
//            </div>

//             {/* Verification Actions */}
//             <div className="media-verification-actions">
//                 <button className="verify-btn accept" onClick={() => handleClaimAction(activeMedia.notification_id, 'Accepted')}>
//                     <CheckCircle size={18} /> Accept Claim
//                 </button>
//                 <button className="verify-btn reject" onClick={() => handleClaimAction(activeMedia.notification_id, 'Rejected')}>
//                     <XCircle size={18} /> Reject Claim
//                 </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Faculty Profile Modal */}
//       {showModal && selectedFaculty && (
//         <div className="faculty-modal-overlay" onClick={() => setShowModal(false)}>
//           <div className="faculty-modal-card" onClick={(e) => e.stopPropagation()}>
//             <button className="modal-close-icon" onClick={() => setShowModal(false)}>&times;</button>
//             <div className="modal-main-content">
//               <div className="modal-profile-section">
//                 <img 
//                   src={selectedFaculty.pic ? `${base_url}${selectedFaculty.pic.replace(/\\/g, '/')}` : "/images/default-user.png"} 
//                   alt={selectedFaculty.name} 
//                 />
//                 <h2 className="modal-teacher-name">{selectedFaculty.name}</h2>
//                 <span className="modal-tag">Verified Faculty</span>
//               </div>
//               <div className="modal-options-section">
//                 <h3 className="options-title">Management Options</h3>
//                 <div className="options-grid">
//                   <button className="option-btn" onClick={() => navigate("/view-recordings", { state: { teacherId: selectedFaculty.User_ID } })}>
//                     <div className="opt-icon">🎥</div>
//                     <div className="opt-text"><strong>View Recording</strong><p>Review class sessions</p></div>
//                   </button>
//                   <button className="option-btn" onClick={() => navigate("/Get_teacher_schedule", { state: { teacherId: selectedFaculty.User_ID } })}>
//                     <div className="opt-icon">📅</div>
//                     <div className="opt-text"><strong>View Schedule</strong><p>Check timetable</p></div>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default FacultyList;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bell, X, Video, Calendar, MapPin, User, BookOpen, PlayCircle, CheckCircle, XCircle } from "lucide-react"; 
import "./getAllTeachers.css";

function FacultyList() {
  const base_url = "http://localhost:8000/";
  const navigate = useNavigate();
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

  // 🔹 Main logic for Accept/Reject backend calls
  const handleClaimAction = async (claimId, actionType) => {
    try {
      if (actionType === 'Accepted') {
        // Backend: @router.put("/claimAccepted")
        await axios.put(`${base_url}admin/claimAccepted?notificationId=${claimId}`);
        alert("Claim Accepted Successfully!");
      } 
      else if (actionType === 'Rejected') {
        const comment = prompt("Please enter a reason for rejection:");
        if (comment === null) return; // User cancelled
        
        // Backend: @router.put("/claimRejected")
        await axios.put(`${base_url}admin/claimRejected?notificationId=${claimId}&comment=${comment || "No reason provided"}`);
        alert("Claim Rejected Successfully!");
      }

      // Refresh Data
      setShowMediaModal(false);
      fetchNotificationCount();
      handleBellClick(); // Updates the sidebar list
    } catch (err) {
      console.error(`${actionType} action failed:`, err);
      alert("Error: Action could not be completed.");
    }
  };

  const openPopup = (faculty) => {
    setSelectedFaculty(faculty);
    setShowModal(true);
  };

  const filteredFaculty = facultyMembers.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="faculty-dashboard-stage">
      {/* 🔹 Notification Sidebar */}
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
                  <span className="claim-date">{claim.date}</span>
                </div>
                <div className="claim-body">
                  <p><BookOpen size={14} /> {claim.course_name} ({claim.class})</p>
                  <p><MapPin size={14} /> Venue: {claim.venue}</p>
                  <div className="time-info">
                    <span><b>Sch:</b> {claim.class_time_in} - {claim.class_time_out}</span>
                    <span><b>Act:</b> {claim.time_in || "N/A"} - {claim.time_out || "N/A"}</span>
                  </div>
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
        {/* Header Section */}
        <div className="faculty-header-section">
          <div className="title-group">
            <h2 className="faculty-title">Faculty List</h2>
            <p className="faculty-subtitle">Manage and monitor faculty performance</p>
          </div>

          <div className="header-right-actions">
            <div className="faculty-search-wrapper">
              <div className="faculty-search">
                <input 
                  type="text" 
                  placeholder="Search staff..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
              </div>
              
              <div className="notification-bell-wrapper" onClick={handleBellClick}>
                <Bell className="admin-bell-icon" size={40} />
                {notifCount > 0 && (
                  <span className="notif-badge-dot">{notifCount > 99 ? "99+" : notifCount}</span>
                )}
              </div>
              <div className="staff-count">Total: <strong>{filteredFaculty.length}</strong></div>
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
                    <img
                      src={faculty.pic ? `${base_url}${faculty.pic.replace(/\\/g, '/')}` : "/images/default-user.png"}
                      alt={faculty.name}
                      onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + faculty.name; }}
                    />
                  </div>
                  <div className="info-holder">
                    <h3 className="staff-name">{faculty.name}</h3>
                    <p className="staff-dept">Faculty Member</p>
                    <button className="view-profile-btn">Manage</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Media Comparison Modal */}
      {showMediaModal && activeMedia && (
        <div className="media-modal-overlay" onClick={() => setShowMediaModal(false)}>
          <div className="media-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="media-modal-header">
              <h3>Media Verification - {activeMedia.teacher_name}</h3>
              <button className="close-media" onClick={() => setShowMediaModal(false)}><X /></button>
            </div>
            
            <div className="media-scroll-area">
                <div className="media-grid">
                    <div className="media-box">
                        <span className="media-label"><PlayCircle size={16}/> Arrival (Time In)</span>
                        <video controls src={`${base_url}${activeMedia.video_paths.time_in_path}`} />
                        <p>Recorded at: {activeMedia.time_in || "N/A"}</p>
                    </div>
                    <div className="media-box">
                        <span className="media-label"><PlayCircle size={16}/> Departure (Time Out)</span>
                        <video controls src={`${base_url}${activeMedia.video_paths.time_out_path}`} />
                        <p>Recorded at: {activeMedia.time_out || "N/A"}</p>
                    </div>
                </div>
            </div>

            {/* Verification Buttons Connected to Backend */}
            <div className="media-verification-actions">
                <button 
                  className="verify-btn accept" 
                  onClick={() => handleClaimAction(activeMedia.notification_id, 'Accepted')}
                >
                    <CheckCircle size={18} /> Accept Claim
                </button>
                <button 
                  className="verify-btn reject" 
                  onClick={() => handleClaimAction(activeMedia.notification_id, 'Rejected')}
                >
                    <XCircle size={18} /> Reject Claim
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Faculty Profile Modal */}
      {showModal && selectedFaculty && (
        <div className="faculty-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="faculty-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-icon" onClick={() => setShowModal(false)}>&times;</button>
            <div className="modal-main-content">
              <div className="modal-profile-section">
                <img 
                  src={selectedFaculty.pic ? `${base_url}${selectedFaculty.pic.replace(/\\/g, '/')}` : "/images/default-user.png"} 
                  alt={selectedFaculty.name} 
                />
                <h2 className="modal-teacher-name">{selectedFaculty.name}</h2>
                
              </div>
              <div className="modal-options-section">
                <h3 className="options-title">Management Options</h3>
                <div className="options-grid">
                  <button className="option-btn" onClick={() => navigate("/view-recordings", { state: { teacherId: selectedFaculty.User_ID } })}>
                    <div className="opt-icon">🎥</div>
                    <div className="opt-text"><strong>View Reports</strong></div>
                  </button>
                  <button className="option-btn" onClick={() => navigate("/Get_teacher_schedule", { state: { teacherId: selectedFaculty.User_ID } })}>
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