import * as auth from './surreal/auth';
import * as memoryIngest from './surreal/memory/ingest';
import * as memorySearch from './surreal/memory/search';
import * as memoryRetrieval from './surreal/memory/retrieval';
import * as lora from './surreal/lora';
import * as billing from './surreal/billing';
import * as abstraction from './hope/abstraction';
import * as forgetting from './hope/forgetting';
import { surreal } from './surreal/core';

// Unified Service Facade
class SurrealService {
  private static instance: SurrealService;
  private constructor() {}

  public static getInstance(): SurrealService {
    if (!SurrealService.instance) {
      SurrealService.instance = new SurrealService();
    }
    return SurrealService.instance;
  }

  // Auth
  signin = auth.signin;
  signup = auth.signup;
  logout = auth.logout;
  getUserFromStorage = auth.getUser;

  // Memory
  addMemoryNode = memoryIngest.addMemoryNode;
  
  // CHANGED: This is now async/compatible. 
  // The components calling getMemories need to handle the promise or we shim it.
  // For cleanest code, we expose the async version.
  getMemories = memoryRetrieval.fetchMemoriesAsync; 
  
  hybridSearch = memorySearch.hybridSearch;

  // HOPE Architecture (Optimizations)
  runAbstraction = abstraction.runAbstractionCycle;
  runForgetting = forgetting.runSmartForgetting;

  // LoRA
  getAdapters = lora.getAdapters;
  createAdapter = lora.createAdapter;
  deleteAdapter = lora.deleteAdapter;
  hotTrainAdapter = lora.hotTrainAdapter;

  // Billing & System
  getTransactions = billing.getTransactions;
  getApiKeys = billing.getApiKeys;
  createApiKey = billing.createApiKey;
  revokeApiKey = billing.revokeApiKey;
  getApiLogs = () => {
    // Access static instance of client state
    return surreal.apiLogs;
  };
}

export const db = SurrealService.getInstance();