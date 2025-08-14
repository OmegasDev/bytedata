// GladtidingsData API Integration
const GTD_BASE_URL = 'https://gladtidingsdata.com/api';
const GTD_API_KEY = 'your_gtd_api_key'; // You'll provide this

interface GTDResponse {
  status: boolean;
  message: string;
  data?: any;
}

interface DataPlan {
  id: string;
  network: string;
  plan: string;
  price: number;
  validity: string;
  size: string;
}

interface AirtimePlan {
  id: string;
  network: string;
  amount: number;
}

class GladtidingsDataService {
  private async makeRequest(endpoint: string, data: any = {}): Promise<GTDResponse> {
    try {
      const response = await fetch(`${GTD_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GTD_API_KEY}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`GTD API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('GladtidingsData API Error:', error);
      throw error;
    }
  }

  // Get available data plans
  async getDataPlans(network?: string): Promise<DataPlan[]> {
    try {
      const response = await this.makeRequest('/data-plans', { network });
      
      if (response.status) {
        return response.data || [];
      }
      throw new Error(response.message);
    } catch (error) {
      console.error('Error fetching data plans:', error);
      // Return fallback data plans
      return this.getFallbackDataPlans();
    }
  }

  // Get available airtime plans
  async getAirtimePlans(): Promise<AirtimePlan[]> {
    try {
      const response = await this.makeRequest('/airtime-plans');
      
      if (response.status) {
        return response.data || [];
      }
      throw new Error(response.message);
    } catch (error) {
      console.error('Error fetching airtime plans:', error);
      return this.getFallbackAirtimePlans();
    }
  }

  // Purchase data
  async buyData(purchaseData: {
    network: string;
    plan_id: string;
    phone: string;
    amount: number;
    reference: string;
  }): Promise<GTDResponse> {
    try {
      const response = await this.makeRequest('/buy-data', purchaseData);
      return response;
    } catch (error) {
      console.error('Error purchasing data:', error);
      throw error;
    }
  }

  // Purchase airtime
  async buyAirtime(purchaseData: {
    network: string;
    phone: string;
    amount: number;
    reference: string;
  }): Promise<GTDResponse> {
    try {
      const response = await this.makeRequest('/buy-airtime', purchaseData);
      return response;
    } catch (error) {
      console.error('Error purchasing airtime:', error);
      throw error;
    }
  }

  // Get wallet summary (optional - for admin dashboard)
  async getWalletSummary(): Promise<any> {
    try {
      const response = await this.makeRequest('/wallet-summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet summary:', error);
      throw error;
    }
  }

  // Verify transaction status
  async verifyTransaction(reference: string): Promise<GTDResponse> {
    try {
      const response = await this.makeRequest('/verify-transaction', { reference });
      return response;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      throw error;
    }
  }

  private getFallbackDataPlans(): DataPlan[] {
    return [
      { id: 'mtn-500mb', network: 'MTN', plan: '500MB', price: 150, validity: '1 Day', size: '500MB' },
      { id: 'mtn-1gb', network: 'MTN', plan: '1GB', price: 300, validity: '1 Day', size: '1GB' },
      { id: 'mtn-2gb', network: 'MTN', plan: '2GB', price: 600, validity: '7 Days', size: '2GB' },
      { id: 'mtn-5gb', network: 'MTN', plan: '5GB', price: 1500, validity: '30 Days', size: '5GB' },
      { id: 'airtel-500mb', network: 'Airtel', plan: '500MB', price: 140, validity: '1 Day', size: '500MB' },
      { id: 'airtel-1gb', network: 'Airtel', plan: '1GB', price: 280, validity: '1 Day', size: '1GB' },
      { id: 'airtel-2gb', network: 'Airtel', plan: '2GB', price: 560, validity: '7 Days', size: '2GB' },
      { id: 'airtel-5gb', network: 'Airtel', plan: '5GB', price: 1400, validity: '30 Days', size: '5GB' },
      { id: 'glo-500mb', network: 'Glo', plan: '500MB', price: 130, validity: '1 Day', size: '500MB' },
      { id: 'glo-1gb', network: 'Glo', plan: '1GB', price: 260, validity: '1 Day', size: '1GB' },
      { id: 'glo-2gb', network: 'Glo', plan: '2GB', price: 520, validity: '7 Days', size: '2GB' },
      { id: 'glo-5gb', network: 'Glo', plan: '5GB', price: 1300, validity: '30 Days', size: '5GB' },
      { id: '9mobile-500mb', network: '9mobile', plan: '500MB', price: 135, validity: '1 Day', size: '500MB' },
      { id: '9mobile-1gb', network: '9mobile', plan: '1GB', price: 270, validity: '1 Day', size: '1GB' },
      { id: '9mobile-2gb', network: '9mobile', plan: '2GB', price: 540, validity: '7 Days', size: '2GB' },
      { id: '9mobile-5gb', network: '9mobile', plan: '5GB', price: 1350, validity: '30 Days', size: '5GB' },
    ];
  }

  private getFallbackAirtimePlans(): AirtimePlan[] {
    return [
      { id: 'airtime-100', network: 'All', amount: 100 },
      { id: 'airtime-200', network: 'All', amount: 200 },
      { id: 'airtime-500', network: 'All', amount: 500 },
      { id: 'airtime-1000', network: 'All', amount: 1000 },
      { id: 'airtime-2000', network: 'All', amount: 2000 },
      { id: 'airtime-5000', network: 'All', amount: 5000 },
    ];
  }
}

export const gladtidingsService = new GladtidingsDataService();