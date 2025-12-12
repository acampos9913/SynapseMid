import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../../services/surrealService';

interface Props {
  onSuccess: () => void;
}

export const FileUpload: React.FC<Props> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const processFile = async (file: File) => {
      setLoading(true);
      try {
        const text = await file.text();
        await db.addMemoryNode(text, file.name, 'file');
        onSuccess();
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setLoading(false);
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  return (
    <div 
        className={`border-2 border-dashed rounded-xl h-full flex flex-col items-center justify-center p-6 text-center transition-colors
        ${dragActive ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-300 dark:border-gray-600'}
        `}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { 
            e.preventDefault(); 
            setDragActive(false); 
            if(e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
        }}
    >
        {loading ? (
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mb-4"></div>
        ) : (
             <svg className="w-10 h-10 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
        )}
        <label className="cursor-pointer">
            <span className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition">
                {loading ? 'Processing...' : t('memory.uploadFile')}
            </span>
            <input type="file" className="hidden" onChange={handleChange} accept=".txt,.md,.json,.csv" disabled={loading} />
        </label>
        <p className="mt-4 text-xs text-gray-400">Supported: TXT, MD, JSON, CSV</p>
    </div>
  );
};