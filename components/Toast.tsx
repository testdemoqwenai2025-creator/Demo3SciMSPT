'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'

/**
 * Toast Notification System - SciMSPT
 * 
 * Features:
 * - Multiple toast types (success, error, warning, info)
 * - Auto-dismiss with configurable duration
 * - Stack management (multiple toasts)
 * - Smooth animations
 * - Keyboard dismissible
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

let toastId = 0

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastId}`
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev.slice(-4), newToast]) // Max 5 toasts
    
    // Auto-dismiss
    const duration = toast.duration || 5000
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
  }, [removeToast])

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message })
  }, [addToast])

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message, duration: 8000 }) // Errors stay longer
  }, [addToast])

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message })
  }, [addToast])

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message })
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  // Escape key dismisses all
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toasts.forEach(t => removeToast(t.id))
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [toasts, removeToast])

  if (toasts.length === 0) return null

  return (
    <div className="toast-container" aria-live="polite" aria-label="Notifications">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
      
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 400px;
          width: 100%;
        }

        @media (max-width: 640px) {
          .toast-container {
            left: 10px;
            right: 10px;
            max-width: none;
          }
        }
      `}</style>
    </div>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [isExiting, setIsExiting] = useState(false)

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 300) // Wait for exit animation
  }

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }

  const colors = {
    success: { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', text: '#34d399' },
    error: { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444', text: '#f87171' },
    warning: { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', text: '#fbbf24' },
    info: { bg: 'rgba(59, 130, 246, 0.1)', border: '#3b82f6', text: '#60a5fa' }
  }

  const color = colors[toast.type]

  return (
    <div 
      className={`toast-item ${isExiting ? 'exiting' : ''}`}
      style={{
        background: color.bg,
        borderLeftColor: color.border
      }}
      role="alert"
    >
      <div className="toast-icon">{icons[toast.type]}</div>
      
      <div className="toast-content">
        <div className="toast-title" style={{ color: color.text }}>{toast.title}</div>
        {toast.message && <div className="toast-message">{toast.message}</div>}
      </div>

      <button onClick={handleClose} className="toast-close" aria-label="Dismiss notification">
        ✕
      </button>

      {toast.action && (
        <button 
          onClick={() => { toast.action!.onClick(); handleClose(); }} 
          className="toast-action"
          style={{ background: color.border, color: '#fff' }}
        >
          {toast.action.label}
        </button>
      )}

      {/* Progress bar */}
      <div className="toast-progress" style={{ background: color.border }}>
        <div 
          className="toast-progress-bar"
          style={{ 
            animationDuration: `${toast.duration || 5000}ms`,
            background: color.text
          }}
        />
      </div>

      <style jsx>{`
        .toast-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 12px;
          border-left: 4px solid;
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          animation: slideInRight 300ms ease-out forwards;
          transition: all 300ms ease;
        }

        .toast-item.exiting {
          animation: slideOutRight 300ms ease-in forwards;
          opacity: 0;
          transform: translateX(100%);
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        .toast-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .toast-content {
          flex: 1;
          min-width: 0;
        }

        .toast-title {
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 4px;
        }

        .toast-message {
          font-size: 0.85rem;
          opacity: 0.8;
          line-height: 1.4;
        }

        .toast-close {
          background: none;
          border: none;
          color: inherit;
          opacity: 0.5;
          cursor: pointer;
          padding: 4px;
          font-size: 1rem;
          border-radius: 4px;
          transition: all 150ms ease;
          flex-shrink: 0;
        }

        .toast-close:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.1);
        }

        .toast-action {
          margin-top: 8px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 150ms ease;
        }

        .toast-action:hover {
          filter: brightness(1.1);
          transform: scale(1.02);
        }

        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          border-radius: 0 0 12px 12px;
          overflow: hidden;
        }

        .toast-progress-bar {
          height: 100%;
          animation: progressShrink linear forwards;
        }

        @keyframes progressShrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}
