import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../services/surrealService';
import { Input } from '../Input';
import { Button } from '../Button';

interface Props {
  onSuccess: () => void;
  onToggle: () => void;
}

export const Login: React.FC<Props> = ({ onSuccess, onToggle }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await db.signin(data.email, data.password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        name="email" type="email" label={t('common.email')}
        value={data.email} onChange={handleChange} required 
      />
      <Input 
        name="password" type="password" label={t('common.password')}
        value={data.password} onChange={handleChange} required 
      />

      {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

      <Button type="submit" className="w-full py-3" isLoading={loading}>
        {t('common.login')}
      </Button>

      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('auth.noAccount')}
            <button type="button" onClick={onToggle} className="ml-1 text-brand-600 font-semibold hover:underline">
            {t('common.register')}
            </button>
        </p>
      </div>
    </form>
  );
};