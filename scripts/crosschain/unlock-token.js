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
    const [signer] = await hre.ethers.getSigners();
    const owner = await bridge.owner();
    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
      throw new Error(`Signer ${signer.address} is not bridge owner ${owner}; unlock would revert`);
    }
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
    const [signer] = await hre.ethers.getSigners();
    const owner = await bridge.owner();
    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
      throw new Error(`Signer ${signer.address} is not bridge owner ${owner}; unlock would revert`);
    }
    const erc20 = await hre.ethers.getContractAt("IERC20", tokenAddress);
    const decimals = await erc20.decimals();
    const amountBNB = hre.ethers.parseUnits(process.env.AMOUNT || "100", decimals);
    const bal = await erc20.balanceOf(bridgeAddress);
    if (bal < amountBNB) {
      throw new Error(`Bridge balance ${bal} < requested amount ${amountBNB}`);
    }
    const tx = await bridge.unlock(tokenAddress, amountBNB, userAddress, sourceChain);
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

