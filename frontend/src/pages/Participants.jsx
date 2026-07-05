import React, { useState, useEffect } from 'react';
import { participantService } from '../services/api';

export default function Participants() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await participantService.getAll();
      setParticipants(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch participants. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setName('');
    setEmail('');
    setPhone('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (participant) => {
    setEditId(participant.id);
    setName(participant.name);
    setEmail(participant.email);
    setPhone(participant.phone || '');
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this participant? All of their bookings will also be cancelled.')) {
      try {
        await participantService.delete(id);
        setParticipants(participants.filter((p) => p.id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete participant.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSubmitting(true);
    try {
      const payload = { name, email, phone: phone.trim() || null };

      if (editId) {
        const updated = await participantService.update(editId, payload);
        setParticipants(participants.map((p) => (p.id === editId ? updated : p)));
      } else {
        const created = await participantService.create(payload);
        setParticipants([...participants, created]);
      }
      setIsFormOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setEditId(null);
    } catch (err) {
      console.error(err);
      alert('Error saving participant. Make sure email address is unique.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredParticipants = participants.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.phone && p.phone.includes(searchTerm))
  );

  return (
    <div className="crud-panel">
      <div className="panel-header">
        <div className="panel-title-area">
          <h2>Manage Participants</h2>
          <p>Register, update and track attendees for events</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary">
          <span>➕</span> Add Participant
        </button>
      </div>

      <div className="panel-actions-row">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="total-badge">
          Total Participants: {filteredParticipants.length}
        </div>
      </div>

      {isFormOpen && (
        <div className="form-card-overlay">
          <div className="form-card">
            <h3>{editId ? 'Edit Participant Details' : 'Register New Participant'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. john.doe@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="e.g. +923001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                  disabled={submitting}
                />
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
                  {submitting ? 'Saving...' : 'Register'}
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
          <p>Loading participants list...</p>
        </div>
      ) : filteredParticipants.length === 0 ? (
        <div className="panel-empty-state">
          <p>No registered participants found. Click 'Add Participant' to register your first guest.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="recent-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Active Bookings</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((p, index) => (
                <tr key={p.id}>
                  <td>#{index + 1}</td>
                  <td className="event-cell">{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.phone || <em style={{ color: '#94a3b8' }}>N/A</em>}</td>
                  <td>
                    <span className="badge-count">
                      🎟️ {p.bookings ? p.bookings.length : 0} bookings
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="btn-action-edit"
                      title="Edit Participant"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="btn-action-delete"
                      title="Delete Participant"
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
  );
}
