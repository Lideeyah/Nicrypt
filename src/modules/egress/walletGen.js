import { Keypair } from '@solana/web3.js';
import { SecurityModule } from '../SecurityModule';

/**
 * Module: Sovereign Wallet Generator
 * Responsibility: Create a new Identity/Spending keypair and immediately encrypt it.
 * Security: The private key should never leave this scope in plaintext.
 */
export const SovereignWalletGenerator = {
    /**
     * Generates a new fresh wallet and encrypts it with the User's PIN.
     * @param {string} pin - The user's session PIN.
     * @returns {Promise<{publicKey: string, encryptedSecret: string}>}
     */
    async generateSovereignWallet(pin) {
        // 1. Generate Clean Keypair
        let keypair = Keypair.generate();
        const publicKey = keypair.publicKey.toBase58();

        // 2. Prepare Secret for Encryption
        // access secretKey before wiping it.
        // Convert Uint8Array to standard Array for JSON serialization compatibility
        const secretKeyData = {
            secretKey: Array.from(keypair.secretKey),
            created: Date.now(),
            label: 'Sovereign Spending Wallet'
        };

        try {
            // 3. Encrypt immediately
            const encryptedSecret = await SecurityModule.encryptState(secretKeyData, pin);

            // 4. Wipe Local Reference
            keypair = null;

            return {
                publicKey,
                encryptedSecret
            };
        } catch (error) {
            keypair = null; // Ensure wipe on failure
            console.error("Wallet Generation Failed:", error);
            throw new Error("Failed to generate and encrypt sovereign wallet.");
        }
    }
};
