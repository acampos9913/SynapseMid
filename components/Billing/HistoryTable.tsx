import React from 'react';
import { useTranslation } from 'react-i18next';
import { Transaction } from '../../types';

interface Props {
  transactions: Transaction[];
}

export const HistoryTable: React.FC<Props> = ({ transactions }) => {
  const { t } = useTranslation();
  return (
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
  );
};