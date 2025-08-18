# 🧾 Kii Solidity Contracts

This repository contains smart contracts for the **KiiChain** ecosystem, written in Solidity.

---

## 📘 Introduction

This is a simple **swap contract** that uses the **Cosmos bank module** on the Kii EVM testnet. It is designed to swap **EVM Kii tokens** for internal **Cosmos Kii tokens** and vice versa.

---

## 🚀 Getting Started

Follow these steps to set up the development environment and test the contracts locally.

### 1. Clone the Repository

```bash
git clone https://github.com/KiiChain/kii-solidity-contracts
cd kii-solidity-contracts
```

### 2. Install Dependencies

```bash
npm install
```

⚠️ Make sure you are using **Node.js v18 or higher**. Check your version with:

```bash
node -v
```

### 3. Compile the Contracts

```bash
npx hardhat compile
```

### 4. Run the Tests

```bash
npx hardhat test
```

---

## ✅ Notes

- ✅ Added basic test: `test/basic-test.ts` for **AirdropNFT**
- 🗑️ Removed default Hardhat boilerplate: `test/Lock.ts`

---

## 📂 Project Structure

```
/contracts             → Solidity smart contracts  
/test                  → Test files using Hardhat framework  
/hardhat.config.ts     → Hardhat configuration (TypeScript)  
/scripts               → Deployment and utility scripts (optional)  
/README.md             → Project documentation  
```

---

## 🧪 Sample Test

You can find a basic test file in `test/basic-test.ts`.  
This test verifies successful deployment of the `AirdropNFT` contract.

---

## ⚙️ Continuous Integration

This project uses GitHub Actions to run a series of checks on every push and pull request to the `main` branch. This ensures that the codebase remains consistent and that all tests pass.

The CI workflow runs the following checks:

- **Linting**: `npx solhint 'contracts/**/*.sol'`
- **Formatting**: `npx prettier --check 'contracts/**/*.sol'`
- **Tests**: `npx hardhat test`

You can run these checks locally to ensure your contributions will pass the CI.

## 🤝 Contribution

Pull Requests are welcome!  
Please follow the instructions above to set up your environment and run tests locally before submitting a PR.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👉 Official repository

[KiiChain GitHub](https://github.com/KiiChain/kii-solidity-contracts)

