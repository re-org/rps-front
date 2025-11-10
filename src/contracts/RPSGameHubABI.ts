export const RPSGameHubABI = [
  {
    "type": "function",
    "name": "MOVE_TIMEOUT",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "claimTimeout",
    "inputs": [{ "name": "gameId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createGame",
    "inputs": [
      { "name": "_player1", "type": "address", "internalType": "address" },
      { "name": "_player2", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "gameId", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "gamesCount",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGameState",
    "inputs": [{ "name": "gameId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "uint8", "internalType": "enum GameState" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getLastMoveTimestamp",
    "inputs": [{ "name": "gameId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMove",
    "inputs": [
      { "name": "gameId", "type": "uint256", "internalType": "uint256" },
      { "name": "turn", "type": "uint256", "internalType": "uint256" },
      { "name": "player", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct Move",
        "components": [
          { "name": "state", "type": "uint8", "internalType": "enum MoveState" },
          { "name": "move", "type": "bytes32", "internalType": "bytes32" },
          { "name": "revealedMove", "type": "uint8", "internalType": "enum GameMove" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTurn",
    "inputs": [
      { "name": "gameId", "type": "uint256", "internalType": "uint256" },
      { "name": "player", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "play",
    "inputs": [
      { "name": "gameId", "type": "uint256", "internalType": "uint256" },
      { "name": "move", "type": "bytes32", "internalType": "bytes32" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "player1",
    "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "player2",
    "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "revealMove",
    "inputs": [
      { "name": "gameId", "type": "uint256", "internalType": "uint256" },
      { "name": "gameMove", "type": "uint8", "internalType": "enum GameMove" },
      { "name": "secret", "type": "string", "internalType": "string" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Draw",
    "inputs": [
      { "name": "gameId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "move1", "type": "uint8", "indexed": false, "internalType": "enum GameMove" },
      { "name": "move2", "type": "uint8", "indexed": false, "internalType": "enum GameMove" },
      { "name": "turn", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "GameCreated",
    "inputs": [
      { "name": "gameId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "player1", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "player2", "type": "address", "indexed": true, "internalType": "address" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "GameTimeout",
    "inputs": [
      { "name": "gameId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "winner", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MovePlayed",
    "inputs": [
      { "name": "gameId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "player", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "move", "type": "bytes32", "indexed": false, "internalType": "bytes32" },
      { "name": "turn", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MoveRevealed",
    "inputs": [
      { "name": "gameId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "player", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "gameMove", "type": "uint8", "indexed": false, "internalType": "enum GameMove" },
      { "name": "secret", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "turn", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Winner",
    "inputs": [
      { "name": "gameId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "move1", "type": "uint8", "indexed": false, "internalType": "enum GameMove" },
      { "name": "move2", "type": "uint8", "indexed": false, "internalType": "enum GameMove" },
      { "name": "turn", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "winner", "type": "address", "indexed": true, "internalType": "address" }
    ],
    "anonymous": false
  },
  { "type": "error", "name": "AlreadyMoved", "inputs": [] },
  { "type": "error", "name": "GameFinished", "inputs": [] },
  { "type": "error", "name": "GameNotFound", "inputs": [] },
  { "type": "error", "name": "IncorrectReveal", "inputs": [] },
  { "type": "error", "name": "InvalidMove", "inputs": [] },
  { "type": "error", "name": "InvalidPlayer", "inputs": [] },
  { "type": "error", "name": "InvalidWinnerMove", "inputs": [] },
  { "type": "error", "name": "NotMoved", "inputs": [] },
  { "type": "error", "name": "NotPlayer", "inputs": [] },
  { "type": "error", "name": "TimeoutNotReached", "inputs": [] }
] as const;

