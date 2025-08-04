import { ethers } from "hardhat";

async function main() {
  const HelloWorld = await ethers.getContractFactory("HelloWorld");
  const hello = await HelloWorld.deploy("Hello KiiChain!");

  await hello.waitForDeployment();

  console.log("✅ HelloWorld deployed at:", await hello.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
