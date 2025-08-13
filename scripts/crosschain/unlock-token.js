require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const network = hre.network.name;
  console.log(`Running unlock on network: ${network}`);

  const bridgeAddress = process.env.BRIDGE_ADDRESS;
  const userAddress = process.env.RECIPIENT_ADDRESS;
  const amount = hre.ethers.parseUnits(process.env.AMOUNT || "100", 18);

  if (!bridgeAddress || !userAddress) {
    throw new Error("Missing env vars: set BRIDGE_ADDRESS and RECIPIENT_ADDRESS");
  }

  if (network === "sepolia") {
    // Sepolia version: unlock(address user, uint256 amount)
    const bridge = await hre.ethers.getContractAt("RJSBridgeSepolia", bridgeAddress);
    const tx = await bridge.unlock(userAddress, amount);
    await tx.wait();
    console.log(`✅ Unlocked ${process.env.AMOUNT || "100"} tokens to ${userAddress} on Sepolia`);
  } 
  else if (network === "bscTestnet") {
    // BNB Testnet version: unlock(address token, uint256 amount, address recipient, string memory sourceChain)
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const sourceChain = process.env.SOURCE_CHAIN || "Sepolia";

    if (!tokenAddress) {
      throw new Error("Missing env var: set TOKEN_ADDRESS for BNB Testnet unlock");
    }

    const bridge = await hre.ethers.getContractAt("RJSBridgeBNB", bridgeAddress);
    const tx = await bridge.unlock(tokenAddress, amount, userAddress, sourceChain);
    await tx.wait();
    console.log(`✅ Unlocked ${process.env.AMOUNT || "100"} tokens to ${userAddress} on BNB Testnet from ${sourceChain}`);
  } 
  else {
    throw new Error(`Unsupported network: ${network}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

