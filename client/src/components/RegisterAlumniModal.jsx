import React, { useState } from 'react';
import { X, PlusCircle, Loader2, Sparkles, GraduationCap } from 'lucide-react';
import { registerAlumniOnChain } from '../services/blockchain';
import { saveAlumniRecord, addTransactionRecord } from '../services/storage';

const ACADEMIC_PROGRAMS = [
  // Department of Engineering and Technology
  {
    course: "B.Tech Computer Science & Engineering",
    department: "Department of Engineering and Technology",
  },
  {
    course: "B.Tech Artificial Intelligence & Machine Learning (AI & ML)",
    department: "Department of Engineering and Technology",
  },
  {
    course: "B.Tech Civil Engineering",
    department: "Department of Engineering and Technology",
  },
  {
    course: "B.Tech Mechanical Engineering",
    department: "Department of Engineering and Technology",
  },

  // Department of Management
  {
    course: "Bachelor of Business Administration (BBA)",
    department: "Department of Management",
  },
  {
    course: "Bachelor of Commerce (B.Com)",
    department: "Department of Management",
  },

  // Department of Hotel Management
  {
    course: "Bachelor of Hotel Management & Catering Technology (BHMCT)",
    department: "Department of Hotel Management",
  },

  // Department of Pharmacy and Medical Sciences
  {
    course: "Bachelor of Pharmacy (B.Pharm)",
    department: "Department of Pharmacy and Medical Sciences",
  },
  {
    course: "Diploma in Pharmacy (D.Pharm)",
    department: "Department of Pharmacy and Medical Sciences",
  },
  {
    course: "B.Sc. Medical Laboratory Sciences (B.Sc. MLS)",
    department: "Department of Pharmacy and Medical Sciences",
  },

  // Department of Fashion Design
  {
    course: "B.Sc. Fashion Design",
    department: "Department of Fashion Design",
  },

  // Department of Technology (at the end)
  {
    course: "Bachelor of Computer Applications (BCA)",
    department: "Department of Technology",
  },
];

export default function RegisterAlumniModal({ isOpen, onClose, onSuccess, onTxStart, onTxUpdate }) {
  const [formData, setFormData] = useState({
    alumniId: `ALU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    degree: 'B.Tech Computer Science & Engineering',
    department: 'Department of Engineering and Technology',
    graduationYear: new Date().getFullYear(),
    cgpa: '8.85',
    email: '',
    phone: '',
    alumniWallet: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProgramSelect = (e) => {
    const selectedCourse = e.target.value;
    const match = ACADEMIC_PROGRAMS.find(p => p.course === selectedCourse);
    if (match) {
      setFormData({
        ...formData,
        degree: match.course,
        department: match.department,
      });
    } else {
      setFormData({ ...formData, degree: selectedCourse });
    }
  };

  const handleQuickSeedFill = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setFormData({
      alumniId: `ALU-2024-${randomNum}`,
      name: 'Aditya Raj',
      degree: 'B.Tech Computer Science & Engineering',
      department: 'Department of Engineering and Technology',
      graduationYear: 2024,
      cgpa: '9.15',
      email: 'aditya.raj@alumni.edu',
      phone: '+91 98450 12345',
      alumniWallet: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.alumniId.trim()) {
      setFormError('Please complete all mandatory identity fields');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      // 1. Trigger pending transaction notification in UI
      onTxStart({
        status: 'pending',
        title: 'MetaMask Approval Requested',
        message: `Please approve the registration transaction for ${formData.name} in MetaMask...`,
      });

      // 2. Call Smart Contract
      const onChainResult = await registerAlumniOnChain({
        alumniId: formData.alumniId,
        name: formData.name,
        degree: formData.degree,
        department: formData.department,
        graduationYear: formData.graduationYear,
        cgpa: formData.cgpa,
        alumniWallet: formData.alumniWallet,
      });

      // 3. Update transaction state to confirmed
      onTxUpdate({
        status: 'confirmed',
        title: 'Alumnus Registered On Blockchain!',
        txHash: onChainResult.txHash,
        blockNumber: onChainResult.blockNumber,
        gasUsed: onChainResult.gasUsed,
        message: `Successfully minted on-chain identity for ${formData.name}.`,
      });

      // 4. Save to local storage for instant dashboard updates
      const newRecord = {
        ...formData,
        dataHash: onChainResult.dataHash,
        status: 'Active',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=0284c7&color=fff`,
        achievements: ["Dean's List Honoree", "Active Member of Technical Society"],
        skills: ["Software Engineering", "Algorithms", "System Design"],
        employment: "Offer Accepted",
      };

      saveAlumniRecord(newRecord);

      // Add to tx history
      addTransactionRecord({
        txHash: onChainResult.txHash,
        type: 'Alumni Registered',
        blockNumber: onChainResult.blockNumber,
        gasUsed: onChainResult.gasUsed,
        status: 'Confirmed',
        details: `Registered ${formData.name} (${formData.alumniId}) on-chain`,
      });

      onSuccess(newRecord);
      onClose();
    } catch (err) {
      console.error('Registration failed:', err);
      setFormError(err.message || 'Transaction rejected or reverted');
      onTxUpdate({
        status: 'error',
        title: 'Registration Transaction Failed',
        error: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-500/10 border border-brand-500/30 rounded-xl text-brand-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Register New Alumnus</h3>
              <p className="text-xs text-slate-400">Creates an immutable student identity on the EVM ledger</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickSeedFill}
            className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autofill Sample</span>
          </button>
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Alumni ID */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Alumni Registration ID *
              </label>
              <input
                type="text"
                name="alumniId"
                value={formData.alumniId}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Student Full Name */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Full Legal Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Aditya Raj"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Degree Title with Academic Program Preset */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Degree Program *
                </label>
                <select
                  onChange={handleProgramSelect}
                  className="bg-slate-900 border border-slate-700 text-[10px] text-brand-300 rounded px-1.5 py-0.5 cursor-pointer focus:outline-none"
                >
                  <option value="">Preset Courses</option>
                  {ACADEMIC_PROGRAMS.map(p => (
                    <option key={p.course} value={p.course}>{p.course}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Department */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Department / Faculty *
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Graduation Year */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Graduation Year *
              </label>
              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                min="1990"
                max="2035"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* CGPA */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Final Cumulative CGPA *
              </label>
              <input
                type="text"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                placeholder="e.g. 9.15"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="aditya@alumni.edu"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Alumnus Wallet Address */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Alumnus Ethereum Address (Optional)
              </label>
              <input
                type="text"
                name="alumniWallet"
                value={formData.alumniWallet}
                onChange={handleChange}
                placeholder="0x..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-500"
              />
            </div>

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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-600 hover:to-blue-700 text-white text-xs font-semibold shadow-lg shadow-brand-500/25 transition flex items-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
              <span>{submitting ? 'Signing in MetaMask...' : 'Submit to Blockchain'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

