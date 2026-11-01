import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WalletModal from './components/WalletModal';
import TransactionModal from './components/TransactionModal';
import RegisterAlumniModal from './components/RegisterAlumniModal';
import IssueCertificateModal from './components/IssueCertificateModal';
import UpdateRecordModal from './components/UpdateRecordModal';
import RevokeModal from './components/RevokeModal';

import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import AlumniManagement from './pages/AlumniManagement';
import AlumniProfile from './pages/AlumniProfile';
import CertificateManagement from './pages/CertificateManagement';
import VerifyRecord from './pages/VerifyRecord';
import VerifyCertificate from './pages/VerifyCertificate';
import TransactionHistory from './pages/TransactionHistory';
import FacultyDemoGuide from './pages/FacultyDemoGuide';

import { 
  getStoredAlumni, 
  getStoredCertificates, 
  updateAlumniStatusInStore, 
  addTransactionRecord 
} from './services/storage';
import { 
  fetchSystemStatistics, 
  connectMetaMask, 
  reinstateAlumniOnChain 
} from './services/blockchain';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [selectedAlumniId, setSelectedAlumniId] = useState('ALU-2024-001');
  const [verifyInitialQuery, setVerifyInitialQuery] = useState('');

  // Local state caches
  const [alumniList, setAlumniList] = useState([]);
  const [certificatesList, setCertificatesList] = useState([]);
  const [stats, setStats] = useState(null);

  // Web3 Wallet State
  const [walletState, setWalletState] = useState(null);

  // Modal controls
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [txModalState, setTxModalState] = useState(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [updateModalTarget, setUpdateModalTarget] = useState(null);
  const [revokeModalTarget, setRevokeModalTarget] = useState(null);
  const [revokeModalType, setRevokeModalType] = useState('ALU'); // 'ALU' | 'CERT'

  // URL Hash Synchronizer for QR scan links and deep-linking
  const parseCurrentHash = () => {
    const rawHash = window.location.hash.replace(/^#\/?/, '');
    if (!rawHash) return;

    const [route, queryString] = rawHash.split('?');
    const params = new URLSearchParams(queryString || '');
    const queryId = params.get('id') || params.get('alumniId') || '';

    if (route === 'verify-cert') {
      setActivePage('verify-cert');
      if (queryId) setVerifyInitialQuery(queryId);
    } else if (route === 'verify-record') {
      setActivePage('verify-record');
      if (queryId) setVerifyInitialQuery(queryId);
    } else if (route === 'alumni-profile') {
      setActivePage('alumni-profile');
      if (queryId) setSelectedAlumniId(queryId);
    } else if (['landing', 'admin', 'alumni', 'certificates', 'transactions', 'demo-guide'].includes(route)) {
      setActivePage(route);
    }
  };

  // Initialize data on mount
  useEffect(() => {
    parseCurrentHash();
    window.addEventListener('hashchange', parseCurrentHash);
    refreshData();
    // Auto-detect MetaMask if already authorized
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts && accounts.length > 0) {
            connectMetaMask().then(setWalletState).catch(() => {});
          }
        });

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          connectMetaMask().then(setWalletState).catch(() => {});
        } else {
          setWalletState(null);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => window.removeEventListener('hashchange', parseCurrentHash);
  }, []);

  const refreshData = async () => {
    const alumni = getStoredAlumni();
    const certs = getStoredCertificates();
    setAlumniList(alumni);
    setCertificatesList(certs);

    // Try fetching live on-chain contract statistics
    const onChainStats = await fetchSystemStatistics();
    if (onChainStats) {
      setStats(onChainStats);
    } else {
      // Fallback to local counts
      setStats({
        totalAlumni: alumni.length,
        activeAlumni: alumni.filter(a => a.status === 'Active').length,
        revokedAlumni: alumni.filter(a => a.status === 'Revoked').length,
        totalCertificates: certs.length,
        activeCertificates: certs.filter(c => !c.isRevoked).length,
        revokedCertificates: certs.filter(c => c.isRevoked).length,
      });
    }
  };

  const handleNavigate = (page, param) => {
    if (page === 'alumni-profile' && param) {
      setSelectedAlumniId(param);
      window.location.hash = `alumni-profile?id=${param}`;
    } else if ((page === 'verify-record' || page === 'verify-cert') && param) {
      setVerifyInitialQuery(param);
      window.location.hash = `${page}?id=${param}`;
    } else {
      setVerifyInitialQuery('');
      window.location.hash = page;
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reinstate an Alumnus
  const handleReinstateAlumni = async (alumniId) => {
    setTxModalState({
      status: 'pending',
      title: 'MetaMask Approval Requested',
      message: `Approving reinstatement of ${alumniId} on the blockchain...`,
    });

    try {
      const res = await reinstateAlumniOnChain(alumniId);
      updateAlumniStatusInStore(alumniId, 'Active', '');
      addTransactionRecord({
        txHash: res.txHash,
        type: 'Alumni Record Reinstated',
        blockNumber: res.blockNumber,
        gasUsed: res.gasUsed,
        status: 'Confirmed',
        details: `Reinstated alumnus ${alumniId} to Active`,
      });

      setTxModalState({
        status: 'confirmed',
        title: 'Alumnus Reinstated On-Chain!',
        txHash: res.txHash,
        blockNumber: res.blockNumber,
        gasUsed: res.gasUsed,
        message: `Record ${alumniId} is once again valid and verified.`,
      });
      refreshData();
    } catch (err) {
      setTxModalState({
        status: 'error',
        title: 'Reinstatement Failed',
        error: err.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050814] text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        activePage={activePage}
        setActivePage={handleNavigate}
        walletState={walletState}
        onOpenWalletModal={() => setWalletModalOpen(true)}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        {activePage === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            stats={stats}
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboard
            stats={stats}
            alumniList={alumniList}
            certificatesList={certificatesList}
            walletState={walletState}
            onNavigate={handleNavigate}
            onOpenWalletModal={() => setWalletModalOpen(true)}
            onOpenRegisterModal={() => setRegisterModalOpen(true)}
            onOpenIssueModal={() => setIssueModalOpen(true)}
          />
        )}

        {activePage === 'alumni' && (
          <AlumniManagement
            alumniList={alumniList}
            onNavigate={handleNavigate}
            onOpenRegisterModal={() => setRegisterModalOpen(true)}
            onOpenUpdateModal={(alumnus) => setUpdateModalTarget(alumnus)}
            onOpenRevokeModal={(alumnus) => {
              setRevokeModalTarget(alumnus);
              setRevokeModalType('ALU');
            }}
            onReinstateAlumni={handleReinstateAlumni}
          />
        )}

        {activePage === 'alumni-profile' && (
          <AlumniProfile
            alumniId={selectedAlumniId}
            alumniList={alumniList}
            certificatesList={certificatesList}
            onBack={() => handleNavigate('alumni')}
            onNavigate={handleNavigate}
            onOpenIssueModal={() => setIssueModalOpen(true)}
          />
        )}

        {activePage === 'certificates' && (
          <CertificateManagement
            certificatesList={certificatesList}
            onOpenIssueModal={() => setIssueModalOpen(true)}
            onOpenRevokeModal={(cert) => {
              setRevokeModalTarget(cert);
              setRevokeModalType('CERT');
            }}
            onNavigate={handleNavigate}
            isAdmin={true}
          />
        )}

        {activePage === 'verify-record' && (
          <VerifyRecord
            initialQuery={verifyInitialQuery}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'verify-cert' && (
          <VerifyCertificate
            initialId={verifyInitialQuery}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'transactions' && (
          <TransactionHistory />
        )}

        {activePage === 'demo-guide' && (
          <FacultyDemoGuide
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Interactive Global Modals */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        walletState={walletState}
        onWalletConnected={(data) => {
          setWalletState(data);
          refreshData();
        }}
      />

      <TransactionModal
        isOpen={!!txModalState}
        onClose={() => setTxModalState(null)}
        state={txModalState}
      />

      <RegisterAlumniModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSuccess={() => refreshData()}
        onTxStart={(st) => setTxModalState(st)}
        onTxUpdate={(st) => setTxModalState(st)}
      />

      <IssueCertificateModal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        alumniList={alumniList}
        onSuccess={() => refreshData()}
        onTxStart={(st) => setTxModalState(st)}
        onTxUpdate={(st) => setTxModalState(st)}
      />

      <UpdateRecordModal
        isOpen={!!updateModalTarget}
        onClose={() => setUpdateModalTarget(null)}
        alumnus={updateModalTarget}
        onSuccess={() => refreshData()}
        onTxStart={(st) => setTxModalState(st)}
        onTxUpdate={(st) => setTxModalState(st)}
      />

      <RevokeModal
        isOpen={!!revokeModalTarget}
        onClose={() => setRevokeModalTarget(null)}
        targetItem={revokeModalTarget}
        targetType={revokeModalType === 'CERT' ? 'CERTIFICATE' : 'ALUMNI'}
        onSuccess={() => refreshData()}
        onTxStart={(st) => setTxModalState(st)}
        onTxUpdate={(st) => setTxModalState(st)}
      />

    </div>
  );
}

