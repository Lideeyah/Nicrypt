import React, { useState, useEffect } from 'react';
import LandingPage from './components/Layout/LandingPage';
import MainLayout from './components/Layout/MainLayout';
import PulseDashboard from './components/Dashboard/PulseDashboard';
import VerificationModal from './components/Gate/VerificationModal';
import { useNicryptVault } from './hooks/useNicryptVault';
import { useSolanaBalance } from './hooks/useSolanaBalance';
import { useNicryptIngress } from './hooks/useNicryptIngress';
import { SolanaModule } from './modules/SolanaModule';
import { IncoModule } from './modules/IncoModule';

function App() {
    const [logs, setLogs] = useState([]);
    const [stage, setStage] = useState(0);
    const [walletAddress, setWalletAddress] = useState(null);
    const [showVerification, setShowVerification] = useState(false);
    const [pin, setPin] = useState("1234"); // Default for demo

    // Live Balance Hook
    const { publicBalance, refetch: refreshBalance } = useSolanaBalance(walletAddress);

    // Safely init hook
    const { vaultState, updateVault, clearVault } = useNicryptVault(pin);

    // Ingress Hook
    const { executeIngress, isDepositing } = useNicryptIngress(walletAddress, updateVault);

    const balance = vaultState?.balance || "0.00";

    const addLog = (message, type = 'info') => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs(prev => [...prev, { time, message, type }]);
    };

    // STAGE Actions
    const handleStageAction = async (paramAmount) => {
        if (stage === 1) {
            try {
                const pubkey = await SolanaModule.connectWallet();
                setWalletAddress(pubkey);
                // Balance will auto-fetch via hook
                addLog(`WALLET CONNECTED: ${pubkey.substring(0, 6)}...`, "success");
                setStage(2);
            } catch (e) {
                console.error("Stage Action Error:", e);
                addLog(`ERROR: ${e.message}`, "error");
            }
        }
        else if (stage === 2) {
            setShowVerification(true);
        }
        else if (stage === 3) {
            // Updated to use Hook with Input Amount
            const inputAmount = parseFloat(paramAmount) || 0.1;
            addLog(`INITIATING SHIELD TRANSACTION (${inputAmount} SOL)...`, "info");
            const result = await executeIngress(inputAmount);

            if (result.success) {
                if (result.isSimulation) {
                    addLog(`DEVNET TX FAILED/SKIPPED. FALLBACK: ${result.txId}`, "warning");
                } else {
                    addLog(`ON-CHAIN DEPOSIT CONFIRMED: ${result.txId.substring(0, 8)}...`, "success");
                }
                addLog("ASSETS MIGRATED TO SOVEREIGN VAULT", "success");
                refreshBalance(); // Update public wallet balance
                setStage(4);
            } else {
                addLog(`FAILED: ${result.error}`, "error");
            }
        }
    };

    if (stage === 0) {
        return <LandingPage onEnter={() => setStage(1)} />;
    }

    return (
        <MainLayout logs={logs}>
            <PulseDashboard
                stage={stage}
                setStage={setStage}
                balance={balance}
                walletAddress={walletAddress}
                publicBalance={publicBalance}
                isShielded={stage === 4}
                onActivate={handleStageAction}
                pin={pin}
                updateVault={updateVault}
            />

            <VerificationModal
                isOpen={showVerification}
                onVerify={(data) => {
                    setShowVerification(false);
                    setStage(3);
                }}
                onClose={() => setShowVerification(false)}
            />
        </MainLayout>
    );
}

export default App;
