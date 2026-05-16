import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, PlayCircle, Calendar, Clock, X, CheckCircle } from "lucide-react"; 
import "./EnrolledCourses.css";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [viewMode, setViewMode] = useState("grid"); 
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [activeAttendanceId, setActiveAttendanceId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState("");

  const base_url = "http://localhost:8000";
  const regno = localStorage.getItem("userId") || "STUDENT_REG_NO";

  useEffect(() => {
    fetchEnrolledCourses();
  }, [regno]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}/student/getenrolledCourses?regno=${regno}`);
      setCourses(response.data.Courses || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load courses");
      setLoading(false);
    }
  };

  const handleViewAttendance = async (course) => {
    setSelectedCourse(course);
    setDetailLoading(true);
    setViewMode("details");
    try {
      const response = await axios.get(`${base_url}/student/getCourseAttendance?regno=${regno}&course_id=${course.Course_Id}`);
      setAttendanceHistory(response.data.Attendance || []);
      setDetailLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setDetailLoading(false);
    }
  };

  // 🎥 1. Fetch Class Video Logic
  const handleCheckMedia = async (record) => {
    // UPDATED: Using Schedule_id (lowercase 'i') as per screenshot
    const sID = record.Schedule_id; 
    const aID = record.Attendance_id;

    if (!sID || !aID) {
      alert("Error: Missing IDs in record!");
      return;
    }

    setActiveAttendanceId(aID);
    setModalLoading(true);
    setShowModal(true);
    setClaimStatus("");
    setVideoUrl("");

    try {
      const response = await axios.get(
        `${base_url}/student/getClassVideo?attendanceID=${aID}&schedulID=${sID}&date=${record.Date}`
      );
      const fullVideoPath = `${base_url}/CapturedFrames/${response.data.Video_Path}`;
      console.log("Video Path: ",response.data.Video_Path)
      setVideoUrl(fullVideoPath);
    } catch (err) {
      alert(err.response?.data?.detail || "Video not found!");
    } finally {
      setModalLoading(false);
    }
  };

  // ✅ 2. Claim Attendance Logic
  const handleClaimAttendance = async () => {
    // UPDATED: Using Teacher_id (lowercase 'i') from grid data
    const teacherId = selectedCourse?.Teacher_id; 
    const attendanceId = activeAttendanceId;

    if (!attendanceId || !teacherId) {
        alert("Missing Teacher ID or Attendance ID");
        return;
    }

    try {
      const response = await axios.post(
        `${base_url}/student/claimAttendance?attendanceId=${attendanceId}&teacher_id=${teacherId}`
      );
      setClaimStatus(response.data.Status || response.data.detail);
    } catch (err) {
      setClaimStatus(err.response?.data?.detail || "Claim failed!");
    }
  };

  // --- MODAL COMPONENT ---
  const VideoModal = () => (
    <div className="modal-overlay">
      <div className="premium-modal">
        <div className="modal-header">
          <h3>Class Evidence Media</h3>
          <button className="close-modal-btn" onClick={() => setShowModal(false)}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          {modalLoading ? (
            <div className="modal-loader-box">
                <div className="premium-spinner"></div>
                <p>Fetching Video...</p>
            </div>
          ) : videoUrl ? (
            <video key={videoUrl} controls autoPlay className="evidence-video">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p className="error-text">Video could not be resolved.</p>
          )}
        </div>

        <div className="modal-footer">
          {claimStatus ? (
            <div className="success-banner">
                <CheckCircle size={18}/> <span>{claimStatus}</span>
            </div>
          ) : (
            <button className="claim-btn-modal" onClick={handleClaimAttendance}>
              Claim Attendance
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (viewMode === "details") {
    return (
      <main className="app-content">
        {showModal && <VideoModal />}
        <div className="detail-header">
          <button className="back-btn-premium" onClick={() => setViewMode("grid")}>
            <ArrowLeft size={20} /> Back to Courses
          </button>
          <div className="course-title-box">
            <h1 className="detail-course-name">{selectedCourse?.Course_Name}</h1>
            <span className="detail-course-id">{selectedCourse?.Course_Id}</span>
          </div>
        </div>

        <section className="attendance-list-container">
          {detailLoading ? (
            <div className="loader-container"><div className="premium-spinner"></div></div>
          ) : (
            <div className="attendance-rows">
              {attendanceHistory.map((record, index) => (
                <div key={index} className="attendance-premium-row">
                  <div className="row-date-info">
                    <div className="date-main">
                      <Calendar size={16} className="text-muted" />
                      <span>{record.Date} <small>({record.Day})</small></span>
                    </div>
                    <div className="time-sub">
                      <Clock size={14} className="text-muted" />
                      <span>{record.Time}</span>
                    </div>
                  </div>

                  <div className="row-status-action">
                    {record.Status === "P" ? (
                      <span className="status-badge present">P</span>
                    ) : (
                      <div className="absent-container">
                        <span className="status-badge absent">A</span>
                        <button className="evidence-btn" onClick={() => handleCheckMedia(record)}>
                           <PlayCircle size={14} /> Check Media Evidence
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {attendanceHistory.length === 0 && <p className="no-data">No records found.</p>}
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="app-content">
      <div className="page-title">
        <h1>Enrolled Courses</h1>
        {/* <p>Overview of your registered courses and attendance performance.</p> */}
      <section className="courses-grid-container">
        {loading ? (
          <div className="loader-container"><div className="premium-spinner"></div></div>
        ) : (
          <div className="premium-grid">
            {courses.map((course, index) => (
              <div key={index} className="enroll-card-main course-card-web">
                <div className="card-accent-line"></div>
                <div className="course-card-header">
                  <span className="course-id-tag">{course.Course_Id}</span>
                  <div className="attendance-circle-wrapper">
                    <svg className="progress-ring" width="60" height="60">
                      <circle className="progress-ring__background" stroke="#e6f2ff" strokeWidth="4" fill="transparent" r="26" cx="30" cy="30"/>
                      <circle 
                        className="progress-ring__bar" 
                        stroke="var(--primary)" strokeWidth="4" fill="transparent" r="26" cx="30" cy="30"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 26}`,
                          strokeDashoffset: `${2 * Math.PI * 26 * (1 - course.Attendance_Percentage / 100)}`
                        }}
                      />
                    </svg>
                    <span className="percentage-text">{course.Attendance_Percentage}%</span>
                  </div>
                </div>
                <div className="course-card-body">
                  <h2 className="course-name-display">{course.Course_Name}</h2>
                  <div className="teacher-info-row">
                    <span className="nav-icon">👤</span>
                    <p className="teacher-name-text">{course.Teacher_Name}</p>
                  </div>
                </div>
                <div className="course-card-footer">
                  <button className="register-action-btn view-details-btn" onClick={() => handleViewAttendance(course)}>
                    View Course Attendance
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default EnrolledCourses;