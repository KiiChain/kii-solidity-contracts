# Kii Solidity Contracts

This repository contains a collection of Solidity smart contracts developed for the Kiichain EVM-compatible blockchain. It is designed as a modular library for reusable on-chain components, including token standards, utilities, and example contracts tailored for the Kiichain ecosystem.

---

## 📦 Features

- ✅ Modular contract structure
- ✅ Written in Solidity `^0.8.24`
- ✅ Ready-to-deploy contract templates
- ✅ Includes mock tokens for development
- ✅ Compatible with Kiichain testnet and mainnet

---

## 🧾 Contracts Overview

### 📁 contracts/AssetToken

A customizable ERC20-compatible token contract.

- **Filename**: `AssetToken.sol`
- **Features**:
  - Mintable token with `mint()` function
  - Constructor for setting `name`, `symbol`, and `initialSupply`
  - Owner-based access control

Read more: [`contracts/AssetToken/README.md`](contracts/AssetToken/README.md)

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/kii-solidity-contracts.git
cd kii-solidity-contracts

