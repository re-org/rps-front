import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, localhost, polygon } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Contract is deployed on Polygon network
export const CONTRACT_ADDRESS: `0x${string}` = '0xb439EE42954Da799bC835B7c9f117aea68C03F90';

// WalletConnect Project ID - Get one at https://cloud.walletconnect.com
// const projectId = 'YOUR_PROJECT_ID'; // Update with your WalletConnect project ID

export const config = createConfig({
  chains: [polygon, mainnet, sepolia, localhost],
  connectors: [
    injected(),
    // Uncomment when you have a WalletConnect project ID
    // walletConnect({ projectId }),
  ],
  transports: {
    [polygon.id]: http(),
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

