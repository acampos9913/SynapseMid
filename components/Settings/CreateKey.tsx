import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../services/surrealService';
import { Button } from '../Button';
import { Input } from '../Input';
import { PermissionScope } from '../../types';

interface Props {
  onSuccess: () => void;
}

export const CreateKey: React.FC<Props> = ({ onSuccess }) => {
    const { t } = useTranslation();
    const [newKeyName, setNewKeyName] = useState('');
    const [selectedScopes, setSelectedScopes] = useState<PermissionScope[]>(['memory:read']);
    const [loading, setLoading] = useState(false);

    const availableScopes: { id: PermissionScope; label: string }[] = [
        { id: 'memory:read', label: t('settings.scopes.readFull') },
        { id: 'memory:write', label: t('settings.scopes.write') },
        { id: 'memory:read:epistemic', label: t('settings.scopes.readEpistemic') },
        { id: 'memory:read:operational', label: t('settings.scopes.readOperational') },
    ];

    const toggleScope = (scope: PermissionScope) => {
        setSelectedScopes(prev => 
            prev.includes(scope) 
                ? prev.filter(s => s !== scope)
                : [...prev, scope]
        );
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newKeyName) return;
        setLoading(true);
        await db.createApiKey(newKeyName, selectedScopes);
        setNewKeyName('');
        setSelectedScopes(['memory:read']);
        setLoading(false);
        onSuccess();
    };

    return (
        <div className="lg:col-span-1 bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
            <h3 className="font-bold mb-4 text-gray-900 dark:text-white">{t('settings.createKey')}</h3>
            <form onSubmit={handleCreate}>
                <Input 
                    label={t('settings.keyName')}
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Development Key"
                />
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('settings.permissions')}
                    </label>
                    <div className="space-y-2">
                        {availableScopes.map(scope => (
                            <label key={scope.id} className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={selectedScopes.includes(scope.id)}
                                    onChange={() => toggleScope(scope.id)}
                                    className="rounded text-brand-600 focus:ring-brand-500 bg-gray-100 dark:bg-dark-900 border-gray-300 dark:border-gray-600"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">{scope.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <Button type="submit" className="w-full" isLoading={loading} disabled={!newKeyName || selectedScopes.length === 0}>
                    {t('settings.createKey')}
                </Button>
            </form>
        </div>
    );
};