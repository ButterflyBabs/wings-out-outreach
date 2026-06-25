'use client';

import { useState } from 'react';
import { Sparkles, Play, Loader2 } from 'lucide-react';

export default function ResearchPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function runResearch() {
    setIsRunning(true);
    try {
      const response = await fetch('/api/cron/daily-research', { method: 'POST' });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="font-serif text-3xl font-bold text-warm-gold mb-4">AI Research</h1>
      <p className="text-ivory-light/70 mb-6">Find 10 accessibility companies automatically</p>
      
      <button
        onClick={runResearch}
        disabled={isRunning}
        className="btn-primary flex items-center gap-2"
      >
        {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
        {isRunning ? 'Researching...' : 'Start AI Research'}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-royal-plum/20 rounded-xl">
          <p className="text-ivory-light">{result.message}</p>
        </div>
      )}
    </div>
  );
}
