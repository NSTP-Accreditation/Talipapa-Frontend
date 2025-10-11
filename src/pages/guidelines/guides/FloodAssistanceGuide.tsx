import React from 'react';
import GuideTemplate from '../GuideTemplate';
import { Waves } from 'lucide-react';

const FloodAssistanceGuide: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Document the Damage",
      description: "Take photos and videos of the flood damage to your property and belongings.",
      requirements: [
        "Photos of damaged areas (interior and exterior)",
        "Videos showing the extent of flooding",
        "List of damaged items with estimated values",
        "Receipts or proof of ownership (if available)"
      ],
      notes: "Document everything as soon as possible after the flood for accurate assessment."
    },
    {
      id: 2,
      title: "Visit the Barangay Office",
      description: "Go to your barangay office to report the flood damage and inquire about assistance programs.",
      notes: "Bring all documentation of damage. Office hours are Monday to Friday, 8:00 AM to 5:00 PM."
    },
    {
      id: 3,
      title: "Fill Out Assistance Application Form",
      description: "Complete the flood assistance application form with detailed information about the damage.",
      requirements: [
        "Personal information (name, address, contact number)",
        "Description of flood damage",
        "Estimated cost of damages",
        "Number of affected household members",
        "Type of assistance needed (financial, materials, temporary shelter)"
      ],
      notes: "Be honest and accurate in your application. False claims may disqualify you from assistance."
    },
    {
      id: 4,
      title: "Submit Required Documents",
      description: "Submit your completed application along with supporting documents and evidence of damage.",
      requirements: [
        "Valid ID",
        "Barangay Certificate or proof of residency",
        "Photos/videos of flood damage",
        "List of damaged items",
        "Certificate of Indigency (if applicable)",
        "Proof of property ownership or lease agreement"
      ],
      notes: "Keep copies of all submitted documents for your records."
    },
    {
      id: 5,
      title: "Barangay Assessment and Validation",
      description: "Wait for barangay officials to conduct an ocular inspection and validate your claim.",
      notes: "Assessment team will visit your property within 3-7 days. Be available to accommodate the inspection."
    },
    {
      id: 6,
      title: "Receive Assistance",
      description: "Once approved, receive your flood assistance through the barangay or designated distribution center.",
      requirements: [
        "Valid ID",
        "Application reference number",
        "Signed acknowledgment receipt"
      ],
      notes: "Assistance may include cash aid, relief goods, construction materials, or temporary shelter. Processing time is typically 1-4 weeks."
    }
  ];

  const requirements = [
    "Valid government-issued ID",
    "Barangay Certificate or proof of residency",
    "Photo/video documentation of flood damage",
    "List of damaged property and items with estimated values",
    "Proof of property ownership or lease agreement",
    "Certificate of Indigency (for financial assistance)"
  ];

  const tips = [
    "Apply as soon as possible after the flood event",
    "Keep all receipts related to emergency repairs and expenses",
    "Document everything - more evidence strengthens your application",
    "Check with DSWD and local government for additional assistance programs",
    "Join barangay emergency preparedness programs for future disasters",
    "Consider getting flood insurance for future protection"
  ];

  return (
    <GuideTemplate
      title="Flood Assistance"
      description="Flood assistance provides support to residents affected by flooding, including financial aid, relief goods, construction materials, and temporary shelter. This guide helps you navigate the process of applying for flood-related assistance from your barangay."
      icon={Waves}
      estimatedTime="1-4 weeks"
      difficulty="Medium"
      steps={steps}
      requirements={requirements}
      tips={tips}
    />
  );
};

export default FloodAssistanceGuide;
