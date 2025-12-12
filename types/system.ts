export type PermissionScope = 'memory:read' | 'memory:write' | 'memory:read:epistemic' | 'memory:read:operational';

export interface ApiKey {
  id: string;
  name: string;
  keyMasked: string;
  createdAt: string;
  usageTokens: number;
  status: 'active' | 'revoked';
  scopes: PermissionScope[];
}

export interface ApiLog {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  status: number;
  latencyMs: number;
  tokensUsed?: number;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface TrainingJob {
  id: string;
  adapterId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  dataset: string[]; // The specific facts being trained
  createdAt: string;
  completedAt?: string;
}

export interface LoraAdapter {
  id: string;
  name: string;
  baseModel: string;
  status: 'active' | 'training' | 'idle' | 'loaded' | 'unloaded';
  version: number;
  loss: number;
  lastTrained: string;
  sessionId?: string;
  factsLearned: number; // Counter for perceptual memory items
}