const hre = require("hardhat");

async function main() {
  const RJSToken = await hre.ethers.getContractFactory("RJSToken");
  const token = await RJSToken.deploy();

  await token.deployed();

  console.log(`RJSToken deployed to: ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

