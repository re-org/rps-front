import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, localhost } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// You can configure your contract address here
export const CONTRACT_ADDRESS: `0x${string}` = '0x0000000000000000000000000000000000000000'; // Update with deployed address

// WalletConnect Project ID - Get one at https://cloud.walletconnect.com
// const projectId = 'YOUR_PROJECT_ID'; // Update with your WalletConnect project ID

export const config = createConfig({
  chains: [mainnet, sepolia, localhost],
  connectors: [
    injected(),
    // Uncomment when you have a WalletConnect project ID
    // walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [localhost.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

