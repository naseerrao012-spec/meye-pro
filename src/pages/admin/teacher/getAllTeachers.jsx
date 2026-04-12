


// import React, { useState, useEffect } from "react";
// import axios from "axios";

// import { useNavigate } from "react-router-dom";
// import "./getAllTeachers.css";

// function FacultyList() {
//   const base_url = "http://localhost:8000/";

//   const navigate = useNavigate();
//   const [search, setSearch] = useState("");
//   const [facultyMembers, setFacultyMembers] = useState([]);


//   const [loading, setLoading] = useState(true);
//   const [selectedFaculty, setSelectedFaculty] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     axios
//       .get("http://localhost:8000/admin/getAllTeachers")
//       .then((res) => {
//         setFacultyMembers(res.data.teachers || []);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching teachers:", err);
//         setLoading(false);
//       });
//   }, []);

//   const openPopup = (faculty) => {
//     setSelectedFaculty(faculty);
//     setShowModal(true);
//   };

//   const closePopup = () => {
//     setShowModal(false);
//     setSelectedFaculty(null);
//   };

//   const handleNavigation = (path) => {
//     if (selectedFaculty) {
//       // 🔍 EXACT FIX: Aapke console ke mutabiq key "User_ID" hai
//       const tId = selectedFaculty.User_ID || 
//                   selectedFaculty._id || 
//                   selectedFaculty.userId || 
//                   selectedFaculty.teacherId;

//       console.log("Navigating with ID:", tId);

//       if (!tId) {
//         alert("Error: ID key 'User_ID' not found in object!");
//         return;
//       }

//       // App.jsx ke route "/Get_teacher_schedule" par navigate karein
//       navigate(path, { state: { teacherId: tId } });

//     }
//   };

//   const filteredFaculty = facultyMembers.filter((f) =>
//     f.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="faculty-dashboard-stage">
//       <div className="faculty-container">
//         <div className="faculty-header-section">
//           <div className="title-group"><h2 className="faculty-title">Faculty List</h2></div>
//           <div className="faculty-search-wrapper">
//             <input 
//               type="text" 
//               placeholder="Search staff..." 
//               value={search} 
//               onChange={(e) => setSearch(e.target.value)} 
//             />
//             <div className="staff-count">Total: <strong>{filteredFaculty.length}</strong></div>
//           </div>
//         </div>

//         {loading ? (
//           <div className="loading-state">Loading...</div>
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
//                   <div className="info-holder"><h3 className="staff-name">{faculty.name}</h3></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {showModal && selectedFaculty && (
//         <div className="faculty-modal-overlay" onClick={closePopup}>
//           <div className="faculty-modal-card" onClick={(e) => e.stopPropagation()}>
//             <button className="modal-close-icon" onClick={closePopup}>&times;</button>
//             <div className="modal-main-content">
//               <div className="modal-profile-section">
//                 <img 
//                   src={selectedFaculty.pic ? `${base_url}${selectedFaculty.pic.replace(/\\/g, '/')}` : "/images/default-user.png"} 
//                   alt={selectedFaculty.name} 
//                 />
//                 <h2 className="modal-teacher-name">{selectedFaculty.name}</h2>
//               </div>
//               <div className="modal-options-section">
//                 <h3 className="options-title">Management Options</h3>
//                 <div className="options-grid">
//                   <button className="option-btn recording" onClick={() => handleNavigation("/view-recordings")}>
//                     🎥 <strong>View Recording</strong>
//                   </button>
//                   <button className="option-btn schedule" onClick={() => handleNavigation("/Get_teacher_schedule")}>
//                     📅 <strong>View Schedule</strong>
//                   </button>
//                   <button className="option-btn chr" onClick={() => handleNavigation("/view-chr")}>
//                     📋 <strong>View CHR</strong>
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
import { Bell } from "lucide-react"; 
import "./getAllTeachers.css";

function FacultyList() {
  const base_url = "http://localhost:8000/";
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // 🔹 Notification count state (Initial 0)
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    // 1. Fetch Teachers
    axios
      .get("http://localhost:8000/admin/getAllTeachers")
      .then((res) => {
        setFacultyMembers(res.data.teachers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching teachers:", err);
        setLoading(false);
      });

    // 2. Fetch Notification Count on View Load
    const fetchCount = async () => {
      try {
        const response = await axios.get("http://localhost:8000/admin/countNotifications");
        // Response direct integer hai (e.g. 5), isay state mein set karein
        // React automatically number ko text ki jagah render kar leta hai
        setNotifCount(response.data);
      } catch (err) {
        console.error("Error fetching notification count:", err);
        setNotifCount(0); // Error ki surat mein 0 rakhein
      }
    };

    fetchCount();
  }, []);

  const openPopup = (faculty) => {
    setSelectedFaculty(faculty);
    setShowModal(true);
  };

  const closePopup = () => {
    setShowModal(false);
    setSelectedFaculty(null);
  };

  const handleNavigation = (path) => {
    if (selectedFaculty) {
      const tId = selectedFaculty.User_ID || 
                  selectedFaculty._id || 
                  selectedFaculty.userId || 
                  selectedFaculty.teacherId;

      if (!tId) {
        alert("Error: ID key 'User_ID' not found!");
        return;
      }
      navigate(path, { state: { teacherId: tId } });
    }
  };

  const filteredFaculty = facultyMembers.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="faculty-dashboard-stage">
      <div className="faculty-container">
        
        <div className="faculty-header-section">
          <div className="title-group">
            <h2 className="faculty-title">Faculty List</h2>
          </div>

          <div className="header-right-actions">
            <div className="faculty-search-wrapper">
              <input 
                type="text" 
                placeholder="Search staff..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
              
              {/* 🔔 Notification Bell with Dynamic Count */}
              <div className="notification-bell-wrapper" onClick={() => navigate("/admin-notifications")}>
                <Bell className="admin-bell-icon" size={40} />
                {notifCount > 0 && (
                  <span className="notif-badge-dot">
                    {/* Integer ko string mein convert karne ki zaroorat nahi, template literal kaafi hai */}
                    {notifCount > 99 ? "99+" : `${notifCount}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading...</div>
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
                  <div className="info-holder"><h3 className="staff-name">{faculty.name}</h3></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal code remains same */}
      {showModal && selectedFaculty && (
        <div className="faculty-modal-overlay" onClick={closePopup}>
          <div className="faculty-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-icon" onClick={closePopup}>&times;</button>
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
                  <button className="option-btn recording" onClick={() => handleNavigation("/view-recordings")}>
                    🎥 <strong>View Recording</strong>
                  </button>
                  <button className="option-btn schedule" onClick={() => handleNavigation("/Get_teacher_schedule")}>
                    📅 <strong>View Schedule</strong>
                  </button>
                  <button className="option-btn chr" onClick={() => handleNavigation("/view-chr")}>
                    📋 <strong>View CHR</strong>
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