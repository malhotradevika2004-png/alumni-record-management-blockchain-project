import React from 'react';
import { GraduationCap, ShieldCheck, Cpu, Terminal, ExternalLink, Code2 } from 'lucide-react';
import { CONTRACT_ADDRESS } from '../services/blockchain';

export default function Footer({ onNavigate }) {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base">Alumnix</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Enterprise-grade Alumni Record Management & Academic Credential Verification Platform built on Ethereum Virtual Machine (EVM).
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Solidity 0.8.20 Smart Contract
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-brand-300 transition">
                  Platform Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-brand-300 transition">
                  Institution Admin Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('alumni')} className="hover:text-brand-300 transition">
                  Alumni Records Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('certificates')} className="hover:text-brand-300 transition">
                  Certificate Issuance
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('transactions')} className="hover:text-brand-300 transition">
                  Blockchain Transaction Logs
                </button>
              </li>
            </ul>
          </div>

          {/* Verification Portals */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Public Portals</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('verify-record')} className="hover:text-brand-300 transition">
                  Public Record Authenticator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('verify-cert')} className="hover:text-brand-300 transition">
                  Public Certificate Verifier
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('demo-guide')} className="hover:text-brand-300 transition text-amber-300 font-medium">
                  Faculty Demonstration Walkthrough
                </button>
              </li>
            </ul>
          </div>

          {/* Smart Contract Technical Information */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Smart Contract Info</h4>
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5 font-mono text-[11px]">
              <div className="text-slate-400">Contract Address:</div>
              <div className="text-brand-300 truncate font-semibold" title={CONTRACT_ADDRESS}>
                {CONTRACT_ADDRESS}
              </div>
              <div className="text-slate-400 pt-1">Standard: EVM State Machine</div>
              <div className="text-emerald-400">Keccak-256 Tamper Resistance</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-[11px]">
            B.Tech Final Year Major Project • Blockchain Technology • General-Purpose Educational System
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Role-Based Access Control</span>
            <span>•</span>
            <span>Zero-Knowledge Proof Friendly</span>
            <span>•</span>
            <span>MetaMask Enabled</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

