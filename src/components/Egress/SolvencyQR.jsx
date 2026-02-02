import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export const SolvencyQR = ({ data, title = "Solvency Proof" }) => {

    // Parse data to extract signature for display if possible
    let signatureDisplay = "Encrypted Blob";
    try {
        const parsed = JSON.parse(data);
        if (parsed.solvencyProof && parsed.solvencyProof.signature) {
            signatureDisplay = parsed.solvencyProof.signature.substring(0, 24) + "...";
        }
    } catch (e) { /* ignore */ }

    const containerStyle = {
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid rgba(62, 82, 255, 0.3)',
        background: 'rgba(5, 5, 7, 0.6)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 0 30px rgba(62, 82, 255, 0.1)'
    };

    return (
        <div style={containerStyle}>
            <h3 style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</h3>

            <div style={{ position: 'relative', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'white' }}>
                <QRCodeSVG
                    value={data}
                    size={180}
                    level="M"
                    fgColor="#000000"
                    bgColor="#FFFFFF"
                />
            </div>

            <div style={{ fontSize: '0.65rem', color: 'var(--slate)', textAlign: 'center', maxWidth: '200px', wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}>
                {signatureDisplay}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--emerald)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 10px var(--emerald)' }}></span>
                Ed25519 Signed & Verifiable
            </div>
        </div>
    );
};
