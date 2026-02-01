import { useState, useEffect, useCallback } from 'react';
import { SecurityModule } from '../modules/SecurityModule';

const STORAGE_KEY = 'nicrypt_sovereign_state';
const DEFAULT_STATE = {
    isShielded: false,
    balance: '0.00',
    transactions: [],
    spendingWallet: null
};

/**
 * A hook that manages the secure, encrypted local vault.
 * Logic: Reads from persistent storage -> Decrypts to Memory -> Returns State.
 * @param {string} pin - The user's PIN for derivation.
 */
export const useNicryptVault = (pin) => {
    const [vaultState, setVaultState] = useState(null);
    const [isLocked, setIsLocked] = useState(true);
    const [error, setError] = useState(null);

    // Initial Load & Decrypt
    useEffect(() => {
        const loadVault = async () => {
            if (!pin) {
                setVaultState(null);
                setIsLocked(true);
                return;
            }

            const encryptedBlob = localStorage.getItem(STORAGE_KEY);

            // If new vault, initialize with default
            if (!encryptedBlob) {
                console.log("[Vault] Initializing new sovereign vault...");
                await saveVault(DEFAULT_STATE, pin);
                setVaultState(DEFAULT_STATE);
                setIsLocked(false);
                return;
            }

            // Decrypt existing
            try {
                console.log("[Vault] Decrypting state...");
                const decrypted = await SecurityModule.decryptState(encryptedBlob, pin);
                setVaultState(decrypted);
                setIsLocked(false);
                setError(null);
            } catch (e) {
                console.error("[Vault] Unlock failed:", e);
                setIsLocked(true);
                setError("Invalid PIN or Corrupted Vault");
            }
        };

        loadVault();
    }, [pin]);

    /**
     * Saves the new state to the vault (Encrypted).
     */
    const saveVault = useCallback(async (newState, activePin = pin) => {
        if (!activePin) return;
        try {
            const encrypted = await SecurityModule.encryptState(newState, activePin);
            localStorage.setItem(STORAGE_KEY, encrypted);
            setVaultState(newState); // Update memory
            console.log("[Vault] State encrypted and saved.");
        } catch (e) {
            console.error("[Vault] Save failed:", e);
            setError("Failed to save vault state");
        }
    }, [pin]);

    /**
     * Updates specific fields in the vault.
     */
    const updateVault = useCallback(async (updates) => {
        if (!vaultState) return;

        let newBalance = parseFloat(vaultState.balance || "0");

        // Handle Balance Arithmetic
        if (updates.op === 'DEPOSIT' && updates.amount) {
            newBalance += parseFloat(updates.amount);
        } else if (updates.op === 'WITHDRAW' && updates.amount) {
            newBalance -= parseFloat(updates.amount);
        }

        const newState = {
            ...vaultState,
            ...updates,
            balance: newBalance.toFixed(2) // Ensure uniform string format
        };

        await saveVault(newState);
    }, [vaultState, saveVault]);

    /**
     * Hard Reset: Wipes the vault for demo purposes.
     */
    /**
     * Hard Reset: Wipes the vault for demo purposes.
     */
    const clearVault = useCallback(async () => {
        console.log("[Vault] Wiping storage...");
        // Explicitly overwrite with default state to ensure persistence is reset
        const emptyState = { ...DEFAULT_STATE, balance: '0.00' };

        try {
            // Force write to storage
            await saveVault(emptyState, pin);
            setVaultState(emptyState);
            console.log("[Vault] Storage overwritten with 0.00 balance.");
        } catch (e) {
            console.error("[Vault] Detailed Wipe Failed:", e);
            // Fallback
            localStorage.removeItem(STORAGE_KEY);
            setVaultState(emptyState);
        }
    }, [pin, saveVault]);

    return {
        vaultState,
        isLocked,
        error,
        updateVault,
        clearVault
    };
};
