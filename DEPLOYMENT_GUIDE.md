# Solify Deployment Guide

This guide provides step-by-step instructions for deploying both the Solana program and the frontend application.

## 1. Deploy the Solana Program

### Using Solana Playground

1. Go to [Solana Playground](https://beta.solpg.io/)
2. Create a new Anchor project
3. Copy the entire content of `anchor_project/solify/programs/solify/src/lib.rs` into the editor
4. Build the program by clicking the "Build" button
5. Deploy to Devnet by clicking the "Deploy" button
6. Note the Program ID (should be `Dqm43aWDpiFr7cEk37Xnud7NPPo18dCBCkfN4hLJWHnT`)

## 2. Deploy the Frontend

### Option 1: Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   cd frontend/solify-ui
   vercel
   ```

4. Follow the prompts to complete the deployment
   - Select your Vercel scope
   - Confirm the project settings
   - Set environment variables:
     - NEXT_PUBLIC_HELIUS_RPC=https://api.devnet.solana.com
     - NEXT_PUBLIC_PROGRAM_ID=Dqm43aWDpiFr7cEk37Xnud7NPPo18dCBCkfN4hLJWHnT
     - NEXT_PUBLIC_COMMITMENT=confirmed

### Option 2: Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Deploy the project:
   ```bash
   cd frontend/solify-ui
   netlify deploy
   ```

4. Follow the prompts to complete the deployment
   - Link to an existing site or create a new one
   - Specify the build command: `npm run build`
   - Specify the publish directory: `.next`

### Option 3: Manual Deployment

1. Build the project:
   ```bash
   cd frontend/solify-ui
   npm run build
   ```

2. Upload the `.next` directory to your preferred hosting provider
   - Make sure to set the environment variables:
     - NEXT_PUBLIC_HELIUS_RPC=https://api.devnet.solana.com
     - NEXT_PUBLIC_PROGRAM_ID=Dqm43aWDpiFr7cEk37Xnud7NPPo18dCBCkfN4hLJWHnT
     - NEXT_PUBLIC_COMMITMENT=confirmed

## 3. Update PROJECT_DESCRIPTION.md

After deployment, update the `PROJECT_DESCRIPTION.md` file with:
- The deployed frontend URL
- The Solana Program ID
- Any other relevant information about your deployment

## 4. Testing the Deployment

1. Visit your deployed frontend URL
2. Connect your Solana wallet (make sure it's set to Devnet)
3. Create a user profile
4. Add tracks, create playlists, and test all functionality
5. Verify that transactions are properly signed and confirmed on the Solana blockchain

## Troubleshooting

- If you encounter hydration errors, make sure the wallet components are properly using dynamic imports with `ssr: false`
- If transactions fail, check that your wallet is connected to Devnet and has sufficient SOL
- For RPC errors, consider using a dedicated RPC provider like Helius or QuickNode instead of the public Devnet endpoint
