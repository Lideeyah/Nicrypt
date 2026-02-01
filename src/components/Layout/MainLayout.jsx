import React from 'react';
import IntelligenceFeed from '../Sidebar/IntelligenceFeed';

const MainLayout = ({ logs, children }) => {
    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
            backgroundColor: 'var(--obsidian)',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Animated Grid Background */}
            <div className="bg-grid" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* Sidebar */}
            <div style={{
                width: '320px',
                flexShrink: 0,
                zIndex: 10,
                borderRight: '1px solid var(--glass-border)',
                background: 'rgba(5, 5, 7, 0.8)',
                backdropFilter: 'blur(10px)'
            }}>
                <IntelligenceFeed logs={logs} />
            </div>

            {/* Main Content */}
            <div style={{
                flex: 1,
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden'
            }}>
                {children}
            </div>
        </div>
    );
};

export default MainLayout;
