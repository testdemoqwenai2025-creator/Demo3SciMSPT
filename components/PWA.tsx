'use client'

import { useState, useEffect } from 'react'

/**
 * PWA Install Prompt Component
 * 
 * Shows a customizable install banner when:
 * - App meets PWA installability criteria
 * - User hasn't already installed
 * - Prompt hasn't been dismissed recently
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  // Check if app is already installed (running in standalone mode)
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    setIsInstalled(isStandalone)
    
    // Check localStorage for dismissal
    const dismissedUntil = localStorage.getItem('pwa-dismissed-until')
    if (dismissedUntil && new Date(dismissedUntil) > new Date()) {
      setIsDismissed(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    
    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowBanner(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  // Handle install click
  const handleInstall = async () => {
    if (!deferredPrompt) return
    
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setShowBanner(false)
        setDeferredPrompt(null)
      } else {
        // User dismissed - show again later
        setShowBanner(false)
      }
    } catch (error) {
      console.error('PWA Install error:', error)
    }
  }

  // Handle dismiss
  const handleDismiss = (duration: 'session' | 'week' | 'month' = 'week') => {
    setShowBanner(false)
    setDeferredPrompt(null)
    
    const dismissDurations = {
      session: new Date(Date.now() + 3600000), // 1 hour
      week: new Date(Date.now() + 7 * 24 * 3600000),
      month: new Date(Date.now() + 30 * 24 * 3600000)
    }
    
    localStorage.setItem('pwa-dismissed-until', dismissDurations[duration].toISOString())
    setIsDismissed(true)
  }

  // Don't show if already installed or dismissed
  if (isInstalled || isDismissed || !showBanner) {
    return null
  }

  return (
    <div className="pwa-install-banner" role="dialog" aria-label="Install App">
      <div className="pwa-content">
        <div className="pwa-icon">📱</div>
        <div className="pwa-text">
          <strong>Install SciMSPT</strong>
          <span>Add to home screen for offline access & full-screen experience</span>
        </div>
        
        <div className="pwa-actions">
          <button onClick={handleInstall} className="pwa-install-btn">
            ⬇️ Install App
          </button>
          <button onClick={() => handleDismiss('week')} className="pwa-dismiss-btn">
            Later
          </button>
        </div>
      </div>

      <style jsx>{`
        .pwa-install-banner {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9998;
          animation: slideUp 400ms ease-out;
          max-width: 500px;
          width: calc(100% - 40px);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .pwa-content {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(139, 92, 246, 0.95));
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .pwa-icon {
          font-size: 2rem;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .pwa-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .pwa-text strong {
          color: white;
          font-size: 1rem;
        }

        .pwa-text span {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
        }

        .pwa-actions {
          display: flex;
          gap: 10px;
        }

        .pwa-install-btn,
        .pwa-dismiss-btn {
          padding: 8px 18px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 150ms ease;
        }

        .pwa-install-btn {
          background: white;
          color: #3b82f6;
        }

        .pwa-install-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        }

        .pwa-dismiss-btn {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }

        .pwa-dismiss-btn:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        @media (max-width: 600px) {
          .pwa-content {
            flex-direction: column;
            text-align: center;
          }

          .pwa-actions {
            width: 100%;
            justify-content: stretch;
          }
        }
      `}</style>
    </div>
  )
}

/**
 * Offline Indicator Component
 */
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="offline-indicator" role="alert">
      <span className="offline-icon">📡</span>
      <span>You're offline. Some features may be limited.</span>
      
      <style jsx>{`
        .offline-indicator {
          position: fixed;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          padding: 10px 20px;
          background: rgba(239, 68, 68, 0.95);
          border: 1px solid #fca5a5;
          border-radius: 10px;
          color: white;
          font-size: 0.9rem;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: pulse 2s infinite;
        }

        .offline-icon {
          font-size: 1.25rem;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
