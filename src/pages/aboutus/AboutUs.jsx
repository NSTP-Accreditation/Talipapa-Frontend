import AboutBarangay from './Above';
import BarangayOfficials from './Body';
import BarangayMap from './BarangayMap';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AboutBarangay />
      
      {/* Consistent container for officials and map */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <BarangayOfficials />
          <BarangayMap />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
