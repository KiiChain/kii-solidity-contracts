const hre = require("hardhat");

async function main() {
  const tokenAddress = "0x4fc91071BFA492d4e3A88aE2aB144A20c0566381";   // RJSToken
  const bridgeAddress = "0x3eAbcc5A3ec46274f9490C0FaB28E6463fa49521";  // RJSBridge
  const amount = hre.ethers.utils.parseUnits("100", 18);               // 100 Token

  const [deployer] = await hre.ethers.getSigners();

  const RJSToken = await hre.ethers.getContractAt("RJSToken", tokenAddress);
  const RJSBridge = await hre.ethers.getContractAt("RJSBridge", bridgeAddress);

  // Approve
  const tx1 = await RJSToken.approve(bridgeAddress, amount);
  await tx1.wait();
  console.log(`Approved ${amount} tokens to bridge.`);

  // Lock
  const tx2 = await RJSBridge.lockTokens(amount, "Sepolia", deployer.address);
  await tx2.wait();
  console.log(`Locked ${amount} tokens for chain Sepolia to address ${deployer.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

