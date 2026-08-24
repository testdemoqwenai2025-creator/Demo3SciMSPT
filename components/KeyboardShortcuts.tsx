'use client'

import { useEffect, useCallback, useState } from 'react'

interface Shortcut {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  description: string
  action: () => void
}

interface KeyboardShortcutsProps {
  shortcuts?: Shortcut[]
  showHelp?: boolean
}

// Default shortcuts for SciMSPT
const defaultShortcuts: Omit<Shortcut, 'action'>[] = [
  { key: 'k', metaKey: true, description: 'Open search' },
  { key: '/', description: 'Focus search' },
  { key: 'd', ctrlKey: true, shiftKey: true, description: 'Toggle dark mode' },
  { key: 'h', altKey: true, description: 'Go to home' },
  { key: 'ArrowLeft', altKey: true, description: 'Go back' },
  { key: 'ArrowRight', altKey: true, description: 'Go forward' },
  { key: '?', shiftKey: true, description: 'Show keyboard shortcuts' },
]

export function useKeyboardShortcuts(customShortcuts?: Shortcut[]) {
  const [showHelp, setShowHelp] = useState(false)
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null)

  // Build full shortcut list with actions
  const buildShortcuts = useCallback((): Shortcut[] => {
    return (customShortcuts || []).concat(
      defaultShortcuts.map(s => ({
        ...s,
        action: () => {
          setActiveShortcut(s.description)
          setTimeout(() => setActiveShortcut(null), 500)
        }
      }))
    )
  }, [customShortcuts])

  // Handle keyboard events
  useEffect(() => {
    const shortcuts = buildShortcuts()

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // Allow escape to close modals even in inputs
        if (e.key !== 'Escape') return
      }

      // Find matching shortcut
      const matched = shortcuts.find(shortcut => 
        e.key.toLowerCase() === shortcut.key.toLowerCase() &&
        !!e.ctrlKey === !!shortcut.ctrlKey &&
        !!e.metaKey === !!shortcut.metaKey &&
        !!e.shiftKey === !!shortcut.shiftKey &&
        !!e.altKey === !!shortcut.altKey
      )

      if (matched) {
        e.preventDefault()
        matched.action()

        // Toggle help on ?/Shift+?
        if (matched.key === '?' && matched.shiftKey) {
          setShowHelp(prev => !prev)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [buildShortcuts])

  // Show toast notification when shortcut is triggered
  const showToast = (message: string) => {
    setActiveShortcut(message)
    setTimeout(() => setActiveShortcut(null), 2000)
  }

  return {
    showHelp,
    setShowHelp,
    activeShortcut,
    shortcuts: defaultShortcuts,
    showToast,
  }
}

// Keyboard shortcuts help modal component
export function KeyboardShortcutsHelp({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void 
}) {
  if (!isOpen) return null

  const formatKey = (shortcut: Omit<Shortcut, 'action' | 'description'>) => {
    const parts: string[] = []
    if (shortcut.ctrlKey) parts.push('Ctrl')
    if (shortcut.metaKey) parts.push('⌘')
    if (shortcut.altKey) parts.push('Alt')
    if (shortcut.shiftKey) parts.push('Shift')
    
    let key = shortcut.key
    if (key === ' ') key = 'Space'
    if (key === 'ArrowLeft') key = '←'
    if (key === 'ArrowRight') key = '→'
    if (key === 'ArrowUp') key = '↑'
    if (key === 'ArrowDown') key = '↓'
    
    parts.push(key)
    return parts.join(' + ')
  }

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-4 max-h-[400px] overflow-y-auto space-y-1">
          {defaultShortcuts.map((shortcut, index) => (
            <div 
              key={index}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                {shortcut.description}
              </span>
              <kbd className="flex items-center gap-1 px-2 py-1 text-xs font-mono bg-white/10 text-white/80 rounded-md border border-white/10">
                {formatKey(shortcut)}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02]">
          <p className="text-xs text-white/40 text-center">
            Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-white/10 rounded mx-1">Shift + ?</kbd> to toggle this help
          </p>
        </div>
      </div>
    </div>
  )
}

// Visual indicator when a shortcut is triggered
export function ShortcutIndicator({ label }: { label: string | null }) {
  if (!label) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9998] animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-xl backdrop-blur-md">
        <span className="text-sm font-medium text-cyan-300">{label}</span>
      </div>
    </div>
  )
}

// Main export that combines everything
export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const { showHelp, setShowHelp, activeShortcut } = useKeyboardShortcuts()

  return (
    <>
      {children}
      <KeyboardShortcutsHelp isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <ShortcutIndicator label={activeShortcut} />
    </>
  )
}

export default useKeyboardShortcuts
