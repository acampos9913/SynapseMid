import { dbClient, surreal } from '../surreal/core';
import { getAI } from '../gemini/client';
import { MemoryNode } from '../../types';

/**
 * HOPE MODULE: HIERARCHICAL ABSTRACTION
 * 
 * Takes detailed, low-level memories (chat logs, raw notes) and synthesizes them 
 * into high-level "Abstraction Nodes".
 * 
 * Example: 
 * Input: 5 messages about fixing a python bug in file X.
 * Output (Abstraction): "User is debugging Python auth modules."
 */

export const runAbstractionCycle = async (): Promise<number> => {
    console.log("[Hope Abstraction] Starting cycle...");
    await surreal.isReady;
    
    if (!surreal.connected) return 0;

    try {
        // 1. Find nodes that are NOT yet abstracted and are older than 1 hour (simulated)
        // In a real graph, we check: WHERE count(->abstracted_by) = 0
        const candidates = await dbClient.query<MemoryNode[][]>(`
            SELECT * FROM memory 
            WHERE type != 'abstraction'
            AND type != 'archived'
            AND (SELECT count() FROM ->abstracted_by) = 0
            ORDER BY createdAt DESC
            LIMIT 10;
        `);

        const nodesToAbstract = candidates[0] || [];
        if (nodesToAbstract.length < 3) {
            console.log("[Hope Abstraction] Not enough data to abstract.");
            return 0;
        }

        // 2. Generate Summary via LLM
        const summary = await generateSummary(nodesToAbstract);
        if (!summary) return 0;

        // 3. Create Abstraction Node
        const [created] = await dbClient.create('memory', {
            content: summary,
            fileName: 'System Abstraction',
            type: 'abstraction',
            tags: ['hope', 'abstraction', 'hierarchy'],
            entities: [], // Could extract entities here too
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            relations: [],
            accessCount: 0,
            lastAccessedAt: new Date().toISOString(),
            importance: 1.0, // Abstractions are usually important
            trustScore: 1.0,
            category: 'abstract',
            validationStatus: 'verified'
        });

        const abstractionNode = created[0] as unknown as MemoryNode;

        // 4. Link children to parent
        // Edge: child -> abstracted_by -> parent
        for (const child of nodesToAbstract) {
             await dbClient.query(`
                RELATE ${child.id}->abstracted_by->${abstractionNode.id}
             `);
        }

        console.log(`[Hope Abstraction] Created abstraction: "${summary}" from ${nodesToAbstract.length} nodes.`);
        return 1;

    } catch (e) {
        console.error("Abstraction cycle failed", e);
        return 0;
    }
};

async function generateSummary(nodes: MemoryNode[]): Promise<string> {
    try {
        const client = getAI();
        const textBlock = nodes.map(n => `- ${n.content}`).join('\n');
        
        const prompt = `
        You are a memory optimization agent. 
        Read the following detailed memory fragments and create a single, high-level summary (1 sentence).
        This summary will serve as a "Folder Label" or "Concept" for these memories in a knowledge graph.
        
        Fragments:
        ${textBlock}
        
        Output ONLY the summary string.
        `;

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text?.trim() || "";
    } catch (e) {
        console.error("Summary generation failed", e);
        return "";
    }
}