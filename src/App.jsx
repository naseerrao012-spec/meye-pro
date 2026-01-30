import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import AddStudent from './pages/datacell/AddStudent';
import AddTeacher from './pages/admin/AddTeacher';
import Enrollment from './pages/datacell/Enrollment';
import Login from './pages/Auth/Login';
import './App.css';

function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  // 1. Login page par Sidebar ko chupa dena chahiye
  if (path === "/Login" || path === "/") return null;

  // 2. LocalStorage se user ka role check karein (jo Login.jsx set karega)
  const userRole = localStorage.getItem('userRole');

  return (
    <aside className="sidebar-fixed">
      <div className="sidebar-logo">M-EYE PRO</div>
      <nav className="sidebar-nav">
        {/* Sirf tab dikhao jab user 'datacell' ho */}
        {userRole === 'datacell' && (
          <>
            <Link to="/add-student" className={`nav-item ${path === '/add-student' ? 'active' : ''}`}>
              ADD STUDENT
            </Link>
            <Link to="/enrollment" className={`nav-item ${path === '/enrollment' ? 'active' : ''}`}>
              ENROLLMENT
            </Link>
          </>
        )}

        {/* Sirf tab dikhao jab user 'admin' ho */}
        {userRole === 'admin' && (
          <Link to="/add-teacher" className={`nav-item ${path === '/add-teacher' ? 'active' : ''}`}>
            ADD TEACHER
          </Link>
        )}

        {/* <div className="sidebar-bottom">
          <Link to="/Login" onClick={() => localStorage.clear()} className="nav-item logout-btn">
            LOGOUT
          </Link>
        </div> */}
      </nav>
    </aside>
  );
}

function App() {
  return (
    <Router>
      <div className="full-screen-app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            {/* Pehle Login screen dikhani chahiye */}
            <Route path="/" element={<Login />} />
            <Route path="/Login" element={<Login />} />
            
            {/* Dashboard Routes */}
            <Route path="/add-student" element={<AddStudent />} />
            <Route path="/add-teacher" element={<AddTeacher />} />
            <Route path="/enrollment" element={<Enrollment />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;