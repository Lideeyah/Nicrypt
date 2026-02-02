/*
  Nicrypt Identity Layer (ZK-Gate)
  Logic: Uses Zero-Knowledge Schnorr Proofs (NIZK) with secp256k1.
  Flow: NIN -> Hashing (Witness) -> ZK Proof of Knowledge -> Nullifier.
*/

import { SchnorrProver } from './zk/SchnorrProver';

export const IdentityModule = {
    /**
     * Generates a REAL ZK Proof for the given NIN.
     * @param {string} nin - 11-digit NIN.
     * @param {string} localSecret - User session secret.
     * @returns {Promise<Object>} - The real proof and public signals.
     */
    async generateZKProof(nin, localSecret) {
        console.log("[ZK-Gate] Initializing Real Schnorr Prover...");

        try {
            // 1. Generate Real Proof via Elliptic Curve Math
            const { proof, publicSignals } = await SchnorrProver.prove(nin, localSecret);

            console.log(`[ZK-Gate] Proof Generated:`, proof);
            console.log(`[ZK-Gate] Public Identity:`, publicSignals[0]);

            // 2. Format for UI (preserving compatibility)
            // The UI expects 'proof' object and 'publicSignals' array.
            return {
                proof: {
                    ...proof,
                    curve: "secp256k1",
                    protocol: "schnorr-nizk"
                },
                publicSignals: publicSignals
            };

        } catch (e) {
            console.error("[ZK-Gate] Proof Generation Failed:", e);
            throw new Error("ZK-Proof Generation Failed: " + e.message);
        }
    }
};
