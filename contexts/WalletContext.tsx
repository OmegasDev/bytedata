import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AuthContext } from './AuthContext';

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  updateBalance: (amount: number) => void;
  debitWallet: (amount: number) => boolean;
  creditWallet: (amount: number) => void;
}

export const WalletContext = createContext<WalletContextType>({
  balance: 0,
  transactions: [],
  addTransaction: () => {},
  updateBalance: () => {},
  debitWallet: () => false,
  creditWallet: () => {},
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [balance, setBalance] = useState(14.26);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      amount: 1000,
      type: 'debit',
      category: 'Transfer',
      description: 'to JIDDA GONI YUSUF',
      date: new Date().toISOString(),
      status: 'completed',
    },
    {
      id: '2',
      amount: 1000,
      type: 'credit',
      category: 'Transfer',
      description: 'from IFEANYICHUKWU CHARLES SUNDAY',
      date: new Date().toISOString(),
      status: 'completed',
    },
  ]);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const updateBalance = (amount: number) => {
    setBalance(amount);
  };

  const debitWallet = (amount: number): boolean => {
    if (balance >= amount) {
      setBalance((prev) => prev - amount);
      return true;
    }
    return false;
  };

  const creditWallet = (amount: number) => {
    setBalance((prev) => prev + amount);
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        addTransaction,
        updateBalance,
        debitWallet,
        creditWallet,
      }}>
      {children}
    </WalletContext.Provider>
  );
};