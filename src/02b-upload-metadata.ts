
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { loadWallet } from "./helpers.js";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

const keypair = umi.eddsa.createKeypairFromSecretKey(
  loadWallet("wallet.json").secretKey
);

const signer = createSignerFromKeypair(umi, keypair);

umi.use(
  irysUploader({
    address: "https://devnet.irys.xyz/",
  }),
);

umi.use(signerIdentity(signer));

(async () => {
  try {
    // Image URI obtained from nft_image.ts
    const image =
      "https://gateway.irys.xyz/Fwib1En3TmkHwDTwF1hCbZ8NqRnm9d7YNKmMkxnwA24X";

    // NFT metadata
    const metadata = {
      name: "utkarsh",
      description: "NFT created for week1 assignment.",
      image: image,
      symbol: "UTK",
      attributes: [
        {
          trait_type: "Category",
          value: "Tech Nerd",
        },
      ],
      properties: {
        files: [
          {
            uri: image,
            type: "image/jpeg",
          },
        ],
        category: "image",
      },
    };

    // Convert metadata into JSON file
    const metadataFile = createGenericFile(
      new TextEncoder().encode(JSON.stringify(metadata)),
      "metadata.json",
      {
        contentType: "application/json",
      }
    );

    // Upload metadata to Irys
    const [myUri] = await umi.uploader.upload([metadataFile]);

    console.log("Metadata uploaded successfully!");
    console.log("Metadata URI:", myUri);

  } catch (error) {
    console.log("error", error);
  }
})();
