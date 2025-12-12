import { useState, useRef, useEffect } from 'react';
import { db } from '../services/surrealService';
import { analyzeNovelty } from '../services/gemini/index';
import { orchestratedGeneration } from '../services/hope/orchestrator'; 
import { trackFastMemoryFact } from '../services/hope/consolidation'; 
import { ChatMessage, MemoryNode } from '../types';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingFact, setTrainingFact] = useState<string | null>(null);
  
  // Monitoring Agent: Watches for adapter status changes from the background worker
  useEffect(() => {
      const handleUpdate = () => {
          const adapters = db.getAdapters();
          const training = adapters.some(a => a.status === 'training');
          setIsTraining(training);
          if (!training) {
              setTrainingFact(null);
          }
      };
      // Initial check
      handleUpdate();
      
      window.addEventListener('lora-update', handleUpdate);
      return () => window.removeEventListener('lora-update', handleUpdate);
  }, []);

  const processNovelty = async (text: string) => {
    // 1. Analyze Novelty via Gemini
    const analysis = await analyzeNovelty(text);
    
    if (analysis.isNovel && analysis.confidence > 0.6) {
        console.log(`[Perceptual Memory] Critical Novelty Detected: ${analysis.fact}`);
        setTrainingFact(analysis.fact);
        
        // 2. Add to Fast Memory Buffer for Consolidation (Hope Arch)
        trackFastMemoryFact(analysis.fact, analysis.confidence);

        // 3. Trigger HOT TRAINING (Simulated LoRA Fine-tuning)
        // Find the active adapter to train
        try {
            const adapters = db.getAdapters();
            // In a real scenario, we train the 'active' adapter
            const targetAdapter = adapters.find(a => a.status === 'active') || adapters[0]; 
            
            if (targetAdapter && targetAdapter.status !== 'training') {
                console.log(`[Perceptual Memory] Initiating Hot-Training for ${targetAdapter.name}`);
                // Fire and forget (it's async)
                db.hotTrainAdapter(targetAdapter.id, [analysis.fact]).catch(e => console.error(e));
            }
        } catch (e) { console.error(e); }

        return true;
    }
    return false;
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Run Novelty detection in parallel with generation start
    const noveltyPromise = processNovelty(content);

    try {
      // Generate response using HOPE Orchestrator (RAG + Context)
      const { response, nodesUsed } = await orchestratedGeneration(content, messages);

      const isNovel = await noveltyPromise;

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response,
        timestamp: Date.now(),
        relatedMemoryIds: nodesUsed.map(c => c.id),
        noveltyScore: isNovel ? 0.9 : 0
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: "Error in Orchestration Module.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    isTraining,
    trainingFact,
    sendMessage
  };
};