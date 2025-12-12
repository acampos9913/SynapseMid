import { db } from '../surrealService';
import { generateWithMemory } from '../gemini/index';
import { getFastMemoryState } from './consolidation';
import { ChatMessage, MemoryNode } from '../../types';

export const orchestratedGeneration = async (
    userPrompt: string, 
    chatHistory: ChatMessage[]
): Promise<{ response: string; nodesUsed: MemoryNode[]; noveltyScore: number }> => {
    
    const fastFacts = getFastMemoryState();
    const fastContext = fastFacts
        .filter(f => f.confidence > 0.5)
        .map(f => `[Fast Memory/Recent]: ${f.content}`)
        .join('\n');

    let slowNodes: MemoryNode[] = [];
    if (userPrompt.length > 5) {
        slowNodes = await db.hybridSearch(userPrompt, { minRelevance: 0.65 });
    }

    const augmentedNodes = [...slowNodes];
    
    if (fastContext) {
        augmentedNodes.unshift({
            id: 'temp_fast_memory',
            content: fastContext,
            type: 'text',
            tags: ['fast-memory'],
            entities: [],
            createdAt: new Date().toISOString(),
            relations: [],
            accessCount: 0,
            lastAccessedAt: new Date().toISOString(),
            importance: 1,
            trustScore: 1.0,
            category: 'epistemic',
            validationStatus: 'verified'
        });
    }

    const historyStrings = chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`);
    const responseText = await generateWithMemory(userPrompt, augmentedNodes, historyStrings);

    return {
        response: responseText,
        nodesUsed: slowNodes, 
        noveltyScore: 0 
    };
};