import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    kiichain: {
      url: "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com",
      accounts: ["0x<YOUR_PRIVATE_KEY>"],
      timeout: 120000,
      type: "http",
    },
  },
};

export default config;
