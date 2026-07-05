import React, { useState, useEffect } from 'react';
import { categoryService, eventService } from '../services/api';

const presetCategories = [
  'Conference',
  'Seminar',
  'Workshop',
  'Concert',
  'Wedding',
  'Birthday Party',
  'Exhibition',
  'Meetup',
  'Sports',
  'Festival'
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  useEffect(() => {
    fetchCategories(true);
    fetchEvents();
  }, []);

  const fetchCategories = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch categories. Please make sure backend is running.');
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await eventService.getAll();
      setAllEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setName('');
    setSelectedEventId('');
    setIsCustomCategory(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditId(category.id);
    setName(category.name);
    const linkedEvent = category.events && category.events.length > 0 ? category.events[0].id.toString() : '';
    setSelectedEventId(linkedEvent);
    setIsCustomCategory(!presetCategories.includes(category.name));
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? All events associated with it will have their category cleared.')) {
      try {
        await categoryService.delete(id);
        setCategories(categories.filter((cat) => cat.id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete category.');
      }
    }
  };

  const handleUnlinkEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to remove this event from this category? The event itself will not be deleted.')) {
      try {
        await eventService.update(eventId, { categoryId: null });
        await fetchCategories(false);
        await fetchEvents();
      } catch (err) {
        console.error(err);
        alert('Failed to remove event from category.');
      }
    }
  };

  const handleAddEventToCategory = async (eventId) => {
    if (!eventId) return;
    try {
      await eventService.update(eventId, { categoryId: editId });
      await fetchCategories(false);
      await fetchEvents();
    } catch (err) {
      console.error(err);
      alert('Failed to add event to category.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      if (editId) {
        // Update category name
        await categoryService.update(editId, { name });
        
        // Link the selected event if set
        if (selectedEventId) {
          await eventService.update(parseInt(selectedEventId), { categoryId: editId });
        }
      } else {
        // Create new category
        const created = await categoryService.create({ name });
        
        // Link the selected event if set
        if (selectedEventId) {
          await eventService.update(parseInt(selectedEventId), { categoryId: created.id });
        }
      }
      
      // Re-fetch all categories and events to get the latest database state
      await fetchCategories(false);
      await fetchEvents();
      
      setIsFormOpen(false);
      setName('');
      setSelectedEventId('');
      setEditId(null);
    } catch (err) {
      console.error(err);
      alert('Error saving category. The name might already exist.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="crud-panel">
      <div className="panel-header">
        <div className="panel-title-area">
          <h2>Manage Categories</h2>
          <p>Group and categorize your events</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary">
          <span>➕</span> Add Category
        </button>
      </div>

      {/* Search and stats bar */}
      <div className="panel-actions-row">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="total-badge">
          Total Categories: {filteredCategories.length}
        </div>
      </div>

      {/* Form Card (conditional inline layout) */}
      {isFormOpen && (
        <div className="form-card-overlay">
          <div className="form-card">
            <h3>{editId ? 'Edit Category' : 'Create New Category'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name</label>
                <select
                  value={isCustomCategory ? 'custom' : (presetCategories.includes(name) ? name : '')}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'custom') {
                      setIsCustomCategory(true);
                      setName('');
                    } else {
                      setIsCustomCategory(false);
                      setName(val);
                    }
                  }}
                  className="form-input form-select"
                  disabled={submitting}
                  required
                >
                  <option value="">-- Choose category to Link (Optional) --</option>
                  {presetCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="custom">-- Custom (Add your own) --</option>
                </select>

                {isCustomCategory && (
                  <input
                    type="text"
                    placeholder="Type custom category name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    style={{ marginTop: '10px' }}
                    required
                    disabled={submitting}
                  />
                )}
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
                      {evt.title} {evt.category ? `(${evt.category.name})` : '(Uncategorized)'}
                    </option>
                  ))}
                </select>
              </div>

              {editId && (
                (() => {
                  const currentCat = categories.find(c => c.id === editId);
                  const linkedEvents = currentCat ? (currentCat.events || []) : [];
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
                                  title="Remove event from this category"
                                >
                                  ❌ Remove
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

      {/* Content */}
      {error && <div className="panel-error-alert">{error}</div>}

      {loading ? (
        <div className="panel-loading">
          <div className="loading-spinner"></div>
          <p>Loading categories...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="panel-empty-state">
          <p>No categories found. Click 'Add Category' to get started!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="recent-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Linked Events</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat, index) => (
                <tr key={cat.id}>
                  <td>#{index + 1}</td>
                  <td className="event-cell">🏷️ {cat.name}</td>
                   <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className="badge-count" style={{ width: 'fit-content' }}>
                        {cat.events ? cat.events.length : 0} events
                      </span>
                      {cat.events && cat.events.length > 0 && (
                        <div className="linked-events-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                          {cat.events.map(event => (
                            <span key={event.id} style={{ fontSize: '0.75rem', color: '#475569', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                              🗓️ {event.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="btn-action-edit"
                      title="Edit Category"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="btn-action-delete"
                      title="Delete Category"
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
