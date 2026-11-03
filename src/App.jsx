import { useState } from 'react'
import { ethers } from 'ethers'

function App() {
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState('')
  const [status, setStatus] = useState('')
  const [txHash, setTxHash] = useState('')

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
    </div>
  )
}

export default App
