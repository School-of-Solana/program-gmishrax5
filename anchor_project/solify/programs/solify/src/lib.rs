use anchor_lang::prelude::*;

#[constant]
pub const MAX_USERNAME_LEN: usize = 32; // bytes
#[constant]
pub const MAX_URI_LEN: usize = 200; // bytes
#[constant]
pub const MAX_TITLE_LEN: usize = 64; // bytes
#[constant]
pub const MAX_PLAYLIST_NAME_LEN: usize = 32; // bytes

declare_id!("Dqm43aWDpiFr7cEk37Xnud7NPPo18dCBCkfN4hLJWHnT");

#[program]
pub mod solify {
    use super::*;

    pub fn init_user_profile(ctx: Context<InitUserProfile>, username: String) -> Result<()> {
        require!(username.as_bytes().len() <= MAX_USERNAME_LEN, SolifyError::NameTooLong);
        let profile = &mut ctx.accounts.user_profile;
        profile.authority = ctx.accounts.authority.key();
        profile.username = username;
        profile.bump = *ctx.bumps.get("user_profile").unwrap();
        profile.track_count = 0;
        Ok(())
    }

    pub fn add_track(ctx: Context<AddTrack>, uri: String, title: String) -> Result<()> {
        require!(uri.as_bytes().len() <= MAX_URI_LEN, SolifyError::UriTooLong);
        require!(title.as_bytes().len() <= MAX_TITLE_LEN, SolifyError::TitleTooLong);
        let profile = &mut ctx.accounts.user_profile;
        let track = &mut ctx.accounts.track;
        let index = profile.track_count;
        track.owner = profile.authority;
        track.uri = uri;
        track.title = title;
        track.index = index;
        track.like_count = 0;
        track.bump = *ctx.bumps.get("track").unwrap();
        profile.track_count = profile
            .track_count
            .checked_add(1)
            .ok_or(SolifyError::Overflow)?;
        Ok(())
    }

    pub fn create_playlist(ctx: Context<CreatePlaylist>, name: String) -> Result<()> {
        require!(name.as_bytes().len() <= MAX_PLAYLIST_NAME_LEN, SolifyError::NameTooLong);
        let pl = &mut ctx.accounts.playlist;
        pl.owner = ctx.accounts.authority.key();
        pl.name = name;
        pl.track_count = 0;
        pl.bump = *ctx.bumps.get("playlist").unwrap();
        Ok(())
    }

    pub fn add_track_to_playlist(ctx: Context<AddTrackToPlaylist>) -> Result<()> {
        let playlist = &mut ctx.accounts.playlist;
        let item = &mut ctx.accounts.playlist_item;
        item.playlist = playlist.key();
        item.track_owner = ctx.accounts.track.owner;
        item.track_index = ctx.accounts.track.index;
        item.idx = playlist.track_count;
        item.bump = *ctx.bumps.get("playlist_item").unwrap();
        playlist.track_count = playlist
            .track_count
            .checked_add(1)
            .ok_or(SolifyError::Overflow)?;
        Ok(())
    }

    pub fn like_track(_ctx: Context<LikeTrack>) -> Result<()> {
        let track = &mut _ctx.accounts.track;
        track.like_count = track.like_count.checked_add(1).ok_or(SolifyError::Overflow)?;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(username: String)]
pub struct InitUserProfile<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = UserProfile::SPACE,
        seeds = [b"user", authority.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(uri: String, title: String)]
pub struct AddTrack<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [b"user", authority.key().as_ref()],
        bump = user_profile.bump,
        has_one = authority
    )]
    pub user_profile: Account<'info, UserProfile>,
    #[account(
        init,
        payer = authority,
        space = Track::SPACE,
        seeds = [b"track", authority.key().as_ref(), &user_profile.track_count.to_le_bytes()],
        bump
    )]
    pub track: Account<'info, Track>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreatePlaylist<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = Playlist::SPACE,
        seeds = [b"playlist", authority.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub playlist: Account<'info, Playlist>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddTrackToPlaylist<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        seeds = [b"playlist", authority.key().as_ref(), playlist.name.as_bytes()],
        bump = playlist.bump,
        constraint = playlist.owner == authority.key() @ SolifyError::NotPlaylistOwner
    )]
    pub playlist: Account<'info, Playlist>,
    /// CHECK: Track PDA derived by owner+index; validated by seeds on account
    #[account(
        seeds = [b"track", track.owner.as_ref(), &track.index.to_le_bytes()],
        bump = track.bump
    )]
    pub track: Account<'info, Track>,
    #[account(
        init,
        payer = authority,
        space = PlaylistItem::SPACE,
        seeds = [b"playlist_item", playlist.key().as_ref(), &playlist.track_count.to_le_bytes()],
        bump
    )]
    pub playlist_item: Account<'info, PlaylistItem>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct LikeTrack<'info> {
    #[account(mut)]
    pub liker: Signer<'info>,
    #[account(
        seeds = [b"track", track.owner.as_ref(), &track.index.to_le_bytes()],
        bump = track.bump
    )]
    pub track: Account<'info, Track>,
    #[account(
        init,
        payer = liker,
        space = Like::SPACE,
        seeds = [b"like", track.key().as_ref(), liker.key().as_ref()],
        bump
    )]
    pub like: Account<'info, Like>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct UserProfile {
    pub authority: Pubkey,
    pub username: String,
    pub bump: u8,
    pub track_count: u64,
}
impl UserProfile {
    pub const SPACE: usize = 8 + 32 + 4 + MAX_USERNAME_LEN + 1 + 8;
}

#[account]
pub struct Track {
    pub owner: Pubkey,
    pub uri: String,
    pub title: String,
    pub like_count: u64,
    pub index: u64,
    pub bump: u8,
}
impl Track {
    pub const SPACE: usize = 8 + 32 + 4 + MAX_URI_LEN + 4 + MAX_TITLE_LEN + 8 + 8 + 1;
}

#[account]
pub struct Playlist {
    pub owner: Pubkey,
    pub name: String,
    pub track_count: u64,
    pub bump: u8,
}
impl Playlist {
    pub const SPACE: usize = 8 + 32 + 4 + MAX_PLAYLIST_NAME_LEN + 8 + 1;
}

#[account]
pub struct PlaylistItem {
    pub playlist: Pubkey,
    pub idx: u64,
    pub track_owner: Pubkey,
    pub track_index: u64,
    pub bump: u8,
}
impl PlaylistItem {
    pub const SPACE: usize = 8 + 32 + 8 + 32 + 8 + 1;
}

#[account]
pub struct Like {
    pub bump: u8,
}
impl Like {
    pub const SPACE: usize = 8 + 1;
}

#[error_code]
pub enum SolifyError {
    #[msg("Name too long")] 
    NameTooLong,
    #[msg("URI too long")] 
    UriTooLong,
    #[msg("Title too long")] 
    TitleTooLong,
    #[msg("Math overflow")] 
    Overflow,
    #[msg("Not playlist owner")] 
    NotPlaylistOwner,
}
