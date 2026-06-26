'use client';

import { useState } from 'react';
import { CheckCircle2, X, Mail, Clock } from 'lucide-react';

export default function ApprovalsPage() {
  const [filter, setFilter] = useState('pending');

  const approvals = [
    { id: '1', company: 'SpinLife', type: 'email', status: 'pending', priority: 'A', subject: 'Partnership Opportunity' },
    { id: '2', company: 'Med Mart', type: 'dm', status: 'pending', priority: 'B', subject: null },
    { id: '3', company: 'Ovidis', type: 'email', status: 'approved', priority: 'A', subject: 'Adaptive Clothing' },
  ];

  const filtered = approvals.filter(a => filter === 'all' || a.status === filter);
  const pendingCount = approvals.filter(a => a.status === 'pending').length;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-warm-gold">Approvals</h1>
          <p className="text-ivory-light/60 mt-1">Review outreach before sending</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
          <p className="text-xs text-ivory-light/50">Pending</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['pending', 'approved', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${
              filter === f ? 'bg-sacred-teal/20 text-sacred-teal border border-sacred-teal/30' : 'bg-royal-plum/20 text-ivory-light/70'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-ivory-light text-lg">{item.company}</h3>
                <p className="text-sm text-ivory-light/60">{item.type} {item.subject && `• ${item.subject}`}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                  item.priority === 'A' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  Priority {item.priority}
                </span>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  item.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
            
            {item.status === 'pending' && (
              <div className="flex gap-2 justify-end">
                <button className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  <X className="w-4 h-4 inline mr-1" /> Reject
                </button>
                <button className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  <CheckCircle2 className="w-4 h-4 inline mr-1" /> Approve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
