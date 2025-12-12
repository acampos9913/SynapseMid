import { getAI } from './client';

export const extractGraphEntities = async (text: string): Promise<string[]> => {
    try {
        const client = getAI();
        const prompt = `
        You are a Knowledge Graph extraction agent.
        Extract the key entities (People, Locations, Concepts, Specific Projects, Dates) from the text.
        These entities will be used to link related memories in a graph database.
        
        Return ONLY a JSON array of strings.
        Example: ["John Doe", "Project Apollo", "Madrid", "2023"]
        
        Text: "${text.substring(0, 3000)}"
        `;

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.1
            }
        });

        const result = JSON.parse(response.text || '[]');
        return Array.isArray(result) ? result : [];
    } catch (error) {
        console.error("Entity Extraction Failed:", error);
        return [];
    }
};