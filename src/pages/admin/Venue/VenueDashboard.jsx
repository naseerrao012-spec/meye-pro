import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VenueDashboard.css";

function VenueDashboard() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      // Integration Point: Calling your FastAPI endpoint
      const res = await axios.get("http://localhost:8000/admin/getBusyVenues");
      
      // Backend returns { "Venues": [...] }
      setVenues(res.data.Venues || []);
    } catch (err) {
      console.error("Error fetching venues:", err);
      // Optional: Error state handle kar sakte hain
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header Section */}
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
                  {/* Mapping: row[0] as venue_id */}
                  <h2 className="venue-title">Venue: {venue.venue_id}</h2>
                  {/* Mapping: row[5] as Course */}
                  <h3 className="course-name">{venue.Course}</h3>
                  <div className="meta-details">
                    {/* Mapping: row[4] as Teacher */}
                    <span>👤 {venue.Teacher}</span>
                    {/* Mapping: row[1]-row[3]row[2] as Discipline */}
                    <span className="discipline-tag">{venue.Discipline}</span>
                  </div>
                </div>
              </div>

              <div className="card-actions-premium">
                <button 
                  className="cam-btn front-btn" 
                  onClick={() => console.log(`Opening Front Cam for Schedule: ${venue.Schedule_id}`)}
                >
                  <span className="icon">📷</span>
                  <span className="label">Front Cam</span>
                </button>
                <button 
                  className="cam-btn back-btn"
                  onClick={() => console.log(`Opening Back Cam for Schedule: ${venue.Schedule_id}`)}
                >
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