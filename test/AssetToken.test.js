const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AssetToken", function () {
  let assetToken;

  beforeEach(async function () {
    const AssetToken = await ethers.getContractFactory("contracts/AssetToken.sol:AssetToken");
    assetToken = await AssetToken.deploy("MyToken", "MTK");
    await assetToken.waitForDeployment(); // ethers v6
  });

  it("should have correct name and symbol", async function () {
    expect(await assetToken.name()).to.equal("MyToken");
    expect(await assetToken.symbol()).to.equal("MTK");
  });
});
