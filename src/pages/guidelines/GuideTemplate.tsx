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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white py-3 px-6 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center text-sm text-gray-700">
            <Link to="/" className="hover:underline hover:text-[#0c2716]">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/guidelines" className="hover:underline hover:text-[#0c2716]">How to Guides</Link>
            <span className="mx-2">/</span>
            <span className="text-[#0c2716] font-medium">{title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Back Button */}
        <Link 
          to="/guidelines" 
          className="inline-flex items-center text-green-700 hover:text-green-800 mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Guidelines
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-start gap-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <IconComponent className="w-8 h-8 text-green-700" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              <p className="text-gray-600 text-lg mb-4">{description}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-4 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{estimatedTime}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
                  {difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Requirements Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-6">
                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                Requirements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-6 p-5 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium leading-relaxed">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-sm p-8 mb-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Step-by-Step Guide</h2>
              <p className="text-green-100">Follow these steps in order to complete your application</p>
            </div>

            {/* Individual Step Cards */}
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={step.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mt-6">
                  {/* Step Content with Inline Number */}
                  <div className="flex items-start gap-6">
                    {/* Step Number Badge */}
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm shadow-lg min-w-[40px] min-h-[40px] aspect-square flex-shrink-0">
                      {index + 1}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-700 text-lg mb-6 leading-relaxed">{step.description}</p>
                      
                      {/* Step Requirements */}
                      {step.requirements && step.requirements.length > 0 && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-5 mb-4 shadow-sm">
                          <p className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0">!</span>
                            Required for this step:
                          </p>
                          <ul className="space-y-2">
                            {step.requirements.map((req, reqIndex) => (
                              <li key={reqIndex} className="flex items-start gap-2 text-sm text-blue-900">
                                <span className="text-blue-600 font-bold mt-1 flex-shrink-0">•</span>
                                <span className="leading-relaxed">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Step Notes */}
                      {step.notes && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg p-5 shadow-sm">
                          <p className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                            <span className="text-lg flex-shrink-0">💡</span>
                            Important Note:
                          </p>
                          <p className="text-sm text-yellow-900 leading-relaxed ml-1">{step.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Separator Line (except for last step) */}
                  {index < steps.length - 1 && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                      <div className="w-8 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tips Card */}
            {tips && tips.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  Helpful Tips
                </h3>
                <ul className="space-y-3">
                  {tips.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-800 bg-green-50 border-l-4 border-green-500 py-3 px-4 rounded-r-lg shadow-sm">
                      <span className="leading-relaxed">{tip}</span>
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