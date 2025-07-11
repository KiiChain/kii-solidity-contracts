require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    kiichain: {
      url: "https://json-rpc.dos.sentry.testnet.v3.kiivalidator.com/",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1336,
    },
  },
};

