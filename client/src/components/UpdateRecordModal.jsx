import React, { useState } from 'react';
import { X, FileEdit, Loader2 } from 'lucide-react';
import { updateAlumniOnChain } from '../services/blockchain';
import { saveAlumniRecord, addTransactionRecord } from '../services/storage';

export default function UpdateRecordModal({ 
  isOpen, 
  onClose, 
  alumnus, 
  onSuccess, 
  onTxStart, 
  onTxUpdate 
}) {
  if (!isOpen || !alumnus) return null;

  const [formData, setFormData] = useState({
    newDegree: alumnus.degree || '',
    newDepartment: alumnus.department || '',
    newCgpa: alumnus.cgpa || '8.80',
    alumniWallet: alumnus.alumniWallet || '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      onTxStart({
        status: 'pending',
        title: 'MetaMask Approval Requested',
        message: `Please approve updating record for ${alumnus.name} (${alumnus.alumniId})...`,
      });

      const onChainResult = await updateAlumniOnChain({
        alumniId: alumnus.alumniId,
        newDegree: formData.newDegree,
        newDepartment: formData.newDepartment,
        newCgpa: formData.newCgpa,
        alumniWallet: formData.alumniWallet,
      });

      onTxUpdate({
        status: 'confirmed',
        title: 'Alumni Record Updated On Blockchain!',
        txHash: onChainResult.txHash,
        blockNumber: onChainResult.blockNumber,
        gasUsed: onChainResult.gasUsed,
        message: `Updated academic credentials and new data hash committed to EVM.`,
      });

      const updated = {
        ...alumnus,
        degree: formData.newDegree,
        department: formData.newDepartment,
        cgpa: formData.newCgpa,
        dataHash: onChainResult.newDataHash,
        status: 'Updated',
        lastUpdatedDate: new Date().toISOString(),
      };

      saveAlumniRecord(updated);

      addTransactionRecord({
        txHash: onChainResult.txHash,
        type: 'Alumni Record Updated',
        blockNumber: onChainResult.blockNumber,
        gasUsed: onChainResult.gasUsed,
        status: 'Confirmed',
        details: `Updated degree/department for ${alumnus.name} (${alumnus.alumniId})`,
      });

      onSuccess(updated);
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      setErrorMsg(err.message || 'Transaction failed');
      onTxUpdate({
        status: 'error',
        title: 'Update Transaction Failed',
        error: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
          <div className="p-3 bg-brand-500/10 border border-brand-500/30 rounded-xl text-brand-400">
            <FileEdit className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Update Academic Record</h3>
            <p className="text-xs text-slate-400">{alumnus.name} • {alumnus.alumniId}</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Updated Degree Program
            </label>
            <input
              type="text"
              name="newDegree"
              value={formData.newDegree}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Updated Department
            </label>
            <input
              type="text"
              name="newDepartment"
              value={formData.newDepartment}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Updated CGPA
            </label>
            <input
              type="text"
              name="newCgpa"
              value={formData.newCgpa}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-500"
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
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-lg shadow-brand-500/25 transition flex items-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileEdit className="w-4 h-4" />}
              <span>{submitting ? 'Broadcasting...' : 'Update on Blockchain'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

