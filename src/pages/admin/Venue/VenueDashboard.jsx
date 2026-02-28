import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./VenueDashboard.css";

function VenueDashboard() {
  const [busyVenues, setBusyVenues] = useState([]);
  const [freeVenues, setFreeVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for Add Venue Modal
  const [showModal, setShowModal] = useState(false);
  const [newVenue, setNewVenue] = useState({ venue_id: "", venue_type: "Lab" });

  const fileInputRef = useRef(null);
  const [selectedVenueData, setSelectedVenueData] = useState(null);

  // Function to fetch and filter venues
  const fetchData = async () => {
    try {
      setLoading(true);
      const [allRes, busyRes] = await Promise.all([
        axios.get("http://localhost:8000/admin/GetAllVenues"),
        axios.get("http://localhost:8000/admin/getBusyVenues")
      ]);

      const allVenues = allRes.data || [];
      const busyList = busyRes.data.Venues || [];

      setBusyVenues(busyList);

      // Filter Logic: All - Busy = Free
      const busyIds = busyList.map(v => String(v.venue_id).toLowerCase().trim());
      const freeList = allVenues.filter(venue => 
        !busyIds.includes(String(venue.venue_id).toLowerCase().trim())
      );

      setFreeVenues(freeList);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Logic to call AddVenue API
  const handleAddVenue = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/admin/AddVenue", newVenue);
      alert(res.data.message);
      setShowModal(false);
      setNewVenue({ venue_id: "", venue_type: "Lab" });
      fetchData(); // Refresh list after adding
    } catch (err) {
      alert(err.response?.data?.detail || "Error adding venue");
    }
  };

  const onCamClick = (venue, isFront) => {
    setSelectedVenueData({ ...venue, isFront });
    fileInputRef.current.click();
  };

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedVenueData) return;

    const formData = new FormData();
    try {
      if (selectedVenueData.isFront) {
        formData.append("video", file);
        formData.append("schedule_id", selectedVenueData.Schedule_id);
        formData.append("courseName", selectedVenueData.Course);
        formData.append("Discipline", selectedVenueData.Discipline);
        alert("Processing Student Attendance...");
        await axios.post("http://localhost:8000/markAttendanceByVideo", formData);
      } else {
        formData.append("file", file);
        formData.append("venue_id", selectedVenueData.venue_id);
        alert("Generating Teacher CHR Report...");
        await axios.post("http://localhost:8000/admin/generate_Teacher_CHR_Report", formData);
      }
      alert("Operation Successful");
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Process failed"));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="video/*" onChange={handleVideoUpload} />

      <header className="premium-header">
        <div className="header-content">
          <h1>Live Venue Monitoring</h1>
          <p>Real-time status of university halls and rooms</p>
        </div>
        <button className="refresh-btn" onClick={fetchData}>🔄 Refresh Live</button>
      </header>

      {/* Floating Action Button */}
      <button className="fab-add-btn" onClick={() => setShowModal(true)} title="Add New Venue">+</button>

      {/* Add Venue Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Venue</h3>
            <form onSubmit={handleAddVenue}>
              <div className="form-group">
                <label>Venue ID</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Lab-1"
                  value={newVenue.venue_id}
                  onChange={(e) => setNewVenue({...newVenue, venue_id: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Venue Type</label>
                <select 
                  value={newVenue.venue_type}
                  onChange={(e) => setNewVenue({...newVenue, venue_type: e.target.value})}
                >
                  <option value="Lab">Lab</option>
                  <option value="Lecture Theater">Lecture Theater</option>
                  <option value="Classroom">Classroom</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="confirm-btn">Save Venue</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="venue-sections-wrapper">
        <section className="venue-section">
          <h2 className="section-title busy-title">🔴 Occupied Venues ({busyVenues.length})</h2>
          <div className="venue-grid-stage">
            {loading ? <div className="spinner-premium"></div> : busyVenues.map((venue, index) => (
              <div key={index} className="venue-card-premium busy">
                <div className="venue-info">
                  <h2 className="venue-title">Venue: {venue.venue_id}</h2>
                  <h3 className="course-name">{venue.Course}</h3>
                  <div className="meta-details">
                    <span>👤 {venue.Teacher}</span>
                    <span className="discipline-tag">{venue.Discipline}</span>
                  </div>
                </div>
                {/* <div className="card-actions-premium">
                  <button className="cam-btn front-btn" onClick={() => onCamClick(venue, true)}>📷 Front</button>
                  <button className="cam-btn back-btn" onClick={() => onCamClick(venue, false)}>📸 Back</button>
                </div> */}
              </div>
            ))}
          </div>
        </section>

        <hr className="section-divider" />

        <section className="venue-section">
          <h2 className="section-title free-title">🟢 Available Venues ({freeVenues.length})</h2>
          <div className="venue-grid-stage">
            {freeVenues.map((venue, index) => (
              <div key={index} className="venue-card-premium free">
                <div className="lock-icon-ui">🔒</div>
                <div className="venue-info">
                  <h2 className="venue-title">Venue: {venue.venue_id}</h2>
                  <p className="status-text">Status: Available</p>
                  <span className="type-tag">{venue.venue_type}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default VenueDashboard;