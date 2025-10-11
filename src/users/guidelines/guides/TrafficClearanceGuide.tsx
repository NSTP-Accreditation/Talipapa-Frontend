import React from 'react';
import GuideTemplate from '../../../users/page/GuideTemplate';
import { TrafficCone } from 'lucide-react';

const TrafficClearanceGuide: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Prepare Required Documents",
      description: "Gather all necessary documents for traffic clearance application.",
      requirements: [
        "Valid driver's license",
        "Vehicle registration (OR/CR)",
        "Barangay clearance",
        "Valid ID"
      ],
      notes: "This guide is currently under development. Please visit the barangay office for specific requirements."
    }
  ];

  const requirements = [
    "Valid driver's license",
    "Vehicle registration documents",
    "Barangay clearance",
    "Processing fee (amount to be confirmed)"
  ];

  const tips = [
    "Contact the barangay office for specific requirements",
    "This service may vary by location",
    "Check local traffic regulations"
  ];

  return (
    <GuideTemplate
      title="Traffic Clearance"
      description="Traffic clearance certification for vehicle-related matters. This guide is currently being updated with specific local requirements."
      icon={TrafficCone}
      estimatedTime="To be confirmed"
      difficulty="Medium"
      steps={steps}
      requirements={requirements}
      tips={tips}
    />
  );
};

export default TrafficClearanceGuide;