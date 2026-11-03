import { useState } from 'react'
import { ethers } from 'ethers'

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

  return (
    <div>
      <h1>Wallet Demo</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      {address && <p>Address: {address}</p>}
      {balance && <p>Balance: {balance} SepoliaETH</p>}
      {address && (
        <button onClick={sendToSelf}>Send 0.001 to myself</button>
      )}
      {status && <p>Status: {status}</p>}
      {txHash && <p>Tx hash: {txHash}</p>}
      {address && (
        <button onClick={signLoginMessage}>Sign login message</button>
      )}
      {signature && <p>Signature: {signature}</p>}
      {recovered && <p>Recovered address: {recovered}</p>}
      {recovered && address && (
        <p>
          Match: {recovered.toLowerCase() === address.toLowerCase() ? 'Yes' : 'No'}
        </p>
      )}
    </div>
  )
}

export default App
