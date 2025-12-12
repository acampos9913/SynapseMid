import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../../services/surrealService';
import { Input } from '../../Input';
import { Button } from '../../Button';

interface Props {
  onSuccess: () => void;
}

export const UrlInput: React.FC<Props> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!url) return;
    setLoading(true);
    try {
        const simulatedContent = `Scraped content from ${url}.`;
        await db.addMemoryNode(simulatedContent, url, 'url', url);
        setUrl('');
        onSuccess();
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full justify-center">
        <div className="mb-6 text-center">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" /></svg>
        </div>
        <h3 className="font-medium text-gray-900 dark:text-white">{t('memory.sources.web')}</h3>
        </div>
        <Input 
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={t('memory.placeholders.url')}
        type="url"
        disabled={loading}
        />
        <Button type="submit" isLoading={loading} className="mt-2">{t('memory.add')}</Button>
    </form>
  );
};