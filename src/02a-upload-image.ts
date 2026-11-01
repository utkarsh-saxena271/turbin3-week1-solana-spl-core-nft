import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { loadWallet } from "./helpers.js";
import { readFile } from "fs/promises";

const keypair = loadWallet("wallet.json")
const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);


const signer = createSignerFromKeypair(umi, umi.eddsa.createKeypairFromSecretKey(keypair.secretKey));

umi.use(
  irysUploader({
    address: "https://devnet.irys.xyz/",
  }),
);

umi.use(signerIdentity(signer));

(async () => {
  try {
    //chanege image path to your image path
    const image = await readFile("assets/nft.jpg");

    //change the image name and mime type
    const file = createGenericFile(image, "nft.jpg", { contentType: "image/jpeg" })

    const [myUri] =await umi.uploader.upload([file])
    console.log("Your image URI: ", myUri);
  } catch (error) {
    console.log(error);
  }
})();