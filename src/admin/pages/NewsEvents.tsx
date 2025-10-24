import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../components/ui/card';
import { NewsEventsPageSkeleton } from '../../components/LoadingSkeletons';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  AlertCircle,
  X,
  Plus,
  SquarePen,
  Trash2,
} from 'lucide-react';
import useFetchData from '../hooks/useFetchData';
import { useToast } from '@/hooks/useToast';
import { useAuthFetch } from '../hooks/useAuthFetch';
import dayjs from 'dayjs';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  dateTime: string;
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
    dateTime: event?.dateTime || '',
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
        dateTime: '',
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

    if (!formData.dateTime) {
      errors.push('Date is required');
    }

    if (errors.length > 0) {
      const { error: showError } = useToast();
      showError(
        'Please fix the following errors:\n\n• ' + errors.join('\n• '),
        { title: 'Validation' }
      );
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-[95vw] sm:max-w-[650px] w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="relative p-4 sm:p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/10 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
          <div className="relative flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-2xl flex items-center justify-center ring-2 ring-white/30 flex-shrink-0">
                {event?.id ? (
                  <SquarePen className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                ) : (
                  <Plus className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-0.5 sm:mb-1 truncate">
                  {event?.id ? 'Edit Calendar Event' : 'Add New Calendar Event'}
                </h3>
                <p className="text-green-100 text-xs sm:text-sm font-medium truncate">
                  {event?.id
                    ? 'Update event details'
                    : 'Create a new calendar event'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 ring-1 ring-white/30 flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-5 md:py-6 max-h-[calc(95vh-160px)] sm:max-h-[calc(90vh-200px)] overflow-y-auto space-y-3 sm:space-y-5 md:space-y-6">
          {/* Event Information Section */}
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 pb-1.5 sm:pb-3 border-b-2 border-green-100">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                <Calendar className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
              </div>
              <h4 className="text-base sm:text-xl font-bold text-gray-900">
                Event Information
              </h4>
            </div>

            <div className="space-y-2.5 sm:space-y-4">
              <div className="flex flex-col">
                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
                  <SquarePen className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-2.5 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
                  placeholder="e.g., Community Clean-up Drive"
                />
              </div>

              <div className="flex flex-col">
                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
                  <SquarePen className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-2.5 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none resize-none text-gray-900 font-medium text-sm sm:text-base"
                  placeholder="Provide details about the event..."
                />
              </div>
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 pb-1.5 sm:pb-3 border-b-2 border-green-100">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                <Clock className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
              </div>
              <h4 className="text-base sm:text-xl font-bold text-gray-900">
                Schedule
              </h4>
            </div>

            <div className="flex flex-col">
              <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                Date and Time<span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) =>
                  setFormData({ ...formData, dateTime: e.target.value })
                }
                className="w-full px-2.5 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col">
              <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-2.5 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
                placeholder="e.g., Barangay Hall"
              />
            </div>
          </div>

          {/* Category & Priority Section */}
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 pb-1.5 sm:pb-3 border-b-2 border-green-100">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                <Tag className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
              </div>
              <h4 className="text-base sm:text-xl font-bold text-gray-900">
                Classification
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <div className="flex flex-col">
                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
                  <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
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
                  className="w-full px-2.5 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none bg-white cursor-pointer text-gray-900 font-medium text-sm sm:text-base"
                >
                  <option value="Announcement">Announcement</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Event">Event</option>
                  <option value="Notice">Notice</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
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
                  className="w-full px-2.5 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none bg-white cursor-pointer text-gray-900 font-medium text-sm sm:text-base"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-green-800 font-medium">
                <span className="font-bold">Note:</span> Fields marked with{' '}
                <span className="text-red-500 font-bold">*</span> are required.
                Please ensure all information is accurate before submitting.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-5 bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-100 flex gap-2 sm:gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
          >
            {event?.id ? (
              <>
                <SquarePen className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                <span>Update</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                <span>Create</span>
              </>
            )}
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-[95vw] sm:max-w-[520px] w-full overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 px-4 sm:px-8 py-4 sm:py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
          <div className="relative flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-2xl flex items-center justify-center ring-2 ring-white/30 flex-shrink-0">
                <AlertCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-0.5 sm:mb-1">
                  Delete Event
                </h3>
                <p className="text-red-100 text-xs sm:text-sm font-medium">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 ring-1 ring-white/30 flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-5 md:py-6 space-y-2.5 sm:space-y-4">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Are you sure you want to delete the event{' '}
            <strong className="text-gray-900">"{event.title}"</strong>?
          </p>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5 space-y-1.5 sm:space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              Event Details:
            </h4>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm text-gray-700 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                <span className="font-bold min-w-[70px] sm:min-w-[90px]">
                  Description:
                </span>
                <span className="break-words">{event.description}</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-700 flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold min-w-[70px] sm:min-w-[90px]">
                  Date:
                </span>
                <span>{event.dateTime}</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-700 flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold min-w-[70px] sm:min-w-[90px]">
                  Time:
                </span>
                <span>{event.dateTime}</span>
              </p>
              {event.location && (
                <p className="text-xs sm:text-sm text-gray-700 flex items-center gap-1.5 sm:gap-2">
                  <span className="font-bold min-w-[70px] sm:min-w-[90px]">
                    Location:
                  </span>
                  <span>{event.location}</span>
                </p>
              )}
              <p className="text-xs sm:text-sm text-gray-700 flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold min-w-[70px] sm:min-w-[90px]">
                  Category:
                </span>
                <span>{event.category}</span>
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg sm:rounded-xl p-2.5 sm:p-4 flex items-start gap-1.5 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-700 font-medium leading-relaxed">
              Warning: This will permanently remove this event from the
              calendar. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-5 bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-100 flex gap-2 sm:gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            <span>Delete Event</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const News: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const {
    data: newsData,
    loading: newsLoading,
    error: newsError,
    refetch: refetchNews,
  } = useFetchData('/news');

  // map remote news shape -> CalendarEvent
  useEffect(() => {
    if (!newsData || newsLoading || newsError) return;
    if (!Array.isArray(newsData)) return;

    const mapped: CalendarEvent[] = newsData.map((n: any) => ({
      id: n._id || n.id || Date.now().toString(),
      title: n.title || '',
      description: n.description || '',
      dateTime: n.dateTime || n.createdAt || new Date().toISOString(),
      location: n.location || '',
      category: (n.category as CalendarEvent['category']) || 'Announcement',
      priority: (n.priority as CalendarEvent['priority']) || 'Medium',
      createdAt: n.createdAt || new Date().toISOString(),
    }));

    setEvents(mapped);
  }, [newsData, newsLoading, newsError]);

  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const authFetch = useAuthFetch();

  // Show loading skeleton while loading
  if (newsLoading) {
    return <NewsEventsPageSkeleton />;
  }

  const handleSaveEvent = async (event: CalendarEvent) => {
    try {
      // If id exists in events, treat as update
      if (event.id && events.find((e) => e.id === event.id)) {
        // Update via API
        const body = {
          title: event.title,
          description: event.description,
          dateTime: event.dateTime,
          location: event.location,
          category: event.category,
          priority: event.priority,
        };
        // local id -> remote _id mapping: attempt to find matching item in newsData
        const remote = newsData?.find(
          (n: any) => n._id === event.id || n.id === event.id
        );
        const id = remote?._id || event.id;
        await authFetch(`/news/${id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        // Create via API
        const body = {
          title: event.title,
          description: event.description,
          dateTime: event.dateTime,
          location: event.location,
          category: event.category,
          priority: event.priority,
        };
        await authFetch('/news', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Refresh remote data
      refetchNews();

      setEditingEvent(null);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Save event failed', err);
      const { error } = useToast();
      error('Failed to save event', { title: 'Save failed' });
    }
  };

  const handleDeleteEvent = async () => {
    if (!deletingEvent) return;
    try {
      const remote = newsData?.find(
        (n: any) => n._id === deletingEvent.id || n.id === deletingEvent.id
      );
      const id = remote?._id || deletingEvent.id;
      await authFetch(`/news/${id}`, { method: 'DELETE' });
      refetchNews();
      setDeletingEvent(null);
    } catch (err) {
      console.error('Delete failed', err);
      const { error } = useToast();
      error('Failed to delete event', { title: 'Delete failed' });
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

  return (
    <div className="p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <Calendar className="w-6 h-6 sm:w-10 sm:h-10 text-green-600" />
            <span className="leading-tight">Calendar Events & News</span>
          </h1>
          <p className="text-sm sm:text-lg text-gray-700 mt-2 sm:mt-3 font-medium">
            Manage barangay calendar events, announcements and news
            <span className="ml-2 sm:ml-3 px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold">
              {events.length} {events.length === 1 ? 'Event' : 'Events'}
            </span>
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg sm:rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-1.5 sm:gap-2 justify-center sm:justify-start"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
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
          <span className="whitespace-nowrap">Add New Event</span>
        </button>
      </div>

      {/* Enhanced Content with Timeline View */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b-2 border-green-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
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
                <span className="leading-tight">
                  Recent Calendar Events & News
                </span>
              </CardTitle>
              {events.length > 0 && (
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  Showing all {events.length} events
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="space-y-3 sm:space-y-5">
              {events.length > 0 ? (
                events
                  .sort(
                    (a, b) =>
                      new Date(b.dateTime).getTime() -
                      new Date(a.dateTime).getTime()
                  )
                  .map((event, index) => (
                    <div
                      key={event.id}
                      className={`relative p-3 sm:p-6 border-l-4 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${getCategoryColor(
                        event.category
                      )} group`}
                    >
                      {/* Timeline connector (except for last item) */}
                      {index < events.length - 1 && (
                        <div className="absolute left-[-2px] top-full h-3 sm:h-5 w-1 bg-gradient-to-b from-gray-300 to-transparent"></div>
                      )}

                      <div className="flex justify-between items-start gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Header with priority and category */}
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                            <span className="text-lg sm:text-2xl">
                              {getPriorityIcon(event.priority)}
                            </span>
                            <h4 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-blue-600 transition-colors flex-1 min-w-0 break-words">
                              {event.title}
                            </h4>
                            <span
                              className={`text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold whitespace-nowrap ${
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
                              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-red-100 text-center text-red-700 text-xs font-bold rounded-full border border-red-300 whitespace-nowrap">
                                HIGH PRIORITY
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 leading-relaxed font-medium break-words">
                            {event.description}
                          </p>

                          {/* Enhanced Event Details */}
                          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg border border-gray-200 shadow-sm">
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0"
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
                              <span className="font-bold text-gray-900 truncate">
                                {dayjs(event.dateTime).format('MMM D, YYYY')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg border border-gray-200 shadow-sm">
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0"
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
                              <span className="font-bold text-gray-900 truncate">
                                {dayjs(event.dateTime).format('hh:mm A')}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg border border-gray-200 shadow-sm">
                                <svg
                                  className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0"
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
                                <span className="font-bold text-gray-900 truncate">
                                  {event.location}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-1.5 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={() => setEditingEvent(event)}
                            className="p-2 sm:p-2.5 bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-300 hover:border-blue-500 rounded-lg sm:rounded-xl transition-all hover:shadow-md"
                            title="Edit Event"
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
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
                            className="p-2 sm:p-2.5 bg-white hover:bg-red-50 text-red-600 border-2 border-red-300 hover:border-red-500 rounded-lg sm:rounded-xl transition-all hover:shadow-md"
                            title="Delete Event"
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
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
                <div className="text-center py-8 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-dashed border-gray-300">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 sm:w-24 sm:h-24 rounded-full mx-auto flex items-center justify-center mb-4 sm:mb-6">
                    <svg
                      className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600"
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
                  <p className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                    No events found
                  </p>
                  <p className="text-sm sm:text-base font-medium text-gray-600 mb-4 sm:mb-6 px-4">
                    Get started by creating your first calendar event or
                    announcement.
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-bold mx-auto shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
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
