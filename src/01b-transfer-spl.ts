import { PublicKey } from "@solana/web3.js";
import { conn, loadWallet } from "./helpers.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

const keypair = loadWallet("wallet.json")
const mint = new PublicKey("FXUWPzFvc6LE3Ph5LopPKuckqX4iSFjfSaYi2cAjxHBm")

const recipient = loadWallet("recipient.json").publicKey


const fromAta = await getOrCreateAssociatedTokenAccount(conn, keypair, mint, keypair.publicKey)
const toAta = await getOrCreateAssociatedTokenAccount(conn, keypair, mint, recipient)

const tx = await transfer(conn, keypair, fromAta.address, toAta.address, keypair, 10n * 10n ** 6n)
console.log(tx)