import React, { useState } from 'react';
import { db } from '../../../services/surrealService';
import { Button } from '../../Button';
import { getFastMemoryState } from '../../../services/hope/consolidation';

export const Optimization: React.FC = () => {
    const [loading, setLoading] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("");
    const fastMemCount = getFastMemoryState().length;

    const runAgent = async (agent: string, fn: () => Promise<any>, label: string) => {
        setLoading(agent);
        setStatus(`Running ${label}...`);
        try {
            await fn();
            setStatus(`${label} completed successfully.`);
        } catch (e) {
            setStatus(`Error in ${label}.`);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 rounded-xl text-white shadow-lg">
                <h3 className="text-lg font-bold mb-2">HOPE Central Control</h3>
                <p className="text-indigo-200 text-sm mb-4">
                    Hierarchical Optimization & Perceptual Engine. 
                    Orchestrates memory movement between Short-term (LoRA) and Long-term (SurrealDB).
                </p>
                <div className="flex gap-4 text-center">
                    <div className="bg-white/10 p-3 rounded-lg flex-1">
                        <div className="text-2xl font-bold">{fastMemCount}</div>
                        <div className="text-xs opacity-70">Facts in Fast Mem</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg flex-1">
                        <div className="text-2xl font-bold">Active</div>
                        <div className="text-xs opacity-70">Orchestrator</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* Abstraction Agent */}
                <div className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <span className="text-xl">🗂️</span> Hierarchical Abstraction
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs">
                            Groups detailed memories into high-level concept nodes to optimize retrieval context.
                        </p>
                    </div>
                    <Button 
                        onClick={() => runAgent('abstraction', db.runAbstraction, 'Abstraction Cycle')}
                        isLoading={loading === 'abstraction'}
                        variant="secondary"
                    >
                        Generate Abstracts
                    </Button>
                </div>

                {/* Forgetting Agent */}
                <div className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <span className="text-xl">🗑️</span> Smart Forgetting
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs">
                            Removes unused LoRA adapters and archives low-confidence memories.
                        </p>
                    </div>
                    <Button 
                        onClick={() => runAgent('forgetting', db.runForgetting, 'Garbage Collection')}
                        isLoading={loading === 'forgetting'}
                        variant="danger"
                        className="bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                    >
                        Run Cleanup
                    </Button>
                </div>
            </div>

            {status && (
                <div className="bg-gray-100 dark:bg-dark-800 p-3 rounded-lg text-sm text-center font-mono text-gray-600 dark:text-gray-400">
                    {`> SYSTEM: ${status}`}
                </div>
            )}
        </div>
    );
};