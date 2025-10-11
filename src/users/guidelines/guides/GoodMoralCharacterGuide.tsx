import React from 'react';
import GuideTemplate from '../../../users/page/GuideTemplate';
import { ThumbsUp } from 'lucide-react';

const GoodMoralCharacterGuide: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Prepare Personal Documents",
      description: "Gather all required personal documents and identification.",
      requirements: [
        "Valid government-issued ID",
        "Barangay clearance",
        "Certificate of residency",
        "Police clearance (if available)",
        "2 pieces of 2x2 ID pictures"
      ],
      notes: "All documents should be recent and valid."
    },
    {
      id: 2,
      title: "Character Reference Requirements",
      description: "Prepare character references from reputable community members.",
      requirements: [
        "2-3 character references from neighbors",
        "Reference from employer or school (if applicable)",
        "Church reference (if applicable)"
      ],
      notes: "References should know you personally and can attest to your good character."
    },
    {
      id: 3,
      title: "Visit the Barangay Office",
      description: "Go to the barangay office and request for Good Moral Character certificate application.",
      notes: "Visit during office hours and bring all required documents."
    },
    {
      id: 4,
      title: "Fill Out Application Form",
      description: "Complete the application form with accurate personal information.",
      requirements: [
        "Personal details and contact information",
        "Purpose of the certificate",
        "Length of residency in the barangay"
      ],
      notes: "Be honest about the purpose as it may affect the processing requirements."
    },
    {
      id: 5,
      title: "Character Investigation",
      description: "Barangay officials will conduct a character background check.",
      notes: "They may interview neighbors, verify with references, and check barangay records."
    },
    {
      id: 6,
      title: "Interview with Barangay Officials",
      description: "Meet with barangay captain or designated officials for a personal interview.",
      notes: "Be prepared to discuss your background, activities, and community involvement."
    },
    {
      id: 7,
      title: "Pay Processing Fee",
      description: "Pay the required processing fee for the certificate preparation.",
      requirements: ["Processing fee: ₱75.00"],
      notes: "Keep your receipt as proof of payment."
    },
    {
      id: 8,
      title: "Wait for Background Verification",
      description: "Allow time for thorough background verification and certificate preparation.",
      notes: "Processing takes 3-5 business days due to the verification process."
    },
    {
      id: 9,
      title: "Claim Your Certificate",
      description: "Return to claim your Good Moral Character certificate.",
      requirements: [
        "Official receipt",
        "Valid ID"
      ],
      notes: "Certificate is valid for 6 months and often required for employment, scholarships, and travel."
    }
  ];

  const requirements = [
    "Valid government-issued ID",
    "Barangay clearance and certificate of residency",
    "Police clearance (recommended)",
    "2-3 character references from community members",
    "2 pieces of 2x2 ID pictures",
    "Processing fee (₱75.00)"
  ];

  const tips = [
    "Maintain good relationships with neighbors for easier character references",
    "Keep a clean record in the barangay - no violations or complaints",
    "Be active in community activities to establish good reputation",
    "Prepare your references in advance - inform them they may be contacted",
    "Be honest during the interview process",
    "Allow sufficient processing time for thorough verification"
  ];

  return (
    <GuideTemplate
      title="Good Moral Character Certificate"
      description="A Good Moral Character certificate attests to your reputation and behavior in the community, often required for employment, scholarships, travel, and other important applications."
      icon={ThumbsUp}
      estimatedTime="1 hour - 5 days"
      difficulty="Medium"
      steps={steps}
      requirements={requirements}
      tips={tips}
    />
  );
};

export default GoodMoralCharacterGuide;