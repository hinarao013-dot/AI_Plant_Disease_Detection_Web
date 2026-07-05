import React, { useState, useEffect } from 'react';
import { eventService, venueService, categoryService } from '../services/api';

// ─── Full Month Calendar ────────────────────────────────────────────────────
function FullMonthCalendar({ allEvents }) {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDay, setSelectedDay] = useState(null);

  const monthNames = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();

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
    <div className="full-calendar-card" style={{ marginBottom: '20px' }}>
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
      <div className="full-cal-grid">
        {dayNames.map(d => <div key={d} className="full-cal-day-name">{d}</div>)}
        {cells.map((d, i) => {
          if (d === null) return <div key={`e-${i}`} className="full-cal-cell empty" />;
          const evts = eventsByDay[d] || [];
          const isTd = isToday(d);
          const isSelected = selectedDay === d;
          return (
            <div
              key={d}
              className={`full-cal-cell${isTd ? ' today' : ''}${isSelected ? ' selected' : ''}${evts.length > 0 ? ' has-events' : ''}`}
              onClick={() => setSelectedDay(d === selectedDay ? null : d)}
            >
              <span className="full-cal-date-num">{d}</span>
              {evts.length > 0 && (
                <div className="full-cal-dots">
                  {evts.slice(0, 3).map((_, di) => <span key={di} className="full-cal-dot" />)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selectedDay && (
        <div className="full-cal-selected-events">
          <div className="full-cal-selected-title">📌 Events on {monthNames[current.month]} {selectedDay}</div>
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
                    {e.category ? ` · 🏷️ ${e.category.name}` : ''}
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

export default function Events() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venueId, setVenueId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [eventsList, venuesList, categoriesList] = await Promise.all([
        eventService.getAll(),
        venueService.getAll(),
        categoryService.getAll(),
      ]);
      setEvents(eventsList);
      setVenues(venuesList);
      setCategories(categoriesList);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data from Express server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setVenueId('');
    setCategoryId('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditId(evt.id);
    setTitle(evt.title);
    setDescription(evt.description || '');
    // Format date string to YYYY-MM-DD for input type="date"
    const formattedDate = evt.date ? new Date(evt.date).toISOString().split('T')[0] : '';
    setDate(formattedDate);
    setTime(evt.time || '');
    setVenueId(evt.venueId ? evt.venueId.toString() : '');
    setCategoryId(evt.categoryId ? evt.categoryId.toString() : '');
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event? All associated bookings will be permanently removed.')) {
      try {
        await eventService.delete(id);
        setEvents(events.filter((e) => e.id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete event.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    setSubmitting(true);
    try {
      const payload = {
        title,
        description: description.trim() || null,
        date: new Date(date),
        time: time.trim() || null,
        venueId: venueId ? parseInt(venueId) : null,
        categoryId: categoryId ? parseInt(categoryId) : null,
      };

      if (editId) {
        await eventService.update(editId, payload);
      } else {
        await eventService.create(payload);
      }
      
      // Reload everything to get updated links/counts
      const updatedEvents = await eventService.getAll();
      setEvents(updatedEvents);
      
      setIsFormOpen(false);
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setVenueId('');
      setCategoryId('');
      setEditId(null);
    } catch (err) {
      console.error(err);
      alert('Error saving event. Please check inputs and venue availability.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEvents = events.filter((evt) =>
    evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (evt.description && evt.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Today's events computed from loaded events list
  const todayStr = new Date().toDateString();
  const todaysEvents = events.filter(e => new Date(e.date).toDateString() === todayStr);

  return (
    <>
      {/* ── TODAY'S EVENTS WIDGET ── */}
      <div className="widget-card" style={{ marginBottom: '20px' }}>
        <div className="widget-header">
          <div className="widget-title-row">
            <span className="widget-icon-badge">🗓️</span>
            <h3>Today's Events</h3>
          </div>
          <span className="widget-count-badge">{todaysEvents.length}</span>
        </div>
        {loading ? (
          <p className="widget-loading">Loading…</p>
        ) : todaysEvents.length === 0 ? (
          <div className="widget-empty">
            <span className="widget-empty-icon">🌤️</span>
            <p>No events scheduled for today.</p>
          </div>
        ) : (
          <div className="today-events-list">
            {todaysEvents.map((e, i) => (
              <div className="today-event-item" key={i}>
                <div className="today-event-color-bar" />
                <div className="today-event-info">
                  <div className="today-event-title">{e.title}</div>
                  <div className="today-event-meta">
                    {e.venue ? `📍 ${e.venue.name}` : '📍 Venue TBD'}
                    {e.category ? ` · 🏷️ ${e.category.name}` : ''}
                  </div>
                </div>
                <span className="today-event-time">
                  {new Date(e.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── FULL MONTH CALENDAR ── */}
      <FullMonthCalendar allEvents={events} />

      {/* ── MAIN EVENTS CRUD PANEL ── */}
      <div className="crud-panel">
      <div className="panel-header">
        <div className="panel-title-area">
          <h2>Manage Events</h2>
          <p>Create, update and schedule events</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary">
          <span>➕</span> Add Event
        </button>
      </div>

      <div className="panel-actions-row">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="total-badge">
          Total Events: {filteredEvents.length}
        </div>
      </div>

      {isFormOpen && (
        <div className="form-card-overlay">
          <div className="form-card">
            <h3>{editId ? 'Edit Event Details' : 'Create New Event'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Annual Developers Conference"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Provide event details, schedule, requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input form-textarea"
                  disabled={submitting}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-input"
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM - 4:00 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="form-input"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Venue (Location)</label>
                  <select
                    value={venueId}
                    onChange={(e) => setVenueId(e.target.value)}
                    className="form-input form-select"
                    disabled={submitting}
                  >
                    <option value="">-- Choose Venue --</option>
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} (Guests: {v.guests})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label>Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="form-input form-select"
                    disabled={submitting}
                  >
                    <option value="">-- Choose category to Link (Optional) --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-buttons">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && <div className="panel-error-alert">{error}</div>}

      {loading ? (
        <div className="panel-loading">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="panel-empty-state">
          <p>No events found. Click 'Add Event' to set up your first event.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="recent-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date & Time</th>
                <th>Venue</th>
                <th>Booked Count</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((evt) => {
                const eventDate = new Date(evt.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                return (
                  <tr key={evt.id}>
                    <td className="event-cell">
                      <div className="event-title-main">{evt.title}</div>
                      {evt.description && (
                        <div className="event-desc-sub">{evt.description.substring(0, 50)}...</div>
                      )}
                    </td>
                    <td>
                      <span className="badge-category">
                        🏷️ {evt.category ? evt.category.name : 'Uncategorized'}
                      </span>
                    </td>
                    <td>
                      <div className="date-main">{eventDate}</div>
                      {evt.time && <div className="time-sub">⏰ {evt.time}</div>}
                    </td>
                    <td>
                      {evt.venue ? (
                        <div className="venue-info">
                          <span className="venue-name">{evt.venue.name}</span>
                          <span className="venue-cap"> (Guests: {evt.venue.guests})</span>
                        </div>
                      ) : (
                        <em style={{ color: '#94a3b8' }}>No venue assigned</em>
                      )}
                    </td>
                    <td>
                      <span className="badge-status confirmed">
                        🎟️ {evt.bookings ? evt.bookings.length : 0} bookings
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenEdit(evt)}
                        className="btn-action-edit"
                        title="Edit Event"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(evt.id)}
                        className="btn-action-delete"
                        title="Delete Event"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}
