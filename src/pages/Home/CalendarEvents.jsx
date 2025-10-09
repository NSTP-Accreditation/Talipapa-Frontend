import { Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';

// Sample events data for Barangay Talipapa
const upcomingEvents = [
  {
    id: 1,
    title: 'Community Clean-up Drive',
    date: '2025-10-15',
    time: '7:00 AM',
    location: 'Talipapa Public Market',
    description: 'Join us for our monthly community clean-up drive to keep our barangay clean and beautiful.',
    category: 'Environment',
    attendees: 50,
  },
  {
    id: 2,
    title: 'Health and Wellness Seminar',
    date: '2025-10-20',
    time: '2:00 PM',
    location: 'Barangay Hall Conference Room',
    description: 'Learn about preventive healthcare and wellness tips from our health professionals.',
    category: 'Health',
    attendees: 30,
  },
  {
    id: 3,
    title: 'Skills Training Workshop',
    date: '2025-10-25',
    time: '9:00 AM',
    location: 'Multi-purpose Hall',
    description: 'Free skills training workshop on digital literacy and entrepreneurship for residents.',
    category: 'Education',
    attendees: 40,
  },
  {
    id: 4,
    title: 'Barangay Assembly Meeting',
    date: '2025-11-02',
    time: '6:00 PM',
    location: 'Barangay Hall',
    description: 'Monthly barangay assembly to discuss community issues and upcoming projects.',
    category: 'Government',
    attendees: 100,
  },
  {
    id: 5,
    title: 'Youth Sports Festival',
    date: '2025-11-10',
    time: '8:00 AM',
    location: 'Barangay Basketball Court',
    description: 'Annual sports festival for the youth featuring basketball, volleyball, and other games.',
    category: 'Sports',
    attendees: 200,
  },
];

const getCategoryColor = (category) => {
  const colors = {
    Environment: 'bg-green-100 text-green-800 border-green-200',
    Health: 'bg-blue-100 text-blue-800 border-blue-200',
    Education: 'bg-purple-100 text-purple-800 border-purple-200',
    Government: 'bg-red-100 text-red-800 border-red-200',
    Sports: 'bg-orange-100 text-orange-800 border-orange-200',
  };
  return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

const EventCard = ({ event }) => {
  return (
    <div className="bg-white border border-green-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex-1 pr-4">
          {event.title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.category)}`}>
          {event.category}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-600 text-sm">
          <CalendarIcon className="mr-2" size={16} />
          <span>{formatDate(event.date)}</span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm">
          <Clock className="mr-2" size={16} />
          <span>{event.time}</span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="mr-2" size={16} />
          <span>{event.location}</span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm">
          <Users className="mr-2" size={16} />
          <span>Expected: {event.attendees} attendees</span>
        </div>
      </div>
      
      <p className="text-gray-700 text-sm leading-relaxed">
        {event.description}
      </p>
    </div>
  );
};

export default function CalendarEvents() {
  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h2 className="text-[32px] font-black text-gray-800 mb-4">
            Upcoming Events
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-2xl mx-auto">
            Stay updated with the latest events and activities in Barangay Talipapa. 
            Join us in building a stronger and more connected community.
          </p>
        </header>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Want to stay updated?
            </h3>
            <p className="text-green-700 text-sm mb-4">
              Follow our official social media pages or visit the barangay hall for more information about upcoming events and activities.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="flex items-center text-green-700">
                <CalendarIcon className="mr-1" size={14} />
                Visit Barangay Hall
              </span>
              <span className="text-green-600">•</span>
              <span className="text-green-700">Call: (02) 8123-4567</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}