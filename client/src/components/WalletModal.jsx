import React, { useState } from 'react';
import { Wallet, Check, Copy, ExternalLink, X, ShieldCheck, Cpu } from 'lucide-react';
import { connectMetaMask, switchNetwork } from '../services/blockchain';

export default function WalletModal({ isOpen, onClose, walletState, onWalletConnected }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen) return null;

  const testAccount = {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    balance: "10,000 ETH",
    role: "Contract Deployer & Institution Admin",
  };

  const handleConnect = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await connectMetaMask(true);
      onWalletConnected(data);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to connect MetaMask');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchLocal = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await switchNetwork('localhost');
      const data = await connectMetaMask(false);
      onWalletConnected(data);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to switch network');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchSepolia = async () => {
    try {
      await switchNetwork('sepolia');
      const data = await connectMetaMask();
      onWalletConnected(data);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const copyTestKey = () => {
    navigator.clipboard.writeText(testAccount.privateKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto p-6 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-brand-500/10 border border-brand-500/30 rounded-xl text-brand-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Web3 Wallet Connection</h3>
            <p className="text-xs text-slate-400">EVM & MetaMask Integration</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        {walletState?.address ? (
          <div className="mb-5 p-4 bg-slate-950/80 border border-emerald-500/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Status:</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Network:</span>
              <span className="text-slate-200 font-mono">{walletState.networkName} (Chain ID: {walletState.chainId})</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Wallet:</span>
              <span className="text-brand-300 font-mono truncate max-w-[190px]">{walletState.address}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Balance:</span>
              <span className="text-white font-semibold font-mono">{walletState.balance} ETH</span>
            </div>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full mb-5 py-3 px-4 bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-600 hover:to-blue-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-brand-500/25 transition flex items-center justify-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            {loading ? 'Connecting to MetaMask...' : 'Connect MetaMask'}
          </button>
        )}

        {/* Network Switching Section */}
        <div className="mb-5">
          <label className="text-xs font-medium text-slate-300 mb-2 block">Quick Switch Network</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSwitchLocal}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-brand-500/50 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition"
            >
              <Cpu className="w-3.5 h-3.5 text-brand-400" />
              Hardhat (31337)
            </button>
            <button
              onClick={handleSwitchSepolia}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Sepolia Testnet
            </button>
          </div>
        </div>

        {/* Faculty Demonstration Helper Box */}
        <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
              <span>💡</span> Faculty Demonstration Note
            </span>
            <span className="text-[10px] text-slate-400">Hardhat Account #0</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
            Import this pre-funded test account into MetaMask to immediately test authorized Admin transactions (10,000 ETH available on Localhost):
          </p>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
            <span className="truncate max-w-[240px]">{testAccount.privateKey}</span>
            <button
              onClick={copyTestKey}
              className="ml-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 transition"
            >
              {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

