import {
  FileText,
  IdCard,
  Building2,
  Home,
  Droplets,
  Shield,
  Activity,
  MapPin,
  Car,
  AlertCircle,
  File,
} from 'lucide-react';

export interface GuideStep {
  id: number;
  title: string;
  description: string;
  requirements?: string[];
  notes?: string;
}

export interface GuideData {
  id: string;
  title: string;
  description: string;
  icon: any;
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  steps: GuideStep[];
  requirements: string[];
  tips: string[];
}

export const guidesData: Record<string, GuideData> = {
  'barangay-clearance': {
    id: 'barangay-clearance',
    title: 'Barangay Clearance',
    description:
      'A barangay clearance is a document that certifies you have no pending cases or issues within the barangay and are in good standing in your community.',
    icon: FileText,
    estimatedTime: '30 minutes - 2 days',
    difficulty: 'Easy',
    steps: [
      {
        id: 1,
        title: 'Prepare Required Documents',
        description:
          'Gather all necessary documents before visiting the barangay office.',
        requirements: [
          'Valid ID (any government-issued ID)',
          'Barangay Residency Certificate or proof of residency',
          'Cedula (Community Tax Certificate)',
          '2 pieces of 2x2 ID pictures',
        ],
        notes:
          'Make sure all documents are original or properly certified copies.',
      },
      {
        id: 2,
        title: 'Visit the Barangay Office',
        description:
          'Go to the barangay office during business hours and proceed to the clearance desk.',
        notes:
          'Office hours are Monday to Friday, 8:00 AM to 5:00 PM. Avoid peak hours (11:00 AM - 1:00 PM) for faster service.',
      },
      {
        id: 3,
        title: 'Fill Out Application Form',
        description:
          'Complete the barangay clearance application form with accurate information.',
        requirements: [
          'Personal information (full name, address, contact number)',
          'Purpose of clearance (employment, business, etc.)',
          'Date of application',
        ],
        notes:
          'Write legibly and double-check all information before submitting.',
      },
      {
        id: 4,
        title: 'Submit Documents and Pay Fees',
        description:
          'Submit your completed form along with required documents and pay the processing fee.',
        requirements: [
          'Processing fee: ₱50.00',
          'Rush processing (same day): ₱100.00',
        ],
        notes:
          'Keep your receipt as proof of payment and for claiming purposes.',
      },
      {
        id: 5,
        title: 'Wait for Processing',
        description:
          'Wait for your barangay clearance to be processed and prepared.',
        notes:
          'Regular processing takes 1-2 business days. Rush processing is available for same-day release.',
      },
      {
        id: 6,
        title: 'Claim Your Clearance',
        description:
          'Return to the barangay office to claim your processed barangay clearance.',
        requirements: ['Official receipt', 'Valid ID for verification'],
        notes:
          'Barangay clearances are valid for 6 months from the date of issuance.',
      },
    ],
    requirements: [
      "Valid government-issued ID (Driver's License, SSS ID, PhilHealth ID, etc.)",
      "Proof of residency in the barangay (Cedula, Voter's ID, or Barangay ID)",
      'Community Tax Certificate (Cedula)',
      '2 pieces of 2x2 ID pictures',
      'Processing fee (₱50 regular, ₱100 rush)',
    ],
    tips: [
      'Visit early in the morning to avoid long queues',
      'Bring extra copies of your documents',
      'Have exact change for faster transaction',
      'Check the validity period - clearances are valid for 6 months',
      'Keep a photocopy of your clearance for your records',
    ],
  },
  'barangay-affidavit': {
    id: 'barangay-affidavit',
    title: 'Barangay Affidavit',
    description:
      'A barangay affidavit is a sworn statement or declaration used for various legal purposes within the barangay jurisdiction.',
    icon: FileText,
    estimatedTime: '1-2 hours',
    difficulty: 'Easy',
    steps: [
      {
        id: 1,
        title: 'Prepare Information',
        description:
          'Prepare all details and facts that need to be included in the affidavit.',
        notes:
          'Be clear about the purpose and ensure all information is accurate and truthful.',
      },
      {
        id: 2,
        title: 'Visit Barangay Office',
        description:
          'Go to the barangay office and request for an affidavit form.',
        requirements: ['Valid ID', 'Purpose of affidavit'],
        notes: 'Bring witnesses if required for your specific case.',
      },
      {
        id: 3,
        title: 'Draft the Affidavit',
        description:
          'Work with barangay staff to draft the affidavit with accurate details.',
        notes: 'Review carefully before proceeding to oath-taking.',
      },
      {
        id: 4,
        title: 'Take Oath',
        description:
          'Take an oath before the barangay official or notary public.',
        requirements: ['Valid ID', 'Affidavit draft'],
        notes: 'You must be present personally for oath-taking.',
      },
      {
        id: 5,
        title: 'Pay Processing Fee',
        description: 'Pay the required fee for the affidavit service.',
        requirements: ['Processing fee: ₱50-₱100'],
        notes: 'Fees may vary depending on the type of affidavit.',
      },
    ],
    requirements: [
      'Valid government-issued ID',
      'Details of the statement to be made',
      'Witnesses (if applicable)',
      'Processing fee',
    ],
    tips: [
      'Be truthful in all statements',
      'Bring witnesses if your case requires them',
      'Keep copies of the affidavit for your records',
      'Understand the legal implications of your sworn statement',
    ],
  },
  'business-clearance': {
    id: 'business-clearance',
    title: 'Business Clearance',
    description:
      'A business clearance from the barangay is required before you can operate any business within the barangay jurisdiction.',
    icon: Building2,
    estimatedTime: '3-5 business days',
    difficulty: 'Medium',
    steps: [
      {
        id: 1,
        title: 'Prepare Business Documents',
        description:
          'Gather all necessary documents for your business registration.',
        requirements: [
          'DTI or SEC registration',
          'Lease contract or proof of business location',
          'Barangay clearance of business owner',
          'Valid ID of owner',
        ],
        notes:
          'Ensure your business location is within the barangay jurisdiction.',
      },
      {
        id: 2,
        title: 'Visit Barangay Office',
        description:
          'Go to the barangay office and submit your application for business clearance.',
        notes: 'Some barangays require inspection of the business premises.',
      },
      {
        id: 3,
        title: 'Pay Barangay Business Tax',
        description:
          'Pay the required barangay business tax and clearance fee.',
        requirements: [
          'Business tax (varies by business type)',
          'Clearance fee: ₱100-₱500',
        ],
        notes: 'Fees depend on the nature and size of your business.',
      },
      {
        id: 4,
        title: 'Inspection (if required)',
        description:
          'Allow barangay officials to inspect your business premises if required.',
        notes:
          'Ensure your business complies with health, safety, and zoning regulations.',
      },
      {
        id: 5,
        title: 'Claim Business Clearance',
        description:
          'Return to claim your barangay business clearance once approved.',
        requirements: ['Official receipt', 'Valid ID'],
        notes: 'Business clearance must be renewed annually.',
      },
    ],
    requirements: [
      'DTI or SEC registration certificate',
      'Proof of business location (lease contract or land title)',
      "Owner's barangay clearance",
      'Valid ID of business owner',
      'Business tax payment',
      'Clearance processing fee',
    ],
    tips: [
      'Start the process before setting up your business',
      'Ensure your business location complies with zoning laws',
      'Renew annually to avoid penalties',
      'Keep copies of all permits and clearances',
      'Coordinate with the barangay for inspection requirements',
    ],
  },
  'certificate-of-indigency': {
    id: 'certificate-of-indigency',
    title: 'Certificate of Indigency',
    description:
      'A certificate that attests to the financial status of an individual or family, often required for medical assistance, scholarships, or legal purposes.',
    icon: File,
    estimatedTime: '1-3 business days',
    difficulty: 'Easy',
    steps: [
      {
        id: 1,
        title: 'Prepare Personal Documents',
        description: 'Gather documents that prove your residency and identity.',
        requirements: [
          'Valid ID',
          'Proof of residency',
          'Income documents (if any)',
        ],
        notes: 'You may need to provide proof of low income or unemployment.',
      },
      {
        id: 2,
        title: 'Visit Barangay Office',
        description:
          'Go to the barangay office and request a Certificate of Indigency.',
        notes: 'Be prepared to explain the purpose of the certificate.',
      },
      {
        id: 3,
        title: 'Fill Out Application',
        description:
          'Complete the application form with accurate information about your financial situation.',
        notes:
          'Barangay officials may conduct a home visit to verify your circumstances.',
      },
      {
        id: 4,
        title: 'Home Visit Verification',
        description:
          'Cooperate with barangay officials if they conduct a home visit for verification.',
        notes:
          'This step ensures the certificate is issued to those who genuinely need it.',
      },
      {
        id: 5,
        title: 'Pay Minimal Fee',
        description: 'Pay the minimal processing fee if required.',
        requirements: [
          'Processing fee: ₱20-₱50 (or free for indigent residents)',
        ],
        notes: 'Most barangays offer this service for free or at minimal cost.',
      },
    ],
    requirements: [
      'Valid ID',
      'Proof of residency in the barangay',
      'Documentation of financial situation (if available)',
      'Purpose of certificate',
    ],
    tips: [
      'Be honest about your financial situation',
      'Specify the purpose clearly (medical, scholarship, etc.)',
      'Some hospitals or institutions may require additional documents',
      'Certificate is typically valid for 6 months',
    ],
  },
  'certificate-of-residency': {
    id: 'certificate-of-residency',
    title: 'Certificate of Residency',
    description:
      'A document that certifies you are a resident of the barangay, often required for various transactions and applications.',
    icon: Home,
    estimatedTime: '1-2 business days',
    difficulty: 'Easy',
    steps: [
      {
        id: 1,
        title: 'Prepare Documents',
        description:
          'Gather documents that prove your residency in the barangay.',
        requirements: [
          'Valid ID',
          'Proof of address (utility bill, rental contract, etc.)',
          'Cedula (if available)',
        ],
        notes: 'You must have lived in the barangay for at least 6 months.',
      },
      {
        id: 2,
        title: 'Visit Barangay Office',
        description:
          'Go to the barangay office and request for Certificate of Residency.',
        notes: 'Office hours are Monday to Friday, 8:00 AM to 5:00 PM.',
      },
      {
        id: 3,
        title: 'Fill Out Application Form',
        description:
          'Complete the application form with your personal information and purpose.',
        requirements: [
          'Full name and address',
          'Length of residency',
          'Purpose of certificate',
        ],
      },
      {
        id: 4,
        title: 'Pay Processing Fee',
        description: 'Pay the required processing fee for the certificate.',
        requirements: ['Processing fee: ₱50'],
        notes: 'Keep your receipt for claiming purposes.',
      },
      {
        id: 5,
        title: 'Claim Certificate',
        description: "Return to claim your certificate once it's ready.",
        requirements: ['Official receipt', 'Valid ID'],
      },
    ],
    requirements: [
      'Valid government-issued ID',
      'Proof of current address in the barangay',
      'Minimum 6 months residency',
      'Processing fee',
    ],
    tips: [
      'Bring recent utility bills as proof of address',
      "Inform barangay officials if you're a new resident",
      'Certificate is valid for 6 months',
      'Keep a copy for future reference',
    ],
  },
  'flood-assistance': {
    id: 'flood-assistance',
    title: 'Flood Assistance',
    description:
      'Guidelines for requesting emergency assistance and relief during and after flooding incidents in the barangay.',
    icon: Droplets,
    estimatedTime: 'Immediate - 1 week',
    difficulty: 'Easy',
    steps: [
      {
        id: 1,
        title: 'Report to Barangay',
        description:
          'Immediately report to the barangay office or emergency hotline during flooding.',
        requirements: ['Contact information', 'Location details'],
        notes: 'Barangay Emergency Hotline: Available 24/7',
      },
      {
        id: 2,
        title: 'Evacuation (if needed)',
        description: 'Follow evacuation procedures if water level is rising.',
        notes:
          'Bring important documents and emergency supplies to evacuation centers.',
      },
      {
        id: 3,
        title: 'Document Damages',
        description:
          'Take photos and document all flood damages to your property.',
        requirements: [
          'Photos of damages',
          'List of damaged items',
          'Estimated cost of damages',
        ],
        notes: 'This documentation is needed for assistance applications.',
      },
      {
        id: 4,
        title: 'Apply for Assistance',
        description:
          'Submit application for flood assistance at the barangay office.',
        requirements: [
          'Valid ID',
          'Proof of residency',
          'Damage documentation',
          'Barangay clearance',
        ],
        notes:
          'Applications are processed on a first-come, first-served basis.',
      },
      {
        id: 5,
        title: 'Receive Relief Goods',
        description:
          'Claim relief goods and assistance as allocated by the barangay.',
        notes:
          'Additional assistance may be available from the city or national government.',
      },
    ],
    requirements: [
      'Proof of residency in affected area',
      'Documentation of flood damages',
      'Valid ID',
      'Barangay clearance',
    ],
    tips: [
      'Save emergency hotline numbers',
      'Prepare emergency kit in advance',
      'Keep important documents in waterproof container',
      'Follow evacuation orders promptly',
      'Cooperate with barangay officials and rescue teams',
    ],
  },
  'good-moral-character': {
    id: 'good-moral-character',
    title: 'Certificate of Good Moral Character',
    description:
      'A certificate attesting to your good moral standing in the community, often required for employment, school, or visa applications.',
    icon: Shield,
    estimatedTime: '1-3 business days',
    difficulty: 'Easy',
    steps: [
      {
        id: 1,
        title: 'Prepare Personal Documents',
        description: 'Gather your personal documents and identification.',
        requirements: [
          'Valid ID',
          'Barangay clearance',
          'Proof of residency',
          'Police clearance (if available)',
        ],
        notes: 'Having no criminal records in the barangay is essential.',
      },
      {
        id: 2,
        title: 'Visit Barangay Office',
        description:
          'Go to the barangay office and request for Certificate of Good Moral Character.',
        notes: 'Explain the purpose for which you need the certificate.',
      },
      {
        id: 3,
        title: 'Fill Out Application',
        description:
          'Complete the application form with accurate personal information.',
        requirements: [
          'Personal information',
          'Purpose of certificate',
          'Length of residency',
        ],
      },
      {
        id: 4,
        title: 'Character Check',
        description:
          'Barangay officials will verify your records and moral standing in the community.',
        notes: 'This may involve checking with barangay tanods and officials.',
      },
      {
        id: 5,
        title: 'Pay Fee and Claim',
        description:
          'Pay the processing fee and claim your certificate once approved.',
        requirements: ['Processing fee: ₱50-₱100'],
        notes: 'Certificate is typically valid for 6 months.',
      },
    ],
    requirements: [
      'Valid government-issued ID',
      'Barangay clearance',
      'Proof of residency (minimum 1 year)',
      'No criminal records in the barangay',
      'Processing fee',
    ],
    tips: [
      'Maintain good standing in your community',
      'Process well in advance of your deadline',
      'Explain clearly why you need the certificate',
      'Keep copies for multiple applications',
    ],
  },
  'health-certificate': {
    id: 'health-certificate',
    title: 'Barangay Health Certificate',
    description:
      'A health certificate issued for various purposes including employment, food handling, or travel requirements.',
    icon: Activity,
    estimatedTime: '1-2 days',
    difficulty: 'Easy',
    steps: [
      {
        id: 1,
        title: 'Visit Barangay Health Center',
        description: 'Go to the barangay health center during clinic hours.',
        requirements: ['Valid ID', 'Purpose of health certificate'],
        notes:
          'Health center hours are usually Monday to Friday, 8:00 AM to 5:00 PM.',
      },
      {
        id: 2,
        title: 'Medical Examination',
        description:
          'Undergo basic medical examination by the barangay health worker or nurse.',
        notes: 'May include basic vital signs check and health questionnaire.',
      },
      {
        id: 3,
        title: 'Laboratory Tests (if required)',
        description: 'Complete any required laboratory tests.',
        requirements: [
          'Chest X-ray (for some purposes)',
          'Fecalysis (for food handlers)',
          'Other tests as needed',
        ],
        notes: 'Some tests may need to be done at external laboratories.',
      },
      {
        id: 4,
        title: 'Pay Certificate Fee',
        description: 'Pay the required fee for the health certificate.',
        requirements: ['Processing fee: ₱50-₱150'],
        notes: 'Fee may vary depending on the type of certificate needed.',
      },
      {
        id: 5,
        title: 'Claim Certificate',
        description:
          'Return to claim your health certificate once results are ready.',
        requirements: ['Official receipt', 'Valid ID'],
        notes: 'Health certificates are typically valid for 1 year.',
      },
    ],
    requirements: [
      'Valid ID',
      'Medical examination',
      'Laboratory test results (if applicable)',
      'Processing fee',
    ],
    tips: [
      'Fast for 8 hours if laboratory tests are required',
      'Bring test results from previous examinations if available',
      'Check validity period for your specific purpose',
      'Renew before expiration if needed continuously',
    ],
  },
  'land-use-permit': {
    id: 'land-use-permit',
    title: 'Land Use Permit',
    description:
      'A permit required for construction or land development within the barangay, ensuring compliance with zoning regulations.',
    icon: MapPin,
    estimatedTime: '5-10 business days',
    difficulty: 'Medium',
    steps: [
      {
        id: 1,
        title: 'Prepare Property Documents',
        description:
          'Gather all documents related to your property and proposed development.',
        requirements: [
          'Land title or Tax Declaration',
          'Building plans/blueprints',
          'Lot plan',
          "Owner's valid ID",
          'Barangay clearance',
        ],
        notes: 'Ensure your plans comply with the National Building Code.',
      },
      {
        id: 2,
        title: 'Submit Application',
        description:
          'Submit your application for land use permit at the barangay office.',
        notes: 'Include all required documents and multiple copies of plans.',
      },
      {
        id: 3,
        title: 'Site Inspection',
        description: 'Allow barangay officials to conduct a site inspection.',
        notes: 'Be present or have a representative during the inspection.',
      },
      {
        id: 4,
        title: 'Pay Processing Fee',
        description: 'Pay the required fees for the land use permit.',
        requirements: ['Processing fee: ₱500-₱2,000 (varies by project size)'],
        notes: 'Fees depend on the scale and nature of development.',
      },
      {
        id: 5,
        title: 'Receive Approval',
        description: 'Wait for approval and issuance of the land use permit.',
        notes:
          'This permit must be obtained before applying for a building permit.',
      },
    ],
    requirements: [
      'Land title or Tax Declaration',
      'Building plans and blueprints',
      'Lot survey plan',
      "Owner's barangay clearance",
      'Valid ID of property owner',
      'Processing fee',
    ],
    tips: [
      'Consult with a licensed engineer or architect',
      'Ensure plans comply with zoning regulations',
      'Process this permit before starting construction',
      'Keep copies of all approved plans and permits',
      'Inform neighbors about your development plans',
    ],
  },
  'philsys-id': {
    id: 'philsys-id',
    title: 'PhilSys ID (National ID)',
    description:
      'The Philippine Identification System (PhilSys) ID is the official national ID. The barangay can assist with information and scheduling.',
    icon: IdCard,
    estimatedTime: 'Varies',
    difficulty: 'Medium',
    steps: [
      {
        id: 1,
        title: 'Prepare Required Documents',
        description:
          'Gather all necessary documents for PhilSys ID application.',
        requirements: [
          'Birth certificate (PSA-issued)',
          'Valid supporting documents for identity',
          'Proof of address',
        ],
        notes:
          'PhilSys registration is handled by PSA. The barangay may assist with scheduling or information.',
      },
      {
        id: 2,
        title: 'Check Registration Schedule',
        description:
          'Inquire at the barangay office about PhilSys registration schedules.',
        notes:
          'Some barangays coordinate with PSA for mass registration drives.',
      },
      {
        id: 3,
        title: 'Pre-register Online (Optional)',
        description:
          'You can pre-register online through the official PhilSys website.',
        notes:
          'Pre-registration helps speed up the process at the registration center.',
      },
      {
        id: 4,
        title: 'Visit Registration Center',
        description:
          'Go to the designated PSA registration center or mobile registration unit.',
        requirements: [
          'Original documents',
          'Pre-registration form (if applicable)',
        ],
        notes: 'Biometrics and photos will be taken during registration.',
      },
      {
        id: 5,
        title: 'Wait for ID Delivery',
        description:
          'Wait for your PhilSys ID to be delivered to your registered address.',
        notes:
          "Processing may take several months. You'll receive an ePhilID via email first.",
      },
    ],
    requirements: [
      'PSA-issued birth certificate',
      'Supporting documents for identity verification',
      'Proof of current address',
      'No fees required (free registration)',
    ],
    tips: [
      'Register as soon as possible',
      'Keep your PSA Slip Number safe',
      'Update your address if you move',
      'The PhilSys ID is lifetime valid',
      'Visit the official PhilSys website for complete information',
    ],
  },
  'quezon-city-id': {
    id: 'quezon-city-id',
    title: 'Quezon City ID',
    description:
      'The official identification card for Quezon City residents, which can be obtained through your barangay.',
    icon: IdCard,
    estimatedTime: '2-4 weeks',
    difficulty: 'Easy',
    steps: [
      {
        id: 1,
        title: 'Prepare Requirements',
        description: 'Gather all necessary documents for QC ID application.',
        requirements: [
          'Valid ID',
          'Proof of residency in Quezon City',
          'Barangay clearance or certificate of residency',
          '1x1 or 2x2 ID picture',
        ],
        notes: 'Must be a resident of Quezon City for at least 6 months.',
      },
      {
        id: 2,
        title: 'Visit Barangay Office',
        description: 'Go to your barangay office to apply for QC ID.',
        notes: 'Check if your barangay has scheduled QC ID processing days.',
      },
      {
        id: 3,
        title: 'Fill Out Application Form',
        description:
          'Complete the QC ID application form with accurate information.',
        requirements: [
          'Personal information',
          'Contact details',
          'Emergency contact person',
        ],
      },
      {
        id: 4,
        title: 'Photo Capture and Biometrics',
        description: 'Have your photo taken and provide biometric information.',
        notes: "Ensure you're presentable for the ID photo.",
      },
      {
        id: 5,
        title: 'Pay Processing Fee',
        description: 'Pay the minimal processing fee for the QC ID.',
        requirements: ['Processing fee: ₱50'],
        notes: 'Senior citizens and PWDs may be eligible for free processing.',
      },
      {
        id: 6,
        title: 'Claim Your QC ID',
        description:
          "Return to claim your QC ID once notified that it's ready.",
        requirements: ['Claim stub', 'Valid ID'],
        notes: 'Processing typically takes 2-4 weeks.',
      },
    ],
    requirements: [
      'Valid government-issued ID or school ID',
      'Proof of QC residency (utility bill, lease contract, etc.)',
      'Barangay clearance or certificate of residency',
      '1x1 or 2x2 ID picture',
      'Processing fee (₱50)',
    ],
    tips: [
      'QC ID is accepted as a valid ID for most transactions',
      'Free for senior citizens and PWDs',
      'Valid for 5 years',
      'Keep your claim stub safe',
      'Can be used for various government transactions in QC',
    ],
  },
  'restricted-area-pass': {
    id: 'restricted-area-pass',
    title: 'Restricted Area Pass',
    description:
      'A pass required for entering or working in restricted or controlled areas within the barangay, especially during emergencies or special circumstances.',
    icon: AlertCircle,
    estimatedTime: '1-2 days',
    difficulty: 'Easy',
    steps: [
      {
        id: 1,
        title: 'Determine Purpose',
        description: 'Identify the reason you need a restricted area pass.',
        notes:
          'Common purposes include: work, medical, emergency, essential services.',
      },
      {
        id: 2,
        title: 'Prepare Documents',
        description: 'Gather documents that support your need for the pass.',
        requirements: [
          'Valid ID',
          'Barangay clearance',
          'Work ID or medical documents',
          'Purpose-specific documents',
        ],
        notes: 'Requirements may vary depending on the reason for the pass.',
      },
      {
        id: 3,
        title: 'Visit Barangay Office',
        description:
          'Go to the barangay office to apply for the restricted area pass.',
        notes: 'During emergencies, special processing windows may be set up.',
      },
      {
        id: 4,
        title: 'Fill Out Application',
        description:
          'Complete the application form with details about your need for the pass.',
        requirements: [
          'Personal information',
          'Purpose and duration',
          'Areas to be accessed',
        ],
      },
      {
        id: 5,
        title: 'Submit and Receive Pass',
        description:
          'Submit your application and receive your pass if approved.',
        notes: 'Pass validity depends on the circumstances and purpose.',
      },
    ],
    requirements: [
      'Valid government-issued ID',
      'Barangay clearance',
      'Documentation supporting your purpose',
      'Work ID (if work-related)',
      'Medical documents (if health-related)',
    ],
    tips: [
      'Apply in advance when possible',
      'Always carry your pass when in restricted areas',
      'Follow all guidelines and restrictions',
      'Renew before expiration if extended access is needed',
      'Inform barangay officials if your circumstances change',
    ],
  },
  'traffic-clearance': {
    id: 'traffic-clearance',
    title: 'Traffic Clearance',
    description:
      'A clearance required for events or activities that may affect traffic flow within the barangay.',
    icon: Car,
    estimatedTime: '3-5 business days',
    difficulty: 'Medium',
    steps: [
      {
        id: 1,
        title: 'Plan Your Event',
        description:
          'Prepare detailed plans for your event or activity that affects traffic.',
        requirements: [
          'Event details (date, time, location)',
          'Expected number of participants',
          'Traffic management plan',
          'Route map (if applicable)',
        ],
        notes: 'Plan at least 2 weeks before your event.',
      },
      {
        id: 2,
        title: 'Coordinate with Barangay',
        description:
          'Meet with barangay officials to discuss your plans and requirements.',
        notes:
          'Barangay may require additional safety measures or adjustments.',
      },
      {
        id: 3,
        title: 'Submit Application',
        description:
          'Submit formal application for traffic clearance with all supporting documents.',
        requirements: [
          'Application letter',
          'Event plan and map',
          'Traffic management plan',
          "Organizer's valid ID",
        ],
      },
      {
        id: 4,
        title: 'Pay Processing Fee',
        description: 'Pay the required processing fee for traffic clearance.',
        requirements: ['Processing fee: ₱200-₱500'],
        notes: 'Fee depends on the scale and duration of the event.',
      },
      {
        id: 5,
        title: 'Site Inspection',
        description:
          'Allow barangay and traffic officials to inspect the event site.',
        notes: 'They will verify your traffic management preparations.',
      },
      {
        id: 6,
        title: 'Receive Clearance',
        description:
          'Receive your traffic clearance and comply with all conditions.',
        notes: 'Clearance must be displayed during the event.',
      },
    ],
    requirements: [
      'Application letter with event details',
      'Traffic management and safety plan',
      'Route map (if applicable)',
      "Organizer's barangay clearance",
      'Valid ID of organizer',
      'Processing fee',
      'Liability insurance (for large events)',
    ],
    tips: [
      'Apply at least 2 weeks in advance',
      'Coordinate with local police for traffic management',
      'Inform residents about the event and traffic changes',
      'Have volunteer marshals for traffic control',
      'Prepare alternative routes for affected residents',
      'Comply with all safety and health protocols',
    ],
  },
};
