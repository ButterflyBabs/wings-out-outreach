'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter,
  Globe,
  Star,
  CheckCircle2,
  X,
  Archive
} from 'lucide-react';

interface Company {
  id: string;
  company_name: string;
  website_url: string | null;
  category: string | null;
  priority_level: string | null;
  accessibility_relevance: number | null;
  global_control_sync_status: string | null;
  created_at: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showArchived, setShowArchived] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    website_url: '',
    category: '',
    accessibility_relevance: 5,
    service_dog_relevance: 5,
    priority_level: 'C',
  });

  const categories = [
    { value: 'mobility_equipment', label: 'Mobility Equipment' },
    { value: 'wheelchairs_scooters', label: 'Wheelchairs & Scooters' },
    { value: 'accessible_vehicles', label: 'Accessible Vehicles' },
    { value: 'adaptive_clothing', label: 'Adaptive Clothing' },
    { value: 'home_accessibility', label: 'Home Accessibility' },
    { value: 'assistive_technology', label: 'Assistive Technology' },
    { value: 'digital_accessibility', label: 'Digital Accessibility' },
    { value: 'accessible_travel', label: 'Accessible Travel' },
    { value: 'service_dog_equipment', label: 'Service Dog Equipment' },
    { value: 'dog_food_treats', label: 'Dog Food & Treats' },
    { value: 'health_wellness', label: 'Health & Wellness' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const { supabase } = await import('@/lib/supabase');
      
      let websiteUrl = formData.website_url.trim();
      if (websiteUrl && !websiteUrl.match(/^https?:\/\//i)) {
        websiteUrl = 'https://' + websiteUrl;
      }

      const { error } = await (supabase as any)
        .from('companies')
        .insert({
          company_name: formData.company_name,
          website_url: websiteUrl || null,
          category: formData.category || null,
          accessibility_relevance: formData.accessibility_relevance,
          service_dog_relevance: formData.service_dog_relevance,
          priority_level: formData.priority_level,
        });

      if (error) throw error;

      setFormData({
        company_name: '',
        website_url: '',
        category: '',
        accessibility_relevance: 5,
        service_dog_relevance: 5,
        priority_level: 'C',
      });
      setShowAddModal(false);
      fetchCompanies();
      alert('Company added successfully!');
    } catch (error: any) {
      console.error('Error adding company:', error);
      alert('Failed to add company: ' + error.message);
    }
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.company_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || company.category === filterCategory;
    const matchesArchive = showArchived || company.priority_level !== 'ARCHIVED';
    return matchesSearch && matchesCategory && matchesArchive;
  });

  function getCategoryLabel(value: string | null) {
    return categories.find(c => c.value === value)?.label || value || 'Uncategorized';
  }

  function getPriorityColor(level: string | null) {
    switch (level) {
      case 'A': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'B': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'C': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'D': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'ARCHIVED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-warm-gold">Companies</h1>
          <p className="text-ivory-light/60 mt-1">Manage your prospect companies</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ivory-light/40" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <button
          onClick={() => setShowArchived(!showArchived)}
          className={`px-4 py-3 border rounded-xl transition-colors flex items-center gap-2 ${
            showArchived 
              ? 'bg-red-500/20 border-red-500/50 text-red-400' 
              : 'bg-royal-plum/20 border-warm-gold/20 text-ivory-light/70 hover:text-ivory-light'
          }`}
        >
          <Archive className="w-4 h-4" />
          {showArchived ? 'Hide Archived' : 'Show Archived'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sacred-teal"></div>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-12 bg-royal-plum/10 rounded-2xl border border-warm-gold/10">
          <Building2 className="w-16 h-16 text-ivory-light/20 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-ivory-light mb-2">No companies yet</h3>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            Add Your First Company
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <Link 
              key={company.id}
              href={`/companies/${company.id}`}
              className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6 card-hover block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-sacred-teal/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-sacred-teal" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(company.priority_level)}`}>
                  Priority {company.priority_level || 'C'}
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-ivory-light mb-2">
                {company.company_name}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-ivory-light/60">
                  <Globe className="w-4 h-4" />
                  <span className="truncate">{company.website_url || 'No website'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-ivory-light/60">
                  <Filter className="w-4 h-4" />
                  <span>{getCategoryLabel(company.category)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-warm-gold/10">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warm-gold" />
                  <span className="text-sm text-ivory-light/60">
                    Accessibility: {company.accessibility_relevance || 0}/10
                  </span>
                </div>
                {company.global_control_sync_status === 'synced' && (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-deep-indigo border border-warm-gold/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-warm-gold/10 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-warm-gold">Add New Company</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-royal-plum/30 rounded-lg text-ivory-light/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-ivory-light mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                  placeholder="e.g., SpinLife"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory-light mb-2">
                  Website URL
                </label>
                <input
                  type="text"
                  value={formData.website_url}
                  onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory-light mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                >
                  <option value="">Select category...</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ivory-light mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority_level}
                    onChange={(e) => setFormData({...formData, priority_level: e.target.value})}
                    className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                  >
                    <option value="A">A - Highest</option>
                    <option value="B">B - High</option>
                    <option value="C">C - Medium</option>
                    <option value="D">D - Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ivory-light mb-2">
                    Accessibility
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.accessibility_relevance}
                    onChange={(e) => setFormData({...formData, accessibility_relevance: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ivory-light mb-2">
                    Service Dog
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.service_dog_relevance}
                    onChange={(e) => setFormData({...formData, service_dog_relevance: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 text-ivory-light/70 hover:text-ivory-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
