import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./VenueDashboard.css";

function VenueDashboard() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [selectedVenue, setSelectedVenue] = useState(null);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/admin/getBusyVenues");
      setVenues(res.data.Venues || []);
    } catch (err) {
      console.error("Error fetching venues:", err);
    } finally {
      setLoading(false);
    }
  };

  // Button click handle karne ke liye function
  const onCamClick = (venueId) => {
    setSelectedVenue(venueId);
    fileInputRef.current.click(); // File explorer khulega
  };

  // File select hone par backend par bhejna
  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedVenue) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("venue_id", selectedVenue);

    try {
      alert("Video uploading & processing started...");
      const res = await axios.post("http://localhost:8000/admin/generate_Teacher_CHR_Report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data.status);
    } catch (err) {
      alert(err.response?.data?.detail || "Error starting process");
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="video/*"
        onChange={handleVideoUpload}
      />

      <header className="premium-header">
        <div className="header-content">
          <h1>Live Venue Monitoring</h1>
          <p>Real-time tracking of ongoing classes and camera feeds</p>
        </div>
        <button className="refresh-btn" onClick={fetchVenues}>🔄 Refresh Live</button>
      </header>

      <main className="venue-grid-stage">
        {loading ? (
          <div className="loader-box"><div className="spinner-premium"></div></div>
        ) : venues.length > 0 ? (
          venues.map((venue, index) => (
            <div key={index} className="venue-card-premium">
              <div className="card-top-section">
                <div className="venue-icon-wrapper">
                  <div className="venue-icon">🏛️</div>
                </div>
                <div className="venue-info">
                  <h2 className="venue-title">Venue: {venue.venue_id}</h2>
                  <h3 className="course-name">{venue.Course}</h3>
                  <div className="meta-details">
                    <span>👤 {venue.Teacher}</span>
                    <span className="discipline-tag">{venue.Discipline}</span>
                  </div>
                </div>
              </div>

              <div className="card-actions-premium">
                <button className="cam-btn front-btn" onClick={() => onCamClick(venue.venue_id)}>
                  <span className="icon">📷</span>
                  <span className="label">Front Cam</span>
                </button>
                <button className="cam-btn back-btn" onClick={() => onCamClick(venue.venue_id)}>
                  <span className="icon">📸</span>
                  <span className="label">Back Cam</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">No active classes found at this time.</div>
        )}
      </main>
    </div>
  );
}

export default VenueDashboard;