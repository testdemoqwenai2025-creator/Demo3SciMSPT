'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Global Search Component - SciMSPT
 * 
 * Features:
 * - Keyboard shortcut (Cmd/Ctrl + K)
 * - Fuzzy search across all pages
 * - Recent searches
 * - Quick navigation
 * - Command palette style UI
 */

interface SearchResult {
  id: string
  title: string
  description: string
  href: string
  icon: string
  category: string
  keywords: string[]
}

const searchData: SearchResult[] = [
  // Pages
  { id: 'home', title: 'Home', description: 'Architecture Overview & Dashboard', href: '/', icon: '🏠', category: 'Pages', keywords: ['home', 'dashboard', 'overview', 'main'] },
  { id: 'maol', title: 'MAOL Architecture', description: 'Multi-Agent Orchestrator Layer', href: '/maol', icon: '🧠', category: 'Pages', keywords: ['maol', 'agent', 'orchestrator', 'multi-agent'] },
  { id: 'neural', title: 'Neural Tracking', description: 'Behavior Intelligence System', href: '/neural-tracking', icon: '🔮', category: 'Pages', keywords: ['neural', 'tracking', 'behavior', 'intelligence'] },
  { id: 'spatial', title: 'Spatial UI', description: '3D Interface Components', href: '/spatial-ui', icon: '🎨', category: 'Pages', keywords: ['spatial', 'ui', '3d', 'interface'] },
  { id: 'plugin', title: 'Plugin System', description: 'Secure Extensible Ecosystem', href: '/plugin-system', icon: '🔌', category: 'Pages', keywords: ['plugin', 'system', 'extensible', 'ecosystem'] },
  { id: 'intelligence', title: 'Intelligence Graph', description: 'Semantic Knowledge Network', href: '/intelligence-graph', icon: '🕸️', category: 'Pages', keywords: ['intelligence', 'graph', 'knowledge', 'semantic'] },
  { id: 'emergent', title: 'Emergent Behavior', description: 'Self-Optimization Engine', href: '/emergent-behavior', icon: '🔄', category: 'Pages', keywords: ['emergent', 'behavior', 'optimization', 'self'] },
  { id: 'auditability', title: 'Auditability', description: 'Immutable Audit Trail & Traceability', href: '/auditability', icon: '🔍', category: 'Pages', keywords: ['auditability', 'audit', 'trail', 'traceability'] },
  
  // Features
  { id: 'crypto', title: 'Crypto Demo', description: 'Real SHA-256 Hash Computation', href: '/auditability#crypto', icon: '🔐', category: 'Features', keywords: ['crypto', 'hash', 'sha256', 'security'] },
  { id: 'merkle', title: 'Merkle Tree Builder', description: 'Interactive Merkle Tree Construction', href: '/auditability#merkle', icon: '🌳', category: 'Features', keywords: ['merkle', 'tree', 'blockchain', 'hash'] },
  { id: 'compliance', title: 'Compliance Reports', description: 'GDPR, SOC2, HIPAA, ISO27001', href: '/auditability#compliance', icon: '📋', category: 'Features', keywords: ['compliance', 'gdpr', 'soc2', 'hipaa', 'iso'] },
  { id: 'blockchain', title: 'Blockchain Explorer', description: 'Mining Simulation & Validation', href: '/auditability#blockchain', icon: '⛓️', category: 'Features', keywords: ['blockchain', 'mine', 'validate', 'blocks'] },
  
  // Actions
  { id: 'theme', title: 'Toggle Theme', description: 'Switch between dark and light mode', href: '#theme', icon: '🌓', category: 'Actions', keywords: ['theme', 'dark', 'light', 'mode', 'toggle'] },
  { id: 'github', title: 'View on GitHub', description: 'Open repository in new tab', href: '#github', icon: '📦', category: 'Actions', keywords: ['github', 'repo', 'source', 'code'] },
]

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults(searchData.slice(0, 8))
      return
    }

    const lowerQuery = query.toLowerCase()
    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.keywords.some(kw => kw.includes(lowerQuery))
    ).slice(0, 8)

    setResults(filtered)
    setSelectedIndex(0)
  }, [query])

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false)
    setQuery('')
    
    if (result.href === '#theme') {
      window.dispatchEvent(new CustomEvent('toggle-theme'))
      return
    }
    
    if (result.href === '#github') {
      window.open('https://github.com/testdemoqwenai2025-creator/Demo3SciMSPT', '_blank')
      return
    }
    
    router.push(result.href)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    }
  }

  if (!isOpen) return null

  return (
    <div className="search-overlay" onClick={() => setIsOpen(false)}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        {/* Search Input */}
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, features, actions..."
            className="search-input"
            aria-label="Search"
            autoComplete="off"
          />
          <kbd className="search-shortcut">ESC</kbd>
        </div>

        {/* Results */}
        <div className="search-results">
          {results.length > 0 ? (
            <>
              {query.trim() === '' && (
                <div className="search-section-label">Quick Access</div>
              )}
              
              {results.map((result, index) => (
                <button
                  key={result.id}
                  className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span className="result-icon">{result.icon}</span>
                  <div className="result-content">
                    <span className="result-title">{result.title}</span>
                    <span className="result-description">{result.description}</span>
                  </div>
                  <span className="result-category">{result.category}</span>
                </button>
              ))}
            </>
          ) : (
            <div className="no-results">
              <span className="no-results-icon">😕</span>
              <p>No results found for "{query}"</p>
              <p className="no-results-hint">Try different keywords</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="search-footer">
          <div className="search-hints">
            <kbd>↑↓</kbd> Navigate
            <kbd>↵</kbd> Select
            <kbd>ESC</kbd> Close
          </div>
          <div className="search-powered">
            Powered by SciMSPT
          </div>
        </div>

        <style jsx>{`
          .search-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 10000;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding-top: 15vh;
            animation: fadeIn 200ms ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .search-modal {
            width: 100%;
            max-width: 600px;
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: 16px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            overflow: hidden;
            animation: slideUp 200ms ease-out;
          }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .search-input-wrapper {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            border-bottom: 1px solid var(--color-border);
          }

          .search-icon {
            font-size: 1.25rem;
            opacity: 0.6;
          }

          .search-input {
            flex: 1;
            background: none;
            border: none;
            outline: none;
            font-size: 1rem;
            color: var(--color-text-primary);
          }

          .search-input::placeholder {
            color: var(--color-text-muted);
          }

          .search-shortcut {
            padding: 4px 8px;
            background: var(--color-bg-tertiary);
            border-radius: 6px;
            font-size: 0.75rem;
            font-family: monospace;
            color: var(--color-text-muted);
          }

          .search-results {
            max-height: 400px;
            overflow-y: auto;
            padding: 8px;
          }

          .search-section-label {
            padding: 12px 16px 8px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--color-text-muted);
          }

          .search-result-item {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 12px 16px;
            border-radius: 10px;
            border: none;
            background: transparent;
            cursor: pointer;
            transition: all 150ms ease;
            text-align: left;
            color: inherit;
          }

          .search-result-item:hover,
          .search-result-item.selected {
            background: rgba(59, 130, 246, 0.1);
          }

          .search-result-item.selected {
            outline: 2px solid var(--color-primary);
            outline-offset: -2px;
          }

          .result-icon {
            font-size: 1.5rem;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-bg-tertiary);
            border-radius: 10px;
          }

          .result-content {
            flex: 1;
            min-width: 0;
          }

          .result-title {
            display: block;
            font-weight: 500;
            margin-bottom: 2px;
          }

          .result-description {
            display: block;
            font-size: 0.85rem;
            color: var(--color-text-muted);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .result-category {
            padding: 4px 8px;
            background: var(--color-bg-primary);
            border-radius: 6px;
            font-size: 0.7rem;
            font-weight: 500;
            color: var(--color-text-muted);
          }

          .no-results {
            text-align: center;
            padding: 40px 20px;
            color: var(--color-text-muted);
          }

          .no-results-icon {
            font-size: 2.5rem;
            display: block;
            margin-bottom: 12px;
          }

          .no-results p {
            margin: 4px 0;
          }

          .no-results-hint {
            font-size: 0.9rem !important;
            opacity: 0.7;
          }

          .search-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            border-top: 1px solid var(--color-border);
            font-size: 0.85rem;
            color: var(--color-text-muted);
          }

          .search-hints {
            display: flex;
            gap: 16px;
          }

          .search-hints kbd {
            padding: 2px 6px;
            background: var(--color-bg-primary);
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.75rem;
          }

          .search-powered {
            font-style: italic;
          }

          @media (max-width: 640px) {
            .search-modal {
              margin: 10px;
              max-height: calc(100vh - 20px);
            }

            .search-results {
              max-height: 300px;
            }

            .result-category {
              display: none;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

/**
 * Search Trigger Button (for nav bar)
 */
export function SearchTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="search-trigger"
        aria-label="Search (Cmd+K)"
      >
        <span className="search-trigger-icon">🔍</span>
        <span className="search-trigger-text">Search...</span>
        <kbd className="search-trigger-kbd">⌘K</kbd>

        <style jsx>{`
          .search-trigger {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 14px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--color-border);
            border-radius: 10px;
            cursor: pointer;
            transition: all 150ms ease;
            color: var(--color-text-muted);
            font-size: 0.9rem;
          }

          .search-trigger:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: var(--color-border-hover);
          }

          .search-trigger-icon {
            font-size: 1rem;
          }

          .search-trigger-text {
            display: none;
          }

          @media (min-width: 768px) {
            .search-trigger-text {
              display: inline;
            }
          }

          .search-trigger-kbd {
            padding: 2px 6px;
            background: var(--color-bg-tertiary);
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.7rem;
            opacity: 0.6;
          }

          [data-theme="light"] .search-trigger {
            background: rgba(0, 0, 0, 0.04);
          }
        `}</style>
      </button>

      {isOpen && <SearchModalWrapper onClose={() => setIsOpen(false)} />}
    </>
  )
}

function SearchModalWrapper({ onClose }: { onClose: () => void }) {
  return (
    <>
      <SearchModal />
      <script dangerouslySetInnerHTML={{ __html: `
        // Close modal when component unmounts is handled by SearchModal itself
      ` }} />
    </>
  )
}
