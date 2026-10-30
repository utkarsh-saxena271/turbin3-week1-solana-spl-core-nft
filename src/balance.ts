import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { conn, loadWallet } from "./helpers.js"

const keypair = loadWallet("wallet.json");



(async function(){
    const lamports = await conn.getBalance(keypair.publicKey)
    console.log(lamports/LAMPORTS_PER_SOL)
})()