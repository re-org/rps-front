import { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/web3';
import { WalletConnect } from './components/WalletConnect';
import { CreateGame } from './components/CreateGame';
import { GameView } from './components/GameView';
import { useRPSGame } from './hooks/useRPSGame';

const queryClient = new QueryClient();

function AppContent() {
  const [selectedGameId, setSelectedGameId] = useState<bigint | null>(null);
  const { gamesCount } = useRPSGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">🪨📄✂️ RPS Game Hub</h1>
              <p className="text-gray-400">
                Rock-Paper-Scissors on the blockchain with commit-reveal
              </p>
            </div>
            <WalletConnect />
          </div>
        </header>

        {/* Stats */}
        <div className="mb-8 bg-gray-800 rounded-lg p-4 shadow-xl">
          <div className="text-sm text-gray-400">Total Games Created</div>
          <div className="text-3xl font-bold">{gamesCount?.toString() ?? '0'}</div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Game Creation and List */}
          <div className="space-y-6">
            <CreateGame />
            
            {/* Game List */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-4">Select Game</h2>
              {gamesCount && gamesCount > 0n ? (
                <div className="space-y-2">
                  {Array.from({ length: Number(gamesCount) }, (_, i) => BigInt(i)).reverse().map((id) => (
                    <button
                      key={id.toString()}
                      onClick={() => setSelectedGameId(id)}
                      className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                        selectedGameId === id
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      Game #{id.toString()}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No games created yet</p>
              )}
            </div>
          </div>

          {/* Right Panel - Game View */}
          <div className="lg:col-span-2">
            {selectedGameId !== null ? (
              <GameView gameId={selectedGameId} />
            ) : (
              <div className="bg-gray-800 rounded-lg p-12 shadow-xl text-center">
                <div className="text-6xl mb-4">🎮</div>
                <h2 className="text-2xl font-bold mb-2">No Game Selected</h2>
                <p className="text-gray-400">
                  Create a new game or select an existing one from the list
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4">How to Play</h2>
          <ol className="space-y-2 text-sm text-gray-300">
            <li><strong>1. Connect Wallet:</strong> Connect your Web3 wallet to get started</li>
            <li><strong>2. Create Game:</strong> Create a new game by entering your opponent's address</li>
            <li><strong>3. Commit Move:</strong> Choose your move (Rock, Paper, or Scissors) and enter a secret string. Your move will be encrypted and stored on-chain.</li>
            <li><strong>4. Wait for Opponent:</strong> Wait for your opponent to commit their move</li>
            <li><strong>5. Reveal:</strong> Once both players have committed, reveal your move using your stored secret</li>
            <li><strong>6. Winner:</strong> After both players reveal, the smart contract determines the winner automatically!</li>
          </ol>
          <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-200">
              <strong>Important:</strong> Your secret is stored locally in your browser. 
              Don't clear your browser data before revealing, or you won't be able to prove your move!
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Built with React, Wagmi, and Viem • Powered by Smart Contracts</p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

