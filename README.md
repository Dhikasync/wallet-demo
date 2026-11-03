# Wallet Demo

A small Vite + React + ethers demo for learning web3, on Sepolia testnet only.

## What it does

- Connects MetaMask on Sepolia
- Reads the connected address and SepoliaETH balance
- Sends a 0.001 SepoliaETH test transaction to the same address
- Signs a login message and verifies the recovered address matches the connected address
- Reads and writes a number to a Storage smart contract deployed on Sepolia
- Reads the DTK token balance and sends DTK to another address, on Sepolia

## Smart contracts

- Storage: Sepolia Testnet, address in `src/App.jsx` as `STORAGE_ADDRESS`
- DhikaToken (DTK): Sepolia Testnet, address in `src/App.jsx` as `TOKEN_ADDRESS`, latest deployment only

## Test only

- Sepolia testnet only. No mainnet, no real funds, DTK has no value.
- Never share a seed phrase or private key.

## Run it

```text
npm install
npm run dev
