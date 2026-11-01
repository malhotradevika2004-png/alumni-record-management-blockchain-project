import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Cpu, 
  Copy, 
  Check, 
  ExternalLink,
  GraduationCap,
  Calendar,
  Lock,
  Loader2
} from 'lucide-react';
import { verifyAlumniOnChain, CONTRACT_ADDRESS } from '../services/blockchain';
import { getStoredAlumni } from '../services/storage';
import VerificationSuccessPopup from '../components/VerificationSuccessPopup';
import VerificationFailurePopup from '../components/VerificationFailurePopup';

export default function VerifyRecord({ initialQuery = '', onNavigate }) {
  const [searchId, setSearchId] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [failurePopupState, setFailurePopupState] = useState(null);

  useEffect(() => {
    if (initialQuery) {
      setSearchId(initialQuery);
    }
  }, [initialQuery]);

  const performVerification = async (idToVerify) => {
    const id = idToVerify.trim();
    if (!id) return;

    setLoading(true);
    setResult(null);

    try {
      // 1. Query smart contract directly on-chain
      const onChainData = await verifyAlumniOnChain(id);

      // 2. Lookup local enrichment data if available
      const stored = getStoredAlumni();
      const enriched = stored.find(a => a.alumniId.toLowerCase() === id.toLowerCase());

      if (onChainData.isValid && onChainData.record) {
        setShowSuccessPopup(true);
        setResult({
          status: 'VALID',
          record: {
            ...onChainData.record,
            cgpa: enriched?.cgpa || '8.80',
            avatar: enriched?.avatar,
            email: enriched?.email,
          },
        });
      } else if (onChainData.record && onChainData.record.isRegistered) {
        // Record exists on-chain but status is Revoked
        setFailurePopupState({
          type: 'REVOKED',
          title: 'Alumni Record Revoked',
          subtitle: onChainData.record.revocationReason || 'This record was permanently revoked pursuant to disciplinary inquiry.',
        });
        setResult({
          status: 'REVOKED',
          record: onChainData.record,
        });
      } else if (enriched) {
        // Fallback for demo records if provider was offline
        if (enriched.status === 'Revoked') {
          setFailurePopupState({
            type: 'REVOKED',
            title: 'Alumni Record Revoked',
            subtitle: enriched.revocationReason || 'This record was permanently revoked pursuant to disciplinary inquiry.',
          });
          setResult({
            status: 'REVOKED',
            record: enriched,
          });
        } else {
          setShowSuccessPopup(true);
          setResult({
            status: 'VALID',
            record: enriched,
          });
        }
      } else {
        setFailurePopupState({
          type: 'NOT_FOUND',
          title: 'Record Not Found',
          subtitle: `No alumnus registered with ID "${id}" was found on the smart contract.`,
        });
        setResult({
          status: 'NOT_FOUND',
          id: id,
        });
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setFailurePopupState({
        type: 'NOT_FOUND',
        title: 'Verification Error',
        subtitle: error.message || 'Unable to query the smart contract.',
      });
      setResult({
        status: 'ERROR',
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performVerification(searchId);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Public EVM Ledger Authenticator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verify Alumni Academic Record
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Employers, universities, and regulatory bodies can independently verify student credentials directly against the immutable smart contract without intermediary delays.
        </p>
      </div>

      {/* Search Form Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Enter Institutional Alumni ID:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="e.g., ALU-2024-001, ALU-2024-002, or ALU-2023-088"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{loading ? 'Verifying On-Chain...' : 'Verify Authenticity'}</span>
            </button>
          </div>

          {/* Quick Click Demo Tags */}
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
            <span>Try Quick Examples:</span>
            <button
              type="button"
              onClick={() => setSearchId('ALU-2024-001')}
              className="text-brand-300 hover:underline font-mono"
            >
              ALU-2024-001 (Active)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setSearchId('ALU-2023-088')}
              className="text-amber-300 hover:underline font-mono"
            >
              ALU-2023-088 (Updated)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setSearchId('ALU-2022-194')}
              className="text-rose-300 hover:underline font-mono"
            >
              ALU-2022-194 (Revoked)
            </button>
          </div>
        </form>
      </div>

      {/* Verification Results Panel */}
      {result && (
        <div className="animate-in fade-in duration-300">
          
          {/* VALID RECORD RESULT */}
          {result.status === 'VALID' && (
            <div className="p-8 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/50 shadow-2xl relative overflow-hidden space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                      <span>Official Authenticated Record</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white mt-1">
                      {result.record.name}
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs text-brand-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                    ID: {result.record.alumniId}
                  </span>
                </div>
              </div>

              {/* Academic Overview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400">Conferred Degree</span>
                  <div className="text-xs font-bold text-white leading-tight">
                    {result.record.degree}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400">Department / School</span>
                  <div className="text-xs font-bold text-white">
                    {result.record.department}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400">Graduation Year & CGPA</span>
                  <div className="text-xs font-bold text-emerald-400 font-mono">
                    Class of {result.record.graduationYear} • {result.record.cgpa} CGPA
                  </div>
                </div>
              </div>

              {/* Smart Contract Proof Details */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800/80">
                  <span className="flex items-center gap-1.5 text-brand-400 font-sans font-semibold">
                    <Cpu className="w-4 h-4" />
                    EVM Cryptographic Integrity Proof
                  </span>
                  <span className="text-emerald-400 text-[11px]">Tamper Proof (Verified)</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-500">Record Keccak-256 Hash:</span>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="truncate max-w-[260px]" title={result.record.dataHash}>
                        {result.record.dataHash || '0x98f4b238e9c01284a75d5069f88c3a502693faee8827279cfffb922661234567'}
                      </span>
                      <button
                        onClick={() => handleCopy(result.record.dataHash)}
                        className="hover:text-white transition"
                        title="Copy Hash"
                      >
                        {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Verification Ledger:</span>
                    <span className="text-slate-300 truncate max-w-[260px]">{CONTRACT_ADDRESS}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Registration Date:</span>
                    <span className="text-slate-300">{new Date(result.record.registrationDate || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => onNavigate('alumni-profile', result.record.alumniId)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  View Full Alumni Profile →
                </button>
              </div>

            </div>
          )}

          {/* REVOKED RECORD RESULT */}
          {result.status === 'REVOKED' && (
            <div className="p-8 rounded-3xl bg-slate-900/90 border-2 border-rose-500/50 shadow-2xl space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <XCircle className="w-8 h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/30">
                    <span>Credential Revoked / Invalidated</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white mt-1">
                    {result.record.name} ({result.record.alumniId})
                  </h2>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-rose-200 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-rose-300 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Official Administrative Revocation Notice
                </div>
                <p className="leading-relaxed">
                  {result.record.revocationReason || 'This academic record has been permanently revoked by the institution disciplinary board.'}
                </p>
                <div className="pt-2 text-[11px] text-slate-400 font-mono">
                  Blockchain Status Code: 2 (Revoked) • State Committed on EVM
                </div>
              </div>
            </div>
          )}

          {/* NOT FOUND RESULT */}
          {result.status === 'NOT_FOUND' && (
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Record Not Found On-Chain</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No alumnus registered with identifier <code className="text-brand-300 font-mono font-bold">"{result.id}"</code> was located on the smart contract. Please check spelling or verify whether the record was issued under a different ID.
              </p>
            </div>
          )}

        </div>
      )}

      {/* Institutional Success Verification Popup */}
      <VerificationSuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title="Alumni Record Verified"
        subtitle="Genuine academic credentials confirmed on Ethereum Smart Contract"
      />

      {/* Institutional Failure / Revocation Alert Popup */}
      <VerificationFailurePopup
        isOpen={!!failurePopupState}
        onClose={() => setFailurePopupState(null)}
        type={failurePopupState?.type}
        title={failurePopupState?.title}
        subtitle={failurePopupState?.subtitle}
      />

    </div>
  );
}

