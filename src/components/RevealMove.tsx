import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRPSGame } from '../hooks/useRPSGame';
import { getSecret, getGameSecrets } from '../utils/storage';
import { MOVE_NAMES_SHORT, GameMove } from '../types/game';

interface RevealMoveProps {
  gameId: bigint;
  turn: bigint;
  onSuccess?: () => void;
}

export function RevealMove({ gameId, turn, onSuccess }: RevealMoveProps) {
  const { address } = useAccount();
  const { revealMove, isPending, isConfirming, isConfirmed } = useRPSGame();
  const [manualMove, setManualMove] = useState<GameMove>(GameMove.ROCK);
  const [manualSecret, setManualSecret] = useState('');

  // Call onSuccess when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      onSuccess?.();
    }
  }, [isConfirmed, onSuccess]);
  
  // Try to get secret - first by turn, then by game
  let secretData = getSecret(gameId, turn);
  if (!secretData) {
    const gameSecrets = getGameSecrets(gameId);
    secretData = gameSecrets.length > 0 ? gameSecrets[0] : null;
  }

  const handleReveal = async () => {
    try {
      if (secretData) {
        // Use stored secret
        await revealMove(gameId, turn);
      } else {
        // Use manual input
        await revealMove(gameId, turn, manualMove, manualSecret);
      }
      // onSuccess will be called in useEffect when isConfirmed is true
    } catch (err: any) {
      console.error('Failed to reveal move:', err);
      alert(`Failed to reveal: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Reveal Your Move</h2>
      
      <div className="space-y-4">
        {secretData ? (
          <>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Your committed move:</div>
              <div className="text-xl font-semibold">{MOVE_NAMES_SHORT[secretData.move]}</div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Secret (stored locally):</div>
              <div className="text-sm font-mono break-all">{secretData.secret}</div>
            </div>

            <button
              onClick={handleReveal}
              disabled={isPending || isConfirming || !address}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
            >
              {isConfirming ? 'Confirming...' : isPending ? 'Revealing...' : 'Reveal Move'}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-200 mb-2">
                ⚠️ No secret found in local storage. You'll need to manually enter your move and secret.
              </p>
              <p className="text-sm text-yellow-300">
                This can happen if you cleared browser data or are using a different browser.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Move:</label>
                <select
                  value={manualMove}
                  onChange={(e) => setManualMove(Number(e.target.value) as GameMove)}
                  className="w-full px-4 py-2 bg-gray-600 rounded-lg text-white"
                >
                  <option value={GameMove.ROCK}>{MOVE_NAMES_SHORT[GameMove.ROCK]}</option>
                  <option value={GameMove.PAPER}>{MOVE_NAMES_SHORT[GameMove.PAPER]}</option>
                  <option value={GameMove.SCISSORS}>{MOVE_NAMES_SHORT[GameMove.SCISSORS]}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Secret String:</label>
                <input
                  type="text"
                  value={manualSecret}
                  onChange={(e) => setManualSecret(e.target.value)}
                  placeholder="Enter your secret..."
                  className="w-full px-4 py-2 bg-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>
            </div>

            <button
              onClick={handleReveal}
              disabled={isPending || isConfirming || !address || !manualSecret}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
            >
              {isConfirming ? 'Confirming...' : isPending ? 'Revealing...' : 'Reveal Move'}
            </button>
          </div>
        )}

        <div className="p-3 bg-purple-900/30 border border-purple-800 rounded-lg">
          <p className="text-sm text-purple-200">
            Once you reveal, the contract will verify your move matches your commitment.
            If both players have revealed, the winner will be determined automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

