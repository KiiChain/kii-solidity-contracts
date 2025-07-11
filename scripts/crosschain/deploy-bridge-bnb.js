const hre = require("hardhat");

async function main() {
  const Bridge = await hre.ethers.getContractFactory("RJSBridgeBNB");
  const bridge = await Bridge.deploy("0xf3C61576526a0535035174ec8f892077C74Caaf4");  // owner (wallet lu)
  await bridge.deployed();
  console.log(`✅ RJSBridgeBNB deployed to: ${bridge.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

