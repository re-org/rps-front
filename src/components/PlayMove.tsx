import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRPSGame } from '../hooks/useRPSGame';
import { GameMove, MOVE_NAMES } from '../types/game';
import { generateRandomSecret, validateSecret } from '../utils/crypto';

interface PlayMoveProps {
  gameId: bigint;
  onSuccess?: () => void;
}

export function PlayMove({ gameId, onSuccess }: PlayMoveProps) {
  const { address } = useAccount();
  const { playMove, isPending, isConfirming, isConfirmed } = useRPSGame();
  const [selectedMove, setSelectedMove] = useState<GameMove | null>(null);
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [showSecretInput, setShowSecretInput] = useState(false);

  // Call onSuccess when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      setSelectedMove(null);
      setSecret('');
      setShowSecretInput(false);
      onSuccess?.();
    }
  }, [isConfirmed, onSuccess]);

  const handleGenerateSecret = () => {
    const newSecret = generateRandomSecret();
    setSecret(newSecret);
    setShowSecretInput(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!address) {
      setError('Please connect your wallet');
      return;
    }

    if (selectedMove === null) {
      setError('Please select a move');
      return;
    }

    if (!secret || !validateSecret(secret)) {
      setError('Secret must be at least 6 characters long');
      return;
    }

    try {
      await playMove(gameId, selectedMove, secret);
      // Reset will happen in useEffect when isConfirmed is true
    } catch (err: any) {
      setError(err.message || 'Failed to play move');
    }
  };

  const moves: GameMove[] = [GameMove.ROCK, GameMove.PAPER, GameMove.SCISSORS];

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Play Your Move</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3">
            Choose your move:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {moves.map((move) => (
              <button
                key={move}
                type="button"
                onClick={() => setSelectedMove(move)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMove === move
                    ? 'border-blue-500 bg-blue-900/50'
                    : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                }`}
              >
                <div className="text-3xl mb-2">{MOVE_NAMES[move].split(' ')[0]}</div>
                <div className="text-sm">{MOVE_NAMES[move].split(' ')[1]}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="secret" className="block text-sm font-medium mb-2">
            Secret String (min 6 characters)
          </label>
          <div className="flex gap-2">
            <input
              id="secret"
              type={showSecretInput ? 'text' : 'password'}
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter your secret..."
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={handleGenerateSecret}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors"
              disabled={isPending}
            >
              Generate
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            This secret will be stored locally and used when revealing your move.
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={isPending || isConfirming || !address || selectedMove === null || !secret}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
        >
          {isConfirming ? 'Confirming...' : isPending ? 'Committing Move...' : 'Commit Move'}
        </button>
      </form>

      <div className="mt-4 p-3 bg-blue-900/30 border border-blue-800 rounded-lg">
        <p className="text-sm text-blue-200">
          <strong>How it works:</strong> Your move will be encrypted and committed to the blockchain. 
          After your opponent commits their move, both players must reveal to determine the winner.
        </p>
      </div>
    </div>
  );
}

