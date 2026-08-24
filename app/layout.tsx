import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { DNAHelix } from '@/components/DNAHelix'
import { ToastProvider } from '@/components/Toast'
import { SearchModal, SearchTrigger } from '@/components/Search'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SciMSPT - AI-Native Future-Proof Architecture',
  description: 'Phase 3: Multi-Agent Orchestrator Layer, Neural Tracking, Spatial UI, Plugin System, Intelligence Graph, Emergent Behavior',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={inter.className}>
        {/* DNA Helix Decorations - Left and Right sides */}
        <DNAHelix side="left" />
        <DNAHelix side="right" />
        
        <ToastProvider>
          <div className="app-container">
            <Navigation />
            
            {/* Search Trigger in header area */}
            <div className="search-trigger-wrapper">
              <SearchTrigger />
            </div>
            
            <main className="main-content">
              {children}
            </main>
          </div>

          {/* Global Search Modal */}
          <SearchModal />

          {/* Theme initialization script */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    const savedTheme = localStorage.getItem('scimspt-theme');
                    if (savedTheme) {
                      document.documentElement.setAttribute('data-theme', savedTheme);
                    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                      document.documentElement.setAttribute('data-theme', 'light');
                    }
                  } catch (e) {}
                })();
              `,
            }}
          />
        </ToastProvider>
      </body>
    </html>
  )
}
