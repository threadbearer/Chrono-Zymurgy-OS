// CHRONO-ZYMURGY OS Master Catalog Data Module
// Public Showcase Edition: 24-kit catalog with original creative formulations.
// Large static catalog array externalized to kits.json (Crucible Token & Context Efficiency Rule).

import rawKits from './kits.json';

// Helper: Check if Chrono-Vault is unlocked via Environment Variable or Browser Key
export function isVaultUnlocked() {
  if (typeof window !== 'undefined') {
    const key = window.localStorage?.getItem('CHRONO_VAULT_KEY');
    if (key && key.trim().length > 0) return true;
    if (window.__CHRONO_VAULT_KEY__) return true;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CHRONO_VAULT_KEY) {
    return true;
  }
  return false;
}

export function unlockVault(secretKey) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('CHRONO_VAULT_KEY', secretKey);
    window.dispatchEvent(new Event('chrono-vault-changed'));
  }
}

export function lockVault() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('CHRONO_VAULT_KEY');
    window.dispatchEvent(new Event('chrono-vault-changed'));
  }
}

export const MASTER_KITS = rawKits;

// Helper to calculate custom kit cost savings
export function calculateSavings(retail, diy) {
  const savedAmount = Math.max(0, retail - diy);
  const percent = retail > 0 ? ((savedAmount / retail) * 100).toFixed(0) : 0;
  return { savedAmount: savedAmount.toFixed(2), percent };
}
