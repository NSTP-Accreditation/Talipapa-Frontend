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
      <h2 className="text-2xl font-bold text-green-600 mb-8 text-center">
        Barangay Officials
      </h2>

      <div className="flex flex-wrap justify-center gap-6">
        {officials.map((official, index) => (
          <OfficialCard key={index} official={official} />
        ))}
      </div>
    </div>
  );
};

export default BarangayOfficials;
