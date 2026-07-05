import React, { useState, useEffect } from 'react';
import { bookingService, eventService, participantService } from '../services/api';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [eventId, setEventId] = useState('');
  const [participantId, setParticipantId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookingsList, eventsList, participantsList] = await Promise.all([
        bookingService.getAll(),
        eventService.getAll(),
        participantService.getAll(),
      ]);
      setBookings(bookingsList);
      setEvents(eventsList);
      setParticipants(participantsList);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch bookings data. Please verify your backend server status.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setEventId('');
    setParticipantId('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (booking) => {
    setEditId(booking.id);
    setEventId(booking.eventId.toString());
    setParticipantId(booking.participantId.toString());
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel/delete this booking?')) {
      try {
        await bookingService.delete(id);
        setBookings(bookings.filter((b) => b.id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete booking.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId || !participantId) return;

    setSubmitting(true);
    try {
      const payload = {
        eventId: parseInt(eventId),
        participantId: parseInt(participantId),
      };

      if (editId) {
        await bookingService.update(editId, payload);
      } else {
        await bookingService.create(payload);
      }
      
      // Reload booking list to get nested Event and Participant data
      const updatedBookings = await bookingService.getAll();
      setBookings(updatedBookings);
      
      setIsFormOpen(false);
      setEventId('');
      setParticipantId('');
      setEditId(null);
    } catch (err) {
      console.error(err);
      alert('Error saving booking. Please make sure the participant is not already registered (if constrained) and data is correct.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const eventTitle = b.event ? b.event.title.toLowerCase() : '';
    const participantName = b.participant ? b.participant.name.toLowerCase() : '';
    const participantEmail = b.participant ? b.participant.email.toLowerCase() : '';
    const search = searchTerm.toLowerCase();

    return (
      eventTitle.includes(search) ||
      participantName.includes(search) ||
      participantEmail.includes(search)
    );
  });

  // Recent 5 bookings sorted by date
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt || b.bookingDate || 0) - new Date(a.createdAt || a.bookingDate || 0))
    .slice(0, 5);

  return (
    <>
      {/* ── RECENT BOOKINGS WIDGET ── */}
      <div className="widget-card" style={{ marginBottom: '20px' }}>
        <div className="widget-header">
          <div className="widget-title-row">
            <span className="widget-icon-badge">🎟️</span>
            <h3>Recent Bookings</h3>
          </div>
          <span className="widget-count-badge">{recentBookings.length}</span>
        </div>
        {loading ? (
          <p className="widget-loading">Loading…</p>
        ) : recentBookings.length === 0 ? (
          <div className="widget-empty">
            <span className="widget-empty-icon">📭</span>
            <p>No bookings yet. Create one below!</p>
          </div>
        ) : (
          <div className="recent-bookings-list">
            {recentBookings.map((b, i) => {
              const participantName = b.participant?.name || `Participant #${b.participantId || i + 1}`;
              const eventTitle = b.event?.title || `Event #${b.eventId || '—'}`;
              const bookingDate = b.bookingDate || b.createdAt;
              return (
                <div className="booking-item" key={i}>
                  <div className="booking-avatar">
                    {participantName.charAt(0).toUpperCase()}
                  </div>
                  <div className="booking-info">
                    <div className="booking-name">{participantName}</div>
                    <div className="booking-event">{eventTitle}</div>
                  </div>
                  <div className="booking-right">
                    <span className="booking-badge">Confirmed</span>
                    <div className="booking-date">
                      {bookingDate
                        ? new Date(bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '—'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MAIN BOOKINGS CRUD PANEL ── */}
      <div className="crud-panel">
      <div className="panel-header">
        <div className="panel-title-area">
          <h2>Manage Bookings</h2>
          <p>Book tickets and manage event registrations</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary">
          <span>🎟️</span> Create Booking
        </button>
      </div>

      <div className="panel-actions-row">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by event, attendee or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="total-badge">
          Total Bookings: {filteredBookings.length}
        </div>
      </div>

      {isFormOpen && (
        <div className="form-card-overlay">
          <div className="form-card">
            <h3>{editId ? 'Modify Booking Details' : 'Book a Spot'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Event</label>
                <select
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className="form-input form-select"
                  required
                  disabled={submitting}
                >
                  <option value="">-- Choose Event --</option>
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title} ({evt.venue ? evt.venue.name : 'No Venue'} - {new Date(evt.date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Participant</label>
                <select
                  value={participantId}
                  onChange={(e) => setParticipantId(e.target.value)}
                  className="form-input form-select"
                  required
                  disabled={submitting}
                >
                  <option value="">-- Choose Participant --</option>
                  {participants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.email})
                    </option>
                  ))}
                </select>
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
                  {submitting ? 'Processing...' : 'Confirm Booking'}
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
          <p>Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="panel-empty-state">
          <p>No bookings made yet. Click 'Create Booking' to register a participant to an event.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="recent-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Event Title</th>
                <th>Participant Name</th>
                <th>Participant Email</th>
                <th>Booking Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b, index) => {
                const bookingDate = b.bookingDate 
                  ? new Date(b.bookingDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'N/A';

                return (
                  <tr key={b.id}>
                    <td>#{index + 1}</td>
                    <td className="event-cell">{b.event ? b.event.title : <span style={{ color: '#ef4444' }}>Deleted Event</span>}</td>
                    <td>{b.participant ? b.participant.name : <span style={{ color: '#ef4444' }}>Deleted Participant</span>}</td>
                    <td>{b.participant ? b.participant.email : 'N/A'}</td>
                    <td>{bookingDate}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="btn-action-edit"
                        title="Edit Booking"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="btn-action-delete"
                        title="Cancel Booking"
                      >
                        ❌ Cancel
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
