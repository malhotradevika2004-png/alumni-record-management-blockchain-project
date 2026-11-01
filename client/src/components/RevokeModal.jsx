import React, { useState } from 'react';
import { X, ShieldAlert, Loader2, AlertTriangle } from 'lucide-react';
import { revokeAlumniOnChain, revokeCertificateOnChain } from '../services/blockchain';
import { updateAlumniStatusInStore, revokeCertificateInStore, addTransactionRecord } from '../services/storage';

export default function RevokeModal({ 
  isOpen, 
  onClose, 
  targetItem, 
  targetType = 'ALUMNI', // 'ALUMNI' | 'CERTIFICATE'
  onSuccess, 
  onTxStart, 
  onTxUpdate 
}) {
  if (!isOpen || !targetItem) return null;

  const isCert = targetType === 'CERTIFICATE';
  const targetId = isCert ? targetItem.certificateId : targetItem.alumniId;
  const targetName = isCert ? targetItem.title : targetItem.name;

  const [reason, setReason] = useState(
    'Disciplinary Committee Ruling #DC-2024 regarding verified academic credential irregularity'
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Please state a valid reason for credential revocation');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      onTxStart({
        status: 'pending',
        title: 'MetaMask Approval Requested',
        message: `Please approve revoking ${targetId} on the blockchain...`,
      });

      let onChainResult;
      if (isCert) {
        onChainResult = await revokeCertificateOnChain(targetId, reason);
        revokeCertificateInStore(targetId, reason);
      } else {
        onChainResult = await revokeAlumniOnChain(targetId, reason);
        updateAlumniStatusInStore(targetId, 'Revoked', reason);
      }

      onTxUpdate({
        status: 'confirmed',
        title: `${isCert ? 'Certificate' : 'Alumni Record'} Revoked On-Chain!`,
        txHash: onChainResult.txHash,
        blockNumber: onChainResult.blockNumber,
        gasUsed: onChainResult.gasUsed,
        message: `Revocation state successfully committed. Verification will now flag this credential as invalid.`,
      });

      addTransactionRecord({
        txHash: onChainResult.txHash,
        type: isCert ? 'Certificate Revoked' : 'Alumni Record Revoked',
        blockNumber: onChainResult.blockNumber,
        gasUsed: onChainResult.gasUsed,
        status: 'Confirmed',
        details: `Revoked ${targetId}: ${reason}`,
      });

      onSuccess(targetId);
      onClose();
    } catch (err) {
      console.error('Revocation failed:', err);
      setErrorMsg(err.message || 'Transaction rejected or failed');
      onTxUpdate({
        status: 'error',
        title: 'Revocation Transaction Failed',
        error: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-slate-900 border border-rose-500/40 rounded-3xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Revoke On-Chain Credential</h3>
            <p className="text-xs text-rose-300 font-mono">{targetId} • {targetName}</p>
          </div>
        </div>

        <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <p>
            Warning: Revoking an academic credential writes a permanent status change to the Ethereum Virtual Machine. Public verifiers and employers will see this record as void.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Administrative Revocation Reason *
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="Provide justification (e.g., academic fraud, pre-requisite forgery, disciplinary ruling)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 leading-relaxed"
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
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-lg shadow-rose-600/25 transition flex items-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
              <span>{submitting ? 'Confirming On-Chain...' : 'Confirm Revocation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

