import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/' || path === '/Login') return null;

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand-header">
        <span className="brand-logo">M-EYE PRO</span>
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">✖</button>
      </div>

      <nav className="sidebar-nav">
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

        <div className="nav-section-label admin-label">ADMINISTRATION</div>
        <Link to="/add-teacher" onClick={onClose} className={`nav-item ${path === '/add-teacher' ? 'active' : ''}`}>
          <span className="nav-icon">👨‍🏫</span> ADD TEACHER
        </Link>

        <Link to="/getAllTeachers" onClick={onClose} className={`nav-item ${path === '/getAllTeachers' ? 'active' : ''}`}>
          <span className="nav-icon">👥</span> getAllTeachers
        </Link>

        <div className="sidebar-bottom-action">
          <Link to="/Login" onClick={onClose} className="logout-btn">
            <span className="nav-icon">🚪</span> LOGOUT
          </Link>
        </div>
      </nav>
    </aside>
  );
}
