import { useState, useEffect, useRef } from 'react';
import { SolanaModule } from '../modules/SolanaModule';

export const useSolanaBalance = (walletAddress) => {
    const [publicBalance, setPublicBalance] = useState("0.0000");
    const [isLoading, setIsLoading] = useState(false);
    const intervalRef = useRef(null);

    const fetchBalance = async () => {
        if (!walletAddress) return;

        try {
            // Don't set loading true on every poll to avoid UI flicker
            const bal = await SolanaModule.getBalance(walletAddress);
            setPublicBalance(bal);
        } catch (e) {
            console.error("[Balance Hook] Failed to fetch:", e);
        }
    };

    useEffect(() => {
        if (!walletAddress) {
            setPublicBalance("0.0000");
            return;
        }

        // Initial fetch
        setIsLoading(true);
        fetchBalance().finally(() => setIsLoading(false));

        // Poll every 10 seconds
        intervalRef.current = setInterval(fetchBalance, 10000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [walletAddress]);

    return { publicBalance, isLoading, refetch: fetchBalance };
};
