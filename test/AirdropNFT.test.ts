import { expect } from "chai";
import { ethers } from "hardhat";

describe("AirdropNFT", function () {
  let airdropNFT: any;

  beforeEach(async function () {
    const AirdropNFT = await ethers.getContractFactory("AirdropNFT");
    airdropNFT = await AirdropNFT.deploy();
    await airdropNFT.waitForDeployment();
  });

  it("Should create NFT and set price", async function () {
    const [owner] = await ethers.getSigners();

    const tokenURI = "https://example.com/token/1";
    const price = ethers.parseEther("0.1");
    const categories = ["art", "digital"];

    // Pastikan fungsi ini ada di kontrakmu, case sensitive
    const tx = await airdropNFT.CreateToken(tokenURI, price, categories);
    await tx.wait();

    const tokenId = 1; // asumsi token pertama id=1
    const tokenPrice = await airdropNFT.tokenPrices(tokenId);
    expect(tokenPrice).to.equal(price);

    const tokenCategories = await airdropNFT.getNFTCategories(tokenId);
    expect(tokenCategories).to.deep.equal(categories);
  });
});
