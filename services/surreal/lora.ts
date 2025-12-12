import { LoraAdapter, TrainingJob } from '../../types';
import { surreal } from './core';

// Keys
const ADAPTERS_KEY = 'mnemosyne_adapters';
const JOBS_KEY = 'mnemosyne_training_jobs';

// --- Adapter Management ---

export const getAdapters = (): LoraAdapter[] => {
  const stored = localStorage.getItem(ADAPTERS_KEY);
  if (!stored) {
      const initial: LoraAdapter[] = [{ 
          id: 'lora_main', 
          name: 'Personal Assistant (Main)', 
          baseModel: 'gemini-2.5-flash', 
          status: 'active', 
          version: 1, 
          loss: 0.05, 
          lastTrained: new Date().toISOString(),
          factsLearned: 120
      }];
      localStorage.setItem(ADAPTERS_KEY, JSON.stringify(initial));
      return initial;
  }
  return JSON.parse(stored);
};

export const createAdapter = async (name: string): Promise<LoraAdapter> => {
    const start = Date.now();
    await surreal.isReady;
    
    const newAdapter: LoraAdapter = {
        id: `lora_${Date.now()}`,
        name,
        baseModel: 'gemini-2.5-flash',
        status: 'idle', // Created but not loaded in VRAM
        version: 0,
        loss: 0.0,
        lastTrained: new Date().toISOString(),
        factsLearned: 0
    };
    
    const current = getAdapters();
    localStorage.setItem(ADAPTERS_KEY, JSON.stringify([...current, newAdapter]));
    
    surreal.logRequest('/lora/create', 'POST', 201, Date.now() - start);
    window.dispatchEvent(new Event('lora-update'));
    return newAdapter;
};

export const deleteAdapter = async (id: string): Promise<void> => {
  const current = getAdapters();
  const updated = current.filter(a => a.id !== id);
  localStorage.setItem(ADAPTERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('lora-update'));
};

/**
 * Simulates loading/unloading LoRA weights into VRAM.
 * Only one adapter can be 'active' (serving traffic) at a time in this mock architecture,
 * though 'loaded' (in VRAM but standby) is possible.
 */
export const toggleAdapterState = async (id: string, action: 'load' | 'unload' | 'activate'): Promise<void> => {
    const adapters = getAdapters();
    const updated = adapters.map(a => {
        if (a.id === id) {
            if (action === 'activate') return { ...a, status: 'active' as const };
            if (action === 'load') return { ...a, status: 'loaded' as const };
            if (action === 'unload') return { ...a, status: 'unloaded' as const };
        } else {
            // If activating one, deactivate others to simulate single-model serving
            if (action === 'activate' && a.status === 'active') {
                return { ...a, status: 'loaded' as const };
            }
        }
        return a;
    });
    localStorage.setItem(ADAPTERS_KEY, JSON.stringify(updated));
    // Trigger UI update
    window.dispatchEvent(new Event('lora-update'));
};

// --- Perceptual Memory / Hot Training ---

/**
 * Triggers an asynchronous training job for the Perceptual Memory Module.
 * This simulates the "Hot-Training" API.
 */
export const hotTrainAdapter = async (adapterId: string, newFacts: string[]): Promise<TrainingJob> => {
    const start = Date.now();
    await surreal.isReady;

    // 1. Create Training Job
    const job: TrainingJob = {
        id: `job_${Date.now()}`,
        adapterId,
        status: 'pending',
        dataset: newFacts,
        createdAt: new Date().toISOString()
    };

    // Store Job
    const jobs = JSON.parse(localStorage.getItem(JOBS_KEY) || '[]');
    localStorage.setItem(JOBS_KEY, JSON.stringify([...jobs, job]));

    // 2. Set Adapter to Training Mode (This locks the adapter usually)
    updateAdapterStatus(adapterId, 'training');

    surreal.logRequest(`/lora/${adapterId}/train`, 'POST', 202, Date.now() - start);

    // 3. Simulate Async Training Process
    processTrainingJob(job);

    return job;
};

// Internal simulation of the training worker
const processTrainingJob = async (job: TrainingJob) => {
    console.log(`[LoRA] Starting Hot-Training for ${job.adapterId} with facts:`, job.dataset);
    
    // Artificial latency for training (simulating gradient updates)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Update Job
    job.status = 'completed';
    job.completedAt = new Date().toISOString();

    // Update Adapter Stats (The result of training)
    const adapters = getAdapters();
    const updatedAdapters = adapters.map(a => {
        if (a.id === job.adapterId) {
            return {
                ...a,
                status: 'active' as const, // Automatically reactivate after hot-training
                version: a.version + 1,
                loss: Math.max(0.001, 0.5 * Math.pow(0.95, a.version + 1)), // Simulated Loss Curve
                lastTrained: new Date().toISOString(),
                factsLearned: a.factsLearned + job.dataset.length
            };
        }
        return a;
    });

    localStorage.setItem(ADAPTERS_KEY, JSON.stringify(updatedAdapters));
    console.log(`[LoRA] Training Complete. Adapter Version Updated.`);
    
    // Notify system components
    window.dispatchEvent(new Event('lora-update'));
};

const updateAdapterStatus = (id: string, status: LoraAdapter['status']) => {
    const adapters = getAdapters();
    const updated = adapters.map(a => a.id === id ? { ...a, status } : a);
    localStorage.setItem(ADAPTERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('lora-update'));
};