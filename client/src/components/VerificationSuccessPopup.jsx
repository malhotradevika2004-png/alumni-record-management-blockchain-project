import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function VerificationSuccessPopup({ 
  isOpen, 
  onClose, 
  title = "Credential Verified", 
  subtitle = "Authentic academic record confirmed on Ethereum Smart Contract" 
}) {
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
        className="relative w-full max-w-sm p-6 sm:p-7 bg-slate-900/95 border-2 border-emerald-500/40 rounded-3xl shadow-2xl text-center transform scale-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Center Animated Green Tick Symbol */}
        <div className="relative mx-auto w-20 h-20 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-60"></div>
          <div className="relative w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        </div>

        {/* Institutional Verification Status */}
        <div className="inline-block px-3 py-0.5 mb-2.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold tracking-wider uppercase font-mono">
          Cryptographic Proof Verified
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          {title}
        </h3>
        
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
          {subtitle}
        </p>

        <div className="mt-5 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
          >
            View Official Record
          </button>
        </div>
      </div>
    </div>
  );
}

