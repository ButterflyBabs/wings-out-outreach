'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Instagram, 
  FileText, 
  Video, 
  Package, 
  DollarSign,
  Info,
  AlertCircle,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

interface RateCardItem {
  service: string;
  description: string;
  industryLow: string;
  industryHigh: string;
  babsMinimum: string;
  babsIdeal: string;
  notes: string;
}

const socialMediaRates: RateCardItem[] = [
  {
    service: 'Instagram Feed Post (1 image)',
    description: 'Single static image with caption',
    industryLow: '$100',
    industryHigh: '$500',
    babsMinimum: '$250',
    babsIdeal: '$400',
    notes: 'Includes 1 round of revisions, 30-day usage rights'
  },
  {
    service: 'Instagram Carousel (3-5 slides)',
    description: 'Multi-slide educational or storytelling post',
    industryLow: '$200',
    industryHigh: '$800',
    babsMinimum: '$400',
    babsIdeal: '$650',
    notes: 'Higher engagement, more production time'
  },
  {
    service: 'Instagram Reel (30-60 sec)',
    description: 'Short-form video content',
    industryLow: '$300',
    industryHigh: '$1,500',
    babsMinimum: '$500',
    babsIdeal: '$900',
    notes: 'Includes scripting, filming, editing, caption'
  },
  {
    service: 'Instagram Story (24hr)',
    description: 'Temporary story post with link sticker',
    industryLow: '$50',
    industryHigh: '$300',
    babsMinimum: '$150',
    babsIdeal: '$250',
    notes: 'Can bundle multiple stories for campaign'
  },
  {
    service: 'Instagram Story Highlight',
    description: 'Permanent story saved to profile',
    industryLow: '$100',
    industryHigh: '$500',
    babsMinimum: '$200',
    babsIdeal: '$350',
    notes: 'Long-term visibility on profile'
  }
];

const articleRates: RateCardItem[] = [
  {
    service: 'Sponsored Blog Post (500-800 words)',
    description: 'Written article on amilynne.com or Substack',
    industryLow: '$300',
    industryHigh: '$1,200',
    babsMinimum: '$500',
    babsIdeal: '$850',
    notes: 'Includes SEO optimization, social promotion'
  },
  {
    service: 'Long-Form Article (1,000-1,500 words)',
    description: 'In-depth piece with research and personal story',
    industryLow: '$500',
    industryHigh: '$2,000',
    babsMinimum: '$750',
    babsIdeal: '$1,200',
    notes: 'Higher value, evergreen content'
  },
  {
    service: 'Newsletter Feature',
    description: 'Dedicated section in weekly newsletter',
    industryLow: '$200',
    industryHigh: '$800',
    babsMinimum: '$400',
    babsIdeal: '$650',
    notes: 'Direct access to engaged email list'
  },
  {
    service: 'LinkedIn Article',
    description: 'Professional platform article',
    industryLow: '$250',
    industryHigh: '$1,000',
    babsMinimum: '$400',
    babsIdeal: '$700',
    notes: 'B2B focus, professional audience'
  }
];

const videoRates: RateCardItem[] = [
  {
    service: 'YouTube Video (5-10 min)',
    description: 'Long-form video with integration',
    industryLow: '$500',
    industryHigh: '$3,000',
    babsMinimum: '$800',
    babsIdeal: '$1,500',
    notes: 'Evergreen, searchable, high production value'
  },
  {
    service: 'YouTube Short (60 sec)',
    description: 'Short-form vertical video',
    industryLow: '$200',
    industryHigh: '$800',
    babsMinimum: '$350',
    babsIdeal: '$600',
    notes: 'Quick turnaround, algorithm boost'
  },
  {
    service: 'TikTok Video',
    description: 'Native TikTok content',
    industryLow: '$200',
    industryHigh: '$1,000',
    babsMinimum: '$350',
    babsIdeal: '$550',
    notes: 'Trending audio, viral potential'
  },
  {
    service: 'Product Review Video (3-5 min)',
    description: 'Dedicated product demonstration',
    industryLow: '$400',
    industryHigh: '$1,500',
    babsMinimum: '$600',
    babsIdeal: '$1,000',
    notes: 'Detailed review, authentic use case'
  }
];

const bundleRates: RateCardItem[] = [
  {
    service: 'Starter Package',
    description: '1 feed post + 3 stories + 1 reel',
    industryLow: '$500',
    industryHigh: '$2,000',
    babsMinimum: '$900',
    babsIdeal: '$1,400',
    notes: 'Good for testing partnership'
  },
  {
    service: 'Growth Package',
    description: '3 feed posts + 9 stories + 2 reels + 1 article',
    industryLow: '$1,500',
    industryHigh: '$5,000',
    babsMinimum: '$2,500',
    babsIdeal: '$3,800',
    notes: 'Month-long campaign, multi-platform'
  },
  {
    service: 'Premium Partnership',
    description: 'Full content suite + exclusivity + ongoing',
    industryLow: '$3,000',
    industryHigh: '$10,000+',
    babsMinimum: '$5,000',
    babsIdeal: '$8,000+',
    notes: 'Quarterly retainer, brand ambassador style'
  }
];

const additionalFees = [
  {
    name: 'Usage Rights (6 months)',
    fee: '+25%',
    description: 'Brand can use content in ads, website, etc.'
  },
  {
    name: 'Usage Rights (1 year)',
    fee: '+40%',
    description: 'Extended usage for marketing materials'
  },
  {
    name: 'Exclusivity (3 months)',
    fee: '+30%',
    description: 'Cannot work with direct competitors'
  },
  {
    name: 'Exclusivity (6 months)',
    fee: '+50%',
    description: 'Category exclusivity'
  },
  {
    name: 'Rush Delivery (48hr)',
    fee: '+50%',
    description: 'Expedited turnaround'
  },
  {
    name: 'Performance Bonus',
    fee: 'Variable',
    description: 'Bonus based on engagement/sales metrics'
  }
];

const negotiationTips = [
  'Always start at your ideal rate - room to negotiate down',
  'Know your minimum and do not go below it',
  'Factor in production time, not just posting time',
  'Accessibility niche commands premium - own your value',
  'Long-term partnerships > one-off posts',
  'Get usage rights in writing',
  'Require 50% deposit for new brands',
  'Track your metrics to justify rates'
];

export default function GuidancePage() {
  const [activeTab, setActiveTab] = useState<'social' | 'articles' | 'video' | 'bundles'>('social');

  const tabs = [
    { id: 'social', label: 'Social Media', icon: Instagram },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'bundles', label: 'Bundles', icon: Package },
  ];

  const getCurrentRates = () => {
    switch (activeTab) {
      case 'social': return socialMediaRates;
      case 'articles': return articleRates;
      case 'video': return videoRates;
      case 'bundles': return bundleRates;
      default: return socialMediaRates;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-sacred-teal/20 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-sacred-teal" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-warm-gold mb-2">Industry Guidance</h1>
        <p className="text-ivory-light/70">Creator rate card and pricing benchmarks</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6 text-center">
          <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-3xl font-bold text-ivory-light">$250</p>
          <p className="text-sm text-ivory-light/60">Minimum Post Rate</p>
        </div>
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6 text-center">
          <TrendingUp className="w-8 h-8 text-sacred-teal mx-auto mb-2" />
          <p className="text-3xl font-bold text-ivory-light">25-50%</p>
          <p className="text-sm text-ivory-light/60">Accessibility Premium</p>
        </div>
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6 text-center">
          <CheckCircle2 className="w-8 h-8 text-warm-gold mx-auto mb-2" />
          <p className="text-3xl font-bold text-ivory-light">50%</p>
          <p className="text-sm text-ivory-light/60">Deposit Required</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-sacred-teal/20 text-sacred-teal border border-sacred-teal/30'
                  : 'bg-royal-plum/10 text-ivory-light/70 hover:bg-royal-plum/20 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Rate Table */}
      <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-royal-plum/30 border-b border-warm-gold/10">
              <tr>
                <th className="text-left px-6 py-4 text-ivory-light font-semibold">Service</th>
                <th className="text-center px-4 py-4 text-ivory-light/60 text-sm">Industry Range</th>
                <th className="text-center px-4 py-4 text-green-400 font-semibold">Your Minimum</th>
                <th className="text-center px-4 py-4 text-warm-gold font-semibold">Your Ideal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-gold/10">
              {getCurrentRates().map((item, index) => (
                <tr key={index} className="hover:bg-royal-plum/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-ivory-light">{item.service}</p>
                    <p className="text-sm text-ivory-light/50">{item.description}</p>
                    <p className="text-xs text-ivory-light/40 mt-1 italic">{item.notes}</p>
                  </td>
                  <td className="text-center px-4 py-4 text-ivory-light/60">
                    {item.industryLow} - {item.industryHigh}
                  </td>
                  <td className="text-center px-4 py-4">
                    <span className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 font-semibold">
                      {item.babsMinimum}
                    </span>
                  </td>
                  <td className="text-center px-4 py-4">
                    <span className="inline-block px-3 py-1 bg-warm-gold/10 border border-warm-gold/30 rounded-lg text-warm-gold font-semibold">
                      {item.babsIdeal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Fees */}
      <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
        <h2 className="font-serif text-xl font-bold text-warm-gold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Additional Fees & Upsells
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {additionalFees.map((fee, index) => (
            <div key={index} className="bg-deep-indigo/30 rounded-xl p-4 border border-warm-gold/10">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-ivory-light">{fee.name}</p>
                <span className="text-sacred-teal font-bold">{fee.fee}</span>
              </div>
              <p className="text-sm text-ivory-light/60">{fee.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Negotiation Tips */}
      <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
        <h2 className="font-serif text-xl font-bold text-warm-gold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Negotiation Guidelines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {negotiationTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-sacred-teal flex-shrink-0 mt-0.5" />
              <p className="text-ivory-light/80">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-ivory-light/50 pt-4 border-t border-warm-gold/10">
        <p>These rates are guidelines based on industry benchmarks for micro-influencers (10K-100K followers)</p>
        <p className="mt-1">Accessibility niche creators can command 25-50% premium due to specialized audience</p>
        <p className="mt-1">Always adjust based on brand size, scope, and your current engagement rates</p>
      </div>
    </div>
  );
}
