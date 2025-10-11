import React from 'react';
import GuideTemplate from '../../../users/page/GuideTemplate';
import { Mountain } from 'lucide-react';

const LandUsePermitGuide: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Prepare Required Documents",
      description: "Gather all necessary documents related to your property and planned land use.",
      requirements: [
        "Valid ID (any government-issued ID)",
        "Original and photocopy of land title or Tax Declaration",
        "Certified True Copy of the latest Tax Receipt",
        "Location plan and site development plan",
        "Barangay Clearance",
        "Lot plan approved by the Geodetic Engineer"
      ],
      notes: "Ensure all property documents are updated and accurate. Discrepancies may delay processing."
    },
    {
      id: 2,
      title: "Secure Barangay Clearance",
      description: "Obtain a barangay clearance certifying no objection to your proposed land use.",
      notes: "Visit your barangay office with property documents. This usually takes 1-3 days to process."
    },
    {
      id: 3,
      title: "Visit the City/Municipal Planning Office",
      description: "Go to your local Planning and Development Office to file your land use permit application.",
      notes: "Office hours are typically Monday to Friday, 8:00 AM to 5:00 PM. Bring complete documents to avoid delays."
    },
    {
      id: 4,
      title: "Submit Application and Documents",
      description: "File your land use permit application along with all required documents and plans.",
      requirements: [
        "Duly accomplished application form",
        "Property ownership documents",
        "Site development plan (3 copies)",
        "Location plan (3 copies)",
        "Barangay clearance",
        "Tax clearance and receipts"
      ],
      notes: "Plans must be prepared and signed by a licensed architect or engineer."
    },
    {
      id: 5,
      title: "Site Inspection and Evaluation",
      description: "Wait for the planning office to conduct an ocular inspection of your property.",
      notes: "Inspection typically occurs within 5-10 business days. Ensure easy access to your property. The team will verify compliance with zoning regulations."
    },
    {
      id: 6,
      title: "Pay Processing Fees",
      description: "Once approved, pay the required fees for the land use permit at the cashier's office.",
      requirements: [
        "Processing fee: ₱500.00 - ₱2,000.00 (varies by property size and use)",
        "Inspection fee: ₱300.00 - ₱500.00",
        "Documentary stamp fee: ₱50.00"
      ],
      notes: "Fees vary depending on the city/municipality and type of land use. Keep your official receipt."
    },
    {
      id: 7,
      title: "Claim Your Land Use Permit",
      description: "Return to the Planning Office to claim your approved land use permit.",
      requirements: [
        "Official receipt",
        "Valid ID for verification",
        "Application reference number"
      ],
      notes: "Processing time is typically 15-30 business days. The permit validity varies; check the document for expiration date."
    }
  ];

  const requirements = [
    "Valid government-issued ID",
    "Original and photocopy of land title or Tax Declaration",
    "Certified True Copy of latest Tax Receipt",
    "Location plan (prepared by licensed geodetic engineer)",
    "Site development plan (prepared by licensed architect/engineer)",
    "Barangay Clearance",
    "Tax clearance certificate",
    "Processing fees (₱850 - ₱2,550)"
  ];

  const tips = [
    "Consult with the Planning Office before preparing plans to ensure compliance",
    "Hire licensed professionals (architects, engineers) for technical documents",
    "Verify your property's zoning classification before application",
    "Keep certified true copies of all property documents",
    "Process during non-peak months for faster service",
    "Consider hiring a processing agent if you're unfamiliar with the procedure"
  ];

  return (
    <GuideTemplate
      title="Land Use Permit"
      description="A land use permit certifies that your proposed use of a property is in accordance with the city or municipality's zoning regulations and comprehensive land use plan. It's required before construction, renovation, or change in property use."
      icon={Mountain}
      estimatedTime="15-30 business days"
      difficulty="Hard"
      steps={steps}
      requirements={requirements}
      tips={tips}
    />
  );
};

export default LandUsePermitGuide;
