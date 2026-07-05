import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import loginBg from '../assets/login_custom_event.jpg';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: string }
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setAlert(null);

    // Basic validation
    if (!email || !password) {
      setAlert({
        type: 'error',
        message: 'Please fill in all fields.',
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setAlert({
        type: 'error',
        message: 'Please enter a valid email address.',
      });
      return;
    }

    if (password.length < 6) {
      setAlert({
        type: 'error',
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    setIsLoading(true);

    // Simulate backend response
    setTimeout(() => {
      setIsLoading(false);
      setAlert({
        type: 'success',
        message: 'Login successful! Redirecting to dashboard...',
      });
      
      // Store mock user session
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);

      // Redirect to dashboard or home after 1.5s
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }, 2000);
  };

  const handleSocialLogin = (platform) => {
    setAlert({
      type: 'success',
      message: `Connecting to ${platform}...`,
    });
  };

  return (
    <div className="login-page-container">
      {/* Decorative blurred glow circles */}
      <div className="login-bg-glow-1"></div>
      <div className="login-bg-glow-2"></div>

      <div className="login-card">
        {/* Left Side: Brand Visual Panel */}
        <div className="login-image-column">
          <img src={loginBg} alt="Event background" className="login-image-bg" />
          <div className="login-image-overlay"></div>
          
          <div className="login-brand">
            <div className="login-logo-container">
              <div className="login-logo-icon">E</div>
              <span className="login-logo-text">Eventure</span>
            </div>
          </div>

          <div className="login-image-info">
            <h2 className="login-image-title">Gather. Celebrate. Remember.</h2>
            <p className="login-image-desc">
              Create, organize, and experience premium events. From high-profile corporate conferences to vibrant social gatherings, manage everything in one sophisticated space.
            </p>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="login-form-column">
          {/* Mobile-only brand banner with custom event background */}
          <div className="login-mobile-banner">
            <img src={loginBg} alt="Event background" className="login-mobile-banner-img" />
            <div className="login-mobile-banner-overlay">
              <div className="login-mobile-banner-logo">
                <div className="login-logo-icon">E</div>
                <span className="login-logo-text">Eventure</span>
              </div>
            </div>
          </div>

          <div className="login-form-header">
            <h1 className="login-form-title">Welcome</h1>
            <p className="login-form-subtitle">Login with your credentials</p>
          </div>

          {alert && (
            <div className={`login-alert login-alert-${alert.type}`}>
              {alert.message}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            {/* Email Field */}
            <div className="login-input-group">
              <label className="login-input-label">Email</label>
              <div className="login-input-wrapper">
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <span className="login-input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Password Field */}
            <div className="login-input-group">
              <label className="login-input-label">Password</label>
              <div className="login-input-wrapper">
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <span className="login-input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Options Row */}
            <div className="login-options-row">
              <label className="login-remember-me">
                <input
                  type="checkbox"
                  className="login-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                Remember me
              </label>
              <a href="#forgot" className="login-forgot-link" onClick={(e) => { e.preventDefault(); handleSocialLogin('Password Reset Portal'); }}>
                Forgot your password?
              </a>
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }}></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'LOGIN'
              )}
            </button>
          </form>

          {/* Social Sign-In Divider */}
          <div className="login-divider-row">OR</div>

          {/* Social Buttons */}
          <div className="login-social-row">
            <button className="login-social-btn" onClick={() => handleSocialLogin('Google')} disabled={isLoading} title="Log in with Google">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
              </svg>
            </button>
            <button className="login-social-btn" onClick={() => handleSocialLogin('Facebook')} disabled={isLoading} title="Log in with Facebook">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button className="login-social-btn" onClick={() => handleSocialLogin('Apple')} disabled={isLoading} title="Log in with Apple">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.18.67-2.9 1.49-.62.71-1.16 1.85-1.01 2.96 1.09.09 2.21-.55 2.92-1.39z"/>
              </svg>
            </button>
          </div>

          {/* Footer Link */}
          <div className="login-footer-text">
            Don't have an account?
            <Link to="/register" className="login-register-link">Register Now</Link>
          </div>

          {/* Silhouette City Landmark Path at Bottom */}
          <svg className="login-city-silhouette" viewBox="0 0 400 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path className="login-city-path" d="M0,60 L400,60 L400,30 L385,30 L385,45 L380,45 L380,25 L375,25 L375,45 L370,45 L370,15 L365,15 L365,45 L360,45 L360,35 L350,35 L350,45 L340,45 L340,5 L330,5 L330,45 L320,45 L320,20 L310,20 L310,45 L300,45 L300,30 L290,30 L290,45 L275,45 L275,10 L260,10 L260,45 L250,45 L250,25 L240,25 L240,45 L230,45 L230,5 L215,5 L215,45 L205,45 L205,30 L195,30 L195,45 L180,45 L180,15 L170,15 L170,45 L160,45 L160,25 L150,25 L150,45 L140,45 L140,0 L125,0 L125,45 L115,45 L115,35 L105,35 L105,45 L90,45 L90,10 L75,10 L75,45 L65,45 L65,20 L55,20 L55,45 L45,45 L45,30 L35,30 L35,45 L20,45 L20,5 L5,5 L5,45 L0,45 Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
