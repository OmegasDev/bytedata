import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

// AsyncStorage helpers
export const storage = {
  // Generic storage methods
  setItem: async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing data:', error);
      throw error;
    }
  },

  getItem: async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      throw error;
    }
  },

  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  },

  // Auth specific methods
  setAuthToken: async (token: string) => {
    await AsyncStorage.setItem('auth_token', token);
  },

  getAuthToken: async () => {
    return await AsyncStorage.getItem('auth_token');
  },

  setUserData: async (userData: any) => {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem('user_data', jsonValue);
  },

  getUserData: async () => {
    const jsonValue = await AsyncStorage.getItem('user_data');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  },

  clearAuthData: async () => {
    await AsyncStorage.multiRemove(['auth_token', 'user_data']);
  },

  // Guest purchase data
  saveGuestPurchase: async (purchase: any) => {
    try {
      const existingPurchases = await storage.getItem('guest_purchases') || [];
      const updatedPurchases = [purchase, ...existingPurchases].slice(0, 10); // Keep last 10
      await storage.setItem('guest_purchases', updatedPurchases);
    } catch (error) {
      console.error('Error saving guest purchase:', error);
    }
  },

  getGuestPurchases: async () => {
    try {
      return await storage.getItem('guest_purchases') || [];
    } catch (error) {
      console.error('Error retrieving guest purchases:', error);
      return [];
    }
  },
};

// SQLite database for caching plans
class PlansCacheDB {
  private db: SQLite.SQLiteDatabase | null = null;

  async initDatabase() {
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync('plans_cache.db');
      
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS plans_cache (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          network TEXT NOT NULL,
          plan_code TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          amount REAL NOT NULL,
          validity TEXT,
          provider TEXT,
          service_type TEXT NOT NULL,
          last_fetched INTEGER NOT NULL,
          UNIQUE(network, plan_code, service_type)
        );
        
        CREATE INDEX IF NOT EXISTS idx_network_service ON plans_cache(network, service_type);
        CREATE INDEX IF NOT EXISTS idx_last_fetched ON plans_cache(last_fetched);
      `);
    }
    return this.db;
  }

  async cachePlans(plans: any[], network: string, serviceType: string) {
    const db = await this.initDatabase();
    const timestamp = Date.now();

    try {
      await db.withTransactionAsync(async () => {
        // Clear old plans for this network and service type
        await db.runAsync('DELETE FROM plans_cache WHERE network = ? AND service_type = ?', [network, serviceType]);
        
        // Insert new plans
        for (const plan of plans) {
          await db.runAsync(`
            INSERT INTO plans_cache (network, plan_code, name, description, amount, validity, provider, service_type, last_fetched)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            network,
            plan.code,
            plan.name,
            plan.description || '',
            plan.amount,
            plan.validity || '',
            plan.provider || 'vtpass',
            serviceType,
            timestamp
          ]);
        }
      });
    } catch (error) {
      console.error('Error caching plans:', error);
      throw error;
    }
  }

  async getCachedPlans(network: string, serviceType: string, maxAgeMs: number = 3600000) { // 1 hour default
    const db = await this.initDatabase();
    const minTimestamp = Date.now() - maxAgeMs;

    try {
      const result = await db.getAllAsync(`
        SELECT * FROM plans_cache 
        WHERE network = ? AND service_type = ? AND last_fetched > ?
        ORDER BY amount ASC
      `, [network, serviceType, minTimestamp]);

      return result;
    } catch (error) {
      console.error('Error retrieving cached plans:', error);
      return [];
    }
  }

  async clearCache() {
    const db = await this.initDatabase();
    try {
      await db.runAsync('DELETE FROM plans_cache');
    } catch (error) {
      console.error('Error clearing plans cache:', error);
    }
  }

  async getOldestCacheTime() {
    const db = await this.initDatabase();
    try {
      const result = await db.getFirstAsync('SELECT MIN(last_fetched) as oldest FROM plans_cache');
      return result?.oldest || 0;
    } catch (error) {
      console.error('Error getting oldest cache time:', error);
      return 0;
    }
  }
}

export const plansCacheDB = new PlansCacheDB();