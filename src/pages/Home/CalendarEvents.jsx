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
    <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex-1 pr-4 group-hover:text-green-700 transition-colors">
            {event.title}
          </h3>
          <span className={`px-4 py-2 rounded-xl text-xs font-bold border-2 shadow-sm ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center text-gray-700 text-sm font-medium bg-gray-50 p-3 rounded-lg">
            <CalendarIcon className="mr-3 text-green-600" size={18} />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-700 text-sm font-medium bg-gray-50 p-3 rounded-lg">
            <Clock className="mr-3 text-blue-600" size={18} />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center text-gray-700 text-sm font-medium bg-gray-50 p-3 rounded-lg">
            <MapPin className="mr-3 text-red-600" size={18} />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center text-gray-700 text-sm font-medium bg-gray-50 p-3 rounded-lg">
            <Users className="mr-3 text-purple-600" size={18} />
            <span>Expected: {event.attendees} attendees</span>
          </div>
        </div>
        
        <p className="text-gray-700 text-base leading-relaxed">
          {event.description}
        </p>
      </div>
    </div>
  );
};

export default function CalendarEvents() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-6 shadow-lg">
            <span className="text-5xl">📅</span>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent mb-6">
            Upcoming Events
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            Stay updated with the latest events and activities in Barangay Talipapa. 
            Join us in building a stronger and more connected community.
          </p>
        </header>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-10 max-w-2xl mx-auto shadow-xl">
            <div className="inline-block p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-4">
              <span className="text-3xl">📞</span>
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              Want to stay updated?
            </h3>
            <p className="text-gray-700 text-base mb-6 leading-relaxed">
              Follow our official social media pages or visit the barangay hall for more information about upcoming events and activities.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-base">
              <span className="flex items-center text-green-700 font-semibold bg-white px-4 py-2 rounded-lg shadow-sm">
                <CalendarIcon className="mr-2" size={18} />
                Visit Barangay Hall
              </span>
              <span className="text-green-600 font-bold">•</span>
              <span className="text-green-700 font-semibold bg-white px-4 py-2 rounded-lg shadow-sm">
                📞 Call: (02) 8123-4567
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}