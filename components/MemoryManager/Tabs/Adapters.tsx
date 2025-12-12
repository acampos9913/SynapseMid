import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../../services/surrealService';
import { LoraAdapter } from '../../../types';
import { Button } from '../../Button';
import { Input } from '../../Input';
import { toggleAdapterState } from '../../../services/surreal/lora';

export const Adapters: React.FC = () => {
    const { t } = useTranslation();
    const [adapters, setAdapters] = useState<LoraAdapter[]>([]);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);

    const refresh = () => {
        setAdapters(db.getAdapters());
    };

    useEffect(() => {
        refresh();
        window.addEventListener('lora-update', refresh);
        return () => window.removeEventListener('lora-update', refresh);
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newName) return;
        setLoading(true);
        await db.createAdapter(newName);
        setNewName('');
        setLoading(false);
        refresh();
    };

    const handleAction = async (id: string, action: 'load' | 'unload' | 'activate') => {
        await toggleAdapterState(id, action);
        refresh();
    };

    const handleDelete = async (id: string) => {
        if(window.confirm(t('memory.deleteConfirm'))) {
            await db.deleteAdapter(id);
            refresh();
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
            case 'training': return 'bg-purple-100 text-purple-700 border-purple-200 animate-pulse dark:bg-purple-900/30 dark:text-purple-400';
            case 'loaded': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400';
            default: return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600';
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="bg-gray-50 dark:bg-dark-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">{t('memory.createAdapter')}</h3>
                <form onSubmit={handleCreate} className="flex gap-2">
                    <div className="flex-1">
                        <Input 
                            value={newName} 
                            onChange={(e) => setNewName(e.target.value)} 
                            placeholder={t('memory.adapterName')} 
                            className="mb-0"
                        />
                    </div>
                    <Button type="submit" isLoading={loading}>{t('common.submit')}</Button>
                </form>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
                {adapters.map(adapter => (
                    <div key={adapter.id} className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition hover:shadow-md">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                    {adapter.name}
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold ${getStatusColor(adapter.status)}`}>
                                        {adapter.status}
                                    </span>
                                </h4>
                                <p className="text-xs text-gray-500 font-mono mt-1">ID: {adapter.id}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{adapter.version}</div>
                                <div className="text-xs text-gray-500">Version</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 bg-gray-50 dark:bg-dark-800 p-3 rounded-lg">
                            <div className="text-center">
                                <div className="text-xs text-gray-500 uppercase font-bold">Base Model</div>
                                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{adapter.baseModel.split('-')[0]}</div>
                            </div>
                            <div className="text-center border-l border-gray-200 dark:border-gray-700">
                                <div className="text-xs text-gray-500 uppercase font-bold">Training Loss</div>
                                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{adapter.loss.toFixed(4)}</div>
                            </div>
                            <div className="text-center border-l border-gray-200 dark:border-gray-700">
                                <div className="text-xs text-gray-500 uppercase font-bold">Facts Learned</div>
                                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{adapter.factsLearned}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
                            {adapter.status !== 'training' && (
                                <>
                                    {adapter.status === 'active' ? (
                                        <Button variant="secondary" className="text-xs py-1" disabled>Active</Button>
                                    ) : (
                                        <Button 
                                            variant="primary" 
                                            className="text-xs py-1" 
                                            onClick={() => handleAction(adapter.id, 'activate')}
                                        >
                                            Activate
                                        </Button>
                                    )}

                                    {adapter.status === 'unloaded' || adapter.status === 'idle' ? (
                                        <Button variant="secondary" className="text-xs py-1" onClick={() => handleAction(adapter.id, 'load')}>Load to VRAM</Button>
                                    ) : adapter.status !== 'active' && (
                                        <Button variant="ghost" className="text-xs py-1" onClick={() => handleAction(adapter.id, 'unload')}>Unload</Button>
                                    )}

                                    <Button variant="danger" className="text-xs py-1" onClick={() => handleDelete(adapter.id)}>Delete</Button>
                                </>
                            )}
                            {adapter.status === 'training' && (
                                <span className="text-xs text-purple-600 dark:text-purple-400 animate-pulse font-medium">Training in progress...</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};