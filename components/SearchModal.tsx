'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface SearchResult {
  title: string
  description: string
  href: string
  category: string
}

const searchData: SearchResult[] = [
  // Main pages
  { title: 'Home', description: 'SciMSPT - Scientific Multi-Agent System Platform', href: '/', category: 'Pages' },
  { title: 'MAOL', description: 'Multi-Agent Orchestration Layer - Core orchestration system', href: '/maol', category: 'Core' },
  { title: 'Neural Tracking', description: 'Real-time neural pathway visualization and tracking', href: '/neural-tracking', category: 'Visualization' },
  { title: 'Intelligence Graph', description: 'Knowledge graph visualization and analysis', href: '/intelligence-graph', category: 'Visualization' },
  { title: 'Emergent Behavior', description: 'Study emergent patterns in multi-agent systems', href: '/emergent-behavior', category: 'Research' },
  { title: 'Spatial UI', description: 'Spatial user interface with 3D interactions', href: '/spatial-ui', category: 'Interface' },
  { title: 'Plugin System', description: 'Extensible plugin architecture and marketplace', href: '/plugin-system', category: 'System' },
  { title: 'Auditability', description: 'Complete audit trail and transparency logs', href: '/auditability', category: 'Security' },
  
  // Features
  { title: 'Agent Communication', description: 'Inter-agent messaging protocols and patterns', href: '/maol#communication', category: 'Features' },
  { title: 'Task Distribution', description: 'Intelligent task allocation across agents', href: '/maol#tasks', category: 'Features' },
  { title: 'Real-time Monitoring', description: 'Live system metrics and health checks', href: '/neural-tracking#monitoring', category: 'Features' },
  { title: 'Pattern Recognition', description: 'AI-powered pattern detection algorithms', href: '/intelligence-graph#patterns', category: 'Features' },
  
  // Documentation
  { title: 'Getting Started', description: 'Quick start guide for new users', href: '/', category: 'Documentation' },
  { title: 'API Reference', description: 'Complete API documentation', href: '/plugin-system#api', category: 'Documentation' },
  { title: 'Architecture Guide', description: 'System architecture overview', href: '/maol#architecture', category: 'Documentation' },
]

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>(searchData)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

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
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Search filtering
  const filterResults = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      return searchData
    }
    
    const lowerQuery = searchQuery.toLowerCase()
    return searchData.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
    )
  }, [])

  const handleInputChange = (value: string) => {
    setQuery(value)
    setResults(filterResults(value))
    setSelectedIndex(0)
  }

  // Keyboard navigation within results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          window.location.href = results[selectedIndex].href
          setIsOpen(false)
        }
        break
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Pages': 'bg-violet-500/20 text-violet-300',
      'Core': 'bg-cyan-500/20 text-cyan-300',
      'Visualization': 'bg-emerald-500/20 text-emerald-300',
      'Research': 'bg-amber-500/20 text-amber-300',
      'Interface': 'bg-pink-500/20 text-pink-300',
      'System': 'bg-blue-500/20 text-blue-300',
      'Security': 'bg-red-500/20 text-red-300',
      'Features': 'bg-indigo-500/20 text-indigo-300',
      'Documentation': 'bg-slate-500/20 text-slate-300',
    }
    return colors[category] || 'bg-gray-500/20 text-gray-300'
  }

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
          <span className="text-xs">⌘</span>K
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
      <div 
        ref={modalRef}
        className="relative w-full max-w-lg mx-4 bg-slate-900/95 border border-white/10 
                   rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <svg className="w-5 h-5 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, features, documentation..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/40 text-base"
          />
          <kbd className="flex items-center gap-1 px-2 py-1 text-xs font-mono text-white/40 bg-white/10 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-white/40">No results found for &quot;{query}&quot;</p>
              <p className="text-sm text-white/30 mt-1">Try different keywords</p>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                {results.map((result, index) => (
                  <a
                    key={`${result.title}-${result.href}`}
                    href={result.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-start gap-3 px-3 py-3 rounded-xl transition-colors duration-150
                      ${index === selectedIndex 
                        ? 'bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-white/10' 
                        : 'hover:bg-white/5'
                      }
                    `}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className={`mt-0.5 p-1.5 rounded-lg ${getCategoryColor(result.category)}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white truncate">{result.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(result.category)}`}>
                          {result.category}
                        </span>
                      </div>
                      <p className="text-sm text-white/50 mt-0.5 line-clamp-1">{result.description}</p>
                    </div>
                  </a>
                ))}
              </div>
              
              {/* Footer hint */}
              <div className="flex items-center justify-between px-4 py-3 mt-2 border-t border-white/5">
                <div className="flex items-center gap-4 text-xs text-white/30">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑↓</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd> Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">esc</kbd> Close
                  </span>
                </div>
                <span className="text-xs text-white/30">{results.length} results</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchModal
