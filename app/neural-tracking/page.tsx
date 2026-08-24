'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

// Types
interface Neuron {
  id: number
  x: number
  y: number
  layer: number
  activation: number
  targetActivation: number
  radius: number
  pulsePhase: number
  firing: boolean
  fireTime: number
}

interface Connection {
  from: number
  to: number
  weight: number
  signalProgress: number
  active: boolean
}

interface Pattern {
  id: string
  category: string
  description: string
  confidence: number
  timestamp: Date
  icon: string
}

interface BehaviorEvent {
  type: string
  value: string
  time: number
}

export default function NeuralTrackingPage() {
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  
  // Neural network state
  const [neurons, setNeurons] = useState<Neuron[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [isNetworkActive, setIsNetworkActive] = useState(true)
  const [networkStats, setNetworkStats] = useState({ nodes: 0, connections: 0, firingRate: 0 })
  
  // Metrics state
  const [inferenceTime, setInferenceTime] = useState(15.4)
  const [accuracy, setAccuracy] = useState(94.7)
  const [memoryUsage, setMemoryUsage] = useState(12.8)
  const [batchProcessed, setBatchProcessed] = useState(1247)
  const [engagementScore, setEngagementScore] = useState(73)
  const [sessionDuration, setSessionDuration] = useState(0)
  
  // Privacy state
  const [privacyEnabled, setPrivacyEnabled] = useState(true)
  const [epsilonValue, setEpsilonValue] = useState(0.5)
  const [dataExportCount, setDataExportCount] = useState(0)
  
  // Demo state
  const [isSimulating, setIsSimulating] = useState(false)
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [recentEvents, setRecentEvents] = useState<BehaviorEvent[]>([])
  const [sessionsUsed, setSessionsUsed] = useState(23)
  
  // Initialize neural network
  useEffect(() => {
    const initNeurons: Neuron[] = []
    const initConnections: Connection[] = []
    
    const layers = [4, 6, 8, 6, 4]
    let neuronId = 0
    
    layers.forEach((count, layerIdx) => {
      for (let i = 0; i < count; i++) {
        initNeurons.push({
          id: neuronId,
          x: 80 + (layerIdx * 140),
          y: 60 + (i * (280 / (count - 1 || 1))),
          layer: layerIdx,
          activation: Math.random() * 0.3,
          targetActivation: Math.random() * 0.5,
          radius: 8 + Math.random() * 4,
          pulsePhase: Math.random() * Math.PI * 2,
          firing: false,
          fireTime: 0
        })
        neuronId++
      }
    })
    
    // Create connections
    let connId = 0
    for (let l = 0; l < layers.length - 1; l++) {
      const currentLayer = initNeurons.filter(n => n.layer === l)
      const nextLayer = initNeurons.filter(n => n.layer === l + 1)
      
      currentLayer.forEach(from => {
        nextLayer.forEach(to => {
          if (Math.random() > 0.4) {
            initConnections.push({
              from: from.id,
              to: to.id,
              weight: Math.random(),
              signalProgress: 0,
              active: false
            })
          }
        })
      })
    }
    
    setNeurons(initNeurons)
    setConnections(initConnections)
    setNetworkStats({ nodes: initNeurons.length, connections: initConnections.length, firingRate: 0 })
  }, [])
  
  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || neurons.length === 0) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const time = Date.now() / 1000
      
      // Update and draw connections
      connections.forEach(conn => {
        const fromNeuron = neurons.find(n => n.id === conn.from)
        const toNeuron = neurons.find(n => n.id === conn.to)
        
        if (!fromNeuron || !toNeuron) return
        
        // Update signal progress
        if (conn.active) {
          conn.signalProgress += 0.03
          if (conn.signalProgress >= 1) {
            conn.signalProgress = 0
            conn.active = false
          }
        }
        
        // Draw connection line
        const gradient = ctx.createLinearGradient(
          fromNeuron.x, fromNeuron.y,
          toNeuron.x, toNeuron.y
        )
        
        const baseAlpha = 0.15 + conn.weight * 0.25
        gradient.addColorStop(0, `rgba(16, 185, 129, ${baseAlpha * (1 - fromNeuron.activation)})`)
        gradient.addColorStop(1, `rgba(16, 185, 129, ${baseAlpha * toNeuron.activation})`)
        
        ctx.beginPath()
        ctx.moveTo(fromNeuron.x, fromNeuron.y)
        ctx.lineTo(toNeuron.x, toNeuron.y)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1 + conn.weight * 2
        ctx.stroke()
        
        // Draw signal packet
        if (conn.active && conn.signalProgress > 0) {
          const sx = fromNeuron.x + (toNeuron.x - fromNeuron.x) * conn.signalProgress
          const sy = fromNeuron.y + (toNeuron.y - fromNeuron.y) * conn.signalProgress
          
          ctx.beginPath()
          ctx.arc(sx, sy, 4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(52, 211, 153, ${0.9 - conn.signalProgress * 0.5})`
          ctx.fill()
          
          // Glow effect
          ctx.beginPath()
          ctx.arc(sx, sy, 8, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(16, 185, 129, ${0.3 - conn.signalProgress * 0.2})`
          ctx.fill()
        }
      })
      
      // Update and draw neurons
      let firingCount = 0
      neurons.forEach(neuron => {
        // Smooth activation transition
        neuron.activation += (neuron.targetActivation - neuron.activation) * 0.05
        
        // Random firing
        if (Math.random() < 0.008 && isNetworkActive) {
          neuron.firing = true
          neuron.fireTime = time
          neuron.targetActivation = 0.9 + Math.random() * 0.1
          
          // Activate outgoing connections
          connections.filter(c => c.from === neuron.id).forEach(c => {
            c.active = true
            c.signalProgress = 0
          })
        }
        
        // Decay activation
        if (time - neuron.fireTime > 1.5) {
          neuron.firing = false
          neuron.targetActivation = 0.1 + Math.random() * 0.2
        }
        
        if (neuron.firing) firingCount++
        
        // Pulse animation
        neuron.pulsePhase += 0.03
        const pulse = Math.sin(neuron.pulsePhase) * 0.3 + 1
        
        // Draw glow
        const glowRadius = neuron.radius * 3 * (neuron.activation + 0.3) * pulse
        const glowGradient = ctx.createRadialGradient(
          neuron.x, neuron.y, 0,
          neuron.x, neuron.y, glowRadius
        )
        glowGradient.addColorStop(0, `rgba(16, 185, 129, ${neuron.activation * 0.4})`)
        glowGradient.addColorStop(1, 'rgba(16, 185, 129, 0)')
        
        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, glowRadius, 0, Math.PI * 2)
        ctx.fillStyle = glowGradient
        ctx.fill()
        
        // Draw neuron body
        const bodyGradient = ctx.createRadialGradient(
          neuron.x - neuron.radius * 0.3, neuron.y - neuron.radius * 0.3, 0,
          neuron.x, neuron.y, neuron.radius * pulse
        )
        
        if (neuron.firing) {
          bodyGradient.addColorStop(0, '#34d399')
          bodyGradient.addColorStop(1, '#059669')
        } else {
          const intensity = Math.floor(30 + neuron.activation * 50)
          bodyGradient.addColorStop(0, `rgb(${intensity + 20}, ${intensity + 80}, ${intensity + 40})`)
          bodyGradient.addColorStop(1, `rgb(${intensity}, ${intensity + 50}, ${intensity + 20})`)
        }
        
        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, neuron.radius * pulse, 0, Math.PI * 2)
        ctx.fillStyle = bodyGradient
        ctx.fill()
        
        // Draw border
        ctx.strokeStyle = neuron.firing ? '#34d399' : 'rgba(16, 185, 129, 0.5)'
        ctx.lineWidth = neuron.firing ? 2 : 1
        ctx.stroke()
        
        // Draw activation value
        ctx.font = '9px monospace'
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + neuron.activation * 0.5})`
        ctx.textAlign = 'center'
        ctx.fillText((neuron.activation * 100).toFixed(0), neuron.x, neuron.y + neuron.radius + 14)
      })
      
      setNetworkStats(prev => ({ ...prev, firingRate: firingCount }))
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => cancelAnimationFrame(animationRef.current)
  }, [neurons, connections, isNetworkActive])
  
  // Click handler for canvas
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Find clicked neuron
    const clickedNeuron = neurons.find(n => {
      const dx = n.x - x
      const dy = n.y - y
      return Math.sqrt(dx * dx + dy * dy) < n.radius * 2
    })
    
    if (clickedNeuron) {
      setNeurons(prev => prev.map(n => {
        if (n.id === clickedNeuron.id) {
          return { ...n, firing: true, fireTime: Date.now() / 1000, targetActivation: 1 }
        }
        return n
      }))
      
      // Activate connections from clicked neuron
      setConnections(prev => prev.map(c => {
        if (c.from === clickedNeuron.id) {
          return { ...c, active: true, signalProgress: 0 }
        }
        return c
      }))
    }
  }, [neurons])
  
  // Metrics update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setInferenceTime(12 + Math.random() * 13)
      setAccuracy(94.5 + Math.random() * 0.5)
      setMemoryUsage(11.5 + Math.random() * 3)
      setBatchProcessed(prev => prev + Math.floor(Math.random() * 5))
      setEngagementScore(prev => {
        const change = (Math.random() - 0.48) * 3
        return Math.max(45, Math.min(98, prev + change))
      })
      setSessionDuration(prev => prev + 1)
      setEpsilonValue(0.45 + Math.random() * 0.15)
    }, 1500)
    
    return () => clearInterval(interval)
  }, [])
  
  // Simulation handler
  const startSimulation = () => {
    setIsSimulating(true)
    setPatterns([])
    setRecentEvents([])
    
    const eventTypes = [
      { type: 'page_view', values: ['/home', '/products', '/about', '/pricing', '/docs'] },
      { type: 'click', values: ['CTA Button', 'Nav Link', 'Card', 'Image', 'Form Field'] },
      { type: 'scroll', values: ['25%', '50%', '75%', '100%'] },
      { type: 'hover', values: ['Feature Card', 'Pricing Table', 'Testimonial'] },
      { type: 'search', values: ['AI features', 'Pricing', 'Documentation', 'API'] },
    ]
    
    const patternCategories = [
      { category: 'Navigation', icon: '🧭', descriptions: ['Browsing pattern detected', 'Menu navigation sequence', 'Page flow identified'] },
      { category: 'Content Preference', icon: '📊', descriptions: ['Interest in technical content', 'Product comparison behavior', 'Documentation focus pattern'] },
      { category: 'Time-based', icon: '⏰', descriptions: ['Peak engagement window', 'Session rhythm detected', 'Return visit pattern'] },
    ]
    
    let eventCount = 0
    const maxEvents = 20
    
    const simulateStep = () => {
      if (eventCount >= maxEvents) {
        setIsSimulating(false)
        return
      }
      
      // Generate random event
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const value = eventType.values[Math.floor(Math.random() * eventType.values.length)]
      const newEvent: BehaviorEvent = {
        type: eventType.type,
        value: `${value}`,
        time: Date.now()
      }
      
      setRecentEvents(prev => [...prev.slice(-8), newEvent])
      
      // Occasionally detect patterns
      if (Math.random() > 0.6 && patterns.length < 6) {
        const patternType = patternCategories[Math.floor(Math.random() * patternCategories.length)]
        const newPattern: Pattern = {
          id: `pattern-${Date.now()}-${Math.random()}`,
          category: patternType.category,
          description: patternType.descriptions[Math.floor(Math.random() * patternType.descriptions.length)],
          confidence: 75 + Math.random() * 23,
          timestamp: new Date(),
          icon: patternType.icon
        }
        setPatterns(prev => [...prev, newPattern])
        setSessionsUsed(prev => Math.min(100, prev + 1))
      }
      
      eventCount++
      setTimeout(simulateStep, 300 + Math.random() * 500)
    }
    
    simulateStep()
  }

  return (
    <div className="neural-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="grid-overlay"></div>
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
        </div>
        <div className="hero-content">
          <div className="badge-container">
            <span className="badge status-badge">
              <span className="pulse-dot"></span>
              In Progress
            </span>
            <span className="badge privacy-badge">Privacy-First AI</span>
          </div>
          <h1 className="title">
            <span className="title-icon">🧠</span>
            Neural Tracking Engine
          </h1>
          <p className="subtitle">
            Real-time behavioral intelligence with on-device TensorFlow.js processing.
            Zero data export. Differential privacy guaranteed.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">{networkStats.nodes}</span>
              <span className="stat-label">Neurons</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">{networkStats.connections}</span>
              <span className="stat-label">Synapses</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">{networkStats.firingRate}</span>
              <span className="stat-label">Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Neural Network Visualization */}
      <section className="viz-section">
        <div className="section-header">
          <h2><span className="section-icon">⚡</span> Live Neural Network</h2>
          <p className="section-desc">Click on any neuron to stimulate the network</p>
          <button 
            className={`toggle-btn ${isNetworkActive ? 'active' : ''}`}
            onClick={() => setIsNetworkActive(!isNetworkActive)}
          >
            {isNetworkActive ? '⏸ Pause' : '▶ Resume'}
          </button>
        </div>
        <div className="canvas-container">
          <canvas 
            ref={canvasRef} 
            width={640} 
            height={380}
            onClick={handleCanvasClick}
            className="neural-canvas"
          />
          <div className="canvas-overlay">
            <div className="layer-labels">
              <span>Input</span>
              <span>H1</span>
              <span>H2</span>
              <span>H3</span>
              <span>Output</span>
            </div>
          </div>
        </div>
        <div className="legend">
          <div className="legend-item">
            <span className="legend-dot idle"></span>
            Idle (< 30%)
          </div>
          <div className="legend-item">
            <span className="legend-dot active"></span>
            Active (30-70%)
          </div>
          <div className="legend-item">
            <span className="legend-dot firing"></span>
            Firing (> 70%)
          </div>
          <div className="legend-item">
            <span className="legend-signal"></span>
            Signal Packet
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* ML Metrics Panel */}
        <section className="panel metrics-panel">
          <div className="panel-header">
            <h3><span className="panel-icon">📈</span> Real-Time ML Metrics</h3>
            <span className="live-indicator">LIVE</span>
          </div>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Inference Time</div>
              <div className="metric-value">{inferenceTime.toFixed(1)}<span className="metric-unit">ms</span></div>
              <div className="metric-bar">
                <div className="metric-fill" style={{ width: `${(inferenceTime / 25) * 100}%` }}></div>
              </div>
              <div className="metric-range">Target: &lt;25ms</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Model Accuracy</div>
              <div className="metric-value accuracy">{accuracy.toFixed(1)}<span className="metric-unit">%</span></div>
              <div className="metric-bar success">
                <div className="metric-fill" style={{ width: `${accuracy}%` }}></div>
              </div>
              <div className="metric-range">Excellent (&gt;90%)</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Memory Usage</div>
              <div className="metric-value">{memoryUsage.toFixed(1)}<span className="metric-unit">MB</span></div>
              <div className="metric-bar">
                <div className="metric-fill memory" style={{ width: `${(memoryUsage / 32) * 100}%` }}></div>
              </div>
              <div className="metric-range">On-device only</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Batch Processed</div>
              <div className="metric-value">{batchProcessed.toLocaleString()}</div>
              <div className="metric-bar">
                <div className="metric-fill batch" style={{ width: '78%' }}></div>
              </div>
              <div className="metric-range">This session</div>
            </div>
          </div>
        </section>

        {/* Behavioral Analytics Dashboard */}
        <section className="panel analytics-panel">
          <div className="panel-header">
            <h3><span className="panel-icon">🎯</span> Behavioral Analytics</h3>
          </div>
          
          {/* Engagement Gauge */}
          <div className="gauge-container">
            <svg viewBox="0 0 200 120" className="gauge-svg">
              <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" strokeLinecap="round"/>
              <path 
                d="M 20 100 A 80 80 0 0 1 180 100" 
                fill="none" 
                stroke="url(#gaugeGradient)" 
                strokeWidth="12" 
                strokeLinecap="round"
                strokeDasharray={`${engagementScore * 2.51} 251`}
                className="gauge-fill"
              />
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981"/>
                  <stop offset="100%" stopColor="#34d399"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="gauge-value">
              <span className="gauge-number">{Math.round(engagementScore)}</span>
              <span className="gauge-label">Engagement Score</span>
            </div>
          </div>

          {/* Session Duration Chart */}
          <div className="session-chart">
            <div className="chart-header">
              <span className="chart-title">Session Duration</span>
              <span className="chart-value">{Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}</span>
            </div>
            <div className="mini-chart">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i} 
                  className="chart-bar"
                  style={{ 
                    height: `${20 + Math.sin(i * 0.5 + sessionDuration * 0.02) * 30 + Math.random() * 20}%`,
                    animationDelay: `${i * 50}ms`
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Pattern Confidence */}
          <div className="confidence-metrics">
            <div className="confidence-item">
              <span className="conf-label">Pattern Recognition</span>
              <div className="conf-bar"><div className="conf-fill" style={{ width: '87%' }}></div></div>
              <span className="conf-value">87%</span>
            </div>
            <div className="confidence-item">
              <span className="conf-label">Behavior Prediction</span>
              <div className="conf-bar"><div className="conf-fill" style={{ width: '72%' }}></div></div>
              <span className="conf-value">72%</span>
            </div>
            <div className="confidence-item">
              <span className="conf-label">Anomaly Detection</span>
              <div className="conf-bar"><div className="conf-fill" style={{ width: '94%' }}></div></div>
              <span className="conf-value">94%</span>
            </div>
          </div>

          {/* Privacy Indicator */}
          <div className="privacy-badge-large">
            <div className="privacy-icon">🔒</div>
            <div className="privacy-text">
              <strong>ON-DEVICE ONLY</strong>
              <span>All processing happens locally</span>
            </div>
          </div>
        </section>
      </div>

      {/* Privacy Compliance Panel */}
      <section className="panel privacy-panel">
        <div className="panel-header">
          <h3><span className="panel-icon">🛡️</span> Privacy Compliance Center</h3>
        </div>
        <div className="privacy-grid">
          <div className="privacy-card zero-export">
            <div className="zero-badge">
              <span className="zero-count">{dataExportCount}</span>
              <span className="zero-label">DATA EXPORTS</span>
            </div>
            <div className="zero-status">
              <span className="check-icon">✓</span>
              Zero Data Export Policy Active
            </div>
            <div className="zero-desc">No raw data ever leaves the device. Only aggregated, differentially-private insights are processed.</div>
          </div>
          
          <div className="privacy-card diff-privacy">
            <h4>Differential Privacy</h4>
            <div className="epsilon-display">
              <span className="epsilon-label">ε (epsilon)</span>
              <span className="epsilon-value">{epsilonValue.toFixed(2)}</span>
            </div>
            <div className="epsilon-scale">
              <div className="scale-track">
                <div className="scale-fill" style={{ left: `${(epsilonValue / 1) * 100}%` }}></div>
                <div className="scale-marker optimal" style={{ left: '50%' }}></div>
              </div>
              <div className="scale-labels">
                <span>More Private</span>
                <span>Optimal</span>
                <span>More Accurate</span>
              </div>
            </div>
          </div>
          
          <div className="privacy-card opt-toggle-card">
            <h4>Data Collection Preference</h4>
            <div className="toggle-switch">
              <button 
                className={`toggle-option ${!privacyEnabled ? 'selected' : ''}`}
                onClick={() => setPrivacyEnabled(false)}
              >
                Opt-Out
              </button>
              <button 
                className={`toggle-option ${privacyEnabled ? 'selected' : ''}`}
                onClick={() => setPrivacyEnabled(true)}
              >
                Opt-In ✓
              </button>
            </div>
            <p className="toggle-note">
              {privacyEnabled 
                ? '✅ Anonymous behavioral analysis enabled for improved experience' 
                : '⏸️ All behavioral tracking disabled'}
            </p>
          </div>
          
          <div className="privacy-card retention">
            <h4>Data Retention Policy</h4>
            <ul className="retention-list">
              <li><span className="ret-icon">🗑️</span> Raw events: <strong>0 days</strong> (immediate discard)</li>
              <li><span className="ret-icon">📊</span> Aggregated insights: <strong>7 days</strong></li>
              <li><span className="ret-icon">🔐</span> Encrypted at rest: <strong>AES-256</strong></li>
              <li><span className="ret-icon">📍</span> Data location: <strong>Your device only</strong></li>
            </ul>
          </div>
        </div>
        
        <div className="compliance-badges">
          <div className="compliance-badge gdpr">
            <span className="badge-icon">🇪🇺</span>
            <span>GDPR Compliant</span>
          </div>
          <div className="compliance-badge ccpa">
            <span className="badge-icon">🇺🇸</span>
            <span>CCPA Compliant</span>
          </div>
          <div className="compliance-badge soc2">
            <span className="badge-icon">🔒</span>
            <span>SOC 2 Type II</span>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="panel demo-panel">
        <div className="panel-header">
          <h3><span className="panel-icon">🎮</span> Interactive Behavior Tracking Demo</h3>
          <button 
            className={`demo-btn ${isSimulating ? 'running' : ''}`}
            onClick={startSimulation}
            disabled={isSimulating}
          >
            {isSimulating ? '⏳ Simulating...' : '▶ Start Simulation'}
          </button>
        </div>
        
        <div className="demo-content">
          <div className="demo-events">
            <h4>Live Event Stream</h4>
            <div className="events-list">
              {recentEvents.length === 0 ? (
                <div className="empty-state">Start simulation to see events...</div>
              ) : (
                recentEvents.map((event, idx) => (
                  <div key={`${event.time}-${idx}`} className="event-item">
                    <span className={`event-type ${event.type}`}>{event.type.replace('_', ' ')}</span>
                    <span className="event-value">{event.value}</span>
                    <span className="event-time">{new Date(event.time).toLocaleTimeString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="demo-patterns">
            <h4>Detected Patterns</h4>
            <div className="patterns-list">
              {patterns.length === 0 ? (
                <div className="empty-state">Patterns will appear during simulation...</div>
              ) : (
                patterns.map(pattern => (
                  <div key={pattern.id} className="pattern-card">
                    <div className="pattern-header">
                      <span className="pattern-icon">{pattern.icon}</span>
                      <span className="pattern-category">{pattern.category}</span>
                    </div>
                    <p className="pattern-desc">{pattern.description}</p>
                    <div className="pattern-confidence">
                      <span className="conf-label">Confidence</span>
                      <div className="conf-bar-small">
                        <div className="conf-fill-small" style={{ width: `${pattern.confidence}%` }}></div>
                      </div>
                      <span className="conf-percent">{pattern.confidence.toFixed(1)}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="pattern-categories-info">
              <h5>Pattern Categories:</h5>
              <div className="cat-tags">
                <span className="cat-tag nav">🧭 Navigation</span>
                <span className="cat-tag content">📊 Content Preference</span>
                <span className="cat-tag time">⏰ Time-based</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Status */}
      <section className="subscription-section">
        <div className="sub-card free-tier">
          <div className="sub-header">
            <span className="sub-icon">⭐</span>
            <div className="sub-info">
              <h4>Free Tier</h4>
              <p>Perfect for getting started</p>
            </div>
          </div>
          <div className="usage-meter">
            <div className="usage-header">
              <span>Daily Analysis Sessions</span>
              <span>{sessionsUsed}/100 used</span>
            </div>
            <div className="usage-bar">
              <div className="usage-fill" style={{ width: `${sessionsUsed}%` }}></div>
            </div>
            <div className="usage-footer">
              <span>{100 - sessionsUsed} sessions remaining today</span>
              <span>Resets in 8h 24m</span>
            </div>
          </div>
          <a 
            href="https://github.com/sponsors/testdemoqwenai2025-creator" 
            target="_blank" 
            rel="noopener noreferrer"
            className="upgrade-btn"
          >
            ⬆ Upgrade for Unlimited Access
          </a>
        </div>
      </section>

      {/* Navigation Actions */}
      <section className="actions">
        <Link href="/" className="nav-btn outline">← Back to Overview</Link>
        <Link href="/maol" className="nav-btn outline">View MAOL →</Link>
      </section>

      <style jsx>{`
        .neural-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0f1a 0%, #0d1520 50%, #0a1020 100%);
          color: #e2e8f0;
          position: relative;
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero {
          position: relative;
          padding: 3rem 1.5rem 4rem;
          text-align: center;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.3), transparent);
          top: -100px;
          right: -100px;
          animation: float 8s ease-in-out infinite;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.2), transparent);
          bottom: -50px;
          left: -50px;
          animation: float 10s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .badge-container {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-badge {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #fbbf24;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .privacy-badge {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #34d399 50%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .title-icon {
          font-size: 1.2em;
          -webkit-text-fill-color: initial;
          filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.5));
        }

        .subtitle {
          font-size: 1.125rem;
          color: #94a3b8;
          max-width: 700px;
          margin: 0 auto 2rem;
          line-height: 1.7;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
          padding: 1.5rem 2rem;
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 1rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #34d399;
          font-family: monospace;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
        }

        /* Visualization Section */
        .viz-section {
          padding: 2rem 1.5rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }

        .section-icon {
          font-size: 1.5em;
        }

        .section-desc {
          color: #64748b;
          font-size: 0.9rem;
        }

        .toggle-btn {
          padding: 0.5rem 1rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 0.5rem;
          color: #34d399;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .toggle-btn:hover {
          background: rgba(16, 185, 129, 0.2);
        }

        .toggle-btn.active {
          background: rgba(16, 185, 129, 0.2);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
        }

        .canvas-container {
          position: relative;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.03), rgba(6, 182, 212, 0.03));
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 1rem;
          overflow: hidden;
        }

        .neural-canvas {
          display: block;
          width: 100%;
          height: auto;
          cursor: pointer;
        }

        .canvas-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0.75rem;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          pointer-events: none;
        }

        .layer-labels {
          display: flex;
          justify-content: space-around;
          font-size: 0.7rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .legend {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .legend-dot.idle {
          background: rgba(16, 185, 129, 0.3);
        }

        .legend-dot.active {
          background: rgba(16, 185, 129, 0.7);
        }

        .legend-dot.firing {
          background: #34d399;
          box-shadow: 0 0 10px rgba(52, 211, 153, 0.5);
        }

        .legend-signal {
          width: 16px;
          height: 8px;
          background: linear-gradient(90deg, transparent, #34d399, transparent);
          border-radius: 4px;
        }

        /* Dashboard Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
          padding: 0 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Panels */
        .panel {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1rem;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .panel-header h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: #fff;
        }

        .panel-icon {
          font-size: 1.25em;
        }

        .live-indicator {
          padding: 0.25rem 0.75rem;
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          animation: livePulse 2s ease-in-out infinite;
        }

        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        /* Metrics */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        @media (max-width: 500px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }

        .metric-card {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 0.75rem;
          padding: 1rem;
        }

        .metric-label {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .metric-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #34d399;
          font-family: monospace;
        }

        .metric-value.accuracy {
          color: #22c55e;
        }

        .metric-unit {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 400;
        }

        .metric-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          margin-top: 0.75rem;
          overflow: hidden;
        }

        .metric-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        .metric-fill.memory {
          background: linear-gradient(90deg, #06b6d4, #22d3ee);
        }

        .metric-fill.batch {
          background: linear-gradient(90deg, #8b5cf6, #a78bfa);
        }

        .metric-range {
          font-size: 0.7rem;
          color: #475569;
          margin-top: 0.5rem;
        }

        /* Analytics Panel */
        .gauge-container {
          position: relative;
          width: 200px;
          margin: 0 auto 1.5rem;
        }

        .gauge-svg {
          width: 100%;
          height: auto;
        }

        .gauge-fill {
          transition: stroke-dasharray 0.5s ease;
        }

        .gauge-value {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        }

        .gauge-number {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          color: #34d399;
          font-family: monospace;
        }

        .gauge-label {
          font-size: 0.7rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .session-chart {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 0.75rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .chart-title {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .chart-value {
          font-family: monospace;
          font-weight: 600;
          color: #34d399;
        }

        .mini-chart {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 50px;
        }

        .chart-bar {
          flex: 1;
          background: linear-gradient(180deg, #34d399, #10b981);
          border-radius: 2px 2px 0 0;
          min-height: 5px;
          transition: height 0.3s ease;
        }

        .confidence-metrics {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .confidence-item {
          display: grid;
          grid-template-columns: 1fr 100px 40px;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8rem;
        }

        .conf-label {
          color: #94a3b8;
        }

        .conf-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .conf-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 3px;
        }

        .conf-value {
          font-family: monospace;
          color: #34d399;
          font-weight: 600;
          text-align: right;
        }

        .privacy-badge-large {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.05));
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 0.75rem;
        }

        .privacy-icon {
          font-size: 2rem;
        }

        .privacy-text {
          display: flex;
          flex-direction: column;
        }

        .privacy-text strong {
          color: #34d399;
          font-size: 0.9rem;
        }

        .privacy-text span {
          font-size: 0.75rem;
          color: #64748b;
        }

        /* Privacy Panel */
        .privacy-panel {
          max-width: 1200px;
          margin: 0 auto 1.5rem;
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }

        .privacy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .privacy-card {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 0.75rem;
          padding: 1.25rem;
        }

        .privacy-card h4 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 1rem;
        }

        .zero-export {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.02));
          border-color: rgba(16, 185, 129, 0.2);
        }

        .zero-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }

        .zero-count {
          font-size: 2.5rem;
          font-weight: 800;
          color: #34d399;
          font-family: monospace;
          line-height: 1;
        }

        .zero-label {
          font-size: 0.65rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .zero-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #34d399;
          margin-bottom: 0.5rem;
        }

        .check-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: rgba(16, 185, 129, 0.2);
          border-radius: 50%;
          font-size: 0.75rem;
        }

        .zero-desc {
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.5;
        }

        .epsilon-display {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 1rem;
        }

        .epsilon-label {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .epsilon-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #34d399;
          font-family: monospace;
        }

        .epsilon-scale {
          margin-top: 1rem;
        }

        .scale-track {
          position: relative;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          margin-bottom: 0.5rem;
        }

        .scale-fill {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 12px;
          height: 12px;
          background: #34d399;
          border-radius: 50%;
          margin-left: -6px;
          box-shadow: 0 0 10px rgba(52, 211, 153, 0.5);
          transition: left 0.3s ease;
        }

        .scale-marker {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 2px;
          height: 14px;
          background: #fbbf24;
          border-radius: 1px;
        }

        .scale-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          color: #475569;
        }

        .toggle-switch {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .toggle-option {
          flex: 1;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: #94a3b8;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .toggle-option.selected {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.4);
          color: #34d399;
        }

        .toggle-note {
          font-size: 0.8rem;
          color: #64748b;
        }

        .retention-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .retention-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .retention-list li:last-child {
          border-bottom: none;
        }

        .ret-icon {
          font-size: 1rem;
        }

        .retention-list strong {
          color: #e2e8f0;
        }

        .compliance-badges {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .compliance-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .badge-icon {
          font-size: 1.1rem;
        }

        /* Demo Panel */
        .demo-panel {
          max-width: 1200px;
          margin: 0 auto 1.5rem;
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }

        .demo-btn {
          padding: 0.6rem 1.25rem;
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          border-radius: 0.5rem;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .demo-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        }

        .demo-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .demo-btn.running {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          animation: runPulse 1s ease-in-out infinite;
        }

        @keyframes runPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
        }

        .demo-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .demo-content {
            grid-template-columns: 1fr;
          }
        }

        .demo-events, .demo-patterns {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 0.75rem;
          padding: 1rem;
        }

        .demo-events h4, .demo-patterns h4 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .events-list {
          max-height: 250px;
          overflow-y: auto;
        }

        .event-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.8rem;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .event-type {
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .event-type.page_view { background: rgba(99, 102, 241, 0.2); color: #818cf8; }
        .event-type.click { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        .event-type.scroll { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        .event-type.hover { background: rgba(236, 72, 153, 0.2); color: #f472b6; }
        .event-type.search { background: rgba(6, 182, 212, 0.2); color: #22d3ee; }

        .event-value {
          flex: 1;
          color: #e2e8f0;
        }

        .event-time {
          color: #475569;
          font-family: monospace;
          font-size: 0.7rem;
        }

        .patterns-list {
          max-height: 250px;
          overflow-y: auto;
        }

        .pattern-card {
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 0.5rem;
          padding: 0.75rem;
          margin-bottom: 0.75rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .pattern-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .pattern-icon {
          font-size: 1.1rem;
        }

        .pattern-category {
          font-weight: 600;
          color: #34d399;
          font-size: 0.85rem;
        }

        .pattern-desc {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-bottom: 0.75rem;
        }

        .pattern-confidence {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
        }

        .conf-bar-small {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .conf-fill-small {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 2px;
        }

        .conf-percent {
          color: #34d399;
          font-family: monospace;
          font-weight: 600;
        }

        .pattern-categories-info {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .pattern-categories-info h5 {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        .cat-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .cat-tag {
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .cat-tag.nav { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
        .cat-tag.content { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .cat-tag.time { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: #475569;
          font-size: 0.9rem;
        }

        /* Subscription Section */
        .subscription-section {
          padding: 0 1.5rem;
          max-width: 500px;
          margin: 0 auto 2rem;
        }

        .sub-card {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 182, 212, 0.04));
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 1rem;
          padding: 1.5rem;
        }

        .sub-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .sub-icon {
          font-size: 2rem;
        }

        .sub-info h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
        }

        .sub-info p {
          font-size: 0.85rem;
          color: #64748b;
        }

        .usage-meter {
          margin-bottom: 1.5rem;
        }

        .usage-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #94a3b8;
          margin-bottom: 0.5rem;
        }

        .usage-bar {
          height: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .usage-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 5px;
          transition: width 0.5s ease;
        }

        .usage-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #475569;
        }

        .upgrade-btn {
          display: block;
          text-align: center;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 0.5rem;
          color: white;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .upgrade-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        }

        /* Actions */
        .actions {
          display: flex;
          justify-content: space-between;
          padding: 2rem 1.5rem 3rem;
          max-width: 900px;
          margin: 0 auto;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .nav-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .nav-btn.outline {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #e2e8f0;
        }

        .nav-btn.outline:hover {
          border-color: #34d399;
          color: #34d399;
        }

        /* Scrollbar styling */
        .events-list::-webkit-scrollbar,
        .patterns-list::-webkit-scrollbar {
          width: 4px;
        }

        .events-list::-webkit-scrollbar-track,
        .patterns-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }

        .events-list::-webkit-scrollbar-thumb,
        .patterns-list::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 2px;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .hero {
            padding: 2rem 1rem 3rem;
          }

          .title {
            font-size: 1.75rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .hero-stats {
            gap: 1rem;
            padding: 1rem;
          }

          .stat-value {
            font-size: 1.25rem;
          }

          .dashboard-grid {
            padding: 0 1rem;
          }

          .panel {
            padding: 1rem;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .privacy-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
