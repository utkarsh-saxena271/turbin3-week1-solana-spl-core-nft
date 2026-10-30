# Turbin3 Week 1: SPL Token + MPL Core NFT (Solana devnet)

Week 1 assignment for Turbin3. Mint and transfer an SPL token, then mint, update, transfer and burn an NFT using Metaplex MPL Core. Everything runs on **devnet**.

## Progress

- [x] Task 1: Mint and transfer an SPL token
- [ ] Task 2: Mint an NFT with MPL Core
- [ ] Task 3: Update the NFT's name and metadata as update authority
- [ ] Task 4 (extension): Transfer the NFT between wallets
- [ ] Task 5 (extension): Burn the NFT and reclaim rent

## Stack

- TypeScript, run with [`tsx`](https://github.com/privatenumber/tsx)
- `@solana/web3.js` (v1) and `@solana/spl-token` for the SPL token
- Metaplex Umi + `@metaplex-foundation/mpl-core` for the NFT (upcoming)

## Setup

```bash
git clone <this-repo>
cd turbin3-week1-solana-spl-core-nft
npm install
```

Generate two wallets (main wallet and a recipient). The script refuses to overwrite an existing file:

```bash
npx tsx src/keygen.ts wallet.json
npx tsx src/keygen.ts recipient.json
```

Fund the **main** wallet with devnet SOL using https://faucet.solana.com (pick Devnet and paste the main wallet's public key), then check the balance:

```bash
npx tsx src/balance.ts
```

> `wallet.json` and `recipient.json` hold secret keys and are gitignored. Never commit them.

## Project structure

```
src/
  helpers.ts          # loadWallet() and shared devnet connection
  keygen.ts           # generates a keypair file
  balance.ts          # prints the main wallet's SOL balance
  01-spl-token.ts     # Task 1: create mint, create ATA, mint tokens
  01b-transfer-spl.ts # Task 1: transfer tokens to the recipient
```

## Task 1: SPL token

```bash
npx tsx src/01-spl-token.ts      # run once, it creates a new mint every time
npx tsx src/01b-transfer-spl.ts  # uses the existing mint
```

What happens:

1. `createMint` creates the token mint (6 decimals, main wallet is mint authority, no freeze authority).
2. `getOrCreateAssociatedTokenAccount` creates the main wallet's token account (ATA).
3. `mintTo` mints 100 tokens into that ATA.
4. A second script creates the recipient's ATA (rent paid by the main wallet) and transfers 10 tokens to it.

### Addresses and transactions

| Item | Link |
| --- | --- |
| Main wallet | [6t3JM1uD...paA5U](https://explorer.solana.com/address/6t3JM1uDGJErrXsn8HjeDMquJJd3Nk9Q3D4i91HpaA5U?cluster=devnet) |
| Recipient wallet | [9KoutnZc...Ay1X](https://explorer.solana.com/address/9KoutnZcmajEvYsy1c9QLYXmLaJn1ZKiKYTjVeHYAy1X?cluster=devnet) |
| Token mint | [FXUWPzFv...HxBm](https://explorer.solana.com/address/FXUWPzFvc6LE3Ph5LopPKuckqX4iSFjfSaYi2cAjxHBm?cluster=devnet) |
| Mint tx (100 tokens) | [3sn9mJ4j...zQoK](https://explorer.solana.com/tx/3sn9mJ4jymCy5JEq9RncqE91CNGGxFFEUhU2oymu7VwZk5rfnsdKEbH4Q22xxTV4o2Hue2SCgqVi49jENu5wzQoK?cluster=devnet) |
| Transfer tx (10 tokens) | [3cthnLye...5fxZ](https://explorer.solana.com/tx/3cthnLye56MszNZAGm4ykz6rmUZWLgGGxv4wbrd32ZCuKLi8FUYjUK6L3QSg1THwhShZnJPB8SpQxWDmAxtf5fxZ?cluster=devnet) |

## What I learned so far

- A Solana keypair is the account: the public key is the address, the secret key signs transactions.
- A token's balance does not live in the wallet. The mint defines the token (decimals, authorities) and each wallet holds its balance in an associated token account (ATA).
- Token amounts are in base units, so with 6 decimals, 100 tokens is `100 * 10^6`.
- Every transaction costs a fee and every new account costs rent, which is why even devnet needs SOL.
- The payer and the token owner are different roles: the main wallet paid the rent for the recipient's ATA, but the recipient owns it.

## Next

Tasks 2 to 5 with MPL Core, covered in the sections to be added here.