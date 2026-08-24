'use client'

import { useState, useEffect, useRef } from 'react'

interface SearchResult {
  title: string
  description: string
  href: string
  category: string
}

const searchData: SearchResult[] = [
  { title: 'Home', description: 'SciMSPT - Scientific Multi-Agent System Platform', href: '/', category: 'Pages' },
  { title: 'MAOL', description: 'Multi-Agent Orchestration Layer - Core orchestration system', href: '/maol', category: 'Core' },
  { title: 'Neural Tracking', description: 'Real-time neural pathway visualization and tracking', href: '/neural-tracking', category: 'Visualization' },
  { title: 'Intelligence Graph', description: 'Knowledge graph visualization and analysis', href: '/intelligence-graph', category: 'Visualization' },
  { title: 'Emergent Behavior', description: 'Study emergent patterns in multi-agent systems', href: '/emergent-behavior', category: 'Research' },
  { title: 'Spatial UI', description: 'Spatial user interface with 3D interactions', href: '/spatial-ui', category: 'Interface' },
  { title: 'Plugin System', description: 'Extensible plugin architecture and marketplace', href: '/plugin-system', category: 'System' },
  { title: 'Auditability', description: 'Complete audit trail and transparency logs', href: '/auditability', category: 'Security' },
]

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>(searchData)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut handler (Cmd+K / Ctrl+K)
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

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setQuery('')
      setResults(searchData)
    }
  }, [isOpen])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    
    const handleClickOutside = (e: MouseEvent) => {
      const modal = document.getElementById('search-modal')
      if (modal && !modal.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Filter results based on query
  useEffect(() => {
    if (!query.trim()) {
      setResults(searchData)
      return
    }

    const lowerQuery = query.toLowerCase()
    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
    )
    setResults(filtered)
  }, [query])

  // Search button trigger (when modal is closed)
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 
                   hover:bg-white/10 hover:border-white/20 transition-all duration-200
                   text-sm text-white/60 hover:text-white/80"
        aria-label="Search (Cmd+K)"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-white/10 rounded-md">
          ⌘K
        </kbd>
      </button>
    )
  }

  // Full search modal (when open)
  return (
    <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div id="search-modal" className="relative w-full max-w-lg mx-4 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <svg className="w-5 h-5 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, features..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/40 text-base"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="px-3 py-1 text-sm text-white/40 hover:text-white transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-white/40">No results found for "{query}"</p>
              <p className="text-sm text-white/30 mt-1">Try different keywords</p>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                {results.map((result) => (
                  <a
                    key={result.title + result.href}
                    href={result.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 px-3 py-3 rounded-xl transition-colors duration-150 hover:bg-white/5"
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{result.title}</p>
                      <p className="text-sm text-white/50 mt-0.5 line-clamp-1">{result.description}</p>
                    </div>
                  </a>
                ))}
              </div>
              
              {/* Footer hint */}
              <div className="px-4 py-3 mt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-white/30">{results.length} results</span>
                <span className="text-xs text-white/30">ESC to close</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchModal
