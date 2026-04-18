# Community Contract Guidelines

Welcome to the community contracts section of Kii-solidity-contracts! When submitting a new community contract to the repository, please adhere to the following structure and conventions to encourage consistency and ease of future auditing.

## How to Structure a New Contract Folder

Each new community project or contract must reside in its own folder inside the repository (e.g., within `contracts/`).

```text
contracts/YourContractName/
├── YourContractName.sol
├── README.md
├── LICENSE
└── test/
    └── YourContractName.test.ts
```

## Required Elements

Every new contract folder **must** include:
1. **README**: A `README.md` file detailing what the contract does, how it works, and how to use it.
2. **Tests**: A dedicated `test/` directory containing unit tests (e.g., in TypeScript running via Hardhat or Foundry). Submissions without tests will not be accepted.
3. **License**: A `LICENSE` file indicating the open-source license for your code.

## Naming Conventions

- **Folders**: Use PascalCase (e.g., `TokenSale`, `AssetToken`).
- **Contracts**: Use PascalCase (e.g., `TokenSale.sol`).
- **Tests**: Use the `.test.ts` or `.spec.ts` suffix (e.g., `TokenSale.test.ts`).
- **Variables/Functions**: Use camelCase for variables and functions, as prescribed by the Solidity style guide.
