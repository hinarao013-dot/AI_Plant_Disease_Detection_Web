import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import loginBg from '../assets/login_custom_event.jpg';
import './Login.css'; // Reuse the beautiful layout styling

const LeafLogo = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <defs>
      <linearGradient id="leftLeafGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2C5E3B" />
        <stop offset="100%" stopColor="#4A8B5B" />
      </linearGradient>
      <linearGradient id="rightLeafGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#7EBD55" />
        <stop offset="100%" stopColor="#98D173" />
      </linearGradient>
    </defs>
    <path d="M 50 90 C 18 72, 12 38, 44 10 C 48 38, 50 65, 50 90 Z" fill="url(#leftLeafGrad)" />
    <path d="M 52 90 C 82 75, 88 42, 60 15 C 56 42, 52 68, 52 90 Z" fill="url(#rightLeafGrad)" />
  </svg>
);

const FoliageWatermark = ({ className }) => {
  const getCubicPoint = (p0, p1, p2, p3, t) => {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;
    return {
      x: p0.x * uuu + p1.x * 3 * uu * t + p2.x * 3 * u * tt + p3.x * ttt,
      y: p0.y * uuu + p1.y * 3 * uu * t + p2.y * 3 * u * tt + p3.y * ttt
    };
  };

  const getCubicTangent = (p0, p1, p2, p3, t) => {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    return {
      x: (p1.x - p0.x) * 3 * uu + (p2.x - p1.x) * 6 * u * t + (p3.x - p2.x) * 3 * tt,
      y: (p1.y - p0.y) * 3 * uu + (p2.y - p1.y) * 6 * u * t + (p3.y - p2.y) * 3 * tt
    };
  };

  const mainBranchSpecs = [
    { t: 0.12, angleOffset: -0.65, scale: 1.15, isDark: true },
    { t: 0.22, angleOffset: 0.55, scale: 1.08, isDark: false },
    { t: 0.32, angleOffset: -0.60, scale: 1.02, isDark: true },
    { t: 0.44, angleOffset: 0.50, scale: 0.96, isDark: false },
    { t: 0.56, angleOffset: -0.52, scale: 0.88, isDark: true },
    { t: 0.68, angleOffset: 0.45, scale: 0.82, isDark: false },
    { t: 0.80, angleOffset: -0.40, scale: 0.74, isDark: true },
    { t: 0.90, angleOffset: 0.32, scale: 0.66, isDark: false },
    { t: 1.00, angleOffset: -0.05, scale: 0.55, isDark: true },
  ];

  const secondaryBranchSpecs = [
    { t: 0.15, angleOffset: 0.60, scale: 1.0, isDark: false },
    { t: 0.30, angleOffset: -0.55, scale: 0.92, isDark: true },
    { t: 0.48, angleOffset: 0.50, scale: 0.84, isDark: false },
    { t: 0.68, angleOffset: -0.48, scale: 0.76, isDark: true },
    { t: 0.85, angleOffset: 0.38, scale: 0.66, isDark: false },
    { t: 1.00, angleOffset: 0.05, scale: 0.52, isDark: true },
  ];

  const drawBranch = (p0, p1, p2, p3, specs, isMain) => {
    const leaves = specs.map((spec, index) => {
      const base = getCubicPoint(p0, p1, p2, p3, spec.t);
      const tangent = getCubicTangent(p0, p1, p2, p3, spec.t);
      const baseAngleRad = Math.atan2(tangent.y, tangent.x);
      const finalAngleRad = baseAngleRad + spec.angleOffset;
      const angleDeg = (finalAngleRad * 180) / Math.PI;

      const length = (isMain ? 58 : 48) * spec.scale;
      const width = (isMain ? 13 : 11) * spec.scale;

      const leftFill = spec.isDark ? "url(#foliageDarkGrad)" : "url(#foliageLightGrad)";
      const rightFill = spec.isDark ? "url(#foliageDarkGradDarker)" : "url(#foliageLightGradDarker)";

      return (
        <g key={index} transform={`translate(${base.x}, ${base.y}) rotate(${angleDeg})`}>
          <path d={`M 0,0 Q ${length * 0.35},${-width * 0.5} ${length},0 Q ${length * 0.45},${-width * 0.15} 0,0 Z`} fill={leftFill} />
          <path d={`M 0,0 Q ${length * 0.35},${width * 0.5} ${length},0 Q ${length * 0.45},${width * 0.15} 0,0 Z`} fill={rightFill} />
          <line x1="0" y1="0" x2={length * 0.88} y2="0" stroke="rgba(0,0,0,0.22)" strokeWidth="0.8" />
        </g>
      );
    });

    // Generate path data for the stem
    const steps = 30;
    let pathData = `M ${p0.x},${p0.y}`;
    for (let i = 1; i <= steps; i++) {
      const pt = getCubicPoint(p0, p1, p2, p3, i / steps);
      pathData += ` L ${pt.x},${pt.y}`;
    }

    return (
      <g key={isMain ? "main" : "sub"}>
        <path d={pathData} fill="none" stroke="#2C4A34" strokeWidth={isMain ? "2.4" : "1.8"} strokeLinecap="round" opacity="0.85" />
        {leaves}
      </g>
    );
  };

  // Coordinates matching viewBox="0 0 400 700"
  const mainP0 = { x: -30, y: 730 };
  const mainP1 = { x: 75, y: 620 };
  const mainP2 = { x: 140, y: 580 };
  const mainP3 = { x: 210, y: 490 };

  const subP0 = { x: -20, y: 650 };
  const subP1 = { x: 60, y: 660 };
  const subP2 = { x: 120, y: 650 };
  const subP3 = { x: 180, y: 590 };

  return (
    <svg viewBox="0 0 400 700" className={`foliage-svg ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="foliageDarkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1E3523" />
          <stop offset="100%" stopColor="#4A7555" />
        </linearGradient>
        <linearGradient id="foliageLightGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3B5E41" />
          <stop offset="100%" stopColor="#6DA376" />
        </linearGradient>
        <linearGradient id="foliageDarkGradDarker" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#122216" />
          <stop offset="100%" stopColor="#3E6247" />
        </linearGradient>
        <linearGradient id="foliageLightGradDarker" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2F4B34" />
          <stop offset="100%" stopColor="#5E8D66" />
        </linearGradient>
      </defs>
      {drawBranch(mainP0, mainP1, mainP2, mainP3, mainBranchSpecs, true)}
      {drawBranch(subP0, subP1, subP2, subP3, secondaryBranchSpecs, false)}
    </svg>
  );
};

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setAlert(null);

    // Form validation
    if (!name || !email || !password || !confirmPassword) {
      setAlert({
        type: 'error',
        message: 'All fields are required.',
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

    if (password !== confirmPassword) {
      setAlert({
        type: 'error',
        message: 'Passwords do not match.',
      });
      return;
    }

    if (!agreeTerms) {
      setAlert({
        type: 'error',
        message: 'You must agree to the terms and conditions.',
      });
      return;
    }

    setIsLoading(true);

    // Simulate backend registration API
    setTimeout(() => {
      setIsLoading(false);
      setAlert({
        type: 'success',
        message: 'Registration successful! Redirecting to login...',
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }, 2000);
  };



  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* Left Side: Brand Visual Panel (Splash style) */}
        <div className="login-splash-column">
          <FoliageWatermark className="bottom-left" />
          <FoliageWatermark className="bottom-right" />
          
          <div className="login-splash-center">
            <LeafLogo size={100} />
            <h1 className="login-splash-title">AGRI-GUARD</h1>
            <p className="login-splash-tagline">AI Disease Detection & Solution</p>
            <p className="login-splash-description">
              Agri-Guard is your dedicated AI companion for plant health and crop protection. By combining advanced computer vision with expert agricultural insights, our platform instantly identifies plant diseases and provides actionable treatment plans. Empower your farming or gardening journey with real-time diagnostics to keep your crops thriving.
            </p>
          </div>

          <div className="login-splash-progress-container">
            <div className="login-splash-progress-track">
              <div className="login-splash-progress-bar"></div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="login-form-column">
          {/* Mobile-only brand banner with custom event background */}
          <div className="login-mobile-banner">
            <img src={loginBg} alt="Plant background" className="login-mobile-banner-img" />
            <div className="login-mobile-banner-overlay">
              <div className="login-mobile-banner-logo">
                <LeafLogo size={40} />
                <span className="login-logo-text">AgriGuard</span>
              </div>
            </div>
          </div>

          <div className="login-form-header">
            <div className="login-logo-wrapper">
              <LeafLogo size={80} />
            </div>
            <h1 className="login-form-title">Sign Up</h1>
            <p className="login-form-subtitle">Create a new account</p>
          </div>

          {alert && (
            <div className={`login-alert login-alert-${alert.type}`}>
              {alert.message}
            </div>
          )}

          <form onSubmit={handleRegister} className="login-form">
            {/* Full Name */}
            <div className="login-input-group">
              <label className="login-input-label">Full Name</label>
              <div className="login-input-wrapper">
                <input
                  type="text"
                  placeholder="John Doe"
                  className="login-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
                <span className="login-input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </span>
              </div>
            </div>

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
                  placeholder="••••••••"
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

            {/* Confirm Password Field */}
            <div className="login-input-group">
              <label className="login-input-label">Confirm Password</label>
              <div className="login-input-wrapper">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="login-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
                <span className="login-input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="login-options-row">
              <label className="login-remember-me">
                <input
                  type="checkbox"
                  className="login-checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={isLoading}
                />
                I agree to the Terms & Conditions
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }}></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'REGISTER'
              )}
            </button>
          </form>

          <div className="login-footer-text">
            Already have an account?
            <Link to="/login" className="login-register-link">Login Here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
