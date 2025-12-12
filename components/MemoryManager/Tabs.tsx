import React from 'react';

export type TabType = 'files' | 'text' | 'url' | 'integrations' | 'adapters' | 'optimization';

interface TabsProps {
  activeTab: TabType;
  setActiveTab: (t: TabType) => void;
  labels: Record<TabType, string>;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, labels }) => {
  const tabs = [
    { id: 'files', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'text', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { id: 'url', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9' },
    { id: 'integrations', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'adapters', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { id: 'optimization', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' }
  ];

  return (
    <div className="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as TabType)}
          className={`flex-1 py-3 px-2 flex justify-center items-center transition-colors min-w-[3rem]
             ${activeTab === tab.id 
                 ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 border-b-2 border-brand-600' 
                 : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-900'}
          `}
          title={labels[tab.id as TabType] || tab.id}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
          </svg>
        </button>
      ))}
    </div>
  );
};