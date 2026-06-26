'use client';

import { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  Mail,
  DollarSign,
  Building2,
  Star,
  Clock,
  Trash2,
  CheckCheck,
  Filter,
  Settings,
  ChevronRight
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'opportunity' | 'revenue' | 'approval';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link?: string;
  action_text?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'New High-Priority Opportunity',
    message: 'AI Research found EqualWeb - a digital accessibility company rated Priority A with 85/100 fit score.',
    read: false,
    created_at: '2026-06-26T00:30:00Z',
    link: '/opportunities/4',
    action_text: 'View Opportunity'
  },
  {
    id: '2',
    type: 'approval',
    title: 'Outreach Needs Approval',
    message: 'Draft email to SpinLife is ready for your review before sending.',
    read: false,
    created_at: '2026-06-25T22:15:00Z',
    link: '/approvals',
    action_text: 'Review Now'
  },
  {
    id: '3',
    type: 'revenue',
    title: 'Payment Received',
    message: '$1,200 received from SpinLife for Power Chair Review Campaign.',
    read: true,
    created_at: '2026-06-25T18:00:00Z',
    link: '/revenue',
    action_text: 'View Revenue'
  },
  {
    id: '4',
    type: 'success',
    title: 'Campaign Completed',
    message: 'Q3 Mobility Equipment Outreach campaign finished with 3 responses from 18 sent.',
    read: true,
    created_at: '2026-06-25T14:30:00Z',
    link: '/outreach',
    action_text: 'View Campaign'
  },
  {
    id: '5',
    type: 'warning',
    title: 'Follow-up Overdue',
    message: 'Med Mart contract signing is 2 days overdue. Consider sending a reminder.',
    read: false,
    created_at: '2026-06-25T12:00:00Z',
    link: '/pipeline',
    action_text: 'View Pipeline'
  },
  {
    id: '6',
    type: 'info',
    title: 'Weekly Summary Ready',
    message: 'Your weekly activity report is ready. 5 new companies, 2 responses, $1,200 revenue.',
    read: true,
    created_at: '2026-06-24T09:00:00Z',
    link: '/dashboard',
    action_text: 'View Dashboard'
  },
  {
    id: '7',
    type: 'opportunity',
    title: 'Company Moved to Negotiation',
    message: 'Ovidis has responded to your outreach and wants to discuss terms.',
    read: false,
    created_at: '2026-06-24T16:45:00Z',
    link: '/opportunities/3',
    action_text: 'View Details'
  },
  {
    id: '8',
    type: 'approval',
    title: 'Content Approved',
    message: 'Your draft DM to Med Mart has been approved and is ready to send.',
    read: true,
    created_at: '2026-06-23T11:20:00Z',
    link: '/outreach',
    action_text: 'Send Now'
  }
];

const typeConfig = {
  success: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  warning: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  opportunity: { icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  revenue: { icon: DollarSign, color: 'text-warm-gold', bg: 'bg-warm-gold/10', border: 'border-warm-gold/30' },
  approval: { icon: Mail, color: 'text-sacred-teal', bg: 'bg-sacred-teal/10', border: 'border-sacred-teal/30' }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    const matchesRead = filter === 'all' || (filter === 'unread' ? !n.read : n.read);
    const matchesType = typeFilter === 'all' || n.type === typeFilter;
    return matchesRead && matchesType;
  });

  function markAsRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllAsRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function deleteNotification(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-warm-gold">Notifications</h1>
          <p className="text-ivory-light/60 mt-1">Stay updated on your outreach activity</p>
        </div>
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light/70 hover:text-ivory-light transition-colors text-sm"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
          <div className="relative">
            <Bell className="w-6 h-6 text-ivory-light" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-ivory-light">{notifications.length}</p>
          <p className="text-xs text-ivory-light/60">Total</p>
        </div>
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{unreadCount}</p>
          <p className="text-xs text-ivory-light/60">Unread</p>
        </div>
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-sacred-teal">{notifications.filter(n => n.type === 'approval' && !n.read).length}</p>
          <p className="text-xs text-ivory-light/60">Need Action</p>
        </div>
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">{notifications.filter(n => n.type === 'opportunity' && !n.read).length}</p>
          <p className="text-xs text-ivory-light/60">New Opportunities</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex bg-royal-plum/20 border border-warm-gold/20 rounded-xl overflow-hidden">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm capitalize transition-colors ${
                filter === f
                  ? 'bg-sacred-teal/20 text-sacred-teal'
                  : 'text-ivory-light/70 hover:text-ivory-light'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
        >
          <option value="all">All Types</option>
          <option value="opportunity">Opportunities</option>
          <option value="approval">Approvals</option>
          <option value="revenue">Revenue</option>
          <option value="success">Success</option>
          <option value="warning">Warnings</option>
          <option value="info">Info</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => {
          const config = typeConfig[notification.type];
          const Icon = config.icon;

          return (
            <div
              key={notification.id}
              className={`relative bg-royal-plum/10 border rounded-2xl p-5 transition-all ${
                notification.read
                  ? 'border-warm-gold/10 opacity-70'
                  : `${config.border} ${config.bg}`
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-semibold ${notification.read ? 'text-ivory-light/70' : 'text-ivory-light'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-ivory-light/60 mt-1">{notification.message}</p>
                    </div>
                    <span className="text-xs text-ivory-light/40 flex-shrink-0">
                      {formatTime(notification.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    {notification.link && (
                      <a
                        href={notification.link}
                        className={`inline-flex items-center gap-1 text-sm font-medium ${config.color} hover:opacity-80`}
                      >
                        {notification.action_text}
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    )}

                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-sm text-ivory-light/50 hover:text-ivory-light transition-colors"
                      >
                        Mark as read
                      </button>
                    )}

                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="ml-auto text-ivory-light/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {!notification.read && (
                  <div className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')} flex-shrink-0 mt-2`} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12 bg-royal-plum/10 rounded-2xl border border-warm-gold/10">
          <Bell className="w-16 h-16 text-ivory-light/20 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-ivory-light mb-2">No notifications</h3>
          <p className="text-ivory-light/60">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
