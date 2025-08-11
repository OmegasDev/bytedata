// VTPass API Integration
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
      throw error;
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
      throw error;
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
}

export const vtpassService = new VTPassService();