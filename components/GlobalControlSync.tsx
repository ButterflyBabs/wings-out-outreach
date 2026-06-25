'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface GlobalControlSyncProps {
  companyId: string;
  companyName: string;
  isSynced?: boolean;
  onSync?: () => void;
}

export default function GlobalControlSync({ 
  companyId, 
  companyName, 
  isSynced = false,
  onSync 
}: GlobalControlSyncProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>(isSynced ? 'success' : 'idle');
  const [message, setMessage] = useState('');

  const handleSync = async () => {
    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/global-control/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyId }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Synced successfully!');
        onSync?.();
      } else {
        setStatus('error');
        setMessage(data.error || 'Sync failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkSync = async () => {
    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/global-control/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bulk: true }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Bulk sync completed!');
        onSync?.();
      } else {
        setStatus('error');
        setMessage(data.error || 'Bulk sync failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={handleSync}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            status === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-sacred-teal/20 text-sacred-teal border border-sacred-teal/30 hover:bg-sacred-teal/30'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : status === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>
            {isLoading 
              ? 'Syncing...' 
              : status === 'success' 
                ? 'Synced to Global Control' 
                : 'Sync to Global Control'}
          </span>
        </button>

        <button
          onClick={handleBulkSync}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-royal-plum/20 text-ivory-light/70 border border-warm-gold/20 hover:bg-royal-plum/30 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Bulk Sync</span>
        </button>
      </div>

      {message && (
        <div className={`flex items-center gap-2 text-sm ${
          status === 'success' ? 'text-green-400' : 'text-red-400'
        }`}>
          {status === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          <span>{message}</span>
        </div>
      )}

      <p className="text-xs text-ivory-light/50">
        Syncs &quot;{companyName}&quot; to Global Control CRM with tags and custom fields.
      </p>
    </div>
  );
}
