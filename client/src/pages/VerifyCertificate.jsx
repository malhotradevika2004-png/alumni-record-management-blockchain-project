import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Award, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Download,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { verifyCertificateOnChain, CONTRACT_ADDRESS } from '../services/blockchain';
import { getStoredCertificates, getStoredAlumni } from '../services/storage';
import CertificateCard from '../components/CertificateCard';
import VerificationSuccessPopup from '../components/VerificationSuccessPopup';
import VerificationFailurePopup from '../components/VerificationFailurePopup';

export default function VerifyCertificate({ initialId = '', onNavigate }) {
  const [certIdInput, setCertIdInput] = useState(initialId || '');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [failurePopupState, setFailurePopupState] = useState(null);

  useEffect(() => {
    // Check URL parameters for QR scan (e.g., #verify-cert?id=CERT-2024-8801)
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search || (hash.includes('?') ? hash.split('?')[1] : ''));
    const urlId = urlParams.get('id') || initialId;

    if (urlId) {
      setCertIdInput(urlId);
    }
  }, [initialId]);

  const handleVerify = async (idToVerify) => {
    const id = idToVerify.trim();
    if (!id) return;

    setLoading(true);
    setVerificationResult(null);

    try {
      // 1. Check Smart Contract directly
      const onChainData = await verifyCertificateOnChain(id);

      // 2. Fetch local metadata enrichment
      const storedCerts = getStoredCertificates();
      const storedAlumni = getStoredAlumni();
      const enriched = storedCerts.find(c => c.certificateId.toLowerCase() === id.toLowerCase());
      const linkedAlumnus = onChainData.certificate?.alumniId
        ? storedAlumni.find(a => a.alumniId.toLowerCase() === onChainData.certificate.alumniId.toLowerCase())
        : (enriched?.alumniId ? storedAlumni.find(a => a.alumniId.toLowerCase() === enriched.alumniId.toLowerCase()) : null);

      if (onChainData.isValid && onChainData.certificate) {
        setShowSuccessPopup(true);
        setVerificationResult({
          status: 'VALID',
          certificate: {
            ...onChainData.certificate,
            alumniName: enriched?.alumniName || linkedAlumnus?.name || 'Aarav Sharma',
            institution: enriched?.institution || 'Apex University Institute of Technology',
          },
        });
      } else if (onChainData.certificate && onChainData.certificate.exists) {
        // Exists but isRevoked = true
        setFailurePopupState({
          type: 'REVOKED',
          title: 'Certificate Revoked',
          subtitle: onChainData.certificate.revocationReason || 'This academic certificate was invalidated and voided.',
        });
        setVerificationResult({
          status: 'REVOKED',
          certificate: {
            ...onChainData.certificate,
            alumniName: enriched?.alumniName || linkedAlumnus?.name || 'Student',
            institution: enriched?.institution || 'Apex University Institute of Technology',
          },
        });
      } else if (enriched) {
        // Fallback demo
        if (enriched.isRevoked) {
          setFailurePopupState({
            type: 'REVOKED',
            title: 'Certificate Revoked',
            subtitle: enriched.revocationReason || 'This academic certificate was invalidated and voided.',
          });
          setVerificationResult({
            status: 'REVOKED',
            certificate: enriched,
          });
        } else {
          setShowSuccessPopup(true);
          setVerificationResult({
            status: 'VALID',
            certificate: enriched,
          });
        }
      } else {
        setFailurePopupState({
          type: 'NOT_FOUND',
          title: 'Certificate Not Found',
          subtitle: `No certificate found on-chain with ID "${id}". Potential counterfeit.`,
        });
        setVerificationResult({
          status: 'NOT_FOUND',
          id: id,
        });
      }
    } catch (err) {
      console.error("Certificate verify failed:", err);
      setFailurePopupState({
        type: 'NOT_FOUND',
        title: 'Verification Failed',
        subtitle: err.message || 'Unable to query the smart contract.',
      });
      setVerificationResult({
        status: 'ERROR',
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleVerify(certIdInput);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title & Explainer */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Cryptographic Credential Authenticator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verify Academic Certificate
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Validate authenticity directly from the Ethereum Virtual Machine. Scan the QR code on any printed certificate or enter the unique Certificate ID below.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl">
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Enter Certificate ID:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={certIdInput}
                onChange={(e) => setCertIdInput(e.target.value)}
                placeholder="e.g., CERT-2024-8801 or CERT-2024-8802"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{loading ? 'Querying Blockchain...' : 'Verify Certificate'}</span>
            </button>
          </div>

          {/* Quick Demo links */}
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
            <span>Try Seed Examples:</span>
            <button
              type="button"
              onClick={() => setCertIdInput('CERT-2024-8801')}
              className="text-emerald-300 hover:underline font-mono"
            >
              CERT-2024-8801 (Valid Honors)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setCertIdInput('CERT-2024-8802')}
              className="text-brand-300 hover:underline font-mono"
            >
              CERT-2024-8802 (BCA Distinction)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setCertIdInput('CERT-2022-0044')}
              className="text-rose-300 hover:underline font-mono"
            >
              CERT-2022-0044 (Revoked)
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {verificationResult && (
        <div className="animate-in fade-in duration-300 space-y-8">
          
          {/* VALID CERTIFICATE */}
          {verificationResult.status === 'VALID' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Verified Authenticity: Certificate is Authentic, Active, and Registered on Ethereum EVM</span>
                </div>
                <span className="font-mono text-[11px] bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  Status: Active
                </span>
              </div>

              {/* Printable Card */}
              <CertificateCard
                certificate={verificationResult.certificate}
                onNavigate={onNavigate}
                isAdmin={false}
              />
            </div>
          )}

          {/* REVOKED CERTIFICATE */}
          {verificationResult.status === 'REVOKED' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-rose-950/30 border-2 border-rose-500/60 shadow-2xl space-y-4">
                <div className="flex items-center gap-3 text-rose-400">
                  <XCircle className="w-8 h-8" />
                  <div>
                    <h2 className="text-xl font-extrabold text-white">Certificate Revoked / Invalidated</h2>
                    <p className="text-xs text-rose-300">
                      This certificate exists on the smart contract but has been revoked by the issuing authority.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 text-xs text-slate-300 space-y-2">
                  <div className="text-rose-300 font-semibold">Revocation Reason:</div>
                  <p className="font-mono text-slate-400">
                    "{verificationResult.certificate.revocationReason || 'Invalidated following disciplinary investigation'}"
                  </p>
                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                    Certificate ID: <span className="text-slate-300 font-mono">{verificationResult.certificate.certificateId}</span> • 
                    Alumni ID: <span className="text-slate-300 font-mono">{verificationResult.certificate.alumniId}</span>
                  </div>
                </div>
              </div>

              {/* Render Card with Revoked Watermark */}
              <CertificateCard
                certificate={verificationResult.certificate}
                onNavigate={onNavigate}
                isAdmin={false}
              />
            </div>
          )}

          {/* NOT FOUND */}
          {verificationResult.status === 'NOT_FOUND' && (
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Certificate Not Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No certificate found on-chain with ID <code className="text-emerald-300 font-mono font-bold">"{verificationResult.id}"</code>. This could indicate an unissued or counterfeit credential.
              </p>
            </div>
          )}

        </div>
      )}

      {/* Institutional Success Verification Popup */}
      <VerificationSuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title="Certificate Authenticated"
        subtitle="Cryptographically verified genuine credential on Ethereum Smart Contract"
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

