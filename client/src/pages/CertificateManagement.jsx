import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  PlusCircle, 
  FileCheck, 
  Filter, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';
import CertificateCard from '../components/CertificateCard';

export default function CertificateManagement({ 
  certificatesList, 
  onOpenIssueModal, 
  onOpenRevokeModal,
  onNavigate,
  isAdmin = true 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredCerts = certificatesList.filter((c) => {
    const matchesSearch = 
      c.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.alumniId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.alumniName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      filterStatus === 'ALL' ||
      (filterStatus === 'VALID' && !c.isRevoked) ||
      (filterStatus === 'REVOKED' && c.isRevoked);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Academic Certificate Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {filteredCerts.length} Issued
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Issue cryptographically verifiable degrees, generate high-resolution PDF credentials, and execute authorized revocations.
          </p>
        </div>

        <button
          onClick={onOpenIssueModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Issue New Certificate</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Certificate ID, Student Name, Alumni ID..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Status Toggle Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-medium transition ${
              filterStatus === 'ALL'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All ({certificatesList.length})
          </button>
          <button
            onClick={() => setFilterStatus('VALID')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-medium transition ${
              filterStatus === 'VALID'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Valid ({certificatesList.filter(c => !c.isRevoked).length})
          </button>
          <button
            onClick={() => setFilterStatus('REVOKED')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-medium transition ${
              filterStatus === 'REVOKED'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Revoked ({certificatesList.filter(c => c.isRevoked).length})
          </button>
        </div>

      </div>

      {/* Certificates Grid */}
      {filteredCerts.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
          <Award className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Certificates Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No academic credentials matched your query. Click "Issue New Certificate" to mint a verifiable credential on the blockchain.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredCerts.map((cert) => (
            <CertificateCard
              key={cert.certificateId}
              certificate={cert}
              onRevokeClick={() => onOpenRevokeModal(cert)}
              onNavigate={onNavigate}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

    </div>
  );
}

