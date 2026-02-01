import {
    Connection,
    Keypair,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
    ExtensionType,
    createInitializeMintInstruction,
    getMintLen,
    TOKEN_2022_PROGRAM_ID,
    createInitializeConfidentialTransferMintInstruction,
} from '@solana/spl-token';

/*
  Nicrypt Settlement Layer - Token-2022 Configuration
  Logic: Configures a new Mint with Confidential Transfer extensions enabled.
*/

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const payer = Keypair.generate(); // In prod, load from secret key

async function createConfidentialMint() {
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
    const decimals = 9;

    console.log(`Creating Confidential Mint: ${mint.toBase58()}...`);

    // 1. Calculate Space for Mint + Confidential Extension
    const extensions = [ExtensionType.ConfidentialTransferMint];
    const mintLen = getMintLen(extensions);
    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

    // 2. Create Instructions
    const createAccountIx = SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mint,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
    });

    const initConfidentialIx = createInitializeConfidentialTransferMintInstruction(
        mint,
        payer.publicKey, // Authority can approve/auditor
        true,            // Auto-approve new accounts
        payer.publicKey, // Auditor ElGamal pubkey
        TOKEN_2022_PROGRAM_ID
    );

    const initMintIx = createInitializeMintInstruction(
        mint,
        decimals,
        payer.publicKey,
        null,
        TOKEN_2022_PROGRAM_ID
    );

    // 3. Build & Send Transaction
    const transaction = new Transaction().add(
        createAccountIx,
        initConfidentialIx,
        initMintIx
    );

    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [payer, mintKeypair]
    );

    console.log(`Mint Created! Tx: ${signature}`);
    console.log(`Confidential Transfers Enabled.`);
}

createConfidentialMint().catch(console.error);
