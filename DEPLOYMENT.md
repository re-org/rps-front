# Deployment Guide

## Prerequisites

1. Deploy the `RPSGameHub` contract to your desired network
2. Note the contract address
3. Have your code in a Git repository (GitHub, GitLab, etc.)

## Configuration

1. Update `src/config/web3.ts`:
   ```typescript
   export const CONTRACT_ADDRESS: `0x${string}` = '0xYourContractAddress';
   ```

2. Configure networks as needed in the same file (currently set to Polygon)

3. (Optional) For WalletConnect support:
   - Get a project ID from https://cloud.walletconnect.com
   - Uncomment and update the WalletConnect connector in `web3.ts`

## Build Locally

```bash
npm install
npm run build
```

The built files will be in the `dist/` directory.

Test the build locally:
```bash
npm run preview
```

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Via Web UI (Easiest):**
1. Go to https://vercel.com
2. Sign in with GitHub/GitLab/Bitbucket
3. Click "Add New Project"
4. Import your repository
5. Vercel will auto-detect Vite settings
6. Click "Deploy"
7. Done! Your app will be live at `https://your-project.vercel.app`

**Via CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# For production
vercel --prod
```

Configuration file: `vercel.json` (already created)

### Option 2: Netlify

**Via Web UI:**
1. Go to https://netlify.com
2. Sign in with GitHub/GitLab/Bitbucket
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Build settings (auto-detected from netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy"
7. Done! Your app will be live at `https://your-project.netlify.app`

**Via CLI:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize and link
netlify init

# Deploy to production
netlify deploy --prod
```

Configuration file: `netlify.toml` (already created)

### Option 3: GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Under "Build and deployment":
   - Source: GitHub Actions
4. The workflow file `.github/workflows/deploy.yml` is already set up
5. Push to main branch and GitHub Actions will auto-deploy
6. Your app will be live at `https://yourusername.github.io/repo-name`

**Note:** For GitHub Pages with a custom domain or subdirectory, you may need to update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/repo-name/', // if deployed to subdirectory
  plugins: [react()],
})
```

### Option 4: Manual Deployment (Any Static Host)

Build the app:
```bash
npm run build
```

Upload the contents of the `dist/` folder to any static hosting provider:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Cloudflare Pages
- Firebase Hosting

## Post-Deployment

1. **Test the deployment:**
   - Visit your deployed URL
   - Connect your wallet
   - Switch to the correct network (Polygon)
   - Verify the contract address is correct
   - Test creating and playing a game

2. **Update your DNS (optional):**
   - Add a custom domain in your hosting provider's settings
   - Update DNS records as instructed

3. **Monitor:**
   - Check browser console for errors
   - Verify contract interactions work correctly
   - Test on mobile devices

## Environment Variables

If you need to use environment variables (e.g., for different contract addresses per environment):

Create `.env` files:
```bash
VITE_CONTRACT_ADDRESS=0xYourAddress
VITE_NETWORK=polygon
```

Update `src/config/web3.ts`:
```typescript
export const CONTRACT_ADDRESS: `0x${string}` = 
  import.meta.env.VITE_CONTRACT_ADDRESS || '0xDefaultAddress';
```

Then set these in your hosting provider's dashboard:
- **Vercel:** Settings → Environment Variables
- **Netlify:** Site settings → Build & deploy → Environment
- **GitHub Pages:** Settings → Secrets and variables → Actions

## Testing Locally

1. Start a local Ethereum node (e.g., Hardhat, Anvil)
2. Deploy the contract to the local network
3. Update the contract address in `web3.ts`
4. Run the dev server:
   ```bash
   bun run dev
   ```

## Network Configuration

The app is configured to work with:
- Mainnet (Ethereum)
- Sepolia (Testnet)
- Localhost (Development)

Add more networks in `web3.ts` as needed.

## Important Notes

- Secrets are stored in localStorage - users must not clear browser data before revealing
- Each turn requires a new secret to be generated
- The commit-reveal scheme prevents front-running and cheating
- Gas fees apply for all transactions (createGame, play, revealMove, claimTimeout)

