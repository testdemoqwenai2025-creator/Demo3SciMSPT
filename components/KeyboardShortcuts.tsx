'use client'

import { useEffect, useCallback, useState } from 'react'
import { ReactNode } from 'react'

interface KeyboardShortcutsProps {
  children: ReactNode
}

export function KeyboardShortcutsProvider({ children }: KeyboardShortcutsProps) {
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        if (e.key !== 'Escape') return
      }

      // Toggle help on Shift+?
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault()
        setShowHelp(prev => !prev)
      }
      
      // Close help on Escape
      if (e.key === 'Escape' && showHelp) {
        setShowHelp(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showHelp])

  return (
    <>
      {children}
      {showHelp && <KeyboardShortcutsHelp onClose={() => setShowHelp(false)} />}
    </>
  )
}

function KeyboardShortcutsHelp({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    { key: '⌘K', description: 'Open search' },
    { key: '/', description: 'Focus search' },
    { key: 'Shift + ?', description: 'Show this help' },
    { key: 'Esc', description: 'Close modals' },
  ]

  return (
    <div 
      className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-1">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
              <span className="text-sm text-white/70">{shortcut.description}</span>
              <kbd className="px-2 py-1 text-xs font-mono bg-white/10 text-white/80 rounded-md border border-white/10">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02]">
          <p className="text-xs text-white/40 text-center">
            Press <kbd className="px-1 py-0.5 text-xs bg-white/10 rounded mx-1">Shift + ?</kbd> to toggle
          </p>
        </div>
      </div>
    </div>
  )
}

// Simplified hook for future use
export function useKeyboardShortcuts() {
  return {
    showHelp: false,
    setShowHelp: () => {},
    activeShortcut: null as string | null,
    shortcuts: [],
    showToast: (message: string) => console.log(message),
  }
}

export default KeyboardShortcutsProvider
