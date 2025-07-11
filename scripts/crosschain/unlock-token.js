const hre = require("hardhat");

async function main() {
  const bridgeAddress = "0x3eAbcc5A3ec46274f9490C0FaB28E6463fa49521";
  const userAddress = "0xf3C61576526a0535035174ec8f892077C74Caaf4";  // Wallet lo
  const amount = hre.ethers.utils.parseUnits("100", 18);

  const RJSBridge = await hre.ethers.getContractAt("RJSBridge", bridgeAddress);
  const tx = await RJSBridge.unlockTokens(userAddress, amount);
  await tx.wait();

  console.log(`Unlocked ${amount} tokens to ${userAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

