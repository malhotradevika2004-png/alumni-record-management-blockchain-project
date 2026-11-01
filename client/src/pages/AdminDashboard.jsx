import React from 'react';
import { 
  Users, 
  Award, 
  ShieldCheck, 
  AlertTriangle, 
  PlusCircle, 
  FilePlus2, 
  History, 
  Search, 
  ExternalLink,
  Cpu,
  CheckCircle2,
  Clock,
  Wallet
} from 'lucide-react';
import { CONTRACT_ADDRESS } from '../services/blockchain';
import RecordBadge from '../components/RecordBadge';

export default function AdminDashboard({ 
  stats, 
  alumniList, 
  certificatesList, 
  walletState, 
  onNavigate, 
  onOpenWalletModal,
  onOpenRegisterModal,
  onOpenIssueModal 
}) {
  const recentAlumni = alumniList.slice(0, 5);
  const recentCertificates = certificatesList.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/30 font-mono uppercase">
              Administrative Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Institutional Admin Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage verifiable alumni identities, issue academic degrees, and monitor real-time EVM blockchain state.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenRegisterModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-600 hover:to-blue-700 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Alumnus</span>
          </button>

          <button
            onClick={onOpenIssueModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
          >
            <FilePlus2 className="w-4 h-4 text-emerald-400" />
            <span>Issue Certificate</span>
          </button>
        </div>
      </div>

      {/* Connected Wallet & Contract Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Wallet Authority Card */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${walletState?.address ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Caller Wallet Address</div>
              {walletState?.address ? (
                <div className="text-xs font-mono font-bold text-white truncate max-w-[170px]" title={walletState.address}>
                  {walletState.address}
                </div>
              ) : (
                <button onClick={onOpenWalletModal} className="text-xs text-brand-400 hover:underline font-semibold">
                  Connect MetaMask
                </button>
              )}
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300">
            {walletState?.balance ? `${walletState.balance} ETH` : 'No Balance'}
          </span>
        </div>

        {/* Network & EVM Status */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Target Blockchain Network</div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{walletState?.networkName || 'Hardhat Localhost (31337)'}</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
            Chain ID: {walletState?.chainId || 31337}
          </span>
        </div>

        {/* Smart Contract Info */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Smart Contract Address</div>
              <div className="text-xs font-mono font-bold text-brand-300 truncate max-w-[160px]" title={CONTRACT_ADDRESS}>
                {CONTRACT_ADDRESS}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('transactions')}
            className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition"
          >
            Logs
          </button>
        </div>

      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Alumni */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-brand-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Registered Alumni</span>
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {stats?.totalAlumni || alumniList.length}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{stats?.activeAlumni || alumniList.filter(a => a.status === 'Active').length} Active Credentials</span>
          </div>
        </div>

        {/* Total Certificates */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Issued Certificates</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {stats?.totalCertificates || certificatesList.length}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{stats?.activeCertificates || certificatesList.filter(c => !c.isRevoked).length} Valid On-Chain</span>
          </div>
        </div>

        {/* Revoked Credentials */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Revoked / Disciplinary</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">
            {stats?.revokedAlumni || alumniList.filter(a => a.status === 'Revoked').length}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-rose-400">
            <span>{stats?.revokedCertificates || certificatesList.filter(c => c.isRevoked).length} Revoked Certificates</span>
          </div>
        </div>

        {/* Verification Success Rate */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Cryptographic Integrity</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono">
            100%
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
            <span>Keccak-256 Hashed</span>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Recent Registrations & Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Registered Alumni Table */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-400" />
              <h3 className="font-bold text-white text-sm">Recent Registered Alumni</h3>
            </div>
            <button
              onClick={() => onNavigate('alumni')}
              className="text-xs text-brand-400 hover:underline font-semibold"
            >
              View All Directory →
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {recentAlumni.map((alumnus) => (
              <div 
                key={alumnus.alumniId} 
                onClick={() => onNavigate('alumni-profile', alumnus.alumniId)}
                className="py-3 flex items-center justify-between hover:bg-slate-800/40 px-2 rounded-xl cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-brand-300">
                    {alumnus.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-xs hover:text-brand-300 transition">
                      {alumnus.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {alumnus.alumniId} • Class of {alumnus.graduationYear}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <RecordBadge status={alumnus.status} size="sm" />
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    CGPA: {alumnus.cgpa || '8.80'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Issued Certificates Table */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Recently Issued Credentials</h3>
            </div>
            <button
              onClick={() => onNavigate('certificates')}
              className="text-xs text-brand-400 hover:underline font-semibold"
            >
              View All Certificates →
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {recentCertificates.map((cert) => (
              <div 
                key={cert.certificateId} 
                onClick={() => onNavigate('verify-cert', cert.certificateId)}
                className="py-3 flex items-center justify-between hover:bg-slate-800/40 px-2 rounded-xl cursor-pointer transition"
              >
                <div>
                  <div className="font-mono text-xs font-semibold text-brand-300">
                    {cert.certificateId}
                  </div>
                  <div className="text-xs text-slate-200 truncate max-w-[260px]">
                    {cert.title}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Awarded to: <span className="text-slate-300">{cert.alumniName}</span>
                  </div>
                </div>

                <div className="text-right">
                  {cert.isRevoked ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      Revoked
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  )}
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {new Date(cert.issueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

