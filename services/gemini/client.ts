import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;

export const getAI = () => {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
}