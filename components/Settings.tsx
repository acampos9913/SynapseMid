import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../services/surrealService';
import { ApiKey, ApiLog } from '../types';
import { Button } from './Button';
import { Input } from './Input';

export const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
    // Poll for logs every 2 seconds to simulate realtime monitoring
    const interval = setInterval(() => {
        setLogs(db.getApiLogs());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setKeys(db.getApiKeys());
    setLogs(db.getApiLogs());
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newKeyName) return;
    setLoading(true);
    await db.createApiKey(newKeyName);
    setNewKeyName('');
    setLoading(false);
    loadData();
  };

  const handleRevoke = async (id: string) => {
    if(window.confirm('Are you sure you want to revoke this key?')) {
        await db.revokeApiKey(id);
        loadData();
    }
  };

  return (
    <div className="space-y-6">
       <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('settings.title')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.description')}</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Create Key Form */}
           <div className="lg:col-span-1 bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
                <h3 className="font-bold mb-4 text-gray-900 dark:text-white">{t('settings.createKey')}</h3>
                <form onSubmit={handleCreate}>
                    <Input 
                        label={t('settings.keyName')}
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="e.g., Development Key"
                    />
                    <Button type="submit" className="w-full" isLoading={loading} disabled={!newKeyName}>
                        {t('settings.createKey')}
                    </Button>
                </form>
           </div>

           {/* Keys Table */}
           <div className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white">API Keys</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-dark-900 text-gray-500 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-medium">{t('settings.keyName')}</th>
                                <th className="px-6 py-4 font-medium">Key</th>
                                <th className="px-6 py-4 font-medium">{t('settings.tokensUsed')}</th>
                                <th className="px-6 py-4 font-medium">{t('common.status')}</th>
                                <th className="px-6 py-4 font-medium text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {keys.map((k) => (
                                <tr key={k.id} className="hover:bg-gray-50 dark:hover:bg-dark-900/50">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{k.name}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{k.keyMasked}</td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{k.usageTokens.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                                            ${k.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}
                                        `}>
                                            {k.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {k.status === 'active' && (
                                            <button 
                                                onClick={() => handleRevoke(k.id)}
                                                className="text-red-600 hover:text-red-800 text-xs font-medium"
                                            >
                                                {t('settings.revoke')}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
           </div>
       </div>

       {/* API Logs Section */}
       <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 dark:text-white">{t('settings.logs')}</h3>
                <span className="text-xs text-gray-500">Live View (Last 50)</span>
            </div>
            <div className="overflow-x-auto max-h-80">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-dark-900 text-gray-500 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 font-medium">{t('settings.timestamp')}</th>
                            <th className="px-6 py-3 font-medium">{t('settings.method')}</th>
                            <th className="px-6 py-3 font-medium">{t('settings.endpoint')}</th>
                            <th className="px-6 py-3 font-medium">{t('common.status')}</th>
                            <th className="px-6 py-3 font-medium text-right">{t('settings.latency')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-dark-900/50">
                                <td className="px-6 py-2 text-gray-500 text-xs whitespace-nowrap">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </td>
                                <td className="px-6 py-2 font-mono text-xs">
                                    <span className={`font-bold ${
                                        log.method === 'GET' ? 'text-blue-600' :
                                        log.method === 'POST' ? 'text-green-600' :
                                        log.method === 'DELETE' ? 'text-red-600' : 'text-gray-600'
                                    }`}>
                                        {log.method}
                                    </span>
                                </td>
                                <td className="px-6 py-2 font-mono text-xs text-gray-700 dark:text-gray-300">
                                    {log.endpoint}
                                </td>
                                <td className="px-6 py-2">
                                    <span className={`text-xs font-medium ${
                                        log.status >= 200 && log.status < 300 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="px-6 py-2 text-right text-xs text-gray-500">
                                    {log.latencyMs}ms
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
       </div>
    </div>
  );
};
