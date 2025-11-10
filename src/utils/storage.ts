import { SecretData } from '../types/game';

const STORAGE_KEY = 'rps_secrets';

/**
 * Stores secret data in localStorage for later reveal
 */
export function storeSecret(secretData: SecretData): void {
  try {
    const existing = getStoredSecrets();
    const key = `${secretData.gameId.toString()}_${secretData.turn.toString()}`;
    existing[key] = {
      ...secretData,
      gameId: secretData.gameId.toString(),
      turn: secretData.turn.toString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error('Failed to store secret:', error);
  }
}

/**
 * Retrieves a secret for a specific game and turn
 */
export function getSecret(gameId: bigint, turn: bigint): SecretData | null {
  try {
    const secrets = getStoredSecrets();
    const key = `${gameId.toString()}_${turn.toString()}`;
    const stored = secrets[key];
    if (!stored) return null;
    
    return {
      ...stored,
      gameId: BigInt(stored.gameId),
      turn: BigInt(stored.turn),
    };
  } catch (error) {
    console.error('Failed to retrieve secret:', error);
    return null;
  }
}

/**
 * Retrieves all secrets for a specific game
 */
export function getGameSecrets(gameId: bigint): SecretData[] {
  try {
    const secrets = getStoredSecrets();
    const gameIdStr = gameId.toString();
    return Object.entries(secrets)
      .filter(([key]) => key.startsWith(`${gameIdStr}_`))
      .map(([, value]) => ({
        ...value,
        gameId: BigInt(value.gameId),
        turn: BigInt(value.turn),
      }));
  } catch (error) {
    console.error('Failed to retrieve game secrets:', error);
    return [];
  }
}

/**
 * Clears a secret after it has been revealed
 */
export function clearSecret(gameId: bigint, turn: bigint): void {
  try {
    const secrets = getStoredSecrets();
    const key = `${gameId.toString()}_${turn.toString()}`;
    delete secrets[key];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(secrets));
  } catch (error) {
    console.error('Failed to clear secret:', error);
  }
}

/**
 * Clears all stored secrets (use with caution)
 */
export function clearAllSecrets(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear all secrets:', error);
  }
}

// Internal helper to get all stored secrets
function getStoredSecrets(): Record<string, any> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to parse stored secrets:', error);
    return {};
  }
}

