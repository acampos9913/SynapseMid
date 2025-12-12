import { getAI } from './client';
import { MemoryCategory, ValidationStatus } from '../../types';

export const validateAndClassify = async (text: string): Promise<{ 
    trustScore: number; 
    category: MemoryCategory;
    validationStatus: ValidationStatus 
}> => {
    try {
        const client = getAI();
        const prompt = `
        Act as a Knowledge Graph Validator. Analyze the following information to be stored in the database.
        
        1. CLASSIFY: 
           - 'epistemic': General knowledge, facts, definitions, world states.
           - 'operational': Instructions, workflows, "how-to", scripts, action items.
        
        2. VALIDATE (Fact-Check):
           - Assign a trust score (0.0 to 1.0).
           - 1.0 = Highly specific, internally consistent, clear context.
           - 0.1 = Vague, contradictory, or looks like hallucinated gibberish.
        
        INPUT TEXT: "${text.substring(0, 1000)}"

        Return JSON:
        {
            "category": "epistemic" | "operational",
            "trustScore": number
        }
        `;

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0
            }
        });

        const result = JSON.parse(response.text || '{}');
        const trustScore = result.trustScore || 0.5;
        
        let validationStatus: ValidationStatus = 'verified';
        if (trustScore < 0.4) validationStatus = 'low_confidence';
        if (trustScore < 0.2) validationStatus = 'pending_review';

        return {
            trustScore,
            category: (result.category as MemoryCategory) || 'uncategorized',
            validationStatus
        };
    } catch (error) {
        console.error("Validation Failed:", error);
        return { trustScore: 0.5, category: 'uncategorized', validationStatus: 'pending_review' };
    }
};