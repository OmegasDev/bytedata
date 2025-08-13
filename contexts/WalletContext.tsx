import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { walletService, Transaction } from '@/services/supabase';

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  refreshWallet: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateBalance: (amount: number) => Promise<void>;
  debitWallet: (amount: number) => Promise<boolean>;
  creditWallet: (amount: number) => Promise<void>;
}

export const WalletContext = createContext<WalletContextType>({
  balance: 0,
  transactions: [],
  loading: false,
  refreshWallet: async () => {},
  addTransaction: async () => {},
  updateBalance: async () => {},
  debitWallet: async () => false,
  creditWallet: async () => {},
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      refreshWallet();
    } else {
      setBalance(0);
      setTransactions([]);
    }
  }, [user]);

  const refreshWallet = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [walletBalance, userTransactions] = await Promise.all([
        walletService.getBalance(user.id),
        walletService.getTransactions(user.id)
      ]);
      
      setBalance(walletBalance);
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Error refreshing wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return;

    try {
      const newTransaction = await walletService.addTransaction({
        ...transactionData,
        user_id: user.id,
      });
      
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateBalance = async (newBalance: number) => {
    if (!user) return;

    try {
      await walletService.updateBalance(user.id, newBalance);
      setBalance(newBalance);
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  };

  const debitWallet = async (amount: number): Promise<boolean> => {
    if (!user || balance < amount) return false;

    try {
      const newBalance = balance - amount;
      await updateBalance(newBalance);
      return true;
    } catch (error) {
      console.error('Error debiting wallet:', error);
      return false;
    }
  };

  const creditWallet = async (amount: number) => {
    if (!user) return;

    try {
      const newBalance = balance + amount;
      await updateBalance(newBalance);
    } catch (error) {
      console.error('Error crediting wallet:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        loading,
        refreshWallet,
        addTransaction,
        updateBalance,
        debitWallet,
        creditWallet,
      }}>
      {children}
    </WalletContext.Provider>
  );
};