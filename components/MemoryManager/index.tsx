import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../services/surrealService';
import { MemoryNode } from '../../types';
import { Tabs, TabType } from './Tabs';
import { MemoryList } from './MemoryList';
import { FileUpload } from './Forms/FileUpload';
import { TextInput } from './Forms/TextInput';
import { UrlInput } from './Forms/UrlInput';
import { Adapters } from './Tabs/Adapters';
import { Optimization } from './Tabs/Optimization';

export const MemoryManager: React.FC = () => {
  const { t } = useTranslation();
  const [memories, setMemories] = useState<MemoryNode[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('files');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const load = async () => {
        const data = await db.getMemories();
        setMemories(data);
    };
    load();
  }, [refreshTrigger]);

  const refresh = () => setRefreshTrigger(prev => prev + 1);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
            <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            {t('memory.title')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('memory.description')}</p>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
          {/* Input Panel */}
          <div className="w-1/3 flex flex-col bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <Tabs 
               activeTab={activeTab} 
               setActiveTab={setActiveTab} 
               labels={{
                 files: t('memory.files'), text: t('memory.text'), url: t('memory.url'),
                 integrations: t('memory.integrations'), adapters: t('memory.adapters'),
                 optimization: 'HOPE Control'
               }} 
             />
             <div className="p-6 flex-1 overflow-y-auto">
                {activeTab === 'files' && <FileUpload onSuccess={refresh} />}
                {activeTab === 'text' && <TextInput onSuccess={refresh} />}
                {activeTab === 'url' && <UrlInput onSuccess={refresh} />}
                {activeTab === 'adapters' && <Adapters />}
                {activeTab === 'optimization' && <Optimization />}
                {activeTab === 'integrations' && <div className="text-gray-400 text-center mt-10">Integrations (Google Drive, Notion) - Coming Soon</div>}
             </div>
          </div>

          {/* List Panel */}
          <div className="flex-1 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-900">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">{t('memory.filesList')}</h3>
             </div>
             <div className="flex-1 overflow-y-auto p-4">
                <MemoryList memories={memories} />
             </div>
          </div>
      </div>
    </div>
  );
};