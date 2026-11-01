import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Terminal, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

export default function FacultyDemoGuide({ onNavigate }) {
  const [openFaq, setOpenFaq] = useState(0);

  const demoSteps = [
    {
      step: '01',
      title: 'Platform Overview & Architecture Explanation',
      time: '1 Min',
      description: 'Start at the Home / Landing page. Explain the hybrid architecture: sensitive personal information is preserved off-chain to maintain privacy and reduce gas fees, while the cryptographic Keccak-256 hash, verification status, and certificate pointers are permanently committed to the EVM blockchain.',
      action: () => onNavigate('landing'),
      buttonText: 'Go to Landing Page',
    },
    {
      step: '02',
      title: 'MetaMask Connection & Role-Based Access Control',
      time: '1 Min',
      description: 'Open the Admin Dashboard. Point out the connected MetaMask wallet address, network chain ID (31337 on Localhost or 11155111 on Sepolia), and Explain the `onlyAuthorized` and `onlyAdmin` Solidity function modifiers preventing unauthorized callers from writing records.',
      action: () => onNavigate('admin'),
      buttonText: 'View Admin Dashboard',
    },
    {
      step: '03',
      title: 'Registering an Alumnus & Emitting EVM Events',
      time: '1 Min',
      description: 'Click "Register Alumnus" in the Alumni Directory. Fill in student details, show the MetaMask transaction prompt requesting gas and signature, and watch the transaction confirm on-chain. Show that `AlumniRegistered` event is emitted with the cryptographic hash.',
      action: () => onNavigate('alumni'),
      buttonText: 'Go to Alumni Directory',
    },
    {
      step: '04',
      title: 'Issuing a Verifiable Certificate & PDF Export',
      time: '1 Min',
      description: 'Navigate to Certificate Management. Issue a degree certificate for the registered alumnus. Show the generated Certificate ID, the dynamic QR code, and click "Download PDF" to showcase the high-resolution vector academic certificate.',
      action: () => onNavigate('certificates'),
      buttonText: 'Open Certificate Portal',
    },
    {
      step: '05',
      title: 'Public Zero-Knowledge Verification & Revocation Demo',
      time: '1 Min',
      description: 'Open the Public Verification pages (Record & Certificate). Enter the valid ID (e.g. `ALU-2024-001` or `CERT-2024-8801`) to trigger the centered cryptographic verification badge and checkmark. Next, demonstrate revocation of `ALU-2022-194` or `CERT-2022-0044` to prove the smart contract immediately protects employers against fraudulent or voided credentials.',
      action: () => onNavigate('verify-record', 'ALU-2024-001'),
      buttonText: 'Test Public Verifier',
    },
  ];

  const vivaQuestions = [
    {
      q: "1. What is the core problem this project solves using Blockchain?",
      a: "Traditional educational records are stored in centralized databases (SQL) or paper archives, which are vulnerable to internal tampering, database hacking, forging, and slow manual background checks. Our system uses an immutable Solidity smart contract on the Ethereum Virtual Machine (EVM) to anchor cryptographic Keccak-256 hashes of academic credentials, enabling instant, trustless public verification without middlemen."
    },
    {
      q: "2. Why don't we store all student records and PDFs directly on the blockchain?",
      a: "Storing large strings or files directly on EVM storage is prohibitively expensive in terms of gas fees (~20,000 gas per 32-byte storage slot) and violates student data privacy regulations (GDPR / Right to be Forgotten). Instead, we adopt a hybrid architecture: sensitive records are kept off-chain, and only the cryptographic hash (keccak256), verification status, and timestamps are stored on-chain."
    },
    {
      q: "3. What is Keccak-256 and how does it prevent credential forgery?",
      a: "Keccak-256 is the cryptographic hashing algorithm standardized in Ethereum (SHA-3 family). It is a one-way mathematical function that outputs a deterministic 256-bit hash. Even if a bad actor alters a single character (e.g., changing CGPA from 6.5 to 9.5), the resulting Keccak-256 hash completely changes (avalanche effect). When compared with the on-chain recorded hash, validation fails instantly."
    },
    {
      q: "4. How does the Public Verifier work without paying gas fees?",
      a: "Smart contract functions marked as `view` or `pure` (like our `verifyAlumni()` and `verifyCertificate()`) execute locally on the node using read-only EVM calls (`eth_call`). They do not modify blockchain state and do not create a transaction block, which means public verifiers and employers can verify credentials completely for free without paying gas or even needing MetaMask."
    },
    {
      q: "5. How does Role-Based Access Control (RBAC) work in your smart contract?",
      a: "In `AlumniRecordManagement.sol`, we define custom modifiers `onlyAdmin` and `onlyAuthorized`. Only the designated institution administrator or authorized registrars (stored in a `mapping(address => bool)`) can execute state-changing functions like `registerAlumni`, `updateAlumniRecord`, `issueCertificate`, or `revokeCertificate`. Unauthorized calls revert with custom error `NotAuthorized()`."
    },
    {
      q: "6. How is degree revocation handled on an immutable blockchain?",
      a: "Blockchain transactions and historical states are immutable (cannot be deleted). However, smart contracts can model state machines. We store an enum `RecordStatus { Active, Updated, Revoked }` and a boolean `isRevoked`. When an admin revokes a credential, a state transition transaction is recorded along with the revocation reason and timestamp. The `verifyCertificate()` function checks `!cert.isRevoked`, immediately alerting verifiers."
    },
    {
      q: "7. What are EVM Events and why are they used in this project?",
      a: "Events (such as `AlumniRegistered`, `CertificateIssued`, `AlumniRecordRevoked`) allow smart contracts to write logs to the EVM transaction receipt bloom filters. Storing data in logs costs significantly less gas than contract storage and allows frontend applications (like our Blockchain Explorer page) to index and query complete historical audit trails efficiently using `queryFilter()`."
    },
    {
      q: "8. What is MetaMask and what role does it play in this architecture?",
      a: "MetaMask acts as an EVM wallet and Web3 provider (`window.ethereum`). It securely manages private keys in the browser, signs Ethereum transactions with ECDSA signatures, calculates estimated gas, prompts the administrator for transaction approval, and submits raw signed transactions to the RPC network node."
    },
    {
      q: "9. Why did you use Solidity 0.8.20 and Custom Errors instead of revert strings?",
      a: "Solidity 0.8+ has built-in arithmetic overflow/underflow checks. Starting from Solidity 0.8.4, custom errors (e.g., `error AlumniNotFound(string id)`) were introduced. Custom errors are 4-byte selectors (keccak256 hash of the error signature), saving substantial deployment and execution gas compared to lengthy ASCII revert strings."
    },
    {
      q: "10. How would this system scale to a public testnet like Sepolia or mainnet?",
      a: "Our Hardhat configuration and frontend already support the Sepolia testnet (Chain ID 11155111). By simply providing a Sepolia RPC URL (via Infura/Alchemy) and an administrative private key, the contract can be deployed to Sepolia, and any employer worldwide can verify credentials on Sepolia Etherscan."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>B.Tech Final Year Academic Evaluation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Faculty Demonstration & Viva Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          A structured 5-minute presentation workflow and answers to top examination questions covering EVM mechanics, cryptographic proofs, and Solidity architecture.
        </p>
      </div>

      {/* 5-Minute Live Demo Script Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Play className="w-5 h-5 text-brand-400 fill-brand-400" />
            <span>Recommended 5-Minute Demonstration Script</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">Total Duration: 5 Mins</span>
        </div>

        <div className="space-y-3">
          {demoSteps.map((item, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-brand-500/30 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <span className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-brand-400 text-sm flex-shrink-0">
                  {item.step}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">{item.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                    {item.description}
                  </p>
                </div>
              </div>

              <button
                onClick={item.action}
                className="whitespace-nowrap px-4 py-2 bg-slate-800 hover:bg-brand-500 hover:text-white text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5 flex-shrink-0"
              >
                <span>{item.buttonText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Viva Questions Accordion */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <span>Frequently Asked Viva Questions & Model Answers</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Carefully curated to address theoretical and practical questions typically posed by external examiners.
          </p>
        </div>

        <div className="space-y-3">
          {vivaQuestions.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-850/50 transition"
                >
                  <span className="font-bold text-slate-200 text-xs sm:text-sm">
                    {item.q}
                  </span>
                  <div className="p-1 rounded-lg bg-slate-800 text-slate-400 flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4 bg-slate-950/40">
                    <p className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

