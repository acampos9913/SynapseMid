import { getAI } from './client';

export const getEmbedding = async (text: string): Promise<number[]> => {
    try {
        const client = getAI();
        const response = await client.models.embedContent({
            model: 'text-embedding-004',
            contents: text,
        });
        
        const res = response as any;
        if (res.embedding?.values) {
            return res.embedding.values;
        }
        return [];
    } catch (error) {
        console.error("Embedding Error:", error);
        return [];
    }
};