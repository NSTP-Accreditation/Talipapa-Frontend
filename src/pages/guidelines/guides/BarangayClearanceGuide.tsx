import React from 'react';
import GuideTemplate from '../GuideTemplate';
import { FileText } from 'lucide-react';

const BarangayClearanceGuide: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Prepare Required Documents",
      description: "Gather all necessary documents before visiting the barangay office.",
      requirements: [
        "Valid ID (any government-issued ID)",
        "Barangay Residency Certificate or proof of residency",
        "Cedula (Community Tax Certificate)",
        "2 pieces of 2x2 ID pictures"
      ],
      notes: "Make sure all documents are original or properly certified copies."
    },
    {
      id: 2,
      title: "Visit the Barangay Office",
      description: "Go to the barangay office during business hours and proceed to the clearance desk.",
      notes: "Office hours are Monday to Friday, 8:00 AM to 5:00 PM. Avoid peak hours (11:00 AM - 1:00 PM) for faster service."
    },
    {
      id: 3,
      title: "Fill Out Application Form",
      description: "Complete the barangay clearance application form with accurate information.",
      requirements: [
        "Personal information (full name, address, contact number)",
        "Purpose of clearance (employment, business, etc.)",
        "Date of application"
      ],
      notes: "Write legibly and double-check all information before submitting."
    },
    {
      id: 4,
      title: "Submit Documents and Pay Fees",
      description: "Submit your completed form along with required documents and pay the processing fee.",
      requirements: [
        "Processing fee: ₱50.00",
        "Rush processing (same day): ₱100.00"
      ],
      notes: "Keep your receipt as proof of payment and for claiming purposes."
    },
    {
      id: 5,
      title: "Wait for Processing",
      description: "Wait for your barangay clearance to be processed and prepared.",
      notes: "Regular processing takes 1-2 business days. Rush processing is available for same-day release."
    },
    {
      id: 6,
      title: "Claim Your Clearance",
      description: "Return to the barangay office to claim your processed barangay clearance.",
      requirements: [
        "Official receipt",
        "Valid ID for verification"
      ],
      notes: "Barangay clearances are valid for 6 months from the date of issuance."
    }
  ];

  const requirements = [
    "Valid government-issued ID (Driver's License, SSS ID, PhilHealth ID, etc.)",
    "Proof of residency in the barangay (Cedula, Voter's ID, or Barangay ID)",
    "Community Tax Certificate (Cedula)",
    "2 pieces of 2x2 ID pictures",
    "Processing fee (₱50 regular, ₱100 rush)"
  ];

  const tips = [
    "Visit early in the morning to avoid long queues",
    "Bring extra copies of your documents",
    "Have exact change for faster transaction",
    "Check the validity period - clearances are valid for 6 months",
    "Keep a photocopy of your clearance for your records"
  ];

  return (
    <GuideTemplate
      title="Barangay Clearance"
      description="A barangay clearance is a document that certifies you have no pending cases or issues within the barangay and are in good standing in your community."
      icon={FileText}
      estimatedTime="30 minutes - 2 days"
      difficulty="Easy"
      steps={steps}
      requirements={requirements}
      tips={tips}
    />
  );
};

export default BarangayClearanceGuide;