mport { ethers } from "hardhat";
import { expect } from "chai";
import { ChatApp } from "../typechain/ChatApp";

describe("ChatApp", function () {
  let chatApp: ChatApp;

  beforeEach(async function () {
    const [owner, Gopal, Nani] = await ethers.getSigners();
    const ChatAppFactory = await ethers.getContractFactory("ChatApp", owner);
    chatApp = await ChatAppFactory.deploy();
    await chatApp.deployed();
  });

  it("should allow Gopal to send a message to Nani", async function () {
    const message = "Hello, Nani!";
    await chatApp.sendMessage(Nani.address, message);

    const messages = await chatApp.getMessagesForUser(Nani.address);
    expect(messages.length).to.equal(1);
    expect(messages[0].from).to.equal(await ethers.provider.getSigner(Gopal.address).getAddress());
    expect(messages[0].message).to.equal(message);
  });

  it("should not allow sending a message to yourself", async function () {
    const message = "Hello, me!";
    await expect(chatApp.sendMessage(Gopal.address, message)).to.be.revertedWith("Cannot send message to yourself");
  });
});