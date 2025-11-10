import { useAccount } from 'wagmi';
import { useRPSGame } from '../hooks/useRPSGame';
import { getSecret } from '../utils/storage';
import { MOVE_NAMES_SHORT } from '../types/game';

interface RevealMoveProps {
  gameId: bigint;
  turn: bigint;
  onSuccess?: () => void;
}

export function RevealMove({ gameId, turn, onSuccess }: RevealMoveProps) {
  const { address } = useAccount();
  const { revealMove, isPending } = useRPSGame();
  const secretData = getSecret(gameId, turn);

  const handleReveal = async () => {
    try {
      await revealMove(gameId, turn);
      onSuccess?.();
    } catch (err: any) {
      console.error('Failed to reveal move:', err);
    }
  };

  if (!secretData) {
    return (
      <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-4">
        <p className="text-yellow-200">
          No secret found for this turn. You may have already revealed your move.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Reveal Your Move</h2>
      
      <div className="space-y-4">
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
          disabled={isPending || !address}
          className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
        >
          {isPending ? 'Revealing...' : 'Reveal Move'}
        </button>

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

