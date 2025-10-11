import React from 'react';
import GuideTemplate from '../GuideTemplate';
import { CircleSlash } from 'lucide-react';

const RestrictedAreaPassGuide: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Determine Your Need and Eligibility",
      description: "Identify the restricted area you need to access and verify if you qualify for a pass.",
      requirements: [
        "Valid reason for access (residence, work, delivery, essential service)",
        "Proof of relationship to the restricted area",
        "Identification documents"
      ],
      notes: "Restricted area passes are typically issued during emergencies, disasters, construction projects, or for secured facilities."
    },
    {
      id: 2,
      title: "Prepare Required Documents",
      description: "Gather all necessary documents to prove your identity and need for access.",
      requirements: [
        "Valid government-issued ID",
        "Barangay Certificate or proof of residency (if resident)",
        "Employment certificate (if for work purposes)",
        "Company ID or authorization letter (for employees/contractors)",
        "2 pieces of 1x1 ID pictures",
        "Supporting documents specific to your reason for access"
      ],
      notes: "Requirements may vary depending on the type of restricted area and issuing authority."
    },
    {
      id: 3,
      title: "Visit the Issuing Authority",
      description: "Go to the appropriate office that issues passes for the specific restricted area.",
      notes: "This could be the barangay office, security office, project management office, or local government unit. Call ahead to confirm requirements and schedules."
    },
    {
      id: 4,
      title: "Fill Out Application Form",
      description: "Complete the restricted area pass application form with accurate information.",
      requirements: [
        "Personal information (full name, address, contact number)",
        "Purpose of entry to restricted area",
        "Duration of pass needed",
        "Vehicle details (if applicable)",
        "Emergency contact information"
      ],
      notes: "Provide truthful information. False declarations may result in denial or revocation of the pass."
    },
    {
      id: 5,
      title: "Submit Documents and Undergo Verification",
      description: "Submit your application and documents for verification and background checking.",
      notes: "Security personnel may conduct interviews or additional verification. Processing time varies from same-day to 3-5 business days depending on security level."
    },
    {
      id: 6,
      title: "Pay Processing Fees (if applicable)",
      description: "Pay any required fees for the restricted area pass.",
      requirements: [
        "Processing fee: ₱0 - ₱200.00 (many are free for residents)",
        "ID card production fee: ₱50.00 - ₱100.00 (if laminated ID is issued)"
      ],
      notes: "Emergency/disaster-related passes are typically free. Commercial and construction-related passes may have fees."
    },
    {
      id: 7,
      title: "Claim Your Restricted Area Pass",
      description: "Return to claim your approved restricted area pass and receive instructions for use.",
      requirements: [
        "Official receipt (if fees were paid)",
        "Valid ID for verification",
        "Application reference number"
      ],
      notes: "Read and understand all terms and conditions. Keep your pass visible at all times when in the restricted area. Report lost passes immediately."
    }
  ];

  const requirements = [
    "Valid government-issued ID (Driver's License, SSS ID, PhilHealth ID, etc.)",
    "Proof of residency or employment in/near the restricted area",
    "Barangay Certificate or Clearance",
    "Authorization letter from employer/company (if applicable)",
    "Company ID (for employees/contractors)",
    "2 pieces of 1x1 ID pictures",
    "Vehicle registration (if requesting vehicle access)"
  ];

  const tips = [
    "Apply early - don't wait until you urgently need access",
    "Keep your pass in a safe, easily accessible place",
    "Always carry a valid ID along with your restricted area pass",
    "Respect all security protocols and checkpoints",
    "Report lost or stolen passes immediately to prevent misuse",
    "Be aware of the pass validity period and renew before expiration",
    "Follow all rules and regulations specific to the restricted area"
  ];

  return (
    <GuideTemplate
      title="Restricted Area Pass"
      description="A restricted area pass grants authorized individuals access to areas with limited entry due to security concerns, emergency situations, ongoing construction, or special events. This document ensures only approved persons can enter and move within designated restricted zones."
      icon={CircleSlash}
      estimatedTime="Same day to 5 business days"
      difficulty="Medium"
      steps={steps}
      requirements={requirements}
      tips={tips}
    />
  );
};

export default RestrictedAreaPassGuide;
