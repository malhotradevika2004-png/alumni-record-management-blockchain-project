# Deployment & Execution Guide
## Local Hardhat EVM Node & Sepolia Testnet

---

## 1. Prerequisites

- **Node.js:** v18.0.0 or higher (v24 LTS recommended)
- **npm:** v9.0.0 or higher
- **MetaMask Browser Extension:** Installed on Chrome, Brave, Edge, or Firefox

---

## 2. Localhost Demonstration Deployment (Recommended for Viva)

Follow these 3 quick steps to run the complete system locally:

### Step 1: Start the Local Hardhat EVM Node
In Terminal 1 (project root `e:\bct project`):
```bash
npx hardhat node
```
* This spawns a local Ethereum node at `http://127.0.0.1:8545` with **Chain ID 31337**.
* It provides 20 pre-funded test accounts with **10,000 ETH** each.

### Step 2: Deploy & Seed Smart Contract
In Terminal 2 (project root):
```bash
npx hardhat run scripts/deploy.js --network localhost
```
* Compiles `AlumniRecordManagement.sol`.
* Deploys the contract to `0x5FbDB2315678afecb367f032d93F642f64180aa3`.
* Automatically seeds realistic demo records (`ALU-2024-001`, `ALU-2024-002`, `ALU-2023-088`, and revoked `ALU-2022-194`).
* Automatically exports the deployed contract address & ABI to `client/src/contracts/AlumniRecordManagement.json`.

### Step 3: Launch the Frontend Client
In Terminal 3 (or navigate to `client`):
```bash
cd client
npm run dev
```
* Open your browser at: **`http://localhost:3000`**

---

## 3. Configuring MetaMask for Localhost

To sign administrative transactions during faculty presentation:

1. Open **MetaMask** $\rightarrow$ Click Network dropdown $\rightarrow$ **Add Network** $\rightarrow$ **Add a network manually**:
   - **Network Name:** Hardhat Localhost
   - **New RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
2. **Import Deployer Account #0:**
   - Click account icon $\rightarrow$ **Import Account**
   - Enter Private Key:
     ```
     0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
     ```
   - You will immediately see a balance of **10,000 ETH**!

---

## 4. Sepolia Testnet Deployment (Public Cloud)

To deploy to Ethereum's public Sepolia testnet:

1. Copy `.env.example` to `.env` in the root folder:
   ```env
   SEPOLIA_RPC_URL="https://rpc.sepolia.org"
   PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY_HERE"
   ```
2. Fund your test wallet with free Sepolia ETH from faucets:
   - [Google Cloud Web3 Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
   - [Sepolia PoW Faucet](https://sepolia-faucet.pk910.de/)
3. Run the deployment script targeting Sepolia:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```
4. Update the network in MetaMask to **Sepolia** and view verified transactions on [Sepolia Etherscan](https://sepolia.etherscan.io).

