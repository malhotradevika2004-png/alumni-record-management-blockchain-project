import React from 'react';
import { Loader2, CheckCircle2, AlertTriangle, ExternalLink, X, Copy, Check } from 'lucide-react';

export default function TransactionModal({ isOpen, onClose, state }) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !state) return null;

  const { status, txHash, blockNumber, gasUsed, title, message, error } = state;

  const handleCopy = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          disabled={status === 'pending' || status === 'mining'}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          {status === 'pending' && (
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}

          {status === 'mining' && (
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}

          {status === 'confirmed' && (
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          )}

          {status === 'error' && (
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
          )}

          <h3 className="text-xl font-bold text-white mb-1">
            {title || (
              status === 'pending' ? 'MetaMask Approval Requested' :
              status === 'mining' ? 'Broadcasting to Blockchain' :
              status === 'confirmed' ? 'Transaction Confirmed On-Chain!' :
              'Transaction Failed'
            )}
          </h3>

          <p className="text-sm text-slate-400">
            {message || (
              status === 'pending' ? 'Please approve the transaction prompt inside your MetaMask wallet...' :
              status === 'mining' ? 'Transaction submitted. Waiting for EVM block confirmation...' :
              status === 'confirmed' ? 'The state has been permanently recorded on the immutable ledger.' :
              error || 'The transaction could not be processed.'
            )}
          </p>
        </div>

        {/* Transaction Details Box */}
        {txHash && (
          <div className="mb-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Tx Hash:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-brand-300 truncate max-w-[210px]">{txHash}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 hover:text-white text-slate-400 rounded transition"
                  title="Copy Hash"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {blockNumber && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Block Number:</span>
                <span className="text-slate-200">#{blockNumber}</span>
              </div>
            )}

            {gasUsed && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Gas Consumed:</span>
                <span className="text-slate-200">{Number(gasUsed).toLocaleString()} units</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Execution Status:</span>
              <span className="text-emerald-400 font-semibold">1 (Success)</span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={status === 'pending' || status === 'mining'}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {status === 'confirmed' ? 'Done' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

