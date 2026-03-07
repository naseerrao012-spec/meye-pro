import React, { useState, useEffect } from "react";
import axios from "axios";
import "./getAllTeachers.css";

function FacultyList() {
  const base_url = "http://localhost:8000/";
  const [search, setSearch] = useState("");
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
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
  }, []);

  const openPopup = (faculty) => {
    setSelectedFaculty(faculty);
    setShowModal(true);
  };

  const closePopup = () => {
    setShowModal(false);
    setSelectedFaculty(null);
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

          <div className="faculty-search-wrapper">
            <div className="faculty-search">
              <input
                type="text"
                placeholder="Search staff by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="staff-count">
              Total: <strong>{filteredFaculty.length}</strong>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading Faculty Data...</div>
        ) : (
          <div className="faculty-grid">
            {filteredFaculty.map((faculty, index) => (
              <div key={index} className="faculty-card-premium" onClick={() => openPopup(faculty)}>
                <div className="card-inner">
                  <div className="image-holder">
                    <img
                      src={faculty.pic ? `${base_url}${faculty.pic.replace(/\\/g, '/')}` : "/images/default-user.png"}
                      alt={faculty.name}
                      onError={(e) => {
                        e.target.src = "https://ui-avatars.com/api/?name=" + faculty.name + "&background=random";
                      }}
                    />
                    {/* Green status-indicator removed from here */}
                  </div>
                  
                  <div className="info-holder">
                    <h3 className="staff-name">{faculty.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                  <button className="option-btn recording" onClick={() => alert("Opening Recordings...")}>
                    <span className="opt-icon">🎥</span>
                    <div className="opt-text">
                      <strong>View Recording</strong>
                      <p>Check class video evidence</p>
                    </div>
                  </button>
                  <button className="option-btn schedule" onClick={() => alert("Opening Schedule...")}>
                    <span className="opt-icon">📅</span>
                    <div className="opt-text">
                      <strong>View Schedule</strong>
                      <p>Check assigned timetables</p>
                    </div>
                  </button>
                  <button className="option-btn chr" onClick={() => alert("Opening CHR...")}>
                    <span className="opt-icon">📋</span>
                    <div className="opt-text">
                      <strong>View CHR</strong>
                      <p>Class Held Report details</p>
                    </div>
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