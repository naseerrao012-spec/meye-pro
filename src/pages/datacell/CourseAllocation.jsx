import React, { useState } from "react";
import axios from "axios";
import "./CourseAllocation.css"; // Make sure to create this or use Enrollment.css

function CourseAllocation() {
  const [type, setType] = useState("single");
  const [loading, setLoading] = useState(false);
  const [excelFile, setExcelFile] = useState(null);

  // Allocation Form State
  const [allocationData, setAllocationData] = useState({
    courseName: "",
    teacherName: "",
    discipline: "",
    session: "",
    section: "",
    semester: "",
  });

  const handleChange = (e) => {
    setAllocationData({ ...allocationData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  // 1. Single Allocation Logic
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Aapka Backend Pydantic model "AllocationInput" expect kar raha hai
    // Isliye hum simple object bhejenge (FormData ki bajaye JSON best rehta hai agar backend Pydantic use kar raha ho)
    const payload = {
      ...allocationData,
      semester: parseInt(allocationData.semester)
    };

    try {
      await axios.post("http://127.0.0.1:8000/datacell/single_allocation", payload);
      alert("Course Allocated to Teacher Successfully!");
      setAllocationData({courseName: "", teacherName: "", discipline: "", session: "", section: "", semester: ""});
    } catch (error) {
      alert(error.response?.data?.detail || "Allocation Failed!");
    } finally {
      setLoading(false);
    }
  };

  // 2. Excel Upload Logic
  const handleExcelSubmit = async () => {
    if (!excelFile) {
      alert("Please select an Excel file first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", excelFile);
    console.log("Uploading Excel File:", excelFile);q

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/datacell/UploadAllocationExcel", 
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(response.data.message || "Bulk Allocation Successful!");
      setExcelFile(null);
    } catch (error) {
      alert(error.response?.data?.detail || "Excel Upload Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-viewport">
      <main className="app-content">
        <header className="page-title">
          <h1>Course Allocation Portal</h1>
        </header>

        <div className="enroll-card-main">
          <div className="type-selector-row">
            <span className="label-text">Allocation Mode:</span>
            <div className="radio-options-flex">
              <label className="custom-radio">
                <input type="radio" name="type" checked={type === "single"} onChange={() => setType("single")} />
                <span>Single Allocation</span>
              </label>
              <label className="custom-radio">
                <input type="radio" name="type" checked={type === "excel"} onChange={() => setType("excel")} />
                <span>Bulk Upload (Excel)</span>
              </label>
            </div>
          </div>

          <div className="form-container-fit">
            {type === "single" ? (
              <form className="compact-grid-form" onSubmit={handleSingleSubmit}>
                <div className="field-box">
                  <label>Teacher Name</label>
                  <input name="teacherName" type="text" placeholder="Enter Full Name" value={allocationData.teacherName} onChange={handleChange} required />
                </div>
                
                <div className="field-box">
                  <label>Course Name</label>
                  <input name="courseName" type="text" placeholder="Full Course Title" value={allocationData.courseName} onChange={handleChange} required />
                </div>

                <div className="double-field">
                  <div className="field-box">
                    <label>Discipline</label>
                    <input name="discipline" type="text" placeholder="e.g. BSCS" value={allocationData.discipline} onChange={handleChange} required />
                  </div>
                  <div className="field-box">
                    <label>Semester</label>
                    <input name="semester" type="number" placeholder="1, 2, 3..." value={allocationData.semester} onChange={handleChange} required />
                  </div>
                </div>

                <div className="double-field">
                  <div className="field-box">
                    <label>Session</label>
                    <input name="session" type="text" placeholder="2022-26" value={allocationData.session} onChange={handleChange} required />
                  </div>
                  <div className="field-box">
                    <label>Section</label>
                    <input name="section" type="text" placeholder="Section A" value={allocationData.section} onChange={handleChange} required />
                  </div>
                </div>

                <button type="submit" className="register-action-btn" disabled={loading}>
                  {loading ? "SAVING..." : "CONFIRM ALLOCATION"}
                </button>
              </form>
            ) : (
              <div className="excel-drop-zone">
                <div className="upload-box-ui">
                  <div className="icon-ui">📊</div>
                  <p>{excelFile ? excelFile.name : "Select Allocation Excel Sheet"}</p>
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
                  {loading ? "UPLOADING..." : "PROCESS EXCEL ALLOCATION"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CourseAllocation;