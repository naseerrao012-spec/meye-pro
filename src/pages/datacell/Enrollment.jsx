import React, { useState } from "react";
import "./Enrollment.css";

function Enrollment() {
  const [type, setType] = useState("single");

  return (
    <div className="app-viewport">
      {/* Sidebar - Fixed Corner */}
      <aside className="app-sidebar">
        <div className="brand-logo">M-EYE PRO</div>
        <nav className="nav-list">
          <div className="nav-item active">ENROLLMENT</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="app-content">
        <header className="page-title">
          <h1>Course Enrollment Portal</h1>
        </header>

        <div className="enroll-card-main">
          {/* Radio Row - Compact */}
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

          {/* Form Area - Auto Adjusted */}
          <div className="form-container-fit">
            {type === "single" ? (
              <form className="compact-grid-form">
                <div className="field-box">
                  <label>Student Reg No</label>
                  <input type="text" placeholder="e.g. 19-Arid-123" required />
                </div>

                <div className="field-box">
                  <label>Semester</label>
                  <select required>
                    <option value="">Select Semester</option>
                    <option>1st Semester</option>
                    <option>2nd Semester</option>
                    <option>3rd Semester</option>
                    <option>4th Semester</option>
                  </select>
                </div>

                <div className="double-field">
                  <div className="field-box">
                    <label>Session</label>
                    <input type="text" placeholder="2022-26" />
                  </div>
                  <div className="field-box">
                    <label>Section</label>
                    <input type="text" placeholder="Section A" />
                  </div>
                </div>

                <div className="field-box">
                  <label>Course Name</label>
                  <input type="text" placeholder="Enter Full Course Title" required />
                </div>

                {/* Visible Register Button */}
                <button type="submit" className="register-action-btn">REGISTER ENROLLMENT</button>
              </form>
            ) : (
              <div className="excel-drop-zone">
                <div className="upload-box-ui">
                  <div className="icon-ui">📄</div>
                  <p>Drop Excel file here</p>
                  <label className="browse-label">
                    Browse
                    <input type="file" hidden />
                  </label>
                </div>
                <button className="register-action-btn">SUBMIT EXCEL DATA</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Enrollment;