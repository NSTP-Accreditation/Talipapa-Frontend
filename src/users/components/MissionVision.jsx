import {
  CheckCircle,
  Eye,
  Target,
  Leaf,
  Heart,
  Award,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/utils/translations';

export default function MissionVision() {
  const { t } = useLanguage();
  return (
    <section className="bg-gradient-to-br from-green-50 to-white py-20 px-6 flex flex-col items-center">
      {/* Header */}
      <header className="max-w-3xl text-center mb-16">
        <div className="inline-block p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-6 shadow-lg">
          <span className="text-5xl">🎯</span>
        </div>
        <h2 className="text-5xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent mb-6">
          {t(translations.missionVision.title)}
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          {t(translations.missionVision.subtitle)}
        </p>
      </header>

      {/* Mission & Vision Cards */}
      <div className="grid md:grid-cols-2 gap-12 max-w-5xl w-full mb-16">
        {/* Mission */}
        <div className="bg-white border-2 border-green-100 shadow-xl rounded-2xl p-10 flex flex-col items-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Target className="text-green-700" size={48} />
            </div>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              {t(translations.missionVision.missionTitle)}
            </h3>
            <p className="text-gray-700 text-base leading-relaxed text-justify">
              {t(translations.missionVision.missionText)}
            </p>
          </div>
        </div>

        {/* Vision */}
        <div className="bg-white border-2 border-green-100 shadow-xl rounded-2xl p-10 flex flex-col items-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Eye className="text-blue-700" size={48} />
            </div>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              {t(translations.missionVision.visionTitle)}
            </h3>
            <p className="text-gray-700 text-base leading-relaxed text-justify">
              {t(translations.missionVision.visionText)}
            </p>
          </div>
        </div>
      </div>
      {/* Core Values */}
      <div className="max-w-6xl w-full">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl py-16 px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center text-white shadow-2xl">
          <div className="flex flex-col items-center justify-center group hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
              <Leaf size={32} />
            </div>
            <h4 className="font-bold text-xl mb-2">{t(translations.missionVision.values.sustainability.title)}</h4>
            <p className="text-sm text-green-100">
              {t(translations.missionVision.values.sustainability.desc)}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center group hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
              <Heart size={32} />
            </div>
            <h4 className="font-bold text-xl mb-2">{t(translations.missionVision.values.compassion.title)}</h4>
            <p className="text-sm text-green-100">{t(translations.missionVision.values.compassion.desc)}</p>
          </div>
          <div className="flex flex-col items-center justify-center group hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
              <Award size={32} />
            </div>
            <h4 className="font-bold text-xl mb-2">{t(translations.missionVision.values.excellence.title)}</h4>
            <p className="text-sm text-green-100">
              {t(translations.missionVision.values.excellence.desc)}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center group hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
              <ShieldCheck size={32} />
            </div>
            <h4 className="font-bold text-xl mb-2">{t(translations.missionVision.values.transparency.title)}</h4>
            <p className="text-sm text-green-100">{t(translations.missionVision.values.transparency.desc)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
