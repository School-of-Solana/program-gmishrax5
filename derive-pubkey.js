const { Keypair } = require('@solana/web3.js');

// The keypair data from your wallet-keypair.json file
const keypairData = [81,214,253,142,45,164,38,30,173,197,253,197,67,30,201,239,160,168,7,64,231,65,239,138,18,90,65,180,116,192,25,68,190,201,238,168,176,165,204,77,51,93,89,249,255,117,83,5,96,40,54,238,216,155,110,46,248,222,250,159,106,71,58,132];

// Create a keypair from the array
const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));

// Get the public key (Program ID)
const publicKey = keypair.publicKey.toString();

console.log('Your Program ID is:', publicKey);
