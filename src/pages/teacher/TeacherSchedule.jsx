// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./TeacherSchedule.css";

// const TeacherSchedule = () => {
//   const [schedule, setSchedule] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // Teacher ID session/localStorage se le rahe hain
//   const teacherID = localStorage.getItem("userId");

//   useEffect(() => {
//     const fetchSchedule = async () => {
//       if (!teacherID) return;
//       try {
//         setLoading(true);
//         const res = await axios.get(`http://localhost:8000/teacher/getTeacherSchedule?teacherId=${teacherID}`);
//         // Aapke backend structure ke mutabiq "Lectures" array nikal rahe hain
//         setSchedule(res.data.Lectures || []);
//       } catch (err) {
//         console.error("Error fetching schedule:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSchedule();
//   }, [teacherID]);

//   return (
//     <div className="schedule-page-container">
//       <header className="schedule-top-bar">
//         <div className="title-section">
//           <h1>Today's Schedule</h1>
//           <p className="current-day">
//             {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
//           </p>
//         </div>
//         <div className="stats-badge">
//           Total Classes: <span>{schedule.length}</span>
//         </div>
//       </header>

//       <main className="schedule-full-view">
//         {loading ? (
//           <div className="schedule-loader">Loading your lectures...</div>
//         ) : schedule.length > 0 ? (
//           <div className="schedule-grid">
//             {schedule.map((lecture, index) => (
//               <div key={index} className="lecture-card-web">
//                 <div className="card-sidebar"></div>
//                 <div className="card-main-content">
//                   <h3 className="course-name">{lecture["Course Name"]}</h3>
//                   <p className="discipline-tag">{lecture.Discipline}</p>
                  
//                   <div className="lecture-footer">
//                     <div className="info-item">
//                       <span className="icon">🕒</span>
//                       <span className="text">{lecture["Class Start time"]} - {lecture["Class End time"]}</span>
//                     </div>
//                     <div className="info-item">
//                       <span className="icon">📍</span>
//                       <span className="text">Venue: {lecture.Venue}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="no-schedule">
//             <p>No classes scheduled for today.</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };



import React, { useState, useEffect } from "react";
import axios from "axios";
// Bell icon ke liye (npm install lucide-react agar installed nahi hai)
import { Bell } from "lucide-react"; 
import "./TeacherSchedule.css";

const TeacherSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  // Notification count ke liye state
  const [notifCount, setNotifCount] = useState(0); 
  
  const teacherID = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!teacherID) return;
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8000/teacher/getTeacherSchedule?teacherId=${teacherID}`);
        setSchedule(res.data.Lectures || []);
        
        // Example: Farz karein aapke notifications ki counting yahan se aa rahi hai
        // setNotifCount(res.data.NotificationCount || 0);
        setNotifCount(5); // Dummy count for testing
      } catch (err) {
        console.error("Error fetching schedule:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [teacherID]);

  return (
    <div className="schedule-page-container">
      <header className="schedule-top-bar">
        <div className="title-section">
          <h1>Today's Schedule</h1>
          <p className="current-day">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* --- Notification Section --- */}
        <div className="header-actions">
          <div className="notification-wrapper">
            <Bell className="bell-icon" size={28} />
            {notifCount > 0 && (
              <span className="notification-badge">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
          </div>
          <div className="stats-badge">
            Total Classes: <span>{schedule.length}</span>
          </div>
        </div>
      </header>

      <main className="schedule-full-view">
        {loading ? (
          <div className="schedule-loader">Loading your lectures...</div>
        ) : schedule.length > 0 ? (
          <div className="schedule-grid">
            {schedule.map((lecture, index) => (
              <div key={index} className="lecture-card-web">
                <div className="card-sidebar"></div>
                <div className="card-main-content">
                  <h3 className="course-name">{lecture["Course Name"]}</h3>
                  <p className="discipline-tag">{lecture.Discipline}</p>
                  
                  <div className="lecture-footer">
                    <div className="info-item">
                      <span className="icon">🕒</span>
                      <span className="text">{lecture["Class Start time"]} - {lecture["Class End time"]}</span>
                    </div>
                    <div className="info-item">
                      <span className="icon">📍</span>
                      <span className="text">Venue: {lecture.Venue}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-schedule">
            <p>No classes scheduled for today.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherSchedule;