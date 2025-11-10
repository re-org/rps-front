import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRPSGame } from '../hooks/useRPSGame';
import { isAddress } from 'viem';

export function CreateGame() {
  const { address } = useAccount();
  const { createGame, isPending } = useRPSGame();
  const [player2Address, setPlayer2Address] = useState('');
  const [error, setError] = useState('');

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    if (!player2Address || !isAddress(player2Address)) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    if (player2Address.toLowerCase() === address.toLowerCase()) {
      setError('You cannot play against yourself');
      return;
    }

    try {
      await createGame(address, player2Address as `0x${string}`);
      setPlayer2Address('');
    } catch (err: any) {
      setError(err.message || 'Failed to create game');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Create New Game</h2>
      <form onSubmit={handleCreateGame} className="space-y-4">
        <div>
          <label htmlFor="player2" className="block text-sm font-medium mb-2">
            Opponent Address
          </label>
          <input
            id="player2"
            type="text"
            value={player2Address}
            onChange={(e) => setPlayer2Address(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isPending}
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <button
          type="submit"
          disabled={isPending || !address}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
        >
          {isPending ? 'Creating...' : 'Create Game'}
        </button>
      </form>
    </div>
  );
}

