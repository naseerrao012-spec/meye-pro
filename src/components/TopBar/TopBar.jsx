import React from 'react';
import { useLocation } from 'react-router-dom';
import './TopBar.css';

export default function TopBar({ onToggle, isOpen }) {
  const location = useLocation();
  const path = location.pathname;
  if (path === '/' || path === '/Login') return null;

  return (
    <header className="topbar">
      <button className="topbar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
        {isOpen ? '✖' : '☰'}
      </button>
      <div className="topbar-title">M-EYE PRO</div>
    </header>
  );
}
