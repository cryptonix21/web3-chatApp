const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChatApp", function () {
  let chatApp;

  beforeEach(async function () {
    const ChatApp = await ethers.getContractFactory("ChatApp");
    chatApp = await ChatApp.deploy();
    await chatApp.deployed();
  });

  it("should allow gopal to send a message to nani", async function () {
    const gopal = await ethers.getSigner(0);
    const nani = await ethers.getSigner(1);

    const message = "Hello, nani!";
    await chatApp.connect(gopal).sendMessage(nani.address, message);

    const messages = await chatApp.getMessagesForUser(nani.address);
    expect(messages.length).to.equal(1);
    expect(messages[0].from).to.equal(gopal.address);
    expect(messages[0].message).to.equal(message);
  });

  it("should not allow sending a message to yourself", async function () {
    const gopal = await ethers.getSigner(0);

    const message = "Hello, me!";
    await expect(
      chatApp.connect(gopal).sendMessage(gopal.address, message)
    ).to.be.revertedWith("Cannot send message to yourself");
  });
});
