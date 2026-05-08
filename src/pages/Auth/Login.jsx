import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        const userRole = response.data.Role.toLowerCase();
        localStorage.setItem('userRole', userRole);
        localStorage.setItem("userName", response.data.Name)
        localStorage.setItem('userId', userId);
        
        let redirectPath = '/add-student';

        if (userRole === 'datacell') {
          redirectPath = '/add-student';
        } else if (userRole === 'admin') {
          redirectPath = '/getAllTeachers';
        } else if (userRole === 'teacher') {
          redirectPath = '/teacher-schedule';
        } else if (userRole === 'director') {
          redirectPath = '/AllTeacher';
        } else if (userRole === 'student') {
          redirectPath = '/enrolled-courses';
        }

        navigate(redirectPath);
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
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button"
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <p className="login-error-msg">{error}</p>}

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