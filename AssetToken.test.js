const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("AssetToken", function () {
  let assetToken;

  beforeEach(async function () {
    const AssetToken = await ethers.getContractFactory("AssetToken");
    assetToken = await AssetToken.deploy(/* constructor args jika ada */);
    await assetToken.deployed();
  });

  it("should have correct name and symbol", async function () {
    expect(await assetToken.name()).to.equal("MyTokenName");
    expect(await assetToken.symbol()).to.equal("MTK");
  });
});
