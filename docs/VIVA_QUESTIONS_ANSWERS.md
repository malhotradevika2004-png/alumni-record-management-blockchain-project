# Comprehensive Viva Voce Questions & Answers
## B.Tech 7th Semester Major Project: Alumni Record Management System Using Blockchain

---

### Q1: What is a Smart Contract and how does it execute?
**Answer:** A smart contract is a self-executing computer program deployed to an Ethereum-compatible address containing state variables and functions. When a transaction is sent to the contract address, EVM (Ethereum Virtual Machine) nodes across the network execute the compiled bytecode in a deterministic sandbox, deducting gas for each opcode and updating the world state tree.

### Q2: Why is Blockchain suitable for Alumni Record and Academic Credential Management?
**Answer:** Academic fraud, fake certificates, and forged transcripts are global problems. Traditional databases (MySQL, MongoDB) are centralized, allowing corrupt administrators or hackers to alter grades or fabricate records with zero public trace. Blockchain provides:
1. **Immutability:** Once written, historical states and transactions cannot be overwritten.
2. **Decentralized Verification:** Employers verify credentials without relying on slow manual university registrar desks.
3. **Cryptographic Proofs:** Mathematical guarantee using Keccak-256 hashes.

### Q3: Why did you choose a Hybrid Architecture (Off-Chain + On-Chain)?
**Answer:** Storing raw images, transcripts, and large strings on the EVM would:
1. Exorbitantly inflate gas costs (~20,000 gas per 32 bytes of storage).
2. Violate student data privacy laws (GDPR Right to be Forgotten, because blockchain cannot delete private data).
Therefore, sensitive records remain off-chain, while the cryptographic hash (`dataHash`), unique identifiers, verification statuses, and timestamps reside on-chain.

### Q4: Explain the Keccak-256 algorithm and its role in this system.
**Answer:** Keccak-256 is the cryptographic hashing algorithm standardized in Ethereum (SHA-3 family). It accepts an arbitrary-length byte input and produces a unique, fixed 32-byte hash. It exhibits the "avalanche effect"—if even a single character in the student's name, roll number, or CGPA is modified, the resulting hash changes drastically, immediately failing verification against the on-chain hash.

### Q5: What is Gas, Gas Limit, and Gas Price in Ethereum?
**Answer:**
- **Gas:** The internal unit measuring computational effort required to execute opcodes on the EVM (e.g., `SSTORE` = 20,000 gas, `ADD` = 3 gas).
- **Gas Limit:** The maximum amount of gas the caller is willing to spend on a transaction.
- **Gas Price:** The fee in Gwei (1 Gwei = $10^{-9}$ ETH) paid per unit of gas consumed.

### Q6: Do employers pay gas to verify alumni degrees?
**Answer:** No. Verification functions (`verifyAlumni` and `verifyCertificate`) are marked as `view`. When called from off-chain, they execute via read-only node calls (`eth_call`), which do not alter state and cost zero gas fees.

### Q7: How does Role-Based Access Control (RBAC) work in your contract?
**Answer:** We implement custom Solidity function modifiers:
- `onlyAdmin`: Validates that `msg.sender == institutionAdmin`.
- `onlyAuthorized`: Validates that `msg.sender == institutionAdmin || isAuthorizedRegistrar[msg.sender]`.
If an unauthorized address tries to register an alumnus or issue a certificate, the transaction immediately reverts with the custom error `NotAuthorized()`.

### Q8: How can a certificate be revoked if blockchain records are immutable?
**Answer:** Blockchain immutability means historical transactions cannot be deleted. However, state variables can transition. We store an enum `RecordStatus { Active, Updated, Revoked }` and a boolean `isRevoked`. When revoked, a state change transaction records the timestamp and reason. The verification function checks `!isRevoked`.

### Q9: What are EVM Events and Logs, and why are they important?
**Answer:** Events (`AlumniRegistered`, `CertificateIssued`, etc.) allow smart contracts to record data into the transaction receipt's Bloom filter. Logs cost roughly 8 gas per byte, significantly cheaper than contract storage. They enable the frontend to reconstruct historical audit logs without querying heavy storage mappings.

### Q10: What are Solidity Custom Errors, and why use them over `require(condition, "error string")`?
**Answer:** Custom errors (`error NotAuthorized()`, `error AlumniNotFound(string id)`) were introduced in Solidity 0.8.4. They encode as a 4-byte selector instead of storing long ASCII strings in bytecode, significantly reducing contract deployment size and runtime gas usage.

### Q11: What is MetaMask and what role does it play?
**Answer:** MetaMask is a non-custodial browser wallet and Web3 injection provider (`window.ethereum`). It securely holds the administrator's private key, signs transactions using the ECDSA algorithm, prompts for transaction approval, and relays JSON-RPC messages to the EVM network.

### Q12: What is the difference between Public Key, Private Key, and Ethereum Address?
**Answer:**
- **Private Key:** 256-bit random secret used to generate digital signatures.
- **Public Key:** Derived from the private key via Elliptic Curve Cryptography (secp256k1).
- **Ethereum Address:** The rightmost 20 bytes (160 bits) of the Keccak-256 hash of the public key, prefixed with `0x`.

### Q13: What is the difference between Hardhat, Ganache, and Truffle?
**Answer:** Hardhat is the modern industry standard for Ethereum development. Unlike legacy Truffle, Hardhat features built-in TypeScript/ESM support, stack traces, native console.log in Solidity, and comprehensive plugin architecture (`@nomicfoundation/hardhat-toolbox`).

### Q14: What is Ethers.js and why did you use version 6?
**Answer:** Ethers.js is a lightweight, secure library for interacting with the Ethereum blockchain and EVM smart contracts. Version 6 introduces modular native BigInt support, modernized BrowserProvider and JsonRpcProvider classes, and streamlined cryptographic utilities.

### Q15: How does the QR code verification work?
**Answer:** When a certificate is generated, the frontend embeds a dynamic QR code encoding a deep link (`https://domain.edu/#verify-cert?id=CERT-XXXX`). When scanned by an employer's smartphone, it opens the Public Verification portal, which directly queries `verifyCertificate("CERT-XXXX")` from the smart contract.

### Q16: What happens if an alumnus loses their certificate PDF?
**Answer:** Because the verification hash and certificate metadata are stored immutably on the smart contract, the institution or student can re-render and download the authentic PDF certificate at any time from their Alumni Profile.

### Q17: Can this smart contract be deployed on Polygon, Arbitrum, or BSC?
**Answer:** Yes. Because `AlumniRecordManagement.sol` is written in standard Solidity targeting the EVM, it is 100% compatible with Layer-2 scaling solutions (Arbitrum, Optimism, Polygon PoS, Base, etc.), where transaction fees are a fraction of a cent.

### Q18: What is the purpose of `mapping(string => Alumni)` in Solidity?
**Answer:** Mappings act as hash tables in EVM storage, offering $O(1)$ constant-time lookup for alumni records by their unique identifier without iterating over arrays.

### Q19: What is `calldata` vs `memory` in Solidity function arguments?
**Answer:**
- `memory`: Mutable temporary memory allocated during contract execution.
- `calldata`: Non-modifiable, non-allocated byte region where execution arguments reside. Using `calldata` for external functions avoids memory allocation gas.

### Q20: How do you prevent duplicate alumni registrations?
**Answer:** Before writing a new record, the contract checks `alumniRecords[_alumniId].isRegistered`. If already true, it reverts with `error AlumniAlreadyExists(_alumniId)`.

### Q21: What is a Reentrancy Attack and is this contract vulnerable?
**Answer:** A reentrancy attack occurs when an external call allows an attacker to recursively call back into the vulnerable contract before state updates occur (e.g., the DAO hack). Our contract does not transfer ETH or call untrusted external contracts, making it inherently safe from reentrancy.

### Q22: What happens if the Institution Admin leaves or changes?
**Answer:** The contract includes `transferAdmin(address _newAdmin)` restricted by `onlyAdmin`, allowing the existing admin to safely transfer ownership to a successor or institutional multi-sig wallet.

### Q23: How are dates and timestamps stored in Solidity?
**Answer:** In Solidity, `block.timestamp` returns the current Unix timestamp (seconds elapsed since January 1, 1970). It is stored as a `uint256`.

### Q24: What is the EVM "Paris" target?
**Answer:** "Paris" is the EVM hard fork representing the Ethereum Merge (transition from Proof of Work to Proof of Stake). It replaces the `DIFFICULTY` opcode with `PREVRANDAO`.

### Q25: How does this project contribute to sustainable, green computing?
**Answer:** Following Ethereum's transition to Proof of Stake (PoS), network energy consumption dropped by 99.95%. Furthermore, eliminating paper diplomas, physical courier logistics, and manual background checks significantly reduces paper waste and institutional carbon footprints.

