# 🎵 Solify - Decentralized Music on Solana

![Solify Banner](https://i.imgur.com/placeholder.png)

Solify is a revolutionary decentralized music platform built on Solana blockchain using the Anchor framework. It reimagines how artists and listeners interact by removing intermediaries and creating a transparent, efficient ecosystem for music sharing and discovery.

## ✨ Key Features

- **👤 User Profiles**: Create personalized profiles with unique usernames
- **🎵 Track Management**: Share music with customizable URIs and titles
- **📋 Playlist Creation**: Curate collections of tracks for different moods and theme
- **❤️ Like System**: Show appreciation for tracks and boost visibility
- **⚡ Efficient Storage**: Optimized on-chain data structures using PDAs
- **🔒 Secure Ownership**: Strong validation ensures only owners can modify their content

## Program Architecture

### PDAs

- **User Profile**: `["user", authority.key()]`
- **Track**: `["track", owner.key(), track_index.to_le_bytes()]`
- **Playlist**: `["playlist", owner.key(), name.as_bytes()]`
- **Playlist Item**: `["playlist_item", playlist.key(), index.to_le_bytes()]`
- **Like**: `["like", track.key(), liker.key()]`

### Instructions

- `init_user_profile(username)`: Creates a new user profile
- `add_track(uri, title)`: Adds a new track
- `create_playlist(name)`: Creates a new playlist
- `add_track_to_playlist()`: Adds a track to a playlist
- `like_track()`: Likes a track

## Building and Deploying

1. Build the program:
   ```bash
   anchor build
   ```

2. Get the program ID:
   ```bash
   anchor keys list
   ```

3. Update the program ID in:
   - `programs/solify/src/lib.rs`
   - `Anchor.toml`

4. Deploy to Devnet:
   ```bash
   anchor deploy
   ```

5. Run tests:
   ```bash
   anchor test
   ```

## 📚 Technical Deep Dive

### Account Structure

- **UserProfile**: Stores username, authority, and track count
- **Track**: Contains URI, title, owner, and like count
- **Playlist**: Holds name, owner, and track count
- **PlaylistItem**: Links tracks to playlists with references
- **Like**: Represents a user's appreciation for a track

### Security Considerations

- **Ownership Validation**: All modifications require proper authority
- **Input Validation**: String length checks prevent overflow attacks
- **PDA Derivation**: Secure seed patterns prevent address collisions
- **Error Handling**: Comprehensive error types for graceful failure

### Performance Optimizations

- **Minimal Storage**: Only essential data stored on-chain
- **Efficient Lookups**: Carefully designed PDA seeds for quick retrieval
- **Pagination Support**: Track and playlist counts enable efficient pagination

## 💻 Development

This project showcases modern Solana development practices using the Anchor framework. It demonstrates effective use of PDAs, account validation, and secure ownership patterns.

Developed with ❤️ for the School of Solana course.
