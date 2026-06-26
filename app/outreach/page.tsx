'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle2, Plus } from 'lucide-react';

export default function OutreachPage() {
  const [tab, setTab] = useState<'campaigns' | 'messages'>('campaigns');

  const campaigns = [
    { id: '1', name: 'Q3 Mobility Outreach', status: 'active', sent: 18, target: 25, responses: 3 },
    { id: '2', name: 'Service Dog Brands', status: 'scheduled', sent: 0, target: 15, responses: 0 },
    { id: '3', name: 'Clothing Follow-up', status: 'completed', sent: 10, target: 10, responses: 2 },
  ];

  const messages = [
    { id: '1', company: 'SpinLife', status: 'responded', type: 'email' },
    { id: '2', company: 'Med Mart', status: 'opened', type: 'email' },
    { id: '3', company: 'Ovidis', status: 'sent', type: 'dm' },
  ];

  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalResponses = campaigns.reduce((sum, c) => sum + c.responses, 0);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-warm-gold">Outreach</h1>
          <p className="text-ivory-light/60 mt-1">Manage campaigns and messages</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <p className="text-ivory-light/60 text-sm">Total Sent</p>
          <p className="text-2xl font-bold text-warm-gold">{totalSent}</p>
        </div>
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <p className="text-ivory-light/60 text-sm">Responses</p>
          <p className="text-2xl font-bold text-green-400">{totalResponses}</p>
        </div>
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <p className="text-ivory-light/60 text-sm">Rate</p>
          <p className="text-2xl font-bold text-purple-400">{totalSent > 0 ? Math.round((totalResponses / totalSent) * 100) : 0}%</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('campaigns')} className={`px-4 py-2 rounded-xl text-sm font-medium ${tab === 'campaigns' ? 'bg-sacred-teal/20 text-sacred-teal border border-sacred-teal/30' : 'bg-royal-plum/20 text-ivory-light/70'}`}>Campaigns</button>
        <button onClick={() => setTab('messages')} className={`px-4 py-2 rounded-xl text-sm font-medium ${tab === 'messages' ? 'bg-sacred-teal/20 text-sacred-teal border border-sacred-teal/30' : 'bg-royal-plum/20 text-ivory-light/70'}`}>Messages</button>
      </div>

      {tab === 'campaigns' ? (
        <div className="space-y-4">
          {campaigns.map((c) => (
            <div key={c.id} className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-ivory-light">{c.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    c.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    c.status === 'scheduled' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>{c.status}</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-warm-gold">{c.responses}</p>
                  <p className="text-xs text-ivory-light/50">responses</p>
                </div>
              </div>
              <div className="h-2 bg-royal-plum/30 rounded-full">
                <div className="h-full bg-sacred-teal rounded-full" style={{ width: `${(c.sent / c.target) * 100}%` }} />
              </div>
              <p className="text-sm text-ivory-light/60 mt-2">{c.sent} / {c.target}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl">
          <table className="w-full">
            <thead className="bg-royal-plum/30 border-b border-warm-gold/10">
              <tr>
                <th className="text-left px-6 py-4 text-ivory-light">Company</th>
                <th className="text-center px-4 py-4 text-ivory-light">Type</th>
                <th className="text-center px-4 py-4 text-ivory-light">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-gold/10">
              {messages.map((m) => (
                <tr key={m.id} className="hover:bg-royal-plum/20">
                  <td className="px-6 py-4 text-ivory-light">{m.company}</td>
                  <td className="text-center px-4 py-4 text-ivory-light/70">{m.type}</td>
                  <td className="text-center px-4 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs ${
                      m.status === 'responded' ? 'bg-green-500/10 text-green-400' :
                      m.status === 'opened' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-blue-500/10 text-blue-400'
                    }`}>{m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
