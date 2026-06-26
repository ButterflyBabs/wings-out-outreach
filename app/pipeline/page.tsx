'use client';

import { useState } from 'react';
import { TrendingUp, Building2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PipelinePage() {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  const opportunities = [
    { id: '1', company: 'SpinLife', title: 'Power Chair Review', stage: 'active', value: 1200, priority: 'A' },
    { id: '2', company: 'Med Mart', title: 'Bathroom Series', stage: 'contract', value: 2500, priority: 'A' },
    { id: '3', company: 'Ovidis', title: 'Clothing Launch', stage: 'negotiation', value: 1800, priority: 'B' },
    { id: '4', company: 'EqualWeb', title: 'Partnership', stage: 'outreach', value: 3000, priority: 'A' },
    { id: '5', company: 'All in One', title: 'Widget Content', stage: 'research', value: 1500, priority: 'B' },
  ];

  const stages = [
    { id: 'research', label: 'Research', color: 'bg-gray-500/20 text-gray-400' },
    { id: 'outreach', label: 'Outreach', color: 'bg-blue-500/20 text-blue-400' },
    { id: 'negotiation', label: 'Negotiation', color: 'bg-yellow-500/20 text-yellow-400' },
    { id: 'contract', label: 'Contract', color: 'bg-purple-500/20 text-purple-400' },
    { id: 'active', label: 'Active', color: 'bg-sacred-teal/20 text-sacred-teal' },
  ];

  const priorityColors: any = {
    A: 'bg-green-500/20 text-green-400',
    B: 'bg-yellow-500/20 text-yellow-400',
    C: 'bg-orange-500/20 text-orange-400',
    D: 'bg-gray-500/20 text-gray-400'
  };

  const activePipeline = opportunities.filter(o => !['completed', 'lost'].includes(o.stage)).reduce((sum, o) => sum + o.value, 0);
  const avgDealSize = opportunities.reduce((sum, o) => sum + o.value, 0) / opportunities.length;

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-warm-gold">Pipeline</h1>
          <p className="text-ivory-light/60 mt-1">Track opportunities from research to completion</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('board')} className={`px-4 py-2 rounded-xl text-sm font-medium ${viewMode === 'board' ? 'bg-sacred-teal/20 text-sacred-teal border border-sacred-teal/30' : 'bg-royal-plum/20 text-ivory-light/70'}`}>
            Board
          </button>
          <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-xl text-sm font-medium ${viewMode === 'list' ? 'bg-sacred-teal/20 text-sacred-teal border border-sacred-teal/30' : 'bg-royal-plum/20 text-ivory-light/70'}`}>
            List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <p className="text-ivory-light/60 text-sm mb-1">Active Pipeline</p>
          <p className="text-2xl font-bold text-sacred-teal">{formatCurrency(activePipeline)}</p>
        </div>
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <p className="text-ivory-light/60 text-sm mb-1">Avg Deal Size</p>
          <p className="text-2xl font-bold text-warm-gold">{formatCurrency(avgDealSize)}</p>
        </div>
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <p className="text-ivory-light/60 text-sm mb-1">Total Deals</p>
          <p className="text-2xl font-bold text-purple-400">{opportunities.length}</p>
        </div>
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <p className="text-ivory-light/60 text-sm mb-1">Active</p>
          <p className="text-2xl font-bold text-green-400">{opportunities.filter(o => o.stage === 'active').length}</p>
        </div>
      </div>

      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stages.map((stage) => {
            const stageOpps = opportunities.filter(o => o.stage === stage.id);
            return (
              <div key={stage.id} className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl">
                <div className={`p-4 border-b border-warm-gold/10 rounded-t-2xl`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ivory-light">{stage.label}</span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${stage.color}`}>
                      {stageOpps.length}
                    </span>
                  </div>
                  <p className="text-sm text-ivory-light/60 mt-1">
                    {formatCurrency(stageOpps.reduce((sum, o) => sum + o.value, 0))}
                  </p>
                </div>
                <div className="p-3 space-y-3">
                  {stageOpps.map((opp) => (
                    <div key={opp.id} className="bg-deep-indigo/50 border border-warm-gold/10 rounded-xl p-4 hover:border-warm-gold/30 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[opp.priority]}`}>
                          {opp.priority}
                        </span>
                        <span className="text-warm-gold font-bold">{formatCurrency(opp.value)}</span>
                      </div>
                      <h3 className="font-medium text-ivory-light">{opp.company}</h3>
                      <p className="text-sm text-ivory-light/60">{opp.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-royal-plum/30 border-b border-warm-gold/10">
              <tr>
                <th className="text-left px-6 py-4 text-ivory-light font-semibold">Company</th>
                <th className="text-left px-4 py-4 text-ivory-light font-semibold">Opportunity</th>
                <th className="text-center px-4 py-4 text-ivory-light font-semibold">Value</th>
                <th className="text-center px-4 py-4 text-ivory-light font-semibold">Stage</th>
                <th className="text-center px-4 py-4 text-ivory-light font-semibold">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-gold/10">
              {opportunities.map((opp) => {
                const stageInfo = stages.find(s => s.id === opp.stage);
                return (
                  <tr key={opp.id} className="hover:bg-royal-plum/20">
                    <td className="px-6 py-4 text-ivory-light font-medium">{opp.company}</td>
                    <td className="px-4 py-4 text-ivory-light">{opp.title}</td>
                    <td className="text-center px-4 py-4 text-warm-gold font-bold">{formatCurrency(opp.value)}</td>
                    <td className="text-center px-4 py-4">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${stageInfo?.color}`}>
                        {stageInfo?.label}
                      </span>
                    </td>
                    <td className="text-center px-4 py-4">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${priorityColors[opp.priority]}`}>
                        {opp.priority}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
