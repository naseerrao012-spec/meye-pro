// import React, { useState } from "react";
// import "./AddStudent.css";

// function AddStudent() {
//   const [studentData, setStudentData] = useState({
//     name: "",
//     regNo: "",
//     discipline: "",     
//     session: "",
//     year: "",
//     frontPic1: null,
//     frontPic2: null,
//     leftPic: null,
//     rightPic: null,
//   });

//   const handleChange = (e) => {
//     setStudentData({
//       ...studentData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleImageChange = (e) => {
//     setStudentData({
//       ...studentData,
//       [e.target.name]: e.target.files[0],
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Student Data:", studentData);
//     alert("Student Added Successfully");
//   };

//   return (
//     <div className="add-student-container">
//       <h2 className="title">ADD STUDENT</h2>

//       <p className="upload-title">UPLOAD PICTURES</p>

//       <div className="image-grid">
//         <label className="image-box">
//           <input type="file" name="frontPic1" onChange={handleImageChange} hidden />
//           <span>📷</span>
//           <p>Front pic 1</p>
//         </label>

//         <label className="image-box">
//           <input type="file" name="frontPic2" onChange={handleImageChange} hidden />
//           <span>📷</span>
//           <p>Front pic 2</p>
//         </label>

//         <label className="image-box">
//           <input type="file" name="leftPic" onChange={handleImageChange} hidden />
//           <span>📷</span>
//           <p>Left side pic</p>
//         </label>

//         <label className="image-box">
//           <input type="file" name="rightPic" onChange={handleImageChange} hidden />
//           <span>📷</span>
//           <p>Right side pic</p>
//         </label>
//       </div>

//       <form onSubmit={handleSubmit} className="student-form">
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={studentData.name}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="text"
//           name="regNo"
//           placeholder="Reg no"
//           value={studentData.regNo}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="text"
//           name="discipline"
//           placeholder="Discipline"
//           value={studentData.discipline}
//           onChange={handleChange}
//         />

//         <input
//           type="text"
//           name="session"
//           placeholder="Session"
//           value={studentData.session}
//           onChange={handleChange}
//         />

//         <input
//           type="text"
//           name="year"
//           placeholder="Year"
//           value={studentData.year}
//           onChange={handleChange}
//         />

//         <button type="submit" className="submit-btn">
//           SUBMIT
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AddStudent;


import React, { useState } from "react";
import axios from "axios";
import "./AddStudent.css";

function AddStudent() {
  const [studentData, setStudentData] = useState({
    name: "",
    regNo: "",
    discipline: "",
    session: "",
    year: "",
    password: "123",
    frontPic1: null,
    frontPic2: null,
    leftPic: null,
    rightPic: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("Regno", studentData.regNo);
    formData.append("name", studentData.name);
    formData.append("Password", "123");
    formData.append("discipline", studentData.discipline);
    formData.append("session", studentData.session);

    const images = [studentData.frontPic1, studentData.frontPic2, studentData.leftPic, studentData.rightPic];
    if (images.includes(null)) {
      alert("Error: All 4 photos are required.");
      setLoading(false);
      return;
    }

    images.forEach((pic) => formData.append("student_pics", pic));

    try {
      await axios.post("http://127.0.0.1:8000/datacell/AddStudent", formData);
      alert("Student Registered Successfully!");
    } catch (error) {
      alert("Error: " + (error.response?.data?.detail || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="viewport-lock">
      {/* Fixed Sidebar */}
      <aside className="fixed-sidebar">
        <div className="brand-header">METRIC-EYE</div>
        <div className="active-nav">ADD STUDENT</div>
      </aside>

      {/* Main Content Area */}
      <main className="main-stage">
        <div className="header-flat">
          <h1>Student Registration</h1>
        </div>

        <form onSubmit={handleSubmit} className="one-page-form">
          <div className="dual-section">
            
            {/* Left: Academic Inputs */}
            <div className="glass-panel">
              <h3 className="sub-title">Student Details</h3>
              <div className="input-grid-web">
                <div className="web-field">
                  <label>Full Name</label>
                  <input name="name" placeholder="Full Name" onChange={handleChange} required />
                </div>
                <div className="web-field">
                  <label>Reg No</label>
                  <input name="regNo" placeholder="Reg No" onChange={handleChange} required />
                </div>
                <div className="web-field">
                  <label>Discipline</label>
                  <input name="discipline" placeholder="Discipline" onChange={handleChange} required />
                </div>
                <div className="web-field">
                  <label>Session</label>
                  <input name="session" placeholder="Session" onChange={handleChange} required />
                </div>
                <div className="web-field">
                  <label>Year</label>
                  <input name="year" placeholder="Year" onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Right: Photo Uploads */}
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
                    <input type="file" name={pic.id} onChange={handleImageChange} hidden />
                    <div className={`icon-state ${studentData[pic.id] ? "is-done" : ""}`}>
                      {studentData[pic.id] ? "✅" : "📷"}
                    </div>
                    <span>{pic.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          <div className="footer-action">
            <button type="submit" className="web-action-btn" disabled={loading}>
              {loading ? "SAVING..." : "REGISTER STUDENT"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddStudent;