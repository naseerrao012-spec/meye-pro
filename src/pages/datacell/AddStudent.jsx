import React, { useState } from "react";
import "./AddStudent.css";

function AddStudent() {
  const [studentData, setStudentData] = useState({
    name: "",
    regNo: "",
    discipline: "",
    session: "",
    year: "",
    frontPic1: null,
    frontPic2: null,
    leftPic: null,
    rightPic: null,
  });

  const handleChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Data:", studentData);
    alert("Student Added Successfully");
  };

  return (
    <div className="add-student-container">
      <h2 className="title">ADD STUDENT</h2>

      <p className="upload-title">UPLOAD PICTURES</p>

      <div className="image-grid">
        <label className="image-box">
          <input type="file" name="frontPic1" onChange={handleImageChange} hidden />
          <span>📷</span>
          <p>Front pic 1</p>
        </label>

        <label className="image-box">
          <input type="file" name="frontPic2" onChange={handleImageChange} hidden />
          <span>📷</span>
          <p>Front pic 2</p>
        </label>

        <label className="image-box">
          <input type="file" name="leftPic" onChange={handleImageChange} hidden />
          <span>📷</span>
          <p>Left side pic</p>
        </label>

        <label className="image-box">
          <input type="file" name="rightPic" onChange={handleImageChange} hidden />
          <span>📷</span>
          <p>Right side pic</p>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="student-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={studentData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="regNo"
          placeholder="Reg no"
          value={studentData.regNo}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="discipline"
          placeholder="Discipline"
          value={studentData.discipline}
          onChange={handleChange}
        />

        <input
          type="text"
          name="session"
          placeholder="Session"
          value={studentData.session}
          onChange={handleChange}
        />

        <input
          type="text"
          name="year"
          placeholder="Year"
          value={studentData.year}
          onChange={handleChange}
        />

        <button type="submit" className="submit-btn">
          SUBMIT
        </button>
      </form>
    </div>
  );
}

export default AddStudent;
