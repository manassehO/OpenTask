'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '~/hooks/useWallet';
import Button from '../ui/button';

interface WalletConnectProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function WalletConnect({ 
  className = '', 
  variant = 'default',
  size = 'md' 
}: WalletConnectProps) {
  const { 
    address, 
    isConnected, 
    isConnecting, 
    connectWallet, 
    disconnectWallet, 
    error 
  } = useWallet();
  
  const [showDropdown, setShowDropdown] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    await connectWallet();
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setShowDropdown(false);
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <Button
          variant={variant}
          size={size}
          className={`${className} flex items-center gap-2`}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          {formatAddress(address)}
        </Button>
        
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-3 border-b border-gray-100">
              <p className="text-sm text-gray-600">Connected Wallet</p>
              <p className="text-sm font-mono text-gray-900 break-all">{address}</p>
            </div>
            <div className="p-2">
              <button
                onClick={handleDisconnect}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleConnect}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Connecting...
          </div>
        ) : (
          'Connect Wallet'
        )}
      </Button>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-600 text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// Wallet status indicator component
export function WalletStatus() {
  const { isConnected, address } = useWallet();
  
  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        Wallet not connected
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 text-sm text-green-600">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      Connected: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
    </div>
  );
}