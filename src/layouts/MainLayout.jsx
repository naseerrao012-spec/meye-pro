import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../components/TopBar/TopBar';
import Sidebar from '../components/Sidebar/Sidebar';
import '../App.css';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setSidebarOpen(false);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add('sidebar-open');
    else document.body.classList.remove('sidebar-open');
    return () => document.body.classList.remove('sidebar-open');
  }, [sidebarOpen]);

  return (
    <div className="app-viewport">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content-area">
        <TopBar onToggle={() => setSidebarOpen(open => !open)} isOpen={sidebarOpen} />
        <div className={`overlay ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)} />

        <div className="scroll-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
