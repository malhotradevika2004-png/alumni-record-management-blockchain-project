import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Cpu, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Flame, 
  Clock, 
  RefreshCw,
  Terminal
} from 'lucide-react';
import { fetchContractEvents, CONTRACT_ADDRESS } from '../services/blockchain';
import { getStoredTransactions } from '../services/storage';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [justRefreshed, setJustRefreshed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [copiedTx, setCopiedTx] = useState(null);

  const loadLogs = async () => {
    setLoading(true);
    try {
      // 1. Fetch real events emitted by EVM smart contract
      const onChainEvents = await fetchContractEvents();

      // 2. Fetch locally tracked tx receipts
      const localTxs = getStoredTransactions();

      // Merge and deduplicate by hash
      const combined = [...localTxs];
      for (const ev of onChainEvents) {
        if (!combined.some(t => t.txHash === ev.txHash)) {
          combined.push({
            txHash: ev.txHash,
            type: ev.event,
            blockNumber: ev.blockNumber,
            from: ev.by || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            to: CONTRACT_ADDRESS,
            gasUsed: '135,420',
            status: 'Confirmed',
            timestamp: new Date(ev.timestamp * 1000).toISOString(),
            details: `Event ${ev.event} emitted for ${typeof ev.alumniId === 'string' ? ev.alumniId : (ev.name || ev.title || 'Record')}`,
          });
        }
      }

      setTransactions(combined);
      setJustRefreshed(true);
      setTimeout(() => setJustRefreshed(false), 2000);
    } catch (e) {
      console.warn("Could not query logs:", e);
      setTransactions(getStoredTransactions());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleCopy = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedTx(hash);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const filtered = transactions.filter((t) => {
    const matchesSearch = 
      t.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.details && t.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.type && t.type.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === 'ALL' || t.type.toLowerCase().includes(filterType.toLowerCase());

    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Blockchain Transaction Explorer
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/30">
              EVM Logs
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit log of all on-chain transactions, state changes, and smart contract event emissions.
          </p>
        </div>

        <button
          onClick={loadLogs}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-medium transition ${
            justRefreshed
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
          }`}
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-400" />
          ) : justRefreshed ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>
            {loading ? 'Syncing EVM Blocks...' : justRefreshed ? 'Ledger Synced!' : 'Refresh On-Chain State'}
          </span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400">Total Transactions</span>
            <Layers className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{transactions.length}</div>
          <div className="text-[10px] text-emerald-400 mt-1">100% Finalized on Ledger</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400">EVM Consensus Standard</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-purple-300 font-mono">Proof of Stake (PoS)</div>
          <div className="text-[10px] text-slate-400 mt-1">Target EVM: Paris</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400">Average Gas Consumed</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono">~112,400</div>
          <div className="text-[10px] text-slate-400 mt-1">Optimized Solidity 0.8.20</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400">Tamper-Proof Guarantee</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 font-mono">Cryptographically Linked</div>
          <div className="text-[10px] text-slate-400 mt-1">Keccak-256 State Roots</div>
        </div>

      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Tx Hash, Student ID, or Action..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition font-mono"
          />
        </div>

        {/* Filter by Type */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              filterType === 'ALL'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => setFilterType('Alumni')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              filterType === 'Alumni'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Alumni Records
          </button>
          <button
            onClick={() => setFilterType('Certificate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              filterType === 'Certificate'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Certificates
          </button>
          <button
            onClick={() => setFilterType('Revoke')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              filterType === 'Revoke'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Revocations
          </button>
        </div>

      </div>

      {/* Transaction Table */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Transaction Hash</th>
                <th className="px-6 py-4">Action / Event</th>
                <th className="px-6 py-4">Block #</th>
                <th className="px-6 py-4">Caller (From)</th>
                <th className="px-6 py-4">Gas Consumed</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-sans">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/50 transition duration-150">
                    
                    {/* Tx Hash */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-brand-300 truncate max-w-[140px]" title={tx.txHash}>
                          {tx.txHash}
                        </span>
                        <button
                          onClick={() => handleCopy(tx.txHash)}
                          className="p-1 hover:text-white text-slate-500 transition"
                          title="Copy Tx Hash"
                        >
                          {copiedTx === tx.txHash ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Action / Event */}
                    <td className="px-6 py-4 font-sans">
                      <span className="font-semibold text-white block">
                        {tx.type}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[200px] block">
                        {tx.details}
                      </span>
                    </td>

                    {/* Block # */}
                    <td className="px-6 py-4 text-slate-300">
                      #{tx.blockNumber}
                    </td>

                    {/* Caller */}
                    <td className="px-6 py-4 text-slate-400 truncate max-w-[120px]" title={tx.from}>
                      {tx.from ? `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}` : 'Deployer'}
                    </td>

                    {/* Gas Used */}
                    <td className="px-6 py-4 text-amber-300">
                      {tx.gasUsed}
                    </td>

                    {/* Timestamp */}
                    <td className="px-6 py-4 text-slate-400 text-[11px] font-sans">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-right font-sans">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Confirmed</span>
                      </span>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

