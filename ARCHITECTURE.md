# RPS Game Hub - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's Browser                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                   React Application                     │   │
│  │                                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │ Wallet   │  │ Create   │  │ Play     │            │   │
│  │  │ Connect  │  │ Game     │  │ Move     │            │   │
│  │  └──────────┘  └──────────┘  └──────────┘            │   │
│  │                                                          │   │
│  │  ┌──────────┐  ┌──────────────────────────────────┐   │   │
│  │  │ Reveal   │  │        Game View                  │   │   │
│  │  │ Move     │  │  - Player Status                  │   │   │
│  │  └──────────┘  │  - Turn Information               │   │   │
│  │                 │  - Move States                    │   │   │
│  │                 └──────────────────────────────────┘   │   │
│  │                                                          │   │
│  │  ┌────────────────────────────────────────────────┐    │   │
│  │  │              Custom Hooks Layer                 │    │   │
│  │  │  - useRPSGame (write operations)               │    │   │
│  │  │  - useGameDetails (read game state)            │    │   │
│  │  │  - usePlayerMove (read player moves)           │    │   │
│  │  └────────────────────────────────────────────────┘    │   │
│  │                          ↕                              │   │
│  │  ┌────────────────────────────────────────────────┐    │   │
│  │  │           Wagmi + Viem (Web3 Layer)            │    │   │
│  │  │  - Contract interactions                       │    │   │
│  │  │  - Transaction management                      │    │   │
│  │  │  - State caching (React Query)                 │    │   │
│  │  └────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↕                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Wallet (MetaMask, etc.)                   │ │
│  │  - Sign transactions                                   │ │
│  │  - Manage private keys                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↕                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Local Storage                              │ │
│  │  - Stores secrets for commit-reveal                    │ │
│  │  - Key: gameId_turn                                    │ │
│  │  - Value: { move, secret, commitHash }                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                          ↕
                    JSON-RPC / HTTP
                          ↕
┌─────────────────────────────────────────────────────────────────┐
│                    Ethereum Network                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │           RPSGameHub Smart Contract                     │   │
│  │                                                          │   │
│  │  State Variables:                                       │   │
│  │  - gamesCount: uint256                                  │   │
│  │  - games: mapping(gameId => GameInstance)              │   │
│  │  - player1: mapping(gameId => address)                 │   │
│  │  - player2: mapping(gameId => address)                 │   │
│  │                                                          │   │
│  │  Functions:                                             │   │
│  │  - createGame(player1, player2) → gameId               │   │
│  │  - play(gameId, moveHash)                              │   │
│  │  - revealMove(gameId, move, secret)                    │   │
│  │  - claimTimeout(gameId)                                │   │
│  │  - getGameState(gameId) → GameState                    │   │
│  │  - getTurn(gameId, player) → uint256                   │   │
│  │  - getMove(gameId, turn, player) → Move                │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Commit Phase

```
User Action                Frontend                  LocalStorage          Blockchain
    │                          │                           │                   │
    ├─► Select Move            │                           │                   │
    │   (Rock/Paper/Scissors)  │                           │                   │
    │                          │                           │                   │
    ├─► Enter Secret           │                           │                   │
    │   (or generate)          │                           │                   │
    │                          │                           │                   │
    │                     ┌────▼────┐                      │                   │
    │                     │  Hash   │                      │                   │
    │                     │ keccak256│                     │                   │
    │                     │(move,    │                     │                   │
    │                     │ secret,  │                     │                   │
    │                     │ address) │                     │                   │
    │                     └────┬────┘                      │                   │
    │                          │                           │                   │
    │                          ├──── Store Secret ────────►│                   │
    │                          │     { gameId, turn,       │                   │
    │                          │       move, secret }      │                   │
    │                          │                           │                   │
    ├─► Confirm Transaction    │                           │                   │
    │                          │                           │                   │
    │                          ├──── play(gameId, hash) ──────────────────────►│
    │                          │                           │                   │
    │                          │◄─── Transaction Receipt ───────────────────────┤
    │                          │                           │                   │
    │◄─── Success Message ─────┤                           │                   │
```

### Reveal Phase

```
User Action                Frontend                  LocalStorage          Blockchain
    │                          │                           │                   │
    ├─► Click Reveal           │                           │                   │
    │                          │                           │                   │
    │                          ├──── Get Secret ──────────►│                   │
    │                          │                           │                   │
    │                          │◄──── { move, secret } ────┤                   │
    │                          │                           │                   │
    ├─► Confirm Transaction    │                           │                   │
    │                          │                           │                   │
    │                          ├── revealMove(gameId, ──────────────────────►│
    │                          │    move, secret)          │                   │
    │                          │                           │                   │
    │                          │                           │    ┌──────────┐   │
    │                          │                           │    │ Verify   │   │
    │                          │                           │    │ Hash     │   │
    │                          │                           │    │ Matches  │   │
    │                          │                           │    └────┬─────┘   │
    │                          │                           │         │         │
    │                          │                           │    ┌────▼─────┐   │
    │                          │                           │    │Determine │   │
    │                          │                           │    │ Winner   │   │
    │                          │                           │    └────┬─────┘   │
    │                          │                           │         │         │
    │                          │◄─── Winner/Draw Event ─────────────┴─────────┤
    │                          │                           │                   │
    │                          ├─── Clear Secret ─────────►│                   │
    │                          │                           │                   │
    │◄─── Display Result ──────┤                           │                   │
```

## Component Hierarchy

```
App
├── WagmiProvider
│   └── QueryClientProvider
│       └── AppContent
│           ├── Header
│           │   ├── Title
│           │   └── WalletConnect
│           │       ├── Connect Button(s)
│           │       └── Disconnect Button
│           │
│           ├── Stats
│           │   └── Total Games Count
│           │
│           ├── Left Panel
│           │   ├── CreateGame
│           │   │   ├── Player2 Input
│           │   │   └── Create Button
│           │   │
│           │   └── Game List
│           │       └── Game Buttons
│           │
│           ├── Right Panel
│           │   └── GameView (if selected)
│           │       ├── Game Info
│           │       │   ├── Player 1 Status
│           │       │   └── Player 2 Status
│           │       │
│           │       └── Action Panel
│           │           ├── PlayMove (if turn)
│           │           │   ├── Move Selection
│           │           │   ├── Secret Input
│           │           │   └── Commit Button
│           │           │
│           │           ├── RevealMove (if ready)
│           │           │   ├── Move Display
│           │           │   ├── Secret Display
│           │           │   └── Reveal Button
│           │           │
│           │           └── Waiting States
│           │
│           ├── Instructions
│           │   └── How to Play
│           │
│           └── Footer
```

## State Management

### React Query Cache

```
Cached Data (auto-refetched):
├── gamesCount
├── For each game:
│   ├── player1
│   ├── player2
│   ├── gameState
│   ├── lastMoveTimestamp
│   ├── For each player:
│   │   ├── turn
│   │   └── move { state, move, revealedMove }
```

### Local Storage

```
rps_secrets: {
  "0_0": {
    gameId: "0",
    turn: "0",
    move: 1,  // ROCK
    secret: "abc123...",
    commitHash: "0x..."
  },
  "0_1": { ... },
  "1_0": { ... }
}
```

### Component State

```
App:
├── selectedGameId: bigint | null

CreateGame:
├── player2Address: string
└── error: string

PlayMove:
├── selectedMove: GameMove | null
├── secret: string
├── error: string
└── showSecretInput: boolean

GameView:
└── (no local state, all from hooks)
```

## Hook Dependencies

```
useRPSGame
├── useAccount (wagmi)
├── useWriteContract (wagmi)
└── useReadContract (wagmi)
    └── Uses React Query internally

useGameDetails
└── useReadContract (wagmi) x4
    ├── player1
    ├── player2
    ├── gameState
    └── lastMoveTimestamp

usePlayerMove
└── useReadContract (wagmi) x2
    ├── getTurn
    └── getMove
```

## Security Layers

```
┌──────────────────────────────────────────────┐
│         Cryptographic Security                │
│  keccak256(abi.encode(move, secret, addr))   │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│         Local Secret Storage                  │
│  Secrets never leave user's browser          │
│  until reveal                                 │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│         Smart Contract Verification           │
│  Verifies revealed move matches commitment   │
│  Determines winner with on-chain logic       │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│         Blockchain Immutability               │
│  All moves permanently recorded              │
│  Transparent and auditable                   │
└──────────────────────────────────────────────┘
```

## User Journey

```
Start
  │
  ├─► Connect Wallet ─────────────┐
  │                                │
  ├─► Create Game ────────────────┼─► Enter opponent address
  │                                │   └─► Confirm transaction
  │                                │       └─► Game created ✓
  │                                │
  ├─► Select Game ────────────────┤
  │                                │
  ├─► Play Move ──────────────────┼─► Choose Rock/Paper/Scissors
  │                                │   ├─► Enter or generate secret
  │                                │   ├─► Confirm transaction
  │                                │   └─► Move committed ✓
  │                                │
  ├─► Wait for Opponent ──────────┤   (automatic)
  │                                │
  ├─► Reveal Move ────────────────┼─► Click reveal button
  │                                │   ├─► Confirm transaction
  │                                │   └─► Move revealed ✓
  │                                │
  ├─► View Result ────────────────┤
  │   ├─► Winner determined ✓      │
  │   └─► Draw → New Round ────────┘
  │
End (Game Finished)
```

## Technology Integration

```
┌─────────────────────────────────────────────┐
│              React 18                        │
│  - Component rendering                       │
│  - State management                          │
│  - User interactions                         │
└────────────┬────────────────────────────────┘
             │
┌────────────▼────────────────────────────────┐
│         TypeScript 5.6                       │
│  - Type safety                              │
│  - Interface definitions                    │
│  - Compile-time checks                      │
└────────────┬────────────────────────────────┘
             │
┌────────────▼────────────────────────────────┐
│           Wagmi 2.12                        │
│  - React hooks for Ethereum                 │
│  - Wallet connection                        │
│  - Contract interaction abstraction         │
└────────────┬────────────────────────────────┘
             │
┌────────────▼────────────────────────────────┐
│           Viem 2.21                         │
│  - Low-level Ethereum interactions          │
│  - ABI encoding/decoding                    │
│  - Transaction building                     │
└────────────┬────────────────────────────────┘
             │
┌────────────▼────────────────────────────────┐
│       Ethereum JSON-RPC                     │
│  - eth_call (read)                          │
│  - eth_sendTransaction (write)              │
│  - eth_getTransactionReceipt (status)       │
└────────────┬────────────────────────────────┘
             │
             ▼
       Ethereum Network
```

---

This architecture ensures:
- ✅ Secure commit-reveal implementation
- ✅ Type-safe contract interactions
- ✅ Responsive user experience
- ✅ Proper state management
- ✅ Error handling at all layers
- ✅ Clear separation of concerns

