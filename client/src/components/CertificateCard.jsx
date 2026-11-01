import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Award, Download, ShieldCheck, AlertCircle, FileCheck2, Loader2 } from 'lucide-react';
import { exportCertificatePDF } from '../services/certificateGenerator';
import { CONTRACT_ADDRESS } from '../services/blockchain';

export default function CertificateCard({ certificate, onRevokeClick, onNavigate, isAdmin = false }) {
  const [downloading, setDownloading] = useState(false);
  const elementId = `cert-canvas-${certificate.certificateId}`;

  // Verification URL for QR code
  const verifyUrl = `${window.location.origin}/#verify-cert?id=${certificate.certificateId}`;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await exportCertificatePDF(elementId, certificate.certificateId, certificate.alumniName);
    } catch (err) {
      alert("Failed to export PDF: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative group">
      {/* Action Buttons bar above card */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-brand-300 font-semibold bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">
            {certificate.certificateId}
          </span>
          {certificate.isRevoked ? (
            <span className="text-xs px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              Revoked Certificate
            </span>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified On-Chain
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && !certificate.isRevoked && (
            <button
              onClick={() => onRevokeClick(certificate)}
              className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium transition"
            >
              Revoke
            </button>
          )}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition shadow-sm"
          >
            {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>{downloading ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* High-Resolution Printable Certificate DOM Frame */}
      <div
        id={elementId}
        className="relative p-7 sm:p-10 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/40 shadow-2xl text-slate-100 overflow-hidden font-sans"
        style={{ minHeight: '480px' }}
      >
        {/* Decorative Certificate Inner Border */}
        <div className="absolute inset-3 border border-amber-400/20 rounded-xl pointer-events-none"></div>
        <div className="absolute inset-4 border border-dashed border-amber-500/30 rounded-lg pointer-events-none"></div>

        {/* Revoked Watermark Overlay */}
        {certificate.isRevoked && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[2px] pointer-events-none">
            <div className="transform -rotate-12 border-4 border-rose-500/80 bg-rose-950/80 px-8 py-3 rounded-2xl shadow-2xl">
              <span className="text-3xl sm:text-5xl font-extrabold tracking-widest text-rose-400 uppercase">
                REVOKED / INVALID
              </span>
              <p className="text-center text-xs text-rose-300 mt-1">
                {certificate.revocationReason || 'Voided by Issuing Authority'}
              </p>
            </div>
          </div>
        )}

        {/* Certificate Header */}
        <div className="text-center relative z-10 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500/20 to-brand-500/20 border-2 border-amber-400/40 mb-3 text-amber-300 shadow-inner">
            <Award className="w-7 h-7" />
          </div>
          <h2 className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-amber-400 font-mono">
            {certificate.institution || "Apex Institute of Technology & Engineering"}
          </h2>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1 tracking-tight">
            Official Academic Credential
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Issued and cryptographically secured via Ethereum Virtual Machine Smart Contract
          </p>
        </div>

        {/* Certificate Body */}
        <div className="text-center relative z-10 space-y-4 my-6">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-light">
            This is to certify that
          </p>
          <div className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-200 tracking-wide">
            {certificate.alumniName}
          </div>
          <p className="text-xs text-slate-400">
            bearing Alumni Registration ID <span className="font-mono text-brand-300 font-semibold">{certificate.alumniId}</span> has successfully fulfilled all academic requirements prescribed by the Senate for the conferment of
          </p>
          <div className="text-base sm:text-lg font-bold text-amber-300 max-w-xl mx-auto leading-snug">
            {certificate.title}
          </div>
          <div className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-semibold">
            {certificate.cgpaOrGrade}
          </div>
        </div>

        {/* Certificate Footer: QR Code, Hashes & Signature blocks */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          
          {/* Left: QR Code & Verification URL */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-md">
              <QRCodeSVG
                value={verifyUrl}
                size={64}
                level="M"
                includeMargin={false}
              />
            </div>
            <div className="text-left text-[10px] space-y-0.5">
              <div className="font-semibold text-slate-300">Scan to Verify</div>
              <div className="text-slate-400">Public Verifier Link</div>
              <a
                href={verifyUrl}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('verify-cert', certificate.certificateId);
                  }
                }}
                className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 hover:underline font-mono truncate max-w-[140px] cursor-pointer font-medium transition"
                title={`Click to verify ${certificate.certificateId} on blockchain`}
              >
                <span>{certificate.certificateId}</span>
                <span className="text-[10px]">↗</span>
              </a>
            </div>
          </div>

          {/* Middle: On-chain Cryptographic Proof */}
          <div className="text-center space-y-1">
            <div className="text-[10px] text-slate-400 font-mono">Blockchain Cryptographic Hash:</div>
            <div className="text-[9px] font-mono text-slate-300 bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 truncate" title={certificate.certHash}>
              {certificate.certHash ? `${certificate.certHash.slice(0, 18)}...${certificate.certHash.slice(-10)}` : 'On-Chain Keccak-256 Verified'}
            </div>
            <div className="text-[10px] text-slate-400">
              Issued: <span className="text-slate-200">{new Date(certificate.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Right: Official Signatures */}
          <div className="flex justify-around sm:justify-end gap-6 text-center text-[10px]">
            <div>
              <div className="font-serif italic text-amber-200 text-sm mb-1 border-b border-slate-700 pb-0.5 px-2">
                Dr. A. K. Sen
              </div>
              <div className="text-slate-400 font-medium">Registrar</div>
            </div>
            <div>
              <div className="font-serif italic text-amber-200 text-sm mb-1 border-b border-slate-700 pb-0.5 px-2">
                Prof. M. R. Varma
              </div>
              <div className="text-slate-400 font-medium">Dean of Academics</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

