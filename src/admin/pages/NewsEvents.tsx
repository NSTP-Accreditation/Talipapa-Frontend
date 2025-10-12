import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../components/ui/card';

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
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-[9999] flex items-center justify-center p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-[600px] w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {event?.id ? 'Edit Calendar Event' : 'Add New Calendar Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div className="px-6 py-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="flex flex-col gap-5">
            {/* Basic Information */}
            <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                Event Information
              </h3>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="e.g., Community Clean-up Drive"
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="Provide details about the event..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="e.g., Barangay Hall"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as CalendarEvent['category'],
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Event">Event</option>
                    <option value="Notice">Notice</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as CalendarEvent['priority'],
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all hover:-translate-y-0.5"
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
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-[9999] flex items-center justify-center p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-[480px] w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-red-600 mb-1">
                Delete Event
              </h2>
              <p className="text-sm text-gray-600">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-base text-gray-700 mb-4 leading-relaxed">
            Are you sure you want to delete the event{' '}
            <strong>"{event.title}"</strong>?
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Event Details:
            </h4>
            <p className="text-sm text-gray-600 mb-1 last:mb-0">
              <strong>Description:</strong> {event.description}
            </p>
            <p className="text-sm text-gray-600 mb-1 last:mb-0">
              <strong>Date:</strong> {event.date}
            </p>
            <p className="text-sm text-gray-600 mb-1 last:mb-0">
              <strong>Time:</strong> {event.time}
            </p>
            {event.location && (
              <p className="text-sm text-gray-600 mb-1 last:mb-0">
                <strong>Location:</strong> {event.location}
              </p>
            )}
            <p className="text-sm text-gray-600 mb-1 last:mb-0">
              <strong>Category:</strong> {event.category}
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-red-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-red-600 font-medium">
                Warning: This will permanently remove this event from the
                calendar.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all hover:-translate-y-0.5"
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
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(
    null
  );
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
        return 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150';
      case 'Announcement':
        return 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-150';
      case 'Notice':
        return 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-150';
      case 'Meeting':
        return 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-150';
      default:
        return 'border-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150';
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
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-4xl">📅</span>
            Calendar Events & News
          </h1>
          <p className="text-lg text-gray-700 mt-3 font-medium">
            Manage barangay calendar events, announcements and news
            <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {events.length} {events.length === 1 ? 'Event' : 'Events'}
            </span>
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Event
        </button>
      </div>

      {/* Enhanced Content with Timeline View */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b-2 border-green-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Recent Calendar Events & News
              </CardTitle>
              {events.length > 0 && (
                <span className="text-sm text-gray-600 font-medium">
                  Showing all {events.length} events
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {events.length > 0 ? (
                events
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((event, index) => (
                    <div
                      key={event.id}
                      className={`relative p-6 border-l-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${getCategoryColor(
                        event.category
                      )} group`}
                    >
                      {/* Timeline connector (except for last item) */}
                      {index < events.length - 1 && (
                        <div className="absolute left-[-2px] top-full h-5 w-1 bg-gradient-to-b from-gray-300 to-transparent"></div>
                      )}

                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          {/* Header with priority and category */}
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">
                              {getPriorityIcon(event.priority)}
                            </span>
                            <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                              {event.title}
                            </h4>
                            <span
                              className={`text-xs px-3 py-1.5 rounded-full font-bold ${
                                event.category === 'Event'
                                  ? 'bg-blue-600 text-white'
                                  : event.category === 'Announcement'
                                    ? 'bg-green-600 text-white'
                                    : event.category === 'Notice'
                                      ? 'bg-yellow-600 text-white'
                                      : 'bg-purple-600 text-white'
                              }`}
                            >
                              {event.category}
                            </span>
                            {event.priority === 'High' && (
                              <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-300">
                                HIGH PRIORITY
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed font-medium">
                            {event.description}
                          </p>

                          {/* Enhanced Event Details */}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                              <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="font-bold text-gray-900">
                                {formatDate(event.date)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                              <svg
                                className="w-5 h-5 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="font-bold text-gray-900">
                                {formatTime(event.time)}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                                <svg
                                  className="w-5 h-5 text-red-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                <span className="font-bold text-gray-900">
                                  {event.location}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => setEditingEvent(event)}
                            className="p-2.5 bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-300 hover:border-blue-500 rounded-xl transition-all hover:shadow-md"
                            title="Edit Event"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeletingEvent(event)}
                            className="p-2.5 bg-white hover:bg-red-50 text-red-600 border-2 border-red-300 hover:border-red-500 rounded-xl transition-all hover:shadow-md"
                            title="Delete Event"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6">
                    <svg
                      className="h-12 w-12 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-xl font-bold text-gray-900 mb-2">
                    No events found
                  </p>
                  <p className="text-base font-medium text-gray-600 mb-6">
                    Get started by creating your first calendar event or
                    announcement.
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl flex items-center gap-3 text-base font-bold mx-auto shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create Your First Event
                  </button>
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
