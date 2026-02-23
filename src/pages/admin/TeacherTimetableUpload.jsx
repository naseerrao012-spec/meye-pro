import React, { useState } from "react";
import axios from "axios";
import "./TeacherTimetableUpload.css"; 

const TeacherTimetableUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      setSelectedFile(file);
    } else {
      alert("Please select a valid Excel file (.xlsx or .xls)");
      e.target.value = null;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsUploading(true);
      const response = await axios.post("http://localhost:8000/admin/upload-timetable", formData);
      alert("Timetable Uploaded Successfully!");
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Error uploading timetable. Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="app-content">
      <div className="page-title">
        <h1>Upload Timetable</h1>
      </div>

      <section className="enroll-card-main">
        <div className="type-selector-row">
          <h3 className="card-heading">Select Excel File</h3>
        </div>

        <div className="compact-grid-form">
          <div className="upload-section">
            <div className="upload-box-ui">
              <div className="icon-circle">
                <span>📅</span>
              </div>
              <h3 className="upload-box-title">
                {selectedFile ? selectedFile.name : "Tap to Select Timetable"}
              </h3>
              <p className="upload-box-subtitle">(Supports .xlsx and .xls files)</p>
              
              <input
                type="file"
                id="fileInput"
                hidden
                onChange={handleFileChange}
                accept=".xlsx, .xls"
              />
              
              <button 
                className="browse-btn" 
                onClick={() => document.getElementById("fileInput").click()}
              >
                {selectedFile ? "Change File" : "Browse Computer"}
              </button>
            </div>

            {/* Info Alert Box */}
            <div className="info-alert-box">
              <span className="info-icon">ⓘ</span>
              <p className="info-text">
                <strong>System Note:</strong> Ensure Excel columns are: 
                <span className="highlight-text"> Day, Slot, Subject, Teacher, Venue</span>.
              </p>
            </div>
          </div>

          {/* Final Action Button */}
          <div className="action-container">
            <button 
              className="register-action-btn" 
              disabled={!selectedFile || isUploading}
              onClick={handleUpload}
            >
              {isUploading ? "Uploading Data..." : " Upload Timetable"}
            </button>
          </div>
        </div>
      </section>
      <div className="footer-spacer"></div>
    </main>
  );
};

export default TeacherTimetableUpload;