const { ethers } = require("hardhat");

async function main() {
  const Bridge = await ethers.getContractFactory("RJSBridgeSepolia");
  const tokenAddress = "0x0e0f3768abE1a150f1B13438BF9820451b541355"; // RJSSepolia
  const bridge = await Bridge.deploy(tokenAddress, (await ethers.getSigners())[0].address);
  await bridge.deployed();
  console.log("✅ RJSBridgeSepolia deployed to:", bridge.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

