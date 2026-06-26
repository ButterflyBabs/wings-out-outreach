'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function RevenuePage() {
  const [filterStatus, setFilterStatus] = useState('all');

  const revenue = [
    { id: '1', company: 'SpinLife', amount: 1200, status: 'received', type: 'Flat Fee', date: '2026-06-15' },
    { id: '2', company: 'Med Mart', amount: 2500, status: 'pending', type: 'Flat Fee', date: '2026-07-01' },
    { id: '3', company: 'Amazon', amount: 450, status: 'received', type: 'Affiliate', date: '2026-06-20' },
    { id: '4', company: 'Ovidis', amount: 1800, status: 'pending', type: 'Commission', date: '2026-06-30' },
  ];

  const totalReceived = revenue.filter(r => r.status === 'received').reduce((sum, r) => sum + r.amount, 0);
  const totalPending = revenue.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);

  const filteredRevenue = filterStatus === 'all' ? revenue : revenue.filter(r => r.status === filterStatus);

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  }

  const statusColors: any = {
    received: 'text-green-400 bg-green-500/10',
    pending: 'text-yellow-400 bg-yellow-500/10',
    overdue: 'text-red-400 bg-red-500/10'
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-warm-gold">Revenue</h1>
        <p className="text-ivory-light/60 mt-1">Track income from partnerships</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-ivory-light/60 text-sm">Received</p>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalReceived)}</p>
        </div>

        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-ivory-light/60 text-sm">Pending</p>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-400">{formatCurrency(totalPending)}</p>
        </div>

        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-ivory-light/60 text-sm">Projected</p>
            <TrendingUp className="w-5 h-5 text-sacred-teal" />
          </div>
          <p className="text-2xl font-bold text-sacred-teal">{formatCurrency(totalReceived + totalPending)}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
        >
          <option value="all">All Status</option>
          <option value="received">Received</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-royal-plum/30 border-b border-warm-gold/10">
            <tr>
              <th className="text-left px-6 py-4 text-ivory-light font-semibold">Company</th>
              <th className="text-center px-4 py-4 text-ivory-light font-semibold">Amount</th>
              <th className="text-center px-4 py-4 text-ivory-light font-semibold">Type</th>
              <th className="text-center px-4 py-4 text-ivory-light font-semibold">Status</th>
              <th className="text-center px-4 py-4 text-ivory-light font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-gold/10">
            {filteredRevenue.map((entry) => (
              <tr key={entry.id} className="hover:bg-royal-plum/20">
                <td className="px-6 py-4 text-ivory-light font-medium">{entry.company}</td>
                <td className="text-center px-4 py-4 text-warm-gold font-bold">{formatCurrency(entry.amount)}</td>
                <td className="text-center px-4 py-4 text-ivory-light/70">{entry.type}</td>
                <td className="text-center px-4 py-4">
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${statusColors[entry.status]}`}>
                    {entry.status}
                  </span>
                </td>
                <td className="text-center px-4 py-4 text-ivory-light/60">{entry.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
