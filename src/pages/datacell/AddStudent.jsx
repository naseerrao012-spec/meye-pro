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
import axios from "axios"; // Axios import kiya
import "./AddStudent.css";

function AddStudent() {
  const [studentData, setStudentData] = useState({
    name: "",
    regNo: "",
    discipline: "",
    session: "",
    year: "", // Backend me year as separate field nahi hai, par use rakha gaya hai
    password: "123", // Default password ya aap input field add kar sakte hain
    frontPic1: null,
    frontPic2: null,
    leftPic: null,
    rightPic: null,
  });

  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    
    // 1. Backend parameters ke exact spelling aur casing:
    formData.append("Regno", studentData.regNo);
    formData.append("name", studentData.name);
    formData.append("Password", "123"); // 'P' capital as per backend
    formData.append("discipline", studentData.discipline);
    formData.append("session", studentData.session);

    // 2. Images ko collect karein
    const images = [
      studentData.frontPic1,
      studentData.frontPic2,
      studentData.leftPic,
      studentData.rightPic,
    ];

    // Check karein ke koi image missing to nahi
    if (images.some(img => img === null)) {
      alert("Error: Please upload all 4 pictures.");
      setLoading(false);
      return;
    }

    // 3. Backend expects 'student_pics' as a list
    images.forEach((pic) => {
      formData.append("student_pics", pic);
    });

    try {
      const response = await axios.post("http://127.0.0.1:8000/datacell/AddStudent", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Student Registered Successfully!");
      console.log(response.data);
    } catch (error) {
      // Backend se aane wala specific error message pakadne ke liye:
      const errorDetail = error.response?.data?.detail || "Registration failed";
      alert("Error: " + errorDetail);
      console.error("Backend Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-student-container">
      <h2 className="title">ADD STUDENT</h2>

      {/* <p className="upload-title">UPLOAD PICTURES</p> */}

      {/* <div className="image-grid">
        <label className="image-box">
          <input type="file" name="frontPic1" onChange={handleImageChange} hidden />
          <span>{studentData.frontPic1 ? "✅" : "📷"}</span>
          <p>Front pic 1</p>
        </label>

        <label className="image-box">
          <input type="file" name="frontPic2" onChange={handleImageChange} hidden />
          <span>{studentData.frontPic2 ? "✅" : "📷"}</span>
          <p>Front pic 2</p>
        </label>

        <label className="image-box">
          <input type="file" name="leftPic" onChange={handleImageChange} hidden />
          <span>{studentData.leftPic ? "✅" : "📷"}</span>
          <p>Left side pic</p>
        </label>

        <label className="image-box">
          <input type="file" name="rightPic" onChange={handleImageChange} hidden />
          <span>{studentData.rightPic ? "✅" : "📷"}</span>
          <p>Right side pic</p>
        </label>
      </div> */}

      <form onSubmit={handleSubmit} className="student-form">

  <p className="upload-title">UPLOAD PICTURES</p>
  <div className="image-grid">
    <label className="image-box">
      <input type="file" name="frontPic1" onChange={handleImageChange} hidden />
      <span>{studentData.frontPic1 ? "✅" : "📷"}</span>
      <p>Front pic 1</p>
    </label>

    <label className="image-box">
      <input type="file" name="frontPic2" onChange={handleImageChange} hidden />
      <span>{studentData.frontPic2 ? "✅" : "📷"}</span>
      <p>Front pic 2</p>
    </label>

    <label className="image-box">
      <input type="file" name="leftPic" onChange={handleImageChange} hidden />
      <span>{studentData.leftPic ? "✅" : "📷"}</span>
      <p>Left side pic</p>
    </label>

    <label className="image-box">
      <input type="file" name="rightPic" onChange={handleImageChange} hidden />
      <span>{studentData.rightPic ? "✅" : "📷"}</span>
      <p>Right side pic</p>
    </label>
  </div>

  <input name="name" placeholder="Name" onChange={handleChange} required />
  <input name="regNo" placeholder="Reg no" onChange={handleChange} required />
  <input name="discipline" placeholder="Discipline" onChange={handleChange} required />
  <input name="session" placeholder="Session" onChange={handleChange} required />

  <button type="submit" disabled={loading}>
    {loading ? "SAVING..." : "SUBMIT"}
  </button>

</form>

    </div>
  );
}

export default AddStudent;