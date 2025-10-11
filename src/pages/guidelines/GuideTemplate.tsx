import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Clock, FileText, CheckCircle } from 'lucide-react';

interface GuideStep {
  id: number;
  title: string;
  description: string;
  requirements?: string[];
  notes?: string;
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
  tips
}) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Breadcrumb */}
      <div className="bg-white py-4 px-6 border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600 transition-colors">🏠 Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/guidelines" className="hover:text-green-600 transition-colors">📖 How to Guides</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-green-700 font-semibold">{title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-6">
        {/* Back Button */}
        <Link 
          to="/guidelines" 
          className="inline-flex items-center text-green-700 hover:text-green-800 mb-8 font-semibold hover:-translate-x-1 transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Guidelines
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-10 border-2 border-gray-100">
          <div className="flex items-start gap-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-lg">
              <IconComponent className="w-10 h-10 text-green-700" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">{description}</p>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{estimatedTime}</span>
                </div>
                <span className={`px-5 py-2 rounded-lg text-sm font-bold shadow-sm ${getDifficultyColor(difficulty)}`}>
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
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-10 mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-md">
                  <FileText className="w-7 h-7 text-green-700" />
                </div>
                Requirements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-4 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium leading-relaxed">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-10 mb-10 text-white">
              <h2 className="text-4xl font-bold mb-3">Step-by-Step Guide</h2>
              <p className="text-green-100 text-lg">Follow these steps in order to complete your application</p>
            </div>

            {/* Individual Step Cards */}
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={step.id} className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-10 hover:shadow-2xl transition-shadow duration-300">
                  {/* Step Content with Inline Number */}
                  <div className="flex items-start gap-6">
                    {/* Step Number Badge */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-green-700 text-white flex items-center justify-center font-bold text-lg shadow-lg min-w-[48px] min-h-[48px] aspect-square flex-shrink-0">
                      {index + 1}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                      <p className="text-gray-700 text-lg mb-6 leading-relaxed">{step.description}</p>
                      
                      {/* Step Requirements */}
                      {step.requirements && step.requirements.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 rounded-r-xl p-6 mb-6 shadow-md">
                          <p className="text-base font-bold text-blue-900 mb-4 flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0">!</span>
                            Required for this step:
                          </p>
                          <ul className="space-y-3">
                            {step.requirements.map((req, reqIndex) => (
                              <li key={reqIndex} className="flex items-start gap-3 text-base text-blue-900">
                                <span className="text-blue-600 font-bold mt-1 flex-shrink-0">•</span>
                                <span className="leading-relaxed font-medium">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Step Notes */}
                      {step.notes && (
                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-600 rounded-r-xl p-6 shadow-md">
                          <p className="text-base font-bold text-yellow-900 mb-3 flex items-center gap-3">
                            <span className="text-2xl flex-shrink-0">💡</span>
                            Important Note:
                          </p>
                          <p className="text-base text-yellow-900 leading-relaxed ml-1 font-medium">{step.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Helpful Tips - Moved to Bottom */}
            {tips && tips.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-10 mt-10">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                  <span className="text-3xl">💡</span>
                  Helpful Tips
                </h3>
                <ul className="space-y-5">
                  {tips.map((tip, index) => (
                    <li key={index} className="text-base text-gray-800 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-600 py-5 px-6 rounded-r-xl shadow-md hover:shadow-lg transition-shadow duration-300">
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