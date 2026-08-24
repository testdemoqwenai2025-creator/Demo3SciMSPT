'use client'

import { useState, useEffect } from 'react'

/**
 * ThemeToggle Component - Dark/Light Mode Switcher
 * 
 * Features:
 * - Persists theme preference in localStorage
 * - Syncs across all pages
 * - Smooth transitions between themes
 * - Respects system preference on first visit
 * - Animated sun/moon icons
 */

type Theme = 'dark' | 'light'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('scimspt-theme') as Theme | null
    
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light')
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    
    // Update DOM and localStorage
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('scimspt-theme', newTheme)
    
    // Dispatch custom event for other components to react
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }))
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button 
        className="theme-toggle" 
        aria-label="Toggle theme"
        style={{ opacity: 0.5 }}
      >
        <span className="toggle-icon">🌙</span>
      </button>
    )
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`${theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}`}
    >
      <span className={`toggle-icon ${theme === 'light' ? 'sun' : 'moon'}`}>
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
      
      <style jsx>{`
        .theme-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          cursor: pointer;
          transition: all 200ms ease;
          position: relative;
          overflow: hidden;
        }

        .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(99, 102, 241, 0.5);
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
        }

        .theme-toggle:active {
          transform: scale(0.95);
        }

        .toggle-icon {
          font-size: 1.25rem;
          display: inline-block;
          transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .toggle-icon.sun {
          animation: rotateIn 500ms ease-out;
          filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.8));
        }

        .toggle-icon.moon {
          animation: rotateOut 300ms ease-out;
          filter: drop-shadow(0 0 8px rgba(147, 197, 253, 0.6));
        }

        @keyframes rotateIn {
          from {
            transform: rotate(-90deg) scale(0);
            opacity: 0;
          }
          to {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
        }

        @keyframes rotateOut {
          from {
            transform: rotate(90deg) scale(1);
            opacity: 1;
          }
          to {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
        }

        /* Light mode specific styles */
        [data-theme="light"] .theme-toggle {
          background: rgba(0, 0, 0, 0.05);
          border-color: rgba(0, 0, 0, 0.1);
        }

        [data-theme="light"] .theme-toggle:hover {
          background: rgba(0, 0, 0, 0.08);
          border-color: rgba(99, 102, 241, 0.3);
        }
      `}</style>
    </button>
  )
}

/**
 * Hook to use current theme in components
 */
export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      setCurrentTheme(e.detail.theme)
    }
    
    // Get initial theme
    const saved = localStorage.getItem('scimspt-theme') as Theme | null
    if (saved) setCurrentTheme(saved)

    window.addEventListener('themechange', handleThemeChange as EventListener)
    return () => window.removeEventListener('themechange', handleThemeChange as EventListener)
  }, [])

  return currentTheme
}
