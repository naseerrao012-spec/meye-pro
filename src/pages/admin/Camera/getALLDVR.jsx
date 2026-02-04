import React, { useState, useEffect } from "react";
import axios from "axios";
import "./getALLDVR.css";

function DVRManagement() {
  const [dvrList, setDvrList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDVRs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/admin/getAllDVR");
        setDvrList(res.data.dvrs || []);
      } catch (err) {
        console.error("Error fetching DVRs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDVRs();
  }, []);

  const filteredDVRs = dvrList.filter((dvr) => {
    const name = dvr.name?.toLowerCase() || "";
    const mac = dvr.mac_address?.toLowerCase() || "";
    const searchTerm = search.toLowerCase();
    return name.includes(searchTerm) || mac.includes(searchTerm);
  });

  return (
    <div className="viewport-lock">
      <main className="main-stage">
        <div className="header-flat">
          <h1>DVR Management</h1>
          
        </div>

        <div className="dvr-wrapper">
          <div className="glass-panel">
            <div className="dvr-search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search DVR by name or MAC address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="dvr-status">
                <div className="spinner"></div>
                <p>Loading DVRs...</p>
              </div>
            ) : filteredDVRs.length === 0 ? (
              <div className="dvr-empty">
                <p>📹 No DVRs found</p>
                <span>Add a new DVR to get started</span>
              </div>
            ) : (
              <div className="dvr-list">
                {filteredDVRs.map((dvr, index) => (
                  <div
                    key={dvr.id || index}
                    className="dvr-card"
                    onClick={() => console.log("DVR clicked:", dvr)}
                  >
                    <div className="dvr-card-left">
                      <div className="dvr-icon-box">📹</div>
                      <div className="dvr-details">
                        <h3 className="dvr-name">{dvr.name}</h3>
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
      </main>
    </div>
  );
}


export default DVRManagement;