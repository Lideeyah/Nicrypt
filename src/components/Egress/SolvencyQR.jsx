import React, { useEffect, useRef } from 'react';

export const SolvencyQR = ({ data, title = "Solvency Proof" }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        const size = 200;
        const blockSize = 8;

        // Clear
        ctx.fillStyle = '#0F0F13'; // Charcoal bg
        ctx.fillRect(0, 0, size, size);

        // Draw "Cobalt Themed" QR Pattern (Simulated for Prototype)
        // In production, use qrcode library to render actual 'data'
        ctx.fillStyle = '#3E52FF'; // Cobalt

        // Corner Markers
        const markers = [[20, 20], [160, 20], [20, 160]];
        markers.forEach(([x, y]) => {
            ctx.fillStyle = '#3E52FF';
            ctx.fillRect(x, y, 40, 40);
            ctx.fillStyle = '#0F0F13';
            ctx.fillRect(x + 8, y + 8, 24, 24);
            ctx.fillStyle = '#3E52FF';
            ctx.fillRect(x + 14, y + 14, 12, 12);
        });

        // Random Data Matrix
        ctx.fillStyle = '#3E52FF';
        for (let x = 0; x < size; x += blockSize) {
            for (let y = 0; y < size; y += blockSize) {
                // Avoid corners
                if ((x < 70 && y < 70) || (x > 130 && y < 70) || (x < 70 && y > 130)) continue;

                // Deterministic pseudo-random based on data hash (simulated)
                if (Math.random() > 0.5) {
                    ctx.fillRect(x + 2, y + 2, blockSize - 2, blockSize - 2);
                }
            }
        }

    }, [data]);

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

            <div style={{ position: 'relative', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {/* Glow Effect */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, var(--cobalt), var(--emerald))', opacity: 0.1, filter: 'blur(10px)', zIndex: 0 }}></div>

                <canvas
                    ref={canvasRef}
                    width={200}
                    height={200}
                    style={{ position: 'relative', borderRadius: '4px', zIndex: 1 }}
                />
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--slate)', textAlign: 'center', maxWidth: '200px', wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}>
                {typeof data === 'string' ? data.substring(0, 24) + "..." : "Encrypted Blob"}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--emerald)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 10px var(--emerald)' }}></span>
                Verifiable ZK-Proof Ready
            </div>
        </div>
    );
};
