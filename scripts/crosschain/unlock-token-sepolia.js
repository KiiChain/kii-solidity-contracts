require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const bridgeAddress = "0x7Fc3Fb7924083d4b403d4F0Cd8C5764679C6713e";  // RJSSepolia Bridge
  const tokenAddress = "0x0e0f3768abE1a150f1B13438BF9820451b541355";   // RJSSepolia Token
  const recipient = deployer.address;
  const amount = ethers.utils.parseEther("100"); // Unlock 100 RJSSepolia

  const bridge = await ethers.getContractAt("RJSBridgeSepolia", bridgeAddress);

  const unlockTx = await bridge.unlock(recipient, amount);
  await unlockTx.wait();
  console.log(`✅ Unlocked ${amount} RJSSepolia back to ${recipient} on Sepolia`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

