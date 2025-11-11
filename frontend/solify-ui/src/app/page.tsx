import NavBar from '@/components/NavBar';

export default function Home() {
  return (
    <main>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Welcome to Solify</h1>
        <p className="text-xl mb-4">
          A decentralized music platform built on Solana blockchain
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Share Your Music</h2>
            <p className="mb-4">
              Upload your tracks to the Solana blockchain and share them with the world.
              Own your content and connect directly with your fans.
            </p>
            <a
              href="/add-track"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Add a Track
            </a>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Create Playlists</h2>
            <p className="mb-4">
              Curate your favorite tracks into playlists. Discover new music from other creators.
            </p>
            <a
              href="/playlists"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Explore Playlists
            </a>
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-700 p-4 rounded-lg">
              <div className="text-3xl font-bold text-purple-500 mb-2">1</div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p>Connect your Solana wallet to get started with Solify.</p>
            </div>
            
            <div className="border border-gray-700 p-4 rounded-lg">
              <div className="text-3xl font-bold text-purple-500 mb-2">2</div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p>Set up your artist profile with a unique username.</p>
            </div>
            
            <div className="border border-gray-700 p-4 rounded-lg">
              <div className="text-3xl font-bold text-purple-500 mb-2">3</div>
              <h3 className="text-xl font-semibold mb-2">Upload & Share</h3>
              <p>Add your tracks, create playlists, and engage with the community.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
