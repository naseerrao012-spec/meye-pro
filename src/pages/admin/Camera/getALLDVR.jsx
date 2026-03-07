import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./getALLDVR.css";

function DVRManagement() {
  const [dvrList, setDvrList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: "", IP: "", MAC: "", Password: "", channel: "", admin_id: "" 
  });

  useEffect(() => {
    const loggedInId = localStorage.getItem("userId");
    if (loggedInId) {
      setFormData(prev => ({ ...prev, admin_id: loggedInId }));
    }
    fetchDVRs();
  }, []);

  const fetchDVRs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/admin/getAllDVR");
      setDvrList(res.data.dvrs || []);
    } catch (err) {
      console.error("Error fetching DVRs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDVR = async (e) => {
    e.preventDefault();
    if (!formData.admin_id) {
      alert("Error: Admin ID not found. Please log in again.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/admin/AddDVR", formData);
      alert(response.data.message);
      setShowModal(false);
      fetchDVRs(); 
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add DVR");
    }
  };

  const filteredDVRs = dvrList.filter((dvr) => {
    const name = dvr.name?.toLowerCase() || "";
    const mac = dvr.mac_address?.toLowerCase() || "";
    return name.includes(search.toLowerCase()) || mac.includes(search.toLowerCase());
  });

  return (
    <div className="viewport-lock">
      <main className="main-stage">
        <div className="header-flat">
          <h1>DVR Management</h1>
          <p>Logged in as: <span style={{color: '#0c0c0c', fontWeight: 'bold'}}>{formData.admin_id || "Guest"}</span></p>
        </div>

        <div className="dvr-wrapper">
          <div className="glass-panel">
            <div className="dvr-search-box">
              {/* <span className="search-icon">🔍</span> */}
              <input
                type="text"
                className="search-input"
                placeholder="Search DVR..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="dvr-status"><div className="spinner"></div></div>
            ) : (
              <div className="dvr-list">
                {filteredDVRs.map((dvr, index) => (
                  <div 
                    key={index} 
                    className="dvr-card" 
                    onClick={() => navigate(`/dvr-details`, { state: { dvr } })}
                  >
                    <div className="dvr-card-left">
                      <div className="dvr-icon-box">📹</div>
                      <div className="dvr-details">
                        <h3 className="dvr-name">Name: {dvr.name}</h3>
                        <p className="dvr-mac">MAC: {dvr.mac_address}</p>
                      </div>
                    </div>
                    <div className="dvr-card-right">
                      <span className="dvr-arrow">→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="fab-add-dvr" onClick={() => setShowModal(true)}>+</button>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content glass-panel">
              <div className="modal-header">
                <h2>Add New DVR</h2>
              </div>
              <form onSubmit={handleAddDVR} className="modal-form">
                <input className="modal-input" type="text" placeholder="DVR Name" required onChange={(e) => setFormData({...formData, Name: e.target.value})} />
                <input className="modal-input" type="text" placeholder="IP Address" required onChange={(e) => setFormData({...formData, IP: e.target.value})} />
                <input className="modal-input" type="text" placeholder="MAC Address" required onChange={(e) => setFormData({...formData, MAC: e.target.value})} />
                <input className="modal-input" type="password" placeholder="Password" required onChange={(e) => setFormData({...formData, Password: e.target.value})} />
                <input className="modal-input" type="number" placeholder="Channels" required onChange={(e) => setFormData({...formData, channel: e.target.value})} />
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>CANCEL</button>
                  <button type="submit" className="btn-save">SAVE</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default DVRManagement;