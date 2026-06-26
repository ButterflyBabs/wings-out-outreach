'use client';

import { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, Plus, X, Calendar, Users, Edit2, Trash2, Eye, ArrowLeft, Loader2 } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'dm' | 'mixed';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  target_count: number;
  sent_count: number;
  response_count: number;
  description?: string;
  scheduled_date?: string;
  created_at: string;
}

interface Message {
  id: string;
  company: string;
  status: 'responded' | 'opened' | 'sent' | 'pending';
  type: 'email' | 'dm';
}

export default function OutreachPage() {
  const [tab, setTab] = useState<'campaigns' | 'messages'>('campaigns');
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Load campaigns from Supabase on mount
  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    try {
      const { supabase } = await import('@/lib/supabase');
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Use default campaigns if not logged in
        setCampaigns([
          { id: '1', name: 'Q3 Mobility Outreach', type: 'email', status: 'active', sent_count: 18, target_count: 25, response_count: 3, description: 'Outreach to mobility equipment companies for Q3', created_at: '2026-06-20' },
          { id: '2', name: 'Service Dog Brands', type: 'mixed', status: 'scheduled', sent_count: 0, target_count: 15, response_count: 0, scheduled_date: '2026-06-28', description: 'Targeting service dog equipment and food brands', created_at: '2026-06-22' },
          { id: '3', name: 'Clothing Follow-up', type: 'email', status: 'completed', sent_count: 10, target_count: 10, response_count: 2, description: 'Follow-up campaign for adaptive clothing companies', created_at: '2026-06-15' },
        ]);
        setLoading(false);
        return;
      }
      
      const { data, error } = await (supabase as any)
        .from('campaigns')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setCampaigns(data);
      } else {
        // Use default campaigns if none exist
        setCampaigns([
          { id: '1', name: 'Q3 Mobility Outreach', type: 'email', status: 'active', sent_count: 18, target_count: 25, response_count: 3, description: 'Outreach to mobility equipment companies for Q3', created_at: '2026-06-20' },
          { id: '2', name: 'Service Dog Brands', type: 'mixed', status: 'scheduled', sent_count: 0, target_count: 15, response_count: 0, scheduled_date: '2026-06-28', description: 'Targeting service dog equipment and food brands', created_at: '2026-06-22' },
          { id: '3', name: 'Clothing Follow-up', type: 'email', status: 'completed', sent_count: 10, target_count: 10, response_count: 2, description: 'Follow-up campaign for adaptive clothing companies', created_at: '2026-06-15' },
        ]);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
      // Fallback to default campaigns
      setCampaigns([
        { id: '1', name: 'Q3 Mobility Outreach', type: 'email', status: 'active', sent_count: 18, target_count: 25, response_count: 3, description: 'Outreach to mobility equipment companies for Q3', created_at: '2026-06-20' },
        { id: '2', name: 'Service Dog Brands', type: 'mixed', status: 'scheduled', sent_count: 0, target_count: 15, response_count: 0, scheduled_date: '2026-06-28', description: 'Targeting service dog equipment and food brands', created_at: '2026-06-22' },
        { id: '3', name: 'Clothing Follow-up', type: 'email', status: 'completed', sent_count: 10, target_count: 10, response_count: 2, description: 'Follow-up campaign for adaptive clothing companies', created_at: '2026-06-15' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'email' as 'email' | 'dm' | 'mixed',
    target_count: 10,
    description: '',
    scheduled_date: '',
    status: 'draft' as 'draft' | 'scheduled'
  });

  const [editCampaign, setEditCampaign] = useState({
    name: '',
    type: 'email' as 'email' | 'dm' | 'mixed',
    target_count: 10,
    description: '',
    scheduled_date: '',
    status: 'draft' as 'draft' | 'scheduled' | 'active' | 'paused' | 'completed'
  });

  const messages: Message[] = [
    { id: '1', company: 'SpinLife', status: 'responded', type: 'email' },
    { id: '2', company: 'Med Mart', status: 'opened', type: 'email' },
    { id: '3', company: 'Ovidis', status: 'sent', type: 'dm' },
  ];

  const totalSent = campaigns.reduce((sum, c) => sum + c.sent_count, 0);
  const totalResponses = campaigns.reduce((sum, c) => sum + c.response_count, 0);

  async function handleCreateCampaign(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { supabase } = await import('@/lib/supabase');
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Check for demo mode
      const isDemoMode = localStorage.getItem('demoMode') === 'true';
      
      if (!user && !isDemoMode) {
        window.location.href = '/login';
        setSaving(false);
        return;
      }
      
      // In demo mode, just add to local state without database
      if (isDemoMode) {
        const campaign: Campaign = {
          id: 'demo-' + Date.now().toString(),
          name: newCampaign.name,
          type: newCampaign.type,
          status: newCampaign.scheduled_date ? 'scheduled' : 'draft',
          target_count: newCampaign.target_count,
          sent_count: 0,
          response_count: 0,
          description: newCampaign.description,
          scheduled_date: newCampaign.scheduled_date || undefined,
          created_at: new Date().toISOString().split('T')[0]
        };
        setCampaigns([campaign, ...campaigns]);
        setShowNewCampaignModal(false);
        setNewCampaign({
          name: '',
          type: 'email',
          target_count: 10,
          description: '',
          scheduled_date: '',
          status: 'draft'
        });
        setSaving(false);
        return;
      }
      
      const campaignData = {
        name: newCampaign.name,
        type: newCampaign.type,
        status: newCampaign.scheduled_date ? 'scheduled' : 'draft',
        target_count: newCampaign.target_count,
        sent_count: 0,
        response_count: 0,
        description: newCampaign.description || null,
        scheduled_date: newCampaign.scheduled_date || null,
        created_at: new Date().toISOString(),
        created_by: user?.id
      };
      
      const { data, error } = await (supabase as any)
        .from('campaigns')
        .insert(campaignData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Add the new campaign to the list
      setCampaigns([data, ...campaigns]);
      setShowNewCampaignModal(false);
      setNewCampaign({
        name: '',
        type: 'email',
        target_count: 10,
        description: '',
        scheduled_date: '',
        status: 'draft'
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to save campaign. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleEditCampaign(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCampaign) return;
    
    setSaving(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      
      const updateData = {
        name: editCampaign.name,
        type: editCampaign.type,
        status: editCampaign.status,
        target_count: editCampaign.target_count,
        description: editCampaign.description || null,
        scheduled_date: editCampaign.scheduled_date || null
      };
      
      const { error } = await (supabase as any)
        .from('campaigns')
        .update(updateData)
        .eq('id', selectedCampaign.id);
      
      if (error) throw error;
      
      setCampaigns(campaigns.map(c => 
        c.id === selectedCampaign.id 
          ? { ...c, ...editCampaign, scheduled_date: editCampaign.scheduled_date || undefined }
          : c
      ));
      setShowEditModal(false);
      setSelectedCampaign(null);
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert('Failed to update campaign. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCampaign(id: string) {
    if (confirm('Are you sure you want to delete this campaign?')) {
      try {
        const { supabase } = await import('@/lib/supabase');
        
        const { error } = await (supabase as any)
          .from('campaigns')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        setCampaigns(campaigns.filter(c => c.id !== id));
        setViewMode('list');
        setSelectedCampaign(null);
      } catch (error) {
        console.error('Error deleting campaign:', error);
        alert('Failed to delete campaign. Please try again.');
      }
    }
  }

  function openEditModal(campaign: Campaign) {
    setEditCampaign({
      name: campaign.name,
      type: campaign.type,
      target_count: campaign.target_count,
      description: campaign.description || '',
      scheduled_date: campaign.scheduled_date || '',
      status: campaign.status
    });
    setSelectedCampaign(campaign);
    setShowEditModal(true);
  }

  function viewCampaign(campaign: Campaign) {
    setSelectedCampaign(campaign);
    setViewMode('detail');
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-500/20 text-gray-400',
    scheduled: 'bg-purple-500/20 text-purple-400',
    active: 'bg-green-500/20 text-green-400',
    paused: 'bg-yellow-500/20 text-yellow-400',
    completed: 'bg-blue-500/20 text-blue-400'
  };

  if (viewMode === 'detail' && selectedCampaign) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setViewMode('list')}
            className="p-2 hover:bg-royal-plum/30 rounded-lg text-ivory-light/70"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-warm-gold">{selectedCampaign.name}</h1>
            <p className="text-ivory-light/60 mt-1">Campaign Details</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <p className="text-ivory-light/60 text-sm">Status</p>
            <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium mt-2 ${statusColors[selectedCampaign.status]}`}>
              {selectedCampaign.status}
            </span>
          </div>
          <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <p className="text-ivory-light/60 text-sm">Type</p>
            <p className="text-xl font-bold text-ivory-light capitalize mt-2">{selectedCampaign.type}</p>
          </div>
          <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <p className="text-ivory-light/60 text-sm">Progress</p>
            <p className="text-xl font-bold text-sacred-teal mt-2">{selectedCampaign.sent_count} / {selectedCampaign.target_count}</p>
          </div>
          <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <p className="text-ivory-light/60 text-sm">Responses</p>
            <p className="text-xl font-bold text-green-400 mt-2">{selectedCampaign.response_count}</p>
          </div>
        </div>

        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <h2 className="font-semibold text-ivory-light mb-4">Campaign Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-ivory-light/60">Description</label>
              <p className="text-ivory-light mt-1">{selectedCampaign.description || 'No description'}</p>
            </div>
            {selectedCampaign.scheduled_date && (
              <div>
                <label className="text-sm text-ivory-light/60">Scheduled Date</label>
                <p className="text-ivory-light mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {selectedCampaign.scheduled_date}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm text-ivory-light/60">Created</label>
              <p className="text-ivory-light mt-1">{selectedCampaign.created_at}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => openEditModal(selectedCampaign)}
            className="btn-primary flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" /> Edit Campaign
          </button>
          <button 
            onClick={() => handleDeleteCampaign(selectedCampaign.id)}
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-warm-gold">Outreach</h1>
          <p className="text-ivory-light/60 mt-1">Manage campaigns and messages</p>
        </div>
        <button 
          onClick={() => setShowNewCampaignModal(true)}
          className="btn-primary flex items-center gap-2"
        >
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-sacred-teal animate-spin" />
        </div>
      ) : tab === 'campaigns' ? (
        <div className="space-y-4">
          {campaigns.map((c) => (
            <div key={c.id} className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6 hover:border-warm-gold/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 
                    className="font-semibold text-ivory-light text-lg cursor-pointer hover:text-sacred-teal transition-colors"
                    onClick={() => viewCampaign(c)}
                  >
                    {c.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`px-2 py-1 rounded text-xs ${statusColors[c.status]}`}>
                      {c.status}
                    </span>
                    <span className="text-xs text-ivory-light/50 capitalize">{c.type}</span>
                    {c.scheduled_date && (
                      <span className="text-xs text-ivory-light/50 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {c.scheduled_date}
                      </span>
                    )}
                  </div>
                  {c.description && (
                    <p className="text-sm text-ivory-light/60 mt-2 line-clamp-1">{c.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={() => viewCampaign(c)}
                    className="p-2 hover:bg-royal-plum/30 rounded-lg text-ivory-light/60 hover:text-ivory-light transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => openEditModal(c)}
                    className="p-2 hover:bg-royal-plum/30 rounded-lg text-ivory-light/60 hover:text-ivory-light transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCampaign(c.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg text-ivory-light/60 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="h-2 bg-royal-plum/30 rounded-full">
                <div 
                  className="h-full bg-sacred-teal rounded-full transition-all" 
                  style={{ width: `${c.target_count > 0 ? (c.sent_count / c.target_count) * 100 : 0}%` }} 
                />
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-sm text-ivory-light/60">{c.sent_count} / {c.target_count} sent</p>
                <p className="text-sm text-green-400">{c.response_count} responses</p>
              </div>
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

      {/* New Campaign Modal */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-deep-indigo border border-warm-gold/20 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-warm-gold/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sacred-teal/20 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-sacred-teal" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-warm-gold">New Campaign</h2>
                  <p className="text-sm text-ivory-light/60">Create a new outreach campaign</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNewCampaignModal(false)}
                className="p-2 hover:bg-royal-plum/30 rounded-lg text-ivory-light/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                  placeholder="e.g., Q3 Mobility Equipment Outreach"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">Campaign Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['email', 'dm', 'mixed'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewCampaign({...newCampaign, type})}
                      className={`px-4 py-3 rounded-xl text-sm font-medium capitalize transition-all ${
                        newCampaign.type === type
                          ? 'bg-sacred-teal/20 text-sacred-teal border border-sacred-teal/30'
                          : 'bg-royal-plum/20 text-ivory-light/70 border border-transparent hover:bg-royal-plum/30'
                      }`}
                    >
                      {type === 'email' && <Mail className="w-4 h-4 inline mr-2" />}
                      {type === 'dm' && <Send className="w-4 h-4 inline mr-2" />}
                      {type === 'mixed' && <Users className="w-4 h-4 inline mr-2" />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">Target Number of Companies</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newCampaign.target_count}
                    onChange={(e) => setNewCampaign({...newCampaign, target_count: parseInt(e.target.value) || 10})}
                    className="w-24 px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light text-center"
                  />
                  <span className="text-ivory-light/60">companies</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">Schedule (Optional)</label>
                <input
                  type="date"
                  value={newCampaign.scheduled_date}
                  onChange={(e) => setNewCampaign({...newCampaign, scheduled_date: e.target.value})}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                />
                <p className="text-xs text-ivory-light/50 mt-1">Leave blank to save as draft</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">Description</label>
                <textarea
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                  placeholder="Brief description of campaign goals..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-warm-gold/10">
                <button type="button" onClick={() => setShowNewCampaignModal(false)} className="px-6 py-3 text-ivory-light/70 hover:text-ivory-light transition-colors" disabled={saving}>Cancel</button>
                <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Campaign Modal */}
      {showEditModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-deep-indigo border border-warm-gold/20 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-warm-gold/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sacred-teal/20 flex items-center justify-center">
                  <Edit2 className="w-5 h-5 text-sacred-teal" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-warm-gold">Edit Campaign</h2>
                  <p className="text-sm text-ivory-light/60">Update campaign details</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-royal-plum/30 rounded-lg text-ivory-light/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditCampaign} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={editCampaign.name}
                  onChange={(e) => setEditCampaign({...editCampaign, name: e.target.value})}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">Status</label>
                <select
                  value={editCampaign.status}
                  onChange={(e) => setEditCampaign({...editCampaign, status: e.target.value as any})}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">Campaign Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['email', 'dm', 'mixed'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEditCampaign({...editCampaign, type})}
                      className={`px-4 py-3 rounded-xl text-sm font-medium capitalize transition-all ${
                        editCampaign.type === type
                          ? 'bg-sacred-teal/20 text-sacred-teal border border-sacred-teal/30'
                          : 'bg-royal-plum/20 text-ivory-light/70 border border-transparent hover:bg-royal-plum/30'
                      }`}
                    >
                      {type === 'email' && <Mail className="w-4 h-4 inline mr-2" />}
                      {type === 'dm' && <Send className="w-4 h-4 inline mr-2" />}
                      {type === 'mixed' && <Users className="w-4 h-4 inline mr-2" />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">Target Number of Companies</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editCampaign.target_count}
                    onChange={(e) => setEditCampaign({...editCampaign, target_count: parseInt(e.target.value) || 10})}
                    className="w-24 px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light text-center"
                  />
                  <span className="text-ivory-light/60">companies</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">Schedule Date</label>
                <input
                  type="date"
                  value={editCampaign.scheduled_date}
                  onChange={(e) => setEditCampaign({...editCampaign, scheduled_date: e.target.value})}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">Description</label>
                <textarea
                  value={editCampaign.description}
                  onChange={(e) => setEditCampaign({...editCampaign, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-warm-gold/10">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-3 text-ivory-light/70 hover:text-ivory-light transition-colors" disabled={saving}>Cancel</button>
                <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
