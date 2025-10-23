import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Clock,
  FileText,
  CheckCircle,
  Home,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useLoadingState } from '../../hooks/useLoadingState';
import { GuideTemplateSkeleton } from '../../components/LoadingSkeletons';

// interface GuideStep {
//   id: number;
//   title: string;
//   description: string;
//   requirements?: string[];
//   notes?: string;
// }

interface GuideStep {
  stepNumber: number;
  title: string;
  description: string;
  location: string;
  requiredDocuments: string[];
  estimatedTime: string;
  tips: string[];
  _id: string;
}

interface GuideTemplateProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  steps: GuideStep[];
  requirements: string[];
  tips?: string[];
}

const GuideTemplate: React.FC<GuideTemplateProps> = ({
  title,
  description,
  icon: IconComponent,
  estimatedTime,
  difficulty,
  steps,
  requirements,
  tips,
}) => {
  // Add loading state with 1 second display
  const { isLoading } = useLoadingState(1000);

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Easy':
        return 'text-green-600 bg-green-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Show loading skeleton while loading
  if (isLoading) {
    return <GuideTemplateSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Breadcrumb - Seamless with Navbar */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-t border-green-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm flex-wrap">
            <Link
              to="/"
              className="flex items-center gap-1 sm:gap-1.5 text-green-100 hover:text-white transition-colors group"
            >
              <Home className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            <Link
              to="/guidelines"
              className="flex items-center gap-1 sm:gap-1.5 text-green-100 hover:text-white transition-colors group"
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">Guides</span>
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            <span className="text-white font-semibold truncate max-w-[120px] sm:max-w-xs text-xs sm:text-sm">
              {title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-6 sm:py-8 lg:py-10 px-4 sm:px-6">
        {/* Back Button */}
        <Link
          to="/guidelines"
          className="inline-flex items-center text-green-700 hover:text-green-800 mb-6 sm:mb-8 font-semibold hover:-translate-x-1 transition-all duration-300 text-sm sm:text-base active:scale-95"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
          Back to Guidelines
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8 lg:mb-10 border-2 border-gray-100">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 lg:gap-8">
            <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-lg flex-shrink-0">
              <IconComponent className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-green-700" />
            </div>
            <div className="flex-1 w-full">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                {title}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed">
                {description}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="font-medium">{estimatedTime}</span>
                </div>
                <span
                  className={`px-3 sm:px-4 lg:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-sm ${getDifficultyColor(difficulty)}`}
                >
                  {difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div>
            {/* Requirements Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border-2 border-gray-100 p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8 lg:mb-10">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-md">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-green-700" />
                </div>
                Requirements
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                {requirements?.map((requirement, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300"
                  >
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium leading-relaxed text-sm sm:text-base">
                      {requirement}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8 lg:mb-10 text-white">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
                Step-by-Step Guide
              </h2>
              <p className="text-green-100 text-sm sm:text-base lg:text-lg">
                Follow these steps in order to complete your application
              </p>
            </div>

            {/* Individual Step Cards */}
            <div className="space-y-6 sm:space-y-8">
              {steps?.map((step, index) => (
                <div
                  key={step._id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-xl border-2 border-gray-100 p-6 sm:p-8 lg:p-10 hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Step Content with Inline Number */}
                  <div className="flex items-start gap-4 sm:gap-6">
                    {/* Step Number Badge */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-600 to-green-700 text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-lg min-w-[40px] min-h-[40px] sm:min-w-[48px] sm:min-h-[48px] aspect-square flex-shrink-0">
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-gray-700 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Step Requirements */}
                      {step.requiredDocuments &&
                        step.requiredDocuments.length > 0 && (
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 rounded-r-lg sm:rounded-r-xl p-4 sm:p-5 lg:p-6 mb-4 sm:mb-6 shadow-md">
                            <p className="text-sm sm:text-base font-bold text-blue-900 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
                                !
                              </span>
                              Required for this step:
                            </p>
                            <ul className="space-y-2 sm:space-y-3">
                              {step.requiredDocuments?.map((req, reqIndex) => (
                                <li
                                  key={reqIndex}
                                  className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-blue-900"
                                >
                                  <span className="text-blue-600 font-bold mt-1 flex-shrink-0">
                                    •
                                  </span>
                                  <span className="leading-relaxed font-medium">
                                    {req}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Step Notes */}
                      {/* {step.notes && (
                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-600 rounded-r-xl p-6 shadow-md">
                          <p className="text-base font-bold text-yellow-900 mb-3 flex items-center gap-3">
                            <span className="text-2xl flex-shrink-0">💡</span>
                            Important Note:
                          </p>
                          <p className="text-base text-yellow-900 leading-relaxed ml-1 font-medium">
                            {step.notes}
                          </p>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Helpful Tips - Moved to Bottom */}
            {tips && tips.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border-2 border-gray-100 p-6 sm:p-8 lg:p-10 mt-6 sm:mt-8 lg:mt-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
                  <span className="text-2xl sm:text-3xl">💡</span>
                  Helpful Tips
                </h3>
                <ul className="space-y-3 sm:space-y-4 lg:space-y-5">
                  {tips?.map((tip, index) => (
                    <li
                      key={index}
                      className="text-sm sm:text-base text-gray-800 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-600 py-4 sm:py-5 px-4 sm:px-5 lg:px-6 rounded-r-lg sm:rounded-r-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <span className="leading-relaxed font-medium">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideTemplate;
