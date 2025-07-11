const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const tokenAddress = "0x7Fc3Fb7924083d4b403d4F0Cd8C5764679C6713e";
  const token = await hre.ethers.getContractAt("RJSBNB", tokenAddress);

  const mintAmount = hre.ethers.utils.parseUnits("1000", 18);
  const tx = await token.mint(deployer.address, mintAmount);
  await tx.wait();

  console.log(`✅ Minted 1000 RJSBNB to ${deployer.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

