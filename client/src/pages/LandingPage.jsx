import React, { useState } from 'react';
import { 
  ShieldCheck, 
  GraduationCap, 
  Award, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Lock, 
  Search, 
  FileCheck2, 
  Cpu, 
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import { CONTRACT_ADDRESS } from '../services/blockchain';

export default function LandingPage({ onNavigate, stats }) {
  const [quickSearchId, setQuickSearchId] = useState('');
  const [searchType, setSearchType] = useState('alumni'); // 'alumni' | 'cert'

  const handleQuickVerify = (e) => {
    e.preventDefault();
    if (!quickSearchId.trim()) return;
    if (searchType === 'alumni') {
      onNavigate('verify-record', quickSearchId.trim());
    } else {
      onNavigate('verify-cert', quickSearchId.trim());
    }
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-brand-500/30 text-xs text-brand-300 shadow-lg shadow-brand-500/10">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
            <span className="font-medium">Ethereum Virtual Machine (EVM) Smart Contract Powered</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-mono">v1.0.0</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Decentralized & Tamper-Proof{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-300 to-blue-500">
              Alumni Records
            </span>
          </h1>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-600 hover:to-blue-700 text-white font-semibold text-sm shadow-xl shadow-brand-500/25 transition hover:scale-[1.02]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('alumni')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition hover:border-slate-600"
            >
              <GraduationCap className="w-4 h-4 text-brand-400" />
              <span>Browse Alumni Directory</span>
            </button>

            <button
              onClick={() => onNavigate('demo-guide')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-sm transition"
            >
              <span>Faculty Demo Guide & Viva</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Verifier Floating Search Box */}
          <div className="max-w-2xl mx-auto mt-10 p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleQuickVerify} className="space-y-3">
              <div className="flex items-center justify-between text-xs px-2 text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-brand-400" />
                  Instant Public Authenticator (No Wallet Required)
                </span>
                <div className="flex gap-2">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="searchType"
                      checked={searchType === 'alumni'}
                      onChange={() => setSearchType('alumni')}
                      className="text-brand-500 focus:ring-0"
                    />
                    <span className={searchType === 'alumni' ? 'text-brand-300 font-medium' : ''}>Alumni ID</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="searchType"
                      checked={searchType === 'cert'}
                      onChange={() => setSearchType('cert')}
                      className="text-brand-500 focus:ring-0"
                    />
                    <span className={searchType === 'cert' ? 'text-brand-300 font-medium' : ''}>Certificate ID</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={quickSearchId}
                  onChange={(e) => setQuickSearchId(e.target.value)}
                  placeholder={searchType === 'alumni' ? 'e.g., ALU-2024-001 or ALU-2024-002' : 'e.g., CERT-2024-8801'}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition font-mono"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-md shadow-brand-500/20"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify On-Chain</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-1">
                <span>Try Demo IDs:</span>
                <button
                  type="button"
                  onClick={() => { setSearchType('alumni'); setQuickSearchId('ALU-2024-001'); }}
                  className="text-brand-300 hover:underline font-mono"
                >
                  ALU-2024-001
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => { setSearchType('cert'); setQuickSearchId('CERT-2024-8801'); }}
                  className="text-cyan-300 hover:underline font-mono"
                >
                  CERT-2024-8801
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => { setSearchType('alumni'); setQuickSearchId('ALU-2022-194'); }}
                  className="text-rose-300 hover:underline font-mono"
                >
                  ALU-2022-194 (Revoked)
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* Metrics Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono mb-1">
              {stats?.totalAlumni || 4}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Total Alumni Registered</div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono mb-1">
              {stats?.totalCertificates || 3}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Certificates Issued</div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-400 font-mono mb-1">
              100%
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">EVM Verifiable Integrity</div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono mb-1">
              0 sec
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Verification Delay</div>
          </div>
        </div>
      </section>

      {/* Architecture & How It Works Diagram Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-semibold text-brand-400 tracking-wider uppercase">System Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Hybrid Blockchain & Off-Chain Storage Flow</h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Sensitive student data is kept private and off-chain, while cryptographic Keccak-256 hashes and verification states are permanently committed to the Ethereum Virtual Machine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Database className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-blue-400 font-bold uppercase">Step 01: Off-Chain Payload</div>
            <h3 className="text-lg font-bold text-white">Academic Record Packaging</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Institution Admin enters the student's name, degree, department, graduation year, and CGPA. A canonical payload string is created and hashed using SHA-3 / Keccak-256.
            </p>
            <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800 truncate">
              dataHash = keccak256(studentData)
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-brand-500/40 shadow-xl shadow-brand-500/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-brand-400 font-bold uppercase">Step 02: On-Chain Settlement</div>
            <h3 className="text-lg font-bold text-white">Solidity Smart Contract</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              MetaMask requests admin signature. The EVM contract <code className="text-brand-300">AlumniRecordManagement.sol</code> verifies caller authorization, stores the record and hash, and emits auditable blockchain events.
            </p>
            <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800 truncate">
              emit AlumniRegistered(alumniId, ...)
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase">Step 03: Public Verification</div>
            <h3 className="text-lg font-bold text-white">Zero-Knowledge Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Employers or universities scan the certificate QR code or enter the Alumni ID. The smart contract validates authenticity, verifying the record is Active and has never been revoked.
            </p>
            <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-emerald-400 border border-slate-800">
              verifyCertificate() → isValid = true
            </div>
          </div>

        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-semibold text-brand-400 tracking-wider uppercase">Key Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Engineered for Academic Excellence</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/30 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Role-Based Access Control</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Only authorized institution registrars and administrators can write records or issue credentials. Protected by Solidity modifiers and custom errors.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/30 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Cryptographic Tamper-Proofing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              If an unauthorized actor alters a grade or name off-chain, the Keccak-256 hash recalculation fails instantly against the on-chain recorded hash.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/30 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Professional PDF Certificates</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate vector-grade, printable PDF certificates with embedded QR codes, chancellor signatures, and smart contract verification footprints.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/30 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Record & Certificate Revocation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Handles real-world disciplinary and administrative revocation scenarios. Revoked credentials display a permanent red warning and reason on-chain.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/30 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Immutable Event Logging</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every registration, update, and issuance emits EVM events that are queryable forever, providing a transparent audit trail for accreditation boards.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/30 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Gas Optimized EVM Code</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uses Solidity 0.8.20 custom errors (<code className="text-rose-300">error NotAuthorized()</code>), memory caching, and packed structs to minimize gas fees.
            </p>
          </div>

        </div>
      </section>

      {/* Demonstration Banner for External Evaluators */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-brand-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Faculty & Examiner Quick-Start</span>
            <h3 className="text-2xl font-bold text-white">Preparing for Project Demonstration?</h3>
            <p className="text-xs text-slate-400 max-w-lg">
              Explore our structured viva preparation guide, architectural flow charts, and test cases covering EVM transactions, MetaMask signers, and cryptographic proofs.
            </p>
          </div>
          <button
            onClick={() => onNavigate('demo-guide')}
            className="whitespace-nowrap px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition hover:scale-105"
          >
            Open Faculty Guide & Viva Q&A
          </button>
        </div>
      </section>

    </div>
  );
}

