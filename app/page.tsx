'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Mail, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  DollarSign,
  Briefcase,
  Plus
} from 'lucide-react';

// Mark as dynamic to avoid static generation issues
export const dynamic = 'force-dynamic';

// Dashboard stats type
interface DashboardStats {
  totalCompanies: number;
  activeOpportunities: number;
  draftsAwaitingApproval: number;
  followUpsDue: number;
  repliesRequiringAttention: number;
  applicationsInProgress: number;
  partnershipsInNegotiation: number;
  activePartnerships: number;
  revenueThisMonth: number;
  outstandingPayments: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    activeOpportunities: 0,
    draftsAwaitingApproval: 0,
    followUpsDue: 0,
    repliesRequiringAttention: 0,
    applicationsInProgress: 0,
    partnershipsInNegotiation: 0,
    activePartnerships: 0,
    revenueThisMonth: 0,
    outstandingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load stats immediately with cached data if available
    const cachedStats = localStorage.getItem('dashboardStats');
    if (cachedStats) {
      setStats(JSON.parse(cachedStats));
      setLoading(false);
    }
    
    // Then fetch fresh data
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      // Dynamically import supabase to avoid build-time issues
      const { supabase } = await import('@/lib/supabase');
      
      // Fetch companies count
      const { count: companiesCount, error: companiesError } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });

      if (companiesError) throw companiesError;

      // Fetch opportunities count
      const { count: opportunitiesCount, error: opportunitiesError } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true });

      if (opportunitiesError) throw opportunitiesError;

      const newStats = {
        totalCompanies: companiesCount || 0,
        activeOpportunities: opportunitiesCount || 0,
        draftsAwaitingApproval: 0,
        followUpsDue: 0,
        repliesRequiringAttention: 0,
        applicationsInProgress: 0,
        partnershipsInNegotiation: 0,
        activePartnerships: 0,
        revenueThisMonth: 0,
        outstandingPayments: 0,
      };

      setStats(newStats);
      
      // Cache the stats
      localStorage.setItem('dashboardStats', JSON.stringify(newStats));
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Don't show error, just keep cached data or zeros
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    { 
      label: 'Total Companies', 
      value: stats.totalCompanies, 
      icon: Building2,
      color: 'text-sacred-teal',
      bgColor: 'bg-sacred-teal/10'
    },
    { 
      label: 'Active Opportunities', 
      value: stats.activeOpportunities, 
      icon: Briefcase,
      color: 'text-warm-gold',
      bgColor: 'bg-warm-gold/10'
    },
    { 
      label: 'Drafts Awaiting Approval', 
      value: stats.draftsAwaitingApproval, 
      icon: Mail,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10'
    },
    { 
      label: 'Follow-ups Due', 
      value: stats.followUpsDue, 
      icon: Clock,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    },
    { 
      label: 'Applications', 
      value: stats.applicationsInProgress, 
      icon: CheckCircle2,
      color: 'text-soft-lavender',
      bgColor: 'bg-soft-lavender/10'
    },
    { 
      label: 'Active Partnerships', 
      value: stats.activePartnerships, 
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
  ];

  // Show skeleton UI while loading
  const renderSkeletonCard = () => (
    <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-ivory-light/10 rounded"></div>
          <div className="h-8 w-16 bg-ivory-light/20 rounded"></div>
        </div>
        <div className="p-3 rounded-xl bg-ivory-light/10 w-12 h-12"></div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-bold text-warm-gold">
            Dashboard
          </h2>
          <p className="text-sm text-ivory-light/60">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <button 
          onClick={() => window.location.href = '/companies'}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Company</span>
        </button>
      </header>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sacred-teal/20 to-royal-plum/20 border border-warm-gold/20 p-8">
        <div className="relative z-10">
          <h3 className="font-serif text-3xl font-bold text-warm-gold mb-2">
            Welcome back, Babs! 🦋🐕‍🦺
          </h3>
          <p className="text-ivory-light/80 max-w-2xl">
            Wings Out Outreach is ready to help you find and win meaningful partnerships. 
            Start by adding companies to your prospect list, or review what&apos;s waiting for your attention today.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-warm-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-sacred-teal/5 rounded-full blur-3xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading 
          ? Array(6).fill(0).map((_, index) => renderSkeletonCard())
          : statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div 
                  key={index}
                  className="card-hover bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-ivory-light/60 text-sm font-medium mb-1">{card.label}</p>
                      <p className={`text-4xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${card.bgColor}`}>
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                  </div>
                </div>
              );
            })
        }
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Priorities */}
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-serif text-xl font-bold text-warm-gold">Today&apos;s Priorities</h4>
            <button className="text-sm text-sacred-teal hover:text-sacred-teal/80">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-deep-indigo/50 border border-warm-gold/10">
              <div className="w-10 h-10 rounded-full bg-warm-gold/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-warm-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ivory-light">Add your first company</p>
                <p className="text-sm text-ivory-light/60">Start building your prospect list</p>
              </div>
              <button 
                onClick={() => window.location.href = '/companies'}
                className="btn-primary text-sm py-2 px-4"
              >
                Add
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-deep-indigo/50 border border-warm-gold/10 opacity-50">
              <div className="w-10 h-10 rounded-full bg-sacred-teal/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-sacred-teal" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ivory-light">Review outreach drafts</p>
                <p className="text-sm text-ivory-light/60">No drafts awaiting approval</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-deep-indigo/50 border border-warm-gold/10 opacity-50">
              <div className="w-10 h-10 rounded-full bg-orange-400/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ivory-light">Follow-ups due</p>
                <p className="text-sm text-ivory-light/60">No follow-ups scheduled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
          <h4 className="font-serif text-xl font-bold text-warm-gold mb-6">Getting Started</h4>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="font-medium text-ivory-light">Database initialized</p>
                <p className="text-sm text-ivory-light/60">All tables created and ready</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-warm-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-warm-gold font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-ivory-light">Add partnership assets</p>
                <p className="text-sm text-ivory-light/60">Upload your bio, photos, and media kit</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-warm-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-warm-gold font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-ivory-light">Connect Gmail</p>
                <p className="text-sm text-ivory-light/60">Enable draft creation and reply tracking</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-warm-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-warm-gold font-bold text-sm">4</span>
              </div>
              <div>
                <p className="font-medium text-ivory-light">Add your first prospects</p>
                <p className="text-sm text-ivory-light/60">Start with companies you&apos;re excited about</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Snapshot */}
      <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-serif text-xl font-bold text-warm-gold">Revenue Snapshot</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-ivory-light/60">This Month</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-xl bg-deep-indigo/50">
            <p className="text-ivory-light/60 text-sm mb-2">Earned This Month</p>
            <p className="text-3xl font-bold text-green-400">$0</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-deep-indigo/50">
            <p className="text-ivory-light/60 text-sm mb-2">Outstanding</p>
            <p className="text-3xl font-bold text-warm-gold">$0</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-deep-indigo/50">
            <p className="text-ivory-light/60 text-sm mb-2">YTD Total</p>
            <p className="text-3xl font-bold text-sacred-teal">$0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
