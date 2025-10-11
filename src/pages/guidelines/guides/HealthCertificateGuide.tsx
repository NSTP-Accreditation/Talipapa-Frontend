import React from 'react';
import GuideTemplate from '../GuideTemplate';
import { Stethoscope } from 'lucide-react';

const HealthCertificateGuide: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Prepare Required Documents",
      description: "Gather all necessary documents before visiting the health center or clinic.",
      requirements: [
        "Valid ID (any government-issued ID)",
        "Barangay Certificate or proof of residency",
        "Previous medical records (if applicable)",
        "1 piece of 1x1 ID picture"
      ],
      notes: "Make sure to bring original IDs for verification purposes."
    },
    {
      id: 2,
      title: "Visit the Health Center",
      description: "Go to your local barangay health center or accredited clinic during operating hours.",
      notes: "Health centers operate Monday to Friday, 8:00 AM to 5:00 PM. Some offer Saturday services. Call ahead to confirm schedule."
    },
    {
      id: 3,
      title: "Medical Examination",
      description: "Undergo a basic medical examination conducted by a licensed physician or health officer.",
      requirements: [
        "Physical examination",
        "Blood pressure check",
        "Basic health assessment",
        "Additional tests as required (chest X-ray, drug test, etc.)"
      ],
      notes: "Come well-rested and fasting if blood tests are required. Inform the doctor of any existing medical conditions."
    },
    {
      id: 4,
      title: "Laboratory Tests (if required)",
      description: "Complete any necessary laboratory tests as prescribed by the examining physician.",
      requirements: [
        "Chest X-ray (for employment purposes)",
        "Drug test/screening",
        "Urinalysis",
        "Fecalysis (for food handlers)"
      ],
      notes: "Laboratory results may take 1-3 days depending on the tests required."
    },
    {
      id: 5,
      title: "Pay Processing Fees",
      description: "Settle the medical examination and certificate processing fees at the cashier.",
      requirements: [
        "Medical examination fee: ₱150.00 - ₱300.00",
        "Laboratory tests: ₱500.00 - ₱1,500.00 (varies by test)",
        "Certificate processing: ₱50.00"
      ],
      notes: "Fees vary depending on the clinic and additional tests required. Keep your receipt."
    },
    {
      id: 6,
      title: "Claim Your Health Certificate",
      description: "Return to the health center or clinic to claim your health certificate once ready.",
      requirements: [
        "Official receipt",
        "Valid ID for verification"
      ],
      notes: "Processing time is typically 1-3 days. Health certificates are usually valid for 6 months to 1 year."
    }
  ];

  const requirements = [
    "Valid government-issued ID (Driver's License, SSS ID, PhilHealth ID, etc.)",
    "Barangay Certificate or proof of residency",
    "1 piece of 1x1 ID picture",
    "Previous medical records (if available)",
    "Processing and examination fees (₱200 - ₱2,000 depending on tests)"
  ];

  const tips = [
    "Schedule your appointment early in the morning for faster service",
    "Fast for 8-10 hours if blood tests are required",
    "Bring water and light snacks for after the examination",
    "Wear comfortable clothing for easy examination",
    "Ask about the validity period of your certificate",
    "Get an extra photocopy for your records"
  ];

  return (
    <GuideTemplate
      title="Health Certificate"
      description="A health certificate is a medical document that certifies you are physically and mentally fit and free from contagious diseases. It's commonly required for employment, school enrollment, or food handling permits."
      icon={Stethoscope}
      estimatedTime="2-4 hours (plus 1-3 days processing)"
      difficulty="Medium"
      steps={steps}
      requirements={requirements}
      tips={tips}
    />
  );
};

export default HealthCertificateGuide;
