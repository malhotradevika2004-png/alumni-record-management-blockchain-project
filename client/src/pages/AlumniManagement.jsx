import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  PlusCircle, 
  MoreVertical, 
  ExternalLink, 
  FileEdit, 
  ShieldAlert, 
  CheckCircle2, 
  X,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import RecordBadge from '../components/RecordBadge';

export default function AlumniManagement({ 
  alumniList, 
  onNavigate, 
  onOpenRegisterModal,
  onOpenUpdateModal,
  onOpenRevokeModal,
  onReinstateAlumni 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('year-desc');

  // Extract unique departments
  const departments = ['ALL', ...new Set(alumniList.map(a => a.department))];

  // Filtering
  const filteredAlumni = alumniList.filter((a) => {
    const matchesSearch = 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.alumniId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.degree.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || a.department === selectedDept;
    const matchesStatus = selectedStatus === 'ALL' || a.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Sorting
  filteredAlumni.sort((a, b) => {
    if (sortBy === 'year-desc') return b.graduationYear - a.graduationYear;
    if (sortBy === 'year-asc') return a.graduationYear - b.graduationYear;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'cgpa-desc') return (parseFloat(b.cgpa) || 0) - (parseFloat(a.cgpa) || 0);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Alumni Records Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/30">
              {filteredAlumni.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, update, and manage official on-chain verified alumni academic credentials.
          </p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-600 hover:to-blue-700 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Alumnus</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Name, Alumni ID, Degree..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
          />
        </div>

        {/* Department Filter */}
        <div className="relative">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 transition appearance-none cursor-pointer"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                Department: {d}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 transition appearance-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Status: Active</option>
            <option value="Updated">Status: Updated</option>
            <option value="Revoked">Status: Revoked</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 transition appearance-none cursor-pointer"
          >
            <option value="year-desc">Sort: Year (Newest First)</option>
            <option value="year-asc">Sort: Year (Oldest First)</option>
            <option value="name-asc">Sort: Name (A-Z)</option>
            <option value="cgpa-desc">Sort: Highest CGPA</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
        </div>

      </div>

      {/* Alumni Directory Table */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Alumni Identity</th>
                <th className="px-6 py-4">Degree & Department</th>
                <th className="px-6 py-4">Graduation & CGPA</th>
                <th className="px-6 py-4">On-Chain Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAlumni.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    No alumni records found matching the current search filters.
                  </td>
                </tr>
              ) : (
                filteredAlumni.map((alumnus) => (
                  <tr 
                    key={alumnus.alumniId}
                    className="hover:bg-slate-850/50 transition duration-150"
                  >
                    {/* Identity */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={alumnus.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(alumnus.name)}&background=0284c7&color=fff`}
                          alt={alumnus.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div 
                            onClick={() => onNavigate('alumni-profile', alumnus.alumniId)}
                            className="font-bold text-white hover:text-brand-300 cursor-pointer transition"
                          >
                            {alumnus.name}
                          </div>
                          <div className="font-mono text-[11px] text-brand-400">
                            {alumnus.alumniId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Degree */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">
                        {alumnus.degree}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {alumnus.department}
                      </div>
                    </td>

                    {/* Year & Grade */}
                    <td className="px-6 py-4 font-mono">
                      <div className="text-slate-200">
                        Class of {alumnus.graduationYear}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-semibold">
                        CGPA: {alumnus.cgpa || '8.80'}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <RecordBadge status={alumnus.status} reason={alumnus.revocationReason} size="sm" />
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onNavigate('alumni-profile', alumnus.alumniId)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="View Profile"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenUpdateModal(alumnus)}
                          disabled={alumnus.status === 'Revoked'}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-brand-500/20 text-slate-300 hover:text-brand-300 transition disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Update On-Chain Record"
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>

                        {alumnus.status === 'Revoked' ? (
                          <button
                            onClick={() => onReinstateAlumni(alumnus.alumniId)}
                            className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition"
                            title="Reinstate Alumnus"
                          >
                            Reinstate
                          </button>
                        ) : (
                          <button
                            onClick={() => onOpenRevokeModal(alumnus)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 transition"
                            title="Revoke Record"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                        )}
                      </div>
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

