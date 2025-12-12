import { dbClient, surreal } from '../surreal/core';
import { getAdapters, deleteAdapter } from '../surreal/lora';

/**
 * HOPE MODULE: SMART FORGETTING
 * 
 * "Garbage Collector" for the human-like memory.
 * Removes or archives memories that have low importance and haven't been accessed recently.
 * Also cleans up unused LoRA adapters.
 */

const DECAY_DAYS = 90; // Memories older than 90 days unused
const LOW_IMPORTANCE_THRESHOLD = 0.3;

export const runSmartForgetting = async () => {
    console.log("[Smart Forgetting] Running cleanup cycle...");
    await surreal.isReady;

    // 1. Clean Graph Memories (SurrealDB)
    if (surreal.connected) {
        try {
            // Mark for Archival (Soft Delete)
            const query = `
                UPDATE memory 
                SET type = 'archived', validationStatus = 'archived'
                WHERE 
                    time::now() - lastAccessedAt > ${DECAY_DAYS}d 
                    AND accessCount < 3 
                    AND importance < ${LOW_IMPORTANCE_THRESHOLD}
                    AND type != 'archived';
            `;
            
            const result = await dbClient.query(query);
            console.log(`[Smart Forgetting] DB Nodes Archived.`, result);
        } catch (e) {
            console.error("DB Forgetting failed", e);
        }
    }

    // 2. Clean Unused LoRA Adapters (Simulated VRAM Management)
    try {
        const adapters = getAdapters();
        // Delete adapters that are 'idle' (not trained/active) and older than 1 day (aggressive cleanup for demo)
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;
        
        let removedCount = 0;
        for (const adapter of adapters) {
            if (adapter.status === 'idle') {
                // Parse ID timestamp if possible, or use a field
                // For this demo, we assume 'idle' adapters with 0 facts learned are trash
                if (adapter.factsLearned === 0) {
                     await deleteAdapter(adapter.id);
                     removedCount++;
                }
            }
        }
        console.log(`[Smart Forgetting] Removed ${removedCount} unused LoRA adapters.`);
    } catch (e) {
        console.error("Adapter cleanup failed", e);
    }
};