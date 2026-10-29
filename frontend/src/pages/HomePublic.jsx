import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import slide1 from '../assets/slide1.png';
import slide2 from '../assets/slide2.png';
import slide3 from '../assets/slide3.png';
import './HomePublic.css';

const LeafLogo = () => (
  <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 90 C18 72, 12 38, 44 10 C48 38, 50 65, 50 90 Z" fill="#2C5E3B" />
    <path d="M52 90 C82 75, 88 42, 60 15 C56 42, 52 68, 52 90 Z" fill="#7EBD55" />
  </svg>
);

export default function HomePublic() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  // 3 Auto-sliding Hero Banners (Every 3 Seconds = 3000ms)
  const slides = [
    {
      id: 1,
      image: slide1,
      tag: "AI CROP DIAGNOSTICS",
      title: "Protect Your Crops with Real-Time AI Diagnostics",
      description: "Instantly scan plant foliage to detect diseases, inspect leaf patterns, and secure your farm yield before infections spread.",
      buttonText: "Scan Your Plants Now",
    },
    {
      id: 2,
      image: slide2,
      tag: "BOTANICAL LIBRARY",
      title: "Explore Thousands of Plant Species & Growth Care",
      description: "Access our comprehensive botanical directory detailing oxygen support ratings, ecological advantages, and human health benefits.",
      buttonText: "Browse Plant Directory",
    },
    {
      id: 3,
      image: slide3,
      tag: "ORGANIC & CHEMICAL SOLUTIONS",
      title: "Smart Biological Treatments & Disease Prevention",
      description: "Receive expert biological remedies, chemical treatments, and preventive measures tailored to your specific crop condition.",
      buttonText: "Get Treatment Plans",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const setActiveTab = (tab) => {
    setActiveSection(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-public-container">
      {/* ── Fixed Top Navigation Bar ── */}
      <header className="public-navbar">
        <div className="public-nav-brand" onClick={() => setActiveTab('home')}>
          <div className="public-logo-icon">
            <LeafLogo />
          </div>
          <span className="public-brand-text">AGRI-GUARD</span>
        </div>

        <nav className="public-nav-links">
          <button 
            className={`public-nav-item ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button 
            className={`public-nav-item ${activeSection === 'how-it-works' ? 'active' : ''}`}
            onClick={() => setActiveTab('how-it-works')}
          >
            How It Works
          </button>
          <button 
            className={`public-nav-item ${activeSection === 'features' ? 'active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            Features
          </button>
          <button 
            className={`public-nav-item ${activeSection === 'directory' ? 'active' : ''}`}
            onClick={() => setActiveTab('directory')}
          >
            Botanical Directory
          </button>
          <button 
            className={`public-nav-item ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact Us
          </button>
        </nav>

        <div className="public-nav-actions">
          <button 
            className="public-login-btn"
            onClick={() => navigate('/login')}
          >
            <span className="btn-icon">🔐</span> Login
          </button>
        </div>
      </header>

      {/* ── Main View Area (Conditioned by activeSection) ── */}
      <main className="public-main-content">
        {/* ── HOME TAB: Show All Content (Hero + Stats + How It Works + Features + Directory + Contact) ── */}
        {activeSection === 'home' && (
          <>
            {/* Hero Auto-Sliding Carousel Section (2 Sec Timer) */}
            <section id="home" className="hero-slider-section">
              {slides.map((slide, idx) => (
                <div 
                  key={slide.id} 
                  className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
              ))}

              {/* Aesthetic Floating Glass Action Bar */}
              <div className="hero-floating-glass-bar">
                <div className="hero-floating-info">
                  <span className="hero-pulsing-badge">
                    <span className="pulse-dot"></span> Real-Time AI Scanner
                  </span>
                  <h3 className="hero-floating-title">Protect Your Crops with Smart AI Diagnostics</h3>
                </div>
                <div className="hero-floating-actions">
                  <button className="public-btn-primary" onClick={() => navigate('/login')}>
                    Scan Plants Now →
                  </button>
                  <button className="public-btn-secondary" onClick={() => setActiveTab('how-it-works')}>
                    Learn How It Works
                  </button>
                </div>
              </div>

              {/* Carousel Controls */}
              <button className="slider-arrow prev" onClick={handlePrevSlide} aria-label="Previous Slide">❮</button>
              <button className="slider-arrow next" onClick={handleNextSlide} aria-label="Next Slide">❯</button>
              <div className="slider-dots-container">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </section>

            {/* Impact Stats Strip */}
            <section className="stats-strip">
              <div className="stats-container">
                <div className="stat-card">
                  <h3 className="stat-number">99.2%</h3>
                  <p className="stat-label">AI Diagnostic Accuracy</p>
                </div>
                <div className="stat-card">
                  <h3 className="stat-number">50,000+</h3>
                  <p className="stat-label">Plant Scans Performed</p>
                </div>
                <div className="stat-card">
                  <h3 className="stat-number">120+</h3>
                  <p className="stat-label">Crop Diseases Covered</p>
                </div>
                <div className="stat-card">
                  <h3 className="stat-number">24/7</h3>
                  <p className="stat-label">Real-time Farmer Assistance</p>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="public-section light-bg">
              <div className="section-header-center">
                <span className="sub-badge">SIMPLE 3-STEP PROCESS</span>
                <h2 className="section-title">How AgriGuard AI Works</h2>
                <p className="section-subtitle">Get instant crop diagnostics and solution guidance in three effortless steps.</p>
              </div>
              <div className="steps-grid">
                <div className="step-card">
                  <div className="step-number">01</div>
                  <div className="step-icon-wrapper">📸</div>
                  <h3 className="step-title">Select Plant Image</h3>
                  <p className="step-desc">Choose an existing plant or crop image from your device gallery to initiate diagnosis.</p>
                </div>
                <div className="step-card">
                  <div className="step-number">02</div>
                  <div className="step-icon-wrapper">🧠</div>
                  <h3 className="step-title">AI Pattern Inspection</h3>
                  <p className="step-desc">Our computer vision model inspects foliage spots, coloration, and leaf structures in seconds.</p>
                </div>
                <div className="step-card">
                  <div className="step-number">03</div>
                  <div className="step-icon-wrapper">🛡️</div>
                  <h3 className="step-title">Receive Treatment Plan</h3>
                  <p className="step-desc">Get biological treatments, chemical recommendations, and preventive guidelines to protect your yield.</p>
                </div>
              </div>
            </section>

            {/* App Features Section */}
            <section className="public-section">
              <div className="section-header-center">
                <span className="sub-badge">KEY PLATFORM CAPABILITIES</span>
                <h2 className="section-title">Comprehensive Plant Protection</h2>
                <p className="section-subtitle">Built for modern farmers, gardeners, and agronomists seeking healthy crop development.</p>
              </div>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">🌿</div>
                  <h3>Instant Disease Identification</h3>
                  <p>Accurately diagnose rust, blight, mildew, phytoplasma, and fungal infections instantly.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🧪</div>
                  <h3>Dual Treatment Options</h3>
                  <p>Provides both eco-friendly biological remedies and targeted chemical treatment plans.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📖</div>
                  <h3>Botanical Species Library</h3>
                  <p>Search botanical details including scientific naming, oxygen ratings, and ecological benefits.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📊</div>
                  <h3>Diagnostic History Tracking</h3>
                  <p>Keep a chronological record of all scanned crops to monitor health trends over time.</p>
                </div>
              </div>
            </section>

            {/* Botanical Directory Preview */}
            <section className="public-section light-bg">
              <div className="section-header-center">
                <span className="sub-badge">BOTANICAL DIRECTORY</span>
                <h2 className="section-title">Explore Featured Plants</h2>
                <p className="section-subtitle">Browse ecological advantages and human health benefits of popular plants.</p>
              </div>
              <div className="plants-preview-grid">
                <div className="plant-preview-card">
                  <div className="plant-avatar">🌿</div>
                  <h4>Rose (Rosa rubiginosa)</h4>
                  <div className="plant-tags">
                    <span className="tag blue">💨 High Oxygen</span>
                    <span className="tag green">👍 Anti-inflammatory</span>
                  </div>
                  <p className="plant-desc">Popular ornamental flower with rich aromatherapy and skin health benefits.</p>
                </div>
                <div className="plant-preview-card">
                  <div className="plant-avatar">🍎</div>
                  <h4>Crab Apple (Malus sylvestris)</h4>
                  <div className="plant-tags">
                    <span className="tag blue">💨 High Oxygen</span>
                    <span className="tag green">👍 Rich Vitamin C</span>
                  </div>
                  <p className="plant-desc">Wild apple species offering bird habitat and pectin for jelly production.</p>
                </div>
                <div className="plant-preview-card">
                  <div className="plant-avatar">🌾</div>
                  <h4>Wheat (Triticum aestivum)</h4>
                  <div className="plant-tags">
                    <span className="tag blue">💨 Staple Crop</span>
                    <span className="tag green">👍 High Fiber</span>
                  </div>
                  <p className="plant-desc">Essential global cereal grain supporting human nutrition and agricultural economy.</p>
                </div>
              </div>
            </section>

            {/* Call To Action Banner */}
            <section className="cta-banner-section">
              <div className="cta-banner-content">
                <h2>Ready to Secure Your Farm & Crops?</h2>
                <p>Join thousands of farmers using AgriGuard AI for instant disease detection and smart treatment guidance.</p>
                <div className="cta-buttons">
                  <button className="public-btn-primary" onClick={() => navigate('/login')}>
                    Login to Access System →
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── HOW IT WORKS TAB: Show ONLY How It Works ── */}
        {activeSection === 'how-it-works' && (
          <section className="public-section light-bg" style={{ minHeight: '60vh', marginTop: '20px' }}>
            <div className="section-header-center">
              <span className="sub-badge">SYSTEM WORKFLOW</span>
              <h2 className="section-title">How AgriGuard AI Works</h2>
              <p className="section-subtitle">A simple 3-step automated pipeline designed for accurate crop diagnosis.</p>
            </div>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">01</div>
                <div className="step-icon-wrapper">📸</div>
                <h3 className="step-title">Select Plant Image</h3>
                <p className="step-desc">Choose an existing plant or crop image from your device gallery to initiate diagnosis.</p>
              </div>
              <div className="step-card">
                <div className="step-number">02</div>
                <div className="step-icon-wrapper">🧠</div>
                <h3 className="step-title">AI Pattern Inspection</h3>
                <p className="step-desc">Our computer vision model inspects foliage spots, coloration, and leaf structures in seconds.</p>
              </div>
              <div className="step-card">
                <div className="step-number">03</div>
                <div className="step-icon-wrapper">🛡️</div>
                <h3 className="step-title">Receive Treatment Plan</h3>
                <p className="step-desc">Get biological treatments, chemical recommendations, and preventive guidelines to protect your yield.</p>
              </div>
            </div>
          </section>
        )}

        {/* ── FEATURES TAB: Show ONLY Features ── */}
        {activeSection === 'features' && (
          <section className="public-section" style={{ minHeight: '60vh', marginTop: '20px' }}>
            <div className="section-header-center">
              <span className="sub-badge">PLATFORM CAPABILITIES</span>
              <h2 className="section-title">AgriGuard Features</h2>
              <p className="section-subtitle">Smart tools designed for comprehensive crop diagnostics and management.</p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🌿</div>
                <h3>Instant Disease Identification</h3>
                <p>Accurately diagnose rust, blight, mildew, phytoplasma, and fungal infections instantly.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🧪</div>
                <h3>Dual Treatment Options</h3>
                <p>Provides both eco-friendly biological remedies and targeted chemical treatment plans.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📖</div>
                <h3>Botanical Species Library</h3>
                <p>Search botanical details including scientific naming, oxygen ratings, and ecological benefits.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Diagnostic History Tracking</h3>
                <p>Keep a chronological record of all scanned crops to monitor health trends over time.</p>
              </div>
            </div>
          </section>
        )}

        {/* ── BOTANICAL DIRECTORY TAB: Show ONLY Botanical Directory ── */}
        {activeSection === 'directory' && (
          <section className="public-section light-bg" style={{ minHeight: '60vh', marginTop: '20px' }}>
            <div className="section-header-center">
              <span className="sub-badge">SPECIES DIRECTORY</span>
              <h2 className="section-title">Botanical Database</h2>
              <p className="section-subtitle">Browse ecological advantages, oxygen ratings, and human benefits.</p>
            </div>
            <div className="plants-preview-grid">
              <div className="plant-preview-card">
                <div className="plant-avatar">🌿</div>
                <h4>Rose (Rosa rubiginosa)</h4>
                <div className="plant-tags">
                  <span className="tag blue">💨 High Oxygen</span>
                  <span className="tag green">👍 Anti-inflammatory</span>
                </div>
                <p className="plant-desc">Popular ornamental flower with rich aromatherapy and skin health benefits.</p>
              </div>
              <div className="plant-preview-card">
                <div className="plant-avatar">🍎</div>
                <h4>Crab Apple (Malus sylvestris)</h4>
                <div className="plant-tags">
                  <span className="tag blue">💨 High Oxygen</span>
                  <span className="tag green">👍 Rich Vitamin C</span>
                </div>
                <p className="plant-desc">Wild apple species offering bird habitat and pectin for jelly production.</p>
              </div>
              <div className="plant-preview-card">
                <div className="plant-avatar">🌾</div>
                <h4>Wheat (Triticum aestivum)</h4>
                <div className="plant-tags">
                  <span className="tag blue">💨 Staple Crop</span>
                  <span className="tag green">👍 High Fiber</span>
                </div>
                <p className="plant-desc">Essential global cereal grain supporting human nutrition and agricultural economy.</p>
              </div>
            </div>
          </section>
        )}

        {/* ── CONTACT US TAB: Show ONLY Contact Us / CTA ── */}
        {activeSection === 'contact' && (
          <section className="cta-banner-section" style={{ minHeight: '60vh', marginTop: '40px', marginBottom: '40px' }}>
            <div className="cta-banner-content">
              <h2>Contact AgriGuard AI Team</h2>
              <p>Have questions or need assistance with your crop diagnostics? Reach out to our agricultural support experts.</p>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '24px', borderRadius: '16px', maxWidth: '480px', margin: '0 auto 28px auto', textAlign: 'left' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '15px' }}>📧 <strong>Email:</strong> support@agriguard.com</p>
                <p style={{ margin: '0 0 10px 0', fontSize: '15px' }}>📞 <strong>Phone:</strong> +1 (800) 555-AGRI</p>
                <p style={{ margin: 0, fontSize: '15px' }}>📍 <strong>Office:</strong> AgriGuard AI Research Center</p>
              </div>
              <div className="cta-buttons">
                <button className="public-btn-primary" onClick={() => navigate('/login')}>
                  Login to Access System →
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── Fixed Footer Across All Sub-pages ── */}
      <footer className="public-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="public-nav-brand" onClick={() => setActiveTab('home')}>
              <div className="public-logo-icon">
                <LeafLogo />
              </div>
              <span className="public-brand-text">AGRI-GUARD</span>
            </div>
            <p className="footer-brand-desc">
              AI-Powered Plant Disease Detection & Botanical Directory System designed for optimal crop yield.
            </p>
          </div>

          <div className="footer-links-group">
            <h4>Quick Links</h4>
            <ul>
              <li><button onClick={() => setActiveTab('home')}>Home</button></li>
              <li><button onClick={() => setActiveTab('how-it-works')}>How It Works</button></li>
              <li><button onClick={() => setActiveTab('features')}>Features</button></li>
              <li><button onClick={() => setActiveTab('directory')}>Botanical Directory</button></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Account Access</h4>
            <ul>
              <li><button onClick={() => navigate('/login')}>Login</button></li>
              <li><button onClick={() => navigate('/register')}>Sign Up</button></li>
              <li><button onClick={() => navigate('/dashboard')}>Dashboard</button></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Contact Support</h4>
            <p className="footer-contact-item">📧 support@agriguard.com</p>
            <p className="footer-contact-item">📞 +1 (800) 555-AGRI</p>
            <p className="footer-contact-item">📍 AgriGuard AI Labs</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AgriGuard AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
