import AboutBarangay from './Above';
import BarangayOfficials from './Body';
import BarangayMap from './BarangayMap';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AboutBarangay />
      
      {/* Consistent container for officials and map */}
      <div className="flex justify-center p-6">
        <div className="w-[1024px] flex-none space-y-6">
          <BarangayOfficials />
          <BarangayMap />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
