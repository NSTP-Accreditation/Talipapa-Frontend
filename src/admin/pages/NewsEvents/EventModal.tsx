import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  AlertCircle,
  X,
  Plus,
  SquarePen,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { CalendarEvent, EventModalProps } from './types';

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

  const { error: showError } = useToast();

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
    const errors: string[] = [];

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

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-[95vw] sm:max-w-[650px] w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="relative p-3 sm:p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-12 sm:-mr-32 -mt-12 sm:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-48 sm:h-48 bg-white/10 rounded-full -ml-10 sm:-ml-24 -mb-10 sm:-mb-24"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
          <div className="relative flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <div className="w-9 h-9 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-2xl flex items-center justify-center ring-2 ring-white/30 flex-shrink-0">
                {event?.id ? (
                  <SquarePen className="w-4.5 h-4.5 sm:w-7 sm:h-7 text-white" />
                ) : (
                  <Plus className="w-4.5 h-4.5 sm:w-7 sm:h-7 text-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-2xl md:text-3xl font-bold text-white mb-0.5 sm:mb-1 truncate">
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
              className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 ring-1 ring-white/30 flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-2.5 sm:px-6 md:px-8 py-2.5 sm:py-5 md:py-6 max-h-[calc(95vh-160px)] sm:max-h-[calc(90vh-200px)] overflow-y-auto space-y-2.5 sm:space-y-5 md:space-y-6">
          {/* Event Information Section */}
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 pb-1.5 sm:pb-3 border-b-2 border-green-100">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                <Calendar className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
              </div>
              <h4 className="text-sm sm:text-xl font-bold text-gray-900">
                Event Information
              </h4>
            </div>

            <div className="space-y-2 sm:space-y-4">
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
                  className="w-full px-2 sm:px-4 py-1.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
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
                  className="w-full px-2 sm:px-4 py-1.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none resize-none text-gray-900 font-medium text-sm sm:text-base"
                  placeholder="Provide details about the event..."
                />
              </div>
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 pb-1.5 sm:pb-3 border-b-2 border-green-100">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                <Clock className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
              </div>
              <h4 className="text-sm sm:text-xl font-bold text-gray-900">
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
                className="w-full px-2 sm:px-4 py-1.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
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
                className="w-full px-2 sm:px-4 py-1.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
                placeholder="e.g., Barangay Hall"
              />
            </div>
          </div>

          {/* Category & Priority Section */}
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 pb-1.5 sm:pb-3 border-b-2 border-green-100">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                <Tag className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
              </div>
              <h4 className="text-sm sm:text-xl font-bold text-gray-900">
                Classification
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
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
                  className="w-full px-2 sm:px-4 py-1.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none bg-white cursor-pointer text-gray-900 font-medium text-sm sm:text-base"
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
                  className="w-full px-2 sm:px-4 py-1.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none bg-white cursor-pointer text-gray-900 font-medium text-sm sm:text-base"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-2.5 sm:p-4 flex items-start gap-2 sm:gap-3">
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
        <div className="px-2.5 sm:px-6 md:px-8 py-2.5 sm:py-5 bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-100 flex gap-2 sm:gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3.5 sm:px-8 py-1.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
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
    </div>,
    document.body
  );
};

export default EventModal;
