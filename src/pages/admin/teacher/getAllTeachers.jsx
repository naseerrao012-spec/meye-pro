import React, { useState, useEffect } from "react";
import axios from "axios";
import "./getAllTeachers.css";

function FacultyList() {
  const [search, setSearch] = useState("");
  const [facultyMembers, setFacultyMembers] = useState([]);

  // 🔹 Fetch teachers from backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/teacher/getAllTeachers")
      .then((res) => {
        setFacultyMembers(res.data.teachers || []);
      })
      .catch((err) => {
        console.error("Error fetching teachers:", err);
      });
  }, []);

  // 🔹 Search filter
  const filteredFaculty = facultyMembers.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="faculty-container">
      <h2 className="faculty-title">Faculty Members</h2>

      <div className="faculty-search">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Search staff..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="faculty-list">
        {filteredFaculty.map((faculty, index) => (
          <div key={index} className="faculty-card">
            <img
              src={
                faculty.pic
                  ? faculty.pic
                  : "/images/default-user.png"
              }
              alt={faculty.name}
              onError={(e) => {
                e.target.src = "/images/default-user.png";
              }}
            />
            <p>{faculty.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FacultyList;
