const hre = require("hardhat");

async function main() {
  const tokenAddress = "0x4fc91071BFA492d4e3A88aE2aB144A20c0566381";
  const [deployer] = await hre.ethers.getSigners();

  const RJSToken = await hre.ethers.getContractAt("RJSToken", tokenAddress);
  const tx = await RJSToken.mint(deployer.address, hre.ethers.utils.parseUnits("1000", 18));
  await tx.wait();

  console.log(`Minted 1000 tokens to: ${deployer.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

