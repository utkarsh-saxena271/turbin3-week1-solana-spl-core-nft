import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import {
  createSignerFromKeypair,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";

import { fetchAsset, mplCore, transfer } from "@metaplex-foundation/mpl-core";
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
    const assetAddress = publicKey("5G1GTJuT5ZjtScyiXGMfX1WfgyvH6i2F8oQxfNf1mUHB");

    // Recipient (web3.js key -> Umi key)
    const recipient = publicKey(loadWallet("recipient.json").publicKey.toBase58());

    // Fetch NFT
    const asset = await fetchAsset(umi, assetAddress);
    console.log("Before");
    console.log("owner :", asset.owner);

    // Transfer NFT
    const tx = await transfer(umi, {
      asset,
      newOwner: recipient,
    }).sendAndConfirm(umi);

    // Get transaction signature
    const signature = base58.deserialize(tx.signature)[0];

    console.log("NFT transferred successfully!");
    console.log(`Signature: ${signature}`);

    // Verify
    const updated = await fetchAsset(umi, assetAddress);
    console.log("After");
    console.log("owner :", updated.owner);

    console.log(`Asset Address: ${asset.publicKey}`);
    console.log(
      `Explorer: https://explorer.solana.com/address/${asset.publicKey}?cluster=devnet`
    );
  } catch (e) {
    console.log("Error:", e);
  }
})();