const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AssetToken", function () {
  let AssetToken, assetToken, owner, addr1;

  beforeEach(async function () {
    AssetToken = await ethers.getContractFactory("AssetToken");
    [owner, addr1] = await ethers.getSigners();

    assetToken = await AssetToken.deploy("RealWorldAsset", "RWA", "Real Estate", "KiiChain Labs", "Global");
    await assetToken.waitForDeployment();
  });

  it("should have correct name and symbol", async function () {
    expect(await assetToken.name()).to.equal("RealWorldAsset");
    expect(await assetToken.symbol()).to.equal("RWA");
  });

  it("should mint tokens to address", async function () {
    await assetToken.mint(addr1.address, ethers.parseEther("500"));
    const balance = await assetToken.balanceOf(addr1.address);
    expect(balance).to.equal(ethers.parseEther("500"));
  });

  it("should redeem tokens correctly", async function () {
    await assetToken.mint(owner.address, ethers.parseEther("1000"));
    await assetToken.redeem(ethers.parseEther("200"));
    const balance = await assetToken.balanceOf(owner.address);
    expect(balance).to.equal(ethers.parseEther("800"));
  });
});

