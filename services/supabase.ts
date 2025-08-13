import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  phone: string
  name: string
  wallet_address?: string
  wallet_balance: number
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  amount: number
  type: 'credit' | 'debit'
  category: string
  description: string
  status: 'completed' | 'pending' | 'failed'
  reference?: string
  created_at: string
}

// Auth functions
export const authService = {
  // Sign up new user
  signUp: async (email: string, password: string, userData: { name: string; phone: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone,
        }
      }
    })
    
    if (error) throw error
    
    // Create user profile in database
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          name: userData.name,
          phone: userData.phone,
          wallet_address: `BYT${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          wallet_balance: 0
        })
      
      if (profileError) throw profileError
    }
    
    return data
  },

  // Sign in user
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  // Sign out user
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user profile
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null
    
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error) throw error
    return profile
  },

  // Update user profile
  updateProfile: async (userId: string, updates: Partial<User>) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Wallet functions
export const walletService = {
  // Get wallet balance
  getBalance: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data.wallet_balance
  },

  // Update wallet balance
  updateBalance: async (userId: string, newBalance: number) => {
    const { data, error } = await supabase
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Add transaction
  addTransaction: async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get user transactions
  getTransactions: async (userId: string, limit: number = 20) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }
}