import { getAI } from './client';

export const analyzeNovelty = async (text: string): Promise<{ isNovel: boolean; fact: string; confidence: number }> => {
    try {
        const client = getAI();
        const prompt = `
        Analyze the following user message. 
        Determine if it contains specific, static facts about the user (name, location, preferences, work, specific projects) that should be committed to long-term memory.
        Ignore transient conversation ("hello", "how are you", "tell me a joke").
        
        Return ONLY a JSON object:
        {
            "isNovel": boolean,
            "fact": "The extracted atomic fact (e.g., 'User lives in Madrid')",
            "confidence": number (0-1)
        }

        User Message: "${text}"
        `;

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const result = JSON.parse(response.text || '{}');
        return {
            isNovel: result.isNovel || false,
            fact: result.fact || '',
            confidence: result.confidence || 0
        };
    } catch (error) {
        console.error("Novelty Analysis Failed:", error);
        return { isNovel: false, fact: '', confidence: 0 };
    }
};