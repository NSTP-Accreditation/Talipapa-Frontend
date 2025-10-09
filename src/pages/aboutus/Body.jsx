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
    <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-[70px] w-full shadow-sm">
      <h2 className="text-[30px] font-semibold text-green-600 mb-6 pt-[20px] pb-[50px] text-center">
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
