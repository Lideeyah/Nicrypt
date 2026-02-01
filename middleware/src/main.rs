mod relay_server;
mod obfuscation;
mod pool;

use actix_web::{App, HttpServer, web, http};
use actix_cors::Cors;
use std::io;

#[actix_web::main]
async fn main() -> io::Result<()> {
    std::env::set_var("RUST_LOG", "info");
    env_logger::init();

    log::info!("ShadowWire Relay v1.0 starting on 0.0.0.0:8080");
    log::info!("CRYPTO_MODE: SOVEREIGN (Bulletproofs Active)");

    HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin("http://localhost:5173")
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![http::header::CONTENT_TYPE])
            .max_age(3600);

        App::new()
            .wrap(cors)
            .route("/", web::get().to(relay_server::health_check))
            .route("/shield", web::post().to(relay_server::shield_assets))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
