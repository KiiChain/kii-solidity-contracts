import "dotenv/config";
import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import hardhatIgnitionViemPlugin from "@nomicfoundation/hardhat-ignition-viem";

const privateKey = process.env.PRIVATE_KEY;
const accounts =
  privateKey && privateKey.startsWith("0x") ? [privateKey] : [];

const oroRpc =
  process.env.RPC_URL ??
  "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      viaIR: true,
    },
  },
  networks: {
    kiichain: {
      type: "http",
      chainId: 1336,
      url: oroRpc,
      accounts,
      timeout: 120000,
    },
  },
  plugins: [hardhatIgnitionViemPlugin],
};

export default config;
