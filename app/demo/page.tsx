'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    // Set demo mode flag in localStorage
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoUser', JSON.stringify({
      id: 'demo-user-123',
      email: 'demo@example.com',
      name: 'Demo User'
    }));
    
    // Redirect to home page
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-sacred-teal animate-spin mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold text-warm-gold">Starting Demo...</h1>
        <p className="text-ivory-light/60 mt-2">Please wait</p>
      </div>
    </div>
  );
}
