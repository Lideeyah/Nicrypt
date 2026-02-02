/*
  Nicrypt Security Layer (Local Vault)
  Logic: Encrypts application state at rest using AES-GCM.
  Key Derivation: PBKDF2 from User PIN.
*/

const SALT_STORAGE_KEY = 'nicrypt_salt';

// Helper: Get or create a random salt
function getSalt() {
    let saltHex = localStorage.getItem(SALT_STORAGE_KEY);
    if (saltHex) {
        return new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    }
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    localStorage.setItem(SALT_STORAGE_KEY, Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join(''));
    return salt;
}

// Derive a key from the PIN
async function deriveKey(pin) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(pin),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: getSalt(),
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

export const SecurityModule = {
    /**
     * Encrypts a data object using the user's PIN.
     * @param {Object} data - The state to encrypt.
     * @param {string} pin - The user's PIN.
     * @returns {Promise<string>} - Base64 encoded ciphertext containing IV and data.
     */
    async encryptState(data, pin) {
        try {
            const key = await deriveKey(pin);
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const encodedData = new TextEncoder().encode(JSON.stringify(data));

            const ciphertext = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                key,
                encodedData
            );

            // Pack IV and Ciphertext
            const combined = new Uint8Array(iv.length + ciphertext.byteLength);
            combined.set(iv);
            combined.set(new Uint8Array(ciphertext), iv.length);

            // Convert to Base64 for storage
            return btoa(String.fromCharCode(...combined));
        } catch (e) {
            console.error("Encryption Failed:", e);
            throw new Error("Security Violation: Encryption Failed");
        }
    },

    /**
     * Decrypts the stored blob using the user's PIN.
     * @param {string} encryptedBlob - Base64 encoded string.
     * @param {string} pin - The user's PIN.
     * @returns {Promise<Object>} - The decrypted state object.
     */
    async decryptState(encryptedBlob, pin) {
        try {
            const key = await deriveKey(pin);
            // ... (existing logic handled by logic retention, but strictly typing out for replacement context)
            const combined = new Uint8Array(atob(encryptedBlob).split("").map(c => c.charCodeAt(0)));
            const iv = combined.slice(0, 12);
            const ciphertext = combined.slice(12);

            const decrypted = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                ciphertext
            );

            return JSON.parse(new TextDecoder().decode(decrypted));
        } catch (e) {
            console.error("Decryption Failed:", e);
            throw new Error("Access Denied: Invalid PIN or Corrupted State");
        }
    },

    /**
     * Signs a message using a deterministic Ed25519 key derived from the PIN.
     * This creates a verifiable "Solvency Proof" that the Vault Owner authorized the egress.
     */
    async signMessage(message, pin) {
        try {
            // lazy load elliptic to avoid bundle bloat if unused
            const { ec: EC } = await import('elliptic');
            const ec = new EC('ed25519');

            // Derive Private Key from PIN (SHA-256 Hash)
            const encoder = new TextEncoder();
            const pinHash = await window.crypto.subtle.digest('SHA-256', encoder.encode(pin));
            const privateKeyHex = Array.from(new Uint8Array(pinHash)).map(b => b.toString(16).padStart(2, '0')).join('');

            // Create Keypair
            const keyPair = ec.keyFromPrivate(privateKeyHex);

            // Sign
            const msgHash = Array.from(new Uint8Array(await window.crypto.subtle.digest('SHA-256', encoder.encode(message))));
            const signature = keyPair.sign(msgHash);

            return {
                signature: signature.toDER('hex'),
                publicKey: keyPair.getPublic('hex'),
                message: message
            };
        } catch (e) {
            console.error("Signing Failed:", e);
            throw new Error("Failed to sign solvency proof.");
        }
    }
};
