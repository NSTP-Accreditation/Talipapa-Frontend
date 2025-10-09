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
      <div className="bg-white py-4 px-6 border-b">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/guidelines" className="hover:underline">How to Guides</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{title}</span>
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
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <IconComponent className="w-8 h-8 text-green-700" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              <p className="text-gray-600 text-lg mb-4">{description}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-500">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Requirements
              </h2>
              <ul className="space-y-2">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Step-by-Step Guide</h2>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-700 mb-3">{step.description}</p>
                      
                      {step.requirements && step.requirements.length > 0 && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-3">
                          <p className="text-sm font-medium text-blue-800 mb-1">Required:</p>
                          <ul className="text-sm text-blue-700 space-y-1">
                            {step.requirements.map((req, reqIndex) => (
                              <li key={reqIndex} className="flex items-start gap-1">
                                <span className="text-blue-600">•</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {step.notes && (
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800 mb-1">Note:</p>
                          <p className="text-sm text-yellow-700">{step.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Tips */}
            {tips && tips.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Helpful Tips</h3>
                <ul className="space-y-3">
                  {tips.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm text-green-800">
                <p>
                  <span className="font-medium">Barangay Office Hours:</span><br />
                  Monday - Friday: 8:00 AM - 5:00 PM
                </p>
                <p>
                  <span className="font-medium">Contact:</span><br />
                  (02) 123-4567<br />
                  barangay@sanisidro.gov.ph
                </p>
                <p>
                  <span className="font-medium">Address:</span><br />
                  Barangay San Isidro<br />
                  Quezon City, Metro Manila
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideTemplate;