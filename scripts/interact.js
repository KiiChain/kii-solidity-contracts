require('dotenv').config();
const { ethers } = require('hardhat');

async function main() {
  const contractAddress = "0x2D2f2889aA49dd67032FFF5f8628a5d750E666b8"; // Deployed contract address
  const [deployer] = await ethers.getSigners();

  const AssetToken = await ethers.getContractFactory("AssetToken");
  const assetToken = await AssetToken.attach(contractAddress);

  console.log("Connected to contract at:", contractAddress);

  // Mint 1000 tokens
  const mintTx = await assetToken.mint(deployer.address, ethers.parseEther("1000"));
  await mintTx.wait();
  console.log("✅ Minted 1000 RWA tokens");

  // Check balance
  const balance = await assetToken.balanceOf(deployer.address);
  console.log("💰 Your balance:", ethers.formatEther(balance), "RWA");

  // Redeem 100 tokens
  const redeemTx = await assetToken.redeem(ethers.parseEther("100"));
  await redeemTx.wait();
  console.log("🔥 Redeemed 100 RWA tokens");

  const newBalance = await assetToken.balanceOf(deployer.address);
  console.log("💰 New balance:", ethers.formatEther(newBalance), "RWA");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

