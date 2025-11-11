import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { RPSGameHubABI } from '../contracts/RPSGameHubABI';
import { CONTRACT_ADDRESS } from '../config/web3';
import { GameMove, GameState, Move } from '../types/game';
import { createMoveCommitment } from '../utils/crypto';
import { storeSecret, getSecret, clearSecret, getGameSecrets } from '../utils/storage';
import { useEffect } from 'react';

export function useRPSGame() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read the total games count
  const { data: gamesCount, refetch: refetchGamesCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RPSGameHubABI,
    functionName: 'gamesCount',
  });

  // Auto-refetch games count when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      refetchGamesCount();
    }
  }, [isConfirmed, refetchGamesCount]);

  // Create a new game
  const createGame = async (player1: `0x${string}`, player2: `0x${string}`) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: RPSGameHubABI,
      functionName: 'createGame',
      args: [player1, player2],
    });
  };

  // Play a move (commit phase)
  const playMove = async (gameId: bigint, move: GameMove, secret: string) => {
    if (!address) throw new Error('Wallet not connected');

    const commitHash = createMoveCommitment(move, secret, address);

    // Store the secret locally for later reveal
    storeSecret({
      gameId,
      turn: 0n, // Will be updated with actual turn from contract
      move,
      secret,
      commitHash,
    });

    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: RPSGameHubABI,
      functionName: 'play',
      args: [gameId, commitHash],
    });
  };

  // Reveal a move
  const revealMove = async (gameId: bigint, turn: bigint, manualMove?: GameMove, manualSecret?: string) => {
    let move: GameMove;
    let secret: string;
    let storedTurn: bigint | undefined;

    if (manualMove !== undefined && manualSecret !== undefined) {
      // Use manually provided move and secret
      move = manualMove;
      secret = manualSecret;
    } else {
      // Try to get from storage - first by turn, then by game
      let secretData = getSecret(gameId, turn);
      if (!secretData) {
        const gameSecrets = getGameSecrets(gameId);
        secretData = gameSecrets.length > 0 ? gameSecrets[0] : null;
      }

      if (!secretData) throw new Error('No secret found. Please provide move and secret manually.');

      move = secretData.move;
      secret = secretData.secret;
      storedTurn = secretData.turn;
    }

    const result = writeContract({
      address: CONTRACT_ADDRESS,
      abi: RPSGameHubABI,
      functionName: 'revealMove',
      args: [gameId, move, secret],
    });

    // Clear the secret after revealing
    if (storedTurn !== undefined) {
      clearSecret(gameId, storedTurn);
    }
    clearSecret(gameId, turn);

    return result;
  };

  // Claim timeout
  const claimTimeout = async (gameId: bigint) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: RPSGameHubABI,
      functionName: 'claimTimeout',
      args: [gameId],
    });
  };

  return {
    gamesCount,
    createGame,
    playMove,
    revealMove,
    claimTimeout,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: writeError,
    refetchGamesCount,
  };
}

// Hook to read game details
export function useGameDetails(gameId: bigint | undefined) {
  const { data: player1, refetch: refetchPlayer1 } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RPSGameHubABI,
    functionName: 'player1',
    args: gameId !== undefined ? [gameId] : undefined,
    query: {
      enabled: gameId !== undefined,
    },
  });

  const { data: player2, refetch: refetchPlayer2 } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RPSGameHubABI,
    functionName: 'player2',
    args: gameId !== undefined ? [gameId] : undefined,
    query: {
      enabled: gameId !== undefined,
    },
  });

  const { data: gameState, refetch: refetchGameState } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RPSGameHubABI,
    functionName: 'getGameState',
    args: gameId !== undefined ? [gameId] : undefined,
    query: {
      enabled: gameId !== undefined,
    },
  });

  const { data: lastMoveTimestamp, refetch: refetchLastMoveTimestamp } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RPSGameHubABI,
    functionName: 'getLastMoveTimestamp',
    args: gameId !== undefined ? [gameId] : undefined,
    query: {
      enabled: gameId !== undefined,
    },
  });

  const refetchAll = () => {
    refetchPlayer1();
    refetchPlayer2();
    refetchGameState();
    refetchLastMoveTimestamp();
  };

  return {
    player1,
    player2,
    gameState: gameState as GameState | undefined,
    lastMoveTimestamp,
    refetchAll,
  };
}

// Hook to read player's turn and move
export function usePlayerMove(gameId: bigint | undefined, playerAddress: `0x${string}` | undefined) {
  const { data: turn, refetch: refetchTurn } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RPSGameHubABI,
    functionName: 'getTurn',
    args: gameId !== undefined && playerAddress ? [gameId, playerAddress] : undefined,
    query: {
      enabled: gameId !== undefined && playerAddress !== undefined,
    },
  });

  const { data: move, refetch: refetchMove } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RPSGameHubABI,
    functionName: 'getMove',
    args: gameId !== undefined && turn !== undefined && playerAddress ? [gameId, turn, playerAddress] : undefined,
    query: {
      enabled: gameId !== undefined && turn !== undefined && playerAddress !== undefined,
    },
  });

  const refetchAll = () => {
    refetchTurn();
    refetchMove();
  };

  return {
    turn,
    move: move as Move | undefined,
    refetchAll,
  };
}

