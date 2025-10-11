import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import './css/Guidelines.css';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  category: 'Announcement' | 'Meeting' | 'Event' | 'Notice';
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
}

interface EventModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
}

interface DeleteModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
  event,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<CalendarEvent>({
    id: event?.id || '',
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || '',
    time: event?.time || '',
    location: event?.location || '',
    category: event?.category || 'Announcement',
    priority: event?.priority || 'Medium',
    createdAt: event?.createdAt || new Date().toISOString(),
  });

  React.useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      const newEvent = {
        id: '',
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'Announcement' as const,
        priority: 'Medium' as const,
        createdAt: new Date().toISOString(),
      };
      setFormData(newEvent);
    }
  }, [event]);

  const handleSave = () => {
    // Validation
    const errors = [];

    if (!formData.title.trim()) {
      errors.push('Title is required');
    }

    if (!formData.description.trim()) {
      errors.push('Description is required');
    }

    if (!formData.date) {
      errors.push('Date is required');
    }

    if (!formData.time) {
      errors.push('Time is required');
    }

    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n• ' + errors.join('\n• '));
      return;
    }

    const updatedEvent = {
      ...formData,
      id: formData.id || Date.now().toString(),
      createdAt: formData.createdAt || new Date().toISOString(),
    };

    onSave(updatedEvent);
  };

  if (!isOpen) return null;

  return (
    <div
      className="guidelines-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="guidelines-modal-content">
        {/* Header */}
        <div className="guidelines-modal-header">
          <h2 className="guidelines-modal-title">
            {event?.id ? 'Edit Calendar Event' : 'Add New Calendar Event'}
          </h2>
          <button onClick={onClose} className="guidelines-modal-close-btn">
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div className="guidelines-modal-body">
          <div className="guidelines-form-container">
            {/* Basic Information */}
            <div className="guidelines-section">
              <h3 className="guidelines-section-title">Event Information</h3>

              <div className="guidelines-form-group">
                <label className="guidelines-form-label">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="guidelines-form-input"
                  placeholder="e.g., Community Clean-up Drive"
                />
              </div>

              <div className="guidelines-form-group">
                <label className="guidelines-form-label">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="guidelines-form-textarea"
                  placeholder="Provide details about the event..."
                />
              </div>

              <div className="guidelines-form-row">
                <div className="guidelines-form-group">
                  <label className="guidelines-form-label">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="guidelines-form-input"
                  />
                </div>

                <div className="guidelines-form-group">
                  <label className="guidelines-form-label">Time *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="guidelines-form-input"
                  />
                </div>
              </div>

              <div className="guidelines-form-group">
                <label className="guidelines-form-label">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="guidelines-form-input"
                  placeholder="e.g., Barangay Hall"
                />
              </div>

              <div className="guidelines-form-row">
                <div className="guidelines-form-group">
                  <label className="guidelines-form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as CalendarEvent['category'],
                      })
                    }
                    className="guidelines-form-select"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Event">Event</option>
                    <option value="Notice">Notice</option>
                  </select>
                </div>

                <div className="guidelines-form-group">
                  <label className="guidelines-form-label">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as CalendarEvent['priority'],
                      })
                    }
                    className="guidelines-form-select"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="guidelines-modal-footer">
          <button
            onClick={onClose}
            className="guidelines-btn guidelines-btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="guidelines-btn guidelines-btn-primary"
          >
            {event?.id ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  event,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div
      className="guidelines-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="guidelines-delete-modal">
        {/* Header */}
        <div className="guidelines-delete-header">
          <div className="guidelines-delete-header-content">
            <div className="guidelines-delete-icon">
              <svg
                className="guidelines-delete-icon-svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h2 className="guidelines-delete-title">Delete Event</h2>
              <p className="guidelines-delete-subtitle">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="guidelines-delete-body">
          <p className="guidelines-delete-message">
            Are you sure you want to delete the event{' '}
            <strong>"{event.title}"</strong>?
          </p>

          <div className="guidelines-delete-details">
            <h4 className="guidelines-delete-details-title">Event Details:</h4>
            <p className="guidelines-delete-detail">
              <strong>Description:</strong> {event.description}
            </p>
            <p className="guidelines-delete-detail">
              <strong>Date:</strong> {event.date}
            </p>
            <p className="guidelines-delete-detail">
              <strong>Time:</strong> {event.time}
            </p>
            {event.location && (
              <p className="guidelines-delete-detail">
                <strong>Location:</strong> {event.location}
              </p>
            )}
            <p className="guidelines-delete-detail">
              <strong>Category:</strong> {event.category}
            </p>
          </div>

          <div className="guidelines-delete-warning">
            <div className="guidelines-delete-warning-content">
              <svg
                className="guidelines-delete-warning-icon"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="guidelines-delete-warning-text">
                Warning: This will permanently remove this event from the
                calendar.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="guidelines-modal-footer">
          <button
            onClick={onClose}
            className="guidelines-btn guidelines-btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="guidelines-btn guidelines-btn-danger"
          >
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
};

const News: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Community Clean-up Drive',
      description:
        'Join us this Saturday for our monthly community clean-up drive. Meet at the barangay hall at 7:00 AM.',
      date: '2025-10-12',
      time: '07:00',
      location: 'Barangay Hall',
      category: 'Event',
      priority: 'High',
      createdAt: '2025-10-08T10:00:00.000Z',
    },
    {
      id: '2',
      title: 'Eco-Cycle Trading Program Launch',
      description:
        'Our new recycling rewards program is now live! Trade your recyclables for points and redeem rewards at participating local stores.',
      date: '2025-10-05',
      time: '09:00',
      location: 'Community Center',
      category: 'Announcement',
      priority: 'Medium',
      createdAt: '2025-10-05T09:00:00.000Z',
    },
    {
      id: '3',
      title: 'Water Service Interruption Notice',
      description:
        'Water service will be temporarily interrupted for maintenance work.',
      date: '2025-10-10',
      time: '09:00',
      location: '',
      category: 'Notice',
      priority: 'High',
      createdAt: '2025-10-07T08:00:00.000Z',
    },
  ]);

  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSaveEvent = (event: CalendarEvent) => {
    if (event.id && events.find((e) => e.id === event.id)) {
      // Update existing event
      setEvents(events.map((e) => (e.id === event.id ? event : e)));
    } else {
      // Add new event
      const newEvent = {
        ...event,
        id: Date.now().toString(),
      };
      setEvents([newEvent, ...events]);
    }
    setEditingEvent(null);
    setIsAddModalOpen(false);
  };

  const handleDeleteEvent = () => {
    if (deletingEvent) {
      setEvents(events.filter((e) => e.id !== deletingEvent.id));
      setDeletingEvent(null);
    }
  };

  const getCategoryColor = (category: CalendarEvent['category']) => {
    switch (category) {
      case 'Event':
        return 'border-blue-500 bg-blue-50';
      case 'Announcement':
        return 'border-green-500 bg-green-50';
      case 'Notice':
        return 'border-yellow-500 bg-yellow-50';
      case 'Meeting':
        return 'border-purple-500 bg-purple-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: CalendarEvent['priority']) => {
    switch (priority) {
      case 'High':
        return '🔴';
      case 'Medium':
        return '🟡';
      case 'Low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-4xl"></span>
            Calendar Events & News
          </h1>
          <p className="text-lg text-gray-700 mt-3 font-medium">
            Manage barangay calendar events, announcements and news
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="guidelines-btn guidelines-btn-primary"
        >
          Add New Event
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Calendar Events & News</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {events.length > 0 ? (
                events
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((event) => (
                    <div
                      key={event.id}
                      className={`p-6 border-l-4 rounded-lg shadow-sm ${getCategoryColor(
                        event.category
                      )} mb-4`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">
                              {getPriorityIcon(event.priority)}
                            </span>
                            <h4 className="font-medium">{event.title}</h4>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                              {event.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {event.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-700 font-medium">
                            <span>📅 {formatDate(event.date)}</span>
                            <span>🕐 {formatTime(event.time)}</span>
                            {event.location && <span>📍 {event.location}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => setEditingEvent(event)}
                            className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded"
                            title="Edit Event"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => setDeletingEvent(event)}
                            className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded"
                            title="Delete Event"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-700">
                  <p className="text-lg font-bold">No events found.</p>
                  <p className="text-base font-medium">Click "Add New Event" to create your first event.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <EventModal
        event={editingEvent}
        isOpen={!!editingEvent || isAddModalOpen}
        onClose={() => {
          setEditingEvent(null);
          setIsAddModalOpen(false);
        }}
        onSave={handleSaveEvent}
      />

      <DeleteModal
        event={deletingEvent}
        isOpen={!!deletingEvent}
        onClose={() => setDeletingEvent(null)}
        onConfirm={handleDeleteEvent}
      />
    </div>
  );
};

export default News;
