# 🧾 Kii Solidity Contracts

Welcome to the Solidity smart contracts repository for **KiiChain**, a blockchain infrastructure designed for asset tokenization, RWA (Real World Assets), and institutional-grade compliance. This repository hosts the official and reference implementations of Solidity-based contracts used across the KiiChain ecosystem.

---

## 📁 Repository Structure

```bash
kii-solidity-contracts/
├── contracts/
│   ├── AssetToken/               # Asset token standard implementation
│   │   ├── AssetToken.sol
│   │   ├── AssetTokenFactory.sol
│   │   ├── interfaces/
│   │   └── README.md             # Contract-specific documentation
│   ├── utils/                    # Shared libraries/utilities (if any)
│   └── ...                       # Other modules coming soon
├── test/                         # Hardhat test cases
├── scripts/                      # Deployment & automation scripts
├── hardhat.config.ts             # Hardhat configuration
├── package.json
└── README.md                     # You are here
```

---

## 🧱 Modules Overview

### `AssetToken`

The `AssetToken` module provides a robust ERC20-based framework tailored for tokenizing real-world assets with added compliance and lifecycle control.

* `AssetToken.sol` — The main token implementation with pause, freeze, whitelist, and mint/burn logic.
* `AssetTokenFactory.sol` — Factory contract for deploying new `AssetToken` instances.
* `interfaces/` — Modular interface definitions.

For more info, see [`contracts/AssetToken/README.md`](contracts/AssetToken/README.md).

---

## 🚀 Getting Started

### Requirements

* [Node.js](https://nodejs.org/) v16+
* [Hardhat](https://hardhat.org/)

### Installation

```bash
git clone https://github.com/KiiChain/kii-solidity-contracts.git
cd kii-solidity-contracts
npm install
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy to Testnet

Modify `scripts/deploy.ts` as needed and run:

```bash
npx hardhat run scripts/deploy.ts --network <network>
```

### Linting & Formatting

```bash
npx prettier --write .
npx eslint .
```

---

## 🧪 Audits

⚠️ These contracts are under active development. Security audits will be listed here once completed.

---

## 👥 Contributing

We welcome contributions! Please:

1. Fork the repository.
2. Make your changes in a feature branch.
3. Submit a pull request with clear explanations and references.

For contract-specific contributions (e.g., `AssetToken`), please include documentation inside its own folder (e.g., `contracts/AssetToken/README.md`).

---

## 📄 License

This repository is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## 📚 Contract-Specific Docs

For detailed explanations of a specific contract, refer to:

* [`contracts/AssetToken/README.md`](contracts/AssetToken/README.md) – AssetToken module
* *(Other subfolders may follow a similar structure as they’re added)*

---

**Maintained by [KiiChain](https://kiichain.io)**

