# KiiChain RWA Token — AssetToken.sol

This project is a simple Real World Asset (RWA) token built on the **Kiichain** blockchain, designed for demonstration and contribution to the open-source ecosystem.

## 📄 Smart Contract Overview

The main smart contract is `AssetToken.sol`, an ERC20-based token with additional properties to represent real-world assets, including:

* Asset Type
* Issuer Name
* Region
* Minting Function
* Redeeming Function

✅ **Deployed Contract:** [0x2D2f2889aA49dd67032FFF5f8628a5d750E666b8](https://explorer.kiichain.io/address/0x2D2f2889aA49dd67032FFF5f8628a5d750E666b8)
✅ **Deployer Address:** `0xf3C61576526a0535035174ec8f892077C74Caaf4`
✅ **Network:** Kiichain Testnet → [https://explorer.kiichain.io/](https://explorer.kiichain.io/)

---

## 🛠 Installation

Clone this repository and install dependencies:

```bash
git clone https://github.com/rjsrams/kii-solidity-contracts.git
cd kii-solidity-contracts
npm install
```

⚠️ Make sure you are using Node.js v18 or higher:

```bash
node -v
```

---

## 🚀 Getting Started

### 1. Compile the Contracts

```bash
npx hardhat compile
```

### 2. Deploy the Contract

```bash
npx hardhat run scripts/deploy.js --network kiichain
```

### 3. Interact with the Contract

```bash
npx hardhat run scripts/interact.js --network kiichain
```

### 4. Run Tests

```bash
npx hardhat test
```

---

## 📂 Folder Structure

```plaintext
/contracts             → Solidity smart contracts
/scripts              → Deployment and interaction scripts
/test                 → Test files using Hardhat framework
/README.md            → Project documentation
```

---

## 🔮 Test Environment

* Hardhat v2.22.1
* Solidity v0.8.24
* All tests passed locally

---

## 👥 Contribution

Pull Requests are welcome! Please make sure to:

* Follow the folder structure
* Run tests locally before submitting
* Keep the documentation updated

This PR is submitted as part of the **ORO Bounty Program**. Thank you for the opportunity!

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## 🔙 Official Repository

[KiiChain GitHub](https://github.com/KiiChain/kii-solidity-contracts)
