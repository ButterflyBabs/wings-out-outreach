'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  Briefcase, 
  Mail, 
  TrendingUp, 
  CheckCircle2, 
  DollarSign,
  Settings,
  Menu,
  X,
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Bell
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'companies', label: 'Companies', icon: Building2, href: '/companies' },
  { id: 'opportunities', label: 'Opportunities', icon: Briefcase, href: '/opportunities' },
  { id: 'research', label: 'AI Research', icon: Sparkles, href: '/research' },
  { id: 'outreach', label: 'Outreach', icon: Mail, href: '/outreach' },
  { id: 'pipeline', label: 'Pipeline', icon: TrendingUp, href: '/pipeline' },
  { id: 'approvals', label: 'Approvals', icon: CheckCircle2, href: '/approvals' },
  { id: 'revenue', label: 'Revenue', icon: DollarSign, href: '/revenue' },
  { id: 'guidance', label: 'Industry Guidance', icon: BookOpen, href: '/guidance' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-royal-plum/80 rounded-lg text-ivory-light"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-royal-plum/20 border-r border-warm-gold/10 
                    transform transition-transform duration-300 ease-out lg:transform-none flex-shrink-0
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-warm-gold/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sacred-teal/20 flex items-center justify-center">
              <span className="text-2xl">🦋</span>
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-warm-gold">Wings Out</h1>
              <p className="text-xs text-ivory-light/60">Outreach System</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                           ${isActive 
                             ? 'bg-sacred-teal/20 text-sacred-teal border border-sacred-teal/30' 
                             : 'text-ivory-light/70 hover:bg-royal-plum/30 hover:text-ivory-light'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
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
    </>
  );
}
