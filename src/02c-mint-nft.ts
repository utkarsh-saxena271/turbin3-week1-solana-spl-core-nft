import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";


import {
  createSignerFromKeypair,
  generateSigner,
  signerIdentity,
} from "@metaplex-foundation/umi";

import { create, mplCore } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { loadWallet } from "./helpers.js";

// Connect to Solana Devnet
const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

// Load wallet
const keypair = umi.eddsa.createKeypairFromSecretKey(
  loadWallet("wallet.json").secretKey
);

const signer = createSignerFromKeypair(umi, keypair);

// Set wallet identity
umi.use(signerIdentity(signer));

// Initialize Metaplex Core
umi.use(mplCore());

(async () => {
  try {
    // Your Irys metadata URI
    const metadataUri =
      "https://gateway.irys.xyz/F6myapNhoHga5d9Dn3KnqbvZYshgm8NnVLoTEu93QYUx";

    // Generate NFT asset
    const asset = generateSigner(umi);

    // Create NFT
    const tx = await create(umi, {
      asset,
      name: "utkarsh",
      uri: metadataUri,
    }).sendAndConfirm(umi);

    // Get transaction signature
    const signature = base58.deserialize(tx.signature)[0];

    console.log("NFT created successfully!");

    console.log(`Signature: ${signature}`);
    console.log(`Asset Address: ${asset.publicKey}`);

    console.log(
      `Explorer: https://explorer.solana.com/address/${asset.publicKey}?cluster=devnet`
    );

  } catch (e) {
    console.log("Error:", e);
  }
})();
