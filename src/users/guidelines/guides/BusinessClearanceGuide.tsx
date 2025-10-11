import React from 'react';
import GuideTemplate from '../../../users/page/GuideTemplate';
import { Building2 } from 'lucide-react';

const BusinessClearanceGuide: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Prepare Business Documents",
      description: "Gather all required business documents and personal identification.",
      requirements: [
        "Valid government-issued ID of business owner",
        "DTI Certificate (for sole proprietorship) or SEC Certificate (for corporation)",
        "Barangay clearance of business owner",
        "Location clearance or lease contract",
        "Building permit (if applicable)",
        "Fire safety inspection certificate"
      ],
      notes: "Ensure all business registrations are up to date and valid."
    },
    {
      id: 2,
      title: "Business Location Inspection",
      description: "Request for a preliminary inspection of your business location.",
      notes: "Schedule an appointment with barangay officials for location assessment."
    },
    {
      id: 3,
      title: "Submit Application Form",
      description: "Complete and submit the business clearance application form.",
      requirements: [
        "Business name and nature of business",
        "Complete business address",
        "Business owner's information",
        "Number of employees (if applicable)"
      ],
      notes: "Provide accurate information matching your business registration documents."
    },
    {
      id: 4,
      title: "Document Review and Verification",
      description: "Barangay staff will review all submitted documents and verify business details.",
      notes: "They may contact DTI or SEC to verify business registration authenticity."
    },
    {
      id: 5,
      title: "Site Inspection",
      description: "Barangay officials will conduct a formal inspection of the business premises.",
      requirements: [
        "Business owner or representative must be present",
        "All safety measures in place",
        "Compliance with zoning regulations"
      ],
      notes: "Ensure the business location is ready and compliant with all regulations."
    },
    {
      id: 6,
      title: "Pay Processing Fee",
      description: "Pay the required fee based on the nature and size of your business.",
      requirements: [
        "Small business (1-5 employees): ₱200.00",
        "Medium business (6-20 employees): ₱500.00",
        "Large business (21+ employees): ₱1,000.00"
      ],
      notes: "Fee may vary depending on the type of business and local ordinances."
    },
    {
      id: 7,
      title: "Approval and Release",
      description: "Once approved, your business clearance will be prepared and released.",
      notes: "Processing typically takes 3-5 business days after successful inspection."
    },
    {
      id: 8,
      title: "Claim Your Business Clearance",
      description: "Return to claim your approved barangay business clearance.",
      requirements: [
        "Official receipt",
        "Valid ID of business owner"
      ],
      notes: "Business clearance is typically valid for 1 year and must be renewed annually."
    }
  ];

  const requirements = [
    "Valid ID of business owner",
    "DTI Certificate (sole proprietorship) or SEC Certificate (corporation)",
    "Barangay clearance of business owner",
    "Location clearance or lease contract",
    "Building permit (if required)",
    "Fire safety inspection certificate",
    "Processing fee (₱200-₱1,000 depending on business size)"
  ];

  const tips = [
    "Complete all business registrations before applying",
    "Ensure your business location complies with zoning laws",
    "Have safety measures and permits ready for inspection",
    "Keep all certificates and clearances updated",
    "Consult with barangay staff about specific requirements for your business type",
    "Renew your clearance before expiration to avoid penalties"
  ];

  return (
    <GuideTemplate
      title="Business Clearance"
      description="A Barangay Business Clearance is required for all businesses operating within the barangay jurisdiction, certifying compliance with local regulations and ordinances."
      icon={Building2}
      estimatedTime="3-7 days"
      difficulty="Medium"
      steps={steps}
      requirements={requirements}
      tips={tips}
    />
  );
};

export default BusinessClearanceGuide;