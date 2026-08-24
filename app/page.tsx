'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { PillarCard } from '@/components/PillarCard'
import { DiagramGallery } from '@/components/DiagramGallery'
import { DashboardCharts } from '@/components/Charts'
import { APIDemoPanel } from '@/components/APIDemo'
import Link from 'next/link'

/**
 * Home Page - SciMSPT Phase 3 AI-Native Architecture
 * 
 * Enterprise-grade dashboard with live status indicators,
 * real-time activity feed, interactive pillar cards, and
 * client metrics visualization.
 * 
 * @version 2026.08.24.1530 - Production Deployment
 */

// ============ TYPES ============
interface ActivityEvent {
  id: number
  agent: string
  action: string
  target: string
  timestamp: Date
  type: 'success' | 'info' | 'warning' | 'processing'
}

interface PillarData {
  id: string
  name: string
  fullName: string
  icon: string
  description: string
  status: 'In Progress' | 'Complete' | 'Designed'
  href: string
  features: string[]
  progress: number
  health: 'excellent' | 'good' | 'developing'
  lastUpdate: string
}

// ============ SYNTHETIC DATA ============
const pillars: PillarData[] = [
  {
    id: 'maol',
    name: 'MAOL',
    fullName: 'Multi-Agent Orchestrator Layer',
    icon: '🧠',
    description: 'Central nervous system coordinating multiple specialized AI agents for intelligent task orchestration',
    status: 'In Progress',
    href: '/maol',
    features: ['Intent Router', 'Task Planner', 'Context Manager', 'Memory Synthesizer'],
    progress: 87,
    health: 'excellent',
    lastUpdate: '2 min ago',
  },
  {
    id: 'neural-tracking',
    name: 'Neural Tracking',
    fullName: 'Behavior Intelligence System',
    icon: '🔮',
    description: 'Privacy-first user intelligence with on-device TensorFlow.js processing and zero data export',
    status: 'In Progress',
    href: '/neural-tracking',
    features: ['On-device ML', 'Privacy by Design', 'Behavioral Patterns', 'Zero Exfiltration'],
    progress: 72,
    health: 'good',
    lastUpdate: '15 min ago',
  },
  {
    id: 'spatial-ui',
    name: 'Spatial UI',
    fullName: 'Immersive Interface Components',
    icon: '🎨',
    description: 'Three.js & WebGPU powered 3D interfaces breaking free from flat design limitations',
    status: 'In Progress',
    href: '/spatial-ui',
    features: ['Three.js Rendering', 'WebGPU Compute', 'Spatial Navigation', '60fps Target'],
    progress: 64,
    health: 'developing',
    lastUpdate: '1 hour ago',
  },
  {
    id: 'plugin-system',
    name: 'Plugin System',
    fullName: 'Secure Extensible Ecosystem',
    icon: '🔌',
    description: 'Isolated iframe sandbox execution with granular permission scopes for safe extensibility',
    status: 'In Progress',
    href: '/plugin-system',
    features: ['Sandbox Isolation', 'Permission Scopes', 'API Gateway', 'Manifest Validation'],
    progress: 58,
    health: 'developing',
    lastUpdate: '3 hours ago',
  },
  {
    id: 'intelligence-graph',
    name: 'Intelligence Graph',
    fullName: 'Semantic Knowledge Network',
    icon: '🕸️',
    description: 'Unified semantic knowledge network with vector embeddings and entity relationship mapping',
    status: 'In Progress',
    href: '/intelligence-graph',
    features: ['Vector Embeddings', 'Entity Relations', 'Query Understanding', 'Continuous Evolution'],
    progress: 79,
    health: 'good',
    lastUpdate: '45 min ago',
  },
  {
    id: 'emergent-behavior',
    name: 'Emergent Behavior',
    fullName: 'Self-Optimization Engine',
    icon: '🔄',
    description: 'Autonomous system improvement through continuous learning feedback loops and pattern discovery',
    status: 'In Progress',
    href: '/emergent-behavior',
    features: ['Feedback Loops', 'Adaptive Strategies', 'Pattern Discovery', 'Self-Tuning'],
    progress: 45,
    health: 'developing',
    lastUpdate: '5 hours ago',
  },
  {
    id: 'auditability',
    name: 'Auditability & Traceability',
    fullName: 'Immutable Audit Trail System',
    icon: '🔍',
    description: 'Cryptographically secured reasoning logs enabling complete traceability of agent decision paths with regulatory compliance',
    status: 'In Progress',
    href: '/auditability',
    features: ['Hash Chain Immutability', 'Decision Path Tracing', 'ML Anomaly Detection', 'GDPR/SOC2 Compliant'],
    progress: 91,
    health: 'excellent',
    lastUpdate: '30 min ago',
  },
]

const agentNames = [
  'CODE_AGENT', 'DATA_AGENT', 'CREATIVE_AGENT', 'INTENT_ROUTER',
  'MEMORY_SYNTHESIZER', 'CONTEXT_MANAGER', 'TASK_PLANNER', 'QUERY_ENGINE'
]

const actions = [
  'completed task', 'classified query as', 'stored new pattern', 'optimized strategy',
  'processed request', 'updated context', 'validated input', 'generated response'
]

const targets = [
  '#1847', '#1848', '#1849', '#1850', '#1851', '#1852',
  'CODE_GENERATION', 'DATA_ANALYSIS', 'CONTENT_CREATION', 'QUERY_UNDERSTANDING',
  'PATTERN_RECOGNITION', 'CONTEXT_UPDATE', 'STRATEGY_OPTIMIZATION'
]

// ============ ANIMATED COUNTER COMPONENT ============
function AnimatedCounter({ 
  value, 
  prefix = '', 
  suffix = '', 
  decimals = 0,
  duration = 2000 
}: { 
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const startTimeRef = useRef<number>(Date.now())
  const startValueRef = useRef(0)

  useEffect(() => {
    startValueRef.current = displayValue
    startTimeRef.current = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = startValueRef.current + (value - startValueRef.current) * easeOut
      
      setDisplayValue(current)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [value, duration])

  return (
    <span className="counter-value">
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  )
}

// ============ STATUS BADGE COMPONENT ============
function StatusBadge({ status }: { status: 'operational' | 'degraded' | 'down' }) {
  const config = {
    operational: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', label: 'Operational' },
    degraded: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', label: 'Degraded' },
    down: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', label: 'Down' }
  }
  
  const c = config[status]
  
  return (
    <div className="status-badge" style={{ background: c.bg, color: c.color }}>
      <span className={`status-dot ${status}`} />
      {c.label}
    </div>
  )
}

// ============ METRIC CARD COMPONENT ============
function MetricCard({ 
  title, 
  value, 
  prefix = '', 
  suffix = '', 
  decimals = 0,
  icon,
  trend,
  trendValue,
  color = '#3b82f6'
}: {
  title: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  icon: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  color?: string
}) {
  return (
    <div className="metric-card glass-card">
      <div className="metric-header">
        <span className="metric-icon">{icon}</span>
        <span className="metric-title">{title}</span>
      </div>
      <div className="metric-value" style={{ color }}>
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>
      {(trend && trendValue) && (
        <div className={`metric-trend ${trend}`}>
          {trend === 'up' && '↑'}{trend === 'down' && '↓'}{trend === 'stable' && '→'} {trendValue}
        </div>
      )}
    </div>
  )
}

// ============ ACTIVITY FEED COMPONENT ============
function ActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>([])
  const eventIdRef = useRef(0)

  const generateEvent = useCallback((): ActivityEvent => {
    const types: ('success' | 'info' | 'warning' | 'processing')[] = ['success', 'success', 'info', 'info', 'processing', 'warning']
    
    return {
      id: ++eventIdRef.current,
      agent: agentNames[Math.floor(Math.random() * agentNames.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      target: targets[Math.floor(Math.random() * targets.length)],
      timestamp: new Date(),
      type: types[Math.floor(Math.random() * types.length)]
    }
  }, [])

  useEffect(() => {
    // Initialize with some events
    const initialEvents: ActivityEvent[] = []
    for (let i = 0; i < 8; i++) {
      initialEvents.push({
        id: ++eventIdRef.current,
        agent: agentNames[Math.floor(Math.random() * agentNames.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        target: targets[Math.floor(Math.random() * targets.length)],
        timestamp: new Date(Date.now() - Math.random() * 60000),
        type: ['success', 'info', 'processing'][Math.floor(Math.random() * 3)] as 'success' | 'info' | 'processing'
      })
    }
    setEvents(initialEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()))

    // Add new events periodically
    const interval = setInterval(() => {
      setEvents(prev => {
        const newEvent = generateEvent()
        return [newEvent, ...prev].slice(0, 20)
      })
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(interval)
  }, [generateEvent])

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 5) return 'just now'
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ago`
  }

  return (
    <div className="activity-feed glass-card">
      <div className="feed-header">
        <div className="feed-title-row">
          <span className="feed-icon">⚡</span>
          <h3>Live Activity Feed</h3>
        </div>
        <div className="live-indicator">
          <span className="live-dot" />
          LIVE
        </div>
      </div>
      
      <div className="feed-events">
        {events.map(event => (
          <div key={event.id} className={`feed-event ${event.type}`}>
            <div className="event-type-icon">
              {event.type === 'success' && '✓'}
              {event.type === 'info' && 'ℹ'}
              {event.type === 'warning' && '⚠'}
              {event.type === 'processing' && '◌'}
            </div>
            <div className="event-content">
              <span className="event-agent">{event.agent}</span>
              <span className="event-action">{event.action}</span>
              <span className="event-target">{event.target}</span>
            </div>
            <span className="event-time">{formatTimeAgo(event.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============ PILLAR DETAIL MODAL ============
function PillarModal({ 
  pillar, 
  isOpen, 
  onClose 
}: { 
  pillar: PillarData | null
  isOpen: boolean
  onClose: () => void 
}) {
  if (!isOpen || !pillar) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <span className="modal-icon">{pillar.icon}</span>
          <div>
            <h2>{pillar.name}</h2>
            <p className="modal-subtitle">{pillar.fullName}</p>
          </div>
        </div>

        <div className="modal-progress-section">
          <div className="progress-header">
            <span>Development Progress</span>
            <span className="progress-percent">{pillar.progress}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${pillar.progress}%` }}
            />
          </div>
        </div>

        <p className="modal-description">{pillar.description}</p>

        <div className="modal-features">
          <h4>Key Features</h4>
          <div className="feature-grid">
            {pillar.features.map(feature => (
              <span key={feature} className="feature-item">{feature}</span>
            ))}
          </div>
        </div>

        <div className="modal-meta">
          <div className="meta-item">
            <span className="meta-label">Status</span>
            <span className={`modal-status ${pillar.health}`}>{pillar.status}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Health</span>
            <span className="health-badge">{pillar.health}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Last Update</span>
            <span>{pillar.lastUpdate}</span>
          </div>
        </div>

        <Link href={pillar.href} className="modal-cta-btn">
          Explore Full Documentation →
        </Link>
      </div>
    </div>
  )
}

// ============ UPTIME TIMER COMPONENT ============
function UptimeTimer() {
  const [uptime, setUptime] = useState({ days: 47, hours: 13, minutes: 42, seconds: 18 })

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => {
        let { days, hours, minutes, seconds } = prev
        seconds++
        if (seconds >= 60) { seconds = 0; minutes++ }
        if (minutes >= 60) { minutes = 0; hours++ }
        if (hours >= 24) { hours = 0; days++ }
        return { days, hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="uptime-timer">
      {uptime.days}d {String(uptime.hours).padStart(2, '0')}:{String(uptime.minutes).padStart(2, '0')}:{String(uptime.seconds).padStart(2, '0')}
    </span>
  )
}

// ============ LATENCY GAUGE COMPONENT ============
function LatencyGauge() {
  const [latency, setLatency] = useState(45)

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(42 + Math.random() * 8) // Fluctuate between 42-50ms
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  const getColor = () => {
    if (latency < 45) return '#10b981'
    if (latency < 50) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="latency-gauge">
      <svg viewBox="0 0 100 50" className="gauge-svg">
        <path
          d="M 10 45 A 40 40 0 0 1 90 45"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 10 45 A 40 40 0 0 1 90 45"
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(latency / 70) * 126} 126`}
        />
      </svg>
      <span className="latency-value" style={{ color: getColor() }}>{Math.round(latency)}ms</span>
    </div>
  )
}

// ============ SUBSCRIPTION CTA COMPONENT ============
function SubscriptionCTA() {
  const [requestsUsed] = useState(87)
  const requestsLimit = 100
  const percentage = (requestsUsed / requestsLimit) * 100

  return (
    <div className="subscription-cta glass-card">
      <div className="subscription-header">
        <div className="plan-badge">FREE TIER</div>
        <div className="usage-info">
          <span className="usage-value">{requestsUsed}/{requestsLimit}</span>
          <span className="usage-label">requests today</span>
        </div>
      </div>
      
      <div className="usage-bar-container">
        <div className="usage-bar-fill" style={{ width: `${percentage}%` }} />
        {percentage > 80 && <div className="usage-warning-pulse" />}
      </div>
      
      <p className="subscription-message">
        You're approaching your daily limit. Upgrade for unlimited access to all AI capabilities.
      </p>
      
      <a 
        href="https://github.com/sponsors/testdemoqwenai2025-creator"
        target="_blank"
        rel="noopener noreferrer"
        className="upgrade-btn"
      >
        <span className="upgrade-icon">⭐</span>
        Upgrade to Pro
      </a>
    </div>
  )
}

// ============ MAIN HOME PAGE COMPONENT ============
export default function HomePage() {
  const [apiCalls, setApiCalls] = useState(2847652)
  const [activeAgents, setActiveAgents] = useState(24)
  const [selectedPillar, setSelectedPillar] = useState<PillarData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Simulate API calls incrementing
  useEffect(() => {
    const interval = setInterval(() => {
      setApiCalls(prev => prev + Math.floor(Math.random() * 5) + 1)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Simulate active agents fluctuating
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgents(prev => {
        const change = Math.random() > 0.5 ? 1 : -1
        return Math.max(18, Math.min(32, prev + change))
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const openModal = useCallback((pillar: PillarData) => {
    setSelectedPillar(pillar)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedPillar(null), 300)
  }, [])

  return (
    <div className="home-page-enhanced">
      {/* Hero Section with Live Dashboard */}
      <section className="hero-dashboard section">
        <div className="hero-top-bar">
          <div className="system-status">
            <StatusBadge status="operational" />
            <span className="uptime-label">Uptime:</span>
            <UptimeTimer />
          </div>
          <div className="hero-badges">
            <span className="badge badge-primary">Phase 3</span>
            <span className="badge badge-success">AI-Native</span>
            <span className="badge badge-warning">Live Demo</span>
          </div>
        </div>

        <div className="hero-main-grid">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="text-gradient">SciMSPT</span> Architecture
            </h1>
            
            <p className="hero-subtitle">
              Next-generation application framework with built-in artificial intelligence, 
              machine learning, and self-evolving capabilities — designed to merge seamlessly 
              into production systems.
            </p>

            <div className="hero-actions">
              <Link href="/maol" className="btn btn-primary btn-glow">
                🚀 Explore MAOL Core
              </Link>
              <a 
                href="https://github.com/testdemoqwenai2025-creator/Demo3SciMSPT" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                💻 View Source Code
              </a>
            </div>
          </div>

          {/* Live Metrics Panel */}
          <div className="metrics-panel glass-card">
            <div className="panel-header">
              <span className="panel-title">System Performance</span>
              <LatencyGauge />
            </div>
            
            <div className="metrics-grid">
              <MetricCard
                title="API Calls Today"
                value={apiCalls}
                decimals={0}
                icon="📊"
                trend="up"
                trendValue="+12.4%"
                color="#3b82f6"
              />
              <MetricCard
                title="Active Agents"
                value={activeAgents}
                icon="🤖"
                trend="stable"
                trendValue="running"
                color="#8b5cf6"
              />
              <MetricCard
                title="Uptime SLA"
                value={99.97}
                suffix="%"
                decimals={2}
                icon="✓"
                trend="up"
                trendValue="+0.02%"
                color="#10b981"
              />
              <MetricCard
                title="Active Sessions"
                value={847}
                icon="👥"
                trend="up"
                trendValue="+23"
                color="#06b6d4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left Column - Interactive Pillars */}
        <section className="pillars-section section">
          <div className="section-header-row">
            <h2 className="section-title">Architecture Pillars</h2>
            <span className="pillars-count">{pillars.length} Components</span>
          </div>
          <p className="section-description">
            Six foundational components forming the AI-native architecture, each actively in development.
          </p>
          
          <div className="pillars-grid-enhanced">
            {pillars.map((pillar) => (
              <div 
                key={pillar.id} 
                className="pillar-card-enhanced glass-card"
                onClick={() => openModal(pillar)}
              >
                <div className="pillar-card-header">
                  <div className="pillar-identity">
                    <span className="pillar-icon-enhanced">{pillar.icon}</span>
                    <div>
                      <h3 className="pillar-name">{pillar.name}</h3>
                      <p className="pillar-full-name">{pillar.fullName}</p>
                    </div>
                  </div>
                  <div className="pillar-status-group">
                    <span className={`health-dot ${pillar.health}`} />
                    <span className={`status-tag ${pillar.status.replace(' ', '-')}`}>{pillar.status}</span>
                  </div>
                </div>

                <div className="pillar-progress-section">
                  <div className="progress-info">
                    <span className="progress-label">Progress</span>
                    <span className="progress-value">{pillar.progress}%</span>
                  </div>
                  <div className="progress-bar-enhanced">
                    <div 
                      className="progress-fill-enhanced"
                      style={{ 
                        width: `${pillar.progress}%`,
                        background: pillar.progress > 80 ? '#10b981' : pillar.progress > 60 ? '#3b82f6' : '#f59e0b'
                      }}
                    />
                  </div>
                </div>

                <p className="pillar-desc-enhanced">{pillar.description}</p>

                <div className="pillar-footer-enhanced">
                  <span className="last-update">Updated {pillar.lastUpdate}</span>
                  <span className="view-details">View Details →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column - Activity & Subscription */}
        <aside className="sidebar-column">
          <ActivityFeed />
          
          <SubscriptionCTA />

          {/* Quick Stats Panel */}
          <div className="quick-stats glass-card">
            <h3 className="stats-title">Platform Statistics</h3>
            <div className="stats-list">
              <div className="stat-row">
                <span className="stat-label">Total Requests (24h)</span>
                <span className="stat-value">2.4M</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Avg Response Time</span>
                <span className="stat-value stat-good">45ms</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Error Rate</span>
                <span className="stat-value stat-excellent">0.03%</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Model Version</span>
                <span className="stat-value">v3.2.1</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Regions Active</span>
                <span className="stat-value">12</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Diagrams Gallery */}
      <DiagramGallery />

      {/* Integration Section */}
      <section className="integration section" id="integration">
        <h2 className="section-title">Integration Ready</h2>
        <p className="section-description">
          Each component is built as a standalone module that can be independently 
          integrated into the main SciMSPT application when ready.
        </p>

        <div className="integration-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Clone & Review</h3>
              <p>Explore each pillar's dedicated page to understand its architecture and API surface.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Select Components</h3>
              <p>Choose which pillars to integrate based on your application requirements.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Merge to SciMSPT</h3>
              <p>Components are structured for direct import into the main application codebase.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillar Detail Modal */}
      <PillarModal 
        pillar={selectedPillar} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />

      {/* ========== NEW: Interactive Dashboard ========== */}
      <section className="interactive-dashboard section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">📊</span>
            Live Analytics Dashboard
          </h2>
          <p className="section-subtitle">
            Real-time metrics with interactive charts - powered by Recharts
          </p>
        </div>

        <DashboardCharts />
      </section>

      {/* ========== NEW: AI API Integration Demo ========== */}
      <section className="api-demo-section section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">🤖</span>
            AI API Integration Showcase
          </h2>
          <p className="section-subtitle">
            Experience free-tier AI capabilities with OpenAI, HuggingFace & Anthropic
          </p>
        </div>

        <APIDemoPanel />
      </section>

      <style jsx>{`
        /* ========== BASE STYLES ========== */
        .home-page-enhanced {
          animation: fadeInUp 0.6s ease-out;
          min-height: 100vh;
        }

        /* ========== SECTION HEADERS (New) ========== */
        .section {
          margin-bottom: 3rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          color: var(--color-text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .title-icon {
          font-size: 1.75em;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: var(--color-text-secondary);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ========== INTERACTIVE DASHBOARD ========== */
        .interactive-dashboard {
          padding: 2rem 0;
        }

        /* ========== API DEMO SECTION ========== */
        .api-demo-section {
          padding: 2rem 0;
        }

        /* ========== GLASS MORPHISM CARD ========== */
        .glass-card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-xl);
          transition: all var(--transition-normal);
        }

        .glass-card:hover {
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        }

        /* ========== HERO SECTION ========== */
        .hero-dashboard {
          padding: var(--space-xl) 0;
        }

        .hero-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-xl);
          flex-wrap: wrap;
          gap: var(--space-md);
        }

        .system-status {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .uptime-label {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .uptime-timer {
          font-family: 'SF Mono', 'Fira Code', monospace;
          color: #10b981;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.05em;
        }

        .hero-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .hero-main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-2xl);
          align-items: start;
        }

        @media (max-width: 1024px) {
          .hero-main-grid {
            grid-template-columns: 1fr;
          }
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 1.125rem;
          color: #94a3b8;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 600px;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-glow {
          position: relative;
          overflow: hidden;
        }

        .btn-glow::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }

        /* ========== METRICS PANEL ========== */
        .metrics-panel {
          padding: var(--space-lg);
          position: sticky;
          top: var(--space-lg);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
        }

        .panel-title {
          font-weight: 600;
          font-size: 1rem;
          color: #e2e8f0;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-md);
        }

        @media (max-width: 600px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }

        .metric-card {
          padding: var(--space-md);
          border-radius: var(--radius-lg);
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all var(--transition-fast);
        }

        .metric-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-sm);
        }

        .metric-icon {
          font-size: 1.1rem;
        }

        .metric-title {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: var(--space-xs);
          font-family: 'SF Mono', 'Fira Code', monospace;
        }

        .counter-value {
          display: inline-block;
        }

        .metric-trend {
          font-size: 0.75rem;
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .metric-trend.up { color: #10b981; }
        .metric-trend.down { color: #ef4444; }
        .metric-trend.stable { color: #94a3b8; }

        /* ========== LATENCY GAUGE ========== */
        .latency-gauge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .gauge-svg {
          width: 70px;
          height: 35px;
        }

        .latency-value {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.85rem;
          font-weight: 700;
        }

        /* ========== STATUS BADGE ========== */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.03em;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
        }

        .status-dot.operational { background: #10b981; }
        .status-dot.degraded { background: #f59e0b; }
        .status-dot.down { background: #ef4444; }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 currentColor; }
          50% { opacity: 0.8; box-shadow: 0 0 0 4px transparent; }
        }

        /* ========== DASHBOARD GRID LAYOUT ========== */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: var(--space-xl);
          margin-top: var(--space-xl);
        }

        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          
          .sidebar-column {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: var(--space-lg);
          }
        }

        /* ========== PILLARS SECTION ========== */
        .pillars-section {
          min-width: 0;
        }

        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-md);
        }

        .pillars-count {
          font-size: 0.85rem;
          color: #64748b;
          background: rgba(99, 102, 241, 0.15);
          padding: 0.3rem 0.75rem;
          border-radius: 9999px;
        }

        .pillars-grid-enhanced {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: var(--space-lg);
        }

        @media (max-width: 768px) {
          .pillars-grid-enhanced {
            grid-template-columns: 1fr;
          }
        }

        /* ========== ENHANCED PILLAR CARD ========== */
        .pillar-card-enhanced {
          padding: var(--space-lg);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .pillar-card-enhanced::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .pillar-card-enhanced:hover::before {
          opacity: 1;
        }

        .pillar-card-enhanced:hover {
          transform: translateY(-4px) scale(1.01);
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow: 0 20px 40px -12px rgba(139, 92, 246, 0.2);
        }

        .pillar-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-md);
        }

        .pillar-identity {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .pillar-icon-enhanced {
          font-size: 2.25rem;
          line-height: 1;
          transition: transform var(--transition-normal);
        }

        .pillar-card-enhanced:hover .pillar-icon-enhanced {
          transform: scale(1.15) rotate(5deg);
        }

        .pillar-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #f1f5f9;
          line-height: 1.2;
        }

        .pillar-full-name {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.125rem;
        }

        .pillar-status-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .health-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
        }

        .health-dot.excellent { background: #10b981; }
        .health-dot.good { background: #3b82f6; }
        .health-dot.developing { background: #f59e0b; }

        .status-tag {
          padding: 0.25rem 0.6rem;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-tag.In-Progress {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
        }

        .status-tag.Complete {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }

        .status-tag.Designed {
          background: rgba(99, 102, 241, 0.15);
          color: #a5b4fc;
        }

        /* ========== PROGRESS BAR ========== */
        .pillar-progress-section {
          margin-bottom: var(--space-md);
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.4rem;
        }

        .progress-label {
          font-size: 0.78rem;
          color: #64748b;
        }

        .progress-value {
          font-size: 0.78rem;
          font-weight: 600;
          color: #e2e8f0;
          font-family: 'SF Mono', 'Fira Code', monospace;
        }

        .progress-bar-enhanced {
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-fill-enhanced {
          height: 100%;
          border-radius: 9999px;
          transition: width 1s ease-out;
          position: relative;
        }

        .progress-fill-enhanced::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: progress-shine 2s infinite;
        }

        @keyframes progress-shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .pillar-desc-enhanced {
          color: #94a3b8;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: var(--space-md);
        }

        .pillar-footer-enhanced {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--space-md);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .last-update {
          font-size: 0.78rem;
          color: #64748b;
        }

        .view-details {
          font-size: 0.85rem;
          color: #8b5cf6;
          font-weight: 500;
          opacity: 0;
          transform: translateX(-0.5rem);
          transition: all var(--transition-fast);
        }

        .pillar-card-enhanced:hover .view-details {
          opacity: 1;
          transform: translateX(0);
        }

        /* ========== ACTIVITY FEED ========== */
        .activity-feed {
          padding: var(--space-lg);
        }

        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-md);
        }

        .feed-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .feed-title-row h3 {
          font-size: 1rem;
          font-weight: 600;
        }

        .feed-icon {
          font-size: 1.1rem;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          font-weight: 700;
          color: #ef4444;
          letter-spacing: 0.1em;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          animation: live-pulse 1.5s infinite;
        }

        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .feed-events {
          max-height: 400px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-right: 0.5rem;
        }

        .feed-events::-webkit-scrollbar {
          width: 4px;
        }

        .feed-events::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }

        .feed-events::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .feed-event {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          background: rgba(15, 23, 42, 0.4);
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          animation: slideIn 0.3s ease-out;
          border-left: 3px solid transparent;
        }

        .feed-event.success { border-left-color: #10b981; }
        .feed-event.info { border-left-color: #3b82f6; }
        .feed-event.warning { border-left-color: #f59e0b; }
        .feed-event.processing { border-left-color: #8b5cf6; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .event-type-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .feed-event.success .event-type-icon { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .feed-event.info .event-type-icon { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .feed-event.warning .event-type-icon { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        .feed-event.processing .event-type-icon { background: rgba(139, 92, 246, 0.2); color: #8b5cf6; }

        .event-content {
          flex: 1;
          min-width: 0;
        }

        .event-agent {
          font-weight: 600;
          color: #e2e8f0;
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.75rem;
        }

        .event-action {
          color: #94a3b8;
          margin: 0 0.25rem;
        }

        .event-target {
          color: #60a5fa;
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.75rem;
        }

        .event-time {
          font-size: 0.7rem;
          color: #475569;
          flex-shrink: 0;
        }

        /* ========== SUBSCRIPTION CTA ========== */
        .subscription-cta {
          padding: var(--space-lg);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
        }

        .subscription-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-md);
        }

        .plan-badge {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          padding: 0.3rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .usage-info {
          text-align: right;
        }

        .usage-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #f1f5f9;
          font-family: 'SF Mono', 'Fira Code', monospace;
        }

        .usage-label {
          font-size: 0.75rem;
          color: #64748b;
        }

        .usage-bar-container {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          overflow: hidden;
          position: relative;
          margin-bottom: var(--space-md);
        }

        .usage-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6);
          border-radius: 9999px;
          transition: width 0.5s ease;
        }

        .usage-warning-pulse {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 30%;
          background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.4));
          animation: warning-pulse 1.5s infinite;
          border-radius: 9999px;
        }

        @keyframes warning-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        .subscription-message {
          font-size: 0.88rem;
          color: #94a3b8;
          margin-bottom: var(--space-md);
          line-height: 1.5;
        }

        .upgrade-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all var(--transition-fast);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .upgrade-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        .upgrade-icon {
          font-size: 1.1rem;
        }

        /* ========== QUICK STATS ========== */
        .quick-stats {
          padding: var(--space-lg);
        }

        .stats-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: var(--space-md);
        }

        .stats-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .stat-row:last-child {
          border-bottom: none;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .stat-value {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-weight: 600;
          font-size: 0.9rem;
          color: #e2e8f0;
        }

        .stat-value.stat-good { color: #10b981; }
        .stat-value.stat-excellent { color: #34d399; }

        /* ========== MODAL ========== */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--space-lg);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
          padding: var(--space-xl);
          position: relative;
          animation: modalSlideUp 0.3s ease;
        }

        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-close {
          position: absolute;
          top: var(--space-md);
          right: var(--space-md);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #94a3b8;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .modal-close:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .modal-icon {
          font-size: 3rem;
        }

        .modal-header h2 {
          font-size: 1.75rem;
          margin-bottom: 0.25rem;
        }

        .modal-subtitle {
          color: #64748b;
          font-size: 0.95rem;
        }

        .modal-progress-section {
          margin-bottom: var(--space-lg);
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .progress-percent {
          font-weight: 700;
          color: #e2e8f0;
          font-family: 'SF Mono', 'Fira Code', monospace;
        }

        .progress-bar-container {
          height: 10px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 9999px;
          transition: width 0.8s ease;
        }

        .modal-description {
          color: #94a3b8;
          line-height: 1.7;
          margin-bottom: var(--space-lg);
        }

        .modal-features h4 {
          font-size: 1rem;
          margin-bottom: var(--space-md);
        }

        .feature-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: var(--space-lg);
        }

        .feature-item {
          padding: 0.4rem 0.85rem;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 9999px;
          font-size: 0.82rem;
          color: #60a5fa;
        }

        .modal-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-md);
          padding: var(--space-md);
          background: rgba(15, 23, 42, 0.5);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-lg);
        }

        .meta-item {
          text-align: center;
        }

        .meta-label {
          display: block;
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .modal-status {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .modal-status.excellent { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .modal-status.good { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
        .modal-status.developing { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }

        .health-badge {
          font-weight: 600;
          text-transform: capitalize;
        }

        .modal-cta-btn {
          display: block;
          text-align: center;
          padding: 0.9rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border-radius: var(--radius-md);
          font-weight: 600;
          text-decoration: none;
          transition: all var(--transition-fast);
        }

        .modal-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }

        /* ========== INTEGRATION STEPS ========== */
        .integration-steps {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-top: 2rem;
        }

        .step {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .step-number {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .step-content h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .step-content p {
          color: #94a3b8;
        }

        /* ========== RESPONSIVE ========== */
        @media (max-width: 768px) {
          .hero-top-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }
          
          .hero-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
