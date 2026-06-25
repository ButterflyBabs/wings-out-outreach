'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Mail, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  DollarSign,
  Briefcase,
  Plus,
  Search,
  Filter,
  Settings,
  Bell,
  Menu,
  X
} from 'lucide-react';

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

// Mock data for initial display
const mockStats: DashboardStats = {
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
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'outreach', label: 'Outreach', icon: Mail },
    { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle2 },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'tasks', label: 'Tasks', icon: Clock },
    { id: 'assets', label: 'Assets', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Stat cards data
  const statCards = [
    { 
      label: 'Active Prospects', 
      value: stats.activeOpportunities, 
      icon: Building2,
      color: 'text-sacred-teal',
      bgColor: 'bg-sacred-teal/10'
    },
    { 
      label: 'Drafts Awaiting Approval', 
      value: stats.draftsAwaitingApproval, 
      icon: Mail,
      color: 'text-warm-gold',
      bgColor: 'bg-warm-gold/10'
    },
    { 
      label: 'Follow-ups Due', 
      value: stats.followUpsDue, 
      icon: Clock,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10'
    },
    { 
      label: 'Replies to Handle', 
      value: stats.repliesRequiringAttention, 
      icon: AlertCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    },
    { 
      label: 'Applications', 
      value: stats.applicationsInProgress, 
      icon: Briefcase,
      color: 'text-soft-lavender',
      bgColor: 'bg-soft-lavender/10'
    },
    { 
      label: 'Active Partnerships', 
      value: stats.activePartnerships, 
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-royal-plum/20 border-r border-warm-gold/10 
                    transform transition-transform duration-300 ease-out lg:transform-none
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-warm-gold/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sacred-teal/20 flex items-center justify-center">
              <span className="text-2xl">🦋</span>
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-warm-gold">Wings Out</h1>
              <p className="text-xs text-ivory-light/60">Outreach System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                           ${activeView === item.id 
                             ? 'bg-sacred-teal/20 text-sacred-teal border border-sacred-teal/30' 
                             : 'text-ivory-light/70 hover:bg-royal-plum/30 hover:text-ivory-light'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-warm-gold/10">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-deep-indigo/50">
            <div className="w-10 h-10 rounded-full bg-warm-gold/20 flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-ivory-light truncate">Babs Carroll</p>
              <p className="text-xs text-ivory-light/50 truncate">Owner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-deep-indigo/95 backdrop-blur-md border-b border-warm-gold/10">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left: Mobile menu + Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-royal-plum/30 text-ivory-light/70"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="font-serif text-2xl font-bold text-ivory-light">
                  {navItems.find(n => n.id === activeView)?.label || 'Dashboard'}
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
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-royal-plum/30 text-ivory-light/70 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-sacred-teal rounded-full" />
              </button>
              <button className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Company</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sacred-teal/20 to-royal-plum/20 border border-warm-gold/20 p-8">
            <div className="relative z-10">
              <h3 className="font-serif text-3xl font-bold text-warm-gold mb-2">
                Welcome back, Babs! 🦋🐕‍🦺
              </h3>
              <p className="text-ivory-light/80 max-w-2xl">
                Wings Out Outreach is ready to help you find and win meaningful partnerships. 
                Start by adding companies to your prospect list, or review what's waiting for your attention today.
              </p>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-warm-gold/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-sacred-teal/5 rounded-full blur-3xl" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((card, index) => {
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
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Priorities */}
            <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-serif text-xl font-bold text-warm-gold">Today's Priorities</h4>
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
                  <button className="btn-primary text-sm py-2 px-4">Add</button>
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
                    <p className="text-sm text-ivory-light/60">Start with companies you're excited about</p>
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
                <button className="p-2 rounded-lg hover:bg-royal-plum/30 text-ivory-light/70">
                  <Filter className="w-4 h-4" />
                </button>
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
      </main>
    </div>
  );
}