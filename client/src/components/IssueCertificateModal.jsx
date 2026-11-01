import React, { useState } from 'react';
import { X, Award, Loader2, Sparkles, FileCheck2 } from 'lucide-react';
import { issueCertificateOnChain } from '../services/blockchain';
import { saveCertificateRecord, addTransactionRecord } from '../services/storage';

export default function IssueCertificateModal({ 
  isOpen, 
  onClose, 
  alumniList, 
  onSuccess, 
  onTxStart, 
  onTxUpdate 
}) {
  const activeAlumni = alumniList.filter(a => a.status !== 'Revoked');
  const defaultAlumni = activeAlumni[0] || {};

  const [formData, setFormData] = useState({
    certificateId: `CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    alumniId: defaultAlumni.alumniId || '',
    alumniName: defaultAlumni.name || '',
    title: defaultAlumni.degree ? `Degree of ${defaultAlumni.degree}` : 'Bachelor of Technology with Distinction',
    cgpaOrGrade: defaultAlumni.cgpa ? `${defaultAlumni.cgpa} CGPA (First Class with Distinction)` : '8.80 CGPA',
    institution: 'Apex Institute of Technology & Engineering',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAlumniSelect = (e) => {
    const selectedId = e.target.value;
    const target = activeAlumni.find(a => a.alumniId === selectedId);
    if (target) {
      setFormData({
        ...formData,
        alumniId: target.alumniId,
        alumniName: target.name,
        title: `Degree of ${target.degree}`,
        cgpaOrGrade: `${target.cgpa || '8.80'} CGPA (First Class with Distinction)`,
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.certificateId || !formData.alumniId) {
      setErrorMsg('Please select an alumnus and specify certificate ID');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      onTxStart({
        status: 'pending',
        title: 'MetaMask Approval Requested',
        message: `Please approve certificate issuance for ${formData.alumniName} (${formData.certificateId})...`,
      });

      // Call Smart Contract
      const onChainResult = await issueCertificateOnChain({
        certificateId: formData.certificateId,
        alumniId: formData.alumniId,
        title: formData.title,
        cgpaOrGrade: formData.cgpaOrGrade,
      });

      onTxUpdate({
        status: 'confirmed',
        title: 'Certificate Minted On Blockchain!',
        txHash: onChainResult.txHash,
        blockNumber: onChainResult.blockNumber,
        gasUsed: onChainResult.gasUsed,
        message: `Issued verifiable degree ${formData.certificateId} to ${formData.alumniName}.`,
      });

      const newCert = {
        certificateId: formData.certificateId,
        alumniId: formData.alumniId,
        alumniName: formData.alumniName,
        title: formData.title,
        cgpaOrGrade: formData.cgpaOrGrade,
        institution: formData.institution,
        issueDate: new Date().toISOString(),
        certHash: onChainResult.certHash,
        isRevoked: false,
        revocationReason: '',
      };

      saveCertificateRecord(newCert);

      addTransactionRecord({
        txHash: onChainResult.txHash,
        type: 'Certificate Issued',
        blockNumber: onChainResult.blockNumber,
        gasUsed: onChainResult.gasUsed,
        status: 'Confirmed',
        details: `Issued ${formData.certificateId} to ${formData.alumniName}`,
      });

      onSuccess(newCert);
      onClose();
    } catch (err) {
      console.error("Issuance failed:", err);
      setErrorMsg(err.message || 'Transaction failed');
      onTxUpdate({
        status: 'error',
        title: 'Issuance Transaction Failed',
        error: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Issue Academic Certificate</h3>
            <p className="text-xs text-slate-400">Generates unique verifiable cryptographic credentials</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Select Registered Alumnus */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Select Registered Alumnus *
            </label>
            <select
              name="alumniId"
              value={formData.alumniId}
              onChange={handleAlumniSelect}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="">-- Choose Alumnus --</option>
              {activeAlumni.map((a) => (
                <option key={a.alumniId} value={a.alumniId}>
                  {a.name} ({a.alumniId}) - {a.degree}
                </option>
              ))}
            </select>
          </div>

          {/* Certificate ID */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Unique Certificate ID *
            </label>
            <input
              type="text"
              name="certificateId"
              value={formData.certificateId}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Certificate Award Title */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Award / Degree Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* CGPA / Distinction */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Academic Standing / Honors Distinction *
            </label>
            <input
              type="text"
              name="cgpaOrGrade"
              value={formData.cgpaOrGrade}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Issuing Institution Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Conferring Institution
            </label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold shadow-lg shadow-emerald-500/25 transition flex items-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
              <span>{submitting ? 'Minting on EVM...' : 'Issue & Sign Certificate'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

