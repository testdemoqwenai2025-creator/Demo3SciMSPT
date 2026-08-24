import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { DNAHelix } from '@/components/DNAHelix'
import { ToastProvider } from '@/components/ToastNotification'
import { KeyboardShortcutsProvider } from '@/components/KeyboardShortcuts'
import { SubscriptionProvider, UsageLimitWarning } from '@/components/Subscription'
import { PWAInstallPrompt, OfflineIndicator } from '@/components/PWA'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SciMSPT - AI-Native Future-Proof Architecture',
  description: 'Phase 3: Multi-Agent Orchestrator Layer, Neural Tracking, Spatial UI, Plugin System, Intelligence Graph, Emergent Behavior',
  manifest: '/Demo3SciMSPT/manifest.json',
  themeColor: '#3b82f6',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/Demo3SciMSPT/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="application-name" content="SciMSPT" />
      </head>
      
      <body className={inter.className}>
        {/* DNA Helix Decorations - Left and Right sides */}
        <DNAHelix side="left" />
        <DNAHelix side="right" />
        
        {/* Offline Indicator */}
        <OfflineIndicator />
        
        <ErrorBoundary>
          <KeyboardShortcutsProvider>
            <SubscriptionProvider>
              <ToastProvider>
                <div className="app-container">
                  <Navigation />
                  
                  {/* PWA Install Prompt */}
                  <div className="nav-extras">
                    <PWAInstallPrompt />
                  </div>
                  
                  <main className="main-content">
                    {/* Usage Warning Banner (for free tier users) */}
                    <UsageLimitWarning type="apiCalls" />
                    
                    {children}
                  </main>

                  {/* Upgrade Modal */}
                  {/* <UpgradeModal 
                    isOpen={false} 
                    onClose={() => {}} 
                  /> */}
                </div>

                {/* Theme & PWA initialization script */}
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      // Initialize PWA Service Worker
                      if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.register('/Demo3SciMSPT/sw.js', {
                          scope: '/Demo3SciMSPT/'
                        }).catch(() => console.log('SW registration failed'));
                      }

                      // Theme initialization
                      try {
                        const savedTheme = localStorage.getItem('scimspt-theme');
                        if (savedTheme) {
                          document.documentElement.setAttribute('data-theme', savedTheme);
                        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                          document.documentElement.setAttribute('data-theme', 'light');
                        }
                      } catch (e) {}

                      // Listen for upgrade modal events
                      window.addEventListener('show-upgrade-modal', () => {
                        const event = new CustomEvent('show-upgrade-modal-internal');
                        window.dispatchEvent(event);
                      });
                    `,
                  }}
                />
              </ToastProvider>
            </SubscriptionProvider>
          </KeyboardShortcutsProvider>
        </ErrorBoundary>

        {/* NoScript fallback for better SEO */}
        <noscript>
          <div style={{ padding: 20, textAlign: 'center', color: '#f1f5f9' }}>
            <h1>SciMSPT requires JavaScript to run properly</h1>
            <p>Please enable JavaScript to view this application.</p>
          </div>
        </noscript>
      </body>
    </html>
  )
}
