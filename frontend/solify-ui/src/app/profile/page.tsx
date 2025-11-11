'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import NavBar from '@/components/NavBar';

export default function ProfilePage() {
  const { publicKey, connected } = useWallet();
  const [username, setUsername] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userTracks, setUserTracks] = useState([]);

  // This would fetch the user profile from the blockchain
  useEffect(() => {
    if (connected && publicKey) {
      // Here we would fetch the user profile from the blockchain
      // For now, we'll just simulate it
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Simulate profile not found
        setIsInitialized(false);
      }, 1000);
    }
  }, [connected, publicKey]);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    // Here we would call the init_user_profile instruction
    // For now, we'll just simulate it
    setTimeout(() => {
      setIsLoading(false);
      setIsInitialized(true);
    }, 1500);
  };

  if (!connected) {
    return (
      <main>
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            <p className="mb-8">Please connect your wallet to view your profile.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading...</p>
          </div>
        ) : isInitialized ? (
          <div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-semibold mb-2">Welcome, {username}</h2>
              <p className="text-gray-300 mb-4">Wallet: {publicKey?.toString()}</p>
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Your Tracks</h2>
              {userTracks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Track items would go here */}
                  <p>Your tracks will appear here</p>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-800 rounded-lg">
                  <p className="mb-4">You haven't added any tracks yet.</p>
                  <a
                    href="/add-track"
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Add Your First Track
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Create Your Profile</h2>
            <form onSubmit={handleCreateProfile}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter a username"
                  maxLength={32}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Profile'}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
