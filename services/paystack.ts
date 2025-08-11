// Paystack API Integration
const PAYSTACK_PUBLIC_KEY = 'pk_test_4a17485c56d5b2823de6e2824a74e3e5ad466a8a';
const PAYSTACK_SECRET_KEY = 'sk_test_a3•••••955'; // Replace with full key
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    log: any;
    fees: number;
    fees_split: any;
    authorization: any;
    customer: any;
    plan: any;
    split: any;
    order_id: any;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any;
    source: any;
    fees_breakdown: any;
  };
}

class PaystackService {
  private async makeRequest(endpoint: string, data: any = {}, method: 'GET' | 'POST' = 'POST'): Promise<any> {
    const response = await fetch(`${PAYSTACK_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
      body: method === 'POST' ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Paystack API error: ${response.status}`);
    }

    return response.json();
  }

  // Initialize payment
  async initializePayment(paymentData: {
    email: string;
    amount: number; // Amount in kobo (multiply by 100)
    reference?: string;
    callback_url?: string;
    metadata?: any;
  }): Promise<PaystackInitializeResponse> {
    try {
      const response = await this.makeRequest('/transaction/initialize', {
        ...paymentData,
        amount: paymentData.amount * 100, // Convert to kobo
        currency: 'NGN',
      });

      return response;
    } catch (error) {
      console.error('Error initializing payment:', error);
      throw error;
    }
  }

  // Verify payment
  async verifyPayment(reference: string): Promise<PaystackVerifyResponse> {
    try {
      const response = await this.makeRequest(`/transaction/verify/${reference}`, {}, 'GET');
      return response;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  // Generate payment reference
  generateReference(): string {
    return `BYT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const paystackService = new PaystackService();
export { PAYSTACK_PUBLIC_KEY };