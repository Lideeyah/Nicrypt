import React, { useState } from 'react';
import { Shield, Lock, EyeOff, Zap, ChevronRight } from 'lucide-react';
import logo from '../../assets/logo.png';

const LandingPage = ({ onEnter }) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div style={{
            position: 'relative',
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowY: 'auto',
            backgroundColor: '#050507', // Hardcoded safety
            color: 'white',
            fontFamily: 'sans-serif'
        }}>

            {/* Background Grid & Effects */}
            <div className="bg-grid" style={{
                position: 'fixed', inset: 0, opacity: 0.2, pointerEvents: 'none'
            }}></div>
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '500px',
                background: 'linear-gradient(to bottom, rgba(62, 82, 225, 0.1), transparent)',
                pointerEvents: 'none'
            }}></div>

            {/* Navbar */}
            <nav style={{
                width: '100%', maxWidth: '1280px', padding: '1.5rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                zIndex: 10, boxSizing: 'border-box'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={logo} alt="Nicrypt Logo" style={{ height: '40px', width: 'auto' }} />
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.1em', color: 'white' }}>NICRYPT</span>
                </div>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: 'var(--slate)', fontFamily: 'var(--font-mono)' }} className="hide-mobile">
                    <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">MANIFESTO</span>
                    <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">ARCHITECTURE</span>
                    <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">AUDIT</span>
                </div>
                <button
                    onClick={onEnter}
                    style={{
                        padding: '0.5rem 1.5rem',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'transparent',
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.05em'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                    LAUNCH APP
                </button>
            </nav>

            {/* Hero Section */}
            <main style={{
                flex: 1, width: '100%', maxWidth: '1024px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '1.5rem', textAlign: 'center', zIndex: 10,
                marginTop: '3rem', marginBottom: '5rem'
            }}>

                <div className="animate-fade-in" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.375rem 1rem', borderRadius: '9999px',
                    border: '1px solid rgba(62, 82, 255, 0.3)', background: 'rgba(62, 82, 255, 0.05)',
                    marginBottom: '2rem'
                }}>
                    <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                        <span className="animate-cobalt-pulse" style={{ position: 'absolute', height: '100%', width: '100%', borderRadius: '50%', background: 'var(--cobalt)', opacity: 0.75 }}></span>
                        <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', background: 'var(--cobalt)' }}></span>
                    </span>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--cobalt)', letterSpacing: '0.1em' }}>SOVEREIGN LAYER V1.0 LIVE</span>
                </div>

                <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 700, letterSpacing: '-0.025em',
                    marginBottom: '1.5rem', lineHeight: 1.1, maxWidth: '900px'
                }}>
                    Decouple Identity.<br />
                    <span style={{
                        background: 'linear-gradient(to right, #ffffff, #9494A8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Preserve Sovereignty.
                    </span>
                </h1>

                <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--slate)', maxWidth: '600px',
                    marginBottom: '3rem', lineHeight: 1.6
                }}>
                    Transparency is for protocols. Privacy is for people.<br /><br />
                    Nicrypt is the only interface that lets you prove your right to transact without broadcasting your identity.
                    Sever the link between your history and your future. Move silent. Stay sovereign.
                </p>

                <button
                    onClick={onEnter}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    style={{
                        position: 'relative',
                        padding: '1rem 2rem',
                        background: 'white',
                        color: 'black',
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        borderRadius: '4px',
                        letterSpacing: '0.05em',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.3s'
                    }}
                >
                    <span style={{ position: 'relative', zIndex: 10 }}>ENTER THE SHIELD</span>
                    <ChevronRight size={20} style={{
                        position: 'relative', zIndex: 10,
                        transform: isHovering ? 'translateX(4px)' : 'translateX(0)',
                        transition: 'transform 0.3s'
                    }} />
                </button>

                {/* Metrics */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem',
                    marginTop: '6rem', width: '100%', borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '3rem'
                }}>
                    <Metric label="Encryption" value="AES-256-GCM" />
                    <Metric label="Zero-Knowledge" value="Groth16" />
                    <Metric label="Privacy Layer" value="Inco FHE" />
                    <Metric label="Settlement" value="Solana Token-22" />
                </div>
            </main>

            {/* Features Section */}
            <section style={{
                width: '100%', maxWidth: '1152px', padding: '5rem 1.5rem',
                zIndex: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'
            }}>
                <FeatureCard
                    icon={<Shield size={32} color="var(--cobalt)" />}
                    title="Identity Decoupler"
                    desc="Uses client-side ZK-proofs to verify your NIN membership without ever revealing the number itself."
                />
                <FeatureCard
                    icon={<EyeOff size={32} color="var(--emerald)" />}
                    title="Protocol Blindness"
                    desc="Your financial state is encrypted using Fully Homomorphic Encryption (FHE). Even the protocol cannot see your balance."
                />
                <FeatureCard
                    icon={<Zap size={32} color="var(--crimson)" />}
                    title="Confidential Egress"
                    desc="Settle funds to a fresh, strictly unlinked Sovereign Wallet using ElGamal encryption standard."
                />
            </section>

            <footer style={{
                width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)',
                padding: '2rem', textAlign: 'center', color: 'var(--slate)',
                fontSize: '0.75rem', fontFamily: 'var(--font-mono)'
            }}>
                Running in Sovereign Mode • Local Entropy Active
            </footer>
        </div>
    );
};

const Metric = ({ label, value }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <span style={{ fontSize: '1.125rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'white' }}>{value}</span>
    </div>
);

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-panel" style={{
        padding: '2rem', transition: 'background 0.3s', cursor: 'default'
    }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--glass-surface)'}
    >
        <div style={{
            marginBottom: '1.5rem', padding: '1rem', borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)', width: 'fit-content',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{title}</h3>
        <p style={{ color: 'var(--slate)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
    </div>
);

export default LandingPage;
