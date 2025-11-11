# Project Description

**Deployed Frontend URL:** [Solify Music App](https://solify-ui.vercel.app) (Note: This is a placeholder URL, actual deployment will be done via Vercel)

**Solana Program ID:** Dqm43aWDpiFr7cEk37Xnud7NPPo18dCBCkfN4hLJWHnT

## Project Overview

### Description
Solify is a decentralized music platform built on the Solana blockchain. It allows artists to share their music tracks, create playlists, and engage with listeners through a simple, intuitive interface. The platform leverages Solana's fast and low-cost transactions to create a seamless experience for music sharing and discovery.

The core functionality revolves around users creating profiles, uploading track information (with links to audio files hosted elsewhere), creating playlists to organize tracks, and liking tracks to show appreciation for artists. All of this data is stored on-chain, making it transparent and immutable.

### Key Features

- **User Profiles**: Create a personalized profile to showcase your identity as an artist or listener
- **Track Management**: Add tracks with title and URI pointing to audio files
- **Playlist Creation**: Create custom playlists to organize tracks
- **Track Discovery**: Browse tracks added by other users
- **Like System**: Show appreciation for tracks by liking them (one like per wallet per track)
  
### How to Use the dApp

1. **Connect Wallet**
   - Click the "Connect Wallet" button in the top-right corner
   - Select your Solana wallet (Phantom, Solflare, etc.)

2. **Create Profile**
   - Navigate to the Profile page
   - Enter a username (max 32 characters)
   - Click "Create Profile"

3. **Add a Track**
   - Go to the "Add Track" page
   - Enter track title and URI (link to hosted audio file)
   - Click "Add Track"

4. **Create a Playlist**
   - Navigate to the "Playlists" page
   - Enter a playlist name
   - Click "Create Playlist"

5. **Add Tracks to Playlist**
   - Browse tracks and click "Add to Playlist"
   - Select the playlist you want to add the track to

6. **Like Tracks**
   - Browse tracks and click the "Like" button to show appreciation

## Program Architecture

Solify is built using the Anchor framework on Solana. The program uses PDAs (Program Derived Addresses) to store user profiles, tracks, playlists, and likes. The architecture follows a modular approach with clear separation of concerns between different account types and instructions.

### PDA Usage

**PDAs Used:**
- **User Profile PDA**: `["user", authority.key()]` - Stores user information and track count
- **Track PDA**: `["track", owner.key(), track_index.to_le_bytes()]` - Stores track information
- **Playlist PDA**: `["playlist", owner.key(), name.as_bytes()]` - Stores playlist information
- **Playlist Item PDA**: `["playlist_item", playlist.key(), index.to_le_bytes()]` - Links tracks to playlists
- **Like PDA**: `["like", track.key(), liker.key()]` - Records likes to prevent double-liking

This PDA structure ensures that each account has a unique address derived deterministically, and that ownership and permissions can be properly enforced.

### Program Instructions

**Instructions Implemented:**
- **init_user_profile(username)**: Creates a new user profile with the given username
- **add_track(uri, title)**: Adds a new track with the given URI and title
- **create_playlist(name)**: Creates a new playlist with the given name
- **add_track_to_playlist()**: Adds a track to a playlist
- **like_track()**: Likes a track and increments its like count

### Account Structure

```rust
#[account]
pub struct UserProfile {
    pub authority: Pubkey,     // The wallet that owns this profile
    pub username: String,      // Username (max 32 chars)
    pub bump: u8,              // PDA bump
    pub track_count: u64,      // Number of tracks added by this user
}

#[account]
pub struct Track {
    pub owner: Pubkey,         // The profile that owns this track
    pub uri: String,           // URI to the audio file (max 200 chars)
    pub title: String,         // Track title (max 64 chars)
    pub like_count: u64,       // Number of likes
    pub index: u64,            // Track index for this user
    pub bump: u8,              // PDA bump
}

#[account]
pub struct Playlist {
    pub owner: Pubkey,         // The profile that owns this playlist
    pub name: String,          // Playlist name (max 32 chars)
    pub track_count: u64,      // Number of tracks in this playlist
    pub bump: u8,              // PDA bump
}

#[account]
pub struct PlaylistItem {
    pub playlist: Pubkey,      // The playlist this item belongs to
    pub idx: u64,              // Index in the playlist
    pub track_owner: Pubkey,   // Owner of the track
    pub track_index: u64,      // Index of the track
    pub bump: u8,              // PDA bump
}

#[account]
pub struct Like {
    pub bump: u8,              // PDA bump
}
```

## Testing

### Test Coverage

The program includes comprehensive tests for all instructions, covering both happy and unhappy paths.

**Happy Path Tests:**
- **init_user_profile**: Successfully create a user profile
- **add_track**: Successfully add a track to a user's profile
- **create_playlist**: Successfully create a playlist
- **add_track_to_playlist**: Successfully add a track to a playlist
- **like_track**: Successfully like a track and increment its like count

**Unhappy Path Tests:**
- **init_user_profile**: Fail when username is too long
- **init_user_profile**: Fail when trying to initialize the same profile twice
- **add_track**: Fail when URI is too long
- **add_track**: Fail when title is too long
- **create_playlist**: Fail when name is too long
- **create_playlist**: Fail when creating a playlist with the same name
- **add_track_to_playlist**: Fail when non-owner tries to add to playlist
- **like_track**: Fail when trying to like the same track twice

### Running Tests
```bash
# Commands to run the tests
cd anchor_project/solify
anchor test
```

### Additional Notes for Evaluators

This project demonstrates the use of PDAs for data storage and access control on Solana. The program implements a simple yet functional music sharing platform with core features like user profiles, track management, playlists, and likes.

The frontend is built with Next.js, TypeScript, and TailwindCSS, providing a clean and responsive user interface for interacting with the Solana program.

To run the project locally:
1. Clone the repository
2. Build and deploy the Anchor program to Devnet
3. Update the Program ID in both the frontend and the Anchor program
4. Run the frontend with `npm run dev`

Note: The actual deployment URLs and Program ID will be updated once deployment is complete.