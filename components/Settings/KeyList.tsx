import React from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../services/surrealService';
import { ApiKey } from '../../types';

interface Props {
  keys: ApiKey[];
  onRefresh: () => void;
}

export const KeyList: React.FC<Props> = ({ keys, onRefresh }) => {
    const { t } = useTranslation();

    const handleRevoke = async (id: string) => {
        if(window.confirm('Are you sure you want to revoke this key?')) {
            await db.revokeApiKey(id);
            onRefresh();
        }
    };

    const formatScope = (scope: string) => {
        return scope.replace('memory:', '').replace(':', ' ').toUpperCase();
    };

    return (
        <div className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white">API Keys</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-dark-900 text-gray-500 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-4 font-medium">{t('settings.keyName')}</th>
                            <th className="px-6 py-4 font-medium">{t('settings.permissions')}</th>
                            <th className="px-6 py-4 font-medium">{t('settings.tokensUsed')}</th>
                            <th className="px-6 py-4 font-medium">{t('common.status')}</th>
                            <th className="px-6 py-4 font-medium text-right">{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {keys.map((k) => (
                            <tr key={k.id} className="hover:bg-gray-50 dark:hover:bg-dark-900/50">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                    <div>{k.name}</div>
                                    <div className="font-mono text-xs text-gray-500 mt-1">{k.keyMasked}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {k.scopes?.map(scope => (
                                            <span key={scope} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                                {formatScope(scope)}
                                            </span>
                                        ))}
                                    </div>
                                </td>
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
    );
};