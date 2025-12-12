import { MemoryNode } from '../../../types';
import { surreal, dbClient } from '../core';

// Helper for offline storage
const getOfflineMemories = (): MemoryNode[] => {
    try {
        const stored = localStorage.getItem('mnemosyne_memories');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

export const fetchMemoriesAsync = async (): Promise<MemoryNode[]> => {
    await surreal.isReady;
    
    if (!surreal.connected) {
        return getOfflineMemories();
    }
    
    try {
        const [result] = await dbClient.query<MemoryNode[][]>(`SELECT * FROM memory ORDER BY createdAt DESC`);
        // If result is null/undefined (can happen in some Surreal versions on empty), return empty array
        return result || [];
    } catch (e) {
        console.error("Fetch failed, reverting to offline cache", e);
        return getOfflineMemories();
    }
};