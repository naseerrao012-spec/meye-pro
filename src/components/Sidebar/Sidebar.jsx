import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const location = useLocation();
  const path = location.pathname;
  const userRole = localStorage.getItem('userRole');

  if (path === '/' || path === '/Login') return null;

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand-header">
        <span className="brand-logo">M-EYE PRO</span>
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">✖</button>
      </div>

      <nav className="sidebar-nav">
        
        {/* DATACELL OPERATIONS - sirf datacell role ko dikhein */}
        {userRole === 'datacell' && (
          <>
            <div className="nav-section-label">DATACELL OPERATIONS</div>
            <Link to="/add-student" onClick={onClose} className={`nav-item ${path === '/add-student' ? 'active' : ''}`}>
              <span className="nav-icon">🎓</span> ADD STUDENT
            </Link>
            <Link to="/enrollment" onClick={onClose} className={`nav-item ${path === '/enrollment' ? 'active' : ''}`}>
              <span className="nav-icon">📝</span> ENROLLMENT
            </Link>
            <Link to="/allocation" onClick={onClose} className={`nav-item ${path === '/allocation' ? 'active' : ''}`}>
              <span className="nav-icon">📊</span> ALLOCATION
            </Link>
          </>
        )}

        {/* ADMINISTRATION - sirf admin role ko dikhein */}
        {userRole === 'admin' && (
          <>
            <div className="nav-section-label admin-label">ADMINISTRATION</div>
            {/* NEW VENUE MONITORING LINK */}
            <Link to="/venue-dashboard" onClick={onClose} className={`nav-item ${path === '/venue-dashboard' ? 'active' : ''}`}>
              <span className="nav-icon">🏛️</span> VENUE MONITORING
            </Link>
            <Link to="/add-teacher" onClick={onClose} className={`nav-item ${path === '/add-teacher' ? 'active' : ''}`}>
              <span className="nav-icon">👨‍🏫</span> ADD TEACHER
            </Link>
            <Link to="/getAllTeachers" onClick={onClose} className={`nav-item ${path === '/getAllTeachers' ? 'active' : ''}`}>
              <span className="nav-icon">👥</span> ALL TEACHERS
            </Link>
            <Link to="/dvr-management" onClick={onClose} className={`nav-item ${path === '/dvr-management' ? 'active' : ''}`}>
              <span className="nav-icon">📹</span> DVR MANAGEMENT
            </Link>
            <Link to="/upload" onClick={onClose} className={`nav-item ${path === '/upload-timetable' ? 'active' : ''}`}>
              <span className="nav-icon">📅</span> UPLOAD TIMETABLE
            </Link>
          </>
        )}
        {/* TEACHER SECTION - sirf teacher role ko dikhein */}
        {userRole?.toLowerCase() === 'teacher' && (
          <>
           <div className="nav-section-label">TEACHER PANEL</div>
            <Link to="/teacher-schedule" onClick={onClose} className={`nav-item ${path === '/teacher-schedule' ? 'active' : ''}`}>
            <span className="nav-icon">📅</span> TODAY SCHEDULE
            </Link>
            
            <Link to="/teacher-reports" onClick={onClose} className={`nav-item ${path === '/teacher-reports' ? 'active' : ''}`}>
            <span className="nav-icon">📊</span> Teacher CHR/CAR REPORTS
            </Link>
          </>
      )}

        <div className="sidebar-bottom-action">
          <Link to="/Login" onClick={onClose} className="logout-btn">
            <span className="nav-icon">🚪</span> LOGOUT
          </Link>
        </div>
      </nav>
    </aside>
  );
}
