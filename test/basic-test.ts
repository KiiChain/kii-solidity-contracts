import { ethers } from "hardhat";
import { expect } from "chai";

describe("Basic Deployment", function () {
  it("Should deploy AirdropNFT contract", async function () {
    const ContractFactory = await ethers.getContractFactory("AirdropNFT");
    const contract = await ContractFactory.deploy();
    await contract.waitForDeployment();

    expect(await contract.getAddress()).to.properAddress;
  });
});
