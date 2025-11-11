import { useAccount } from 'wagmi';
import { useGameDetails, usePlayerMove } from '../hooks/useRPSGame';
import { GameState, MoveState, MOVE_NAMES_SHORT, GameMove, MOVE_NAMES } from '../types/game';
import { PlayMove } from './PlayMove';
import { RevealMove } from './RevealMove';

interface GameViewProps {
  gameId: bigint;
}

export function GameView({ gameId }: GameViewProps) {
  const { address } = useAccount();
  const { player1, player2, gameState, refetchAll: refetchGameDetails } = useGameDetails(gameId);
  const { turn: myTurn, move: myMove, refetchAll: refetchMyMove } = usePlayerMove(gameId, address);
  
  // Determine opponent address
  const opponentAddress = address && player1 && player2
    ? (address.toLowerCase() === player1.toLowerCase() ? player2 : player1)
    : undefined;
  
  const { turn: opponentTurn, move: opponentMove, refetchAll: refetchOpponentMove } = usePlayerMove(gameId, opponentAddress);

  // Function to refresh all game data
  const refreshGameData = () => {
    refetchGameDetails();
    refetchMyMove();
    refetchOpponentMove();
  };

  if (!player1 || !player2) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
        <p>Loading game data...</p>
      </div>
    );
  }

  const isPlayer = address && (
    address.toLowerCase() === player1.toLowerCase() ||
    address.toLowerCase() === player2.toLowerCase()
  );

  if (!isPlayer) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Game #{gameId.toString()}</h2>
        <p className="text-yellow-500">You are not a player in this game.</p>
        <div className="mt-4 space-y-2">
          <div className="text-sm">
            <span className="text-gray-400">Player 1:</span>{' '}
            <span className="font-mono">{player1}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Player 2:</span>{' '}
            <span className="font-mono">{player2}</span>
          </div>
        </div>
      </div>
    );
  }

  const isFinished = gameState === GameState.FINISHED;
  const myMoveState = myMove?.state;
  const opponentMoveState = opponentMove?.state;

  // Determine winner if both moves are revealed
  const bothRevealed = myMoveState === MoveState.REVEALED && opponentMoveState === MoveState.REVEALED;
  let winner: 'you' | 'opponent' | 'draw' | null = null;
  
  if (bothRevealed && myMove && opponentMove) {
    const myRevealedMove = myMove.revealedMove;
    const opponentRevealedMove = opponentMove.revealedMove;
    
    if (myRevealedMove === opponentRevealedMove) {
      winner = 'draw';
    } else if (
      (myRevealedMove === GameMove.ROCK && opponentRevealedMove === GameMove.SCISSORS) ||
      (myRevealedMove === GameMove.PAPER && opponentRevealedMove === GameMove.ROCK) ||
      (myRevealedMove === GameMove.SCISSORS && opponentRevealedMove === GameMove.PAPER)
    ) {
      winner = 'you';
    } else {
      winner = 'opponent';
    }
  }

  return (
    <div className="space-y-6">
      {/* Game Info */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Game #{gameId.toString()}</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-blue-400">You</h3>
            <div className="text-sm">
              <span className="text-gray-400">Address:</span>{' '}
              <span className="font-mono text-xs">{address?.slice(0, 10)}...{address?.slice(-8)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Turn:</span>{' '}
              <span className="font-semibold">{myTurn?.toString() ?? '0'}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Status:</span>{' '}
              <span className={`font-semibold ${
                myMoveState === MoveState.REVEALED ? 'text-green-400' :
                myMoveState === MoveState.MOVED ? 'text-yellow-400' :
                'text-gray-400'
              }`}>
                {myMoveState === MoveState.REVEALED ? '✓ Revealed' :
                 myMoveState === MoveState.MOVED ? '⏳ Committed' :
                 '⚪ Waiting'}
              </span>
            </div>
            {myMoveState === MoveState.REVEALED && myMove && (
              <div className="text-sm">
                <span className="text-gray-400">Move:</span>{' '}
                <span className="font-semibold">{MOVE_NAMES_SHORT[myMove.revealedMove]}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">Opponent</h3>
            <div className="text-sm">
              <span className="text-gray-400">Address:</span>{' '}
              <span className="font-mono text-xs">{opponentAddress?.slice(0, 10)}...{opponentAddress?.slice(-8)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Turn:</span>{' '}
              <span className="font-semibold">{opponentTurn?.toString() ?? '0'}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Status:</span>{' '}
              <span className={`font-semibold ${
                opponentMoveState === MoveState.REVEALED ? 'text-green-400' :
                opponentMoveState === MoveState.MOVED ? 'text-yellow-400' :
                'text-gray-400'
              }`}>
                {opponentMoveState === MoveState.REVEALED ? '✓ Revealed' :
                 opponentMoveState === MoveState.MOVED ? '⏳ Committed' :
                 '⚪ Waiting'}
              </span>
            </div>
            {opponentMoveState === MoveState.REVEALED && opponentMove && (
              <div className="text-sm">
                <span className="text-gray-400">Move:</span>{' '}
                <span className="font-semibold">{MOVE_NAMES_SHORT[opponentMove.revealedMove]}</span>
              </div>
            )}
          </div>
        </div>

        {isFinished && bothRevealed && winner && (
          <div className={`mt-4 p-4 rounded-lg border ${
            winner === 'draw' 
              ? 'bg-gray-700/50 border-gray-500' 
              : winner === 'you'
              ? 'bg-green-900/30 border-green-600'
              : 'bg-red-900/30 border-red-600'
          }`}>
            <div className="text-center">
              <div className="text-3xl mb-2">
                {winner === 'draw' ? '🤝' : winner === 'you' ? '🎉' : '😔'}
              </div>
              <p className={`text-xl font-bold mb-2 ${
                winner === 'draw' 
                  ? 'text-gray-200' 
                  : winner === 'you'
                  ? 'text-green-300'
                  : 'text-red-300'
              }`}>
                {winner === 'draw' ? "It's a Draw!" : winner === 'you' ? 'You Won!' : 'You Lost!'}
              </p>
              <div className="flex items-center justify-center gap-3 text-lg">
                <span className={winner === 'you' ? 'text-green-400 font-bold' : 'text-gray-300'}>
                  {MOVE_NAMES[myMove!.revealedMove]}
                </span>
                <span className="text-gray-500">vs</span>
                <span className={winner === 'opponent' ? 'text-red-400 font-bold' : 'text-gray-300'}>
                  {MOVE_NAMES[opponentMove!.revealedMove]}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {isFinished && !bothRevealed && (
          <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-800 rounded-lg">
            <p className="text-yellow-200 font-semibold">⏳ Game Finished - Waiting for all reveals</p>
          </div>
        )}
      </div>

      {/* Action Panel */}
      {!isFinished && (
        <div>
          {myMoveState === MoveState.EMPTY && (
            <PlayMove gameId={gameId} onSuccess={refreshGameData} />
          )}
          
          {myMoveState === MoveState.MOVED && (opponentMoveState === MoveState.MOVED || opponentMoveState === MoveState.REVEALED) && myTurn !== undefined && (
            <RevealMove gameId={gameId} turn={myTurn} onSuccess={refreshGameData} />
          )}
          
          {myMoveState === MoveState.MOVED && opponentMoveState === MoveState.EMPTY && (
            <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4">
              <p className="text-blue-200">
                ⏳ Waiting for opponent to commit their move...
              </p>
            </div>
          )}
          
          {myMoveState === MoveState.REVEALED && opponentMoveState !== MoveState.REVEALED && (
            <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4">
              <p className="text-blue-200">
                ⏳ Waiting for opponent to reveal their move...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

