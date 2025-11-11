import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { expect } from "chai";
import { Solify } from "../target/types/solify";

// This will be replaced with the actual program ID after deployment
const PROGRAM_ID = new PublicKey("Dqm43aWDpiFr7cEk37Xnud7NPPo18dCBCkfN4hLJWHnT");

describe("solify", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Get program from the workspace
  const program = anchor.workspace.Solify as Program<Solify>;
  const wallet = provider.wallet;

  // Test data
  const testUsername = "testuser";
  const testTrackUri = "https://example.com/track.mp3";
  const testTrackTitle = "Test Track";
  const testPlaylistName = "My Playlist";

  // Store PDAs for later use
  let userProfilePda: PublicKey;
  let trackPda: PublicKey;
  let playlistPda: PublicKey;
  let playlistItemPda: PublicKey;
  let likePda: PublicKey;
  let trackIndex = 0;

  // Create a second wallet for testing permissions
  const secondUser = Keypair.generate();

  before(async () => {
    // Fund the second user wallet for testing
    const airdropSignature = await provider.connection.requestAirdrop(
      secondUser.publicKey,
      1 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSignature);
  });

  describe("init_user_profile", () => {
    it("happy path: should initialize a user profile", async () => {
      // Find the PDA for the user profile
      const [userPda, _] = PublicKey.findProgramAddressSync(
        [Buffer.from("user"), wallet.publicKey.toBuffer()],
        program.programId
      );
      userProfilePda = userPda;

      // Call the init_user_profile instruction
      await program.methods
        .initUserProfile(testUsername)
        .accounts({
          authority: wallet.publicKey,
          userProfile: userPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // Fetch the user profile account and verify its data
      const userProfile = await program.account.userProfile.fetch(userPda);
      expect(userProfile.authority.toString()).to.equal(wallet.publicKey.toString());
      expect(userProfile.username).to.equal(testUsername);
      expect(userProfile.trackCount.toNumber()).to.equal(0);
    });

    it("unhappy path: should fail when username is too long", async () => {
      // Find the PDA for another user profile
      const [userPda, _] = PublicKey.findProgramAddressSync(
        [Buffer.from("user"), secondUser.publicKey.toBuffer()],
        program.programId
      );

      // Create a username that exceeds the maximum length
      const longUsername = "x".repeat(33); // MAX_USERNAME_LEN is 32

      try {
        // Try to call the init_user_profile instruction with a too-long username
        await program.methods
          .initUserProfile(longUsername)
          .accounts({
            authority: secondUser.publicKey,
            userProfile: userPda,
            systemProgram: SystemProgram.programId,
          })
          .signers([secondUser])
          .rpc();
        // If we reach here, the test should fail
        expect.fail("Expected error but instruction succeeded");
      } catch (error: any) {
        // Verify that the error is the expected one
        expect(error.toString()).to.include("NameTooLong");
      }
    });

    it("unhappy path: should fail when initializing the same profile twice", async () => {
      try {
        // Try to initialize the same user profile again
        await program.methods
          .initUserProfile(testUsername)
          .accounts({
            authority: wallet.publicKey,
            userProfile: userProfilePda,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        // If we reach here, the test should fail
        expect.fail("Expected error but instruction succeeded");
      } catch (error: any) {
        // This should fail with an account already initialized error
        expect(error.toString()).to.include("already in use");
      }
    });
  });

  describe("add_track", () => {
    it("happy path: should add a track", async () => {
      // Find the PDA for the track
      const [trackPdaAddress, _] = PublicKey.findProgramAddressSync(
        [Buffer.from("track"), wallet.publicKey.toBuffer(), new Uint8Array(new BigUint64Array([BigInt(trackIndex)]).buffer)],
        program.programId
      );
      trackPda = trackPdaAddress;

      // Call the add_track instruction
      await program.methods
        .addTrack(testTrackUri, testTrackTitle)
        .accounts({
          authority: wallet.publicKey,
          userProfile: userProfilePda,
          track: trackPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // Fetch the track account and verify its data
      const track = await program.account.track.fetch(trackPda);
      expect(track.owner.toString()).to.equal(wallet.publicKey.toString());
      expect(track.uri).to.equal(testTrackUri);
      expect(track.title).to.equal(testTrackTitle);
      expect(track.likeCount.toNumber()).to.equal(0);
      expect(track.index.toNumber()).to.equal(trackIndex);

      // Verify that the user profile track count was incremented
      const userProfile = await program.account.userProfile.fetch(userProfilePda);
      expect(userProfile.trackCount.toNumber()).to.equal(1);
    });

    it("unhappy path: should fail when URI is too long", async () => {
      // Create a URI that exceeds the maximum length
      const longUri = "https://" + "x".repeat(200); // MAX_URI_LEN is 200

      try {
        // Try to call the add_track instruction with a too-long URI
        await program.methods
          .addTrack(longUri, "Test Track")
          .accounts({
            authority: wallet.publicKey,
            userProfile: userProfilePda,
            track: trackPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        // If we reach here, the test should fail
        expect.fail("Expected error but instruction succeeded");
      } catch (error: any) {
        // Verify that the error is the expected one
        expect(error.toString()).to.include("UriTooLong");
      }
    });

    it("unhappy path: should fail when title is too long", async () => {
      // Create a title that exceeds the maximum length
      const longTitle = "x".repeat(65); // MAX_TITLE_LEN is 64

      try {
        // Try to call the add_track instruction with a too-long title
        await program.methods
          .addTrack(testTrackUri, longTitle)
          .accounts({
            authority: wallet.publicKey,
            userProfile: userProfilePda,
            track: trackPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        // If we reach here, the test should fail
        expect.fail("Expected error but instruction succeeded");
      } catch (error: any) {
        // Verify that the error is the expected one
        expect(error.toString()).to.include("TitleTooLong");
      }
    });
  });

  describe("create_playlist", () => {
    it("happy path: should create a playlist", async () => {
      // Find the PDA for the playlist
      const [playlistPdaAddress, _] = PublicKey.findProgramAddressSync(
        [Buffer.from("playlist"), wallet.publicKey.toBuffer(), Buffer.from(testPlaylistName)],
        program.programId
      );
      playlistPda = playlistPdaAddress;

      // Call the create_playlist instruction
      await program.methods
        .createPlaylist(testPlaylistName)
        .accounts({
          authority: wallet.publicKey,
          playlist: playlistPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // Fetch the playlist account and verify its data
      const playlist = await program.account.playlist.fetch(playlistPda);
      expect(playlist.owner.toString()).to.equal(wallet.publicKey.toString());
      expect(playlist.name).to.equal(testPlaylistName);
      expect(playlist.trackCount.toNumber()).to.equal(0);
    });

    it("unhappy path: should fail when name is too long", async () => {
      // Create a name that exceeds the maximum length
      const longName = "x".repeat(33); // MAX_PLAYLIST_NAME_LEN is 32

      // Find the PDA for the playlist with a long name
      const [longPlaylistPda, _] = PublicKey.findProgramAddressSync(
        [Buffer.from("playlist"), wallet.publicKey.toBuffer(), Buffer.from(longName)],
        program.programId
      );

      try {
        // Try to call the create_playlist instruction with a too-long name
        await program.methods
          .createPlaylist(longName)
          .accounts({
            authority: wallet.publicKey,
            playlist: longPlaylistPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        // If we reach here, the test should fail
        expect.fail("Expected error but instruction succeeded");
      } catch (error: any) {
        // Verify that the error is the expected one
        expect(error.toString()).to.include("NameTooLong");
      }
    });

    it("unhappy path: should fail when creating a playlist with the same name", async () => {
      try {
        // Try to create a playlist with the same name
        await program.methods
          .createPlaylist(testPlaylistName)
          .accounts({
            authority: wallet.publicKey,
            playlist: playlistPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        // If we reach here, the test should fail
        expect.fail("Expected error but instruction succeeded");
      } catch (error: any) {
        // This should fail with an account already initialized error
        expect(error.toString()).to.include("already in use");
      }
    });
  });

  describe("add_track_to_playlist", () => {
    it("happy path: should add a track to a playlist", async () => {
      // Find the PDA for the playlist item
      const [playlistItemPdaAddress, _] = PublicKey.findProgramAddressSync(
        [Buffer.from("playlist_item"), playlistPda.toBuffer(), new Uint8Array(new BigUint64Array([BigInt(0)]).buffer)],
        program.programId
      );
      playlistItemPda = playlistItemPdaAddress;

      // Call the add_track_to_playlist instruction
      await program.methods
        .addTrackToPlaylist()
        .accounts({
          authority: wallet.publicKey,
          playlist: playlistPda,
          track: trackPda,
          playlistItem: playlistItemPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // Fetch the playlist item account and verify its data
      const playlistItem = await program.account.playlistItem.fetch(playlistItemPda);
      expect(playlistItem.playlist.toString()).to.equal(playlistPda.toString());
      expect(playlistItem.trackOwner.toString()).to.equal(wallet.publicKey.toString());
      expect(playlistItem.trackIndex.toNumber()).to.equal(trackIndex);
      expect(playlistItem.idx.toNumber()).to.equal(0);

      // Verify that the playlist track count was incremented
      const playlist = await program.account.playlist.fetch(playlistPda);
      expect(playlist.trackCount.toNumber()).to.equal(1);
    });

    it("unhappy path: should fail when non-owner tries to add to playlist", async () => {
      // Find the PDA for a new playlist item
      const [newPlaylistItemPda, _] = PublicKey.findProgramAddressSync(
        [Buffer.from("playlist_item"), playlistPda.toBuffer(), new Uint8Array(new BigUint64Array([BigInt(1)]).buffer)],
        program.programId
      );

      try {
        // Try to call the add_track_to_playlist instruction as non-owner
        await program.methods
          .addTrackToPlaylist()
          .accounts({
            authority: secondUser.publicKey,
            playlist: playlistPda,
            track: trackPda,
            playlistItem: newPlaylistItemPda,
            systemProgram: SystemProgram.programId,
          })
          .signers([secondUser])
          .rpc();
        // If we reach here, the test should fail
        expect.fail("Expected error but instruction succeeded");
      } catch (error: any) {
        // Verify that the error is the expected one
        expect(error.toString()).to.include("NotPlaylistOwner");
      }
    });
  });

  describe("like_track", () => {
    it("happy path: should like a track", async () => {
      // Find the PDA for the like
      const [likePdaAddress, _] = PublicKey.findProgramAddressSync(
        [Buffer.from("like"), trackPda.toBuffer(), secondUser.publicKey.toBuffer()],
        program.programId
      );
      likePda = likePdaAddress;

      // Get the initial like count
      const trackBefore = await program.account.track.fetch(trackPda);
      const initialLikeCount = trackBefore.likeCount.toNumber();

      // Call the like_track instruction
      await program.methods
        .likeTrack()
        .accounts({
          liker: secondUser.publicKey,
          track: trackPda,
          like: likePda,
          systemProgram: SystemProgram.programId,
        })
        .signers([secondUser])
        .rpc();

      // Fetch the track account and verify its data
      const trackAfter = await program.account.track.fetch(trackPda);
      expect(trackAfter.likeCount.toNumber()).to.equal(initialLikeCount + 1);

      // Verify that the like account was created
      const like = await program.account.like.fetch(likePda);
      expect(like).to.not.be.null;
    });

    it("unhappy path: should fail when liking the same track twice", async () => {
      try {
        // Try to like the same track again
        await program.methods
          .likeTrack()
          .accounts({
            liker: secondUser.publicKey,
            track: trackPda,
            like: likePda,
            systemProgram: SystemProgram.programId,
          })
          .signers([secondUser])
          .rpc();
        // If we reach here, the test should fail
        expect.fail("Expected error but instruction succeeded");
      } catch (error: any) {
        // This should fail with an account already initialized error
        expect(error.toString()).to.include("already in use");
      }
    });
  });
});

