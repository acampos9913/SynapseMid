import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../types';
import { Button } from '../Button';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  user: User | null;
  transactions: any[];
}

export const Overview: React.FC<Props> = ({ user, transactions }) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl p-6 text-white shadow-xl">
          <h3 className="text-brand-100 text-sm font-medium uppercase tracking-wide mb-1">
            {t('billing.currentBalance')}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{user?.credits || 0}</span>
            <span className="text-brand-200">tokens</span>
          </div>
          <div className="mt-6">
            <Button variant="secondary" className="w-full text-brand-900">
              {t('billing.addCredits')}
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase mb-4">Usage Trend</h3>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transactions}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="date" hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={2} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
  );
};