# Wallet Demo

A small Vite + React + ethers demo for learning web3, on Sepolia testnet only.

## What it does

- Connects MetaMask on Sepolia
- Reads the connected address and SepoliaETH balance
- Sends a 0.001 SepoliaETH test transaction to the same address
- Signs a login message and verifies the recovered address matches the connected address
- Reads and writes a number to a Storage smart contract deployed on Sepolia
- Disconnect, with links to Sepolia Etherscan for the address and transactions

## Smart contract

- Contract: `Storage.sol`
- Network: Sepolia Testnet
- Address: PASTE_YOUR_STORAGE_CONTRACT_ADDRESS_HERE

`Storage` stores one number on-chain:

- `setNumber` — writes a number, costs a small amount of SepoliaETH gas
- `getNumber` — reads the stored number, free

## Test only

- Sepolia testnet only. No smart contract on mainnet, no real funds.
- No token yet, no DeFi, no production use.
- Never share a seed phrase or private key. This demo uses a test-only wallet.

## Run it

```text
npm install
npm run dev
