#!/bin/bash
set -e

echo "[Nicrypt] Starting Automated Environment Setup..."

# 1. Install Node.js (using NVM if possible, else direct)
if ! command -v node &> /dev/null; then
    echo "[Nicrypt] Node.js not found. Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    echo "[Nicrypt] Installing Node.js LTS..."
    nvm install --lts
    nvm use --lts
else
    echo "[Nicrypt] Node.js found: $(node -v)"
fi

# 2. Install Rust (Rustup)
if ! command -v cargo &> /dev/null; then
    echo "[Nicrypt] Rust not found. Installing Rustup..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
else
    echo "[Nicrypt] Rust found: $(cargo --version)"
fi

# 3. Install Solana CLI
if ! command -v solana &> /dev/null; then
    echo "[Nicrypt] Solana CLI not found. Installing..."
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"
    export PATH="/Users/$USER/.local/share/solana/install/active_release/bin:$PATH"
else
    echo "[Nicrypt] Solana found: $(solana --version)"
fi

# 4. Install Project Dependencies
echo "[Nicrypt] Installing Frontend Dependencies..."
cd "$(dirname "$0")" # Go to project root
if [ -f "package.json" ]; then
    npm install
else
    echo "[Error] package.json not found!"
fi

echo "[Nicrypt] Building Middleware (Rust)..."
if [ -d "middleware" ]; then
    cd middleware
    cargo build
    cd ..
fi

echo "[Nicrypt] Setup Complete!"
echo "Please restart your terminal or run 'source ~/.zshrc' to update your PATH before running the app."
