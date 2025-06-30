'use client';
/** @jsxImportSource react */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { connect, disconnect } from 'starknetkit';
import { AccountInterface, ProviderInterface } from 'starknet';

interface WalletContextType {
  account: AccountInterface | null;
  provider: ProviderInterface | null;
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [provider, setProvider] = useState<ProviderInterface | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const { wallet } = await connect({
        webWalletUrl: "https://web.argent.xyz",
        argentMobileOptions: {
          dappName: "OpenTask",
          url: window.location.hostname,
          chainId: "SN_SEPOLIA", // or "SN_MAIN" for mainnet
        },
      });

      if (wallet && wallet.isConnected) {
        setAccount(wallet.account);
        setProvider(wallet.provider);
        setAddress(wallet.selectedAddress);
        setIsConnected(true);
        
        // Store connection state in localStorage
        localStorage.setItem('wallet_connected', 'true');
        localStorage.setItem('wallet_address', wallet.selectedAddress);
      }
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      setAccount(null);
      setProvider(null);
      setAddress(null);
      setIsConnected(false);
      setError(null);
      
      // Clear connection state from localStorage
      localStorage.removeItem('wallet_connected');
      localStorage.removeItem('wallet_address');
    } catch (err) {
      console.error('Failed to disconnect wallet:', err);
      setError('Failed to disconnect wallet.');
    }
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const wasConnected = localStorage.getItem('wallet_connected');
      if (wasConnected === 'true') {
        await connectWallet();
      }
    };
    
    checkConnection();
  }, []);

  const value: WalletContextType = {
    account,
    provider,
    address,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    error,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};