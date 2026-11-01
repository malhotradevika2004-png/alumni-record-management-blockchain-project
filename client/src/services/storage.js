// Local Persistence & Demo Seed Store for Alumni Record Management System
const STORAGE_KEYS = {
  ALUMNI: 'alumnix_alumni_records',
  CERTIFICATES: 'alumnix_certificates',
  TRANSACTIONS: 'alumnix_blockchain_transactions',
  SETTINGS: 'alumnix_system_settings',
};

// Realistic demonstration data matching the contract deployment seed
export const INITIAL_ALUMNI_SEEDS = [
  // 1. Department of Engineering and Technology
  {
    alumniId: "ALU-2024-001",
    name: "Aarav Sharma",
    degree: "B.Tech Computer Science & Engineering",
    department: "Department of Engineering and Technology",
    graduationYear: 2024,
    cgpa: "9.45",
    email: "aarav.sharma@alumni.edu",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    status: "Active",
    registrationDate: "2024-06-15T10:30:00.000Z",
    lastUpdatedDate: "2024-06-15T10:30:00.000Z",
    alumniWallet: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    achievements: ["Gold Medalist (Rank 1)", "Best Undergraduate Capstone Project", "Published 2 IEEE Papers"],
    skills: ["Solidity", "Distributed Systems", "Full Stack", "Data Structures"],
    employment: "Software Engineer at Google Cloud",
  },
  {
    alumniId: "ALU-2024-012",
    name: "Simran Kaur",
    degree: "B.Tech Artificial Intelligence & Machine Learning (AI & ML)",
    department: "Department of Engineering and Technology",
    graduationYear: 2024,
    cgpa: "9.20",
    email: "simran.kaur@alumni.edu",
    phone: "+91 98123 45678",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    status: "Active",
    registrationDate: "2024-06-15T10:45:00.000Z",
    lastUpdatedDate: "2024-06-15T10:45:00.000Z",
    alumniWallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    achievements: ["Dean's Honor Roll", "Winner of National AI Hackathon 2023"],
    skills: ["Deep Learning", "PyTorch", "NLP", "Computer Vision"],
    employment: "AI Research Associate at Microsoft Research",
  },
  {
    alumniId: "ALU-2023-045",
    name: "Arjun Kapoor",
    degree: "B.Tech Mechanical Engineering",
    department: "Department of Engineering and Technology",
    graduationYear: 2023,
    cgpa: "8.60",
    email: "arjun.k@alumni.edu",
    phone: "+91 98234 56789",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    status: "Active",
    registrationDate: "2023-07-10T10:00:00.000Z",
    lastUpdatedDate: "2023-07-10T10:00:00.000Z",
    alumniWallet: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    achievements: ["Formula Student Team Lead", "Design Excellence Award"],
    skills: ["SolidWorks", "Finite Element Analysis", "Thermodynamics"],
    employment: "Design Engineer at Tata Motors",
  },
  {
    alumniId: "ALU-2023-055",
    name: "Harpreet Singh",
    degree: "B.Tech Civil Engineering",
    department: "Department of Engineering and Technology",
    graduationYear: 2023,
    cgpa: "8.35",
    email: "harpreet.s@alumni.edu",
    phone: "+91 97654 32109",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    status: "Active",
    registrationDate: "2023-07-12T11:00:00.000Z",
    lastUpdatedDate: "2023-07-12T11:00:00.000Z",
    alumniWallet: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    achievements: ["Structural Engineering Capstone Distinction"],
    skills: ["STAAD Pro", "AutoCAD", "Surveying", "Geotechnical Analysis"],
    employment: "Structural Consultant at L&T Construction",
  },

  // 2. Department of Management
  {
    alumniId: "ALU-2023-088",
    name: "Rohan Verma",
    degree: "Bachelor of Business Administration (BBA)",
    department: "Department of Management",
    graduationYear: 2023,
    cgpa: "8.45",
    email: "rohan.verma@alumni.edu",
    phone: "+91 97234 56789",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    status: "Updated",
    registrationDate: "2023-07-20T09:15:00.000Z",
    lastUpdatedDate: "2024-02-10T14:45:00.000Z",
    alumniWallet: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    achievements: ["Management Club President", "Best Case Study Award"],
    skills: ["Financial Analysis", "Strategic Management", "Operations"],
    employment: "Business Analyst at Deloitte",
  },
  {
    alumniId: "ALU-2024-105",
    name: "Ananya Roy",
    degree: "Bachelor of Commerce (B.Com)",
    department: "Department of Management",
    graduationYear: 2024,
    cgpa: "9.10",
    email: "ananya.roy@alumni.edu",
    phone: "+91 98321 65498",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    status: "Active",
    registrationDate: "2024-06-15T11:30:00.000Z",
    lastUpdatedDate: "2024-06-15T11:30:00.000Z",
    alumniWallet: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4df",
    achievements: ["Corporate Accounting Award", "Merit Scholar"],
    skills: ["Taxation", "Auditing", "Financial Reporting", "ERP"],
    employment: "Associate Auditor at KPMG",
  },

  // 3. Department of Hotel Management
  {
    alumniId: "ALU-2022-194",
    name: "Vikram Malhotra",
    degree: "Bachelor of Hotel Management & Catering Technology (BHMCT)",
    department: "Department of Hotel Management",
    graduationYear: 2022,
    cgpa: "7.10",
    email: "vikram.m@alumni.edu",
    phone: "+91 96543 21098",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    status: "Revoked",
    revocationReason: "Revoked pursuant to Disciplinary Committee Report #DC-2023/11 regarding falsified pre-requisite credentials",
    registrationDate: "2022-08-01T12:00:00.000Z",
    lastUpdatedDate: "2023-04-18T16:20:00.000Z",
    alumniWallet: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    achievements: [],
    skills: ["Hospitality Operations", "Food & Beverage Management"],
    employment: "Terminated / Under Inquiry",
  },

  // 4. Department of Pharmacy and Medical Sciences
  {
    alumniId: "ALU-2024-210",
    name: "Dr. Mehak Preet",
    degree: "Bachelor of Pharmacy (B.Pharm)",
    department: "Department of Pharmacy and Medical Sciences",
    graduationYear: 2024,
    cgpa: "9.30",
    email: "mehak.preet@alumni.edu",
    phone: "+91 98456 78901",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
    status: "Active",
    registrationDate: "2024-06-15T12:00:00.000Z",
    lastUpdatedDate: "2024-06-15T12:00:00.000Z",
    alumniWallet: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
    achievements: ["Gold Medalist in Pharmacology", "Published Research in IJPS"],
    skills: ["Clinical Research", "Pharmacology", "Drug Formulation", "Pharmaceutics"],
    employment: "Formulation Scientist at Sun Pharma",
  },
  {
    alumniId: "ALU-2024-215",
    name: "Karanvir Singh",
    degree: "B.Sc. Medical Laboratory Sciences (B.Sc. MLS)",
    department: "Department of Pharmacy and Medical Sciences",
    graduationYear: 2024,
    cgpa: "8.80",
    email: "karanvir.s@alumni.edu",
    phone: "+91 98712 34567",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
    status: "Active",
    registrationDate: "2024-06-15T12:15:00.000Z",
    lastUpdatedDate: "2024-06-15T12:15:00.000Z",
    alumniWallet: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
    achievements: ["Best Diagnostic Lab Technologist Award"],
    skills: ["Hematology", "Clinical Biochemistry", "Microbiology", "Pathology"],
    employment: "Senior Lab Technologist at Max Healthcare",
  },

  // 5. Department of Fashion Design
  {
    alumniId: "ALU-2024-301",
    name: "Tanvi Sharma",
    degree: "B.Sc. Fashion Design",
    department: "Department of Fashion Design",
    graduationYear: 2024,
    cgpa: "9.15",
    email: "tanvi.sharma@alumni.edu",
    phone: "+91 98123 98765",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    status: "Active",
    registrationDate: "2024-06-15T12:30:00.000Z",
    lastUpdatedDate: "2024-06-15T12:30:00.000Z",
    alumniWallet: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
    achievements: ["Best Graduate Runway Collection 2024", "Sustainable Fashion Innovator"],
    skills: ["Apparel Design", "Textile Science", "Pattern Drafting", "Fashion Styling"],
    employment: "Apparel Stylist at Aditya Birla Fashion",
  },

  // 6. Department of Technology (at the end)
  {
    alumniId: "ALU-2024-002",
    name: "Priya Patel",
    degree: "Bachelor of Computer Applications (BCA)",
    department: "Department of Technology",
    graduationYear: 2024,
    cgpa: "8.92",
    email: "priya.patel@alumni.edu",
    phone: "+91 98112 34567",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    status: "Active",
    registrationDate: "2024-06-15T11:00:00.000Z",
    lastUpdatedDate: "2024-06-15T11:00:00.000Z",
    alumniWallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    achievements: ["Dean's Honor Roll", "Winner of National Web App Hackathon 2023"],
    skills: ["Full Stack", "Python", "Cloud Architecture", "Database Systems"],
    employment: "Cloud Engineer at Microsoft",
  }
];

export const INITIAL_CERTIFICATES_SEEDS = [
  {
    certificateId: "CERT-2024-8801",
    alumniId: "ALU-2024-001",
    alumniName: "Aarav Sharma",
    title: "Bachelor of Technology in Computer Science & Engineering (Honors)",
    cgpaOrGrade: "9.45 CGPA (Gold Medalist)",
    issueDate: "2024-06-15T10:45:00.000Z",
    certHash: "0x12a3d4f5b6c7e8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3",
    issuer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    isRevoked: false,
    revocationReason: "",
    institution: "Apex University Institute of Technology",
  },
  {
    certificateId: "CERT-2024-8812",
    alumniId: "ALU-2024-012",
    alumniName: "Simran Kaur",
    title: "Bachelor of Technology in Artificial Intelligence & Machine Learning (Honors)",
    cgpaOrGrade: "9.20 CGPA (Dean's Honor Roll)",
    issueDate: "2024-06-15T10:50:00.000Z",
    certHash: "0x556677889900aabbccddeeff0011223344556677889900aabbccddeeff001122",
    issuer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    isRevoked: false,
    revocationReason: "",
    institution: "Apex University Institute of Technology",
  },
  {
    certificateId: "CERT-2024-8803",
    alumniId: "ALU-2024-105",
    alumniName: "Ananya Roy",
    title: "Bachelor of Commerce (B.Com Honors in Financial Accounting)",
    cgpaOrGrade: "9.10 CGPA (First Class with Distinction)",
    issueDate: "2024-06-15T11:45:00.000Z",
    certHash: "0x33445566778899aabbccddeeff00112233445566778899aabbccddeeff001122",
    issuer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    isRevoked: false,
    revocationReason: "",
    institution: "Apex University Institute of Technology",
  },
  {
    certificateId: "CERT-2024-8820",
    alumniId: "ALU-2024-210",
    alumniName: "Dr. Mehak Preet",
    title: "Bachelor of Pharmacy (B.Pharm with Distinction)",
    cgpaOrGrade: "9.30 CGPA (Gold Medalist)",
    issueDate: "2024-06-15T12:10:00.000Z",
    certHash: "0x8899001122334455667788990011223344556677889900112233445566778899",
    issuer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    isRevoked: false,
    revocationReason: "",
    institution: "Apex University Institute of Technology",
  },
  {
    certificateId: "CERT-2024-8830",
    alumniId: "ALU-2024-301",
    alumniName: "Tanvi Sharma",
    title: "Bachelor of Science in Fashion Design (First Class Honors)",
    cgpaOrGrade: "9.15 CGPA (Best Runway Collection)",
    issueDate: "2024-06-15T12:45:00.000Z",
    certHash: "0x4455667788990011223344556677889900112233445566778899001122334455",
    issuer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    isRevoked: false,
    revocationReason: "",
    institution: "Apex University Institute of Technology",
  },
  {
    certificateId: "CERT-2024-8802",
    alumniId: "ALU-2024-002",
    alumniName: "Priya Patel",
    title: "Bachelor of Computer Applications (BCA with Distinction)",
    cgpaOrGrade: "8.92 CGPA (Distinction)",
    issueDate: "2024-06-15T11:15:00.000Z",
    certHash: "0x99a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8",
    issuer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    isRevoked: false,
    revocationReason: "",
    institution: "Apex University Institute of Technology",
  },
  {
    certificateId: "CERT-2022-0044",
    alumniId: "ALU-2022-194",
    alumniName: "Vikram Malhotra",
    title: "Bachelor of Hotel Management & Catering Technology (BHMCT)",
    cgpaOrGrade: "7.10 CGPA",
    issueDate: "2022-08-01T12:30:00.000Z",
    certHash: "0x778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566",
    issuer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    isRevoked: true,
    revocationReason: "Certificate invalidated following disciplinary action and credential revocation",
    institution: "Apex University Institute of Technology",
  }
];

export const INITIAL_TRANSACTIONS_SEEDS = [
  {
    txHash: "0x4b7c89f1a23e5d6c8b9a0123456789abcdef0123456789abcdef0123456789ab",
    type: "Contract Deployment",
    blockNumber: 1,
    from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    to: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    gasUsed: "1,245,670",
    status: "Confirmed",
    timestamp: "2024-06-15T10:00:00.000Z",
    details: "Deployed AlumniRecordManagement.sol with admin authorization",
  },
  {
    txHash: "0x8e12f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2",
    type: "Alumni Registered",
    blockNumber: 2,
    from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    to: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    gasUsed: "148,320",
    status: "Confirmed",
    timestamp: "2024-06-15T10:30:00.000Z",
    details: "Registered Aarav Sharma (ALU-2024-001) with cryptographic dataHash",
  },
  {
    txHash: "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b",
    type: "Certificate Issued",
    blockNumber: 3,
    from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    to: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    gasUsed: "124,510",
    status: "Confirmed",
    timestamp: "2024-06-15T10:45:00.000Z",
    details: "Issued CERT-2024-8801 for B.Tech CSE (Honors) to Aarav Sharma",
  },
  {
    txHash: "0x1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e",
    type: "Alumni Record Updated",
    blockNumber: 4,
    from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    to: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    gasUsed: "68,430",
    status: "Confirmed",
    timestamp: "2024-02-10T14:45:00.000Z",
    details: "Updated degree and specialization for Rohan Verma (ALU-2023-088)",
  },
  {
    txHash: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
    type: "Alumni Record Revoked",
    blockNumber: 5,
    from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    to: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    gasUsed: "47,120",
    status: "Confirmed",
    timestamp: "2023-04-18T16:20:00.000Z",
    details: "Revoked record for Vikram Malhotra (ALU-2022-194) following inquiry",
  }
];

export const getStoredAlumni = () => {
  const versionKey = 'alumnix_schema_v4';
  const hasV4 = localStorage.getItem(versionKey);
  if (!hasV4) {
    localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(INITIAL_ALUMNI_SEEDS));
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES_SEEDS));
    localStorage.setItem(versionKey, 'true');
    return INITIAL_ALUMNI_SEEDS;
  }
  const data = localStorage.getItem(STORAGE_KEYS.ALUMNI);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(INITIAL_ALUMNI_SEEDS));
    return INITIAL_ALUMNI_SEEDS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_ALUMNI_SEEDS;
  }
};

export const saveAlumniRecord = (alumnus) => {
  const list = getStoredAlumni();
  const existingIdx = list.findIndex(a => a.alumniId === alumnus.alumniId);
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...alumnus, lastUpdatedDate: new Date().toISOString() };
  } else {
    list.unshift({
      ...alumnus,
      registrationDate: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString(),
      status: alumnus.status || 'Active',
      achievements: alumnus.achievements || [],
      skills: alumnus.skills || [],
    });
  }
  localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(list));
  return list;
};

export const updateAlumniStatusInStore = (alumniId, newStatus, reason = '') => {
  const list = getStoredAlumni();
  const target = list.find(a => a.alumniId === alumniId);
  if (target) {
    target.status = newStatus;
    if (reason) target.revocationReason = reason;
    target.lastUpdatedDate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(list));
  }
  return list;
};

export const getStoredCertificates = () => {
  const data = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES_SEEDS));
    return INITIAL_CERTIFICATES_SEEDS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_CERTIFICATES_SEEDS;
  }
};

export const saveCertificateRecord = (cert) => {
  const list = getStoredCertificates();
  const existingIdx = list.findIndex(c => c.certificateId === cert.certificateId);
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...cert };
  } else {
    list.unshift({
      ...cert,
      issueDate: cert.issueDate || new Date().toISOString(),
      isRevoked: cert.isRevoked || false,
    });
  }
  localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(list));
  return list;
};

export const revokeCertificateInStore = (certificateId, reason) => {
  const list = getStoredCertificates();
  const target = list.find(c => c.certificateId === certificateId);
  if (target) {
    target.isRevoked = true;
    target.revocationReason = reason;
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(list));
  }
  return list;
};

export const getStoredTransactions = () => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS_SEEDS));
    return INITIAL_TRANSACTIONS_SEEDS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_TRANSACTIONS_SEEDS;
  }
};

export const addTransactionRecord = (tx) => {
  const list = getStoredTransactions();
  list.unshift({
    txHash: tx.txHash || `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
    type: tx.type || 'Smart Contract Call',
    blockNumber: tx.blockNumber || 'Pending',
    from: tx.from || 'Connected Wallet',
    to: tx.to || 'AlumniRecordManagement',
    gasUsed: tx.gasUsed || '65,000',
    status: tx.status || 'Confirmed',
    timestamp: new Date().toISOString(),
    details: tx.details || '',
  });
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(list));
  return list;
};

