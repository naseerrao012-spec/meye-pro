import React, { useState } from "react";
import axios from "axios";
import "./AddTeacher.css";

function AddTeacher() {
  const [teacherData, setTeacherData] = useState({
    name: "",
    cnic : "", // This will be sent as teacher_id
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
    
    // --- Integration Mapping ---
    // Backend expects: teacher_id, name, Password
    formData.append("teacher_id", teacherData.cnic); 
    formData.append("name", teacherData.name);
    formData.append("Password", teacherData.password);

    // Backend expects a list named: teachers_pics
    const images = [
        teacherData.frontPic1, 
        teacherData.frontPic2, 
        teacherData.leftPic, 
        teacherData.rightPic
    ];

    if (images.includes(null)) {
      alert("Please upload all 4 pictures!");
      setLoading(false);
      return;
    }

    // Har image ko same key "teachers_pics" ke sath append karna hai
    images.forEach((pic) => {
      formData.append("teachers_pics", pic);
    });

    try {
      // URL updated to match your @router.post("/AddTeacher") with prefix "/teacher"
      const response = await axios.post("http://127.0.0.1:8000/admin/AddTeacher", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      alert("Teacher Registered Successfully!");
      console.log(response.data);
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="web-wrapper">
      {/* <aside className="web-sidebar">
        <div className="web-logo">M-EYE PRO</div>
        <div className="web-nav">ADD TEACHER</div>
      </aside> */}

      <main className="web-content">
        <header className="web-header">
          <h1>Teacher Registration</h1>
        </header>

        <form onSubmit={handleSubmit} className="web-form">
          <div className="web-grid">

            <div className="web-panel">
              <h3>Personal Details</h3>
              <div className="web-inputs">
                <div className="field-group">
                  <label>Name</label>
                  <input name="name" onChange={handleChange} required />
                </div>
                <div className="field-group">
                  <label>Teacher ID </label>
                  <input name="cnic" onChange={handleChange} required />
                </div>
                <div className="field-group">
                  <label>Account Password</label>
                  <input 
                    name="password" 
                    type="password" 
                    value={teacherData.password} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>


            <div className="web-panel">
              <h3>Face Capture</h3>
              <div className="web-photo-grid">
                {["frontPic1", "frontPic2", "leftPic", "rightPic"].map((id) => (
                  <label key={id} className="web-photo-box">
                    <input type="file" name={id} onChange={handleImageChange} hidden />
                    <div className={`web-icon ${teacherData[id] ? "done" : ""}`}>
                      {teacherData[id] ? "✅" : "📷"}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="web-btn" disabled={loading}>
            {loading ? "SAVING..." : "SUBMIT"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default AddTeacher;