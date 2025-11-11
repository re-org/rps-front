import { useAccount, useSwitchChain } from 'wagmi';
import { polygon } from 'wagmi/chains';

export function NetworkSwitcher() {
  const { chain } = useAccount();
  const { chains, switchChain, isPending } = useSwitchChain();

  const isOnPolygon = chain?.id === polygon.id;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm">
        <span className="text-gray-400">Network:</span>{' '}
        <span className={`font-semibold ${isOnPolygon ? 'text-green-400' : 'text-yellow-400'}`}>
          {chain?.name ?? 'Unknown'}
        </span>
      </div>
      
      {!isOnPolygon && (
        <div className="flex flex-col gap-2">
          <div className="text-xs text-yellow-300 bg-yellow-900/30 border border-yellow-800 rounded px-2 py-1">
            ⚠️ Contract is on Polygon
          </div>
          <button
            onClick={() => switchChain({ chainId: polygon.id })}
            disabled={isPending}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium"
          >
            {isPending ? 'Switching...' : 'Switch to Polygon'}
          </button>
        </div>
      )}

      {/* Optional: Show all available networks */}
      {chain && (
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-400 hover:text-gray-300">
            All Networks
          </summary>
          <div className="mt-2 space-y-1">
            {chains.map((c) => (
              <button
                key={c.id}
                onClick={() => switchChain({ chainId: c.id })}
                disabled={c.id === chain?.id || isPending}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  c.id === chain?.id
                    ? 'bg-green-900/30 text-green-400 cursor-default'
                    : 'bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {c.name} {c.id === chain?.id && '✓'}
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

