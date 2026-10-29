import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scanHistoryService, plantCatalogService } from '../services/api';
import PlantCatalog from './PlantCatalog';
import ScanHistory from './ScanHistory';
import './Dashboard.css';

function parseDiseaseSolution(s) {
  let description = "";
  let biological = "";
  let chemical = "";
  let prevention = "";

  if (!s) return { description: "", biological: "", chemical: "", prevention: "" };

  const str = String(s);
  const lowerStr = str.toLowerCase();

  const descPos = lowerStr.indexOf("description:");
  const bioPos = lowerStr.indexOf("treatment (biological):");
  const chemPos = lowerStr.indexOf("treatment (chemical):");
  const prevPos = lowerStr.indexOf("prevention:");

  const positions = [
    { type: 'desc', pos: descPos, len: 12 },
    { type: 'bio', pos: bioPos, len: 23 },
    { type: 'chem', pos: chemPos, len: 21 },
    { type: 'prev', pos: prevPos, len: 11 }
  ].filter(p => p.pos !== -1).sort((a, b) => a.pos - b.pos);

  if (positions.length > 0) {
    for (let i = 0; i < positions.length; i++) {
      const current = positions[i];
      const start = current.pos + current.len;
      const end = i + 1 < positions.length ? positions[i + 1].pos : str.length;
      const val = str.substring(start, end).trim();

      if (current.type === 'desc') description = val;
      if (current.type === 'bio') biological = val;
      if (current.type === 'chem') chemical = val;
      if (current.type === 'prev') prevention = val;
    }
  } else {
    description = str.trim();
  }

  if (biological === "N/A" || biological === "n/a") biological = "";
  if (chemical === "N/A" || chemical === "n/a") chemical = "";
  if (prevention === "N/A" || prevention === "n/a") prevention = "";

  return { description, biological, chemical, prevention };
}

function parsePlantInfo(s) {
  let oxygen = "";
  let advantages = "";
  let disadvantages = "";
  let benefits = "";

  if (!s) return { oxygen: "", advantages: "", disadvantages: "", benefits: "" };

  try {
    const oxyMarker = "Oxygen Support:";
    const advMarker = "Advantages:";
    const disMarker = "Disadvantages:";
    const benMarker = "Human Benefits:";

    const oxyPos = s.indexOf(oxyMarker);
    const advPos = s.indexOf(advMarker);
    const disPos = s.indexOf(disMarker);
    const benPos = s.indexOf(benMarker);

    if (oxyPos !== -1) {
      const endPos = advPos !== -1 ? advPos : (disPos !== -1 ? disPos : (benPos !== -1 ? benPos : s.length));
      oxygen = s.substring(oxyPos + oxyMarker.length, endPos).trim();
    }

    if (advPos !== -1) {
      const endPos = disPos !== -1 ? disPos : (benPos !== -1 ? benPos : s.length);
      advantages = s.substring(advPos + advMarker.length, endPos).trim();
    }

    if (disPos !== -1) {
      const endPos = benPos !== -1 ? benPos : s.length;
      disadvantages = s.substring(disPos + disMarker.length, endPos).trim();
    }

    if (benPos !== -1) {
      benefits = s.substring(benPos + benMarker.length).trim();
    }
  } catch (e) {
    benefits = s;
  }

  return { oxygen, advantages, disadvantages, benefits };
}

// ─── Bar Chart (AI Scans Activity per Month) ──────────────────────────────────
function BarChart({ scans }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const counts = Array(12).fill(0);
  scans.forEach(s => {
    const d = new Date(s.date || Date.now());
    if (!isNaN(d)) counts[d.getMonth()]++;
  });
  const max = Math.max(...counts, 1);
  const colors = ['green', 'emerald', 'green', 'emerald', 'green', 'emerald', 'green', 'emerald', 'green', 'emerald', 'green', 'emerald'];
  return (
    <div className="bar-chart">
      {months.map((m, i) => (
        <div className="bar-col" key={m}>
          <div
            className={`bar ${colors[i]}`}
            style={{ height: `${Math.max((counts[i] / max) * 75, 4)}px`, backgroundColor: '#10b981' }}
            title={`${m}: ${counts[i]} scans`}
          />
          <span className="bar-label">{m}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Donut Chart (Plant Health Status Ratio) ──────────────────────────────────
function DonutChart({ healthyCount, unhealthyCount }) {
  const total = healthyCount + unhealthyCount || 1;
  const r = 45;
  const circ = 2 * Math.PI * r;
  const healthyArc = (healthyCount / total) * circ;
  const unhealthyArc = (unhealthyCount / total) * circ;
  return (
    <div className="chart-card donut-card">
      <div className="chart-card-header" style={{ width: '100%' }}>
        <h3>Scan Results Ratio</h3>
      </div>
      <div className="donut-wrapper">
        <svg className="donut-svg" width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#f3f4f6" strokeWidth="14" />
          <circle cx="60" cy="60" r={r} fill="none" stroke="#10b981" strokeWidth="14"
            strokeDasharray={`${healthyArc} ${circ - healthyArc}`} strokeLinecap="round" />
          <circle cx="60" cy="60" r={r} fill="none" stroke="#ef4444" strokeWidth="14"
            strokeDasharray={`${unhealthyArc} ${circ - unhealthyArc}`}
            strokeDashoffset={-healthyArc} strokeLinecap="round" />
        </svg>
        <div className="donut-center">
          <div className="donut-total">{healthyCount + unhealthyCount}</div>
          <div className="donut-label">Scans</div>
        </div>
      </div>
      <div className="donut-legend">
        <div className="donut-legend-item">
          <span className="legend-left">
            <span className="donut-dot" style={{ background: '#10b981' }} />Healthy
          </span>
          <strong>{healthyCount}</strong>
        </div>
        <div className="donut-legend-item">
          <span className="legend-left">
            <span className="donut-dot" style={{ background: '#ef4444' }} />Diseased
          </span>
          <strong>{unhealthyCount}</strong>
        </div>
      </div>
    </div>
  );
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────
function LeafLogo() {
  return (
    <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 90 C18 72, 12 38, 44 10 C48 38, 50 65, 50 90 Z"
        fill="#2C5E3B"
      />
      <path
        d="M52 90 C82 75, 88 42, 60 15 C56 42, 52 68, 52 90 Z"
        fill="#7EBD55"
      />
    </svg>
  );
}

function HomeIcon({ active }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "#10b981" : "none"} stroke={active ? "#10b981" : "#64748b"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
}

function SearchIcon({ active }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "#64748b"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}

function ScanIcon({ active }) {
  const color = active ? "#10b981" : "#64748b";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect x="7" y="7" width="3" height="3" rx="0.5" fill={color} />
      <rect x="14" y="7" width="3" height="3" rx="0.5" fill={color} />
      <rect x="7" y="14" width="3" height="3" rx="0.5" fill={color} />
      <rect x="14" y="14" width="1" height="1" fill={color} />
      <rect x="16" y="14" width="1" height="1" fill={color} />
      <rect x="14" y="16" width="1" height="1" fill={color} />
      <rect x="16" y="16" width="1" height="1" fill={color} />
    </svg>
  );
}

function BellIcon({ active, unreadCount }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "#10b981" : "none"} stroke={active ? "#10b981" : "#64748b"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          backgroundColor: '#ef4444',
          color: '#ffffff',
          borderRadius: '50%',
          width: '8px',
          height: '8px',
          border: '1.5px solid #ffffff'
        }} />
      )}
    </div>
  );
}

function LogoutIcon({ active }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "#64748b"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'agriuser@gmail.com';
  const userPassword = localStorage.getItem('userPassword') || '••••••••';

  const handleConfirmLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPassword');
    navigate('/');
  };

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ scans: 0, healthyScans: 0, infectedScans: 0, species: 0 });
  const [allScans, setAllScans] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [bannerIndex, setBannerIndex] = useState(0);
  const [selectedHistoryScan, setSelectedHistoryScan] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex(prev => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'AI Models Updated',
      message: 'Our crop disease database was updated to version 3.2. Scans are now 15% faster.',
      icon: '☁️'
    },
    {
      id: 2,
      title: 'Summer Crop Care Advice',
      message: 'Ensure plants are watered early in the morning to prevent leaf mildew during hot days.',
      icon: '☀️'
    }
  ]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);


  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') navigate('/login');
    else fetchOverviewData();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'dashboard') fetchOverviewData();
  }, [activeTab]);

  const fetchOverviewData = async () => {
    setStatsLoading(true);
    try {
      let apiScans = [];
      let speciesList = [];
      try {
        const [scansList, specList] = await Promise.all([
          scanHistoryService.getAll().catch(() => []),
          plantCatalogService.getAll().catch(() => []),
        ]);
        apiScans = Array.isArray(scansList) ? scansList : [];
        speciesList = Array.isArray(specList) ? specList : [];
      } catch (e) {
        console.warn('Backend API fetch fallback to local:', e);
      }

      const localScans = JSON.parse(localStorage.getItem('agri_scan_history') || '[]');
      const combinedScans = [...localScans, ...apiScans];
      const uniqueScans = combinedScans.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id || (t.plantName === item.plantName && t.date === item.date))
      );

      const healthyScansCount = uniqueScans.filter(s => (s.disease || '').toLowerCase() === 'healthy').length;
      const infectedScansCount = uniqueScans.filter(s => (s.disease || '').toLowerCase() !== 'healthy').length;

      setStats({
        scans: uniqueScans.length,
        healthyScans: healthyScansCount,
        infectedScans: infectedScansCount,
        species: speciesList.length,
      });

      setAllScans(uniqueScans);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  // ── Computed data ──────────────────────────────────────────────────────────
  const statCards = [
    { label: 'Total AI Scans', value: stats.scans.toString(), icon: '📸' },
    { label: 'Healthy Plants', value: stats.healthyScans.toString(), icon: '🟢' },
    { label: 'Infections Detected', value: stats.infectedScans.toString(), icon: '🔴' },
    { label: 'Catalog Species', value: stats.species.toString(), icon: '📖' },
  ];

  // Plant Health Ratio
  const healthyCount = stats.healthyScans;
  const unhealthyCount = stats.infectedScans;

  // Disease trends from scan history
  const diseaseTrends = (() => {
    const dMap = {};
    allScans.forEach(s => {
      if (s.disease.toLowerCase() !== 'healthy') {
        dMap[s.disease] = (dMap[s.disease] || 0) + 1;
      }
    });
    const entries = Object.entries(dMap).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const maxVal = entries[0]?.[1] || 1;
    return entries.map(([name, count]) => ({ name, count, pct: Math.round((count / maxVal) * 100) }));
  })();

  // Latest Scan
  const latestScan = allScans[0] || null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { key: 'dashboard', renderIcon: (active) => <HomeIcon active={active} />, label: 'Home' },
    { key: 'catalog', renderIcon: (active) => <SearchIcon active={active} />, label: 'Search' },
    { key: 'scanner', renderIcon: (active) => <ScanIcon active={active} />, label: 'Scan' },
    { key: 'notifications', renderIcon: (active) => <BellIcon active={active} unreadCount={unreadCount} />, label: 'Notifications', badge: unreadCount },
    { key: 'logout', renderIcon: (active) => <LogoutIcon active={active} />, label: 'Logout' },
  ];

  return (
    <div className="dashboard-container">

      {/* ── Sticky Top Menu Bar ── */}
      <header className="top-navbar">
        <div className="topbar-left">
          <div className="topbar-logo" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
            <div className="topbar-logo-icon"><LeafLogo /></div>
            <span className="topbar-logo-text">AGRI-GUARD</span>
          </div>
        </div>

        <nav className={`topbar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          {navItems.map(({ key, renderIcon, label, badge }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setIsMobileMenuOpen(false);
                }}
                className={`topbar-item ${isActive ? 'active' : ''}`}
              >
                <span className="topbar-item-icon">{renderIcon(isActive)}</span>
                <span className="topbar-item-text">{label}</span>
                {badge > 0 && key !== 'notifications' && (
                  <span className="topbar-badge">{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="topbar-right">
          <button
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <div
            className="user-profile"
            onClick={() => setActiveTab('logout')}
            style={{ cursor: 'pointer' }}
            title="Account & Logout"
          >
            <div className="user-avatar" style={{ backgroundColor: '#10b981' }}>{userEmail.charAt(0).toUpperCase()}</div>
            <span className="user-name">{userEmail}</span>
          </div>

          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="dashboard-main">

        {/* Top Title Banner */}
        <div className="dashboard-page-header">
          <div className="welcome-section">
            <h1>
              {activeTab === 'dashboard'
                ? 'Welcome to AgriGuard AI'
                : navItems.find(i => i.key === activeTab)?.label || activeTab}
            </h1>
            <p>
              {activeTab === 'dashboard'
                ? 'Keep Your Plants Safe 🌿 Monitor your home garden zones and check plant health'
                : `Manage and update system ${activeTab} details.`}
            </p>
          </div>
        </div>

        {/* ══════════════ DASHBOARD HOME SCREEN VIEW ══════════════ */}
        {activeTab === 'dashboard' && (
          <div className="flutter-home-container">

            {/* Horizontal Banner Carousel */}
            <div className="flutter-banner-slider">
              {bannerIndex === 0 ? (
                <div className="flutter-banner-card banner-1">
                  <div className="flutter-banner-badge">SYSTEM STATUS: ONLINE</div>
                  <h3 className="flutter-banner-title">AI Crop Diagnostics</h3>
                  <p className="flutter-banner-desc">Analyze foliage patterns to secure your farm yield.</p>
                  <div className="flutter-banner-icon-bg">🛡️</div>
                </div>
              ) : (
                <div className="flutter-banner-card banner-2">
                  <div className="flutter-banner-badge">BOTANICAL DATABASE</div>
                  <h3 className="flutter-banner-title">Species Library</h3>
                  <p className="flutter-banner-desc">Browse botanical properties and ecological details.</p>
                  <div className="flutter-banner-icon-bg">📖</div>
                </div>
              )}

              {/* Page Indicator Dots */}
              <div className="flutter-banner-dots">
                <span
                  onClick={() => setBannerIndex(0)}
                  className={`flutter-dot ${bannerIndex === 0 ? 'active' : ''}`}
                />
                <span
                  onClick={() => setBannerIndex(1)}
                  className={`flutter-dot ${bannerIndex === 1 ? 'active' : ''}`}
                />
              </div>
            </div>

            {/* Premium Status Alert Bar */}
            <div className="flutter-premium-alert">
              <div className="flutter-premium-badge">
                <span>⭐</span> PREMIUM
              </div>
              <div className="flutter-premium-text">
                {allScans.length === 0
                  ? "Please, click the scan button below!"
                  : `AI scan is active. ${allScans.length} cases diagnosed.`}
              </div>
            </div>

            {/* Scan History Section Header */}
            <div className="flutter-history-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)' }}>AI Scan History</h3>
                {allScans.length > 0 && (
                  <span className="flutter-history-count">{allScans.length} diagnosed</span>
                )}
              </div>
              {allScans.length > 0 && (
                <button 
                  onClick={() => setActiveTab('scanner')} 
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                >
                  View All Scans →
                </button>
              )}
            </div>

            {/* History List / Empty State */}
            {statsLoading ? (
              <div className="panel-loading">
                <div className="loading-spinner" />
                <p>Loading diagnoses...</p>
              </div>
            ) : allScans.length === 0 ? (
              <div className="flutter-empty-history">
                <div className="flutter-empty-icon-circle">
                  <span className="flutter-empty-icon">📷</span>
                </div>
                <h4>No Plant Scans Diagnosed Yet</h4>
                <p>Tap the scan button in the top menu to inspect plant health with AI.</p>
                <button className="btn-primary" style={{ marginTop: '16px', backgroundColor: '#2C5E3B' }} onClick={() => setActiveTab('scanner')}>
                  📸 Scan Plant Leaf Now
                </button>
              </div>
            ) : (
              <div className="flutter-history-list">
                {allScans.map((item) => {
                  const isHealthy = (item.disease || '').toLowerCase() === 'healthy';
                  return (
                    <div
                      key={item.id}
                      className={`flutter-history-card ${isHealthy ? 'healthy' : 'affected'}`}
                      onClick={() => setSelectedHistoryScan(item)}
                    >
                      {/* Left: Plant Image Avatar */}
                      <div className={`flutter-history-avatar ${isHealthy ? 'healthy' : 'affected'}`}>
                        {(item.imageUrl || item.image) ? (
                          <img src={item.imageUrl || item.image} alt={item.plantName || item.plant} />
                        ) : (
                          <span>{isHealthy ? '🌿' : '🍂'}</span>
                        )}
                      </div>

                      {/* Center: Title, Disease, Date */}
                      <div className="flutter-history-content">
                        <div className="flutter-history-title">{item.plantName || item.plant}</div>
                        <div className={`flutter-history-disease ${isHealthy ? 'healthy' : 'affected'}`}>
                          {isHealthy ? 'Healthy Specimen' : item.disease}
                        </div>
                        <div className="flutter-history-date">
                          {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {new Date(item.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {/* Right: Badge Pill & Details Trigger */}
                      <div className="flutter-history-right">
                        <span className={`flutter-status-pill ${isHealthy ? 'healthy' : 'affected'}`}>
                          {isHealthy ? '✅ Healthy' : '⚠️ Affected'}
                        </span>
                        <span className="flutter-details-link">
                          Details →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Modal Detail Dialog for selected scan */}
            {selectedHistoryScan && (
              <div className="form-card-overlay" onClick={() => setSelectedHistoryScan(null)}>
                <div className="form-card" style={{ maxWidth: '580px', padding: 0, maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                  
                  {/* Header Banner - Fixed Top */}
                  <div style={{
                    backgroundColor: selectedHistoryScan.disease.toLowerCase() === 'healthy' ? '#2C5E3B' : '#d32f2f',
                    padding: '24px 20px',
                    color: '#ffffff',
                    textAlign: 'center',
                    flexShrink: 0
                  }}>
                    <div style={{ fontSize: '42px', marginBottom: '8px' }}>
                      {selectedHistoryScan.disease.toLowerCase() === 'healthy' ? '✅' : '⚠️'}
                    </div>
                    <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {selectedHistoryScan.disease}
                    </h3>
                  </div>

                  {/* Scrollable Body Content */}
                  <div style={{ padding: '20px 24px', flex: 1, overflowY: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        🌿
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)' }}>{selectedHistoryScan.plantName || selectedHistoryScan.plant}</h4>
                        <p style={{ margin: '2px 0 0 0', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-light)' }}>{selectedHistoryScan.sciName || 'N/A'}</p>
                      </div>
                    </div>

                    <div style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-light)', letterSpacing: '1px', marginBottom: '12px' }}>
                      DIAGNOSIS & SUGGESTIONS
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {selectedHistoryScan.disease.toLowerCase() === 'healthy' ? (() => {
                        const info = parsePlantInfo(selectedHistoryScan.solution);
                        return (
                          <>
                            {info.oxygen && (
                              <div className="flutter-detail-card blue">
                                <div className="flutter-detail-card-title blue">💨 Oxygen Support</div>
                                <div className="flutter-detail-card-text">{info.oxygen}</div>
                              </div>
                            )}
                            {info.advantages && (
                              <div className="flutter-detail-card green">
                                <div className="flutter-detail-card-title green">👍 Advantages</div>
                                <div className="flutter-detail-card-text">{info.advantages}</div>
                              </div>
                            )}
                            {info.disadvantages && (
                              <div className="flutter-detail-card red">
                                <div className="flutter-detail-card-title red">👎 Disadvantages</div>
                                <div className="flutter-detail-card-text">{info.disadvantages}</div>
                              </div>
                            )}
                            {info.benefits && (
                              <div className="flutter-detail-card pink">
                                <div className="flutter-detail-card-title pink">💖 Human Benefits</div>
                                <div className="flutter-detail-card-text">{info.benefits}</div>
                              </div>
                            )}
                          </>
                        );
                      })() : (() => {
                        const disease = parseDiseaseSolution(selectedHistoryScan.solution);
                        return (
                          <>
                            {disease.description && (
                              <div className="flutter-detail-card amber">
                                <div className="flutter-detail-card-title amber">ℹ️ Disease Description</div>
                                <div className="flutter-detail-card-text">{disease.description}</div>
                              </div>
                            )}
                            {disease.biological && (
                              <div className="flutter-detail-card green">
                                <div className="flutter-detail-card-title green">🌿 Biological Treatment</div>
                                <div className="flutter-detail-card-text">{disease.biological}</div>
                              </div>
                            )}
                            {disease.chemical && (
                              <div className="flutter-detail-card blue">
                                <div className="flutter-detail-card-title blue">🧪 Chemical Treatment</div>
                                <div className="flutter-detail-card-text">{disease.chemical}</div>
                              </div>
                            )}
                            {disease.prevention && (
                              <div className="flutter-detail-card teal">
                                <div className="flutter-detail-card-title teal">🛡️ Prevention & Protection</div>
                                <div className="flutter-detail-card-text">{disease.prevention}</div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Sticky Action Footer */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 24px', backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
                    <button className="btn-secondary" onClick={() => setSelectedHistoryScan(null)}>
                      CLOSE
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* Tabs components mapping */}
        {activeTab === 'scanner' && <ScanHistory />}
        {activeTab === 'catalog' && <PlantCatalog />}

        {activeTab === 'notifications' && (
          <div className="flutter-notifications-container">
            <div className="flutter-greeting-header" style={{ marginBottom: '20px' }}>
              <span className="flutter-greeting-sub">System & Care Alerts</span>
              <h2 className="flutter-greeting-title">AgriGuard Alerts 🔔</h2>
            </div>

            <div className="flutter-notifications-list">
              {notifications.map(n => (
                <div key={n.id} className="flutter-notification-card">
                  <div className="flutter-notification-avatar">
                    {n.icon}
                  </div>
                  <div className="flutter-notification-content">
                    <h4 className="flutter-notification-title">{n.title}</h4>
                    <p className="flutter-notification-body">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'logout' && (
          <div className="flutter-logout-container">
            <div className="flutter-logout-card">
              {/* Header Avatar & Status Badge */}
              <div className="flutter-logout-header">
                <div className="flutter-logout-avatar-circle">
                  👤
                </div>
                <div className="flutter-logout-badge">
                  <span className="pulse-dot"></span> Active Session
                </div>
                <h3 className="flutter-logout-title">User Account Profile</h3>
                <p className="flutter-logout-subtitle">Review your profile details before signing out of AgriGuard</p>
              </div>

              {/* Credentials Section */}
              <div className="flutter-logout-section">
                <div className="flutter-section-label">ACCOUNT CREDENTIALS</div>
                <div className="flutter-credentials-box">
                  <div className="flutter-cred-row">
                    <span className="flutter-cred-label">👤 Username</span>
                    <span className="flutter-cred-val">{userEmail.includes('@') ? userEmail.split('@')[0] : userEmail}</span>
                  </div>
                  <div className="flutter-cred-divider" />
                  <div className="flutter-cred-row">
                    <span className="flutter-cred-label">📧 Email Address</span>
                    <span className="flutter-cred-val">{userEmail.includes('@') ? userEmail : `${userEmail}@gmail.com`}</span>
                  </div>
                  <div className="flutter-cred-divider" />
                  <div className="flutter-cred-row">
                    <span className="flutter-cred-label">🔒 Password</span>
                    <span className="flutter-cred-val">••••••••</span>
                  </div>
                </div>
              </div>

              {/* Scan History Summary Section */}
              <div className="flutter-logout-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="flutter-section-label">DIAGNOSTIC SUMMARY</span>
                  <span className="flutter-count-pill">
                    {allScans.length} {allScans.length === 1 ? 'case' : 'cases'} logged
                  </span>
                </div>
                <div className="flutter-history-summary-box">
                  {allScans.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-light)', fontSize: '13px' }}>
                      No scan history logged yet.
                    </div>
                  ) : (
                    allScans.map((scan, idx) => {
                      const isHealthy = (scan.disease || '').toLowerCase() === 'healthy';
                      return (
                        <div key={scan.id || idx} className="flutter-summary-item">
                          <div className="flutter-summary-img-wrap" style={{ backgroundColor: isHealthy ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)' }}>
                            {(scan.imageUrl || scan.image) ? (
                              <img src={scan.imageUrl || scan.image} alt={scan.plantName} />
                            ) : (
                              <span style={{ fontSize: '14px' }}>🌿</span>
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="flutter-summary-name">
                              {scan.plantName}
                            </div>
                            <div className="flutter-summary-disease" style={{ color: isHealthy ? '#10b981' : '#ef4444' }}>
                              {isHealthy ? '● Healthy Plant' : `● ${scan.disease}`}
                            </div>
                          </div>
                          <span className="flutter-summary-date">
                            {new Date(scan.date).toLocaleDateString()}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Confirmation Notice Banner */}
              <div className="logout-confirm-banner">
                <span className="logout-warning-icon">🚪</span>
                <p>Are you sure you want to log out of <strong>AgriGuard AI</strong>?</p>
              </div>

              {/* Cancel / Log Out Buttons Row */}
              <div className="logout-actions-grid">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="logout-btn-cancel"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="logout-btn-confirm"
                >
                  Confirm Log Out ➔
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
