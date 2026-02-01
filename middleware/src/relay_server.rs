use actix_web::{web, HttpResponse, Responder};
use crate::obfuscation::Obfuscator;
use crate::pool::{ShieldRequest, ShieldResponse};
use curve25519_dalek_ng::scalar::Scalar;
use rand::thread_rng;

pub async fn health_check() -> impl Responder {
    HttpResponse::Ok().body("ShadowWire Relay Online. Status: SECURE.")
}

pub async fn shield_assets(req: web::Json<ShieldRequest>) -> impl Responder {
    log::info!("Received Shield Request from: {}", req.sender_pubkey);

    // 1. Initialize Crypto Engine
    let obfuscator = Obfuscator::new();

    // 2. Generate Obfuscation Proof (Range Proof)
    // In a real scenario, the commitment would verify against the on-chain state.
    // Here we prove that the amount entering the pool is valid.
    let mut rng = thread_rng();
    let blinding = Scalar::random(&mut rng);
    
    match obfuscator.generate_proof(req.amount, blinding) {
        Ok(proof_bytes) => {
            let proof_hex = hex::encode(proof_bytes);
            
            log::info!("Asset successfully obfuscated. Proof attached.");

            HttpResponse::Ok().json(ShieldResponse {
                status: "SHIELDED".to_string(),
                tx_hash: format!("tx_{}", hex::encode(&proof_hex[0..8])), // Mock Hash
                obfuscation_proof: proof_hex,
            })
        },
        Err(e) => {
            log::error!("Obfuscation failed: {}", e);
            HttpResponse::InternalServerError().body("Obfuscation Failed")
        }
    }
}
