import { useState } from 'react'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import AddStudent from './pages/datacell/AddStudent';
import AddTeacher from './pages/admin/AddTeacher';
import './App.css'
import Enrollment from './pages/datacell/Enrollment';
 

  const [count, setCount] = useState(0)
import './App.css'; // Global sidebar styling yahan rakhenge

function Sidebar() {
  const location = useLocation(); // Current page check karne ke liye


  return (
   
    // <div>
    //    <AddStudent />
    //   <hr /> 
    //   {/* <AddTeacher />  */}
    //     {/* <hr />
    //   <Enrollment />    */}
    // </div>
  
      
    <aside className="sidebar-fixed">
      <div className="sidebar-logo">M-EYE PRO</div>
      <nav className="sidebar-nav">
        <Link to="/add-student" className={`nav-item ${location.pathname === '/add-student' ? 'active' : ''}`}>
          ADD STUDENT
        </Link>
        <Link to="/add-teacher" className={`nav-item ${location.pathname === '/add-teacher' ? 'active' : ''}`}>
          ADD TEACHER
        </Link>
        <Link to="/enrollment" className={`nav-item ${location.pathname === '/enrollment' ? 'active' : ''}`}>
          ENROLLMENT
        </Link>
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
            <Route path="/" element={<AddStudent />} /> {/* Default Page */}
            <Route path="/add-student" element={<AddStudent />} />
            <Route path="/add-teacher" element={<AddTeacher />} />
            <Route path="/enrollment" element={<Enrollment />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App