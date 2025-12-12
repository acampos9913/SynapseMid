import { Transaction, ApiKey, PermissionScope } from '../../types';
import { MOCK_TRANSACTIONS } from '../../constants';

export const getTransactions = async (): Promise<Transaction[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...MOCK_TRANSACTIONS] as any;
};

export const getApiKeys = (): ApiKey[] => {
  const stored = localStorage.getItem('mnemosyne_apikeys');
  if (!stored) {
      const initial: ApiKey[] = [{ 
          id: 'key_1', 
          name: 'Default App Key', 
          keyMasked: 'sk-proj...8921', 
          createdAt: '2023-01-15', 
          usageTokens: 45200, 
          status: 'active',
          scopes: ['memory:read', 'memory:write']
      }];
      localStorage.setItem('mnemosyne_apikeys', JSON.stringify(initial));
      return initial;
  }
  return JSON.parse(stored);
};

export const createApiKey = async (name: string, scopes: PermissionScope[] = ['memory:read']): Promise<ApiKey> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name,
      keyMasked: `sk-mnem...${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      usageTokens: 0,
      status: 'active',
      scopes
  };
  localStorage.setItem('mnemosyne_apikeys', JSON.stringify([...getApiKeys(), newKey]));
  return newKey;
};

export const revokeApiKey = async (id: string): Promise<void> => {
  const updated = getApiKeys().map(k => k.id === id ? { ...k, status: 'revoked' as const } : k);
  localStorage.setItem('mnemosyne_apikeys', JSON.stringify(updated));
};