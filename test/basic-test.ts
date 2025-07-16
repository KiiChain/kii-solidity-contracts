import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";

describe("Basic Deployment", function () {
  it("Should deploy AirdropNFT contract", async function () {
    const contract = await hre.viem.deployContract("AirdropNFT");
    expect(getAddress(contract.address)).to.be.a('string');
  });
});
