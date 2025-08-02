import { ethers } from "hardhat";
import { expect } from "chai";

describe("HelloWorld", function () {
  it("Should deploy and return the correct message", async function () {
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const hello = await HelloWorld.deploy("Hello, Vansh!");
    await hello.waitForDeployment();

    // ✅ Get the stored message
    const message = await hello.getMessage();

    // ✅ Check it
    expect(message).to.equal("Hello, Vansh!");
  });
});


