import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import { ResponsiveSkeleton } from '../../../components/ResponsiveSkeleton';
import { Calendar as CalendarIcon } from 'lucide-react';
import useFetchData from '../../hooks/useFetchData';
import { useToast } from '@/hooks/useToast';
import { useAuthFetch } from '../../hooks/useAuthFetch';
import dayjs from 'dayjs';
import EventModal from './EventModal';
import DeleteModal from './DeleteModal';
import { CalendarEvent } from './types';
import { getCategoryColor, getPriorityIcon } from './utils';

const News: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const {
    data: newsData,
    loading: newsLoading,
    error: newsError,
    refetch: refetchNews,
  } = useFetchData('/news');

  const { error } = useToast();
  const authFetch = useAuthFetch();

  useEffect(() => {
    if (!newsData || newsLoading || newsError) return;
    if (!Array.isArray(newsData)) return;

    const mapped: CalendarEvent[] = newsData.map((n: unknown) => {
      const news = n as Record<string, unknown>;
      return {
        id:
          (news._id as string) || (news.id as string) || Date.now().toString(),
        title: (news.title as string) || '',
        description: (news.description as string) || '',
        dateTime:
          (news.dateTime as string) ||
          (news.createdAt as string) ||
          new Date().toISOString(),
        location: (news.location as string) || '',
        category:
          (news.category as CalendarEvent['category']) || 'Announcement',
        priority: (news.priority as CalendarEvent['priority']) || 'Medium',
        createdAt: (news.createdAt as string) || new Date().toISOString(),
      };
    });

    setEvents(mapped);
  }, [newsData, newsLoading, newsError]);

  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (newsLoading) {
    return <ResponsiveSkeleton page="news" />;
  }

  const handleSaveEvent = async (event: CalendarEvent) => {
    try {
      if (event.id && events.find((e) => e.id === event.id)) {
        const body = {
          title: event.title,
          description: event.description,
          dateTime: event.dateTime,
          location: event.location,
          category: event.category,
          priority: event.priority,
        };
        const remote = Array.isArray(newsData)
          ? newsData.find((n: unknown) => {
              const news = n as Record<string, unknown>;
              return news._id === event.id || news.id === event.id;
            })
          : null;
        const remoteItem = remote as Record<string, unknown> | null;
        const id = remoteItem?._id || event.id;
        await authFetch(`/news/${id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
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

      refetchNews();

      setEditingEvent(null);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Save event failed', err);
      error('Failed to save event', { title: 'Save failed' });
    }
  };

  const handleDeleteEvent = async () => {
    if (!deletingEvent) return;
    try {
      const remote = Array.isArray(newsData)
        ? newsData.find((n: unknown) => {
            const news = n as Record<string, unknown>;
            return (
              news._id === deletingEvent.id || news.id === deletingEvent.id
            );
          })
        : null;
      const remoteItem = remote as Record<string, unknown> | null;
      const id = remoteItem?._id || deletingEvent.id;
      await authFetch(`/news/${id}`, { method: 'DELETE' });
      refetchNews();
      setDeletingEvent(null);
    } catch (err) {
      console.error('Delete failed', err);
      error('Failed to delete event', { title: 'Delete failed' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-600 rounded-full -ml-24 -mb-24"></div>
          </div>

          <div className="relative p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-lg ring-4 ring-green-100 animate-pulse-slow">
                  <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    Calendar Events & News
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 font-medium">
                    Manage barangay calendar events, announcements and news
                    <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold">
                      {events.length} {events.length === 1 ? 'Event' : 'Events'}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap"
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
                <span>Add New Event</span>
              </button>
            </div>
          </div>
        </div>

        <Card className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
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
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-5">
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
                      className={`relative p-4 sm:p-6 border-l-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 ${getCategoryColor(
                        event.category
                      )} group`}
                    >
                      {index < events.length - 1 && (
                        <div className="absolute left-[-2px] top-full h-2.5 sm:h-5 w-1 bg-gradient-to-b from-gray-300 to-transparent"></div>
                      )}

                      <div className="flex justify-between items-start gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                            <span className="text-base sm:text-2xl">
                              {getPriorityIcon(event.priority)}
                            </span>
                            <h4 className="font-bold text-sm sm:text-lg text-gray-900 group-hover:text-blue-600 transition-colors flex-1 min-w-0 break-words">
                              {event.title}
                            </h4>
                            <span
                              className={`text-[9px] px-1 py-0.5 leading-none sm:text-xs sm:px-3 sm:py-1.5 rounded-full font-bold whitespace-nowrap ${
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

                          <p className="text-xs sm:text-sm text-gray-700 mb-2.5 sm:mb-4 leading-relaxed font-medium break-words">
                            {event.description}
                          </p>

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
                              <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg border border-gray-200 shadow-sm min-w-0">
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
                                <span className="font-bold text-gray-900 break-words overflow-hidden">
                                  {event.location}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={() => setEditingEvent(event)}
                            className="p-2 sm:p-2.5 bg-white hover:bg-green-50 text-green-600 border-2 border-green-300 hover:border-green-500 rounded-lg sm:rounded-xl transition-all hover:shadow-md"
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
                <div className="text-center py-6 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-dashed border-gray-300">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-14 h-14 sm:w-24 sm:h-24 rounded-full mx-auto flex items-center justify-center mb-3.5 sm:mb-6">
                    <svg
                      className="h-7 w-7 sm:h-12 sm:w-12 text-blue-600"
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
                  <p className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                    No events found
                  </p>
                  <p className="text-xs sm:text-base font-medium text-gray-600 mb-3.5 sm:mb-6 px-4">
                    Get started by creating your first calendar event or
                    announcement.
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-5 sm:px-8 py-2.5 sm:py-4 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-bold mx-auto shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
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
    </div>
  );
};

export default News;
