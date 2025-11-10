# Deployment Guide

## Prerequisites

1. Deploy the `RPSGameHub` contract to your desired network
2. Note the contract address

## Configuration

1. Update `src/config/web3.ts`:
   ```typescript
   export const CONTRACT_ADDRESS: `0x${string}` = '0xYourContractAddress';
   ```

2. Configure networks as needed in the same file

3. (Optional) For WalletConnect support:
   - Get a project ID from https://cloud.walletconnect.com
   - Uncomment and update the WalletConnect connector in `web3.ts`

## Build

```bash
bun run build
```

The built files will be in the `dist/` directory.

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## Testing Locally

1. Start a local Ethereum node (e.g., Hardhat, Anvil)
2. Deploy the contract to the local network
3. Update the contract address in `web3.ts`
4. Run the dev server:
   ```bash
   bun run dev
   ```

## Network Configuration

The app is configured to work with:
- Mainnet (Ethereum)
- Sepolia (Testnet)
- Localhost (Development)

Add more networks in `web3.ts` as needed.

## Important Notes

- Secrets are stored in localStorage - users must not clear browser data before revealing
- Each turn requires a new secret to be generated
- The commit-reveal scheme prevents front-running and cheating
- Gas fees apply for all transactions (createGame, play, revealMove, claimTimeout)

