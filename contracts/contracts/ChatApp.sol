// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ChatApp {
    struct Message {
        address from;
        string message;
    }

    mapping(address => Message[]) private userMessages;
    mapping(address => uint256) private messageCount;

    event NewMessage(address indexed from, address indexed to, string message);

    function sendMessage(address to, string memory message) public {
        require(to != msg.sender, "Cannot send message to yourself");
        Message memory newMessage = Message(msg.sender, message);
        userMessages[to].push(newMessage);
        messageCount[to]++;
        emit NewMessage(msg.sender, to, message);
    }

    function getMessagesForUser(address user) public view returns (Message[] memory) {
        return userMessages[user];
    }
}