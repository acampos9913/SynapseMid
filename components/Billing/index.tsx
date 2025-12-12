import React, { useEffect, useState } from 'react';
import { db } from '../../services/surrealService';
import { Transaction, User } from '../../types';
import { Overview } from './Overview';
import { HistoryTable } from './HistoryTable';

export const Billing: React.FC = () => {
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
      <Overview user={user} transactions={transactions} />
      <HistoryTable transactions={transactions} />
    </div>
  );
};