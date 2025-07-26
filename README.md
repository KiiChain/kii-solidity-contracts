# 🧾 Kii Solidity Contracts

This repository contains Solidity smart contracts developed for the KiiChain ecosystem, including tokenization of real-world assets (RWA), interfaces, and utilities for deployment and testing. The contracts are modular and designed to support scalable, secure, and extensible EVM-based applications.

---

## 📂 Structure

```
contracts/
│
├── AssetToken/
│   ├── AssetToken.sol          # Main ERC20-compatible token with RWA metadata
│   ├── deploy.js               # Script to deploy AssetToken with parameters
│   └── README.md               # Module-specific explanation
│
├── interfaces/
│   └── IAssetToken.sol         # Interface for AssetToken
│
├── mocks/
│   └── MockERC20.sol           # Optional: Token mocks for testing
│
scripts/
│   └── deploy.js               # (Moved) - all deploy scripts should be inside module folders
```

---

## 📦 Contracts

### 🔸 AssetToken.sol

A token contract representing RWA (Real World Assets) with the following features:

- Based on `ERC20` with name/symbol/decimals
- Includes immutable asset metadata such as:
  - `assetType` (e.g. "real_estate", "art", "equity")
  - `jurisdiction` (e.g. "SG", "US", "ID")
  - `legalReference` (e.g. doc link or reference code)
  - `documentUri` (e.g. IPFS or HTTPS link)

See full module README: [`contracts/AssetToken/README.md`](./contracts/AssetToken/README.md)

---

## 🚀 Deployment

> Requires: [Node.js](https://nodejs.org/), [Hardhat](https://hardhat.org/), and EVM-compatible RPC endpoint.

Install dependencies:

```bash
npm install
```

Compile contracts:

```bash
npx hardhat compile
```

Deploy with parameters (example using Hardhat):

```bash
npx hardhat run contracts/AssetToken/deploy.js --network <your-network>
```

Edit deploy parameters in the script:
```js
const name = "Real Estate Jakarta";
const symbol = "REJKT";
const decimals = 18;
const assetType = "real_estate";
const jurisdiction = "ID";
const legalReference = "ACT-128-2025";
const documentUri = "ipfs://bafybe...";
```

---

## 🧪 Testing

You can create test files under `test/` and use Hardhat + Chai for running unit tests.

Example:

```bash
npx hardhat test
```

---

## 📜 License

This repository is open-source and released under the [MIT License](./LICENSE).

---

## 🙌 Contributing

Pull requests are welcome. Please:

- Keep each module inside its own folder
- If you add new contracts, place deploy/test files within the same module folder
- Avoid modifying the root-level README for module-specific usage (place those in `contracts/<Module>/README.md`)

---

## 🔗 Links

- [KiiChain GitHub](https://github.com/KiiChain)

---

