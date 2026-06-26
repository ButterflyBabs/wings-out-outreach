'use client';

import { useState } from 'react';
import { Building2, TrendingUp, Plus, Search } from 'lucide-react';

export default function OpportunitiesPage() {
  const [search, setSearch] = useState('');

  const opportunities = [
    { id: '1', company: 'SpinLife', title: 'Power Chair Review', stage: 'active', value: 1200, priority: 'A', fit: 9 },
    { id: '2', company: 'Med Mart', title: 'Bathroom Series', stage: 'contract', value: 2500, priority: 'A', fit: 8 },
    { id: '3', company: 'Ovidis', title: 'Clothing Launch', stage: 'negotiation', value: 1800, priority: 'B', fit: 7 },
    { id: '4', company: 'EqualWeb', title: 'Partnership', stage: 'outreach', value: 3000, priority: 'A', fit: 8 },
  ];

  const filtered = opportunities.filter(o => 
    o.company.toLowerCase().includes(search.toLowerCase()) ||
    o.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = opportunities.reduce((sum, o) => sum + o.value, 0);

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  }

  const stageColors: any = {
    research: 'bg-gray-500/20 text-gray-400',
    outreach: 'bg-blue-500/20 text-blue-400',
    negotiation: 'bg-yellow-500/20 text-yellow-400',
    contract: 'bg-purple-500/20 text-purple-400',
    active: 'bg-sacred-teal/20 text-sacred-teal',
    completed: 'bg-green-500/20 text-green-400'
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-warm-gold">Opportunities</h1>
          <p className="text-ivory-light/60 mt-1">Manage partnership opportunities</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Opportunity
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <p className="text-ivory-light/60 text-sm">Total Pipeline</p>
          <p className="text-2xl font-bold text-sacred-teal">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <p className="text-ivory-light/60 text-sm">Opportunities</p>
          <p className="text-2xl font-bold text-warm-gold">{opportunities.length}</p>
        </div>
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <p className="text-ivory-light/60 text-sm">Priority A</p>
          <p className="text-2xl font-bold text-green-400">{opportunities.filter(o => o.priority === 'A').length}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ivory-light/40" />
        <input
          type="text"
          placeholder="Search opportunities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
        />
      </div>

      <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-royal-plum/30 border-b border-warm-gold/10">
            <tr>
              <th className="text-left px-6 py-4 text-ivory-light">Company</th>
              <th className="text-left px-4 py-4 text-ivory-light">Opportunity</th>
              <th className="text-center px-4 py-4 text-ivory-light">Value</th>
              <th className="text-center px-4 py-4 text-ivory-light">Stage</th>
              <th className="text-center px-4 py-4 text-ivory-light">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-gold/10">
            {filtered.map((opp) => (
              <tr key={opp.id} className="hover:bg-royal-plum/20">
                <td className="px-6 py-4 text-ivory-light font-medium">{opp.company}</td>
                <td className="px-4 py-4 text-ivory-light">{opp.title}</td>
                <td className="text-center px-4 py-4 text-warm-gold font-bold">{formatCurrency(opp.value)}</td>
                <td className="text-center px-4 py-4">
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${stageColors[opp.stage]}`}>
                    {opp.stage}
                  </span>
                </td>
                <td className="text-center px-4 py-4">
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium border ${
                    opp.priority === 'A' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {opp.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
