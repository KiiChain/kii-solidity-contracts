require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const RJSBNB = await ethers.getContractFactory("RJSBNB");
    const token = await RJSBNB.deploy(deployer.address);
    await token.deployed();
    console.log(`✅ RJSBNB deployed to: ${token.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

