import { expect } from "chai";
import { ethers } from "hardhat";

describe("AirdropNFT", function () {
  let airdropNFT;

  beforeEach(async function () {
    const AirdropNFT = await ethers.getContractFactory("AirdropNFT");
    airdropNFT = await AirdropNFT.deploy();
    await airdropNFT.waitForDeployment();
  });

  it("Should deploy AirdropNFT contract", async function () {
    const contractAddress = await airdropNFT.getAddress();
    expect(contractAddress).to.match(/^0x[a-fA-F0-9]{40}$/);
  });
});
