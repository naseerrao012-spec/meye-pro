import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('password', password);

  try {
    const response = await axios.post('http://127.0.0.1:8000/Authorization/Login', formData);

    if (response.data.Role) {
      // 1. Role ko save karein (taki sidebar ko pata chale kya dikhana hai)
      localStorage.setItem('userRole', response.data.Role.toLowerCase());
      
      console.log("Login Successful! Redirecting to Add Student...");

      // 2. DEFAULT PAGE: Login hote hi seedha Add Student par bhejein
      navigate('/add-student'); 
    }
  } catch (err) {
    setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-web-view">
      <div className="login-side-shape"></div>
      <div className="login-main-wrapper">
        <div className="login-premium-card">
          <div className="login-avatar-header">
            <span className="avatar-icon">👤</span>
          </div>

          <form className="login-form-container" onSubmit={handleLoginSubmit}>
            <div className="login-input-group">
              <label>UserId</label>
              <div className="field-wrapper">
                <span className="field-prefix">👤</span>
                <input 
                  type="text" 
                  placeholder="Enter UID" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="login-input-group">
              <label>Password</label>
              <div className="field-wrapper">
                <span className="field-prefix">🔒</span>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            {error && <p className="login-error-msg" style={{color: 'red', fontSize: '12px', textAlign: 'center'}}>{error}</p>}

            <button type="submit" className="login-action-btn" disabled={loading}>
              {loading ? "AUTHENTICATING..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;