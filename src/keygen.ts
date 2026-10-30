import fs from "fs";
import { Keypair } from "@solana/web3.js";


const file = process.argv[2] || "wallet.json";

if (fs.existsSync(file)) {
  console.log(`${file} already exists, overwrite nahi karunga`);
  process.exit(1);
}

const keypair = Keypair.generate();
const secretKey = JSON.stringify(Array.from(keypair.secretKey));

fs.writeFileSync(file, secretKey);
console.log("Saved to", file);
console.log("Public key:", keypair.publicKey.toBase58());