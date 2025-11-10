# Getting Started with RPS Game Hub Frontend

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Contract Address

Edit `src/config/web3.ts` and update the contract address:

```typescript
export const CONTRACT_ADDRESS: `0x${string}` = '0xYourDeployedContractAddress';
```

### 3. Run Development Server

```bash
bun run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
bun run build
```

## Features Overview

### Commit-Reveal Mechanism

This app implements a secure commit-reveal scheme to ensure fair gameplay:

1. **Commit Phase**: 
   - Player selects a move (Rock, Paper, or Scissors)
   - Player enters or generates a secret string
   - The app creates a hash: `keccak256(abi.encode(move, secret, playerAddress))`
   - Hash is submitted to the blockchain
   - Secret is stored locally in browser

2. **Reveal Phase**:
   - After both players commit, they can reveal
   - App retrieves the stored secret
   - Original move and secret are submitted to the contract
   - Contract verifies the hash matches
   - Winner is determined automatically

### Secret Management

- **On Each Turn**: User must provide a new secret string
- **Storage**: Secrets are stored in browser's localStorage
- **Security**: Secrets never leave the user's device until reveal
- **Format**: Minimum 6 characters (can be auto-generated)

**Important**: Don't clear browser data before revealing your move, or you'll lose your secret!

## User Flow

### Creating a Game

1. Click "Connect Wallet" to connect MetaMask or other Web3 wallet
2. Enter opponent's Ethereum address
3. Click "Create Game"
4. Confirm transaction in wallet
5. Wait for transaction to be mined

### Playing a Move

1. Select a game from the list
2. Choose your move (Rock, Paper, or Scissors)
3. Enter a secret or click "Generate" for a random one
4. Click "Commit Move"
5. Confirm transaction in wallet
6. Wait for opponent to commit their move

### Revealing a Move

1. Once both players have committed, "Reveal Move" button appears
2. Click "Reveal Move"
3. App automatically retrieves your secret
4. Confirm transaction in wallet
5. If both players reveal, winner is determined
6. If it's a draw, a new round begins automatically

## Architecture

### Key Components

- **WalletConnect**: Handles wallet connection
- **CreateGame**: UI for creating new games
- **PlayMove**: UI for committing moves with secrets
- **RevealMove**: UI for revealing committed moves
- **GameView**: Displays game state and player status

### Hooks

- **useRPSGame**: Main hook for contract interactions
- **useGameDetails**: Fetches game state and player info
- **usePlayerMove**: Fetches player's turn and move status

### Utilities

- **crypto.ts**: Hash generation and secret management
- **storage.ts**: LocalStorage management for secrets

### Types

- **GameMove**: Enum for Rock (1), Paper (0), Scissors (2)
- **MoveState**: Enum for Empty (0), Moved (1), Revealed (2)
- **GameState**: Enum for In Progress (0), Finished (1)

## Contract Interface

The frontend interacts with these contract functions:

### Write Functions
- `createGame(player1, player2)` - Create new game
- `play(gameId, moveHash)` - Commit move hash
- `revealMove(gameId, move, secret)` - Reveal move
- `claimTimeout(gameId)` - Claim timeout win

### Read Functions
- `gamesCount()` - Total games created
- `player1(gameId)` - Get player 1 address
- `player2(gameId)` - Get player 2 address
- `getGameState(gameId)` - Get game status
- `getTurn(gameId, player)` - Get player's turn
- `getMove(gameId, turn, player)` - Get move details
- `getLastMoveTimestamp(gameId)` - Get last move time

## Troubleshooting

### "No secret found for this turn"
- You may have cleared browser data
- Secret was not properly saved
- Check localStorage manually or regenerate

### "Transaction failed"
- Check you have enough ETH for gas
- Verify contract address is correct
- Ensure you're on the right network

### "Wallet not connected"
- Click "Connect Wallet" in top right
- Approve connection in wallet popup
- Refresh page if needed

### "Not a player in this game"
- You can only play games where you're player1 or player2
- Create a new game to play

## Development Tips

### Testing Locally

1. Run a local Ethereum node (Hardhat/Anvil):
   ```bash
   # In tto-contracts directory
   anvil
   ```

2. Deploy contract to local network:
   ```bash
   forge script script/Deploy.s.sol --broadcast --rpc-url http://localhost:8545
   ```

3. Update contract address in `web3.ts`

4. Run dev server:
   ```bash
   bun run dev
   ```

### Adding New Networks

Edit `src/config/web3.ts`:

```typescript
import { polygon, arbitrum } from 'wagmi/chains';

export const config = createConfig({
  chains: [mainnet, sepolia, localhost, polygon, arbitrum],
  // ... rest of config
  transports: {
    // ... existing transports
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
});
```

## Security Considerations

1. **Secrets are client-side**: Never stored on blockchain until reveal
2. **Hash verification**: Contract verifies revealed move matches commitment
3. **No front-running**: Opponent can't see your move before committing theirs
4. **Timeout protection**: Can claim win if opponent goes inactive
5. **New secret each turn**: Prevents replay attacks

## Support

For issues or questions:
- Check the contract repository for contract-related issues
- Review the code in `src/` for implementation details
- Ensure you're using the latest version of dependencies

