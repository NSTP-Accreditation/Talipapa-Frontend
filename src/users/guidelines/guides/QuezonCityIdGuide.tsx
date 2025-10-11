import React from 'react';
import GuideTemplate from '../../../users/page/GuideTemplate';
import { IdCard } from 'lucide-react';

const QuezonCityIdGuide: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Prepare Required Documents",
      description: "Gather all necessary documents for QC ID application.",
      requirements: [
        "Proof of Quezon City residency",
        "Valid government-issued ID",
        "Barangay certificate or clearance"
      ],
      notes: "QC ID applications are processed at designated QC offices. The barangay can provide supporting documents."
    }
  ];

  const requirements = [
    "Proof of Quezon City residency",
    "Valid government-issued ID",
    "Barangay certificate",
    "Application fee (amount varies)"
  ];

  const tips = [
    "Visit Quezon City Hall or satellite offices",
    "Get barangay certificate first",
    "Check QC government website for updates"
  ];

  return (
    <GuideTemplate
      title="Quezon City ID"
      description="Official identification card for Quezon City residents. The barangay provides supporting documents for the application."
      icon={IdCard}
      estimatedTime="Varies"
      difficulty="Medium"
      steps={steps}
      requirements={requirements}
      tips={tips}
    />
  );
};

export default QuezonCityIdGuide;