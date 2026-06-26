'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Filter,
  Plus
} from 'lucide-react';

interface RevenueEntry {
  id: string;
  company_name: string;
  opportunity_title: string;
  amount: number;
  revenue_type: 'flat_fee' | 'commission' | 'affiliate' | 'product' | 'other';
  status: 'pending' | 'received' | 'overdue';
  expected_date: string;
  received_date?: string;
  notes?: string;
  platform?: string;
}

const mockRevenue: RevenueEntry[] = [
  {
    id: '1',
    company_name: 'SpinLife',
    opportunity_title: 'Power Chair Review Campaign',
    amount: 1200,
    revenue_type: 'flat_fee',
    status: 'received',
    expected_date: '2026-06-15',
    received_date: '2026-06-14',
    platform: 'Instagram',
    notes: '3 posts + 5 stories + 1 reel'
  },
  {
    id: '2',
    company_name: 'Med Mart',
    opportunity_title: 'Accessible Bathroom Series',
    amount: 2500,
    revenue_type: 'flat_fee',
    status: 'pending',
    expected_date: '2026-07-01',
    platform: 'YouTube',
    notes: '2 long-form videos + blog post'
  },
  {
    id: '3',
    company_name: 'Amazon Associates',
    opportunity_title: 'Monthly Affiliate Commission',
    amount: 450,
    revenue_type: 'affiliate',
    status: 'received',
    expected_date: '2026-06-20',
    received_date: '2026-06-20',
    platform: 'Multiple',
    notes: 'Q2 affiliate earnings'
  },
  {
    id: '4',
    company_name: 'Ovidis',
    opportunity_title: 'Adaptive Clothing Launch',
    amount: 1800,
    revenue_type: 'commission',
    status: 'pending',
    expected_date: '2026-06-30',
    platform: 'Instagram',
    notes: 'Performance-based: 10% of sales'
  }
];

const revenueTypes = [
  { value: 'flat_fee', label: 'Flat Fee', color: 'bg-blue-500/20 text-blue-400' },
  { value: 'commission', label: 'Commission', color: 'bg-purple-500/20 text-purple-400' },
  { value: 'affiliate', label: 'Affiliate', color: 'bg-green-500/20 text-green-400' },
  { value: 'product', label: 'Product', color: 'bg-orange-500/20 text-orange-400' },
  { value: 'other', label: 'Other', color: 'bg-gray-500/20 text-gray-400' }
];

const statusConfig = {
  received: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Received' },
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Pending' },
  overdue: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Overdue' }
};

export default function RevenuePage() {
  const [revenue, setRevenue] = useState<RevenueEntry[]>(mockRevenue);
  const [filterStatus, setFilterStatus] = useState<'all' | 'received' | 'pending' | 'overdue'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate totals
  const totalReceived = revenue
    .filter(r => r.status === 'received')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const totalPending = revenue
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const totalOverdue = revenue
    .filter(r => r.status === 'overdue')
    .reduce((sum, r) => sum + r.amount, 0);

  const projectedTotal = totalReceived + totalPending;

  // Filter revenue
  const filteredRevenue = revenue.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesType = filterType === 'all' || r.revenue_type === filterType;
    return matchesStatus && matchesType;
  });

  // Revenue by type
  const revenueByType = revenueTypes.map(type => ({
    ...type,
    amount: revenue
      .filter(r => r.revenue_type === type.value && r.status === 'received')
      .reduce((sum, r) => sum + r.amount, 0)
  }));

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-warm-gold">Revenue</h1>
          <p className="text-ivory-light/60 mt-1">Track income from partnerships</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Add Revenue
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-ivory-light/60 text-sm">Received</p>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalReceived)}</p>
          <p className="text-xs text-ivory-light/50 mt-1">In your account</p>
        </div>

        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-ivory-light/60 text-sm">Pending</p>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-400">{formatCurrency(totalPending)}</p>
          <p className="text-xs text-ivory-light/50 mt-1">Expected soon</p>
        </div>

        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-ivory-light/60 text-sm">Overdue</p>
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(totalOverdue)}</p>
          <p className="text-xs text-ivory-light/50 mt-1">Follow up needed</p>
        </div>

        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-ivory-light/60 text-sm">Projected</p>
            <TrendingUp className="w-5 h-5 text-sacred-teal" />
          </div>
          <p className="text-2xl font-bold text-sacred-teal">{formatCurrency(projectedTotal)}</p>
          <p className="text-xs text-ivory-light/50 mt-1">Received + Pending</p>
        </div>
      </div>

      {/* Revenue by Type */}
      <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
        <h2 className="font-serif text-xl font-bold text-warm-gold mb-4">Revenue by Type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {revenueByType.map((type) => (
            <div key={type.value} className="text-center">
              <div className={`inline-block px-3 py-1 rounded-lg text-xs font-medium mb-2 ${type.color}`}>
                {type.label}
              </div>
              <p className="text-xl font-bold text-ivory-light">{formatCurrency(type.amount)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
        >
          <option value="all">All Status</option>
          <option value="received">Received</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
        >
          <option value="all">All Types</option>
          {revenueTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>

        <div className="flex bg-royal-plum/20 border border-warm-gold/20 rounded-xl overflow-hidden">
          {(['month', 'quarter', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm capitalize transition-colors ${
                timeRange === range
                  ? 'bg-sacred-teal/20 text-sacred-teal'
                  : 'text-ivory-light/70 hover:text-ivory-light'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light/70 hover:text-ivory-light transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Revenue List */}
      <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-royal-plum/30 border-b border-warm-gold/10">
              <tr>
                <th className="text-left px-6 py-4 text-ivory-light font-semibold">Company</th>
                <th className="text-left px-4 py-4 text-ivory-light font-semibold">Opportunity</th>
                <th className="text-center px-4 py-4 text-ivory-light font-semibold">Amount</th>
                <th className="text-center px-4 py-4 text-ivory-light font-semibold">Type</th>
                <th className="text-center px-4 py-4 text-ivory-light font-semibold">Status</th>
                <th className="text-center px-4 py-4 text-ivory-light font-semibold">Expected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-gold/10">
              {filteredRevenue.map((entry) => {
                const status = statusConfig[entry.status];
                const StatusIcon = status.icon;
                const typeInfo = revenueTypes.find(t => t.value === entry.revenue_type);
                
                return (
                  <tr key={entry.id} className="hover:bg-royal-plum/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sacred-teal/20 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-sacred-teal" />
                        </div>
                        <span className="font-medium text-ivory-light">{entry.company_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-ivory-light">{entry.opportunity_title}</p>
                      {entry.notes && (
                        <p className="text-xs text-ivory-light/50">{entry.notes}</p>
                      )}
                    </td>
                    <td className="text-center px-4 py-4">
                      <span className="text-xl font-bold text-warm-gold">
                        {formatCurrency(entry.amount)}
                      </span>
                    </td>
                    <td className="text-center px-4 py-4">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${typeInfo?.color}`}>
                        {typeInfo?.label}
                      </span>
                    </td>
                    <td className="text-center px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="text-center px-4 py-4">
                      <div className="flex items-center justify-center gap-2 text-ivory-light/60">
                        <Calendar className="w-4 h-4" />
                        {new Date(entry.expected_date).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredRevenue.length === 0 && (
        <div className="text-center py-12 bg-royal-plum/10 rounded-2xl border border-warm-gold/10">
          <DollarSign className="w-16 h-16 text-ivory-light/20 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-ivory-light mb-2">No revenue entries</h3>
          <p className="text-ivory-light/60 mb-4">Add your first partnership payment</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            Add Revenue Entry
          </button>
        </div>
      )}
    </div>
  );
}
