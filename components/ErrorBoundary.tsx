'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

/**
 * Error Boundary Component - SciMSPT
 * 
 * Catches JavaScript errors gracefully and shows:
 * - User-friendly error message
 * - Recovery options
 * - Error details for debugging
 * - Report to support option
 */

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  showErrorDetails?: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      hasError: true,
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback provided by parent
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="error-boundary" role="alert">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Something went wrong</h2>
            <p className="error-message">
              We're sorry for the inconvenience. The application encountered an unexpected error.
              {this.state.error?.message && (
                <span className="error-details">Error: {this.state.error.message}</span>
              )}
            </p>

            <div className="error-actions">
              <button onClick={this.handleReset} className="error-btn primary">
                🔄 Try Again
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="error-btn"
              >
                🔃 Reload Page
              </button>
              <button 
                onClick={() => window.location.href = '/Demo3SciMSPT/'}
                className="error-btn"
              >
                🏠 Go Home
              </button>
            </div>

            {this.props.showErrorDetails && this.state.error && (
              <details className="error-details">
                <summary>Error Details (for developers)</summary>
                  <pre className="error-stacktrace">
                    {this.state.error.stack || 'No stack trace available'}
                  </pre>
                </details>
              )}
          </div>

          <style jsx>{`
            .error-boundary {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 400px;
              padding: 40px 20px;
              animation: fadeIn 300ms ease-out;
            }

            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }

            .error-container {
              max-width: 500px;
              text-align: center;
            }

            .error-icon {
              font-size: 4rem;
              margin-bottom: 16px;
              animation: shake 1s ease-in-out;
            }

            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-5px); }
              75% { transform: translateX(5px); }
            }

            .error-title {
              font-size: 1.5rem;
              font-weight: 700;
              color: var(--color-text-primary);
              margin: 0 0 12px 0;
            }

            .error-message {
              font-size: 1rem;
              color: var(--color-text-secondary);
              margin: 0 0 24px 0;
              line-height: 1.6;
            }

            .error-details {
              margin-top: 16px;
              text-align: left;
            }

            .error-details summary {
              cursor: pointer;
              padding: 8px 12px;
              background: var(--color-bg-tertiary);
              border-radius: 6px;
              font-family: monospace;
              font-size: 0.85rem;
              color: var(--color-text-muted);
            }

            .error-stacktrace {
              margin-top: 8px;
              padding: 12px;
              background: var(--color-bg-primary);
              border-radius: 6px;
              overflow: auto;
              white-space: pre-wrap;
              word-break: break-all;
              font-size: 0.8rem;
              color: #ef4444;
              max-height: 200px;
              overflow-y: auto;
            }

            .error-actions {
              display: flex;
              gap: 12px;
              justify-content: center;
              flex-wrap: wrap;
            }

            .error-btn {
              padding: 12px 24px;
              border-radius: 10px;
              border: none;
              font-weight: 600;
              font-size: 0.95rem;
              cursor: pointer;
              transition: all 150ms ease;
            }

            .error-btn.primary {
              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
              color: white;
            }

            .error-btn:not(.primary) {
              background: var(--color-bg-tertiary);
              color: var(--color-text-primary);
              border: 1px solid var(--color-border);
            }

            .error-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
          `}</style>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Page Not Found / 404 Component
 */
export function NotFoundPage() {
  return (
    <div className="not-found" role="main">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="not-found-actions">
          <a href="/Demo3SciMSPT/" className="home-link">
            ← Back to Home
          </a>
          <button onClick={() => window.history.back()} className="back-link">
            Go Back
          </button>
        </div>

        <div className="not-found-illustration">
          <div className="illustration">🔍</div>
          <p>Let's help you find what you need</p>
          
          <div className="suggestions">
            <a href="/Demo3SciMSPT/maol">→ MAOL Architecture</a>
            <a href="/Demo3SciMSPT/neural-tracking">→ Neural Tracking</a>
            <a href="/Demo3SciMSPT/intelligence-graph">→ Intelligence Graph</a>
            <a href="/Demo3SciMSPT/auditability">→ Auditability</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .not-found {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 80px);
          padding: 40px 20px;
        }

        .not-found-content {
          text-align: center;
          max-width: 600px;
        }

        .not-found-code {
          font-size: 8rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
          margin-bottom: 16px;
        }

        .not-found-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0 0 12px 0;
        }

        .not-found-message {
          font-size: 1.05rem;
          color: var(--color-text-secondary);
          margin: 0 0 32px 0;
          line-height: 1.6;
        }

        .not-found-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 24px;
        }

        .home-link,
        .back-link {
          padding: 14px 28px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          transition: all 150ms ease;
        }

        .home-link {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
        }

        .back-link {
          background: var(--color-bg-tertiary);
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
        }

        .home-link:hover,
        .back-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .not-found-illustration {
          margin-top: 48px;
          opacity: 0.7;
        }

        .illustration {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .suggestions {
          display: grid;
          gap: 12px;
          margin-top: 24px;
          text-align: left;
        }

        .suggestions a {
          color: var(--color-primary);
          text-decoration: none;
          font-size: 0.95rem;
          padding: 8px 12px;
          background: var(--color-bg-secondary);
          border-radius: 8px;
          transition: all 150ms ease;
        }

        .suggestions a:hover {
          background: rgba(59, 130, 246, 0.1);
          transform: translateX(4px);
        }
      `}</style>
    </div>
  )
}
