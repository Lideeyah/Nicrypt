import React, { useEffect, useRef } from 'react';

const IntelligenceFeed = ({ logs }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="glass-panel" style={{
            width: '300px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem',
            borderRight: '1px solid var(--glass-border)'
        }}>
            <div style={{
                marginBottom: '1rem',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                color: 'var(--slate)',
                textTransform: 'uppercase'
            }}>
                Intelligence Feed
            </div>

            <div ref={scrollRef} style={{
                flex: 1,
                overflowY: 'auto',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
            }}>
                {logs.map((log, index) => (
                    <div key={index} style={{ marginBottom: '0.5rem', opacity: 0.8 }}>
                        <span className="text-cobalt">[{log.time}]</span>{' '}
                        <span style={{ color: log.type === 'error' ? 'var(--crimson)' : 'var(--platinum)' }}>
                            {log.message}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IntelligenceFeed;
