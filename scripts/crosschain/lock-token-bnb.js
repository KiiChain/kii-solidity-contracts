const { ethers } = require("hardhat");
require("dotenv").config();

const TOKEN_ADDRESS = "0x7Fc3Fb7924083d4b403d4F0Cd8C5764679C6713e";
const BRIDGE_ADDRESS = "0x890a322Bf45B5aB6b2242c03Db15aD55E7786f13";
const RECIPIENT = "0xf3C61576526a0535035174ec8f892077C74Caaf4";
const TARGET_CHAIN = "KiiChain";

const AMOUNT = ethers.utils.parseEther("100"); // 100 token (18 desimal)

async function main() {
  const [deployer] = await ethers.getSigners();
  const token = await ethers.getContractAt("RJSBNB", TOKEN_ADDRESS);
  const bridge = await ethers.getContractAt("RJSBridgeBNB", BRIDGE_ADDRESS);

  const approveTx = await token.approve(BRIDGE_ADDRESS, AMOUNT);
  await approveTx.wait();
  console.log(`✅ Approved ${AMOUNT.toString()} tokens to Bridge`);

  const lockTx = await bridge.lock(TOKEN_ADDRESS, AMOUNT, RECIPIENT, TARGET_CHAIN);
  await lockTx.wait();
  console.log(`✅ Locked ${AMOUNT.toString()} tokens for ${RECIPIENT} on ${TARGET_CHAIN}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

