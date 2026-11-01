import React, { useState } from 'react';
import { 
  ArrowLeft, 
  GraduationCap, 
  Award, 
  Calendar, 
  Mail, 
  Phone, 
  Briefcase, 
  ShieldCheck, 
  Cpu, 
  Copy, 
  Check, 
  Download, 
  ExternalLink,
  AlertTriangle,
  FileCheck2
} from 'lucide-react';
import RecordBadge from '../components/RecordBadge';
import CertificateCard from '../components/CertificateCard';
import { CONTRACT_ADDRESS } from '../services/blockchain';

export default function AlumniProfile({ 
  alumniId, 
  alumniList, 
  certificatesList, 
  onBack, 
  onNavigate,
  onOpenIssueModal 
}) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);

  const alumnus = alumniList.find(a => a.alumniId === alumniId) || alumniList[0];
  const linkedCerts = certificatesList.filter(c => c.alumniId === alumnus.alumniId);

  // Fallback demo data hash if not pre-assigned
  const dataHash = alumnus.dataHash || "0x98f4b238e9c01284a75d5069f88c3a502693faee8827279cfffb922661234567";

  const handleCopyHash = () => {
    navigator.clipboard.writeText(dataHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyWallet = () => {
    if (alumnus.alumniWallet) {
      navigator.clipboard.writeText(alumnus.alumniWallet);
      setCopiedWallet(true);
      setTimeout(() => setCopiedWallet(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Alumni Directory</span>
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={alumnus.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(alumnus.name)}&background=0284c7&color=fff`}
              alt={alumnus.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-brand-500/30 shadow-xl"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {alumnus.name}
                </h1>
                <RecordBadge status={alumnus.status} reason={alumnus.revocationReason} />
              </div>

              <p className="text-sm font-medium text-brand-300">
                {alumnus.degree}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="font-mono text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700">
                  ID: {alumnus.alumniId}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {alumnus.department}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Class of {alumnus.graduationYear}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('verify-record', alumnus.alumniId)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition"
            >
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>Verify On Smart Contract</span>
            </button>
            <button
              onClick={onOpenIssueModal}
              className="px-4 py-2.5 bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-600 hover:to-blue-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition"
            >
              <Award className="w-4 h-4" />
              <span>Issue New Credential</span>
            </button>
          </div>

        </div>

        {/* Revocation banner if status is Revoked */}
        {alumnus.status === 'Revoked' && (
          <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
            <div>
              <div className="font-bold">Record Status: Revoked by Academic Authority</div>
              <p className="mt-0.5 text-rose-300/80">
                {alumnus.revocationReason || 'This academic identity has been flagged and invalidated on the smart contract.'}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Two Column Layout: On-Chain Cryptographic Integrity vs Student Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: On-Chain Cryptographic Proof (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-brand-400">
              <Cpu className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm">On-Chain Cryptographic Proof</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculated Keccak-256 hash committed to EVM block storage. Any alteration to the grade, degree, or ID causes hash validation to fail.
            </p>

            <div className="space-y-3 font-mono text-xs">
              
              {/* Record Hash */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase">
                  <span>Cryptographic Data Hash</span>
                  <button onClick={handleCopyHash} className="hover:text-white transition">
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-[11px] text-brand-300 truncate font-semibold" title={dataHash}>
                  {dataHash}
                </div>
              </div>

              {/* Linked Wallet */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase">
                  <span>Alumnus Wallet Address</span>
                  <button onClick={handleCopyWallet} className="hover:text-white transition">
                    {copiedWallet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-[11px] text-slate-200 truncate font-semibold" title={alumnus.alumniWallet}>
                  {alumnus.alumniWallet || '0x0000000000000000000000000000000000000000'}
                </div>
              </div>

              {/* Registration Timestamps */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Initial Block Time:</span>
                  <span className="text-slate-200">{new Date(alumnus.registrationDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Status Update:</span>
                  <span className="text-slate-200">{new Date(alumnus.lastUpdatedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contract Address:</span>
                  <span className="text-brand-300 truncate max-w-[130px]" title={CONTRACT_ADDRESS}>
                    {CONTRACT_ADDRESS}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Academic Standing */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm">Academic Standing</h3>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Cumulative GPA</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {alumnus.cgpa || '8.80'} / 10.0
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-brand-400" />
              <span>Current: {alumnus.employment || 'Pursuing Higher Studies'}</span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-brand-400" />
              <span>{alumnus.email || 'alumnus@university.edu'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Issued Academic Certificates & Achievements (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Linked Certificates Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Issued Blockchain Credentials</h3>
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {linkedCerts.length}
                </span>
              </div>
            </div>

            {linkedCerts.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
                <FileCheck2 className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  No certificates have been issued yet for this alumnus.
                </p>
                <button
                  onClick={onOpenIssueModal}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition"
                >
                  Issue First Degree Certificate
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {linkedCerts.map((cert) => (
                  <CertificateCard
                    key={cert.certificateId}
                    certificate={cert}
                    onNavigate={onNavigate}
                    isAdmin={false}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Academic Honors & Achievements */}
          {alumnus.achievements && alumnus.achievements.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm">Honors & Extracurricular Accomplishments</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {alumnus.achievements.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

