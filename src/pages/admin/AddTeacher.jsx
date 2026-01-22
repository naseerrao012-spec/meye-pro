import React, { useState } from "react";
import "./AddTeacher.css";

function AddTeacher() {
  const [teacherData, setTeacherData] = useState({
    name: "",
    cnic: "",
    email: "",
    password: "",
    qualification: "",
    picture: null,
  });

  const handleChange = (e) => {
    setTeacherData({
      ...teacherData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setTeacherData({
      ...teacherData,
      picture: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Teacher Data:", teacherData);
    alert("Teacher Added Successfully");
  };

  return (
    <div className="add-teacher-container">
      <h2 className="title">ADD TEACHER</h2>

      <label className="image-box">
        <input type="file" onChange={handleImageChange} hidden />
        <div className="icon-container">
          <span>📷</span>
        </div>
        <p>UPLOAD PICTURES</p>
      </label>

      <form onSubmit={handleSubmit} className="teacher-form">
        <div className="field">
          <label>Name:</label>
          <input type="text" name="name" value={teacherData.name} onChange={handleChange} />
        </div>

        <div className="field">
          <label>CNIC:</label>
          <input type="text" name="cnic" value={teacherData.cnic} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Email:</label>
          <input type="email" name="email" value={teacherData.email} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Password:</label>
          <input type="password" name="password" value={teacherData.password} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Qualification:</label>
          <input type="text" name="qualification" value={teacherData.qualification} onChange={handleChange} />
        </div>

        <button type="submit" className="submit-btn">
          SUBMIT
        </button>
      </form>
    </div>
  );
}

export default AddTeacher;
