import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService, bookingService, participantService, venueService, categoryService } from '../services/api';
import Events from './Events';
import Participants from './Participants';
import Venues from './Venues';
import Bookings from './Bookings';
import Categories from './Categories';
import './Dashboard.css';

// ─── Full Month Calendar ───────────────────────────────────────────────────────
function FullMonthCalendar({ eventDates, allEvents }) {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDay, setSelectedDay] = useState(null);

  const monthNames = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();

  // Map day → events list for current month
  const eventsByDay = {};
  allEvents.forEach(e => {
    const dt = new Date(e.date);
    if (dt.getFullYear() === current.year && dt.getMonth() === current.month) {
      const d = dt.getDate();
      if (!eventsByDay[d]) eventsByDay[d] = [];
      eventsByDay[d].push(e);
    }
  });

  const prev = () => setCurrent(c => {
    const m = c.month === 0 ? 11 : c.month - 1;
    const y = c.month === 0 ? c.year - 1 : c.year;
    return { year: y, month: m };
  });

  const next = () => setCurrent(c => {
    const m = c.month === 11 ? 0 : c.month + 1;
    const y = c.month === 11 ? c.year + 1 : c.year;
    return { year: y, month: m };
  });

  const isToday = d =>
    d === today.getDate() &&
    current.month === today.getMonth() &&
    current.year === today.getFullYear();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectedEvents = selectedDay ? (eventsByDay[selectedDay] || []) : [];

  return (
    <div className="full-calendar-card">
      {/* Header */}
      <div className="full-cal-header">
        <div className="full-cal-title-row">
          <h3 className="full-cal-title">📅 {monthNames[current.month]} {current.year}</h3>
          <div className="full-cal-nav-btns">
            <button className="cal-nav" onClick={prev}>‹</button>
            <button className="cal-nav cal-nav-today" onClick={() => {
              setCurrent({ year: today.getFullYear(), month: today.getMonth() });
              setSelectedDay(today.getDate());
            }}>Today</button>
            <button className="cal-nav" onClick={next}>›</button>
          </div>
        </div>
      </div>

      {/* Day Names */}
      <div className="full-cal-grid">
        {dayNames.map(d => (
          <div key={d} className="full-cal-day-name">{d}</div>
        ))}

        {/* Cells */}
        {cells.map((d, i) => {
          if (d === null) return <div key={`e-${i}`} className="full-cal-cell empty" />;
          const evts = eventsByDay[d] || [];
          const hasEvents = evts.length > 0;
          const isTd = isToday(d);
          const isSelected = selectedDay === d;
          return (
            <div
              key={d}
              className={`full-cal-cell${isTd ? ' today' : ''}${isSelected ? ' selected' : ''}${hasEvents ? ' has-events' : ''}`}
              onClick={() => setSelectedDay(d === selectedDay ? null : d)}
            >
              <span className="full-cal-date-num">{d}</span>
              {hasEvents && (
                <div className="full-cal-dots">
                  {evts.slice(0, 3).map((_, di) => (
                    <span key={di} className="full-cal-dot" />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Day Events */}
      {selectedDay && (
        <div className="full-cal-selected-events">
          <div className="full-cal-selected-title">
            📌 Events on {monthNames[current.month]} {selectedDay}
          </div>
          {selectedEvents.length === 0 ? (
            <p className="full-cal-no-events">No events on this day.</p>
          ) : (
            selectedEvents.map((e, i) => (
              <div key={i} className="full-cal-event-item">
                <span className="full-cal-event-dot" />
                <div>
                  <div className="full-cal-event-name">{e.title}</div>
                  <div className="full-cal-event-meta">
                    {e.venue ? `📍 ${e.venue.name}` : '📍 Venue TBD'}
                    {' · '}
                    {e.category ? `🏷️ ${e.category.name}` : ''}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Bar Chart ─────────────────────────────────────────────────────────────────
function BarChart({ bookings }) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const counts = Array(12).fill(0);
  bookings.forEach(b => {
    const d = new Date(b.createdAt || b.date || Date.now());
    if (!isNaN(d)) counts[d.getMonth()]++;
  });
  const max = Math.max(...counts, 1);
  const colors = ['pink','purple','pink','purple','pink','purple','pink','purple','pink','purple','pink','purple'];
  return (
    <div className="bar-chart">
      {months.map((m, i) => (
        <div className="bar-col" key={m}>
          <div
            className={`bar ${colors[i]}`}
            style={{ height: `${Math.max((counts[i] / max) * 75, 4)}px` }}
            title={`${m}: ${counts[i]}`}
          />
          <span className="bar-label">{m}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Donut Chart ───────────────────────────────────────────────────────────────
function DonutChart({ events, bookings }) {
  const confirmed = bookings.length;
  const pending = Math.max(events - bookings.length, 0);
  const total = confirmed + pending || 1;
  const r = 45;
  const circ = 2 * Math.PI * r;
  const confirmedArc = (confirmed / total) * circ;
  const pendingArc   = (pending   / total) * circ;
  return (
    <div className="chart-card donut-card">
      <div className="chart-card-header" style={{ width: '100%' }}>
        <h3>Ticket Sales</h3>
      </div>
      <div className="donut-wrapper">
        <svg className="donut-svg" width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#f3f4f6" strokeWidth="14" />
          <circle cx="60" cy="60" r={r} fill="none" stroke="#e91e8c" strokeWidth="14"
            strokeDasharray={`${confirmedArc} ${circ - confirmedArc}`} strokeLinecap="round" />
          <circle cx="60" cy="60" r={r} fill="none" stroke="#7c3aed" strokeWidth="14"
            strokeDasharray={`${pendingArc} ${circ - pendingArc}`}
            strokeDashoffset={-confirmedArc} strokeLinecap="round" />
        </svg>
        <div className="donut-center">
          <div className="donut-total">{confirmed + pending}</div>
          <div className="donut-label">Total</div>
        </div>
      </div>
      <div className="donut-legend">
        <div className="donut-legend-item">
          <span className="legend-left">
            <span className="donut-dot" style={{ background: '#e91e8c' }} />Confirmed
          </span>
          <strong>{confirmed}</strong>
        </div>
        <div className="donut-legend-item">
          <span className="legend-left">
            <span className="donut-dot" style={{ background: '#7c3aed' }} />Pending
          </span>
          <strong>{pending}</strong>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'admin@eventure.com';

  const [activeTab, setActiveTab]       = useState('dashboard');
  const [stats, setStats]               = useState({ events: 0, bookings: 0, participants: 0, venues: 0 });
  const [recentEvents, setRecentEvents] = useState([]);
  const [allEvents, setAllEvents]       = useState([]);
  const [allBookings, setAllBookings]   = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchQuery, setSearchQuery]   = useState('');

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
      const [eventsList, bookingsList, participantsList, venuesList] = await Promise.all([
        eventService.getAll().catch(() => []),
        bookingService.getAll().catch(() => []),
        participantService.getAll().catch(() => []),
        venueService.getAll().catch(() => []),
      ]);

      setStats({
        events:       eventsList.length,
        bookings:     bookingsList.length,
        participants: participantsList.length,
        venues:       venuesList.length,
      });

      setAllEvents(eventsList);
      setAllBookings(bookingsList);

      const sorted = [...eventsList]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
      setRecentEvents(sorted);
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
    { label: 'Total Events',  value: stats.events.toString(),       icon: '📅' },
    { label: 'Bookings',      value: stats.bookings.toString(),      icon: '🎟️' },
    { label: 'Participants',  value: stats.participants.toString(),  icon: '👥' },
    { label: 'Venues',        value: stats.venues.toString(),        icon: '🏛️' },
  ];

  const totalRevenue = (stats.bookings * 1250).toLocaleString();

  // Popular trends
  const trendData = (() => {
    const catMap = {};
    allEvents.forEach(e => {
      const name = e.category?.name || 'Uncategorized';
      catMap[name] = (catMap[name] || 0) + 1;
    });
    const entries = Object.entries(catMap).sort((a,b) => b[1]-a[1]).slice(0,3);
    const maxVal = entries[0]?.[1] || 1;
    return entries.map(([name, count]) => ({ name, count, pct: Math.round((count/maxVal)*100) }));
  })();

  // Next upcoming event
  const nextEvent = [...allEvents]
    .filter(e => new Date(e.date) >= new Date())
    .sort((a,b) => new Date(a.date) - new Date(b.date))[0];

  const navItems = [
    { key: 'dashboard',    icon: '📊', label: 'Dashboard'    },
    { key: 'categories',   icon: '🏷️', label: 'Categories'   },
    { key: 'venues',       icon: '🏛️', label: 'Venues'       },
    { key: 'events',       icon: '📅', label: 'Events'       },
    { key: 'participants', icon: '👥', label: 'Participants'  },
    { key: 'bookings',     icon: '🎟️', label: 'Bookings'     },
  ];

  return (
    <div className="dashboard-container">

      {/* ── Sidebar ── */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">E</div>
          <span className="sidebar-logo-text">Eventure</span>
        </div>

        <nav className="sidebar-menu">
          {navItems.map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`sidebar-item ${activeTab === key ? 'active' : ''}`}
            >
              <span>{icon}</span> {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">
          <div className="welcome-section">
            <h1>
              {activeTab === 'dashboard'
                ? 'Dashboard'
                : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p>
              {activeTab === 'dashboard'
                ? 'Hello, Welcome Back! 👋'
                : `Manage and update system ${activeTab} details.`}
            </p>
          </div>

          <div className="header-right">
            {activeTab === 'dashboard' && (
              <div className="header-search-wrapper">
                <span className="header-search-icon">🔍</span>
                <input
                  className="header-search-input"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            <div className="user-profile">
              <div className="user-avatar">{userEmail.charAt(0).toUpperCase()}</div>
              <span className="user-name">{userEmail}</span>
            </div>
          </div>
        </header>

        {/* ══════════════ DASHBOARD OVERVIEW ══════════════ */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stat Cards */}
            <div className="stats-grid" style={{ marginBottom: '20px' }}>
              {statCards.map((s, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-info">
                    <h3>{s.label}</h3>
                    <p>{statsLoading ? '...' : s.value}</p>
                  </div>
                  <div className="stat-icon">{s.icon}</div>
                </div>
              ))}
            </div>

            {/* Two-column layout */}
            <div className="overview-layout">

              {/* ── LEFT column ── */}
              <div className="overview-left">

                {/* Revenue chart + Donut */}
                <div className="chart-row">
                  <div className="chart-card">
                    <div className="chart-card-header">
                      <h3>Sales Revenue</h3>
                      <button className="chart-period-btn">Last 12 Months ▾</button>
                    </div>
                    <div className="chart-revenue-amount">₨{totalRevenue}</div>
                    <div className="chart-revenue-sub">
                      <span style={{ color: '#10b981', fontWeight: 600 }}>↑ 12.5%</span>{' '}vs last period
                    </div>
                    {statsLoading
                      ? <div style={{ height:90, display:'flex', alignItems:'center', justifyContent:'center', color:'#9ca3af' }}>Loading…</div>
                      : <BarChart bookings={allBookings} />
                    }
                  </div>
                  <DonutChart events={stats.events} bookings={allBookings} />
                </div>

                {/* Popular Trends */}
                <div className="trends-card">
                  <h3>Popular Trends</h3>
                  {statsLoading ? (
                    <p style={{ color:'#9ca3af', fontSize:13 }}>Loading…</p>
                  ) : trendData.length === 0 ? (
                    <p style={{ color:'#9ca3af', fontSize:13 }}>No event category data yet.</p>
                  ) : (
                    trendData.map((t, i) => (
                      <div className="trend-item" key={i}>
                        <div className="trend-top">
                          <span className="trend-name">{t.name}</span>
                          <span className="trend-count">{t.count} events</span>
                        </div>
                        <div className="trend-bar-bg">
                          <div className="trend-bar-fill" style={{ width: `${t.pct}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Upcoming Events Table */}
                <div className="content-section">
                  <div className="section-header">
                    <h2>Upcoming Registered Events</h2>
                    <button onClick={() => setActiveTab('events')} className="btn-primary" style={{ height:'34px' }}>
                      View All
                    </button>
                  </div>
                  {statsLoading ? (
                    <div className="panel-loading">
                      <div className="loading-spinner" />
                      <p>Loading events…</p>
                    </div>
                  ) : recentEvents.length === 0 ? (
                    <div className="panel-empty-state">
                      <p>No upcoming events yet. Go to Events to add one!</p>
                    </div>
                  ) : (
                    <div className="table-wrapper">
                      <table className="recent-table">
                        <thead>
                          <tr>
                            <th>Event Title</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Venue</th>
                            <th>Bookings</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentEvents.map(event => (
                            <tr key={event.id}>
                              <td className="event-cell">{event.title}</td>
                              <td>
                                <span className="badge-category">
                                  🏷️ {event.category ? event.category.name : 'Uncategorized'}
                                </span>
                              </td>
                              <td>{new Date(event.date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</td>
                              <td>{event.venue ? event.venue.name : <em style={{ color:'#9ca3af' }}>None</em>}</td>
                              <td>
                                <span className="badge-status confirmed">
                                  🎟️ {event.bookings ? event.bookings.length : 0} booked
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>{/* end overview-left */}

              {/* ── RIGHT column ── */}
              <div className="overview-right">

                {/* Upcoming Event Card */}
                <div className="upcoming-card">
                  <h3>Upcoming Event</h3>
                  {statsLoading ? (
                    <p style={{ color:'#9ca3af', fontSize:13 }}>Loading…</p>
                  ) : nextEvent ? (
                    <>
                      <div className="upcoming-event-img-placeholder">🎉</div>
                      <span className="upcoming-badge">{nextEvent.category?.name || 'Event'}</span>
                      <div className="upcoming-event-title">{nextEvent.title}</div>
                      <div className="upcoming-event-desc">
                        {nextEvent.description || 'Join us for an amazing experience at this upcoming event. Tickets are going fast!'}
                      </div>
                      <div className="upcoming-event-meta">
                        <span>📅</span>
                        {new Date(nextEvent.date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                      </div>
                      <button className="upcoming-btn" onClick={() => setActiveTab('bookings')}>
                        Book Now →
                      </button>
                    </>
                  ) : (
                    <p style={{ color:'#9ca3af', fontSize:13 }}>No upcoming events scheduled.</p>
                  )}
                </div>

              </div>
            </div>
          </>
        )}

        {/* Other Tabs — completely untouched */}
        {activeTab === 'events'       && <Events />}
        {activeTab === 'participants' && <Participants />}
        {activeTab === 'venues'       && <Venues />}
        {activeTab === 'bookings'     && <Bookings />}
        {activeTab === 'categories'   && <Categories />}

      </main>
    </div>
  );
}
