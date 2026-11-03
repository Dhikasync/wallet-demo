import { useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const MESSAGE = "Hello from wallet-demo - I own this address";

const STORAGE_ADDRESS = "0x94c2B5aE9Dd5686565865cFA895FA8Fd31338200";
const STORAGE_ABI = [
  "function favoriteNumber() view returns (uint256)",
  "function setNumber(uint256 _number)",
  "function getNumber() view returns (uint256)",
];

const TOKEN_ADDRESS = "0xf82cb871C8bC5C37dfe0f9EdEF1D1ACB64959110";
const TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

function App() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");
  const [signature, setSignature] = useState("");
  const [recovered, setRecovered] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [storedNumber, setStoredNumber] = useState("");
  const [contractStatus, setContractStatus] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [tokenRecipient, setTokenRecipient] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [tokenStatus, setTokenStatus] = useState("");

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not found in this browser");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    const userBalance = await provider.getBalance(userAddress);
    setAddress(userAddress);
    setBalance(ethers.formatEther(userBalance));
  }

  async function sendToSelf() {
    if (!address) {
      alert("Connect your wallet first");
      return;
    }
    setStatus("Waiting for approval...");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tx = await signer.sendTransaction({
      to: address,
      value: ethers.parseEther("0.001"),
    });
    setStatus("Sent, waiting for confirmation...");
    await tx.wait();
    setTxHash(tx.hash);
    setStatus("Confirmed");
    const newBalance = await provider.getBalance(address);
    setBalance(ethers.formatEther(newBalance));
  }

  async function signLoginMessage() {
    if (!address) {
      alert("Connect your wallet first");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const sig = await signer.signMessage(MESSAGE);
    setSignature(sig);
    const recoveredAddress = ethers.verifyMessage(MESSAGE, sig);
    setRecovered(recoveredAddress);
  }

  async function getNumberOnChain() {
    if (!address) {
      alert("Connect your wallet first");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      STORAGE_ADDRESS,
      STORAGE_ABI,
      provider
    );
    const value = await contract.getNumber();
    setStoredNumber(value.toString());
  }

  async function setNumberOnChain() {
    if (!address) {
      alert("Connect your wallet first");
      return;
    }
    if (newNumber === "") {
      alert("Type a number first");
      return;
    }
    setContractStatus("Waiting for approval...");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      STORAGE_ADDRESS,
      STORAGE_ABI,
      signer
    );
    const tx = await contract.setNumber(newNumber);
    setContractStatus("Sent, waiting for confirmation...");
    await tx.wait();
    setContractStatus("Confirmed on-chain");
    await getNumberOnChain();
  }

  async function getTokenBalance() {
    if (!address) {
      alert("Connect your wallet first");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
    const value = await token.balanceOf(address);
    setTokenBalance(ethers.formatUnits(value, 18));
  }

  async function sendToken() {
    if (!address) {
      alert("Connect your wallet first");
      return;
    }
    if (!tokenRecipient || tokenAmount === "") {
      alert("Fill in recipient and amount first");
      return;
    }
    setTokenStatus("Waiting for approval...");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
    const tx = await token.transfer(
      tokenRecipient,
      ethers.parseUnits(tokenAmount, 18)
    );
    setTokenStatus("Sent, waiting for confirmation...");
    await tx.wait();
    setTokenStatus("Confirmed on-chain");
    await getTokenBalance();
  }

  function disconnectWallet() {
    setAddress("");
    setBalance("");
    setStatus("");
    setTxHash("");
    setSignature("");
    setRecovered("");
    setStoredNumber("");
    setContractStatus("");
    setTokenBalance("");
    setTokenStatus("");
  }

  return (
    <div className="app">
      <div className="card">
        <span className="badge">Sepolia Testnet</span>
        <h1>Wallet Demo</h1>
        <p className="subtitle">
          Connect MetaMask, read your balance, send a test transaction, sign a
          login message, and talk to Storage and Token contracts.
        </p>

        {!address && (
          <button className="btn btn-primary" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {address && (
          <div>
            <div className="balance-box">
              <span className="balance-label">Balance</span>
              <span className="balance-value">{balance}</span>
              <span className="balance-unit">SepoliaETH</span>
            </div>

            <p className="label">Address</p>
            <p className="mono-box">{address}</p>
            <a
              className="link"
              href={`https://sepolia.etherscan.io/address/${address}`}
              target="_blank"
              rel="noreferrer"
            >
              View address on Sepolia Etherscan →
            </a>

            <div className="actions">
              <button className="btn btn-primary" onClick={sendToSelf}>
                Send 0.001 to myself
              </button>
              <button className="btn btn-secondary" onClick={signLoginMessage}>
                Sign login message
              </button>
              <button className="btn btn-ghost" onClick={disconnectWallet}>
                Disconnect
              </button>
            </div>

            {status && <p className="status">Status: {status}</p>}

            {txHash && (
              <div className="result">
                <p className="label">Tx hash</p>
                <p className="mono-box">{txHash}</p>
                <a
                  className="link"
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View transaction on Sepolia Etherscan →
                </a>
              </div>
            )}

            {signature && (
              <div className="result">
                <p className="label">Signature</p>
                <p className="mono-box">{signature}</p>
              </div>
            )}

            {recovered && (
              <div className="result">
                <p className="label">Recovered address</p>
                <p className="mono-box">{recovered}</p>
                <p className="match">
                  Match:{" "}
                  {recovered.toLowerCase() === address.toLowerCase()
                    ? "Yes ✓"
                    : "No"}
                </p>
              </div>
            )}

            <div className="result">
              <h2>Storage Contract</h2>
              <p className="label">Contract address</p>
              <p className="mono-box">{STORAGE_ADDRESS}</p>
              <input
                className="input"
                type="number"
                placeholder="Type a number, e.g. 42"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
              />
              <div className="actions">
                <button className="btn btn-primary" onClick={setNumberOnChain}>
                  Set number on-chain
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={getNumberOnChain}
                >
                  Get stored number
                </button>
              </div>
              {contractStatus && <p className="status">{contractStatus}</p>}
              {storedNumber !== "" && (
                <p className="match">Stored number: {storedNumber}</p>
              )}
            </div>

            <div className="result">
              <h2>Dhika Token (DTK)</h2>
              <p className="label">Token address</p>
              <p className="mono-box">{TOKEN_ADDRESS}</p>
              <input
                className="input"
                type="text"
                placeholder="Recipient address"
                value={tokenRecipient}
                onChange={(e) => setTokenRecipient(e.target.value)}
              />
              <input
                className="input"
                type="number"
                placeholder="Amount in DTK, e.g. 100"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
              />
              <div className="actions">
                <button className="btn btn-primary" onClick={sendToken}>
                  Send DTK
                </button>
                <button className="btn btn-secondary" onClick={getTokenBalance}>
                  Get DTK balance
                </button>
              </div>
              {tokenStatus && <p className="status">{tokenStatus}</p>}
              {tokenBalance !== "" && (
                <p className="match">DTK balance: {tokenBalance}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
