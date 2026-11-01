import React, { useEffect } from 'react';
import { XCircle, X, AlertTriangle } from 'lucide-react';

export default function VerificationFailurePopup({ 
  isOpen, 
  onClose, 
  type = 'NOT_FOUND', // 'NOT_FOUND' | 'REVOKED'
  title, 
  subtitle 
}) {
  const isRevoked = type === 'REVOKED';

  const defaultTitle = isRevoked ? "Credential Revoked" : "Verification Failed";
  const defaultSubtitle = isRevoked 
    ? "This record has been officially invalidated and marked void by the institution."
    : "No matching record was found on the Ethereum blockchain. Potential invalid or counterfeit ID.";

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm p-6 sm:p-7 bg-slate-900/95 border-2 border-rose-500/40 rounded-3xl shadow-2xl text-center transform scale-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Center Animated Red Cross / Alert Symbol */}
        <div className="relative mx-auto w-20 h-20 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping opacity-60"></div>
          <div className="relative w-20 h-20 rounded-full bg-rose-500/15 border-2 border-rose-400 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/30">
            {isRevoked ? <AlertTriangle className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
          </div>
        </div>

        {/* Institutional Alert Status Pill */}
        <div className="inline-block px-3 py-0.5 mb-2.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-semibold tracking-wider uppercase font-mono">
          {isRevoked ? 'EVM Status: Record Revoked' : 'EVM Status: Not Found'}
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          {title || defaultTitle}
        </h3>
        
        <p className="text-xs text-rose-200/80 mt-1.5 leading-relaxed">
          {subtitle || defaultSubtitle}
        </p>

        <div className="mt-5 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-500/90 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition"
          >
            Review Warning Report
          </button>
        </div>
      </div>
    </div>
  );
}

