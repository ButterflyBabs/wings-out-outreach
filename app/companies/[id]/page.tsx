'use client';

import { useState, useEffect, Fragment } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Building2, 
  Globe,
  MapPin,
  Star,
  ArrowLeft,
  Edit2,
  Save,
  X,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import Notification, { useNotification } from '@/components/Notification';

interface Company {
  id: string;
  company_name: string;
  website_url: string | null;
  category: string | null;
  subcategory: string | null;
  headquarters_location: string | null;
  country: string | null;
  brand_summary: string | null;
  accessibility_relevance: number | null;
  service_dog_relevance: number | null;
  priority_level: string | null;
  notes: string | null;
  global_control_contact_id: string | null;
  global_control_sync_status: string | null;
  global_control_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

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

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [formData, setFormData] = useState<Partial<Company>>({});
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  useEffect(() => {
    fetchCompany();
  }, [companyId]);

  async function fetchCompany() {
    try {
      // Dynamically import supabase to avoid build-time issues
      const { supabase } = await import('@/lib/supabase');
      
      console.log('Fetching company with ID:', companyId);
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Company data:', data);
      
      setCompany(data);
      setFormData(data);
    } catch (error: any) {
      console.error('Error fetching company:', error);
      showError('Failed to load company: ' + (error?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    
    try {
      // Dynamically import supabase
      const { supabase } = await import('@/lib/supabase');
      
      const updateData = {
        company_name: formData.company_name,
        website_url: formData.website_url || null,
        category: formData.category || null,
        subcategory: formData.subcategory || null,
        headquarters_location: formData.headquarters_location || null,
        country: formData.country || null,
        brand_summary: formData.brand_summary || null,
        accessibility_relevance: formData.accessibility_relevance,
        service_dog_relevance: formData.service_dog_relevance,
        priority_level: formData.priority_level,
        notes: formData.notes || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('companies')
        .update(updateData as any)
        .eq('id', companyId);

      if (error) throw error;

      await fetchCompany();
      setIsEditing(false);
      showSuccess('Company updated successfully!');
    } catch (error: any) {
      console.error('Error updating company:', error);
      showError('Failed to update company: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSyncToGlobalControl() {
    setIsSyncing(true);
    
    try {
      const response = await fetch('/api/global-control/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId })
      });

      const result = await response.json();
      
      if (result.success) {
        showSuccess(result.message);
        await fetchCompany();
      } else {
        showError('Sync failed: ' + result.error);
      }
    } catch (error: any) {
      console.error('Error syncing:', error);
      showError('Failed to sync: ' + error.message);
    } finally {
      setIsSyncing(false);
    }
  }

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

  if (loading) {
    return (
      <Fragment>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={hideNotification}
          />
        )}
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sacred-teal"></div>
        </div>
      </Fragment>
    );
  }

  if (!company) {
    return (
      <Fragment>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={hideNotification}
          />
        )}
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl text-ivory-light">Company not found</h2>
            <Link href="/companies" className="text-sacred-teal hover:underline mt-4 inline-block">
              Back to Companies
            </Link>
          </div>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/companies"
            className="p-2 hover:bg-royal-plum/30 rounded-lg text-ivory-light/70 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-warm-gold">
              {isEditing ? 'Edit Company' : company.company_name}
            </h1>
            {!isEditing && (
              <p className="text-sm text-ivory-light/60">
                {getCategoryLabel(company.category)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <>
              <button
                onClick={handleSyncToGlobalControl}
                disabled={isSyncing}
                className="btn-secondary flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {company.global_control_sync_status === 'synced' ? 'Re-sync' : 'Sync to Global Control'}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(company);
                }}
                className="px-4 py-2 text-ivory-light/70 hover:text-ivory-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Company Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold text-warm-gold mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-ivory-light/60 mb-1">
                  Company Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.company_name || ''}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    className="w-full px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-lg text-ivory-light"
                  />
                ) : (
                  <p className="text-lg text-ivory-light">{company.company_name}</p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-ivory-light/60 mb-1">
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.website_url || ''}
                    onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                    className="w-full px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-lg text-ivory-light"
                    placeholder="https://..."
                  />
                ) : (
                  company.website_url ? (
                    <a 
                      href={company.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sacred-teal hover:underline flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      {company.website_url}
                    </a>
                  ) : (
                    <p className="text-ivory-light/40">No website</p>
                  )
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-ivory-light/60 mb-1">
                  Category
                </label>
                {isEditing ? (
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-lg text-ivory-light"
                  >
                    <option value="">Select category...</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-ivory-light">{getCategoryLabel(company.category)}</p>
                )}
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-sm font-medium text-ivory-light/60 mb-1">
                  Subcategory
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.subcategory || ''}
                    onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                    className="w-full px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-lg text-ivory-light"
                    placeholder="e.g., Power Wheelchairs"
                  />
                ) : (
                  <p className="text-ivory-light">{company.subcategory || '—'}</p>
                )}
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ivory-light/60 mb-1">
                    Headquarters
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.headquarters_location || ''}
                      onChange={(e) => setFormData({...formData, headquarters_location: e.target.value})}
                      className="w-full px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-lg text-ivory-light"
                      placeholder="City, State"
                    />
                  ) : (
                    <p className="text-ivory-light flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-ivory-light/40" />
                      {company.headquarters_location || '—'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-ivory-light/60 mb-1">
                    Country
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.country || ''}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-lg text-ivory-light"
                      placeholder="USA"
                    />
                  ) : (
                    <p className="text-ivory-light">{company.country || '—'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Brand Summary */}
          <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold text-warm-gold mb-4">Brand Summary</h2>
            {isEditing ? (
              <textarea
                value={formData.brand_summary || ''}
                onChange={(e) => setFormData({...formData, brand_summary: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-lg text-ivory-light"
                placeholder="Describe the company, their products, and why they're a good fit..."
              />
            ) : (
              <p className="text-ivory-light/80 whitespace-pre-wrap">
                {company.brand_summary || 'No summary added yet.'}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold text-warm-gold mb-4">Notes</h2>
            {isEditing ? (
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-lg text-ivory-light"
                placeholder="Additional notes, contact info, etc."
              />
            ) : (
              <p className="text-ivory-light/80 whitespace-pre-wrap">
                {company.notes || 'No notes added yet.'}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Priority & Scores */}
          <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold text-warm-gold mb-4">Scoring</h2>
            
            <div className="space-y-4">
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-ivory-light/60 mb-2">
                  Priority Level
                </label>
                {isEditing ? (
                  <select
                    value={formData.priority_level || 'C'}
                    onChange={(e) => setFormData({...formData, priority_level: e.target.value})}
                    className="w-full px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-lg text-ivory-light"
                  >
                    <option value="A">A - Highest</option>
                    <option value="B">B - High</option>
                    <option value="C">C - Medium</option>
                    <option value="D">D - Low</option>
                  </select>
                ) : (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(company.priority_level)}`}>
                    Priority {company.priority_level || 'C'}
                  </span>
                )}
              </div>

              {/* Accessibility Score */}
              <div>
                <label className="block text-sm font-medium text-ivory-light/60 mb-2">
                  Accessibility Fit (1-10)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.accessibility_relevance || 5}
                    onChange={(e) => setFormData({...formData, accessibility_relevance: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-lg text-ivory-light"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-warm-gold" />
                    <span className="text-2xl font-bold text-ivory-light">
                      {company.accessibility_relevance || 0}
                    </span>
                    <span className="text-ivory-light/60">/10</span>
                  </div>
                )}
              </div>

              {/* Service Dog Score */}
              <div>
                <label className="block text-sm font-medium text-ivory-light/60 mb-2">
                  Service Dog Fit (1-10)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.service_dog_relevance || 5}
                    onChange={(e) => setFormData({...formData, service_dog_relevance: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-lg text-ivory-light"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🐕‍🦺</span>
                    <span className="text-2xl font-bold text-ivory-light">
                      {company.service_dog_relevance || 0}
                    </span>
                    <span className="text-ivory-light/60">/10</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sync Status */}
          <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold text-warm-gold mb-4">Sync Status</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {company.global_control_sync_status === 'synced' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">Synced to Global Control</span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-ivory-light/40" />
                    <span className="text-ivory-light/60">Not synced</span>
                  </>
                )}
              </div>
              
              {company.global_control_synced_at && (
                <p className="text-sm text-ivory-light/40">
                  Last synced: {new Date(company.global_control_synced_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Created/Updated */}
          <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold text-warm-gold mb-4">History</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ivory-light/60">Created:</span>
                <span className="text-ivory-light">
                  {new Date(company.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ivory-light/60">Updated:</span>
                <span className="text-ivory-light">
                  {new Date(company.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
