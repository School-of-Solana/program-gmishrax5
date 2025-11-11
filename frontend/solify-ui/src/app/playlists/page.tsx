'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import NavBar from '@/components/NavBar';

export default function PlaylistsPage() {
  const { publicKey, connected } = useWallet();
  const [playlistName, setPlaylistName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // This would fetch the user's playlists from the blockchain
  useEffect(() => {
    if (connected && publicKey) {
      // Here we would fetch the user's playlists from the blockchain
      // For now, we'll just simulate it
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Simulate empty playlists
        setPlaylists([]);
      }, 1000);
    }
  }, [connected, publicKey]);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim()) return;
    
    setIsLoading(true);
    // Here we would call the create_playlist instruction
    // For now, we'll just simulate it
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setPlaylistName('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
      
      // Add the new playlist to the list
      setPlaylists([
        ...playlists,
        {
          id: Date.now().toString(),
          name: playlistName,
          trackCount: 0,
          owner: publicKey.toString()
        }
      ]);
    }, 1500);
  };

  if (!connected) {
    return (
      <main>
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Playlists</h1>
            <p className="mb-8">Please connect your wallet to view and create playlists.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Playlists</h1>
        
        {isSuccess && (
          <div className="bg-green-800 text-white p-4 rounded-lg mb-6">
            Playlist created successfully!
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Create New Playlist</h2>
              <form onSubmit={handleCreatePlaylist}>
                <div className="mb-4">
                  <label htmlFor="playlistName" className="block text-sm font-medium mb-1">
                    Playlist Name
                  </label>
                  <input
                    type="text"
                    id="playlistName"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter playlist name"
                    maxLength={32}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Playlist'}
                </button>
              </form>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full">
              <h2 className="text-xl font-semibold mb-4">Your Playlists</h2>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <p>Loading...</p>
                </div>
              ) : playlists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {playlists.map((playlist) => (
                    <div 
                      key={playlist.id}
                      className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600"
                      onClick={() => setSelectedPlaylist(playlist)}
                    >
                      <h3 className="font-semibold">{playlist.name}</h3>
                      <p className="text-sm text-gray-300">{playlist.trackCount} tracks</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="mb-4">You haven't created any playlists yet.</p>
                  <p className="text-gray-400">Create your first playlist to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {selectedPlaylist && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">{selectedPlaylist.name}</h2>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setSelectedPlaylist(null)}
              >
                Close
              </button>
            </div>
            
            <div className="mt-4">
              {selectedPlaylist.trackCount > 0 ? (
                <div className="space-y-2">
                  {/* Tracks would be listed here */}
                  <p>Tracks will appear here</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="mb-4">This playlist is empty.</p>
                  <a
                    href="/add-track"
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Add Tracks
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
