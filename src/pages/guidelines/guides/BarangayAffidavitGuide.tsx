import React from 'react';
import GuideTemplate from '../GuideTemplate';
import { ScrollText } from 'lucide-react';

const BarangayAffidavitGuide: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Prepare Required Documents",
      description: "Gather all necessary documents for barangay affidavit processing.",
      requirements: [
        "Valid government-issued ID",
        "Barangay clearance",
        "Supporting documents related to the affidavit purpose"
      ],
      notes: "This guide is currently under development. Please visit the barangay office for specific requirements."
    }
  ];

  const requirements = [
    "Valid government-issued ID",
    "Barangay clearance",
    "Supporting documents",
    "Processing fee (amount to be confirmed)"
  ];

  const tips = [
    "Contact the barangay office for specific requirements",
    "Prepare all relevant supporting documents",
    "Consult with barangay officials about the affidavit content"
  ];

  return (
    <GuideTemplate
      title="Barangay Affidavit"
      description="Official sworn statement processed at the barangay level. This guide is currently being updated with specific local requirements."
      icon={ScrollText}
      estimatedTime="To be confirmed"
      difficulty="Medium"
      steps={steps}
      requirements={requirements}
      tips={tips}
    />
  );
};

export default BarangayAffidavitGuide;