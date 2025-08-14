// Paystack Payment Integration
const PAYSTACK_PUBLIC_KEY = 'pk_test_4a17485c56d5b2823de6e2824a74e3e5ad466a8a';
const PAYSTACK_SECRET_KEY = 'sk_test_a3•••••955'; // You'll provide the full key
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

interface PaystackInitResponse {
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
    status: string;
    reference: string;
    amount: number;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    customer: any;
  };
}

class PaymentService {
  // Initialize payment on frontend
  async initializePayment(paymentData: {
    email: string;
    amount: number; // Amount in naira (will be converted to kobo)
    reference?: string;
    callback_url?: string;
    metadata?: any;
  }): Promise<PaystackInitResponse> {
    try {
      const reference = paymentData.reference || this.generateReference();
      
      const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
        body: JSON.stringify({
          ...paymentData,
          amount: paymentData.amount * 100, // Convert to kobo
          currency: 'NGN',
          reference,
        }),
      });

      if (!response.ok) {
        throw new Error(`Paystack API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error initializing payment:', error);
      throw error;
    }
  }

  // Verify payment on backend
  async verifyPayment(reference: string): Promise<PaystackVerifyResponse> {
    try {
      const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Paystack verification error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  // Generate unique payment reference
  generateReference(): string {
    return `BYT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get Paystack public key for frontend
  getPublicKey(): string {
    return PAYSTACK_PUBLIC_KEY;
  }
}

export const paymentService = new PaymentService();
export { PAYSTACK_PUBLIC_KEY };