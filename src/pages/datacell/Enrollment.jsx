import React, { useState } from "react";
import "./Enrollment.css";

function Enrollment() {
  const [type, setType] = useState("single");

  return (
    <div className="enroll-container">
      <h2 className="title">COURSE ENROLLMENT</h2>

      {/* Enrollment Type */}
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="type"
            checked={type === "single"}
            onChange={() => setType("single")}
          />
          Single Student
        </label>

        <label>
          <input
            type="radio"
            name="type"
            checked={type === "excel"}
            onChange={() => setType("excel")}
          />
          Upload Excel File
        </label>
      </div>

      {/* Single Student Form */}
      {type === "single" && (
        <form className="enroll-form">
          <input type="text" placeholder="Student Reg No (e.g. 19-Arid-123)" />
          <select>
            <option>Select Semester</option>
            <option>1st</option>
            <option>2nd</option>
            <option>3rd</option>
            <option>4th</option>
          </select>

          <div className="row">
            <input type="text" placeholder="Session" />
            <input type="text" placeholder="Section" />
          </div>

          <input type="text" placeholder="Course Name" />

          <button className="submit-btn">Enroll Student</button>
        </form>
      )}

      {/* Excel Upload */}
      {type === "excel" && (
        <div className="excel-box">
          <label className="upload-box">
            <input type="file" hidden />
            📄 Upload Excel File
          </label>

          <button className="submit-btn">Submit File</button>
        </div>
      )}
    </div>
  );
}

export default Enrollment;
