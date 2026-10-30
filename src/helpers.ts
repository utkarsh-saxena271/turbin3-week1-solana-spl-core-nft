import { Connection, Keypair } from "@solana/web3.js"
import fs from "fs"
export function loadWallet(file: string) : Keypair {
    const secretKey = JSON.parse(fs.readFileSync(file, "utf8"))
    const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey))


    return keypair
}

export const conn = new Connection("https://api.devnet.solana.com", "confirmed");