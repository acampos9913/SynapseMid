import { getAI } from './client';
import { MODEL_NAME } from '../../constants';
import { MemoryNode } from '../../types';

export const generateWithMemory = async (
    prompt: string, 
    contextNodes: MemoryNode[], 
    chatHistory: string[]
) => {
    try {
        const client = getAI();
        
        let contextBlock = "";
        if (contextNodes.length > 0) {
            contextBlock = `
=== RETRIEVED LONG-TERM MEMORY ===
The following information was retrieved from the Mnemosyne Hybrid Graph.
Context is divided into [ABSTRACT] (High-level concepts/summaries) and [FACT] (Detailed records).

${contextNodes.map((node, i) => {
    const label = node.type === 'abstraction' ? '[ABSTRACT] (High-Level Context)' : '[FACT] (Detail)';
    let entry = `[${i+1}] ${label}\nContent: ${node.content}\nTrust: ${node.trustScore}`;
    
    if (node.previousVersion) {
        entry += `\n>> HISTORICAL NOTE: This fact supersedes a previous version.`;
    }
    return entry;
}).join('\n\n')}
==================================
`;
        }

        const systemInstruction = `
You are Mnemosyne, an AI assistant with access to an infinite, hierarchical memory.
Your goal is to answer the user's request accurately using the provided memory context.

RULES:
1. HIERARCHY: Use [ABSTRACT] nodes to understand the "Big Picture" and [FACT] nodes for specific details.
2. TRUST: Prioritize memory with high trust scores. If a memory has a low trust score, warn the user.
3. DOMAIN: Distinguish between 'Knowing' (Epistemic) and 'Doing' (Operational).
4. TONE: Adaptive and helpful.
`;

        const fullPrompt = `
${contextBlock}

CHAT HISTORY:
${chatHistory.slice(-5).join('\n')}

CURRENT USER REQUEST:
${prompt}
`;

        const response = await client.models.generateContent({
            model: MODEL_NAME,
            contents: fullPrompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.3,
            }
        });

        return response.text || "No response generated.";
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw error;
    }
};