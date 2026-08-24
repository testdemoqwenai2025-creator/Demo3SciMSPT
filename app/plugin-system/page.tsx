'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Types
interface Plugin {
  id: string
  name: string
  description: string
  icon: string
  category: string
  rating: number
  reviews: number
  installs: string
  installCount: number
  version: string
  author: string
  size: string
  lastUpdated: string
  isPro: boolean
  isNew: boolean
  permissions: string[]
}

interface InstalledPlugin {
  id: string
  enabled: boolean
  installedAt: Date
  usageCount: number
}

// Sample Plugins Data
const samplePlugins: Plugin[] = [
  {
    id: 'data-exporter',
    name: 'Data Exporter',
    description: 'Export your data to CSV, JSON, Excel formats with customizable templates and scheduled exports.',
    icon: '📤',
    category: 'Productivity',
    rating: 4.8,
    reviews: 1247,
    installs: '12.4K',
    installCount: 12400,
    version: '2.1.0',
    author: 'SciMSPT Team',
    size: '2.4 MB',
    lastUpdated: '2024-01-15',
    isPro: false,
    isNew: false,
    permissions: ['read:data', 'write:exports', 'storage:local']
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Advanced metrics viewer with real-time charts, custom dashboards, and AI-powered insights.',
    icon: '📊',
    category: 'Analytics',
    rating: 4.9,
    reviews: 892,
    installs: '8.7K',
    installCount: 8700,
    version: '3.2.1',
    author: 'DataVision Labs',
    size: '5.8 MB',
    lastUpdated: '2024-01-18',
    isPro: true,
    isNew: false,
    permissions: ['read:analytics', 'read:metrics', 'read:reports']
  },
  {
    id: 'slack-integration',
    name: 'Slack Integration',
    description: 'Send notifications to Slack channels, receive commands, and automate workflows.',
    icon: '💬',
    category: 'Integration',
    rating: 4.7,
    reviews: 654,
    installs: '6.2K',
    installCount: 6200,
    version: '1.8.0',
    author: 'ConnectBot Inc',
    size: '1.9 MB',
    lastUpdated: '2024-01-10',
    isPro: false,
    isNew: false,
    permissions: ['write:notifications', 'read:channels', 'webhook:send']
  },
  {
    id: 'theme-editor',
    name: 'Theme Editor',
    description: 'Custom appearance editor with live preview, color pickers, and theme sharing.',
    icon: '🎨',
    category: 'UI',
    rating: 4.6,
    reviews: 423,
    installs: '4.1K',
    installCount: 4100,
    version: '2.0.3',
    author: 'UI Masters',
    size: '3.2 MB',
    lastUpdated: '2024-01-12',
    isPro: false,
    isNew: false,
    permissions: ['write:theme', 'read:preferences', 'storage:sync']
  },
  {
    id: 'auto-scheduler',
    name: 'Auto-Scheduler',
    description: 'Intelligent task scheduling automation with priority management and resource optimization.',
    icon: '⏰',
    category: 'Productivity',
    rating: 4.8,
    reviews: 567,
    installs: '3.8K',
    installCount: 3800,
    version: '1.5.2',
    author: 'TaskFlow Pro',
    size: '4.1 MB',
    lastUpdated: '2024-01-20',
    isPro: true,
    isNew: false,
    permissions: ['write:tasks', 'read:calendar', 'schedule:manage']
  },
  {
    id: 'audit-logger',
    name: 'Audit Logger',
    description: 'Enhanced audit trail with detailed logs, compliance reports, and anomaly detection.',
    icon: '📋',
    category: 'Analytics',
    rating: 4.9,
    reviews: 789,
    installs: '9.3K',
    installCount: 9300,
    version: '2.3.0',
    author: 'SecureTrack',
    size: '2.8 MB',
    lastUpdated: '2024-01-19',
    isPro: false,
    isNew: false,
    permissions: ['read:logs', 'read:audit', 'write:reports']
  },
  {
    id: 'api-rate-limiter',
    name: 'API Rate Limiter',
    description: 'Request throttling with configurable limits, burst handling, and analytics.',
    icon: '🛡️',
    category: 'Integration',
    rating: 4.5,
    reviews: 312,
    installs: '2.7K',
    installCount: 2700,
    version: '1.2.0',
    author: 'API Guard',
    size: '1.1 MB',
    lastUpdated: '2024-01-08',
    isPro: false,
    isNew: false,
    permissions: ['read:requests', 'write:limits', 'monitor:traffic']
  },
  {
    id: 'ml-model-manager',
    name: 'ML Model Manager',
    description: 'Model switching, A/B testing, performance monitoring, and automatic fallback.',
    icon: '🧠',
    category: 'AI/ML',
    rating: 4.7,
    reviews: 234,
    installs: '1.5K',
    installCount: 1500,
    version: '1.0.0',
    author: 'ML Ops Team',
    size: '6.4 MB',
    lastUpdated: '2024-01-22',
    isPro: false,
    isNew: true,
    permissions: ['read:models', 'write:predictions', 'train:models']
  }
]

const categories = ['All', 'Productivity', 'Analytics', 'Integration', 'UI', 'AI/ML']

export default function PluginSystemPage() {
  // State Management
  const [installedPlugins, setInstalledPlugins] = useState<Map<string, InstalledPlugin>>(new Map())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showPermissionModal, setShowPermissionModal] = useState<Plugin | null>(null)
  const [showConfigModal, setShowConfigModal] = useState<Plugin | null>(null)
  const [showUninstallModal, setShowUninstallModal] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'marketplace' | 'installed' | 'developer'>('marketplace')
  const [permissionsToGrant, setPermissionsToGrant] = useState<string[]>([])
  const [isInstalling, setIsInstalling] = useState(false)
  const [sortOrder, setSortOrder] = useState<'popular' | 'rating' | 'recent' | 'name'>('popular')

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('scimspt-installed-plugins')
    if (saved) {
      const parsed = JSON.parse(saved)
      setInstalledPlugins(new Map(Object.entries(parsed)))
    } else {
      // Pre-install some plugins for demo
      const preInstalled = new Map<string, InstalledPlugin>()
      preInstalled.set('data-exporter', { enabled: true, installedAt: new Date('2024-01-10'), usageCount: 47 })
      preInstalled.set('audit-logger', { enabled: true, installedAt: new Date('2024-01-08'), usageCount: 156 })
      preInstalled.set('theme-editor', { enabled: false, installedAt: new Date('2024-01-05'), usageCount: 23 })
      setInstalledPlugins(preInstalled)
    }
  }, [])

  // Save to localStorage when changed
  useEffect(() => {
    if (installedPlugins.size > 0) {
      const obj: Record<string, InstalledPlugin> = {}
      installedPlugins.forEach((v, k) => { obj[k] = v })
      localStorage.setItem('scimspt-installed-plugins', JSON.stringify(obj))
    }
  }, [installedPlugins])

  // Filtered & Sorted Plugins
  const filteredPlugins = samplePlugins
    .filter(plugin => {
      const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || plugin.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'rating': return b.rating - a.rating
        case 'recent': return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        case 'name': return a.name.localeCompare(b.name)
        default: return b.installCount - a.installCount
      }
    })

  const installedList = samplePlugins.filter(p => installedPlugins.has(p.id))

  // Handlers
  const handleInstallClick = (plugin: Plugin) => {
    setPermissionsToGrant([...plugin.permissions])
    setShowPermissionModal(plugin)
  }

  const handleConfirmInstall = () => {
    if (!showPermissionModal) return
    setIsInstalling(true)
    
    setTimeout(() => {
      setInstalledPlugins(prev => new Map(prev).set(showPermissionModal.id, {
        enabled: true,
        installedAt: new Date(),
        usageCount: 0
      }))
      setIsInstalling(false)
      setShowPermissionModal(null)
    }, 1500)
  }

  const handleUninstall = (pluginId: string) => {
    setInstalledPlugins(prev => {
      const next = new Map(prev)
      next.delete(pluginId)
      return next
    })
    setShowUninstallModal(null)
  }

  const togglePlugin = (pluginId: string) => {
    setInstalledPlugins(prev => {
      const next = new Map(prev)
      const current = next.get(pluginId)
      if (current) {
        next.set(pluginId, { ...current, enabled: !current.enabled })
      }
      return next
    })
  }

  // Stats calculations
  const freeLimit = 5
  const installedCount = installedPlugins.size
  const apiCallsUsed = 234
  const apiCallsLimit = 1000
  const storageUsed = 12
  const storageLimit = 50

  return (
    <div className="plugin-page">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-badge">
          <span className="badge-pulse"></span>
          <span className="badge-text">Secure Sandbox</span>
        </div>
        <h1>
          <span className="hero-icon">🔌</span>
          Plugin Marketplace
        </h1>
        <p className="hero-subtitle">
          Discover, install, and manage secure plugins with isolated iframe sandbox execution
          and granular permission control
        </p>
        
        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-value">{samplePlugins.length}</span>
            <span className="stat-label">Plugins</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">{installedCount}</span>
            <span className="stat-label">Installed</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">{categories.length - 1}</span>
            <span className="stat-label">Categories</span>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="tab-nav">
        <button 
          className={`tab-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
          onClick={() => setActiveTab('marketplace')}
        >
          <span className="tab-icon">🏪</span>
          Marketplace
        </button>
        <button 
          className={`tab-btn ${activeTab === 'installed' ? 'active' : ''}`}
          onClick={() => setActiveTab('installed')}
        >
          <span className="tab-icon">📦</span>
          Installed
          {installedCount > 0 && <span className="tab-badge">{installedCount}</span>}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'developer' ? 'active' : ''}`}
          onClick={() => setActiveTab('developer')}
        >
          <span className="tab-icon">🛠️</span>
          Developer
        </button>
      </nav>

      {/* Marketplace Tab */}
      {activeTab === 'marketplace' && (
        <section className="marketplace-section">
          {/* Search & Filters */}
          <div className="filters-bar">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="category-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="sort-controls">
              <label>Sort:</label>
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                className="sort-select"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="recent">Recently Updated</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="results-info">
            Showing <strong>{filteredPlugins.length}</strong> plugins
            {selectedCategory !== 'All' && <> in <strong>{selectedCategory}</strong></>}
            {searchQuery && <> matching &quot;<strong>{searchQuery}</strong>&quot;</>}
          </div>

          {/* Plugin Grid */}
          <div className="plugin-grid">
            {filteredPlugins.map(plugin => {
              const isInstalled = installedPlugins.has(plugin.id)
              const installedData = installedPlugins.get(plugin.id)
              
              return (
                <article key={plugin.id} className={`plugin-card ${isInstalled ? 'installed' : ''}`}>
                  {/* Card Header */}
                  <div className="card-header">
                    <div className="plugin-icon-wrapper">
                      <span className="plugin-icon">{plugin.icon}</span>
                      {plugin.isNew && <span className="new-badge">NEW</span>}
                    </div>
                    <div className="plugin-meta-badges">
                      {plugin.isPro && <span className="pro-badge">PRO</span>}
                      <span className="category-badge">{plugin.category}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body">
                    <h3 className="plugin-name">{plugin.name}</h3>
                    <p className="plugin-desc">{plugin.description}</p>
                    
                    {/* Rating */}
                    <div className="rating-row">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star ${i < Math.floor(plugin.rating) ? 'filled' : ''}`}>
                            ★
                          </span>
                        ))}
                        <span className="rating-num">{plugin.rating}</span>
                      </div>
                      <span className="review-count">({plugin.reviews.toLocaleString()})</span>
                    </div>

                    {/* Meta Info */}
                    <div className="meta-row">
                      <span className="meta-item" title="Version">v{plugin.version}</span>
                      <span className="meta-sep">•</span>
                      <span className="meta-item" title="Size">{plugin.size}</span>
                      <span className="meta-sep">•</span>
                      <span className="meta-item" title="Installs">↓ {plugin.installs}</span>
                    </div>

                    <div className="author-row">
                      <span className="author-avatar">👤</span>
                      <span className="author-name">{plugin.author}</span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer">
                    {isInstalled ? (
                      <div className="installed-actions">
                        <button 
                          className={`toggle-btn ${installedData?.enabled ? 'enabled' : ''}`}
                          onClick={() => togglePlugin(plugin.id)}
                        >
                          {installedData?.enabled ? '● Enabled' : '○ Disabled'}
                        </button>
                        <button 
                          className="config-btn"
                          onClick={() => setShowConfigModal(plugin)}
                        >
                          ⚙️ Configure
                        </button>
                        <button 
                          className="uninstall-btn"
                          onClick={() => setShowUninstallModal(plugin.id)}
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="install-btn"
                        onClick={() => handleInstallClick(plugin)}
                      >
                        {plugin.isPro && <span className="pro-lock">🔒</span>}
                        Install Plugin
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

          {filteredPlugins.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <h3>No plugins found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </section>
      )}

      {/* Installed Tab */}
      {activeTab === 'installed' && (
        <section className="installed-section">
          {/* Usage Limits Panel */}
          <div className="usage-panel">
            <div className="usage-header">
              <h3><span className="usage-icon">📊</span> Usage & Limits</h3>
              <span className="status-badge in-progress">In Progress • 75%</span>
            </div>
            
            <div className="progress-section">
              <div className="progress-item">
                <div className="progress-label">
                  <span>Free Tier Progress</span>
                  <span className="progress-value">75%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>

            <div className="limits-grid">
              <div className="limit-card">
                <div className="limit-icon">🔌</div>
                <div className="limit-info">
                  <span className="limit-current">{installedCount}</span>
                  <span className="limit-sep">/</span>
                  <span className="limit-max">{freeLimit} free</span>
                </div>
                <span className="limit-label">Plugins Installed</span>
                <div className="limit-bar">
                  <div className="limit-fill" style={{ width: `${(installedCount / freeLimit) * 100}%` }}></div>
                </div>
              </div>

              <div className="limit-card">
                <div className="limit-icon">📡</div>
                <div className="limit-info">
                  <span className="limit-current">{apiCallsUsed}</span>
                  <span className="limit-sep">/</span>
                  <span className="limit-max">{apiCallsLimit.toLocaleString()}</span>
                </div>
                <span className="limit-label">API Calls Daily</span>
                <div className="limit-bar">
                  <div className="limit-fill" style={{ width: `${(apiCallsUsed / apiCallsLimit) * 100}%` }}></div>
                </div>
              </div>

              <div className="limit-card">
                <div className="limit-icon">💾</div>
                <div className="limit-info">
                  <span className="limit-current">{storageUsed}MB</span>
                  <span className="limit-sep">/</span>
                  <span className="limit-max">{storageLimit}MB</span>
                </div>
                <span className="limit-label">Storage Used</span>
                <div className="limit-bar">
                  <div className="limit-fill" style={{ width: `${(storageUsed / storageLimit) * 100}%` }}></div>
                </div>
              </div>
            </div>

            <a 
              href="https://github.com/sponsors/testdemoqwenai2025-creator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="upgrade-btn"
            >
              ⭐ Upgrade to PRO for Unlimited Access
            </a>
          </div>

          {/* Installed Plugins List */}
          <div className="installed-list-header">
            <h3><span className="list-icon">📦</span> Your Plugins ({installedList.length})</h3>
          </div>

          {installedList.length > 0 ? (
            <div className="installed-grid">
              {installedList.map(plugin => {
                const data = installedPlugins.get(plugin.id)!
                
                return (
                  <article key={plugin.id} className="installed-card">
                    <div className="installed-card-header">
                      <span className="installed-plugin-icon">{plugin.icon}</span>
                      <div className="installed-plugin-info">
                        <h4>{plugin.name}</h4>
                        <span className="installed-version">v{plugin.version} • {plugin.author}</span>
                      </div>
                      <div className={`status-indicator ${data.enabled ? 'active' : 'inactive'}`}>
                        {data.enabled ? 'Active' : 'Inactive'}
                      </div>
                    </div>

                    <div className="installed-stats">
                      <div className="stat">
                        <span className="stat-label">Usage</span>
                        <span className="stat-val">{data.usageCount} calls</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Installed</span>
                        <span className="stat-val">{new Date(data.installedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Size</span>
                        <span className="stat-val">{plugin.size}</span>
                      </div>
                    </div>

                    <div className="installed-actions-row">
                      <button 
                        className={`action-toggle ${data.enabled ? 'on' : 'off'}`}
                        onClick={() => togglePlugin(plugin.id)}
                      >
                        {data.enabled ? 'Disable' : 'Enable'}
                      </button>
                      <button 
                        className="action-config"
                        onClick={() => setShowConfigModal(plugin)}
                      >
                        Settings
                      </button>
                      <button 
                        className="action-uninstall"
                        onClick={() => setShowUninstallModal(plugin.id)}
                      >
                        Uninstall
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="empty-installed">
              <span className="empty-icon">📭</span>
              <h3>No plugins installed yet</h3>
              <p>Browse the marketplace to discover useful plugins</p>
              <button 
                className="browse-btn"
                onClick={() => setActiveTab('marketplace')}
              >
                Browse Marketplace →
              </button>
            </div>
          )}
        </section>
      )}

      {/* Developer Tab */}
      {activeTab === 'developer' && (
        <section className="developer-section">
          {/* Getting Started */}
          <div className="dev-intro">
            <h2><span className="section-icon">🚀</span> Build Your Own Plugin</h2>
            <p>Create powerful extensions for SciMSPT using our secure plugin architecture.</p>
          </div>

          {/* Manifest Format */}
          <div className="code-block-container">
            <div className="code-header">
              <span className="code-title">plugin.json — Plugin Manifest</span>
              <span className="copy-hint">Required format</span>
            </div>
            <pre className="code-block">
{`{
  "name": "my-awesome-plugin",
  "version": "1.0.0",
  "description": "A brief description of what your plugin does",
  "icon": "✨",
  "author": {
    "name": "Your Name",
    "email": "you@example.com",
    "url": "https://yourwebsite.com"
  },
  "entry": "index.js",
  "permissions": [
    "read:data",
    "write:preferences"
  ],
  "sandbox": {
    "allowScripts": true,
    "allowForms": false,
    "allowPopups": false,
    "csp": "default-src 'self'"
  },
  "configSchema": {
    "apiKey": { "type": "string", "required": true },
    "theme": { "type": "enum", "options": ["light", "dark"] }
  },
  "minPlatformVersion": "2.0.0"
}`}
            </pre>
          </div>

          {/* API Methods */}
          <div className="api-methods">
            <h3><span className="section-icon">📚</span> Available API Methods</h3>
            
            <div className="methods-grid">
              <div className="method-card">
                <code className="method-name">host.getData()</code>
                <p className="method-desc">Read data from the host application with proper permission checks</p>
                <span className="method-perm">Requires: read:data</span>
              </div>
              
              <div className="method-card">
                <code className="method-name">host.setData()</code>
                <p className="method-desc">Write data back to the host with validation and sanitization</p>
                <span className="method-perm">Requires: write:data</span>
              </div>
              
              <div className="method-card">
                <code className="method-name">host.emit()</code>
                <p className="method-desc">Emit events that other plugins or the host can listen to</p>
                <span className="method-perm">Requires: events:emit</span>
              </div>
              
              <div className="method-card">
                <code className="method-name">host.on()</code>
                <p className="method-desc">Listen for host events like data changes, user actions</p>
                <span className="method-perm">Requires: events:listen</span>
              </div>
              
              <div className="method-card">
                <code className="method-name">host.storage()</code>
                <p className="method-desc">Access isolated plugin storage sandboxed from other plugins</p>
                <span className="method-perm">Requires: storage:local</span>
              </div>
              
              <div className="method-card">
                <code className="method-name">host.ui()</code>
                <p className="method-desc">Render UI components within the host&apos;s designated areas</p>
                <span className="method-perm">Requires: ui:render</span>
              </div>
            </div>
          </div>

          {/* Security Visualization */}
          <div className="security-viz">
            <h3><span className="section-icon">🛡️</span> Sandbox Security Architecture</h3>
            
            <div className="sandbox-diagram">
              <div className="diagram-layer host-layer">
                <span className="layer-label">Host Application (Main Thread)</span>
                <div className="layer-content">
                  <div className="host-component">Core App</div>
                  <div className="host-component">API Gateway</div>
                  <div className="host-component">Permission Manager</div>
                </div>
              </div>
              
              <div className="diagram-boundary">
                <span className="boundary-label">Sandbox Boundary (iframe + CSP)</span>
                <div className="boundary-details">
                  <span className="security-tag">sandbox=&quot;allow-scripts&quot;</span>
                  <span className="security-tag">CSP enforced</span>
                  <span className="security-tag">Origin isolation</span>
                </div>
              </div>
              
              <div className="diagram-layer plugin-layer">
                <span className="layer-label">Plugin Execution Context</span>
                <div className="layer-content">
                  <div className="plugin-instance">
                    <span className="instance-icon">🔌</span>
                    <span>Plugin A</span>
                  </div>
                  <div className="plugin-instance">
                    <span className="instance-icon">🔌</span>
                    <span>Plugin B</span>
                  </div>
                  <div className="plugin-instance">
                    <span className="instance-icon">🔌</span>
                    <span>Plugin C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CSP Headers Example */}
            <div className="csp-example">
              <h4>Content Security Policy Headers</h4>
              <pre className="csp-code">
{`Content-Security-Policy: 
  default-src 'none';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';`}
              </pre>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="submit-section">
            <h3>Ready to Publish?</h3>
            <p>Submit your plugin for review and join the SciMSPT ecosystem.</p>
            <div className="submit-actions">
              <a 
                href="https://github.com/sponsors/testdemoqwenai2025-creator" 
                target="_blank" 
                rel="noopener noreferrer"
                className="submit-btn primary"
              >
                📤 Submit Plugin
              </a>
              <a 
                href="#" 
                className="submit-btn secondary"
              >
                📖 View Documentation
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="modal-overlay" onClick={() => !isInstalling && setShowPermissionModal(null)}>
          <div className="modal-content permission-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-icon">{showPermissionModal.icon}</span>
              <div>
                <h3>Install {showPermissionModal.name}?</h3>
                <p>This plugin requests the following permissions:</p>
              </div>
            </div>

            <div className="permissions-list">
              {showPermissionModal.permissions.map(perm => (
                <label key={perm} className="permission-item">
                  <input
                    type="checkbox"
                    checked={permissionsToGrant.includes(perm)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPermissionsToGrant([...permissionsToGrant, perm])
                      } else {
                        setPermissionsToGrant(permissionsToGrant.filter(p => p !== perm))
                      }
                    }}
                  />
                  <div className="permission-info">
                    <code className="perm-name">{perm}</code>
                    <span className="perm-desc">
                      {perm.includes('read') && 'Allow reading data'}
                      {perm.includes('write') && 'Allow writing data'}
                      {perm.includes('storage') && 'Allow local storage access'}
                      {perm.includes('webhook') && 'Allow external webhooks'}
                      {perm.includes('schedule') && 'Allow task scheduling'}
                      {perm.includes('monitor') && 'Allow traffic monitoring'}
                      {perm.includes('train') && 'Allow model training'}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="modal-actions">
              <button 
                className="modal-btn cancel" 
                onClick={() => setShowPermissionModal(null)}
                disabled={isInstalling}
              >
                Cancel
              </button>
              <button 
                className="modal-btn confirm" 
                onClick={handleConfirmInstall}
                disabled={isInstalling || permissionsToGrant.length === 0}
              >
                {isInstalling ? (
                  <>
                    <span className="spinner"></span>
                    Installing...
                  </>
                ) : (
                  `Grant ${permissionsToGrant.length} Permission${permissionsToGrant.length > 1 ? 's' : ''} & Install`
                )}
              </button>
            </div>

            <div className="modal-warning">
              <span className="warning-icon">⚠️</span>
              Only grant permissions you trust. Plugins run in an isolated sandbox.
            </div>
          </div>
        </div>
      )}

      {/* Config Modal */}
      {showConfigModal && (
        <div className="modal-overlay" onClick={() => setShowConfigModal(null)}>
          <div className="modal-content config-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-icon">{showConfigModal.icon}</span>
              <div>
                <h3>{showConfigModal.name} Settings</h3>
                <p>Configure plugin behavior and preferences</p>
              </div>
            </div>

            <div className="config-form">
              <div className="form-group">
                <label>Plugin Status</label>
                <div className="toggle-switch">
                  <span>{installedPlugins.get(showConfigModal.id)?.enabled ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
              
              <div className="form-group">
                <label>Auto-start on Launch</label>
                <input type="checkbox" defaultChecked className="form-checkbox" />
              </div>
              
              <div className="form-group">
                <label>Log Level</label>
                <select className="form-select">
                  <option>Error</option>
                  <option selected>Warning</option>
                  <option>Info</option>
                  <option>Debug</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Resource Priority</label>
                <input type="range" min="1" max="5" defaultValue="3" className="form-range" />
              </div>
              
              <div className="form-group">
                <label>API Key (if required)</label>
                <input type="password" placeholder="••••••••" className="form-input" />
              </div>
            </div>

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowConfigModal(null)}>
                Close
              </button>
              <button className="modal-btn confirm" onClick={() => setShowConfigModal(null)}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Uninstall Confirmation Modal */}
      {showUninstallModal && (
        <div className="modal-overlay" onClick={() => setShowUninstallModal(null)}>
          <div className="modal-content uninstall-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header danger">
              <span className="modal-icon">🗑️</span>
              <div>
                <h3>Uninstall Plugin?</h3>
                <p>This action cannot be undone. All plugin data will be removed.</p>
              </div>
            </div>

            <div className="uninstall-warning">
              <p>Are you sure you want to uninstall <strong>{samplePlugins.find(p => p.id === showUninstallModal)?.name}</strong>?</p>
            </div>

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowUninstallModal(null)}>
                Keep Installed
              </button>
              <button 
                className="modal-btn danger" 
                onClick={() => handleUninstall(showUninstallModal!)}
              >
                Yes, Uninstall
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <footer className="page-footer">
        <Link href="/" className="footer-btn outline">
          ← Back to Overview
        </Link>
        <Link href="/maol" className="footer-btn outline">
          View MAOL →
        </Link>
      </footer>

      <style jsx>{`
        /* Base Styles */
        .plugin-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
          color: #e2e8f0;
          animation: fadeInUp 0.5s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Hero Section */
        .page-hero {
          text-align: center;
          padding: 3rem 1.5rem 2rem;
          background: linear-gradient(180deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%);
          border-bottom: 1px solid rgba(245, 158, 11, 0.2);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 9999px;
          margin-bottom: 1rem;
        }

        .badge-pulse {
          width: 8px;
          height: 8px;
          background: #f59e0b;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .badge-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: #f59e0b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .page-hero h1 {
          font-size: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 1rem 0;
          background: linear-gradient(135deg, #fff 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-icon {
          font-size: 3rem;
          -webkit-text-fill-color: initial;
        }

        .hero-subtitle {
          color: #94a3b8;
          max-width: 700px;
          margin: 0 auto 1.5rem;
          line-height: 1.6;
        }

        .quick-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #f59e0b;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
        }

        /* Tab Navigation */
        .tab-nav {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          color: #e2e8f0;
          background: rgba(255, 255, 255, 0.05);
        }

        .tab-btn.active {
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
          border-color: rgba(245, 158, 11, 0.3);
        }

        .tab-icon {
          font-size: 1.1rem;
        }

        .tab-badge {
          padding: 0.125rem 0.5rem;
          background: #f59e0b;
          color: #000;
          font-size: 0.7rem;
          font-weight: 700;
          border-radius: 9999px;
        }

        /* Marketplace Section */
        .marketplace-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        /* Filters Bar */
        .filters-bar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
        }

        .search-box {
          position: relative;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.1rem;
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          color: #e2e8f0;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }

        .search-input::placeholder {
          color: #64748b;
        }

        .category-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .cat-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          color: #94a3b8;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cat-btn:hover {
          border-color: rgba(245, 158, 11, 0.5);
          color: #e2e8f0;
        }

        .cat-btn.active {
          background: rgba(245, 158, 11, 0.15);
          border-color: #f59e0b;
          color: #f59e0b;
        }

        .sort-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sort-controls label {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .sort-select {
          padding: 0.5rem 1rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: #e2e8f0;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .results-info {
          color: #64748b;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        /* Plugin Grid */
        .plugin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .plugin-card {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: cardFadeIn 0.4s ease-out;
        }

        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .plugin-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px rgba(245, 158, 11, 0.1);
          border-color: rgba(245, 158, 11, 0.2);
        }

        .plugin-card.installed {
          border-color: rgba(34, 197, 94, 0.3);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.25rem 1.25rem 0;
        }

        .plugin-icon-wrapper {
          position: relative;
        }

        .plugin-icon {
          font-size: 2.5rem;
          display: block;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .new-badge {
          position: absolute;
          top: -4px;
          right: -8px;
          padding: 0.125rem 0.5rem;
          background: #22c55e;
          color: #000;
          font-size: 0.625rem;
          font-weight: 800;
          border-radius: 9999px;
          text-transform: uppercase;
        }

        .plugin-meta-badges {
          display: flex;
          gap: 0.5rem;
        }

        .pro-badge {
          padding: 0.25rem 0.625rem;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #000;
          font-size: 0.625rem;
          font-weight: 800;
          border-radius: 0.375rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .category-badge {
          padding: 0.25rem 0.625rem;
          background: rgba(99, 102, 241, 0.2);
          color: #818cf8;
          font-size: 0.625rem;
          font-weight: 600;
          border-radius: 0.375rem;
          text-transform: uppercase;
        }

        .card-body {
          padding: 1rem 1.25rem;
        }

        .plugin-name {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #fff;
        }

        .plugin-desc {
          font-size: 0.8125rem;
          color: #94a3b8;
          line-height: 1.5;
          margin-bottom: 0.875rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .stars {
          display: flex;
          align-items: center;
          gap: 0.125rem;
        }

        .star {
          color: #334155;
          font-size: 0.875rem;
        }

        .star.filled {
          color: #f59e0b;
        }

        .rating-num {
          font-weight: 600;
          color: #f59e0b;
          margin-left: 0.25rem;
        }

        .review-count {
          font-size: 0.75rem;
          color: #64748b;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 0.75rem;
        }

        .meta-sep {
          color: #334155;
        }

        .author-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #64748b;
        }

        .author-avatar {
          font-size: 1rem;
        }

        .card-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .install-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border: none;
          border-radius: 0.5rem;
          color: #000;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .install-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);
        }

        .pro-lock {
          font-size: 0.75rem;
        }

        .installed-actions {
          display: flex;
          gap: 0.5rem;
        }

        .toggle-btn {
          flex: 1;
          padding: 0.5rem 0.75rem;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 0.375rem;
          color: #22c55e;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toggle-btn:not(.enabled) {
          background: rgba(100, 116, 139, 0.15);
          border-color: rgba(100, 116, 139, 0.3);
          color: #94a3b8;
        }

        .config-btn {
          padding: 0.5rem 0.75rem;
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 0.375rem;
          color: #818cf8;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .uninstall-btn {
          padding: 0.5rem 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 0.375rem;
          color: #ef4444;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .uninstall-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .empty-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        /* Installed Section */
        .installed-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .usage-panel {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .usage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .usage-header h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.125rem;
        }

        .status-badge {
          padding: 0.375rem 0.875rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.in-progress {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .progress-section {
          margin-bottom: 1.5rem;
        }

        .progress-item {
          margin-bottom: 0.75rem;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .progress-value {
          color: #f59e0b;
          font-weight: 600;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
          border-radius: 9999px;
          transition: width 0.5s ease;
        }

        .limits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .limit-card {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 0.75rem;
          padding: 1rem;
          text-align: center;
        }

        .limit-icon {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .limit-info {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .limit-current {
          color: #f59e0b;
        }

        .limit-max {
          color: #64748b;
          font-size: 0.875rem;
        }

        .limit-label {
          display: block;
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        .limit-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 9999px;
          overflow: hidden;
        }

        .limit-fill {
          height: 100%;
          background: #f59e0b;
          border-radius: 9999px;
        }

        .upgrade-btn {
          display: block;
          text-align: center;
          padding: 1rem;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #000;
          font-weight: 600;
          border-radius: 0.75rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .upgrade-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);
        }

        .installed-list-header {
          margin-bottom: 1rem;
        }

        .installed-list-header h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.125rem;
        }

        .installed-grid {
          display: grid;
          gap: 1rem;
        }

        .installed-card {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 1rem;
          padding: 1.25rem;
          transition: all 0.2s ease;
        }

        .installed-card:hover {
          border-color: rgba(34, 197, 94, 0.4);
        }

        .installed-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .installed-plugin-icon {
          font-size: 2rem;
        }

        .installed-plugin-info {
          flex: 1;
        }

        .installed-plugin-info h4 {
          font-size: 1rem;
          margin-bottom: 0.125rem;
        }

        .installed-version {
          font-size: 0.75rem;
          color: #64748b;
        }

        .status-indicator {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-indicator.active {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }

        .status-indicator.inactive {
          background: rgba(100, 116, 139, 0.15);
          color: #94a3b8;
        }

        .installed-stats {
          display: flex;
          gap: 2rem;
          padding: 1rem;
          background: rgba(15, 23, 42, 0.5);
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }

        .installed-stats .stat {
          display: flex;
          flex-direction: column;
        }

        .installed-stats .stat-label {
          font-size: 0.7rem;
          color: #64748b;
          text-transform: uppercase;
        }

        .installed-stats .stat-val {
          font-size: 0.875rem;
          font-weight: 600;
          color: #e2e8f0;
        }

        .installed-actions-row {
          display: flex;
          gap: 0.75rem;
        }

        .action-toggle {
          flex: 1;
          padding: 0.625rem 1rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-toggle.on {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }

        .action-toggle.off {
          background: rgba(100, 116, 139, 0.15);
          color: #94a3b8;
        }

        .action-config {
          padding: 0.625rem 1rem;
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 0.5rem;
          color: #818cf8;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .action-uninstall {
          padding: 0.625rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 0.5rem;
          color: #ef4444;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .empty-installed {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .browse-btn {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 0.5rem;
          color: #f59e0b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        /* Developer Section */
        .developer-section {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .dev-intro {
          text-align: center;
          margin-bottom: 2rem;
        }

        .dev-intro h2 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .section-icon {
          font-size: 1.25rem;
        }

        .dev-intro p {
          color: #94a3b8;
        }

        .code-block-container {
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          overflow: hidden;
        }

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.875rem 1.25rem;
          background: rgba(30, 41, 59, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .code-title {
          font-family: monospace;
          font-size: 0.875rem;
          color: #f59e0b;
        }

        .copy-hint {
          font-size: 0.75rem;
          color: #64748b;
        }

        .code-block {
          padding: 1.25rem;
          background: rgba(15, 23, 42, 0.95);
          font-family: 'Fira Code', 'JetBrains Mono', monospace;
          font-size: 0.8125rem;
          line-height: 1.6;
          color: #e2e8f0;
          overflow-x: auto;
          white-space: pre;
        }

        .api-methods {
          margin-bottom: 2rem;
        }

        .api-methods h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }

        .methods-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .method-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 0.75rem;
          padding: 1.25rem;
          transition: all 0.2s ease;
        }

        .method-card:hover {
          border-color: rgba(245, 158, 11, 0.3);
        }

        .method-name {
          display: block;
          font-family: 'Fira Code', monospace;
          font-size: 0.9375rem;
          color: #f59e0b;
          margin-bottom: 0.5rem;
        }

        .method-desc {
          font-size: 0.8125rem;
          color: #94a3b8;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }

        .method-perm {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
          font-size: 0.7rem;
          font-family: monospace;
          border-radius: 0.25rem;
        }

        /* Security Visualization */
        .security-viz {
          margin-bottom: 2rem;
        }

        .security-viz h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }

        .sandbox-diagram {
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .diagram-layer {
          padding: 1rem;
          border-radius: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .host-layer {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .plugin-layer {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .layer-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
          color: #94a3b8;
        }

        .host-layer .layer-label {
          color: #22c55e;
        }

        .plugin-layer .layer-label {
          color: #f59e0b;
        }

        .layer-content {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .host-component {
          padding: 0.5rem 1rem;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 0.5rem;
          font-size: 0.8125rem;
          color: #22c55e;
        }

        .plugin-instance {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 0.5rem;
          font-size: 0.8125rem;
          color: #f59e0b;
        }

        .instance-icon {
          font-size: 1rem;
        }

        .diagram-boundary {
          padding: 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 2px dashed rgba(239, 68, 68, 0.4);
          border-radius: 0.75rem;
          text-align: center;
          margin: 0.75rem 0;
        }

        .boundary-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #ef4444;
          margin-bottom: 0.75rem;
        }

        .boundary-details {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .security-tag {
          padding: 0.25rem 0.625rem;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 0.25rem;
          font-size: 0.7rem;
          font-family: monospace;
          color: #fca5a5;
        }

        .csp-example {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 0.75rem;
          overflow: hidden;
        }

        .csp-example h4 {
          padding: 0.875rem 1.25rem;
          background: rgba(30, 41, 59, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.875rem;
          color: #94a3b8;
        }

        .csp-code {
          padding: 1.25rem;
          background: rgba(15, 23, 42, 0.95);
          font-family: 'Fira Code', monospace;
          font-size: 0.75rem;
          line-height: 1.6;
          color: #94a3b8;
          overflow-x: auto;
          white-space: pre;
        }

        /* Submit Section */
        .submit-section {
          text-align: center;
          padding: 2.5rem;
          background: linear-gradient(145deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.02));
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 1rem;
        }

        .submit-section h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .submit-section p {
          color: #94a3b8;
          margin-bottom: 1.5rem;
        }

        .submit-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .submit-btn {
          padding: 0.875rem 1.75rem;
          border-radius: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .submit-btn.primary {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #000;
        }

        .submit-btn.primary:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);
        }

        .submit-btn.secondary {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #e2e8f0;
        }

        .submit-btn.secondary:hover {
          border-color: rgba(255, 255, 255, 0.4);
        }

        /* Modals */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          width: 100%;
          max-width: 520px;
          background: linear-gradient(145deg, #1e293b, #0f172a);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          overflow: hidden;
          animation: modalSlideIn 0.3s ease;
        }

        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .modal-header.danger {
          border-bottom-color: rgba(239, 68, 68, 0.2);
        }

        .modal-icon {
          font-size: 2.5rem;
        }

        .modal-header h3 {
          font-size: 1.125rem;
          margin-bottom: 0.25rem;
        }

        .modal-header p {
          font-size: 0.875rem;
          color: #94a3b8;
        }

        .permissions-list {
          padding: 1rem 1.5rem;
          max-height: 280px;
          overflow-y: auto;
        }

        .permission-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.875rem;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .permission-item:hover {
          border-color: rgba(245, 158, 11, 0.2);
        }

        .permission-item input[type="checkbox"] {
          margin-top: 0.25rem;
          accent-color: #f59e0b;
          width: 16px;
          height: 16px;
        }

        .permission-info {
          flex: 1;
        }

        .perm-name {
          display: block;
          font-family: 'Fira Code', monospace;
          font-size: 0.8125rem;
          color: #f59e0b;
          margin-bottom: 0.25rem;
        }

        .perm-desc {
          font-size: 0.75rem;
          color: #64748b;
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .modal-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-btn.cancel {
          background: rgba(100, 116, 139, 0.15);
          color: #94a3b8;
        }

        .modal-btn.cancel:hover {
          background: rgba(100, 116, 139, 0.25);
        }

        .modal-btn.confirm {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #000;
        }

        .modal-btn.confirm:hover:not(:disabled) {
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
        }

        .modal-btn.confirm:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-btn.danger {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .modal-btn.danger:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0, 0, 0, 0.3);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 0.5rem;
          vertical-align: middle;
        }

        .modal-warning {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: rgba(245, 158, 11, 0.1);
          border-top: 1px solid rgba(245, 158, 11, 0.2);
          font-size: 0.8125rem;
          color: #fbbf24;
        }

        .warning-icon {
          font-size: 1rem;
        }

        /* Config Modal Specific */
        .config-form {
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.875rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .toggle-switch {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .form-input,
        .form-select {
          padding: 0.625rem 0.875rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: #e2e8f0;
          font-size: 0.875rem;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #f59e0b;
        }

        .form-range {
          accent-color: #f59e0b;
        }

        .form-checkbox {
          width: 18px;
          height: 18px;
          accent-color: #f59e0b;
        }

        /* Uninstall Modal */
        .uninstall-warning {
          padding: 1.25rem 1.5rem;
        }

        .uninstall-warning p {
          color: #94a3b8;
          font-size: 0.9375rem;
        }

        .uninstall-warning strong {
          color: #e2e8f0;
        }

        /* Footer */
        .page-footer {
          display: flex;
          justify-content: space-between;
          padding: 2rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          margin-top: 3rem;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }

        .footer-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .footer-btn.outline {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #94a3b8;
        }

        .footer-btn.outline:hover {
          border-color: #f59e0b;
          color: #f59e0b;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .page-hero h1 {
            font-size: 1.75rem;
            flex-direction: column;
            gap: 0.5rem;
          }

          .hero-subtitle {
            font-size: 0.9375rem;
          }

          .plugin-grid {
            grid-template-columns: 1fr;
          }

          .filters-bar {
            padding: 1rem;
          }

          .category-filters {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 0.5rem;
          }

          .tab-nav {
            overflow-x: auto;
            justify-content: flex-start;
          }

          .installed-stats {
            flex-direction: column;
            gap: 0.75rem;
          }

          .installed-actions-row {
            flex-direction: column;
          }

          .page-footer {
            flex-direction: column;
            gap: 1rem;
          }

          .page-footer .footer-btn {
            text-align: center;
          }

          .limits-grid {
            grid-template-columns: 1fr;
          }

          .methods-grid {
            grid-template-columns: 1fr;
          }

          .modal-actions {
            flex-direction: column;
          }

          .installed-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
