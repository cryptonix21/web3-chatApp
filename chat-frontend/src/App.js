import "./App.css";
import React, { useState, useEffect } from "react";
import ChatAppABI from "./abi/ChatApp.json";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    //check if the Metamask is installed
    if (window.ethereum) {
      console.log("Metamask is detected...!");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setIsConnected(true); // set isConnected is true after connecting the wallet
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.error("Metamask is not detected...!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const CONTRACT_ADDRESS = "0x575189969c0Ded29b8928BA5EE6DAb81e8C518Ca";
  const createContract = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ChatAppABI,
        signer
      );
      setProvider(provider);
      setSigner(signer);
      setContract(contract);
    }
  };
  const sendMessage = async () => {
    createContract();
    try {
      await contract.sendMessage(recipient, message);
      setRecipient("");
      setMessage("");
    } catch (error) {
      toast.error("You cannot send message to yourself", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const getMessages = async () => {
    createContract();
    try {
      const messages = await contract.getMessagesForUser(walletAddress);
      setUserMessages(messages);
    } catch (error) {
      toast.info("You didn't receive any messaged yet....", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ChatAppABI, signer);
    // Listen for new message events using ethers.js
    contract.on("NewMessage", (from, to, message) => {
      // Display a pop-up message with the new message details
      const showToastMessage = () => {
        toast.success(`New message from ${from} to ${to}: ${message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      };
      showToastMessage();
    });
    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      contract.removeAllListeners("NewMessage");
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {isConnected ? (
            <h3>Wallet Address : {walletAddress}</h3>
          ) : (
            <button onClick={connectWallet}>Connect Wallet</button>
          )}
        </div>
        {isConnected && (
          <div>
            <h3>
              <u>Send a Message:</u>
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label htmlFor="recipient">Recipient Address:</label>
              <input
                type="text"
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              <br />

              <label htmlFor="message">Message:</label>
              <input
                type="text"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <br />

              <button type="submit" onClick={sendMessage}>
                Send Message
              </button>
            </form>
          </div>
        )}
        {isConnected && (
          <div>
            {userMessages.map((msg, index) => (
              <div key={index}>
                <p>From: {msg.from}</p>
                <p>Message: {msg.message}</p>
              </div>
            ))}
            <button className="button button1" onClick={getMessages}>
              Received Messages
            </button>
          </div>
        )}
        <ToastContainer />
      </header>
    </div>
  );
}

export default App;

