import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from '../services/surrealService';
import { Transaction, User } from '../types';
import { Button } from './Button';

export const Billing: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const u = db.getUserFromStorage();
      setUser(u);
      const txs = await db.getTransactions();
      setTransactions(txs);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading billing info...</div>;

  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
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

      {/* Transaction Table */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white">
            {t('billing.history')}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-dark-900 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">{t('billing.date')}</th>
                <th className="px-6 py-3 font-medium">{t('billing.description')}</th>
                <th className="px-6 py-3 font-medium">{t('billing.status')}</th>
                <th className="px-6 py-3 font-medium text-right">{t('billing.amount')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-dark-900/50">
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{tx.date}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{tx.description}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-gray-900 dark:text-white">
                    ${tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};