import Surreal from 'surrealdb';
import { ApiLog } from '../../types';

// Singleton DB Client
class SurrealClient {
  private static instance: SurrealClient;
  public db: Surreal;
  public isReady: Promise<void>;
  public connected: boolean = false;
  public apiLogs: ApiLog[] = []; // Keep local log buffer for UI

  private constructor() {
    this.db = new Surreal();
    
    // Auto-connect on start
    this.isReady = this.init();
  }

  private async init() {
    try {
        // Connect to local SurrealDB instance
        // Ensure you have started surreal with: `surreal start --user root --pass root`
        await this.db.connect('ws://localhost:8000/rpc');
        await this.db.use({ namespace: 'mnemosyne', database: 'core' });
        this.connected = true;
        console.log("Connected to SurrealDB");
    } catch (err) {
        console.warn("SurrealDB Connection Failed. App will run in Offline/Mock mode.", err);
        this.connected = false;
    }
  }

  public static getInstance(): SurrealClient {
    if (!SurrealClient.instance) {
      SurrealClient.instance = new SurrealClient();
    }
    return SurrealClient.instance;
  }

  public logRequest(endpoint: string, method: string, status: number, latency: number, tokens?: number) {
    const log: ApiLog = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      endpoint,
      method,
      status,
      latencyMs: latency,
      tokensUsed: tokens
    };
    this.apiLogs.unshift(log);
    if (this.apiLogs.length > 50) this.apiLogs.pop();
  }
}

export const surreal = SurrealClient.getInstance();
export const dbClient = surreal.db; // Export the raw driver for direct usage