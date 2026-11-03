import { useState } from 'react'
import { ethers } from 'ethers'
import './App.css'

const MESSAGE = 'Hello from wallet-demo - I own this address'

function App() {
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState('')
  const [status, setStatus] = useState('')
  const [txHash, setTxHash] = useState('')
  const [signature, setSignature] = useState('')
  const [recovered, setRecovered] = useState('')

  async function connectWallet() {
    if (!window.ethereum) {
      alert('MetaMask not found in this browser')
      return
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = await provider.getSigner()
    const userAddress = await signer.getAddress()
    const userBalance = await provider.getBalance(userAddress)
    setAddress(userAddress)
    setBalance(ethers.formatEther(userBalance))
  }

  async function sendToSelf() {
    if (!address) {
      alert('Connect your wallet first')
      return
    }
    setStatus('Waiting for approval...')
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const tx = await signer.sendTransaction({
      to: address,
      value: ethers.parseEther('0.001'),
    })
    setStatus('Sent, waiting for confirmation...')
    await tx.wait()
    setTxHash(tx.hash)
    setStatus('Confirmed')
    const newBalance = await provider.getBalance(address)
    setBalance(ethers.formatEther(newBalance))
  }

  async function signLoginMessage() {
    if (!address) {
      alert('Connect your wallet first')
      return
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const sig = await signer.signMessage(MESSAGE)
    setSignature(sig)
    const recoveredAddress = ethers.verifyMessage(MESSAGE, sig)
    setRecovered(recoveredAddress)
  }

  function disconnectWallet() {
    setAddress('')
    setBalance('')
    setStatus('')
    setTxHash('')
    setSignature('')
    setRecovered('')
  }

  return (
    <div className="app">
      <div className="card">
        <span className="badge">Sepolia Testnet</span>
        <h1>Wallet Demo</h1>
        <p className="subtitle">
          Connect MetaMask, read your balance, send a test transaction,
          and sign a login message.
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
                  Match:{' '}
                  {recovered.toLowerCase() === address.toLowerCase()
                    ? 'Yes ✓'
                    : 'No'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
