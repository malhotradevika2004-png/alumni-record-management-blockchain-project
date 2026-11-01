# Faculty Demonstration Script
## Step-by-Step 5-Minute Presentation Workflow

---

## Script Overview for Examiners

| Minute | Stage | Action / Talking Point |
|---|---|---|
| **00:00 - 01:00** | Introduction & Problem Statement | Introduce credential fraud, limitations of centralized SQL, and the Hybrid Blockchain Architecture. |
| **01:00 - 02:00** | Admin Dashboard & MetaMask | Connect MetaMask, show deployed contract `0x5FbDB...aa3`, explain Role-Based Access Control (`onlyAdmin`). |
| **02:00 - 03:00** | Registering Alumnus on EVM | Register new student, show real MetaMask signing prompt, block confirmation, and gas consumption. |
| **03:00 - 04:00** | Certificate Issuance & PDF | Issue degree certificate, display dynamic QR code, and click "Download PDF" to show vector printable degree. |
| **04:00 - 05:00** | Public Verification & Revocation | Verify authentic record (`ALU-2024-001`), then verify revoked record (`ALU-2022-194`) to demonstrate fraud detection. |

---

## Detailed Demonstration Steps

### Step 1: Landing Page & Hybrid Architecture (Minute 1)
- **Action:** Open `http://localhost:3000`.
- **Explain to Faculty:**
  > "Respected examiners, our project addresses the global epidemic of forged diplomas and slow manual verification. Rather than storing large files directly on blockchain storage—which would incur high gas costs and compromise student privacy—we designed a **hybrid on-chain/off-chain model**."
- **Point out:**
  - Keccak-256 cryptographic hashes anchored on the EVM.
  - Interactive Public Verifier box directly on the hero page.

---

### Step 2: Admin Dashboard & MetaMask Integration (Minute 2)
- **Action:** Click **Admin Dashboard** in the navbar.
- **Explain to Faculty:**
  > "Here, the institution admin connects their Web3 wallet. Our system reads live smart contract state directly from the Ethereum Virtual Machine, showing total registered alumni, issued certificates, and network health."
- **Point out:**
  - Hardhat Localhost Network (Chain ID: 31337).
  - Admin wallet balance (10,000 ETH).
  - Smart contract address `0x5FbDB2315678afecb367f032d93F642f64180aa3`.

---

### Step 3: Registering a New Alumnus on Blockchain (Minute 3)
- **Action:** Click **Register Alumnus** $\rightarrow$ Click **Autofill Sample** $\rightarrow$ Click **Submit to Blockchain**.
- **Demonstrate:**
  - MetaMask opens automatically requesting signature and gas approval.
  - Explain: *"Notice how our frontend does not fake transactions. It sends a genuine EVM transaction calling `registerAlumni()` on the smart contract."*
  - Approve in MetaMask.
  - The transaction confirmation modal displays Tx Hash, Block Number, and Gas Used.
  - Open **Blockchain Explorer** to show the newly emitted `AlumniRegistered` event log.

---

### Step 4: Issuing a Verifiable Certificate & PDF Export (Minute 4)
- **Action:** Click **Certificates** $\rightarrow$ Click **Issue New Certificate**.
- **Demonstrate:**
  - Select the student from the registered list.
  - Confirm unique Certificate ID (e.g., `CERT-2024-XXXX`).
  - Submit transaction in MetaMask.
  - Show the newly minted credential on the dashboard.
  - Click **Download PDF**: show the downloaded high-resolution vector PDF certificate with chancellor signature lines, digital watermark, and embedded QR code.

---

### Step 5: Public Authenticity Verification & Tamper / Revocation Test (Minute 5)
- **Action 1:** Go to **Verify Record** $\rightarrow$ Enter `ALU-2024-001`.
  - Confetti fires! Green verified badge appears showing student name, honors, graduation year, and on-chain Keccak-256 dataHash.
- **Action 2:** Now enter the revoked record `ALU-2022-194`.
  - The smart contract returns `isValid: false`, displaying a prominent red Revoked alert with the exact administrative ruling:
  - *"Revoked pursuant to Disciplinary Committee Report #DC-2023/11 regarding falsified pre-requisite credentials."*
- **Conclude to Faculty:**
  > "This proves that our system provides true end-to-end credential authenticity, eliminates degree fraud, and empowers any employer to verify degrees in zero seconds for zero gas fees."

