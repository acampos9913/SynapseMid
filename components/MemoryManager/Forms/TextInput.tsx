import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../../services/surrealService';
import { Input } from '../../Input';
import { Button } from '../../Button';

interface Props {
  onSuccess: () => void;
}

export const TextInput: React.FC<Props> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!title || !content) return;
    setLoading(true);
    try {
        await db.addMemoryNode(content, title, 'text');
        setTitle('');
        setContent('');
        onSuccess();
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <Input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('memory.placeholders.textTitle')}
            className="mb-4"
            disabled={loading}
        />
        <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('memory.placeholders.textContent')}
            className="flex-1 w-full p-4 rounded-lg bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none mb-4 dark:text-white"
            disabled={loading}
        />
        <Button type="submit" isLoading={loading}>{t('memory.add')}</Button>
    </form>
  );
};