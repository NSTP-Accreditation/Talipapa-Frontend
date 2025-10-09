import React from 'react';
import GuideTemplate from '../GuideTemplate';
import { IdCard } from 'lucide-react';

const PhilsysIdGuide: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Prepare Required Documents",
      description: "Gather all necessary documents for PhilSys ID application.",
      requirements: [
        "Birth certificate",
        "Valid ID or supporting documents",
        "Proof of address"
      ],
      notes: "PhilSys ID registration is handled by PSA. The barangay may assist with scheduling or information."
    }
  ];

  const requirements = [
    "Birth certificate (NSO/PSA issued)",
    "Supporting documents for identity verification", 
    "Proof of current address"
  ];

  const tips = [
    "Visit the PSA office or authorized registration center",
    "The barangay can provide assistance with scheduling",
    "Check PSA website for complete requirements"
  ];

  return (
    <GuideTemplate
      title="PhilSys ID (National ID)"
      description="The Philippine Identification System (PhilSys) ID is the official national ID. The barangay can assist with information and scheduling."
      icon={IdCard}
      estimatedTime="Varies"
      difficulty="Medium"
      steps={steps}
      requirements={requirements}
      tips={tips}
    />
  );
};

export default PhilsysIdGuide;