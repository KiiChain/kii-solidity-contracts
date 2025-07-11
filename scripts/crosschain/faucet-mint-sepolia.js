const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const tokenAddress = "0x0e0f3768abE1a150f1B13438BF9820451b541355"; // RJSSepolia address
  const token = await ethers.getContractAt("RJSSepolia", tokenAddress);
  const tx = await token.mint(deployer.address, ethers.utils.parseEther("1000"));
  await tx.wait();
  console.log(`✅ Minted 1000 RJSSepolia to ${deployer.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

