'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  Search,
  Filter,
  Building2,
  Mail,
  Handshake,
  CheckCircle2,
  DollarSign,
  Clock,
  AlertCircle,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';

interface PipelineOpportunity {
  id: string;
  company_name: string;
  opportunity_title: string;
  stage: 'research' | 'outreach' | 'negotiation' | 'contract' | 'active' | 'completed' | 'lost';
  value: number;
  priority: 'A' | 'B' | 'C' | 'D';
  last_activity: string;
  next_action?: string;
  next_action_date?: string;
  contact_name?: string;
  fit_score: number;
}

const mockOpportunities: PipelineOpportunity[] = [
  {
    id: '1',
    company_name: 'SpinLife',
    opportunity_title: 'Power Chair Review Campaign',
    stage: 'active',
    value: 1200,
    priority: 'A',
    last_activity: '2026-06-20',
    next_action: 'Deliver final reel',
    next_action_date: '2026-06-28',
    contact_name: 'Sarah Johnson',
    fit_score: 9
  },
  {
    id: '2',
    company_name: 'Med Mart',
    opportunity_title: 'Accessible Bathroom Series',
    stage: 'contract',
    value: 2500,
    priority: 'A',
    last_activity: '2026-06-22',
    next_action: 'Sign agreement',
    next_action_date: '2026-06-27',
    contact_name: 'Mike Chen',
    fit_score: 8
  },
  {
    id: '3',
    company_name: 'Ovidis',
    opportunity_title: 'Adaptive Clothing Launch',
    stage: 'negotiation',
    value: 1800,
    priority: 'B',
    last_activity: '2026-06-21',
    next_action: 'Send counter offer',
    next_action_date: '2026-06-26',
    contact_name: 'Lisa Park',
    fit_score: 7
  },
  {
    id: '4',
    company_name: 'EqualWeb',
    opportunity_title: 'Digital Accessibility Partnership',
    stage: 'outreach',
    value: 3000,
    priority: 'A',
    last_activity: '2026-06-23',
    next_action: 'Follow up email',
    next_action_date: '2026-06-27',
    fit_score: 8
  },
  {
    id: '5',
    company_name: 'All in One Accessibility',
    opportunity_title: 'Widget Integration Content',
    stage: 'research',
    value: 1500,
    priority: 'B',
    last_activity: '2026-06-24',
    next_action: 'Initial outreach',
    next_action_date: '2026-06-28',
    fit_score: 6
  },
  {
    id: '6',
    company_name: 'Adaptive Apparel Co',
    opportunity_title: 'Seasonal Collection',
    stage: 'lost',
    value: 2000,
    priority: 'C',
    last_activity: '2026-06-15',
    fit_score: 5
  }
];

const stages = [
  { 
    id: 'research', 
    label: 'Research', 
    icon: Search,
    color: 'bg-gray-500/20 text-gray-400',
    borderColor: 'border-gray-500/30'
  },
  { 
    id: 'outreach', 
    label: 'Outreach', 
    icon: Mail,
    color: 'bg-blue-500/20 text-blue-400',
    borderColor: 'border-blue-500/30'
  },
  { 
    id: 'negotiation', 
    label: 'Negotiation', 
    icon: Handshake,
    color: 'bg-yellow-500/20 text-yellow-400',
    borderColor: 'border-yellow-500/30'
  },
  { 
    id: 'contract', 
    label: 'Contract', 
    icon: CheckCircle2,
    color: 'bg-purple-500/20 text-purple-400',
    borderColor: 'border-purple-500/30'
  },
  { 
    id: 'active', 
    label: 'Active', 
    icon: TrendingUp,
    color: 'bg-sacred-teal/20 text-sacred-teal',
    borderColor: 'border-sacred-teal/30'
  },
  { 
    id: 'completed', 
    label: 'Completed', 
    icon: CheckCircle2,
    color: 'bg-green-500/20 text-green-400',
    borderColor: 'border-green-500/30'
  },
  { 
    id: 'lost', 
    label: 'Lost', 
    icon: AlertCircle,
    color: 'bg-red-500/20 text-red-400',
    borderColor: 'border-red-500/30'
  }
];

const priorityColors = {
  A: 'bg-green-500/20 text-green-400 border-green-500/30',
  B: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  C: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  D: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
};

export default function PipelinePage() {
  const [opportunities] = useState<PipelineOpportunity[]>(mockOpportunities);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [filterPriority, setFilterPriority] = useState<'all' | 'A' | 'B' | 'C' | 'D'>('all');

  // Calculate totals
  const activePipeline = opportunities
    .filter(o => !['completed', 'lost'].includes(o.stage))
    .reduce((sum, o) => sum + o.value, 0);

  const wonRevenue = opportunities
    .filter(o => o.stage === 'completed')
    .reduce((sum, o) => sum + o.value, 0);

  const avgDealSize = opportunities.length > 0 
    ? opportunities.reduce((sum, o) => sum + o.value, 0) / opportunities.length 
    : 0;

  const winRate = opportunities.filter(o => o.stage === 'completed').length / 
    opportunities.filter(o => ['completed', 'lost'].includes(o.stage)).length * 100 || 0;

  // Filter opportunities
  const filteredOpportunities = opportunities.filter(o => 
    filterPriority === 'all' || o.priority === filterPriority
  );

  // Group by stage for board view
  const opportunitiesByStage = stages.map(stage => ({
    ...stage,
    items: filteredOpportunities.filter(o => o.stage === stage.id)
  }));

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  function isOverdue(date?: string) {
    if (!date) return false;
    return new Date(date) < new Date();
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-warm-gold">Pipeline</h1>
          <p className="text-ivory-light/60 mt-1">Track opportunities from research to completion</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('board')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              viewMode === 'board'
                ? 'bg-sacred-teal/20 text-sacred-teal border border-sacred-teal/30'
                : 'bg-royal-plum/20 text-ivory-light/70 border border-warm-gold/20'
            }`}
          >
            Board View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-sacred-teal/20 text-sacred-teal border border-sacred-teal/30'
                : 'bg-royal-plum/20 text-ivory-light/70 border border-warm-gold/20'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <p className="text-ivory-light/60 text-sm mb-1">Active Pipeline</p>
          <p className="text-2xl font-bold text-sacred-teal">{formatCurrency(activePipeline)}</p>
          <p className="text-xs text-ivory-light/50 mt-1">
            {opportunities.filter(o => !['completed', 'lost'].includes(o.stage)).length} deals
          </p>
        </div>

        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <p className="text-ivory-light/60 text-sm mb-1">Won Revenue</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(wonRevenue)}</p>
          <p className="text-xs text-ivory-light/50 mt-1">
            {opportunities.filter(o => o.stage === 'completed').length} closed
          </p>
        </div>

        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <p className="text-ivory-light/60 text-sm mb-1">Avg Deal Size</p>
          <p className="text-2xl font-bold text-warm-gold">{formatCurrency(avgDealSize)}</p>
          <p className="text-xs text-ivory-light/50 mt-1">All opportunities</p>
        </div>

        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <p className="text-ivory-light/60 text-sm mb-1">Win Rate</p>
          <p className="text-2xl font-bold text-purple-400">{winRate.toFixed(0)}%</p>
          <p className="text-xs text-ivory-light/50 mt-1">Completed vs Lost</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as any)}
          className="px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
        >
          <option value="all">All Priorities</option>
          <option value="A">Priority A</option>
          <option value="B">Priority B</option>
          <option value="C">Priority C</option>
          <option value="D">Priority D</option>
        </select>
      </div>

      {/* Board View */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto">
          {opportunitiesByStage.filter(s => s.id !== 'completed' && s.id !== 'lost').map((stage) => {
            const StageIcon = stage.icon;
            return (
              <div key={stage.id} className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl min-w-[280px]">
                {/* Stage Header */}
                <div className={`p-4 border-b ${stage.borderColor} bg-royal-plum/20 rounded-t-2xl`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StageIcon className={`w-5 h-5 ${stage.color.split(' ')[1]}`} />
                      <span className="font-semibold text-ivory-light">{stage.label}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${stage.color}`}>
                      {stage.items.length}
                    </span>
                  </div>
                  <p className="text-sm text-ivory-light/60 mt-1">
                    {formatCurrency(stage.items.reduce((sum, o) => sum + o.value, 0))}
                  </p>
                </div>

                {/* Cards */}
                <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                  {stage.items.map((opp) => (
                    <Link
                      key={opp.id}
                      href={`/opportunities/${opp.id}`}
                      className="block bg-deep-indigo/50 border border-warm-gold/10 rounded-xl p-4 hover:border-warm-gold/30 transition-all card-hover"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${priorityColors[opp.priority]}`}>
                          {opp.priority}
                        </span>
                        <span className="text-warm-gold font-bold">{formatCurrency(opp.value)}</span>
                      </div>
                      
                      <h3 className="font-medium text-ivory-light mb-1 line-clamp-2">{opp.company_name}</h3>
                      <p className="text-sm text-ivory-light/60 line-clamp-2 mb-3">{opp.opportunity_title}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-ivory-light/50 mb-2">
                        <span className="flex items-center gap-1">
                          Fit: {opp.fit_score}/10
                        </span>
                      </div>

                      {opp.next_action && (
                        <div className={`text-xs p-2 rounded-lg ${isOverdue(opp.next_action_date) ? 'bg-red-500/10 text-red-400' : 'bg-royal-plum/30 text-ivory-light/70'}`}>
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3" />
                            <span className="font-medium">
                              {isOverdue(opp.next_action_date) ? 'Overdue' : 'Next:'}
                            </span>
                          </div>
                          <p className="line-clamp-1">{opp.next_action}</p>
                          {opp.next_action_date && (
                            <p className="mt-1 opacity-70">
                              {new Date(opp.next_action_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-royal-plum/30 border-b border-warm-gold/10">
                <tr>
                  <th className="text-left px-6 py-4 text-ivory-light font-semibold">Company</th>
                  <th className="text-left px-4 py-4 text-ivory-light font-semibold">Opportunity</th>
                  <th className="text-center px-4 py-4 text-ivory-light font-semibold">Value</th>
                  <th className="text-center px-4 py-4 text-ivory-light font-semibold">Stage</th>
                  <th className="text-center px-4 py-4 text-ivory-light font-semibold">Priority</th>
                  <th className="text-left px-4 py-4 text-ivory-light font-semibold">Next Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-gold/10">
                {filteredOpportunities.map((opp) => {
                  const stageInfo = stages.find(s => s.id === opp.stage);
                  const StageIcon = stageInfo?.icon || MoreHorizontal;
                  
                  return (
                    <tr key={opp.id} className="hover:bg-royal-plum/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-sacred-teal/20 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-sacred-teal" />
                          </div>
                          <div>
                            <span className="font-medium text-ivory-light block">{opp.company_name}</span>
                            {opp.contact_name && (
                              <span className="text-xs text-ivory-light/50">{opp.contact_name}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-ivory-light">{opp.opportunity_title}</p>
                      </td>
                      <td className="text-center px-4 py-4">
                        <span className="text-lg font-bold text-warm-gold">
                          {formatCurrency(opp.value)}
                        </span>
                      </td>
                      <td className="text-center px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${stageInfo?.color}`}>
                          <StageIcon className="w-3 h-3" />
                          {stageInfo?.label}
                        </span>
                      </td>
                      <td className="text-center px-4 py-4">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium border ${priorityColors[opp.priority]}`}>
                          {opp.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {opp.next_action ? (
                          <div className={`text-sm ${isOverdue(opp.next_action_date) ? 'text-red-400' : 'text-ivory-light/70'}`}>
                            <p className="line-clamp-1">{opp.next_action}</p>
                            {opp.next_action_date && (
                              <p className="text-xs opacity-70">
                                {new Date(opp.next_action_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-ivory-light/40 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12 bg-royal-plum/10 rounded-2xl border border-warm-gold/10">
          <TrendingUp className="w-16 h-16 text-ivory-light/20 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-ivory-light mb-2">No opportunities</h3>
          <p className="text-ivory-light/60">Run AI Research to find companies</p>
        </div>
      )}
    </div>
  );
}
