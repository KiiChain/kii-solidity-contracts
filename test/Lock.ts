import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {
  let lock: any;
  let owner: any;
  let addr1: any;

  beforeEach(async function () {
  [owner, addr1] = await ethers.getSigners();

  const Lock = await ethers.getContractFactory("Lock");
  lock = await Lock.deploy({ value: ethers.parseEther("1.0") });
  await lock.waitForDeployment();
});


  it("Should have correct owner", async function () {
    expect(await lock.owner()).to.equal(owner.address);
  });

  it("Should have 1 ETH balance after deployment", async function () {
    const balance = await lock.getBalance();
    expect(balance).to.equal(ethers.parseEther("1.0"));
  });

  it("Should allow owner to withdraw", async function () {
    const withdrawAmount = ethers.parseEther("0.5");

    await expect(lock.withdraw(withdrawAmount))
      .to.emit(lock, "Withdraw")
      .withArgs(owner.address, withdrawAmount);

    const contractBalance = await lock.getBalance();
    expect(contractBalance).to.equal(ethers.parseEther("0.5"));
  });

  it("Should fail if non-owner tries to withdraw", async function () {
    const withdrawAmount = ethers.parseEther("0.1");

    await expect(lock.connect(addr1).withdraw(withdrawAmount)).to.be.revertedWith("Not the owner");
  });

  it("Should fail if withdraw amount exceeds balance", async function () {
    const withdrawAmount = ethers.parseEther("2.0"); // lebih dari balance

    await expect(lock.withdraw(withdrawAmount)).to.be.revertedWith("Insufficient balance");
  });
});
