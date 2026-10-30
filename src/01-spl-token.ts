import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { conn, loadWallet } from "./helpers.js";

const keypair = loadWallet("wallet.json")

const mint = await createMint(conn, keypair, keypair.publicKey, null, 6)
console.log("Mint:", mint.toBase58())

const ata = await getOrCreateAssociatedTokenAccount(conn, keypair, mint, keypair.publicKey)
console.log(ata.address.toBase58())


const tx = await mintTo(conn, keypair, mint, ata.address, keypair, 100n * 10n ** 6n)
console.log(tx)

