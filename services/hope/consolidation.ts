import { db } from '../surrealService';
import { MemoryNode } from '../../types';

/**
 * HOPE MODULE: MEMORY CONSOLIDATION AGENT
 * 
 * Responsible for the "Nested Learning" mechanism.
 * Analyzes facts in the Fast Memory (Session/LoRA context) and decides 
 * if they should be persisted to Slow Memory (SurrealDB).
 */

interface ShortTermFact {
    content: string;
    occurrences: number;
    firstSeen: number;
    confidence: number;
}

// In-memory buffer simulating the "Fast Memory" state
let fastMemoryBuffer: ShortTermFact[] = [];

/**
 * Tracks a new fact coming from the Novelty Agent.
 */
export const trackFastMemoryFact = (fact: string, confidence: number) => {
    const existing = fastMemoryBuffer.find(f => f.content === fact);
    if (existing) {
        existing.occurrences += 1;
        // Reinforcement: If mentioned multiple times, confidence increases
        existing.confidence = Math.min(0.99, existing.confidence + 0.1);
    } else {
        fastMemoryBuffer.push({
            content: fact,
            occurrences: 1,
            firstSeen: Date.now(),
            confidence
        });
    }
    
    // Trigger check
    evaluateConsolidation();
};

/**
 * Evaluates if Short Term facts should move to Long Term storage.
 * Algorithm: Recurrence * Confidence > Threshold
 */
const evaluateConsolidation = async () => {
    const CONSOLIDATION_THRESHOLD = 1.5; // Arbitrary score

    const toConsolidate = fastMemoryBuffer.filter(f => {
        const score = f.occurrences * f.confidence;
        return score >= CONSOLIDATION_THRESHOLD;
    });

    for (const fact of toConsolidate) {
        console.log(`[Consolidation Agent] Moving fact to Long Term Memory: "${fact.content}"`);
        
        try {
            // Persist to SurrealDB
            await db.addMemoryNode(
                fact.content, 
                'Consolidated Fact', 
                'text'
            );
            
            // Remove from buffer (it's now in long-term)
            fastMemoryBuffer = fastMemoryBuffer.filter(f => f.content !== fact.content);
        } catch (e) {
            console.error("Consolidation failed", e);
        }
    }
};

export const getFastMemoryState = () => fastMemoryBuffer;