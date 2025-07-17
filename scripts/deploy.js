require('dotenv').config();
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  const AssetToken = await ethers.getContractFactory("AssetToken");

  const name = "RealWorldAsset";
  const symbol = "RWA";
  const assetType = "Real Estate";
  const issuer = "KiiChain Labs";
  const region = "Global";

  const assetToken = await AssetToken.deploy(name, symbol, assetType, issuer, region);

  console.log("AssetToken deployed to:", assetToken.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

