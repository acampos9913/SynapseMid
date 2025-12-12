import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../services/surrealService';
import { ApiKey, ApiLog } from '../../types';
import { CreateKey } from './CreateKey';
import { KeyList } from './KeyList';
import { LogViewer } from './LogViewer';

export const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [logs, setLogs] = useState<ApiLog[]>([]);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
        setLogs(db.getApiLogs());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setKeys(db.getApiKeys());
    setLogs(db.getApiLogs());
  };

  return (
    <div className="space-y-6">
       <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('settings.title')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.description')}</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <CreateKey onSuccess={loadData} />
           <KeyList keys={keys} onRefresh={loadData} />
       </div>

       <LogViewer logs={logs} />
    </div>
  );
};