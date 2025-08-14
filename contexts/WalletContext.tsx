import React, { createContext, ReactNode } from 'react';

// Simplified wallet context since we're not using wallets anymore
interface WalletContextType {
  balance: number;
  transactions: any[];
  loading: boolean;
}

export const WalletContext = createContext<WalletContextType>({
  balance: 0,
  transactions: [],
  loading: false,
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  // No wallet functionality needed with new system
  const value = {
    balance: 0,
    transactions: [],
    loading: false,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};