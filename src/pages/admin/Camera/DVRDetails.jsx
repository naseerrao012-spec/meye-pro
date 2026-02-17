import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./getALLDVR.css"; // Make sure to add the Modal CSS here

function DVRDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dvr } = location.state || {};
  
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCam, setNewCam] = useState({
    venue_name: "", // Venue ID/Name
    mac: "",
    ip: "",
    channel_no: "",
    placement: "Front", // Default selection
  });

  const fetchCameras = async () => {
    if (!dvr?.mac_address) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/admin/getCamerasByDvrID?dvr_id=${dvr.mac_address}`);
      setCameras(res.data.Cameras || []);
    } catch (err) {
      console.error("Error fetching cameras:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, [dvr]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    setNewCam({ ...newCam, [e.target.name]: e.target.value });
  };

  const handleAddCamera = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        mac: newCam.mac,
        placement: newCam.placement,
        channel_no: parseInt(newCam.channel_no),
        resolution: "1080p", // Default value
        status: "Active",     // Default value
        dvr_id: dvr.mac_address,
        venue_id: newCam.venue_name,
        IP: newCam.ip
      };

      await axios.post("http://localhost:8000/admin/addCamera", payload);
      alert("Camera Added Successfully!");
      setIsModalOpen(false); // Pop-up band karein
      fetchCameras();        // List refresh karein
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  const groupedByVenue = cameras.reduce((acc, cam) => {
    if (!acc[cam.venue]) acc[cam.venue] = [];
    acc[cam.venue].push(cam);
    return acc;
  }, {});

  if (!dvr) return <div className="dvr-status">No Data Found</div>;

  return (
    <div className="viewport-lock">
      <main className="main-stage">
        {/* Header Section */}
        <div className="header-flat" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '25px 20px' }}>
          <button onClick={() => navigate(-1)} className="back-btn-clear">←</button>
          <div>
            <h1 style={{ fontSize: '20px', margin: 0 }}>{dvr.name}</h1>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '13px' }}>{dvr.mac_address}</p>
          </div>
        </div>

        <div className="dvr-wrapper">
          {loading ? (
            <div className="dvr-status"><div className="spinner"></div></div>
          ) : Object.keys(groupedByVenue).length > 0 ? (
            Object.keys(groupedByVenue).map((venueId) => (
              <div key={venueId} className="glass-panel" style={{ padding: '20px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h2 style={{ color: 'var(--text-dark)', fontSize: '17px', margin: 0 }}>
                    Venue: <span style={{color: 'var(--primary)'}}>{venueId}</span>
                  </h2>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {groupedByVenue[venueId].map((cam, idx) => (
                    <div key={idx} className="status-badge">
                      {cam.placement}: <strong>{cam.channel}</strong> 
                      <span className="active-tag">{cam.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="dvr-status">No cameras linked to this DVR.</p>
          )}
        </div>

        {/* Floating Action Button - Opens Modal */}
        <button 
          className="fab-add-dvr" 
          style={{ borderRadius: '18px' }}
          onClick={() => setIsModalOpen(true)}
        >
          📷
        </button>

        {/* --- ADD CAMERA POPUP (MODAL) --- */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <span className="modal-icon">📷</span>
                <h3>Add Camera</h3>
              </div>

              <form onSubmit={handleAddCamera}>
                <input 
                  className="modal-input"
                  name="venue_name" 
                  placeholder="Venue Name (e.g. Lab 1)" 
                  onChange={handleInputChange} 
                  required 
                />
                <input 
                  className="modal-input"
                  name="mac" 
                  placeholder="Camera MAC Address" 
                  onChange={handleInputChange} 
                  required 
                />
                <input 
                  className="modal-input"
                  name="ip" 
                  placeholder="Camera IP (e.g. 192.168.1.20)" 
                  onChange={handleInputChange} 
                  required 
                />
                <input 
                  className="modal-input"
                  name="channel_no" 
                  type="number"
                  placeholder="Channel Number (e.g. 5)" 
                  onChange={handleInputChange} 
                  required 
                />

                {/* <div className="view-selection">
                  <p>Select View:</p>
                  <label>
                    <input 
                      type="radio" 
                      name="placement" 
                      value="Front" 
                      checked={newCam.placement === "Front"}
                      onChange={handleInputChange}
                    /> Front
                  </label>
                  <label style={{ marginLeft: '20px' }}>
                    <input 
                      type="radio" 
                      name="placement" 
                      value="Back" 
                      checked={newCam.placement === "Back"}
                      onChange={handleInputChange}
                    /> Back
                  </label>
                </div> */}
                {/* --- FIXED RADIO BUTTONS SECTION --- */}
<div className="view-selection">
  <p className="selection-title">Select View:</p>
  <div className="radio-group-horizontal">
    <label className="radio-label">
      <input 
        type="radio" 
        name="placement" 
        value="Front" 
        checked={newCam.placement === "Front"}
        onChange={handleInputChange}
      />
      <span>Front</span>
    </label>

    <label className="radio-label">
      <input 
        type="radio" 
        name="placement" 
        value="Back" 
        checked={newCam.placement === "Back"}
        onChange={handleInputChange}
      />
      <span>Back</span>
    </label>
  </div>
</div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>CANCEL</button>
                  <button type="submit" className="btn-add">Add</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default DVRDetails;