import { ethers } from 'ethers';
import contractConfig from '../contracts/AlumniRecordManagement.json';

export const CONTRACT_ADDRESS = contractConfig.address || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const CONTRACT_ABI = contractConfig.abi || [];

// Target Network Configurations
export const NETWORKS = {
  localhost: {
    chainId: '0x7a69', // 31337 in decimal
    chainName: 'Hardhat Localhost',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['http://127.0.0.1:8545'],
  },
  sepolia: {
    chainId: '0xaa36a7', // 11155111 in decimal
    chainName: 'Sepolia Testnet',
    nativeCurrency: { name: 'Sepolia ETH', symbol: 'SEP', decimals: 18 },
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
};

/**
 * Returns read-only provider for public verifications.
 * Queries local Hardhat JSON-RPC node directly so verification NEVER fails
 * regardless of whether MetaMask is locked, disconnected, or set to Mainnet/Sepolia.
 */
export const getReadProvider = () => {
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
  }
  return new ethers.JsonRpcProvider('http://127.0.0.1:8545');
};

export const getProvider = () => {
  return getReadProvider();
};

/**
 * Connect to MetaMask wallet (Non-blocking & auto-resolving)
 */
export const connectMetaMask = async (autoSwitchLocal = false) => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask to perform administrative transactions or switch to Public Verification mode.');
  }

  // 1. Check if already authorized (instant, zero delay)
  let accounts = [];
  try {
    accounts = await window.ethereum.request({ method: 'eth_accounts' });
  } catch (e) {
    console.warn("eth_accounts check:", e);
  }

  // 2. If not yet authorized, request permission with a safety timeout
  if (!accounts || accounts.length === 0) {
    const requestPromise = window.ethereum.request({ method: 'eth_requestAccounts' });
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('MetaMask is waiting for approval. Please click the Fox icon in your browser toolbar to open MetaMask and approve.')), 12000)
    );
    accounts = await Promise.race([requestPromise, timeoutPromise]);
  }

  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts authorized in MetaMask.');
  }

  // 3. Check and switch network if requested
  if (autoSwitchLocal) {
    try {
      const currentChain = await window.ethereum.request({ method: 'eth_chainId' });
      if (currentChain !== '0x7a69') {
        await switchNetwork('localhost');
      }
    } catch (switchErr) {
      console.warn("Network switch notice:", switchErr);
    }
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();
  const balanceWei = await provider.getBalance(accounts[0]);
  const balance = ethers.formatEther(balanceWei);

  return {
    address: accounts[0],
    signer,
    networkName: Number(network.chainId) === 31337 ? 'Hardhat Localhost' : network.name,
    chainId: Number(network.chainId),
    balance: Number(balance).toFixed(4),
  };
};

/**
 * Switch network on MetaMask
 */
export const switchNetwork = async (networkKey = 'localhost') => {
  if (!window.ethereum) return false;
  const target = NETWORKS[networkKey];
  if (!target) return false;

  const chainIdHex = target.chainId;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
    return true;
  } catch (switchError) {
    // Error code 4902 indicates that the chain has not been added to MetaMask yet
    const isUnrecognized = 
      switchError.code === 4902 || 
      switchError?.data?.originalError?.code === 4902 ||
      (switchError.message && switchError.message.toLowerCase().includes('unrecognized'));

    if (isUnrecognized) {
      const addParams = {
        chainId: target.chainId,
        chainName: target.chainName,
        nativeCurrency: target.nativeCurrency,
        rpcUrls: target.rpcUrls,
      };
      if (target.blockExplorerUrls && target.blockExplorerUrls.length > 0) {
        addParams.blockExplorerUrls = target.blockExplorerUrls;
      }

      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [addParams],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add network to MetaMask:', addError);
        throw addError;
      }
    }
    console.error('Failed to switch network on MetaMask:', switchError);
    throw switchError;
  }
};

/**
 * Get contract with signer for write operations
 */
export const getWriteContract = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is required to submit transactions to the blockchain.');
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

/**
 * Get contract with read-only provider for view operations
 */
export const getReadContract = () => {
  const provider = getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

// ----------------------------------------------------------------------------
// SMART CONTRACT OPERATIONS
// ----------------------------------------------------------------------------

/**
 * Register Alumnus on-chain
 */
export const registerAlumniOnChain = async ({
  alumniId,
  name,
  degree,
  department,
  graduationYear,
  cgpa,
  alumniWallet = ethers.ZeroAddress
}) => {
  const contract = await getWriteContract();

  // Generate cryptographic hash of canonical student record
  const payload = `${alumniId}|${name}|${degree}|${department}|${graduationYear}|${cgpa}`;
  const dataHash = ethers.keccak256(ethers.toUtf8Bytes(payload));

  const tx = await contract.registerAlumni(
    alumniId,
    name,
    degree,
    department,
    Number(graduationYear),
    dataHash,
    alumniWallet || ethers.ZeroAddress
  );

  const receipt = await tx.wait();
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    dataHash,
  };
};

/**
 * Update Alumnus Record on-chain
 */
export const updateAlumniOnChain = async ({
  alumniId,
  newDegree,
  newDepartment,
  newCgpa,
  alumniWallet = ethers.ZeroAddress
}) => {
  const contract = await getWriteContract();

  const payload = `${alumniId}|UPDATED|${newDegree}|${newDepartment}|${newCgpa}`;
  const newDataHash = ethers.keccak256(ethers.toUtf8Bytes(payload));

  const tx = await contract.updateAlumniRecord(
    alumniId,
    newDegree,
    newDepartment,
    newDataHash,
    alumniWallet || ethers.ZeroAddress
  );

  const receipt = await tx.wait();
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    newDataHash,
  };
};

/**
 * Revoke Alumni Record on-chain
 */
export const revokeAlumniOnChain = async (alumniId, reason) => {
  const contract = await getWriteContract();
  const tx = await contract.revokeAlumniRecord(alumniId, reason);
  const receipt = await tx.wait();
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
  };
};

/**
 * Reinstate Alumni Record on-chain
 */
export const reinstateAlumniOnChain = async (alumniId) => {
  const contract = await getWriteContract();
  const tx = await contract.reinstateAlumniRecord(alumniId);
  const receipt = await tx.wait();
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
  };
};

/**
 * Issue Certificate on-chain
 */
export const issueCertificateOnChain = async ({
  certificateId,
  alumniId,
  title,
  cgpaOrGrade,
}) => {
  const contract = await getWriteContract();

  // Create unique cryptographic footprint for this certificate
  const certPayload = `${certificateId}|${alumniId}|${title}|${cgpaOrGrade}|${Date.now()}`;
  const certHash = ethers.keccak256(ethers.toUtf8Bytes(certPayload));

  const tx = await contract.issueCertificate(
    certificateId,
    alumniId,
    title,
    cgpaOrGrade,
    certHash
  );

  const receipt = await tx.wait();
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    certHash,
  };
};

/**
 * Revoke Certificate on-chain
 */
export const revokeCertificateOnChain = async (certificateId, reason) => {
  const contract = await getWriteContract();
  const tx = await contract.revokeCertificate(certificateId, reason);
  const receipt = await tx.wait();
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
  };
};

/**
 * Public Verification of Alumni Record
 */
export const verifyAlumniOnChain = async (alumniId) => {
  const cleanId = (alumniId || '').trim();
  try {
    const contract = getReadContract();
    const [isValid, record] = await contract.verifyAlumni(cleanId);
    return {
      isValid,
      record: {
        alumniId: record.alumniId,
        name: record.name,
        degree: record.degree,
        department: record.department,
        graduationYear: Number(record.graduationYear),
        dataHash: record.dataHash,
        registrationDate: new Date(Number(record.registrationDate) * 1000).toISOString(),
        lastUpdatedDate: new Date(Number(record.lastUpdatedDate) * 1000).toISOString(),
        status: Number(record.status), // 0: Active, 1: Updated, 2: Revoked
        statusText: Number(record.status) === 0 ? 'Active' : Number(record.status) === 1 ? 'Updated' : 'Revoked',
        alumniWallet: record.alumniWallet,
        isRegistered: record.isRegistered,
        revocationReason: record.revocationReason,
      },
    };
  } catch (error) {
    console.warn("Direct RPC verifyAlumni failed, checking fallback:", error.message);
    if (window.ethereum) {
      try {
        const bp = new ethers.BrowserProvider(window.ethereum);
        const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, bp);
        const [isValid, record] = await c.verifyAlumni(cleanId);
        return {
          isValid,
          record: {
            alumniId: record.alumniId,
            name: record.name,
            degree: record.degree,
            department: record.department,
            graduationYear: Number(record.graduationYear),
            dataHash: record.dataHash,
            registrationDate: new Date(Number(record.registrationDate) * 1000).toISOString(),
            lastUpdatedDate: new Date(Number(record.lastUpdatedDate) * 1000).toISOString(),
            status: Number(record.status),
            statusText: Number(record.status) === 0 ? 'Active' : Number(record.status) === 1 ? 'Updated' : 'Revoked',
            alumniWallet: record.alumniWallet,
            isRegistered: record.isRegistered,
            revocationReason: record.revocationReason,
          },
        };
      } catch (e2) {}
    }
    return { isValid: false, record: null, error: error.message };
  }
};

/**
 * Public Verification of Certificate
 */
export const verifyCertificateOnChain = async (certificateId) => {
  const cleanId = (certificateId || '').trim();
  try {
    const contract = getReadContract();
    const [isValid, cert] = await contract.verifyCertificate(cleanId);
    return {
      isValid,
      certificate: {
        certificateId: cert.certificateId,
        alumniId: cert.alumniId,
        title: cert.title,
        cgpaOrGrade: cert.cgpaOrGrade,
        issueDate: new Date(Number(cert.issueDate) * 1000).toISOString(),
        certHash: cert.certHash,
        issuer: cert.issuer,
        isRevoked: cert.isRevoked,
        revocationReason: cert.revocationReason,
        exists: cert.exists,
      },
    };
  } catch (error) {
    console.warn("Direct RPC verifyCertificate failed, checking fallback:", error.message);
    if (window.ethereum) {
      try {
        const bp = new ethers.BrowserProvider(window.ethereum);
        const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, bp);
        const [isValid, cert] = await c.verifyCertificate(cleanId);
        return {
          isValid,
          certificate: {
            certificateId: cert.certificateId,
            alumniId: cert.alumniId,
            title: cert.title,
            cgpaOrGrade: cert.cgpaOrGrade,
            issueDate: new Date(Number(cert.issueDate) * 1000).toISOString(),
            certHash: cert.certHash,
            issuer: cert.issuer,
            isRevoked: cert.isRevoked,
            revocationReason: cert.revocationReason,
            exists: cert.exists,
          },
        };
      } catch (e2) {}
    }
    return { isValid: false, certificate: null, error: error.message };
  }
};

/**
 * Retrieve System Statistics from on-chain state
 */
export const fetchSystemStatistics = async () => {
  try {
    const contract = getReadContract();
    const stats = await contract.getSystemStatistics();
    return {
      totalAlumni: Number(stats[0]),
      activeAlumni: Number(stats[1]),
      revokedAlumni: Number(stats[2]),
      totalCertificates: Number(stats[3]),
      activeCertificates: Number(stats[4]),
      revokedCertificates: Number(stats[5]),
    };
  } catch (e) {
    console.warn("Could not fetch on-chain statistics directly; using local fallback:", e.message);
    return null;
  }
};

/**
 * Fetch past blockchain events directly from contract logs
 */
export const fetchContractEvents = async () => {
  try {
    const contract = getReadContract();
    const currentBlock = await contract.runner.provider.getBlockNumber();
    const fromBlock = currentBlock > 5000 ? currentBlock - 5000 : 0;

    const filterAlumni = contract.filters.AlumniRegistered();
    const filterUpdated = contract.filters.AlumniRecordUpdated();
    const filterRevoked = contract.filters.AlumniRecordRevoked();
    const filterCert = contract.filters.CertificateIssued();
    const filterCertRevoked = contract.filters.CertificateRevoked();

    const [regEvents, updateEvents, revokeEvents, certEvents, certRevokeEvents] = await Promise.all([
      contract.queryFilter(filterAlumni, fromBlock),
      contract.queryFilter(filterUpdated, fromBlock),
      contract.queryFilter(filterRevoked, fromBlock),
      contract.queryFilter(filterCert, fromBlock),
      contract.queryFilter(filterCertRevoked, fromBlock),
    ]);

    const formattedEvents = [];

    for (const ev of regEvents) {
      formattedEvents.push({
        txHash: ev.transactionHash,
        blockNumber: ev.blockNumber,
        event: 'AlumniRegistered',
        alumniId: ev.args[0],
        name: ev.args[1],
        degree: ev.args[2],
        year: Number(ev.args[3]),
        hash: ev.args[4],
        by: ev.args[5],
        timestamp: Number(ev.args[6]),
      });
    }

    for (const ev of updateEvents) {
      formattedEvents.push({
        txHash: ev.transactionHash,
        blockNumber: ev.blockNumber,
        event: 'AlumniRecordUpdated',
        alumniId: ev.args[0],
        hash: ev.args[1],
        degree: ev.args[2],
        by: ev.args[3],
        timestamp: Number(ev.args[4]),
      });
    }

    for (const ev of revokeEvents) {
      formattedEvents.push({
        txHash: ev.transactionHash,
        blockNumber: ev.blockNumber,
        event: 'AlumniRecordRevoked',
        alumniId: ev.args[0],
        reason: ev.args[1],
        by: ev.args[2],
        timestamp: Number(ev.args[3]),
      });
    }

    for (const ev of certEvents) {
      formattedEvents.push({
        txHash: ev.transactionHash,
        blockNumber: ev.blockNumber,
        event: 'CertificateIssued',
        certId: ev.args[0],
        alumniId: ev.args[1],
        title: ev.args[2],
        hash: ev.args[3],
        by: ev.args[4],
        timestamp: Number(ev.args[5]),
      });
    }

    for (const ev of certRevokeEvents) {
      formattedEvents.push({
        txHash: ev.transactionHash,
        blockNumber: ev.blockNumber,
        event: 'CertificateRevoked',
        certId: ev.args[0],
        alumniId: ev.args[1],
        reason: ev.args[2],
        by: ev.args[3],
        timestamp: Number(ev.args[4]),
      });
    }

    // Sort newest first
    formattedEvents.sort((a, b) => b.blockNumber - a.blockNumber);
    return formattedEvents;
  } catch (error) {
    console.warn("Could not query contract events directly:", error.message);
    return [];
  }
};

