import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  GraduationCap, 
  FileCheck, 
  Search, 
  History, 
  Menu, 
  X, 
  Layers, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, walletState, onOpenWalletModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Layers },
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck },
    { id: 'alumni', label: 'Alumni Directory', icon: GraduationCap },
    { id: 'certificates', label: 'Certificates', icon: FileCheck },
    { id: 'verify-record', label: 'Verify Record', icon: Search },
    { id: 'verify-cert', label: 'Verify Certificate', icon: FileCheck },
    { id: 'transactions', label: 'Explorer', icon: History },
    { id: 'demo-guide', label: 'Demo Guide', icon: HelpCircle },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center shrink-0">
          <div 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-0.5 shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">Alumnix</span>
            </div>
          </div>

          {/* Elegant Divider between Brand and Nav Items */}
          <div className="hidden lg:block h-6 w-px bg-slate-800 ml-4 mr-2"></div>
        </div>

        {/* Desktop Navigation - Visible on Laptops and Desktops */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-2 py-1.5 xl:px-2.5 xl:py-2 rounded-xl text-[11px] xl:text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Wallet Status & Mobile Trigger */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {walletState?.address ? (
            Number(walletState.chainId) !== 31337 ? (
              <button
                onClick={onOpenWalletModal}
                className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 rounded-xl text-xs text-amber-300 transition shadow-sm animate-pulse whitespace-nowrap shrink-0"
                title="Click to switch to Hardhat Localhost"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                <span className="font-semibold whitespace-nowrap">Switch to Hardhat (31337)</span>
              </button>
            ) : (
              <button
                onClick={onOpenWalletModal}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-brand-500/40 rounded-xl text-xs transition shadow-sm whitespace-nowrap shrink-0"
              >
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="text-slate-300 font-mono whitespace-nowrap hidden 2xl:inline">
                    Hardhat Localhost
                  </span>
                  <span className="text-slate-300 font-mono whitespace-nowrap 2xl:hidden">
                    Hardhat
                  </span>
                </div>
                <div className="h-3.5 w-px bg-slate-700 shrink-0"></div>
                <span className="font-mono text-brand-300 font-medium whitespace-nowrap shrink-0">
                  {walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}
                </span>
              </button>
            )
          ) : (
            <button
              onClick={onOpenWalletModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-600 hover:to-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-brand-500/20 transition hover:scale-[1.02] whitespace-nowrap"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Connect Wallet</span>
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                    : 'text-slate-300 hover:bg-slate-900 text-left'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

