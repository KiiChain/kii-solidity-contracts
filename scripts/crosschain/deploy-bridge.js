const hre = require("hardhat");

async function main() {
  const tokenAddress = "0x4fc91071BFA492d4e3A88aE2aB144A20c0566381";  // Replace with your deployed RJSToken address

  const Bridge = await hre.ethers.getContractFactory("RJSBridge");
  const bridge = await Bridge.deploy(tokenAddress);

  await bridge.deployed();

  console.log(`RJSBridge deployed to: ${bridge.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

