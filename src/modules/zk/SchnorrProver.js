import { ec as EC } from 'elliptic';
import { sha256 } from 'js-sha256'; // If unavailable, we use a simple native fallback
// Fallback if js-sha256 isn't there (we assume native crypto or simple hashing)
// But since we are client side, window.crypto is best.

const ec = new EC('secp256k1');

export const SchnorrProver = {

    /**
     * Generates a Deterministic Keypair from NIN + Secret
     */
    async generateKeyPair(nin, secret) {
        const raw = nin + secret;
        const msgBuffer = new TextEncoder().encode(raw);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const keyPair = ec.keyFromPrivate(hashHex);
        return keyPair;
    },

    /**
     * ZK Proof of Knowledge of Private Key (d) for Public Key (Q)
     * Proves: "I know d such that Q = d*G" without revealing d.
     * Non-Interactive via Fiat-Shamir Heuristic.
     */
    async prove(nin, localSecret) {
        const keyPair = await this.generateKeyPair(nin, localSecret);
        const privateKey = keyPair.getPrivate();
        const publicKey = keyPair.getPublic();

        // 1. Commitment (R = k*G)
        // Generate random nonce k
        const k = ec.genKeyPair().getPrivate(); // Ephemeral private key
        const R = ec.g.mul(k); // Ephemeral public point

        // 2. Challenge (e = Hash(R || Q)) - Fiat-Shamir
        // We hash the Public Point R and Identity Public Key Q
        // This binds the proof to this specific identity instance
        const R_hex = R.encode('hex');
        const Q_hex = publicKey.encode('hex');
        const challengeRaw = R_hex + Q_hex;

        const challengeBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(challengeRaw));
        const challengeHex = Array.from(new Uint8Array(challengeBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        const e = ec.keyFromPrivate(challengeHex).getPrivate(); // Scalar from hash

        // 3. Response (s = k + e*d)
        // s = k + (e * privateKey) mod N
        const s = k.add(e.mul(privateKey)).umod(ec.curve.n);

        // Construct Public Signals & Proof
        const proof = {
            R: R_hex,
            s: s.toString(16), // Scalar in hex
            algorithm: "Schnorr-NIZK-secp256k1"
        };

        // Nullifier: Deterministic unique ID for this identity (Public Key X coord)
        const nullifier = "null_" + publicKey.getX().toString(16).substring(0, 16);

        return {
            proof,
            publicSignals: [
                Q_hex,      // Identity Commitment (Public Key)
                nullifier,  // Nullifier (Derived from Public Key)
                challengeHex // Context
            ]
        };
    }
};
