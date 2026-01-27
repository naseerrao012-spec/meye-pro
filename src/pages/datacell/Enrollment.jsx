// import React, { useState } from "react";
// import axios from "axios";
// import "./Enrollment.css";

// function Enrollment() {
//   const [type, setType] = useState("single");
//   const [loading, setLoading] = useState(false);

//   // Form State
//   const [enrollData, setEnrollData] = useState({
//     Regno: "",
//     courseName: "",
//     section: "",
//     semester: "",
//     session: "",
//   });

//   const handleChange = (e) => {
//     setEnrollData({ ...enrollData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Kyunke backend Form(...) parameters use kar raha hai
//     const formData = new FormData();
//     formData.append("Regno", enrollData.Regno);
//     formData.append("courseName", enrollData.courseName);
//     formData.append("section", enrollData.section);
//     formData.append("semester", parseInt(enrollData.semester)); // int requirement
//     formData.append("session", enrollData.session);

//     try {
//       // URL check karein (aapke logs ke mutabiq /datacell/ use ho raha hai)
//       const response = await axios.post(
//         "http://127.0.0.1:8000/datacell/singleEnrollmentofStudent", 
//         formData
//       );
//       alert("Enrollment Successful!");
//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//       const errorDetail = error.response?.data?.detail || "Enrollment Failed!";
//       alert(errorDetail);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app-viewport">
//       <aside className="app-sidebar">
//         <div className="brand-logo">M-EYE PRO</div>
//         <nav className="nav-list">
//           <div className="nav-item active">ENROLLMENT</div>
//         </nav>
//       </aside>

//       <main className="app-content">
//         <header className="page-title">
//           <h1>Course Enrollment Portal</h1>
//         </header>

//         <div className="enroll-card-main">
//           <div className="type-selector-row">
//             <span className="label-text">Select Type:</span>
//             <div className="radio-options-flex">
//               <label className="custom-radio">
//                 <input type="radio" name="type" checked={type === "single"} onChange={() => setType("single")} />
//                 <span>Single Student</span>
//               </label>
//               <label className="custom-radio">
//                 <input type="radio" name="type" checked={type === "excel"} onChange={() => setType("excel")} />
//                 <span>Upload Excel</span>
//               </label>
//             </div>
//           </div>

//           <div className="form-container-fit">
//             {type === "single" ? (
//               <form className="compact-grid-form" onSubmit={handleSubmit}>
//                 <div className="field-box">
//                   <label>Student Reg No</label>
//                   <input 
//                     name="Regno" 
//                     type="text" 
//                     placeholder="e.g. 19-Arid-123" 
//                     onChange={handleChange} 
//                     required 
//                   />
//                 </div>

//                 <div className="field-box">
//                   <label>Semester</label>
//                   <select name="semester" onChange={handleChange} required>
//                     <option value="">Select Semester</option>
//                     <option value="1">1st Semester</option>
//                     <option value="2">2nd Semester</option>
//                     <option value="3">3rd Semester</option>
//                     <option value="4">4th Semester</option>
//                   </select>
//                 </div>

//                 <div className="double-field">
//                   <div className="field-box">
//                     <label>Session</label>
//                     <input name="session" type="text" placeholder="2022-26" onChange={handleChange} required />
//                   </div>
//                   <div className="field-box">
//                     <label>Section</label>
//                     <input name="section" type="text" placeholder="Section A" onChange={handleChange} required />
//                   </div>
//                 </div>

//                 <div className="field-box">
//                   <label>Course Name</label>
//                   <input name="courseName" type="text" placeholder="Enter Full Course Title" onChange={handleChange} required />
//                 </div>

//                 <button type="submit" className="register-action-btn" disabled={loading}>
//                   {loading ? "SAVING..." : "REGISTER ENROLLMENT"}
//                 </button>
//               </form>
//             ) : (
//               <div className="excel-drop-zone">
//                 <div className="upload-box-ui">
//                   <div className="icon-ui">📄</div>
//                   <p>Drop Excel file here</p>
//                   <label className="browse-label">
//                     Browse
//                     <input type="file" hidden />
//                   </label>
//                 </div>
//                 <button className="register-action-btn">SUBMIT EXCEL DATA</button>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Enrollment;


import React, { useState } from "react";
import axios from "axios";
import "./Enrollment.css";

function Enrollment() {
  const [type, setType] = useState("single");
  const [loading, setLoading] = useState(false);
  const [excelFile, setExcelFile] = useState(null);

  // Single Form State
  const [enrollData, setEnrollData] = useState({
    Regno: "",
    courseName: "",
    section: "",
    semester: "",
    session: "",
  });

  const handleChange = (e) => {
    setEnrollData({ ...enrollData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  // 1. Single Enrollment Logic
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("Regno", enrollData.Regno);
    formData.append("courseName", enrollData.courseName);
    formData.append("section", enrollData.section);
    formData.append("semester", parseInt(enrollData.semester));
    formData.append("session", enrollData.session);

    try {
      await axios.post("http://127.0.0.1:8000/datacell/singleEnrollmentofStudent", formData);
      alert("Individual Student Enrolled Successfully!");
    } catch (error) {
      alert(error.response?.data?.detail || "Single Enrollment Failed!");
    } finally {
      setLoading(false);
    }
  };

  // 2. Excel Upload Logic (Integrated with your Python Code)
  const handleExcelSubmit = async () => {
    if (!excelFile) {
      alert("Please select an Excel file first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", excelFile); // Backend expects 'file' parameter

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/datacell/UploadEnrollmentExcel", 
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Result Handling
      const { message, total_rows, errors } = response.data;
      let alertMsg = `${message} (Total Rows: ${total_rows})`;
      
      if (errors && errors.length > 0) {
        alertMsg += `\n\nErrors encountered:\n${errors.slice(0, 3).join("\n")}...`;
      }
      
      alert(alertMsg);
      setExcelFile(null); // Reset file after success
    } catch (error) {
      alert(error.response?.data?.detail || "Excel Upload Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-viewport">
      {/* <aside className="app-sidebar">
        <div className="brand-logo">M-EYE PRO</div>
        <nav className="nav-list">
          <div className="nav-item active">ENROLLMENT</div>
        </nav>
      </aside> */}


      <main className="app-content">
        <header className="page-title">
          <h1>Course Enrollment Portal</h1>
        </header>

        <div className="enroll-card-main">
          <div className="type-selector-row">
            <span className="label-text">Select Type:</span>
            <div className="radio-options-flex">
              <label className="custom-radio">
                <input type="radio" name="type" checked={type === "single"} onChange={() => setType("single")} />
                <span>Single Student</span>
              </label>
              <label className="custom-radio">
                <input type="radio" name="type" checked={type === "excel"} onChange={() => setType("excel")} />
                <span>Upload Excel</span>
              </label>
            </div>
          </div>

          <div className="form-container-fit">
            {type === "single" ? (
              <form className="compact-grid-form" onSubmit={handleSingleSubmit}>
                <div className="field-box">
                  <label>Student Reg No</label>
                  <input name="Regno" type="text" placeholder="e.g. 19-Arid-123" onChange={handleChange} required />
                </div>
                <div className="field-box">
                  <label>Semester</label>
                  <select name="semester" onChange={handleChange} required>
                    <option value="">Select Semester</option>
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                    <option value="3">3rd Semester</option>
                    <option value="4">4th Semester</option>
                  </select>
                </div>
                <div className="double-field">
                  <div className="field-box">
                    <label>Session</label>
                    <input name="session" type="text" placeholder="2022-26" onChange={handleChange} required />
                  </div>
                  <div className="field-box">
                    <label>Section</label>
                    <input name="section" type="text" placeholder="Section A" onChange={handleChange} required />
                  </div>
                </div>
                <div className="field-box">
                  <label>Course Name</label>
                  <input name="courseName" type="text" placeholder="Enter Full Course Title" onChange={handleChange} required />
                </div>
                <button type="submit" className="register-action-btn" disabled={loading}>
                  {loading ? "SAVING..." : "REGISTER ENROLLMENT"}
                </button>
              </form>
            ) : (
              <div className="excel-drop-zone">
                <div className="upload-box-ui">
                  <div className="icon-ui">📄</div>
                  <p>{excelFile ? excelFile.name : "Drop Excel file here"}</p>
                  <label className="browse-label">
                    {excelFile ? "Change File" : "Browse"}
                    <input type="file" hidden accept=".xlsx, .xls" onChange={handleFileChange} />
                  </label>
                </div>
                <button 
                  onClick={handleExcelSubmit} 
                  className="register-action-btn" 
                  disabled={loading || !excelFile}
                >
                  {loading ? "UPLOADING..." : "SUBMIT EXCEL DATA"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Enrollment;