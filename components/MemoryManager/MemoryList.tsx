import React from 'react';
import { MemoryNode } from '../../types';
import { useTranslation } from 'react-i18next';

interface MemoryListProps {
  memories: MemoryNode[];
}

export const MemoryList: React.FC<MemoryListProps> = ({ memories }) => {
  const { t } = useTranslation();

  if (memories.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <p className="text-sm">{t('memory.noFiles')}</p>
      </div>
    );
  }

  const getTrustColor = (score: number) => {
      if (score >= 0.8) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      if (score >= 0.5) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  };

  const getCategoryIcon = (cat: string) => {
      if (cat === 'operational') return '⚙️'; // Gear for actions
      if (cat === 'epistemic') return '🧠'; // Brain for facts
      return '📄';
  };

  return (
    <div className="space-y-3">
      {memories.map((mem) => (
        <div key={mem.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition bg-white dark:bg-dark-900">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{new Date(mem.createdAt).toLocaleDateString()}</span>
                {/* Category Badge */}
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center gap-1">
                   <span>{getCategoryIcon(mem.category)}</span> {mem.category}
                </span>
            </div>
            {/* Trust Score Badge */}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getTrustColor(mem.trustScore)}`}>
                Trust: {Math.round(mem.trustScore * 100)}%
            </span>
          </div>
          
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 truncate mb-1">{mem.fileName}</h4>
          <p className="text-xs text-gray-500 line-clamp-2">{mem.content}</p>
          
          {/* Graph Data */}
          <div className="mt-3 flex flex-wrap gap-2">
            {mem.entities.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{t('memory.entities')}:</span>
                    {mem.entities.slice(0, 3).map(ent => (
                        <span key={ent} className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400">
                            {ent}
                        </span>
                    ))}
                </div>
            )}
            {mem.relations.length > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                      {mem.relations.length} {t('memory.relations')}
                  </div>
            )}
            
            {/* Validation Status */}
            {mem.validationStatus === 'pending_review' && (
                <span className="text-[10px] text-orange-500 font-medium">⚠️ Needs Review</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};