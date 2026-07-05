import React, { useState, useEffect } from 'react';
import { venueService, eventService } from '../services/api';

const presetVenues = [
  { name: 'Royal Palm Banquet Hall', address: '52 Canal Bank Road, Lahore', guests: 500 },
  { name: 'Jinnah Convention Centre', address: 'Club Road, Islamabad', guests: 1000 },
  { name: 'PC Hotel Marquee', address: 'Shahrah-e-Quaid-e-Azam, Lahore', guests: 400 },
  { name: 'Beach Luxury Hotel Lawn', address: 'Lalazar, Karachi', guests: 300 },
  { name: 'Shalimar Gardens Pavillion', address: 'GT Road, Lahore', guests: 250 },
  { name: 'Serena Sheesh Mahal', address: 'Khayaban-e-Suhrawardy, Islamabad', guests: 350 },
  { name: 'PAF Yacht Club Lounge', address: 'DHA Phase 8, Karachi', guests: 150 },
  { name: 'Shahi Qila Courtyard', address: 'Walled City, Lahore', guests: 800 },
  { name: 'Khanpur Lake Resort', address: 'Khanpur Dam, Haripur', guests: 120 },
  { name: 'Expo Centre Hall', address: 'Johar Town, Lahore', guests: 1500 }
];

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [guests, setGuests] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [allEvents, setAllEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');

  useEffect(() => {
    fetchVenues();
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getAll();
      setAllEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await venueService.getAll();
      setVenues(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch venues. Please make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setName('');
    setAddress('');
    setGuests('');
    setSelectedEventId('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (venue) => {
    setEditId(venue.id);
    setName(venue.name);
    setAddress(venue.address);
    setGuests(venue.guests.toString());
    const linkedEvent = venue.events && venue.events.length > 0 ? venue.events[0].id.toString() : '';
    setSelectedEventId(linkedEvent);
    setIsFormOpen(true);
  };

  const handleUnlinkEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to remove this event from this venue? The event itself will not be deleted.')) {
      try {
        await eventService.update(eventId, { venueId: null });
        await fetchVenues();
        await fetchEvents();
      } catch (err) {
        console.error(err);
        alert('Failed to remove event from venue.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this venue? All events scheduled here will have their venue cleared.')) {
      try {
        await venueService.delete(id);
        setVenues(venues.filter((venue) => venue.id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete venue.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !guests) return;

    setSubmitting(true);
    try {
      const payload = {
        name,
        address,
        guests: parseInt(guests),
      };

      if (editId) {
        const updated = await venueService.update(editId, payload);
        // Link the selected event if set
        if (selectedEventId) {
          await eventService.update(parseInt(selectedEventId), { venueId: editId });
        }
      } else {
        const created = await venueService.create(payload);
        // Link the selected event if set
        if (selectedEventId) {
          await eventService.update(parseInt(selectedEventId), { venueId: created.id });
        }
      }
      
      await fetchVenues();
      await fetchEvents();
      setIsFormOpen(false);
      setName('');
      setAddress('');
      setGuests('');
      setSelectedEventId('');
      setEditId(null);
    } catch (err) {
      console.error(err);
      alert('Error saving venue details. Please verify your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Top venues by number of linked events
  const topVenues = [...venues]
    .map(v => ({ ...v, eventCount: v.events ? v.events.length : 0 }))
    .sort((a, b) => b.eventCount - a.eventCount)
    .slice(0, 4);

  return (
    <>
      {/* ── TOP VENUES WIDGET ── */}
      <div className="widget-card" style={{ marginBottom: '20px' }}>
        <div className="widget-header">
          <div className="widget-title-row">
            <span className="widget-icon-badge">🏛️</span>
            <h3>Top Venues</h3>
          </div>
          <span className="widget-count-badge">{venues.length} total</span>
        </div>
        {loading ? (
          <p className="widget-loading">Loading…</p>
        ) : topVenues.length === 0 ? (
          <div className="widget-empty">
            <span className="widget-empty-icon">🏗️</span>
            <p>No venues yet. Add one below to get started!</p>
          </div>
        ) : (
          <div className="top-venues-list">
            {topVenues.map((v, i) => {
              const maxCount = topVenues[0].eventCount || 1;
              const pct = Math.round((v.eventCount / maxCount) * 100);
              const medals = ['🥇', '🥈', '🥉', '🏅'];
              return (
                <div className="venue-rank-item" key={v.id}>
                  <span className="venue-medal">{medals[i] || '🏅'}</span>
                  <div className="venue-rank-info">
                    <div className="venue-rank-top">
                      <span className="venue-rank-name">{v.name}</span>
                      <span className="venue-rank-count">{v.eventCount} event{v.eventCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="venue-rank-bar-bg">
                      <div className="venue-rank-bar-fill" style={{ width: `${Math.max(pct, 4)}%` }} />
                    </div>
                    <div className="venue-rank-cap">📍 {v.address} · 👤 {v.guests} guests</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MAIN VENUES CRUD PANEL ── */}
      <div className="crud-panel">
      <div className="panel-header">
        <div className="panel-title-area">
          <h2>Manage Venues</h2>
          <p>Configure locations and seating capacities</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary">
          <span>➕</span> Add Venue
        </button>
      </div>

      <div className="panel-actions-row">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="total-badge">
          Total Venues: {filteredVenues.length}
        </div>
      </div>

      {isFormOpen && (
        <div className="form-card-overlay">
          <div className="form-card">
            <h3>{editId ? 'Edit Venue Details' : 'Add New Venue'}</h3>
             <form onSubmit={handleSubmit}>
              {!editId && (
                <div className="form-group">
                  <label>Quick Select Preset Location</label>
                  <select
                    onChange={(e) => {
                      const idx = e.target.value;
                      if (idx !== '') {
                        const preset = presetVenues[idx];
                        setName(preset.name);
                        setAddress(preset.address);
                        setGuests(preset.guests.toString());
                      }
                    }}
                    className="form-input form-select"
                    defaultValue=""
                  >
                    <option value="">-- Or select a template --</option>
                    {presetVenues.map((v, index) => (
                      <option key={index} value={index}>
                        {v.name} ({v.guests} guests)
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Venue Name</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Banquet Hall, Grand Auditorium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  placeholder="e.g. 128 Main Street, Sector G"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-input"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Guests</label>
                <input
                  type="number"
                  placeholder="e.g. 250"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="form-input"
                  required
                  min="1"
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Event</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="form-input form-select"
                  disabled={submitting}
                >
                  <option value="">-- Choose Event to Link (Optional) --</option>
                  {allEvents.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title} {evt.venue ? `(${evt.venue.name})` : '(No Venue)'}
                    </option>
                  ))}
                </select>
              </div>

              {editId && (
                (() => {
                  const currentVenue = venues.find(v => v.id === editId);
                  const linkedEvents = currentVenue ? (currentVenue.events || []) : [];
                  if (linkedEvents.length > 0) {
                    return (
                      <div className="form-group" style={{ marginTop: '15px' }}>
                        <label style={{ fontWeight: '600', color: '#475569' }}>
                          Currently Linked Events ({linkedEvents.length})
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '5px', maxHeight: '120px', overflowY: 'auto', padding: '8px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          {linkedEvents.map(event => (
                            <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#334155', padding: '4px 0' }}>
                              <span>🗓️ {event.title}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                  {new Date(event.date).toLocaleDateString()}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUnlinkEvent(event.id)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    padding: '0 4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  title="Unlink event from this venue"
                                >
                                  ❌
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()
              )}

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
          <p>Loading venues...</p>
        </div>
      ) : filteredVenues.length === 0 ? (
        <div className="panel-empty-state">
          <p>No venues configured yet. Click 'Add Venue' to set up a location!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="recent-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Venue Name</th>
                <th>Address</th>
                <th>Guests</th>
                <th>Upcoming Events</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVenues.map((venue, index) => (
                <tr key={venue.id}>
                  <td>#{index + 1}</td>
                  <td className="event-cell">{venue.name}</td>
                  <td>{venue.address}</td>
                  <td>
                    <span className="badge-status confirmed">
                      👤 {venue.guests} guests
                    </span>
                  </td>
                  <td>
                    <span className="badge-count">
                      {venue.events ? venue.events.length : 0} events
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenEdit(venue)}
                      className="btn-action-edit"
                      title="Edit Venue"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(venue.id)}
                      className="btn-action-delete"
                      title="Delete Venue"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}
