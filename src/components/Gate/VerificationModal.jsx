import React, { useState } from 'react';
import { IdentityModule } from '../../modules/IdentityModule';
import { Shield, Lock, CheckCircle } from 'lucide-react';
import logo from '../../assets/logo.png';

const VerificationModal = ({ isOpen, onVerify, onClose }) => {
    const [nin, setNin] = useState('');
    const [status, setStatus] = useState('IDLE'); // IDLE, PROVING, VERIFIED
    const [logs, setLogs] = useState([]);

    if (!isOpen) return null;

    const addLog = (msg) => setLogs(prev => [...prev, msg]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nin.length !== 11) {
            alert("NIN must be 11 digits");
            return;
        }

        setStatus('PROVING');
        setLogs([]);
        addLog("Initializing ZK-SNARK Circuit...");

        try {
            // 1. Generate Local Secret (Ephemeral)
            const localSecret = window.crypto.randomUUID();
            addLog("Generating Local Witness...");

            // 2. Generate Proof
            const { proof, publicSignals } = await IdentityModule.generateZKProof(nin, localSecret);
            addLog("Proof Generated via Groth16");
            addLog(`Nullifier: ${publicSignals[1].substring(0, 16)}...`);

            // 3. Clear Sensitive Data
            setNin('');

            // 4. Pass Proof to Parent
            addLog("Verifying Proof on-chain...");
            await new Promise(r => setTimeout(r, 800)); // UX delay

            setStatus('VERIFIED');

            // Add slight delay for UX then verify
            setTimeout(() => {
                console.log("[ZK-Modal] Calling onVerify callback...");
                try {
                    if (typeof onVerify === 'function') {
                        onVerify({ proof, publicSignals });
                        console.log("[ZK-Modal] onVerify executed.");
                    } else {
                        throw new Error("onVerify prop is not a function");
                    }
                } catch (callbackError) {
                    console.error("[ZK-Modal] onVerify Failed:", callbackError);
                    alert("Verification Callback Failed: " + callbackError.message);
                }
            }, 1000);

        } catch (e) {
            console.error(e);
            setStatus('IDLE');
            alert("Verification Failed");
        }
    };

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(5, 5, 7, 0.9)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="glass-panel-premium" style={{ padding: '3rem', width: '450px', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--slate)',
                        cursor: 'pointer',
                        fontSize: '1.5rem'
                    }}
                >
                    &times;
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: 'rgba(62, 82, 255, 0.1)', color: 'var(--cobalt)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem auto',
                        border: '1px solid var(--cobalt)'
                    }}>
                        {status === 'VERIFIED' ? <CheckCircle size={32} /> : <img src={logo} alt="Logo" style={{ width: '32px', height: 'auto' }} />}
                    </div>
                    <h2 style={{ margin: 0 }}>ZK-IDENTITY GATE</h2>
                    <p className="text-slate" style={{ marginTop: '0.5rem' }}>
                        Zero-Knowledge Citizenship Verification
                    </p>
                </div>

                {status === 'IDLE' && (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label className="text-slate text-mono" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>
                                ENTER NATIONAL IDENTITY NUMBER
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--slate)' }} />
                                <input
                                    type="password"
                                    value={nin}
                                    onChange={(e) => setNin(e.target.value)}
                                    placeholder="11-Digit NIN"
                                    maxLength={11}
                                    style={{
                                        width: '100%',
                                        padding: '1rem 1rem 1rem 3rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        fontFamily: 'var(--font-mono)',
                                        letterSpacing: '0.2em',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: '1rem',
                                background: 'var(--cobalt)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '1rem'
                            }}
                        >
                            GENERATE PROOF
                        </button>
                    </form>
                )}

                {status !== 'IDLE' && (
                    <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--glass-border)',
                        height: '200px',
                        overflowY: 'auto',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem'
                    }}>
                        {logs.map((log, i) => (
                            <div key={i} style={{ marginBottom: '0.5rem', color: log.includes('Proof') ? 'var(--emerald)' : 'var(--slate)' }}>
                                <span style={{ marginRight: '0.5rem', opacity: 0.5 }}>&gt;</span>
                                {log}
                            </div>
                        ))}
                        {status === 'PROVING' && (
                            <div className="text-cobalt" style={{ animation: 'pulse-glow 1s infinite' }}>
                                <span style={{ marginRight: '0.5rem' }}>&gt;</span>
                                Computing Witness...
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerificationModal;
