import React, { useState } from "react";
import axios from "axios";
import "./AddTeacher.css";

function AddTeacher() {
  const [teacherData, setTeacherData] = useState({
    name: "",
    cnic: "",
    password: "123",
    frontPic1: null,
    frontPic2: null,
    leftPic: null,
    rightPic: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setTeacherData({ ...teacherData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setTeacherData({ ...teacherData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("teacher_id", teacherData.cnic);
    formData.append("name", teacherData.name);
    formData.append("Password", teacherData.password);

    const images = [
      teacherData.frontPic1,
      teacherData.frontPic2,
      teacherData.leftPic,
      teacherData.rightPic,
    ];

    if (images.includes(null)) {
      alert("Please upload all 4 pictures!");
      setLoading(false);
      return;
    }

    images.forEach((pic) => formData.append("teachers_pics", pic));

    try {
      await axios.post("http://127.0.0.1:8000/admin/AddTeacher", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Teacher Registered Successfully!");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="viewport-lock">
      <main className="main-stage">
        <div className="header-flat">
          <h1>Teacher Registration</h1>
        </div>

        <form onSubmit={handleSubmit} className="one-page-form">
          <div className="dual-section">
            
            {/* Left Section - Matches Student Details style */}
            <div className="glass-panel">
              <h3 className="sub-title">Personal Details</h3>
              <div className="input-grid-web">
                <div className="web-field">
                  <label>Full Name</label>
                  <input name="name" placeholder="Full Name" onChange={handleChange} required />
                </div>
                <div className="web-field">
                  <label>Teacher ID / CNIC</label>
                  <input name="cnic" placeholder="ID Number" onChange={handleChange} required />
                </div>
                <div className="web-field">
                  <label>Account Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={teacherData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Section - Matches Face Biometrics style */}
            <div className="glass-panel">
              <h3 className="sub-title">Face Biometrics</h3>
              <div className="biometric-row">
                {[
                  { id: "frontPic1", label: "Front 1" },
                  { id: "frontPic2", label: "Front 2" },
                  { id: "leftPic", label: "Left View" },
                  { id: "rightPic", label: "Right View" },
                ].map((pic) => (
                  <label key={pic.id} className="web-capture-box">
                    <input
                      type="file"
                      accept="image/*"
                      name={pic.id}
                      onChange={handleImageChange}
                      hidden
                    />

                    {teacherData[pic.id] ? (
                      <img
                        src={URL.createObjectURL(teacherData[pic.id])}
                        alt={pic.label}
                        className="preview-img"
                      />
                    ) : (
                      <>
                        <div className="icon-state">📷</div>
                        <span>{pic.label}</span>
                      </>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-action">
            <button type="submit" className="web-action-btn" disabled={loading}>
              {loading ? "SAVING..." : "REGISTER TEACHER"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddTeacher;