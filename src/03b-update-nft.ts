import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";


import {
  createSignerFromKeypair,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";

import { fetchAsset, mplCore, update } from "@metaplex-foundation/mpl-core";
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
      "https://gateway.irys.xyz/AWVU3MNaNcb2YonkGmrkJQzFqsusZVfeZq49TeMqPH49";

    // Generate NFT asset
    const asset = await fetchAsset(umi, publicKey("5G1GTJuT5ZjtScyiXGMfX1WfgyvH6i2F8oQxfNf1mUHB"))

    // Create NFT
    const tx = await update(umi, {
      asset,
      name: "utkarsh upd",
      uri: metadataUri,
    }).sendAndConfirm(umi);

    // Get transaction signature
    const signature = base58.deserialize(tx.signature)[0];

    console.log("NFT updated successfully!");

    console.log(`Signature: ${signature}`);
    console.log(`Asset Address: ${asset.publicKey}`);

    console.log(
      `Explorer: https://explorer.solana.com/address/${asset.publicKey}?cluster=devnet`
    );

  } catch (e) {
    console.log("Error:", e);
  }
})();
