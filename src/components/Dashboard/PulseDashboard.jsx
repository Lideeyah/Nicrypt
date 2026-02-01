import React, { useState } from 'react';
import { Shield, Eye, Lock, Globe, Zap, ArrowRight, Activity, Wallet, Wifi, CheckCircle, ChevronRight } from 'lucide-react';
import EgressDashboard from '../Egress/EgressDashboard';
// const EgressDashboard = ({ onBack }) => <div className="text-white p-10">MOCK EGRESS (Loading...) <button onClick={onBack} className="block mt-4 text-cobalt">Back</button></div>;

const STEPS = [
    { id: 1, label: 'EXPOSURE SCAN', icon: Globe },
    { id: 2, label: 'ZK-IDENTITY', icon: Shield },
    { id: 3, label: 'THE BRIDGE', icon: Zap },
    { id: 4, label: 'SOVEREIGN VAULT', icon: Lock },
];

const PulseDashboard = ({ balance, isShielded, onActivate, stage, setStage, walletAddress, publicBalance, pin, updateVault }) => {
    // stage: 1 | 2 | 3 | 4
    const [showEgress, setShowEgress] = useState(false);
    const [ingressAmount, setIngressAmount] = useState("0.1");

    return (
        <div style={{
            height: '100%',
            width: '100%',
            position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem',
            boxSizing: 'border-box',
            maxWidth: '1200px',
            margin: '0 auto',
            gap: '3rem'
        }}>
            {/* STEPPER HEADER */}
            <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center' }}>
                {STEPS.map((step, idx) => {
                    const isActive = stage === step.id;
                    const isCompleted = stage > step.id;
                    const Icon = step.icon;
                    return (
                        <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isActive || isCompleted ? 1 : 0.3 }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: isCompleted ? 'var(--emerald)' : (isActive ? 'var(--cobalt)' : 'rgba(255,255,255,0.1)'),
                                color: (isActive || isCompleted) ? 'white' : 'var(--slate)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.8rem', fontWeight: 700
                            }}>
                                {isCompleted ? <CheckCircle size={16} /> : idx + 1}
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }} className="text-mono">
                                {step.label}
                            </span>
                            {idx < STEPS.length - 1 && <ChevronRight size={16} className="text-slate" style={{ margin: '0 0.5rem' }} />}
                        </div>
                    );
                })}
            </div>

            {/* MAIN STAGE CONTENT */}
            <div className="glass-panel-premium" style={{ width: '100%', maxWidth: '800px', padding: '3rem', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>

                {/* STAGE 1: EXPOSURE */}
                {stage === 1 && (
                    <>
                        <div className="glow-red-pulse" style={{ padding: '2rem', borderRadius: '50%', background: 'rgba(255, 46, 77, 0.1)', marginBottom: '2rem' }}>
                            <Globe size={64} className="text-crimson" />
                        </div>
                        <h2 className="text-crimson" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>PUBLIC EXPOSURE DETECTED</h2>
                        <p className="text-slate" style={{ maxWidth: '500px', marginBottom: '2rem' }}>
                            Your wallet activity, IP address, and transaction history are visible on the public ledger.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%', marginBottom: '2rem' }}>
                            <DataCard icon={<Wallet />} label="WALLET" value={walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` : "NOT CONNECTED"} isExposed={true} />
                            <DataCard icon={<Wifi />} label="BALANCE" value={publicBalance ? `${publicBalance} SOL` : "..."} isExposed={true} />
                            <DataCard icon={<Activity />} label="STATUS" value="KYC LINKED" isExposed={true} />
                        </div>
                        <Button onClick={onActivate}>BEGIN SHIELDING SEQUENCE &rarr;</Button>
                    </>
                )}

                {/* STAGE 2: IDENTITY */}
                {stage === 2 && (
                    <>
                        <div style={{ padding: '2rem', borderRadius: '50%', background: 'rgba(62, 82, 255, 0.1)', marginBottom: '2rem', border: '1px solid var(--cobalt)' }}>
                            <Shield size={64} className="text-cobalt" />
                        </div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>ZK-IDENTITY GATE</h2>
                        <p className="text-slate" style={{ maxWidth: '500px', marginBottom: '2rem' }}>
                            Prove citizenship without revealing your identity. A Zero-Knowledge proof generates a unique nullifier for the Shield.
                        </p>
                        <Button onClick={onActivate}>GENERATE PROOF</Button>
                    </>
                )}

                {/* STAGE 3: THE BRIDGE (Updated with Input) */}
                {stage === 3 && (
                    <>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'
                        }}>
                            <Zap size={40} color="white" />
                        </div>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>THE BRIDGE</h2>
                        <p style={{ color: 'var(--slate)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            Sign a transaction to verify verification and deposit assets into the Shield Program.
                        </p>

                        <div style={{ marginBottom: '2rem', textAlign: 'left', width: '100%', maxWidth: '400px' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--cobalt)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>
                                Amount to Shield (SOL)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={ingressAmount}
                                onChange={(e) => setIngressAmount(e.target.value)}
                                style={{
                                    width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid var(--glass-border)', borderRadius: '8px',
                                    color: 'white', fontSize: '1.2rem', fontFamily: 'var(--font-mono)', outline: 'none',
                                    borderColor: parseFloat(ingressAmount) > parseFloat(publicBalance) ? 'var(--crimson)' : 'var(--glass-border)',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {parseFloat(ingressAmount) > parseFloat(publicBalance) && (
                                <div style={{ color: 'var(--crimson)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                    Insufficient funds (Max: {publicBalance} SOL)
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => onActivate(ingressAmount)}
                            disabled={!ingressAmount || parseFloat(ingressAmount) <= 0 || parseFloat(ingressAmount) > parseFloat(publicBalance)}
                            className="btn-primary"
                            style={{
                                width: '100%', maxWidth: '400px', padding: '1rem', fontSize: '1rem',
                                opacity: (!ingressAmount || parseFloat(ingressAmount) > parseFloat(publicBalance)) ? 0.5 : 1,
                                cursor: (!ingressAmount || parseFloat(ingressAmount) > parseFloat(publicBalance)) ? 'not-allowed' : 'pointer',
                                background: 'var(--cobalt)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600
                            }}
                        >
                            SIGN & DEPOSIT (DEVNET)
                        </button>
                    </>
                )}

                {/* STAGE 4: SOVEREIGN */}
                {stage === 4 && (
                    <>
                        <div className="glow-cobalt-pulse" style={{ padding: '2rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', marginBottom: '2rem' }}>
                            <Lock size={64} className="text-emerald" />
                        </div>
                        <h2 className="text-emerald" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>SOVEREIGN VAULT ACTIVE</h2>
                        <p className="text-slate" style={{ maxWidth: '500px', marginBottom: '2rem' }}>
                            Your assets are now encrypted and shielded from public view.
                        </p>

                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--slate)' }}>SHIELDED BALANCE</div>
                            <div className="text-mono" style={{ fontSize: '3.5rem', fontWeight: 700, color: 'white' }}>
                                {balance} <span style={{ fontSize: '1.5rem', color: 'var(--emerald)' }}>SOL</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', maxWidth: '500px' }}>
                            <DataCard icon={<Eye />} label="VISIBILITY" value="ONLY YOU" isSecure={true} />
                            <DataCard icon={<Lock />} label="ENCRYPTION" value="AES-256" isSecure={true} />
                        </div>

                        <div className="flex gap-4 mt-6" style={{ marginTop: '2rem' }}>
                            <Button onClick={() => setShowEgress(true)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ArrowRight size={16} />
                                    INITIATE EGRESS
                                </div>
                            </Button>
                        </div>
                    </>
                )}

            </div>

            {/* EGRESS OVERLAY MOUNTED AT ROOT LEVEL */}
            {stage === 4 && showEgress && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    animation: 'fade-in 0.3s ease-out forwards'
                }}>
                    <div style={{ width: '100%', maxWidth: '600px', position: 'relative' }}>
                        <EgressDashboard
                            pin={pin}
                            balance={balance}
                            updateVault={updateVault}
                            onBack={() => setShowEgress(false)}
                        />
                    </div>
                </div>
            )}
        </div >
    );
};

const DataCard = ({ icon, label, value, isExposed, isSecure }) => (
    <div style={{
        background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)',
        border: `1px solid ${isExposed ? 'var(--crimson)' : (isSecure ? 'var(--emerald)' : 'var(--glass-border)')}`,
        textAlign: 'left'
    }}>
        <div style={{ color: 'var(--slate)', marginBottom: '0.5rem' }}>{icon}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--slate)', marginBottom: '0.2rem' }}>{label}</div>
        <div className="text-mono" style={{ fontSize: '0.9rem', color: isExposed ? 'var(--crimson)' : (isSecure ? 'var(--emerald)' : 'white') }}>
            {value}
        </div>
    </div>
);

const Button = ({ children, onClick }) => (
    <button onClick={onClick} style={{
        background: 'var(--cobalt)', color: 'white', padding: '1rem 2rem', border: 'none',
        borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
        boxShadow: '0 0 20px var(--cobalt-glow)', transition: 'transform 0.1s'
    }}>
        {children}
    </button>
);

export default PulseDashboard;
