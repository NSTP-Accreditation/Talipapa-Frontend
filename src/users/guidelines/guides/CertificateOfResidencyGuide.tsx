import React from 'react';
import GuideTemplate from '../../../users/page/GuideTemplate';
import { House } from 'lucide-react';

const CertificateOfResidencyGuide: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Prepare Required Documents",
      description: "Gather all documents that prove your residency in the barangay.",
      requirements: [
        "Valid government-issued ID",
        "Utility bills (electricity, water, internet) - recent 3 months",
        "Lease contract or Certificate of Title (if applicable)",
        "Barangay clearance",
        "2 pieces of 1x1 or 2x2 ID pictures"
      ],
      notes: "Utility bills should be under your name or with an affidavit if under someone else's name."
    },
    {
      id: 2,
      title: "Visit the Barangay Office",
      description: "Go to the barangay hall and proceed to the residency certification desk.",
      notes: "Office hours: Monday to Friday, 8:00 AM to 5:00 PM. Best time to visit is early morning."
    },
    {
      id: 3,
      title: "Fill Out Application Form",
      description: "Complete the application form for Certificate of Residency.",
      requirements: [
        "Personal information (full name, address, contact)",
        "Length of residency in the barangay",
        "Purpose of the certificate"
      ],
      notes: "Provide the exact address as it appears on your utility bills."
    },
    {
      id: 4,
      title: "Verification Process",
      description: "Barangay staff will verify your residency through their records and documents.",
      notes: "They may check voter registration records and previous barangay documents."
    },
    {
      id: 5,
      title: "Pay Processing Fee",
      description: "Pay the required processing fee for the certificate preparation.",
      requirements: [
        "Processing fee: ₱40.00",
        "Rush processing (same day): ₱80.00"
      ],
      notes: "Keep your receipt for claiming purposes."
    },
    {
      id: 6,
      title: "Wait for Processing",
      description: "Wait for your certificate to be processed and printed.",
      notes: "Regular processing takes 1-2 business days. Same-day processing available for urgent needs."
    },
    {
      id: 7,
      title: "Claim Your Certificate",
      description: "Return to the barangay office to claim your Certificate of Residency.",
      requirements: [
        "Official receipt",
        "Valid ID"
      ],
      notes: "Certificate is valid for 6 months from date of issue."
    }
  ];

  const requirements = [
    "Valid government-issued ID",
    "Recent utility bills (3 months) under your name",
    "Lease contract or proof of property ownership",
    "Barangay clearance",
    "ID pictures (1x1 or 2x2)",
    "Processing fee (₱40 regular, ₱80 rush)"
  ];

  const tips = [
    "Ensure utility bills are recent and under your name",
    "If bills are under a different name, prepare an affidavit",
    "Bring original documents and photocopies",
    "Register as a voter in the barangay for easier verification",
    "Keep your certificate updated for future transactions"
  ];

  return (
    <GuideTemplate
      title="Certificate of Residency"
      description="A Certificate of Residency is an official document that proves you are a resident of the barangay, required for various government and private transactions."
      icon={House}
      estimatedTime="30 minutes - 2 days"
      difficulty="Easy"
      steps={steps}
      requirements={requirements}
      tips={tips}
    />
  );
};

export default CertificateOfResidencyGuide;