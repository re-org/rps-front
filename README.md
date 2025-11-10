# RPS Game Hub - Frontend

A decentralized Rock-Paper-Scissors game with commit-reveal scheme built on Ethereum.

## Features

- 🎮 Multiplayer Rock-Paper-Scissors on the blockchain
- 🔒 Commit-Reveal scheme to prevent cheating
- 🎯 Fair gameplay with cryptographic proofs
- 💼 Web3 wallet integration (MetaMask, WalletConnect)
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast development with Vite and Bun

## How It Works

### Commit-Reveal Mechanism

1. **Commit Phase**: Players choose their move (Rock, Paper, or Scissors) and a secret string. The frontend creates a cryptographic hash: `keccak256(abi.encode(move, secret, playerAddress))` and submits it to the contract.

2. **Reveal Phase**: After both players have committed, they reveal their moves by submitting the original move and secret. The contract verifies that the hash matches and determines the winner.

3. **Secret Management**: Secrets are stored locally in the browser's localStorage. On each new turn, players must create a new secret string to ensure fairness.

## Setup

### Prerequisites

- [Bun](https://bun.sh/) installed
- A Web3 wallet (MetaMask, etc.)
- The RPS Game Hub contract deployed

### Installation

```bash
# Install dependencies
bun install

# Configure the contract address
# Edit src/config/web3.ts and update CONTRACT_ADDRESS
```

### Configuration

1. Update `src/config/web3.ts`:
   - Set `CONTRACT_ADDRESS` to your deployed contract address
   - Configure your desired networks
   - (Optional) Add WalletConnect project ID

### Development

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── WalletConnect.tsx   # Wallet connection UI
│   ├── CreateGame.tsx      # Game creation form
│   ├── PlayMove.tsx        # Commit move interface
│   ├── RevealMove.tsx      # Reveal move interface
│   └── GameView.tsx        # Main game display
├── config/             # Configuration files
│   └── web3.ts            # Web3/Wagmi configuration
├── contracts/          # Contract ABIs
│   └── RPSGameHubABI.ts   # Contract interface
├── hooks/              # Custom React hooks
│   └── useRPSGame.ts      # Game interaction hooks
├── types/              # TypeScript types
│   └── game.ts            # Game-related types
├── utils/              # Utility functions
│   ├── crypto.ts          # Cryptographic functions
│   └── storage.ts         # Local storage management
├── App.tsx             # Main application
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Game Flow

### Creating a Game

1. Connect your wallet
2. Enter opponent's Ethereum address
3. Click "Create Game"
4. Confirm the transaction

### Playing a Move

1. Select your move (Rock, Paper, or Scissors)
2. Enter a secret string (or generate one automatically)
3. Click "Commit Move"
4. Confirm the transaction
5. Wait for opponent to commit

### Revealing a Move

1. After both players commit, the "Reveal" button appears
2. Click "Reveal Move" - your secret is automatically retrieved
3. Confirm the transaction
4. If it's a draw, a new round begins automatically

## Security Considerations

- **Secrets are stored locally**: Don't clear browser data before revealing
- **Each turn needs a new secret**: The app prompts for a new secret each round
- **Commit-reveal prevents cheating**: Players can't see opponent's move before committing
- **On-chain verification**: All moves are verified by the smart contract

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Bun** - JavaScript runtime and package manager
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Styling

## Contract Interaction

The frontend interacts with the following contract functions:

- `createGame(address player1, address player2)` - Create a new game
- `play(uint256 gameId, bytes32 move)` - Commit a move hash
- `revealMove(uint256 gameId, GameMove gameMove, string secret)` - Reveal a move
- `getGameState(uint256 gameId)` - Get game status
- `getTurn(uint256 gameId, address player)` - Get player's current turn
- `getMove(uint256 gameId, uint256 turn, address player)` - Get move details
- `claimTimeout(uint256 gameId)` - Claim timeout if opponent is inactive

## License

UNLICENSED
