import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
});

export const metadata: Metadata = {
  title: 'Wings Out Outreach | Babs & Beau Partnership System',
  description: 'Ambassador outreach and partnership management system for Babs Carroll and Beau',
  keywords: ['accessibility', 'ambassador', 'partnership', 'service dog', 'disability advocacy'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-deep-indigo">
        {/* Skip link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            {/* Header with notification bell */}
            <header className="h-16 border-b border-warm-gold/10 bg-deep-indigo/50 backdrop-blur-sm flex items-center justify-end px-6 sticky top-0 z-40">
              <NotificationBell />
            </header>
            <main id="main-content" className="flex-1 transition-all duration-300">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
