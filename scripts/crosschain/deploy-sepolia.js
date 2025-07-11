const hre = require("hardhat");

async function main() {
  const RJSSepolia = await hre.ethers.getContractFactory("contracts/sepolia/RJSSepolia.sol:RJSSepolia");
  const token = await RJSSepolia.deploy();
  await token.deployed();
  console.log(`RJSSepolia deployed to: ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

