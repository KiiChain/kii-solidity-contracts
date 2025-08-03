require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  paths: {
    sources: "./contracts",     // folder tempat file kontrak kamu
    tests: "./test",            // folder untuk file test
    cache: "./cache",
    artifacts: "./artifacts"
  },
  // Jika kamu ingin koneksi ke jaringan testnet/mainnet, bisa ditambahkan di sini nanti
};
