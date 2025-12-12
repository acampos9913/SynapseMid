export const APP_NAME = "Mnemosyne AI";
export const API_VERSION = "v1";

// Mock Data for Initial State
export const MOCK_TRANSACTIONS = [
  { id: 'tx_1', date: '2023-10-01', amount: 20.00, description: 'Credit Purchase (Standard)', status: 'completed' },
  { id: 'tx_2', date: '2023-10-15', amount: 10.00, description: 'Auto-Reload', status: 'completed' },
  { id: 'tx_3', date: '2023-11-01', amount: 50.00, description: 'Pro Plan Subscription', status: 'completed' },
] as const;

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

export const MODEL_NAME = 'gemini-2.5-flash'; // Optimized for speed and cost
export const THINKING_MODEL = 'gemini-2.5-flash-thinking'; // If available, else fallback
