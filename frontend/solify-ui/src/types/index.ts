import { PublicKey } from '@solana/web3.js';

// User Profile types
export interface UserProfile {
  authority: PublicKey;
  username: string;
  trackCount: number;
  bump: number;
}

// Track types
export interface Track {
  owner: PublicKey;
  uri: string;
  title: string;
  likeCount: number;
  index: number;
  bump: number;
}

// Playlist types
export interface Playlist {
  owner: PublicKey;
  name: string;
  trackCount: number;
  bump: number;
}

// PlaylistItem types
export interface PlaylistItem {
  playlist: PublicKey;
  idx: number;
  trackOwner: PublicKey;
  trackIndex: number;
  bump: number;
}

// Like types
export interface Like {
  bump: number;
}
