import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { ethers } = hre;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("-------------------------------------------------------");
  console.log("🚀 Starting AlumniRecordManagement Contract Deployment...");
  console.log("-------------------------------------------------------");

  const signers = await ethers.getSigners();
  const deployer = signers[0];
  console.log("Deployer Address:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer Balance:", ethers.formatEther(balance), "ETH");

  const institutionName = "Apex University Institute of Technology";
  const AlumniRecordManagement = await ethers.getContractFactory("AlumniRecordManagement");
  const contract = await AlumniRecordManagement.deploy(institutionName);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ Smart Contract deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Institution Name:", institutionName);

  // Read ABI from Hardhat artifact
  const artifactPath = path.resolve(
    __dirname,
    "../client/src/contracts/artifacts/contracts/AlumniRecordManagement.sol/AlumniRecordManagement.json"
  );

  let abi = [];
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
    abi = artifact.abi;
  }

  // Export contract config for frontend
  const clientContractsDir = path.resolve(__dirname, "../client/src/contracts");
  if (!fs.existsSync(clientContractsDir)) {
    fs.mkdirSync(clientContractsDir, { recursive: true });
  }

  const contractInfo = {
    address: contractAddress,
    institutionName: institutionName,
    deployer: deployer.address,
    network: hre.network.name,
    chainId: hre.network.config.chainId || 31337,
    deployedAt: new Date().toISOString(),
    abi: abi,
  };

  const outputPath = path.join(clientContractsDir, "AlumniRecordManagement.json");
  fs.writeFileSync(outputPath, JSON.stringify(contractInfo, null, 2));
  console.log(`💾 Exported deployed contract details and ABI to: ${outputPath}`);

  console.log("-------------------------------------------------------");
  console.log("🌱 Seeding realistic demonstration records onto blockchain...");
  console.log("-------------------------------------------------------");

  // Demo Record 1: B.Tech Computer Science & Engineering -> Department of Engineering and Technology
  const hash1 = ethers.keccak256(
    ethers.toUtf8Bytes("Aarav Sharma|B.Tech Computer Science & Engineering|Department of Engineering and Technology|2024|9.45")
  );
  let tx1 = await contract.registerAlumni(
    "ALU-2024-001",
    "Aarav Sharma",
    "B.Tech Computer Science & Engineering",
    "Department of Engineering and Technology",
    2024,
    hash1,
    deployer.address
  );
  await tx1.wait();
  console.log("✔ Registered Alumnus: Aarav Sharma (ALU-2024-001) - Department of Engineering and Technology");

  const certHash1 = ethers.keccak256(
    ethers.toUtf8Bytes("CERT-2024-8801|ALU-2024-001|Aarav Sharma|B.Tech CSE|9.45 CGPA|Honors")
  );
  let certTx1 = await contract.issueCertificate(
    "CERT-2024-8801",
    "ALU-2024-001",
    "Bachelor of Technology in Computer Science & Engineering (Honors)",
    "9.45 CGPA (Gold Medalist)",
    certHash1
  );
  await certTx1.wait();
  console.log("✔ Issued Certificate: CERT-2024-8801 to Aarav Sharma");

  // Demo Record 1B: B.Tech AI & ML -> Department of Engineering and Technology
  const hash1b = ethers.keccak256(
    ethers.toUtf8Bytes("Simran Kaur|B.Tech Artificial Intelligence & Machine Learning (AI & ML)|Department of Engineering and Technology|2024|9.20")
  );
  let tx1b = await contract.registerAlumni(
    "ALU-2024-012",
    "Simran Kaur",
    "B.Tech Artificial Intelligence & Machine Learning (AI & ML)",
    "Department of Engineering and Technology",
    2024,
    hash1b,
    signers[1].address
  );
  await tx1b.wait();
  console.log("✔ Registered Alumnus: Simran Kaur (ALU-2024-012) - Department of Engineering and Technology");

  // Demo Record 1C: B.Tech Mechanical Engineering -> Department of Engineering and Technology
  const hash1c = ethers.keccak256(
    ethers.toUtf8Bytes("Arjun Kapoor|B.Tech Mechanical Engineering|Department of Engineering and Technology|2023|8.60")
  );
  let tx1c = await contract.registerAlumni(
    "ALU-2023-045",
    "Arjun Kapoor",
    "B.Tech Mechanical Engineering",
    "Department of Engineering and Technology",
    2023,
    hash1c,
    signers[2].address
  );
  await tx1c.wait();
  console.log("✔ Registered Alumnus: Arjun Kapoor (ALU-2023-045) - Department of Engineering and Technology");

  // Demo Record 1D: B.Tech Civil Engineering -> Department of Engineering and Technology
  const hash1d = ethers.keccak256(
    ethers.toUtf8Bytes("Harpreet Singh|B.Tech Civil Engineering|Department of Engineering and Technology|2023|8.35")
  );
  let tx1d = await contract.registerAlumni(
    "ALU-2023-055",
    "Harpreet Singh",
    "B.Tech Civil Engineering",
    "Department of Engineering and Technology",
    2023,
    hash1d,
    signers[3].address
  );
  await tx1d.wait();
  console.log("✔ Registered Alumnus: Harpreet Singh (ALU-2023-055) - Department of Engineering and Technology");

  // Demo Record 2: Bachelor of Business Administration (BBA) -> Department of Management
  const hash3 = ethers.keccak256(
    ethers.toUtf8Bytes("Rohan Verma|Bachelor of Business Administration (BBA)|Department of Management|2023|8.20")
  );
  let tx3 = await contract.registerAlumni(
    "ALU-2023-088",
    "Rohan Verma",
    "Bachelor of Business Administration (BBA)",
    "Department of Management",
    2023,
    hash3,
    signers[4].address
  );
  await tx3.wait();

  // Update record
  const updatedHash3 = ethers.keccak256(
    ethers.toUtf8Bytes("Rohan Verma|Bachelor of Business Administration (BBA in Finance)|Department of Management|2023|8.45")
  );
  let updateTx3 = await contract.updateAlumniRecord(
    "ALU-2023-088",
    "Bachelor of Business Administration (BBA in Finance)",
    "Department of Management",
    updatedHash3,
    signers[4].address
  );
  await updateTx3.wait();
  console.log("✔ Registered & Updated Alumnus: Rohan Verma (ALU-2023-088) - Department of Management");

  // Demo Record 3: Bachelor of Commerce (B.Com) -> Department of Management
  const hash4 = ethers.keccak256(
    ethers.toUtf8Bytes("Ananya Roy|Bachelor of Commerce (B.Com)|Department of Management|2024|9.10")
  );
  let tx4 = await contract.registerAlumni(
    "ALU-2024-105",
    "Ananya Roy",
    "Bachelor of Commerce (B.Com)",
    "Department of Management",
    2024,
    hash4,
    signers[5].address
  );
  await tx4.wait();
  console.log("✔ Registered Alumnus: Ananya Roy (ALU-2024-105) - Department of Management");

  const certHash3 = ethers.keccak256(
    ethers.toUtf8Bytes("CERT-2024-8803|ALU-2024-105|Ananya Roy|B.Com|9.10 CGPA")
  );
  let certTx3 = await contract.issueCertificate(
    "CERT-2024-8803",
    "ALU-2024-105",
    "Bachelor of Commerce (B.Com Honors in Financial Accounting)",
    "9.10 CGPA (First Class with Distinction)",
    certHash3
  );
  await certTx3.wait();
  console.log("✔ Issued Certificate: CERT-2024-8803 to Ananya Roy");

  // Demo Record 4: Bachelor of Hotel Management & Catering Technology (BHMCT) -> Department of Hotel Management (Revoked Record)
  const hash5 = ethers.keccak256(
    ethers.toUtf8Bytes("Vikram Malhotra|Bachelor of Hotel Management & Catering Technology (BHMCT)|Department of Hotel Management|2022|7.10")
  );
  let tx5 = await contract.registerAlumni(
    "ALU-2022-194",
    "Vikram Malhotra",
    "Bachelor of Hotel Management & Catering Technology (BHMCT)",
    "Department of Hotel Management",
    2022,
    hash5,
    signers[6].address
  );
  await tx5.wait();

  let revokeTx5 = await contract.revokeAlumniRecord(
    "ALU-2022-194",
    "Revoked pursuant to Disciplinary Committee Report #DC-2023/11 regarding falsified pre-requisite credentials"
  );
  await revokeTx5.wait();
  console.log("✔ Registered & Revoked Alumnus: Vikram Malhotra (ALU-2022-194) - Department of Hotel Management");

  // Revoked Certificate for demo verification
  const revokedCertHash = ethers.keccak256(
    ethers.toUtf8Bytes("CERT-2022-0044|Vikram Malhotra|BHMCT|Cancelled")
  );
  let certTx5 = await contract.issueCertificate(
    "CERT-2022-0044",
    "ALU-2022-194",
    "Bachelor of Hotel Management & Catering Technology (BHMCT)",
    "7.10 CGPA",
    revokedCertHash
  );
  await certTx5.wait();
  let certRevokeTx5 = await contract.revokeCertificate(
    "CERT-2022-0044",
    "Certificate invalidated following disciplinary action and credential revocation"
  );
  await certRevokeTx5.wait();
  console.log("✔ Issued & Revoked Certificate: CERT-2022-0044 -> Status: Revoked (Demo Audit)");

  // Demo Record 5: Bachelor of Pharmacy (B.Pharm) -> Department of Pharmacy and Medical Sciences
  const hashPharm = ethers.keccak256(
    ethers.toUtf8Bytes("Dr. Mehak Preet|Bachelor of Pharmacy (B.Pharm)|Department of Pharmacy and Medical Sciences|2024|9.30")
  );
  let txPharm = await contract.registerAlumni(
    "ALU-2024-210",
    "Dr. Mehak Preet",
    "Bachelor of Pharmacy (B.Pharm)",
    "Department of Pharmacy and Medical Sciences",
    2024,
    hashPharm,
    signers[7].address
  );
  await txPharm.wait();
  console.log("✔ Registered Alumnus: Dr. Mehak Preet (ALU-2024-210) - Department of Pharmacy and Medical Sciences");

  // Demo Record 6: B.Sc. Medical Laboratory Sciences (B.Sc. MLS) -> Department of Pharmacy and Medical Sciences
  const hashMLS = ethers.keccak256(
    ethers.toUtf8Bytes("Karanvir Singh|B.Sc. Medical Laboratory Sciences (B.Sc. MLS)|Department of Pharmacy and Medical Sciences|2024|8.80")
  );
  let txMLS = await contract.registerAlumni(
    "ALU-2024-215",
    "Karanvir Singh",
    "B.Sc. Medical Laboratory Sciences (B.Sc. MLS)",
    "Department of Pharmacy and Medical Sciences",
    2024,
    hashMLS,
    signers[8].address
  );
  await txMLS.wait();
  console.log("✔ Registered Alumnus: Karanvir Singh (ALU-2024-215) - Department of Pharmacy and Medical Sciences");

  // Demo Record 7: B.Sc. Fashion Design -> Department of Fashion Design
  const hashFD = ethers.keccak256(
    ethers.toUtf8Bytes("Tanvi Sharma|B.Sc. Fashion Design|Department of Fashion Design|2024|9.15")
  );
  let txFD = await contract.registerAlumni(
    "ALU-2024-301",
    "Tanvi Sharma",
    "B.Sc. Fashion Design",
    "Department of Fashion Design",
    2024,
    hashFD,
    signers[9].address
  );
  await txFD.wait();
  console.log("✔ Registered Alumnus: Tanvi Sharma (ALU-2024-301) - Department of Fashion Design");

  // Demo Record 8: Bachelor of Computer Applications (BCA) -> Department of Technology (AT THE END)
  const hash2 = ethers.keccak256(
    ethers.toUtf8Bytes("Priya Patel|Bachelor of Computer Applications (BCA)|Department of Technology|2024|8.92")
  );
  let tx2 = await contract.registerAlumni(
    "ALU-2024-002",
    "Priya Patel",
    "Bachelor of Computer Applications (BCA)",
    "Department of Technology",
    2024,
    hash2,
    signers[10].address
  );
  await tx2.wait();
  console.log("✔ Registered Alumnus: Priya Patel (ALU-2024-002) - Department of Technology (End of List)");

  const certHash2 = ethers.keccak256(
    ethers.toUtf8Bytes("CERT-2024-8802|ALU-2024-002|Priya Patel|BCA|8.92 CGPA")
  );
  let certTx2 = await contract.issueCertificate(
    "CERT-2024-8802",
    "ALU-2024-002",
    "Bachelor of Computer Applications (BCA with Distinction)",
    "8.92 CGPA (Distinction)",
    certHash2
  );
  await certTx2.wait();
  console.log("✔ Issued Certificate: CERT-2024-8802 to Priya Patel");

  console.log("-------------------------------------------------------");
  console.log("🎉 Seeding complete! All on-chain records and certificates ready.");
  console.log("-------------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

