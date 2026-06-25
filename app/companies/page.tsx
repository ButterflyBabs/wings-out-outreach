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
  X
} from 'lucide-react';
import Notification, { useNotification } from '@/components/Notification';

// Mark as dynamic to avoid static generation issues
export const dynamic = 'force-dynamic';

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
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  // Form state
  const [formData, setFormData] = useState({
    company_name: '',
    website_url: '',
    category: '',
    subcategory: '',
    headquarters_location: '',
    country: '',
    brand_summary: '',
    accessibility_relevance: 5,
    service_dog_relevance: 5,
    priority_level: 'C',
    notes: ''
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
      // Dynamically import supabase to avoid build-time issues
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
      // Dynamically import supabase
      const { supabase } = await import('@/lib/supabase');
      
      // Normalize website URL - add https:// if missing
      let websiteUrl = formData.website_url.trim();
      if (websiteUrl && !websiteUrl.match(/^https?:\/\//i)) {
        websiteUrl = 'https://' + websiteUrl;
      }

      const insertData = {
        company_name: formData.company_name,
        website_url: websiteUrl || null,
        category: formData.category || null,
        subcategory: formData.subcategory || null,
        headquarters_location: formData.headquarters_location || null,
        country: formData.country || null,
        brand_summary: formData.brand_summary || null,
        accessibility_relevance: formData.accessibility_relevance,
        service_dog_relevance: formData.service_dog_relevance,
        priority_level: formData.priority_level,
        notes: formData.notes || null,
        created_by: null
      };

      const { data, error } = await (supabase as any)
        .from('companies')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // Reset form and close modal
      setFormData({
        company_name: '',
        website_url: '',
        category: '',
        subcategory: '',
        headquarters_location: '',
        country: '',
        brand_summary: '',
        accessibility_relevance: 5,
        service_dog_relevance: 5,
        priority_level: 'C',
        notes: ''
      });
      setShowAddModal(false);
      
      // Show success notification
      showSuccess(`Company "${formData.company_name}" added successfully!`);
      
      // Refresh companies list
      fetchCompanies();
      
    } catch (error: any) {
      console.error('Error adding company:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      const errorMessage = error?.message || error?.error?.message || error?.details || 'Unknown error';
      showError('Failed to add company: ' + errorMessage);
    }
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (company.website_url && company.website_url.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || company.category === filterCategory;
    
    return matchesSearch && matchesCategory;
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
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-warm-gold">Companies</h1>
          <p className="text-ivory-light/60 mt-1">Manage your prospect companies and partnerships</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ivory-light/40" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light placeholder-ivory-light/40 focus:outline-none focus:border-sacred-teal"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light focus:outline-none focus:border-sacred-teal"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sacred-teal"></div>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-12 bg-royal-plum/10 rounded-2xl border border-warm-gold/10">
          <Building2 className="w-16 h-16 text-ivory-light/20 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-ivory-light mb-2">No companies yet</h3>
          <p className="text-ivory-light/60 mb-4">Add your first prospect company to get started</p>
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
                  <div title="Synced to Global Control">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      {/* Add Company Modal */}
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
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-ivory-light mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light focus:outline-none focus:border-sacred-teal"
                  placeholder="e.g., SpinLife"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-ivory-light mb-2">
                  Website URL
                </label>
                <input
                  type="text"
                  value={formData.website_url}
                  onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light focus:outline-none focus:border-sacred-teal"
                  placeholder="https://example.com or example.com"
                />
                <p className="text-xs text-ivory-light/50 mt-1">
                  Enter with or without https://
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-ivory-light mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light focus:outline-none focus:border-sacred-teal"
                >
                  <option value="">Select category...</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Priority & Scores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ivory-light mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority_level}
                    onChange={(e) => setFormData({...formData, priority_level: e.target.value})}
                    className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light focus:outline-none focus:border-sacred-teal"
                  >
                    <option value="A">A - Highest</option>
                    <option value="B">B - High</option>
                    <option value="C">C - Medium</option>
                    <option value="D">D - Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ivory-light mb-2">
                    Accessibility (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.accessibility_relevance}
                    onChange={(e) => setFormData({...formData, accessibility_relevance: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light focus:outline-none focus:border-sacred-teal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ivory-light mb-2">
                    Service Dog (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.service_dog_relevance}
                    onChange={(e) => setFormData({...formData, service_dog_relevance: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light focus:outline-none focus:border-sacred-teal"
                  />
                </div>
              </div>

              {/* Brand Summary */}
              <div>
                <label className="block text-sm font-medium text-ivory-light mb-2">
                  Brand Summary
                </label>
                <textarea
                  value={formData.brand_summary}
                  onChange={(e) => setFormData({...formData, brand_summary: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light focus:outline-none focus:border-sacred-teal"
                  placeholder="Brief description of the company and why they're a good fit..."
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-ivory-light mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light focus:outline-none focus:border-sacred-teal"
                  placeholder="Additional notes..."
                />
              </div>

              {/* Submit */}
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
