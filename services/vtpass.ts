// VTPass API Integration with real endpoints
const VTPASS_BASE_URL = 'https://sandbox.vtpass.com/api';
const VTPASS_API_KEY = 'f3d5d7fff51bfced07db8e60765c30ad';
const VTPASS_PUBLIC_KEY = 'PK_335015e1c08a15219da7b49e1b662c2fea35013b4a3';
const VTPASS_SECRET_KEY = 'SK_644f091f612307ead388dfb81d299a7ce91e869b68d';

interface VTPassResponse {
  code: string;
  content: any;
  response_description: string;
}

interface DataPlan {
  variation_code: string;
  name: string;
  variation_amount: string;
  fixedPrice: string;
}

interface AirtimePlan {
  variation_code: string;
  name: string;
  variation_amount: string;
  fixedPrice: string;
}

class VTPassService {
  private async makeRequest(endpoint: string, data: any = {}): Promise<VTPassResponse> {
    try {
      const response = await fetch(`${VTPASS_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': VTPASS_API_KEY,
          'public-key': VTPASS_PUBLIC_KEY,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`VTPass API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('VTPass API Error:', error);
      throw error;
    }
  }

  // Get data plans for a specific network
  async getDataPlans(network: string): Promise<DataPlan[]> {
    try {
      const serviceID = this.getDataServiceID(network);
      const response = await this.makeRequest('/service-variations', {
        serviceID,
      });

      if (response.code === '000') {
        return response.content.variations || [];
      }
      throw new Error(response.response_description);
    } catch (error) {
      console.error('Error fetching data plans:', error);
      // Return fallback data if API fails
      return this.getFallbackDataPlans(network);
    }
  }

  // Get airtime plans for a specific network
  async getAirtimePlans(network: string): Promise<AirtimePlan[]> {
    try {
      const serviceID = this.getAirtimeServiceID(network);
      const response = await this.makeRequest('/service-variations', {
        serviceID,
      });

      if (response.code === '000') {
        return response.content.variations || [];
      }
      throw new Error(response.response_description);
    } catch (error) {
      console.error('Error fetching airtime plans:', error);
      // Return fallback airtime options
      return this.getFallbackAirtimePlans();
    }
  }

  // Purchase data or airtime
  async makePurchase(purchaseData: {
    serviceID: string;
    billersCode: string;
    variation_code: string;
    amount: number;
    phone: string;
    request_id: string;
  }) {
    try {
      const response = await this.makeRequest('/pay', purchaseData);
      return response;
    } catch (error) {
      console.error('Error making purchase:', error);
      throw error;
    }
  }

  // Verify transaction
  async verifyTransaction(request_id: string) {
    try {
      const response = await this.makeRequest('/requery', {
        request_id,
      });
      return response;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      throw error;
    }
  }

  private getDataServiceID(network: string): string {
    const serviceMap: { [key: string]: string } = {
      mtn: 'mtn-data',
      airtel: 'airtel-data',
      glo: 'glo-data',
      '9mobile': 'etisalat-data',
    };
    return serviceMap[network.toLowerCase()] || 'mtn-data';
  }

  private getAirtimeServiceID(network: string): string {
    const serviceMap: { [key: string]: string } = {
      mtn: 'mtn',
      airtel: 'airtel',
      glo: 'glo',
      '9mobile': 'etisalat',
    };
    return serviceMap[network.toLowerCase()] || 'mtn';
  }

  private getFallbackDataPlans(network: string): DataPlan[] {
    return [
      { variation_code: 'mtn-20mb-daily', name: '20MB', variation_amount: '50', fixedPrice: '50' },
      { variation_code: 'mtn-150mb-daily', name: '150MB', variation_amount: '100', fixedPrice: '100' },
      { variation_code: 'mtn-250mb-daily', name: '250MB', variation_amount: '200', fixedPrice: '200' },
      { variation_code: 'mtn-500mb-daily', name: '500MB', variation_amount: '300', fixedPrice: '300' },
      { variation_code: 'mtn-1gb-daily', name: '1GB', variation_amount: '500', fixedPrice: '500' },
      { variation_code: 'mtn-2gb-daily', name: '2GB', variation_amount: '1000', fixedPrice: '1000' },
      { variation_code: 'mtn-3gb-weekly', name: '3GB', variation_amount: '1500', fixedPrice: '1500' },
      { variation_code: 'mtn-5gb-weekly', name: '5GB', variation_amount: '2000', fixedPrice: '2000' },
      { variation_code: 'mtn-10gb-monthly', name: '10GB', variation_amount: '3000', fixedPrice: '3000' },
      { variation_code: 'mtn-15gb-monthly', name: '15GB', variation_amount: '4500', fixedPrice: '4500' },
      { variation_code: 'mtn-20gb-monthly', name: '20GB', variation_amount: '6000', fixedPrice: '6000' },
      { variation_code: 'mtn-40gb-monthly', name: '40GB', variation_amount: '10000', fixedPrice: '10000' },
    ];
  }

  private getFallbackAirtimePlans(): AirtimePlan[] {
    return [
      { variation_code: 'airtime-100', name: '₦100', variation_amount: '100', fixedPrice: '100' },
      { variation_code: 'airtime-200', name: '₦200', variation_amount: '200', fixedPrice: '200' },
      { variation_code: 'airtime-500', name: '₦500', variation_amount: '500', fixedPrice: '500' },
      { variation_code: 'airtime-1000', name: '₦1000', variation_amount: '1000', fixedPrice: '1000' },
      { variation_code: 'airtime-2000', name: '₦2000', variation_amount: '2000', fixedPrice: '2000' },
      { variation_code: 'airtime-5000', name: '₦5000', variation_amount: '5000', fixedPrice: '5000' },
    ];
  }
}

export const vtpassService = new VTPassService();