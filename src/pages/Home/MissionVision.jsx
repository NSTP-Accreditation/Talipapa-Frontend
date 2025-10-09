import {
  CheckCircle,
  Eye,
  Target,
  Leaf,
  Heart,
  Award,
  ShieldCheck,
} from 'lucide-react';
export default function MissionVision() {
  return (
    <section className="bg-green-50 py-12 px-6 flex flex-col items-center">
      {/* Header */}
      <header className="max-w-2xl text-center mb-12">
        <h2 className="text-[32px] font-black text-gray-800">
          Our Mission & Vision
        </h2>
        <br />
        <p className="mt-3 text-gray-600 text-base leading-relaxed">
          Guided by our commitment to sustainable development and community
          welfare, we strive to build a better future for all residents of
          Barangay Talipapa.
        </p>
      </header>

      {/* Mission & Vision Cards */}
      <div className="grid md:grid-cols-2 gap-[100px] max-w-5xl w-[1000px]">
        {/* Mission */}
        <div className="border border-green-200 shadow-md rounded-lg bg-white p-8 flex flex-col items-center max-w-sm mx-auto">
          <Target className="text-green-600 mb-6" size={40} />{' '}
          {/* increased spacing */}
          <h3 className="text-lg font-semibold mb-4 text-center pb-[5px]">
            Our Mission
          </h3>
          <p className="text-gray-900 text-m mb-4 leading-relaxed text-justify">
            To provide efficient, transparent, and sustainable governance that
            promotes the welfare of all residents while preserving our
            environment for future generations.
          </p>
        </div>

        {/* Vision */}
        <div className="border border-green-200 shadow-md rounded-lg bg-white p-8 flex flex-col items-center max-w-sm mx-auto">
          <Eye className="text-green-600 mb-6" size={40} />{' '}
          {/* increased spacing */}
          <h3 className="text-lg font-semibold mb-4 text-center  pb-[5px]">
            Our Vision
          </h3>
          <p className="text-gray-600 text-base mb-4 leading-relaxed text-justify">
            To be a model eco-friendly barangay that exemplifies sustainable
            living, where every resident enjoys a high quality of life in
            harmony with nature.
          </p>
        </div>
      </div>
      {/* Core Values */}
      <div className="max-w-5xl w-[1200px] mt-[50px] mx-auto">
        <div className="bg-green-600 rounded-xl py-16 px-10 grid grid-cols-4 gap-10 text-center text-white">
          <div className="flex flex-col items-center justify-center">
            <Leaf className="mb-4" size={25} />
            <h4 className="font-semibold text-lg">Sustainability</h4>
            <p className="text-sm opacity-90 mt-1">
              Protecting our environment
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Heart className="mb-4" size={25} />
            <h4 className="font-semibold text-lg">Compassion</h4>
            <p className="text-sm opacity-90 mt-1">Caring for our community</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Award className="mb-4" size={25} />
            <h4 className="font-semibold text-lg">Excellence</h4>
            <p className="text-sm opacity-90 mt-1">
              Quality services with integrity
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <ShieldCheck className="mb-4" size={25} />
            <h4 className="font-semibold text-lg">Transparency</h4>
            <p className="text-sm opacity-90 mt-1">Open and accountable</p>
          </div>
        </div>
      </div>
    </section>
  );
}
