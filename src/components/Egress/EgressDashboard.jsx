import React, { useState, useEffect } from 'react';
import { useNicryptEgress } from '../../hooks/useNicryptEgress';
import { SolvencyQR } from './SolvencyQR';
import { ThreatMonitor } from '../../modules/ThreatMonitor';
import { Shield, Lock, CheckCircle } from 'lucide-react';

const EgressDashboard = ({ pin, balance, updateVault, onBack }) => {
    const { status, auditLog, error, sovereignAddress, startEgress } = useNicryptEgress();

    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [recipientStatus, setRecipientStatus] = useState({ safe: true, message: '' });
    const [localPin, setLocalPin] = useState('');

    // Real-time Threat Monitoring
    useEffect(() => {
        if (recipient.length > 30) {
            const analysis = ThreatMonitor.analyzeAddress(recipient);
            setRecipientStatus({
                safe: analysis.safe,
                message: analysis.message,
                riskLevel: analysis.riskLevel
            });
        } else {
            setRecipientStatus({ safe: true, message: '' });
        }
    }, [recipient]);

    const handleStart = () => {
        if (!amount || parseFloat(amount) <= 0) return;
        if (!recipient) {
            alert("Please enter a destination address");
            return;
        }
        if (!recipientStatus.safe) {
            // In a real app we might block entirely, but for demo we warn
            if (!window.confirm(`WARNING: ${recipientStatus.message}\nDo you still want to proceed?`)) {
                return;
            }
        }
        if (localPin !== pin) {
            alert("Security Violation: PIN Mismatch");
            return;
        }
        startEgress(localPin, parseFloat(amount), recipient, updateVault);
    };

    const copyToClipboard = () => {
        if (sovereignAddress) {
            navigator.clipboard.writeText(sovereignAddress);
            alert("Address Copied to Clipboard (Zero-Trace)");
        }
    };

    const containerStyle = {
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 50
    };

    const cardStyle = {
        padding: '2.5rem',
        border: '1px solid rgba(62, 82, 255, 0.3)',
        boxShadow: '0 0 50px rgba(62, 82, 255, 0.15)',
        position: 'relative',
        overflow: 'hidden'
    };

    const inputStyle = {
        width: '100%',
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid var(--glass-border)',
        borderRadius: '8px',
        padding: '1rem',
        color: 'white',
        fontSize: '1.2rem',
        fontFamily: 'var(--font-mono)',
        outline: 'none',
        transition: 'all 0.2s',
        boxSizing: 'border-box'
    };

    const labelStyle = {
        fontSize: '0.75rem',
        color: 'var(--cobalt)',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        letterSpacing: '0.1em',
        display: 'block',
        marginBottom: '0.5rem'
    };

    // View: IDLE (Input)
    if (status === 'IDLE') {
        return (
            <div style={containerStyle} className="animate-fade-in">
                {/* Premium Glass Modal */}
                <div className="glass-panel-premium" style={cardStyle}>

                    {/* Decorative Top Accent */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, transparent, var(--cobalt), transparent)', opacity: 0.5 }}></div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(62, 82, 255, 0.1)', borderRadius: '50%', border: '1px solid rgba(62, 82, 255, 0.2)' }}>
                            <Shield size={32} color="var(--cobalt)" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Confidential Egress</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--slate)', fontFamily: 'var(--font-mono)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Establishing Cold Trail via Token-2022</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {/* Balance Display */}
                        <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shielded Balance</span>
                            <span className="text-emerald glow-text-emerald" style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{balance} SOL</span>
                        </div>

                        {/* Recipient Input (Spec v2) */}
                        <div>
                            <label style={labelStyle}>Destination Address</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    style={{
                                        ...inputStyle,
                                        borderColor: !recipientStatus.safe ? 'var(--crimson)' : 'var(--glass-border)',
                                        paddingRight: '2.5rem',
                                        fontSize: '0.9rem'
                                    }}
                                    placeholder="Solana Wallet Address"
                                />
                                {recipient.length > 5 && (
                                    <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                                        {recipientStatus.safe ?
                                            <Shield size={16} color="var(--emerald)" /> :
                                            <Shield size={16} color="var(--crimson)" />
                                        }
                                    </div>
                                )}
                            </div>
                            {recipientStatus.message && (
                                <div style={{ fontSize: '0.7rem', color: recipientStatus.safe ? 'var(--emerald)' : 'var(--crimson)', marginTop: '4px' }}>
                                    {recipientStatus.safe ? "Verified Unlinked Wallet" : recipientStatus.message}
                                </div>
                            )}
                        </div>

                        {/* Amount Input */}
                        <div>
                            <label style={labelStyle}>Transfer Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={inputStyle}
                                placeholder="0.00"
                                onFocus={(e) => e.target.style.borderColor = 'var(--cobalt)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                            />
                        </div>

                        {/* PIN Confirmation */}
                        <div>
                            <label style={{ ...labelStyle, color: 'var(--crimson)' }}>Security PIN</label>
                            <input
                                type="password"
                                value={localPin}
                                onChange={(e) => setLocalPin(e.target.value)}
                                style={{ ...inputStyle, letterSpacing: '0.5em' }}
                                placeholder="••••"
                                onFocus={(e) => e.target.style.borderColor = 'var(--crimson)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                            />
                        </div>

                        <button
                            onClick={handleStart}
                            disabled={!amount || !localPin || !recipient}
                            style={{
                                marginTop: '1.5rem',
                                width: '100%',
                                padding: '1rem',
                                background: 'linear-gradient(90deg, var(--cobalt), #4f46e5)',
                                borderRadius: '8px',
                                border: 'none',
                                color: 'white',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                cursor: 'pointer',
                                opacity: (!amount || !localPin || !recipient) ? 0.5 : 1,
                                transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                            }}
                        >
                            <Lock size={16} />
                            Execute Private Settlement
                        </button>
                    </div>
                </div>

                <button onClick={onBack} style={{ display: 'block', margin: '1.5rem auto 0', background: 'none', border: 'none', color: 'var(--slate)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', opacity: 0.6 }}>
                    Cancel & Return to Vault
                </button>
            </div>
        );
    }

    // View: WORKING (Pulse)
    if (status === 'ANALYZING' || status === 'ENCRYPTING' || status === 'TRANSFERRING') {
        const pulseStyle = {
            width: '100px', height: '100px', borderRadius: '50%',
            border: '2px solid var(--cobalt)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', background: 'black',
            boxShadow: '0 0 50px var(--cobalt)',
            margin: '0 auto 3rem auto'
        };

        return (
            <div style={{ width: '100%', textAlign: 'center', position: 'relative', zIndex: 50 }}>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cobalt)', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    Status: {status}
                </div>

                {/* Cobalt Pulse Animation */}
                <div style={pulseStyle}>
                    <Lock size={40} color="var(--cobalt)" />
                </div>

                <div style={{ marginBottom: '3rem' }}>
                    <h2 className="glow-text-white" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, animation: 'pulse-glow 2s infinite' }}>
                        {status === 'ANALYZING' && "ANALYZING TARGET..."}
                        {status === 'ENCRYPTING' && "SIGNING EL-GAMAL..."}
                        {status === 'TRANSFERRING' && "EXECUTING ON-CHAIN..."}
                    </h2>
                    <p style={{ fontSize: '0.75rem', color: 'var(--cobalt)', fontFamily: 'var(--font-mono)', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                        Sovereign Link Active
                    </p>
                </div>

                {/* Audit Log */}
                <div style={{
                    width: '100%', maxWidth: '500px', margin: '0 auto', background: 'black',
                    border: '1px solid rgba(62, 82, 255, 0.3)', borderRadius: '8px', padding: '1.5rem',
                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textAlign: 'left',
                    boxShadow: '0 0 30px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.5)', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <span>Real-Time Audit</span>
                        <span className="text-emerald" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>● LIVE</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--slate)', textTransform: 'uppercase' }}>Destination:</span>
                        <span style={{ color: 'white' }}>
                            {sovereignAddress ? `${sovereignAddress.substring(0, 16)}...` : "PENDING..."}
                        </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--slate)', textTransform: 'uppercase' }}>Risk Level:</span>
                        <span style={{ color: recipientStatus.safe ? 'var(--emerald)' : 'var(--crimson)', fontWeight: 'bold' }}>
                            {recipientStatus.safe ? "VERIFIED SAFE" : "HIGH RISK"}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // View: COMPLETED / CLEAN PATH
    if (status === 'COMPLETED') {
        const successCardStyle = {
            ...cardStyle,
            borderColor: 'rgba(16, 185, 129, 0.2)',
            boxShadow: '0 0 30px rgba(0,0,0,0.5)'
        };

        return (
            <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: 'var(--emerald)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem 1.5rem', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.2)', width: 'fit-content', margin: '0 auto 2rem auto' }}>
                    <CheckCircle size={24} />
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Assets Transferred</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                    {/* Left: Sovereign Metrics */}
                    <div className="glass-panel-premium" style={{ ...successCardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <h3 style={{ fontSize: '0.75rem', color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Sovereign Identity Manifest</h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', background: 'rgba(0,0,0,0.6)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem', cursor: 'pointer' }} onClick={copyToClipboard}>
                                <div style={{ padding: '0.5rem', background: 'rgba(62, 82, 255, 0.2)', borderRadius: '4px' }}>
                                    <Lock size={16} color="var(--cobalt)" />
                                </div>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '200px' }}>
                                    {sovereignAddress}
                                </span>
                                <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--slate)', border: '1px solid rgba(255,255,255,0.2)', padding: '2px 4px', borderRadius: '2px' }}>COPY</span>
                            </div>

                            <div style={{ display: 'grid', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Metdata Link</span>
                                    <span className="text-emerald glow-text-emerald" style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>UNLINKED</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Encryption Protocol</span>
                                    <span style={{ color: 'white', fontFamily: 'var(--font-mono)' }}>TK22-Confidential-v1</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                            <button onClick={onBack} style={{ width: '100%', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', borderRadius: '8px', color: 'var(--slate)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 'bold', cursor: 'pointer' }}>
                                Close & Return to Dashboard
                            </button>
                        </div>
                    </div>

                    {/* Right: Solvency QR */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <SolvencyQR
                            data={JSON.stringify(auditLog)}
                            title="Sovereign Solvency Proof"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (status === 'FAILED') {
        return (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem', border: '1px solid rgba(255, 46, 77, 0.5)' }}>
                <h2 style={{ color: 'var(--crimson)', fontWeight: 'bold', marginBottom: '1rem' }}>CONFIDENTIALITY COMPROMISED</h2>
                <p style={{ color: 'var(--slate)', marginBottom: '1.5rem' }}>{error}</p>
                <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1.5rem', background: 'rgba(255, 46, 77, 0.2)', color: 'var(--crimson)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    System Reset
                </button>
            </div>
        );
    }

    return null;
};

export default EgressDashboard;
