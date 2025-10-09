import React from 'react';
import GuideTemplate from '../GuideTemplate';
import { File } from 'lucide-react';

const CertificateOfIndigencyGuide: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Prepare Required Documents",
      description: "Gather all necessary documents to prove your financial status and residency.",
      requirements: [
        "Valid government-issued ID",
        "Barangay clearance or certificate of residency",
        "Income Tax Return (ITR) or Certificate of No Income",
        "Affidavit of No Income (if unemployed)",
        "Family members' birth certificates (if applicable)"
      ],
      notes: "Documents should be recent and authenticated when required."
    },
    {
      id: 2,
      title: "Visit the Barangay Office",
      description: "Go to the barangay office and proceed to the social services desk.",
      notes: "Best to visit early morning to avoid crowds. Bring all original documents."
    },
    {
      id: 3,
      title: "Interview and Assessment",
      description: "Meet with the social worker for an assessment of your financial situation.",
      requirements: [
        "Honest disclosure of family income",
        "Details about family composition",
        "Reason for requesting the certificate"
      ],
      notes: "Be truthful during the interview as verification may be conducted."
    },
    {
      id: 4,
      title: "Fill Out Application Form",
      description: "Complete the application form for Certificate of Indigency.",
      notes: "Provide accurate information matching your supporting documents."
    },
    {
      id: 5,
      title: "Home Visit (If Required)",
      description: "A barangay representative may visit your home to verify your living conditions.",
      notes: "This step may be skipped for repeat applicants or those with updated records."
    },
    {
      id: 6,
      title: "Pay Processing Fee and Wait",
      description: "Pay the minimal processing fee and wait for document preparation.",
      requirements: ["Processing fee: ₱30.00"],
      notes: "Processing usually takes 2-3 business days."
    },
    {
      id: 7,
      title: "Claim Your Certificate",
      description: "Return to claim your Certificate of Indigency.",
      requirements: [
        "Official receipt",
        "Valid ID for verification"
      ],
      notes: "Certificate is valid for 6 months and can be used for medical assistance, scholarships, and other social services."
    }
  ];

  const requirements = [
    "Valid government-issued ID",
    "Proof of residency in the barangay",
    "Income Tax Return (ITR) or Certificate of No Income",
    "Affidavit of No Income (for unemployed individuals)",
    "Birth certificates of family members",
    "Processing fee (₱30.00)"
  ];

  const tips = [
    "Prepare all income-related documents beforehand",
    "Be honest during the assessment interview",
    "Bring family members if they need to be interviewed",
    "Keep copies of all submitted documents",
    "Use the certificate within its 6-month validity period"
  ];

  return (
    <GuideTemplate
      title="Certificate of Indigency"
      description="A Certificate of Indigency is an official document that certifies your low-income status, often required for medical assistance, educational scholarships, and social services."
      icon={File}
      estimatedTime="1 hour - 3 days"
      difficulty="Medium"
      steps={steps}
      requirements={requirements}
      tips={tips}
    />
  );
};

export default CertificateOfIndigencyGuide;