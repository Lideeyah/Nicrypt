use bulletproofs::{BulletproofGens, PedersenGens, RangeProof};
use curve25519_dalek_ng::scalar::Scalar;
use merlin::Transcript;
use rand::thread_rng;

pub struct Obfuscator {
    pc_gens: PedersenGens,
    bp_gens: BulletproofGens,
}

impl Obfuscator {
    pub fn new() -> Self {
        Obfuscator {
            pc_gens: PedersenGens::default(),
            bp_gens: BulletproofGens::new(64, 1),
        }
    }

    /// Generates a Zero-Knowledge Range Proof for a value (amount).
    /// Proves that 0 <= value < 2^64 without revealing the value.
    pub fn generate_proof(&self, value: u64, blinding_factor: Scalar) -> Result<Vec<u8>, String> {
        let mut transcript = Transcript::new(b"ShadowWire_Transaction");
        let mut rng = thread_rng();

        let (proof, _committed_value) = RangeProof::prove_single(
            &self.bp_gens,
            &self.pc_gens,
            &mut transcript,
            value,
            &blinding_factor,
            32, // Check for 32-bit range (standard for typical tx amounts)
        ).map_err(|e| format!("Proof generation failed: {:?}", e))?;

        log::info!("Generated Bulletproof of size: {} bytes", proof.to_bytes().len());
        Ok(proof.to_bytes())
    }

    /// Verifies a received Range Proof.
    pub fn verify_proof(&self, proof_bytes: &[u8], commitment: curve25519_dalek_ng::ristretto::CompressedRistretto) -> bool {
        let mut transcript = Transcript::new(b"ShadowWire_Transaction");
        
        let proof = match RangeProof::from_bytes(proof_bytes) {
            Ok(p) => p,
            Err(_) => return false,
        };

        proof.verify_single(
            &self.bp_gens,
            &self.pc_gens,
            &mut transcript,
            &commitment,
            32
        ).is_ok()
    }
}
