import React from 'react';
import { useTranslation } from 'react-i18next';
import { ApiLog } from '../../types';

interface Props {
  logs: ApiLog[];
}

export const LogViewer: React.FC<Props> = ({ logs }) => {
    const { t } = useTranslation();

    return (
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
    );
};