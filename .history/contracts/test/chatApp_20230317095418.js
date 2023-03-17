const { expect } = require("chai");

describe("ChatApp", function () {
  let chatApp;

  beforeEach(async function () {
    const ChatApp = await ethers.getContractFactory("ChatApp");
    chatApp = await ChatApp.deploy();
    await chatApp.deployed();
  });

  it("should allow Alice to send a message to Bob", async function () {
    const alice = await ethers.getSigner(0);
    const bob = await ethers.getSigner(1);

    const message = "Hello, Bob!";
    await chatApp.connect(alice).sendMessage(bob.address, message);

    const messages = await chatApp.getMessagesForUser(bob.address);
    expect(messages.length).to.equal(1);
    expect(messages[0].from).to.equal(alice.address);
    expect(messages[0].message).to.equal(message);
  });

  it("should not allow sending a message to yourself", async function () {
    const alice = await ethers.getSigner(0);

    const message = "Hello, me!";
    await expect(
      chatApp.connect(alice).sendMessage(alice.address, message)
    ).to.be.revertedWith("Cannot send message to yourself");
  });
});
