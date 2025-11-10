import { keccak256, encodeAbiParameters } from 'viem';
import { GameMove } from '../types/game';

/**
 * Creates a commitment hash for a move using the commit-reveal scheme
 * Hash = keccak256(abi.encode(GameMove, secret, playerAddress))
 * 
 * @param move - The game move (PAPER, ROCK, or SCISSORS)
 * @param secret - The secret string provided by the player
 * @param playerAddress - The wallet address of the player
 * @returns The commitment hash
 */
export function createMoveCommitment(
  move: GameMove,
  secret: string,
  playerAddress: `0x${string}`
): `0x${string}` {
  // Encode parameters according to contract's abi.encode(GameMove, secret, player)
  const encoded = encodeAbiParameters(
    [
      { name: 'move', type: 'uint8' },
      { name: 'secret', type: 'string' },
      { name: 'player', type: 'address' },
    ],
    [move, secret, playerAddress]
  );

  return keccak256(encoded);
}

/**
 * Generates a random secret string
 * @param length - Length of the secret (default: 32)
 * @returns A random hex string
 */
export function generateRandomSecret(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates that a secret string is not empty and meets minimum requirements
 * @param secret - The secret to validate
 * @returns True if valid, false otherwise
 */
export function validateSecret(secret: string): boolean {
  return secret.length >= 6;
}

