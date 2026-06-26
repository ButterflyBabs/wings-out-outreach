'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Star, DollarSign, Mail, AlertCircle, Info, X } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'opportunity' | 'revenue' | 'approval';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link?: string;
}

const typeConfig = {
  success: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
  warning: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  opportunity: { icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  revenue: { icon: DollarSign, color: 'text-warm-gold', bg: 'bg-warm-gold/10' },
  approval: { icon: Mail, color: 'text-sacred-teal', bg: 'bg-sacred-teal/10' }
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'opportunity',
      title: 'New High-Priority Opportunity',
      message: 'AI Research found EqualWeb - Priority A with 85/100 fit score.',
      read: false,
      created_at: '2026-06-26T00:30:00Z',
      link: '/opportunities/4'
    },
    {
      id: '2',
      type: 'approval',
      title: 'Outreach Needs Approval',
      message: 'Draft email to SpinLife is ready for review.',
      read: false,
      created_at: '2026-06-25T22:15:00Z',
      link: '/approvals'
    },
    {
      id: '3',
      type: 'revenue',
      title: 'Payment Received',
      message: '$1,200 received from SpinLife.',
      read: true,
      created_at: '2026-06-25T18:00:00Z',
      link: '/revenue'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadNotifications = notifications.filter(n => !n.read).slice(0, 5);

  function markAsRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllAsRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-bell-container')) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="notification-bell-container relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-royal-plum/30 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-ivory-light" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-deep-indigo border border-warm-gold/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-warm-gold/10">
            <h3 className="font-semibold text-ivory-light">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-sacred-teal hover:text-sacred-teal/80"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-royal-plum/30 rounded text-ivory-light/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {unreadNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-ivory-light/20 mx-auto mb-3" />
                <p className="text-ivory-light/60">No new notifications</p>
              </div>
            ) : (
              unreadNotifications.map((notification) => {
                const config = typeConfig[notification.type];
                const Icon = config.icon;

                return (
                  <Link
                    key={notification.id}
                    href={notification.link || '/notifications'}
                    onClick={() => markAsRead(notification.id)}
                    className="flex items-start gap-3 p-4 hover:bg-royal-plum/20 transition-colors border-b border-warm-gold/10 last:border-0"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ivory-light line-clamp-1">
                        {notification.title}
                      </p>
                      <p className="text-xs text-ivory-light/60 line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-xs text-ivory-light/40 mt-1">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')} flex-shrink-0 mt-1`} />
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-warm-gold/10 bg-royal-plum/10">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center text-sm text-sacred-teal hover:text-sacred-teal/80"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
