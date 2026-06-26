'use client';

import { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Mail,
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  Key,
  Database,
  Send
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'integrations' | 'billing'>('profile');
  const [saved, setSaved] = useState(false);

  // Profile settings
  const [profile, setProfile] = useState({
    name: 'Babs Carroll',
    email: 'amilynne@amilynne.com',
    businessName: 'Sacred Kaleidoscope Community LLC',
    timezone: 'America/Denver',
    phone: '',
    bio: 'Quadriplegic accessibility creator and founder of Sacred Kaleidoscope Community. Creating content that makes life more accessible.'
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNewOpportunities: true,
    emailApprovals: true,
    emailRevenue: true,
    emailWeekly: true,
    pushNewLeads: false,
    pushApprovals: true,
    pushRevenue: true
  });

  // Integration settings
  const [integrations, setIntegrations] = useState({
    globalControl: { connected: true, lastSync: '2026-06-25' },
    gmail: { connected: false, lastSync: null },
    openai: { connected: true, lastSync: null },
    stripe: { connected: false, lastSync: null },
    telegram: { connected: false, botToken: '', chatId: '' }
  });

  // Telegram setup steps
  const [telegramStep, setTelegramStep] = useState(1);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-warm-gold">Settings</h1>
        <p className="text-ivory-light/60 mt-1">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-warm-gold/10 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-sacred-teal/20 text-sacred-teal border border-sacred-teal/30'
                  : 'text-ivory-light/70 hover:bg-royal-plum/20 hover:text-ivory-light'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold text-warm-gold mb-6">Profile Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">Business Name</label>
                <input
                  type="text"
                  value={profile.businessName}
                  onChange={(e) => setProfile({...profile, businessName: e.target.value})}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">Timezone</label>
                <select
                  value={profile.timezone}
                  onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                >
                  <option value="America/Denver">Mountain Time (Denver)</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/New_York">Eastern Time</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={handleSave}
              className="btn-primary flex items-center gap-2"
            >
              {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold text-warm-gold mb-6">Email Notifications</h2>
            
            <div className="space-y-4">
              {[
                { key: 'emailNewOpportunities', label: 'New opportunities added', desc: 'When AI research finds new companies' },
                { key: 'emailApprovals', label: 'Outreach needs approval', desc: 'When drafts are ready for your review' },
                { key: 'emailRevenue', label: 'Revenue updates', desc: 'When payments are received or pending' },
                { key: 'emailWeekly', label: 'Weekly summary', desc: 'Weekly pipeline and activity report' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-warm-gold/10 last:border-0">
                  <div>
                    <p className="font-medium text-ivory-light">{item.label}</p>
                    <p className="text-sm text-ivory-light/50">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]})}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-sacred-teal' : 'bg-royal-plum/50'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold text-warm-gold mb-6">Push Notifications</h2>
            
            <div className="space-y-4">
              {[
                { key: 'pushNewLeads', label: 'New leads', desc: 'When high-priority companies are found' },
                { key: 'pushApprovals', label: 'Approval needed', desc: 'Urgent items requiring your attention' },
                { key: 'pushRevenue', label: 'Payment received', desc: 'Instant notification for payments' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-warm-gold/10 last:border-0">
                  <div>
                    <p className="font-medium text-ivory-light">{item.label}</p>
                    <p className="text-sm text-ivory-light/50">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]})}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-sacred-teal' : 'bg-royal-plum/50'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold text-warm-gold mb-6">Connected Services</h2>
            
            <div className="space-y-4">
              {/* Global Control CRM */}
              <div className="flex items-center justify-between p-4 bg-deep-indigo/30 rounded-xl border border-warm-gold/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Database className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-ivory-light">Global Control CRM</p>
                    <p className="text-sm text-ivory-light/50">Last sync: {integrations.globalControl.lastSync}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-green-500/20 text-green-400">
                  Connected
                </span>
              </div>

              {/* Gmail */}
              <div className="flex items-center justify-between p-4 bg-deep-indigo/30 rounded-xl border border-warm-gold/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-ivory-light">Gmail</p>
                    <p className="text-sm text-ivory-light/50">Send and track outreach emails</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-sacred-teal/20 border border-sacred-teal/30 rounded-lg text-sacred-teal text-sm hover:bg-sacred-teal/30 transition-colors">
                  Connect
                </button>
              </div>

              {/* OpenAI */}
              <div className="flex items-center justify-between p-4 bg-deep-indigo/30 rounded-xl border border-warm-gold/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Key className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-ivory-light">OpenAI</p>
                    <p className="text-sm text-ivory-light/50">AI research and content generation</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-green-500/20 text-green-400">
                  Connected
                </span>
              </div>

              {/* Stripe */}
              <div className="flex items-center justify-between p-4 bg-deep-indigo/30 rounded-xl border border-warm-gold/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-ivory-light">Stripe</p>
                    <p className="text-sm text-ivory-light/50">Payment processing and invoicing</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-sacred-teal/20 border border-sacred-teal/30 rounded-lg text-sacred-teal text-sm hover:bg-sacred-teal/30 transition-colors">
                  Connect
                </button>
              </div>

              {/* Telegram */}
              <div className="p-4 bg-deep-indigo/30 rounded-xl border border-warm-gold/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-400/20 flex items-center justify-center">
                      <Send className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-ivory-light">Telegram</p>
                      <p className="text-sm text-ivory-light/50">Get notifications via Telegram</p>
                    </div>
                  </div>
                  {integrations.telegram.connected ? (
                    <span className="px-3 py-1 rounded-lg text-sm font-medium bg-green-500/20 text-green-400">
                      Connected
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-500/20 text-gray-400">
                      Not Connected
                    </span>
                  )}
                </div>

                {!integrations.telegram.connected ? (
                  <div className="space-y-4 mt-4 border-t border-warm-gold/10 pt-4">
                    <div className="bg-royal-plum/20 rounded-lg p-4">
                      <h4 className="font-medium text-ivory-light mb-2">Setup Instructions</h4>
                      
                      {telegramStep === 1 && (
                        <div className="space-y-3">
                          <p className="text-sm text-ivory-light/70">Step 1: Create a Telegram Bot</p>
                          <ol className="text-sm text-ivory-light/60 list-decimal list-inside space-y-1">
                            <li>Open Telegram and search for <strong>@BotFather</strong></li>
                            <li>Send <code>/newbot</code> and follow the prompts</li>
                            <li>Give your bot a name (e.g., "Wings Out Notifications")</li>
                            <li>Give it a username (e.g., "wings_out_bot")</li>
                            <li>Copy the bot token (looks like: 123456:ABC-DEF...)</li>
                          </ol>
                          <button 
                            onClick={() => setTelegramStep(2)}
                            className="mt-3 px-4 py-2 bg-sacred-teal/20 border border-sacred-teal/30 rounded-lg text-sacred-teal text-sm hover:bg-sacred-teal/30 transition-colors"
                          >
                            Next Step →
                          </button>
                        </div>
                      )}

                      {telegramStep === 2 && (
                        <div className="space-y-3">
                          <p className="text-sm text-ivory-light/70">Step 2: Get Your Chat ID</p>
                          <ol className="text-sm text-ivory-light/60 list-decimal list-inside space-y-1">
                            <li>Search for <strong>@userinfobot</strong> in Telegram</li>
                            <li>Send any message to it</li>
                            <li>It will reply with your ID (e.g., 123456789)</li>
                            <li>Copy this number</li>
                          </ol>
                          <div className="flex gap-2 mt-3">
                            <button 
                              onClick={() => setTelegramStep(1)}
                              className="px-4 py-2 text-ivory-light/60 text-sm hover:text-ivory-light transition-colors"
                            >
                              ← Back
                            </button>
                            <button 
                              onClick={() => setTelegramStep(3)}
                              className="px-4 py-2 bg-sacred-teal/20 border border-sacred-teal/30 rounded-lg text-sacred-teal text-sm hover:bg-sacred-teal/30 transition-colors"
                            >
                              Next Step →
                            </button>
                          </div>
                        </div>
                      )}

                      {telegramStep === 3 && (
                        <div className="space-y-3">
                          <p className="text-sm text-ivory-light/70">Step 3: Enter Your Details</p>
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Bot Token (e.g., 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11)"
                              value={integrations.telegram.botToken}
                              onChange={(e) => setIntegrations({...integrations, telegram: {...integrations.telegram, botToken: e.target.value}})}
                              className="w-full px-3 py-2 bg-royal-plum/30 border border-warm-gold/20 rounded-lg text-ivory-light text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Chat ID (e.g., 123456789)"
                              value={integrations.telegram.chatId}
                              onChange={(e) => setIntegrations({...integrations, telegram: {...integrations.telegram, chatId: e.target.value}})}
                              className="w-full px-3 py-2 bg-royal-plum/30 border border-warm-gold/20 rounded-lg text-ivory-light text-sm"
                            />
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button 
                              onClick={() => setTelegramStep(2)}
                              className="px-4 py-2 text-ivory-light/60 text-sm hover:text-ivory-light transition-colors"
                            >
                              ← Back
                            </button>
                            <button 
                              onClick={() => {
                                if (integrations.telegram.botToken && integrations.telegram.chatId) {
                                  setIntegrations({...integrations, telegram: {...integrations.telegram, connected: true}});
                                  setSaved(true);
                                  setTimeout(() => setSaved(false), 3000);
                                }
                              }}
                              className="px-4 py-2 bg-sacred-teal/20 border border-sacred-teal/30 rounded-lg text-sacred-teal text-sm hover:bg-sacred-teal/30 transition-colors"
                            >
                              Connect Telegram
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 border-t border-warm-gold/10 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-ivory-light/70">Bot Token</p>
                        <p className="text-sm text-ivory-light">{integrations.telegram.botToken.slice(0, 20)}...</p>
                      </div>
                      <div>
                        <p className="text-sm text-ivory-light/70">Chat ID</p>
                        <p className="text-sm text-ivory-light">{integrations.telegram.chatId}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIntegrations({...integrations, telegram: {...integrations.telegram, connected: false, botToken: '', chatId: ''}})}
                      className="mt-3 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm hover:bg-red-500/20 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold text-warm-gold mb-6">Current Plan</h2>
            
            <div className="bg-sacred-teal/10 border border-sacred-teal/30 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-semibold text-ivory-light">Free Plan</p>
                  <p className="text-ivory-light/60">Perfect for getting started</p>
                </div>
                <span className="text-3xl font-bold text-sacred-teal">$0</span>
              </div>
              <ul className="space-y-2 text-sm text-ivory-light/70">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sacred-teal" />
                  Up to 100 companies
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sacred-teal" />
                  AI research (10/day)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sacred-teal" />
                  Basic analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sacred-teal" />
                  Email support
                </li>
              </ul>
            </div>

            <button className="w-full py-3 bg-warm-gold/20 border border-warm-gold/30 rounded-xl text-warm-gold font-medium hover:bg-warm-gold/30 transition-colors">
              Upgrade to Pro
            </button>
          </div>

          <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold text-warm-gold mb-6">Usage This Month</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-ivory-light/70">Companies</span>
                  <span className="text-ivory-light">24 / 100</span>
                </div>
                <div className="h-2 bg-royal-plum/30 rounded-full">
                  <div className="h-full bg-sacred-teal rounded-full" style={{ width: '24%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-ivory-light/70">AI Research</span>
                  <span className="text-ivory-light">156 / 300</span>
                </div>
                <div className="h-2 bg-royal-plum/30 rounded-full">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: '52%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-ivory-light/70">Outreach Messages</span>
                  <span className="text-ivory-light">45 / Unlimited</span>
                </div>
                <div className="h-2 bg-royal-plum/30 rounded-full">
                  <div className="h-full bg-green-400 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
