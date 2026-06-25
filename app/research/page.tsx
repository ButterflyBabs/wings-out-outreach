'use client';

import { useState } from 'react';
import { Sparkles, Play, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResearchPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function runResearch() {
    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      console.log('Starting research...');
      const response = await fetch('/api/cron/daily-research', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Research failed');
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Network error - check console');
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-sacred-teal/20 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-sacred-teal" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-warm-gold mb-2">AI Research</h1>
        <p className="text-ivory-light/70">Find 10 accessibility companies automatically</p>
      </div>
      
      <button
        onClick={runResearch}
        disabled={isRunning}
        className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
      >
        {isRunning ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Researching... (2-3 minutes)
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Start AI Research
          </>
        )}
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-400 mb-1">Error</h3>
            <p className="text-ivory-light/80 text-sm">{error}</p>
          </div>
        </div>
      )}

      {result && result.success && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold text-green-400">Research Complete!</h3>
          </div>
          <p className="text-ivory-light mb-4">{result.message}</p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-deep-indigo/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-400">{result.results?.imported || 0}</p>
              <p className="text-sm text-ivory-light/60">Companies Imported</p>
            </div>
            <div className="bg-deep-indigo/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-yellow-400">{result.results?.skipped || 0}</p>
              <p className="text-sm text-ivory-light/60">Duplicates Skipped</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
