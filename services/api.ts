import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to get auth token
const getAuthToken = async () => {
  return await AsyncStorage.getItem('auth_token');
};

// Helper function to make authenticated requests
const makeRequest = async (url: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    return makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  refreshToken: async () => {
    return makeRequest('/auth/refresh', {
      method: 'POST',
    });
  },
};

// VTPass API (via backend)
export const vtpassAPI = {
  getVariationCodes: async (service: 'data' | 'airtime') => {
    return makeRequest(`/api/vtpass/variation-codes?service=${service}`);
  },

  purchase: async (purchaseData: {
    userId?: string;
    reference: string;
    serviceType: 'data' | 'airtime';
    network: string;
    planCode: string;
    phone: string;
    amount: number;
    paymentMethod: 'wallet' | 'card';
  }) => {
    return makeRequest('/api/purchase', {
      method: 'POST',
      body: JSON.stringify(purchaseData),
    });
  },
};

// Paystack API (via backend)
export const paystackAPI = {
  initialize: async (paymentData: {
    amount: number;
    email: string;
    reference: string;
    currency?: string;
    callback_url?: string;
    metadata?: any;
  }) => {
    return makeRequest('/api/paystack/initialize', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  verify: async (reference: string) => {
    return makeRequest(`/api/paystack/verify/${reference}`);
  },
};

// Wallet API
export const walletAPI = {
  getBalance: async (userId: string) => {
    return makeRequest(`/api/wallet/balance/${userId}`);
  },

  getTransactions: async (userId: string, limit: number = 20) => {
    return makeRequest(`/api/wallet/transactions/${userId}?limit=${limit}`);
  },

  fundWallet: async (userId: string, amount: number, paymentMethod: string) => {
    return makeRequest('/api/wallet/fund', {
      method: 'POST',
      body: JSON.stringify({ userId, amount, paymentMethod }),
    });
  },
};

// Transaction API
export const transactionAPI = {
  getStatus: async (reference: string) => {
    return makeRequest(`/api/transaction/${reference}`);
  },

  getHistory: async (userId: string, filters?: {
    type?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    const params = new URLSearchParams(filters as any).toString();
    return makeRequest(`/api/transactions/${userId}?${params}`);
  },
};