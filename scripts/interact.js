require('dotenv').config();
const { ethers } = require('hardhat');

async function main() {
  const contractAddress = "0x2D2f2889aA49dd67032FFF5f8628a5d750E666b8"; // Deployed contract address
  if (!ethers.utils.isAddress(contractAddress)) {
    throw new Error("Invalid contract address");
  }

  const [deployer] = await ethers.getSigners();

  const AssetToken = await ethers.getContractFactory("AssetToken");
  onst code = await ethers.provider.getCode(contractAddress);
  if (code === "0x") {
    throw new Error(`No contract code at ${contractAddress} on network "${(await ethers.provider.getNetwork()).name}". Check the address/network.`);
  }
  const assetToken = await AssetToken.attach(contractAddress);

  console.log("Connected to contract at:", contractAddress);
  const net = await ethers.provider.getNetwork();
  console.log(`Network: ${net.name} (chainId=${net.chainId})`);

  const owner = await assetToken.owner();
  if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
    throw new Error(
      `Caller is not owner. owner=${owner}, caller=${deployer.address}. ` +
      `Use the owner's key or skip mint/redeem steps.`
    );
  }

  // Mint 1000 tokens
  const mintTx = await assetToken.mint(deployer.address, ethers.utils.parseEther("1000"));
  await mintTx.wait();
  console.log("✅ Minted 1000 RWA tokens");

  // Check balance
  const balance = await assetToken.balanceOf(deployer.address);
  console.log("💰 Your balance:", ethers.utils.formatEther(balance), "RWA");

  // Redeem 100 tokens
  const redeemTx = await assetToken.redeem(ethers.utils.parseEther("100"));
  await redeemTx.wait();
  console.log("🔥 Redeemed 100 RWA tokens");

  const newBalance = await assetToken.balanceOf(deployer.address);
  console.log("💰 New balance:", ethers.utils.formatEther(newBalance), "RWA");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

