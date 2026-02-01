#!/bin/bash

# Nicrypt Demo Launcher
# Launches Backend (Rust) and Frontend (React)

echo "[Nicrypt] Launching Sovereign Layer Demo..."

# 1. Start Rust Backend in Background
echo "[Nicrypt] Starting ShadowWire Relay (Port 8080)..."
cd middleware
source $HOME/.cargo/env
cargo run > ../relay.log 2>&1 &
RELAY_PID=$!
cd ..

echo "[Nicrypt] Relay PID: $RELAY_PID. Logs writing to relay.log"
sleep 5 # Wait for compilation/startup

# 2. Check if Relay is up
if ! curl -s http://localhost:8080 > /dev/null; then
    echo "[Warning] Relay might not be ready yet. Check relay.log if functionality fails."
else
    echo "[Nicrypt] Relay is ONLINE."
fi

# 3. Start Frontend
echo "[Nicrypt] Starting Frontend (Port 5173)..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
npm run dev

# Cleanup on exit
kill $RELAY_PID
