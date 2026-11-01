import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("AlumniRecordManagement Smart Contract", function () {
  let AlumniRecordManagement;
  let contract;
  let owner;
  let registrar;
  let student1;
  let student2;
  let unauthorized;

  const sampleAlumniId = "ALU-2024-001";
  const sampleName = "Aarav Sharma";
  const sampleDegree = "B.Tech Computer Science & Engineering";
  const sampleDept = "Computer Science";
  const sampleYear = 2024;
  const sampleDataHash = ethers.keccak256(
    ethers.toUtf8Bytes("Aarav Sharma|B.Tech CSE|2024|9.4CGPA|DISTINCTION")
  );

  const sampleCertId = "CERT-2024-9901";
  const sampleCertTitle = "Degree of Bachelor of Technology";
  const sampleGrade = "First Class with Distinction (9.4 CGPA)";
  const sampleCertHash = ethers.keccak256(
    ethers.toUtf8Bytes("CERT-2024-9901|ALU-2024-001|Aarav Sharma|9.4")
  );

  beforeEach(async function () {
    [owner, registrar, student1, student2, unauthorized] = await ethers.getSigners();
    AlumniRecordManagement = await ethers.getContractFactory("AlumniRecordManagement");
    contract = await AlumniRecordManagement.deploy("Apex Institute of Technology");
    await contract.waitForDeployment();
  });

  describe("1. Deployment & Administrative Setup", function () {
    it("should set the deployer as institution admin and authorized registrar", async function () {
      expect(await contract.institutionAdmin()).to.equal(owner.address);
      expect(await contract.isAuthorizedRegistrar(owner.address)).to.be.true;
      expect(await contract.institutionName()).to.equal("Apex Institute of Technology");
    });

    it("should allow admin to authorize and revoke registrars", async function () {
      await expect(contract.authorizeRegistrar(registrar.address))
        .to.emit(contract, "RegistrarAuthorized")
        .withArgs(registrar.address, owner.address, (await ethers.provider.getBlock("latest")).timestamp + 1);

      expect(await contract.isAuthorizedRegistrar(registrar.address)).to.be.true;

      await expect(contract.revokeRegistrar(registrar.address))
        .to.emit(contract, "RegistrarRevoked");

      expect(await contract.isAuthorizedRegistrar(registrar.address)).to.be.false;
    });

    it("should reject non-admin attempts to authorize registrars", async function () {
      await expect(
        contract.connect(unauthorized).authorizeRegistrar(registrar.address)
      ).to.be.revertedWithCustomError(contract, "OnlyAdminAllowed");
    });
  });

  describe("2. Alumni Registration", function () {
    it("should successfully register an alumnus and emit AlumniRegistered event", async function () {
      const tx = await contract.registerAlumni(
        sampleAlumniId,
        sampleName,
        sampleDegree,
        sampleDept,
        sampleYear,
        sampleDataHash,
        student1.address
      );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      const alumni = await contract.getAlumni(sampleAlumniId);
      expect(alumni.alumniId).to.equal(sampleAlumniId);
      expect(alumni.name).to.equal(sampleName);
      expect(alumni.degree).to.equal(sampleDegree);
      expect(alumni.department).to.equal(sampleDept);
      expect(alumni.graduationYear).to.equal(sampleYear);
      expect(alumni.dataHash).to.equal(sampleDataHash);
      expect(alumni.alumniWallet).to.equal(student1.address);
      expect(alumni.status).to.equal(0); // Active
      expect(alumni.isRegistered).to.be.true;

      const ids = await contract.getAllAlumniIds();
      expect(ids.length).to.equal(1);
      expect(ids[0]).to.equal(sampleAlumniId);
    });

    it("should prevent duplicate alumni registration", async function () {
      await contract.registerAlumni(
        sampleAlumniId,
        sampleName,
        sampleDegree,
        sampleDept,
        sampleYear,
        sampleDataHash,
        student1.address
      );

      await expect(
        contract.registerAlumni(
          sampleAlumniId,
          sampleName,
          sampleDegree,
          sampleDept,
          sampleYear,
          sampleDataHash,
          student1.address
        )
      ).to.be.revertedWithCustomError(contract, "AlumniAlreadyExists");
    });

    it("should reject registration from unauthorized users", async function () {
      await expect(
        contract.connect(unauthorized).registerAlumni(
          sampleAlumniId,
          sampleName,
          sampleDegree,
          sampleDept,
          sampleYear,
          sampleDataHash,
          student1.address
        )
      ).to.be.revertedWithCustomError(contract, "NotAuthorized");
    });
  });

  describe("3. Record Updates & Integrity", function () {
    beforeEach(async function () {
      await contract.registerAlumni(
        sampleAlumniId,
        sampleName,
        sampleDegree,
        sampleDept,
        sampleYear,
        sampleDataHash,
        student1.address
      );
    });

    it("should allow authorized registrar to update record and reflect Updated status", async function () {
      const newDegree = "B.Tech CSE (Honors with AI Specialization)";
      const newDept = "School of Computing";
      const newDataHash = ethers.keccak256(
        ethers.toUtf8Bytes("Updated Record Payload with Honors")
      );

      await expect(
        contract.updateAlumniRecord(
          sampleAlumniId,
          newDegree,
          newDept,
          newDataHash,
          student1.address
        )
      ).to.emit(contract, "AlumniRecordUpdated");

      const alumni = await contract.getAlumni(sampleAlumniId);
      expect(alumni.degree).to.equal(newDegree);
      expect(alumni.department).to.equal(newDept);
      expect(alumni.dataHash).to.equal(newDataHash);
      expect(alumni.status).to.equal(1); // Updated
    });
  });

  describe("4. Alumni Revocation & Reinstatement", function () {
    beforeEach(async function () {
      await contract.registerAlumni(
        sampleAlumniId,
        sampleName,
        sampleDegree,
        sampleDept,
        sampleYear,
        sampleDataHash,
        student1.address
      );
    });

    it("should allow revoking an alumni record with reason and block verification", async function () {
      const reason = "Severe disciplinary violation / Academic fraud detected";
      await expect(contract.revokeAlumniRecord(sampleAlumniId, reason))
        .to.emit(contract, "AlumniRecordRevoked")
        .withArgs(sampleAlumniId, reason, owner.address, (await ethers.provider.getBlock("latest")).timestamp + 1);

      const alumni = await contract.getAlumni(sampleAlumniId);
      expect(alumni.status).to.equal(2); // Revoked
      expect(alumni.revocationReason).to.equal(reason);

      const [isValid] = await contract.verifyAlumni(sampleAlumniId);
      expect(isValid).to.be.false;
    });

    it("should allow admin to reinstate a revoked record", async function () {
      await contract.revokeAlumniRecord(sampleAlumniId, "Pending audit");
      let [isValidBefore] = await contract.verifyAlumni(sampleAlumniId);
      expect(isValidBefore).to.be.false;

      await expect(contract.reinstateAlumniRecord(sampleAlumniId))
        .to.emit(contract, "AlumniRecordReinstated");

      const [isValidAfter, alumni] = await contract.verifyAlumni(sampleAlumniId);
      expect(isValidAfter).to.be.true;
      expect(alumni.status).to.equal(0); // Active
    });
  });

  describe("5. Certificate Issuance & Linking", function () {
    beforeEach(async function () {
      await contract.registerAlumni(
        sampleAlumniId,
        sampleName,
        sampleDegree,
        sampleDept,
        sampleYear,
        sampleDataHash,
        student1.address
      );
    });

    it("should issue a certificate linked to an alumnus", async function () {
      await expect(
        contract.issueCertificate(
          sampleCertId,
          sampleAlumniId,
          sampleCertTitle,
          sampleGrade,
          sampleCertHash
        )
      )
        .to.emit(contract, "CertificateIssued")
        .withArgs(
          sampleCertId,
          sampleAlumniId,
          sampleCertTitle,
          sampleCertHash,
          owner.address,
          (await ethers.provider.getBlock("latest")).timestamp + 1
        );

      const cert = await contract.getCertificate(sampleCertId);
      expect(cert.certificateId).to.equal(sampleCertId);
      expect(cert.alumniId).to.equal(sampleAlumniId);
      expect(cert.title).to.equal(sampleCertTitle);
      expect(cert.cgpaOrGrade).to.equal(sampleGrade);
      expect(cert.certHash).to.equal(sampleCertHash);
      expect(cert.issuer).to.equal(owner.address);
      expect(cert.isRevoked).to.be.false;

      const certIds = await contract.getAlumniCertificates(sampleAlumniId);
      expect(certIds.length).to.equal(1);
      expect(certIds[0]).to.equal(sampleCertId);
    });

    it("should prevent duplicate certificate ID issuance", async function () {
      await contract.issueCertificate(
        sampleCertId,
        sampleAlumniId,
        sampleCertTitle,
        sampleGrade,
        sampleCertHash
      );

      await expect(
        contract.issueCertificate(
          sampleCertId,
          sampleAlumniId,
          sampleCertTitle,
          sampleGrade,
          sampleCertHash
        )
      ).to.be.revertedWithCustomError(contract, "CertificateAlreadyExists");
    });
  });

  describe("6. Certificate Revocation & Verification", function () {
    beforeEach(async function () {
      await contract.registerAlumni(
        sampleAlumniId,
        sampleName,
        sampleDegree,
        sampleDept,
        sampleYear,
        sampleDataHash,
        student1.address
      );
      await contract.issueCertificate(
        sampleCertId,
        sampleAlumniId,
        sampleCertTitle,
        sampleGrade,
        sampleCertHash
      );
    });

    it("should verify genuine active certificate as valid", async function () {
      const [isValid, cert] = await contract.verifyCertificate(sampleCertId);
      expect(isValid).to.be.true;
      expect(cert.certificateId).to.equal(sampleCertId);
      expect(cert.isRevoked).to.be.false;
    });

    it("should revoke certificate and show invalid upon verification", async function () {
      const reason = "Administrative revocation due to forged prerequisite transcripts";
      await expect(contract.revokeCertificate(sampleCertId, reason))
        .to.emit(contract, "CertificateRevoked")
        .withArgs(sampleCertId, sampleAlumniId, reason, owner.address, (await ethers.provider.getBlock("latest")).timestamp + 1);

      const [isValid, cert] = await contract.verifyCertificate(sampleCertId);
      expect(isValid).to.be.false;
      expect(cert.isRevoked).to.be.true;
      expect(cert.revocationReason).to.equal(reason);
    });
  });

  describe("7. System Statistics Aggregation", function () {
    it("should return accurate aggregate statistics", async function () {
      await contract.registerAlumni(
        "ALU-1", "Student One", "Degree A", "CS", 2024, ethers.ZeroHash, ethers.ZeroAddress
      );
      await contract.registerAlumni(
        "ALU-2", "Student Two", "Degree B", "IT", 2024, ethers.ZeroHash, ethers.ZeroAddress
      );
      await contract.issueCertificate(
        "CERT-1", "ALU-1", "Graduation Cert", "8.5", ethers.ZeroHash
      );

      const stats = await contract.getSystemStatistics();
      expect(stats._totalAlumni).to.equal(2);
      expect(stats._activeAlumni).to.equal(2);
      expect(stats._revokedAlumni).to.equal(0);
      expect(stats._totalCertificates).to.equal(1);
      expect(stats._activeCertificates).to.equal(1);
      expect(stats._revokedCertificates).to.equal(0);

      await contract.revokeAlumniRecord("ALU-2", "Revoked");
      const statsAfter = await contract.getSystemStatistics();
      expect(statsAfter._activeAlumni).to.equal(1);
      expect(statsAfter._revokedAlumni).to.equal(1);
    });
  });
});

