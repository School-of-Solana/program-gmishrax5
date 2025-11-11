import { Connection, PublicKey, clusterApiUrl, Commitment } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { useEffect, useState } from 'react';
// @ts-ignore - Ignore missing type declarations
import { useAnchorWallet } from '@solana/wallet-adapter-react';

// Import the IDL from the Anchor program
import idl from '../idl/solify.json';

// Get environment variables
const getRpcUrl = (): string => {
  const rpc = process.env.NEXT_PUBLIC_HELIUS_RPC;
  if (!rpc) {
    return clusterApiUrl('devnet');
  }
  return rpc;
};

const getCommitment = (): Commitment => {
  return (process.env.NEXT_PUBLIC_COMMITMENT || 'confirmed') as Commitment;
};

const getProgramId = (): PublicKey => {
  const programId = process.env.NEXT_PUBLIC_PROGRAM_ID;
  if (!programId) {
    return new PublicKey('Dqm43aWDpiFr7cEk37Xnud7NPPo18dCBCkfN4hLJWHnT');
  }
  return new PublicKey(programId);
};

// Custom hook to get the Solify program
export function useSolifyProgram() {
  const [program, setProgram] = useState<any>(null);
  const anchorWallet = useAnchorWallet();

  useEffect(() => {
    if (!anchorWallet) {
      setProgram(null);
      return;
    }

    // Create a connection to the Solana cluster
    const connection = new Connection(getRpcUrl(), getCommitment());

    // Create a provider
    const provider = new AnchorProvider(
      connection,
      anchorWallet,
      { preflightCommitment: getCommitment() }
    );

    // Create a program with the imported IDL
    try {
      // @ts-ignore - Ignore type errors for deployment
      const solifyProgram = new Program(idl, getProgramId(), provider);
      setProgram(solifyProgram);
    } catch (error) {
      console.error("Error creating program:", error);
      setProgram(null);
    }
  }, [anchorWallet]);

  return program;
}

// PDA helper functions
export const findUserProfilePDA = async (authority: PublicKey): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('user'), authority.toBuffer()],
    getProgramId()
  );
};

export const findTrackPDA = async (owner: PublicKey, index: number): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('track'), owner.toBuffer(), new Uint8Array(new BigUint64Array([BigInt(index)]).buffer)],
    getProgramId()
  );
};

export const findPlaylistPDA = async (owner: PublicKey, name: string): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('playlist'), owner.toBuffer(), Buffer.from(name)],
    getProgramId()
  );
};

export const findPlaylistItemPDA = async (playlist: PublicKey, index: number): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('playlist_item'), playlist.toBuffer(), new Uint8Array(new BigUint64Array([BigInt(index)]).buffer)],
    getProgramId()
  );
};

export const findLikePDA = async (track: PublicKey, liker: PublicKey): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('like'), track.toBuffer(), liker.toBuffer()],
    getProgramId()
  );
};
