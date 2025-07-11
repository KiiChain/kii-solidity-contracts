require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const tokenAddress = "0x0e0f3768abE1a150f1B13438BF9820451b541355"; // RJSSepolia Token
  const bridgeAddress = "0x7Fc3Fb7924083d4b403d4F0Cd8C5764679C6713e"; // RJSBridgeSepolia
  const recipient = deployer.address;
  const amount = ethers.utils.parseEther("100"); // Lock 100 RJSSepolia

  const token = await ethers.getContractAt("RJSSepolia", tokenAddress);
  const bridge = await ethers.getContractAt("RJSBridgeSepolia", bridgeAddress);

  const approveTx = await token.approve(bridgeAddress, amount);
  await approveTx.wait();
  console.log(`✅ Approved ${amount} RJSSepolia to Bridge`);

  const targetChain = "KiiChain"; // ✅ Tambahkan target chain
  const lockTx = await bridge.lock(amount, targetChain, recipient);
  await lockTx.wait();
  console.log(`✅ Locked ${amount} RJSSepolia for ${recipient} on ${targetChain}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

