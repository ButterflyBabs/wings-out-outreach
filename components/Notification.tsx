'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, X, AlertCircle, Info } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
  duration?: number;
}

export default function Notification({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 5000 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: {
      bg: 'bg-green-500/20',
      border: 'border-green-500/30',
      text: 'text-green-400',
      icon: CheckCircle2,
      title: 'Success'
    },
    error: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: XCircle,
      title: 'Error'
    },
    warning: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: AlertCircle,
      title: 'Warning'
    },
    info: {
      bg: 'bg-sacred-teal/20',
      border: 'border-sacred-teal/30',
      text: 'text-sacred-teal',
      icon: Info,
      title: 'Info'
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`fixed top-4 right-4 z-50 animate-slide-in`}>
      <div className={`${style.bg} border ${style.border} rounded-xl p-4 shadow-lg max-w-md`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${style.text} flex-shrink-0 mt-0.5`} />
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold ${style.text} mb-1`}>
              {style.title}
            </h4>
            <p className="text-ivory-light/80 text-sm">
              {message}
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="text-ivory-light/40 hover:text-ivory-light/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for using notifications
export function useNotification() {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null>(null);

  const showSuccess = (message: string) => {
    setNotification({ message, type: 'success' });
  };

  const showError = (message: string) => {
    setNotification({ message, type: 'error' });
  };

  const showWarning = (message: string) => {
    setNotification({ message, type: 'warning' });
  };

  const showInfo = (message: string) => {
    setNotification({ message, type: 'info' });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return {
    notification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification
  };
}
