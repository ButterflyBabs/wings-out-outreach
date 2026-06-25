'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  TrendingUp,
  Clock
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ResearchPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function runResearch() {
    setIsRunning(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/cron/daily-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Research failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-2xl bg-sacred-teal/20 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-sacred-teal" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-warm-gold mb-4">
          AI Auto-Research
        </h1>
        <p className="text-ivory-light/70 max-w-2xl mx-auto text-lg">
          Let AI find and research 10 new accessibility-focused companies every weekday. 
          Automatically scores opportunities and imports contact information.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6 text-center">
          <Building2 className="w-8 h-8 text-sacred-teal mx-auto mb-3" />
          <p className="text-3xl font-bold text-ivory-light">10</p>
          <p className="text-ivory-light/60">Companies per day</p>
        </div>
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6 text-center">
          <TrendingUp className="w-8 h-8 text-warm-gold mx-auto mb-3" />
          <p className="text-3xl font-bold text-ivory-light">50</p>
          <p className="text-ivory-light/60">Per week</p>
        </div>
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6 text-center">
          <Clock className="w-8 h-8 text-soft-lavender mx-auto mb-3" />
          <p className="text-3xl font-bold text-ivory-light">9am</p>
          <p className="text-ivory-light/60">Mountain Time</p>
        </div>
      </div>

      {/* Run Button */}
      <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-warm-gold mb-4">
          Run Research Now
        </h2>
        <p className="text-ivory-light/60 mb-6">
          Manually trigger AI research to find 10 new companies immediately.
        </p>
        
        <button
          onClick={runResearch}
          disabled={isRunning}
          className="btn-primary text-lg px-8 py-4 flex items-center gap-3 mx-auto"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Researching... (this may take 2-3 minutes)
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start AI Research
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <h3 className="font-serif text-xl font-bold text-green-400">
              Research Complete!
            </h3>
          </div>
          
          <p className="text-ivory-light mb-4">{result.message}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-deep-indigo/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{result.results.imported}</p>
              <p className="text-ivory-light/60">Companies Imported</p>
            </div>
            <div className="bg-deep-indigo/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-yellow-400">{result.results.skipped}</p>
              <p className="text-ivory-light/60">Duplicates Skipped</p>
            </div>
          </div>
          
          {result.results.errors.length > 0 && (
            <div className="mt-4 p-4 bg-red-500/10 rounded-xl">
              <p className="text-red-400 font-medium mb-2">Errors:</p>
              <ul className="text-sm text-ivory-light/60 space-y-1">
                {result.results.errors.map((err: string, i: number) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="font-semibold text-red-400">Error</h3>
              <p className="text-ivory-light/80">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
        <h2 className="font-serif text-2xl font-bold text-warm-gold mb-6">
          How It Works
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-sacred-teal/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sacred-teal font-bold">1</span>
            </div>
            <div>
              <h3 className="font-medium text-ivory-light">AI Searches</h3>
              <p className="text-ivory-light/60 text-sm">
                GPT-4 searches for accessibility-focused companies across 8 categories
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-sacred-teal/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sacred-teal font-bold">2</span>
            </div>
            <div>
              <h3 className="font-medium text-ivory-light">Researches & Scores</h3>
              <p className="text-ivory-light/60 text-sm">
                AI analyzes website, extracts contact info, and scores fit (A, B, C, D priority)
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-sacred-teal/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sacred-teal font-bold">3</span>
            </div>
            <div>
              <h3 className="font-medium text-ivory-light">Imports to Database</h3>
              <p className="text-ivory-light/60 text-sm">
                Creates company record, contact, opportunity, and review task
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-sacred-teal/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sacred-teal font-bold">4</span>
            </div>
            <div>
              <h3 className="font-medium text-ivory-light">You Review</h3>
              <p className="text-ivory-light/60 text-sm">
                Check the AI research, approve outreach, or skip if not a fit
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-6">
        <h2 className="font-serif text-2xl font-bold text-warm-gold mb-4">
          Research Categories
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'Mobility Equipment',
            'Accessible Vehicles',
            'Adaptive Clothing',
            'Assistive Technology',
            'Home Accessibility',
            'Service Dog Gear',
            'Digital Accessibility',
            'Health & Wellness'
          ].map((cat) => (
            <div key={cat} className="bg-deep-indigo/50 rounded-lg px-4 py-2 text-center">
              <span className="text-sm text-ivory-light/80">{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
