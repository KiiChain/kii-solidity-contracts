import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    kiichain: {
      url: "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com",
      accounts: [
        "0x7f798ac2ee5c3103e565fa905ad86b99ad97aef34ad7cab5acd8d151d7c36d8c",
      ],
      timeout: 120000,
    },
  },
};

export default config;
