const { ethers } = require("hardhat");
require("dotenv").config();

const TOKEN_ADDRESS = "0x7Fc3Fb7924083d4b403d4F0Cd8C5764679C6713e";
const BRIDGE_ADDRESS = "0x890a322Bf45B5aB6b2242c03Db15aD55E7786f13";
const RECIPIENT = "0xf3C61576526a0535035174ec8f892077C74Caaf4";
const SOURCE_CHAIN = "KiiChain";
const AMOUNT = ethers.utils.parseEther("100");

async function main() {
  const [deployer] = await ethers.getSigners();
  const bridge = await ethers.getContractAt("RJSBridgeBNB", BRIDGE_ADDRESS);

  const tx = await bridge.unlock(TOKEN_ADDRESS, AMOUNT, RECIPIENT, SOURCE_CHAIN);
  await tx.wait();
  console.log(`✅ Unlocked ${AMOUNT.toString()} tokens back to ${RECIPIENT} on BNB`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

