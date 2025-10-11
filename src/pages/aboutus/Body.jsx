import OfficialCard from './OfficialCard';

const officials = [
  { name: 'Rodrigo Santos', role: 'Barangay Captain' },
  { name: 'Elena Martinez', role: 'Kagawad - Health' },
  { name: 'Carlos Reyes', role: 'Kagawad - Education' },
  { name: 'Sofia Dela Cruz', role: 'Kagawad - Infrastructure' },
  { name: 'Miguel Torres', role: 'SK Chairman' },
  { name: 'Rosa Villanueva', role: 'Barangay Secretary' },
  { name: 'Pedro Garcia', role: 'Barangay Treasurer' },
];

const BarangayOfficials = () => {
  return (
    <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-6 shadow-lg">
          <span className="text-5xl">👥</span>
        </div>
        <h2 className="text-5xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent mb-4">
          Barangay Officials
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Meet the dedicated leaders serving our community with passion and integrity
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {officials.map((official, index) => (
          <OfficialCard key={index} official={official} />
        ))}
      </div>
    </div>
  );
};

export default BarangayOfficials;
