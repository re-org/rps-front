// Game Move enum matching Solidity contract
export enum GameMove {
  PAPER = 0,
  ROCK = 1,
  SCISSORS = 2,
}

// Move State enum
export enum MoveState {
  EMPTY = 0,
  MOVED = 1,
  REVEALED = 2,
}

// Game State enum
export enum GameState {
  IN_PROGRESS = 0,
  FINISHED = 1,
}

// Move structure
export interface Move {
  state: MoveState;
  move: `0x${string}`;
  revealedMove: GameMove;
}

// Game data
export interface GameData {
  gameId: bigint;
  player1: `0x${string}`;
  player2: `0x${string}`;
  state: GameState;
  currentTurn: bigint;
  lastMoveTimestamp: bigint;
}

// Secret storage for commit-reveal
export interface SecretData {
  gameId: bigint;
  turn: bigint;
  move: GameMove;
  secret: string;
  commitHash: `0x${string}`;
}

export const MOVE_NAMES: Record<GameMove, string> = {
  [GameMove.PAPER]: '📄 Paper',
  [GameMove.ROCK]: '🪨 Rock',
  [GameMove.SCISSORS]: '✂️ Scissors',
};

export const MOVE_NAMES_SHORT: Record<GameMove, string> = {
  [GameMove.PAPER]: 'Paper',
  [GameMove.ROCK]: 'Rock',
  [GameMove.SCISSORS]: 'Scissors',
};

