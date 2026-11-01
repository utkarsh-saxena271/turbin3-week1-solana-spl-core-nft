import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import {
  createSignerFromKeypair,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";

import { burn, fetchAsset, mplCore } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { loadWallet } from "./helpers.js";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Connect to Solana Devnet
const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

// Burn must be signed by the CURRENT owner, which is now the recipient
const keypair = umi.eddsa.createKeypairFromSecretKey(
  loadWallet("recipient.json").secretKey
);

const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));
umi.use(mplCore());

(async () => {
  try {
    const assetAddress = publicKey("5G1GTJuT5ZjtScyiXGMfX1WfgyvH6i2F8oQxfNf1mUHB");

    // Balance before
    const balBefore = await umi.rpc.getBalance(signer.publicKey);
    console.log("Balance before:", Number(balBefore.basisPoints) / 1e9, "SOL");

    // Confirm current owner
    const asset = await fetchAsset(umi, assetAddress);
    console.log("Owner:", asset.owner);

    // Burn
    const tx = await burn(umi, { asset }).sendAndConfirm(umi);
    const signature = base58.deserialize(tx.signature)[0];
    console.log("NFT burned successfully!");
    console.log(`Signature: ${signature}`);

    // Balance after (wait a bit for RPC to catch up)
    await sleep(4000);
    const balAfter = await umi.rpc.getBalance(signer.publicKey);
    console.log("Balance after:", Number(balAfter.basisPoints) / 1e9, "SOL");

    // Asset should not be fetchable anymore
    try {
      await fetchAsset(umi, assetAddress);
      console.log("Asset still readable, RPC lag. Check Explorer.");
    } catch {
      console.log("Asset burned, fetch failed as expected");
    }

    console.log(
      `Explorer: https://explorer.solana.com/address/${assetAddress}?cluster=devnet`
    );
  } catch (e) {
    console.log("Error:", e);
  }
})();