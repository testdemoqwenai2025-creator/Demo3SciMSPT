'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

// Types for our simulation data
interface Pattern {
  id: number
  text: string
  confidence: number
  category: 'Performance' | 'Usage' | 'Optimization' | 'Behavior'
  timestamp: string
  impact: 'High' | 'Medium' | 'Low'
}

interface Agent {
  id: number
  name: string
  strategy: string
  performance: number
  adaptations: number
  color: string
}

interface StrategyChange {
  id: number
  from: string
  to: string
  reason: string
  delta: number
  time: string
}

export default function EmergentBehaviorPage() {
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  // State for Game of Life
  const [gridSize] = useState(80)
  const [cells, setCells] = useState<boolean[][]>([])
  const [isRunning, setIsRunning] = useState(true)
  const [generation, setGeneration] = useState(0)
  const [population, setPopulation] = useState(0)
  const [cellCount, setCellCount] = useState(0)

  // Self-optimization metrics
  const [currentGen, setCurrentGen] = useState(847)
  const [fitnessScore, setFitnessScore] = useState(94.7)
  const [strategiesTested, setStrategiesTested] = useState(12459)
  const [successfulAdaptations, setSuccessfulAdaptations] = useState(1247)
  const [fitnessDelta, setFitnessDelta] = useState(2.3)

  // Feedback loop state
  const [activeStage, setActiveStage] = useState(0)
  const [loopSpeed, setLoopSpeed] = useState<'slow' | 'normal' | 'fast'>('normal')
  const stageNames = ['Observe', 'Analyze', 'Plan', 'Act']
  const stageMetrics = [
    { label: 'Data Points', value: '12,847/sec' },
    { label: 'Patterns Found', value: '234' },
    { label: 'Actions Queued', value: '18' },
    { label: 'Changes Applied', value: '7' }
  ]

  // Pattern discovery feed
  const [patterns, setPatterns] = useState<Pattern[]>([
    { id: 1847, text: 'Users complete tasks 23% faster on Tuesdays', confidence: 94.2, category: 'Performance', timestamp: '2s ago', impact: 'High' },
    { id: 1846, text: 'Memory usage spikes before garbage collection cycles', confidence: 98.7, category: 'Usage', timestamp: '15s ago', impact: 'Medium' },
    { id: 1845, text: 'Code agent prefers recursive solutions for tree structures', confidence: 91.3, category: 'Behavior', timestamp: '32s ago', impact: 'High' },
    { id: 1844, text: 'API response latency improves after cache warming', confidence: 96.1, category: 'Performance', timestamp: '48s ago', impact: 'Medium' },
    { id: 1843, text: 'User sessions show higher engagement with dark mode', confidence: 87.9, category: 'Usage', timestamp: '1m ago', impact: 'Low' }
  ])

  // Autonomous agents
  const [agents, setAgents] = useState<Agent[]>([
    { id: 1, name: 'Alpha', strategy: 'Greedy Search', performance: 97.2, adaptations: 234, color: '#10b981' },
    { id: 2, name: 'Beta', strategy: 'Genetic Algorithm', performance: 95.8, adaptations: 189, color: '#059669' },
    { id: 3, name: 'Gamma', strategy: 'Reinforcement Learning', performance: 93.4, adaptations: 156, color: '#34d399' },
    { id: 4, name: 'Delta', strategy: 'Swarm Intelligence', performance: 91.1, adaptations: 142, color: '#6ee7b7' },
    { id: 5, name: 'Epsilon', strategy: 'Bayesian Optimization', performance: 89.7, adaptations: 128, color: '#a7f3d0' },
    { id: 6, name: 'Zeta', strategy: 'Simulated Annealing', performance: 88.3, adaptations: 115, color: '#047857' }
  ])

  // Strategy changes history
  const [strategyChanges, setStrategyChanges] = useState<StrategyChange[]>([
    { id: 1, from: 'Random Search', to: 'Greedy Search', reason: 'Convergence speed improved by 340%', delta: +12.4, time: '2m ago' },
    { id: 2, from: 'Fixed Learning Rate', to: 'Adaptive LR', reason: 'Reduced oscillation in loss landscape', delta: +8.7, time: '8m ago' },
    { id: 3, from: 'Single Thread', to: 'Parallel Workers', reason: 'Throughput bottleneck identified', delta: +15.2, time: '15m ago' }
  ])

  // Safety metrics
  const [violationsBlocked] = useState(23)
  const [rollbacksPerformed] = useState(3)
  const [safetyScore] = useState(99.97)

  // Experiment lab state
  const [experimentType, setExperimentType] = useState<'Performance' | 'Resource' | 'Accuracy'>('Performance')
  const [isExperimenting, setIsExperimenting] = useState(false)
  const [experimentResult, setExperimentResult] = useState<string | null>(null)
  const [experimentProgress, setExperimentProgress] = useState(0)

  // Status tracking
  const [adaptationEvents, setAdaptationEvents] = useState(7)
  const [simulationRuns, setSimulationRuns] = useState(45)

  // Initialize Game of Life grid
  const initializeGrid = useCallback(() => {
    const newGrid: boolean[][] = []
    let count = 0
    for (let i = 0; i < gridSize; i++) {
      newGrid[i] = []
      for (let j = 0; j < gridSize; j++) {
        newGrid[i][j] = Math.random() > 0.65
        if (newGrid[i][j]) count++
      }
    }
    setCells(newGrid)
    setCellCount(count)
  }, [gridSize])

  // Count neighbors for Game of Life
  const countNeighbors = (grid: boolean[][], x: number, y: number): number => {
    let count = 0
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue
        const nx = (x + i + gridSize) % gridSize
        const ny = (y + j + gridSize) % gridSize
        if (grid[nx][ny]) count++
      }
    }
    return count
  }

  // Next generation of Game of Life
  const nextGeneration = useCallback(() => {
    setCells(prev => {
      const newGrid: boolean[][] = []
      let count = 0
      for (let i = 0; i < gridSize; i++) {
        newGrid[i] = []
        for (let j = 0; j < gridSize; j++) {
          const neighbors = countNeighbors(prev, i, j)
          if (prev[i][j]) {
            newGrid[i][j] = neighbors === 2 || neighbors === 3
          } else {
            newGrid[i][j] = neighbors === 3
          }
          if (newGrid[i][j]) count++
        }
      }
      setCellCount(count)
      return newGrid
    })
    setGeneration(g => g + 1)
  }, [gridSize])

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cellWidth = canvas.width / gridSize
    const cellHeight = canvas.height / gridSize

    // Clear with dark background
    ctx.fillStyle = '#0a0f0d'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw cells with glow effect
    cells.forEach((row, i) => {
      row.forEach((alive, j) => {
        if (alive) {
          const x = j * cellWidth
          const y = i * cellHeight
          
          // Glow effect
          const gradient = ctx.createRadialGradient(
            x + cellWidth / 2, y + cellHeight / 2, 0,
            x + cellWidth / 2, y + cellHeight / 2, cellWidth * 1.5
          )
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.8)')
          gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.3)')
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)')
          
          ctx.fillStyle = gradient
          ctx.fillRect(x - cellWidth * 0.25, y - cellHeight * 0.25, cellWidth * 1.5, cellHeight * 1.5)
          
          // Core cell
          ctx.fillStyle = '#10b981'
          ctx.fillRect(x + 0.5, y + 0.5, cellWidth - 1, cellHeight - 1)
        }
      })
    })

    // Grid lines (subtle)
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= gridSize; i += 10) {
      ctx.beginPath()
      ctx.moveTo(i * cellWidth, 0)
      ctx.lineTo(i * cellWidth, canvas.height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * cellHeight)
      ctx.lineTo(canvas.width, i * cellHeight)
      ctx.stroke()
    }
  }, [cells, gridSize])

  // Animation loop
  useEffect(() => {
    if (!isRunning) return
    
    const interval = setInterval(() => {
      nextGeneration()
    }, 100)
    
    return () => clearInterval(interval)
  }, [isRunning, nextGeneration])

  // Canvas drawing loop
  useEffect(() => {
    const animate = () => {
      drawCanvas()
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()
    
    return () => cancelAnimationFrame(animationRef.current)
  }, [drawCanvas])

  // Initialize grid on mount
  useEffect(() => {
    initializeGrid()
  }, [initializeGrid])

  // Handle canvas click to add disturbance
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / (canvas.width / gridSize))
    const y = Math.floor((e.clientY - rect.top) / (canvas.height / gridSize))
    
    // Add a glider pattern at click location
    const gliderPattern = [
      [0, 1], [1, 2], [2, 0], [2, 1], [2, 2]
    ]
    
    setCells(prev => {
      const newGrid = prev.map(row => [...row])
      gliderPattern.forEach(([dy, dx]) => {
        const ny = (y + dy + gridSize) % gridSize
        const nx = (x + dx + gridSize) % gridSize
        newGrid[ny][nx] = true
      })
      return newGrid
    })
  }

  // Feedback loop animation
  useEffect(() => {
    const speeds = { slow: 2000, normal: 1200, fast: 600 }
    const interval = setInterval(() => {
      setActiveStage(s => (s + 1) % 4)
    }, speeds[loopSpeed])
    
    return () => clearInterval(interval)
  }, [loopSpeed])

  // Simulate metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGen(g => g + 1)
      setFitnessScore(f => Math.min(99.9, f + (Math.random() * 0.1 - 0.02)))
      setFitnessDelta((Math.random() * 4 - 1).toFixed(1) as unknown as number)
      setStrategiesTested(s => s + Math.floor(Math.random() * 5) + 1)
      
      if (Math.random() > 0.7) {
        setSuccessfulAdaptations(s => s + 1)
      }
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  // Simulate agent updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        performance: Math.min(99.9, agent.performance + (Math.random() * 0.4 - 0.1)),
        adaptations: agent.adaptations + (Math.random() > 0.8 ? 1 : 0),
        strategy: Math.random() > 0.95 ? 
          ['Greedy Search', 'Genetic Algorithm', 'Reinforcement Learning', 
           'Swarm Intelligence', 'Bayesian Optimization', 'Simulated Annealing',
           'Particle Swarm', 'Evolutionary Strategy'][Math.floor(Math.random() * 8)] 
          : agent.strategy
      })))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  // Simulate pattern discovery
  useEffect(() => {
    const patternTemplates = [
      { text: 'Query optimization reduces latency by {x}%', category: 'Performance' as const, impact: 'High' as const },
      { text: 'Memory allocation pattern shows {x}% efficiency gain', category: 'Usage' as const, impact: 'Medium' as const },
      { text: 'Agent coordination improves with {x}-step lookahead', category: 'Optimization' as const, impact: 'High' as const },
      { text: 'User behavior clusters into {x} distinct patterns', category: 'Behavior' as const, impact: 'Medium' as const },
      { text: 'Cache hit rate increases {x}% during peak hours', category: 'Performance' as const, impact: 'Low' as const },
      { text: 'Error recovery time reduced by {x}% with retry logic', category: 'Optimization' as const, impact: 'High' as const }
    ]

    const interval = setInterval(() => {
      const template = patternTemplates[Math.floor(Math.random() * patternTemplates.length)]
      const value = Math.floor(Math.random() * 30 + 10)
      const newPattern: Pattern = {
        id: patterns[0].id + 1,
        text: template.text.replace('{x}', value.toString()),
        confidence: 85 + Math.random() * 14,
        category: template.category,
        timestamp: 'Just now',
        impact: template.impact
      }
      
      setPatterns(prev => [newPattern, ...prev.slice(0, 4)])
    }, 8000)
    
    return () => clearInterval(interval)
  }, [patterns])

  // Run experiment
  const runExperiment = async () => {
    if (adaptationEvents >= 25 || simulationRuns >= 100) return
    
    setIsExperimenting(true)
    setExperimentResult(null)
    setExperimentProgress(0)
    
    const progressInterval = setInterval(() => {
      setExperimentProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return p + Math.random() * 15 + 5
      })
    }, 200)
    
    setTimeout(() => {
      clearInterval(progressInterval)
      setExperimentProgress(100)
      const results = [
        `✅ ${experimentType} optimized! Efficiency +${(Math.random() * 10 + 5).toFixed(1)}%`,
        `✅ Adaptation complete. ${experimentType} score improved significantly.`,
        `🎯 ${experimentType} tuning applied. System response time reduced.`
      ]
      setExperimentResult(results[Math.floor(Math.random() * results.length)])
      setAdaptationEvents(e => e + 1)
      setSimulationRuns(s => s + 1)
      setIsExperimenting(false)
    }, 2500)
  }

  // Resize canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const container = canvas.parentElement
      if (!container) return
      canvas.width = container.clientWidth
      canvas.height = Math.min(container.clientWidth * 0.6, 400)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="emergent-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow"></div>
        <span className="badge badge-emerald">● Live Simulation</span>
        <h1 className="hero-title">
          <span className="title-icon">⟳</span>
          Emergent Behavior Engine
        </h1>
        <p className="hero-subtitle">
          Self-optimizing autonomous system demonstrating complex adaptive behaviors emerging from simple rules
        </p>
        
        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-item">
            <span className="status-label">Status</span>
            <span className="status-value status-active">In Progress</span>
          </div>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '45%' }}></div>
            </div>
            <span className="progress-text">45%</span>
          </div>
          <div className="status-item">
            <span className="status-label">Free Tier</span>
            <span className="status-value">{adaptationEvents}/25 daily</span>
          </div>
          <div className="status-item">
            <span className="status-label">Simulations</span>
            <span className="status-value">{simulationRuns}/100</span>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Left Column */}
        <div className="column-left">
          {/* Emergent Pattern Visualization */}
          <section className="card visualization-card">
            <div className="card-header-row">
              <h2 className="card-title-main">
                <span className="card-icon">◈</span>
                Emergent Pattern Visualization
              </h2>
              <div className="viz-controls">
                <button 
                  className={`control-btn ${isRunning ? 'active' : ''}`}
                  onClick={() => setIsRunning(!isRunning)}
                >
                  {isRunning ? '⏸ Pause' : '▶ Run'}
                </button>
                <button className="control-btn" onClick={initializeGrid}>
                  ↻ Reset
                </button>
              </div>
            </div>
            <p className="card-desc">Conway&apos;s Game of Life — simple rules creating complex emergent patterns. Click to add disturbances.</p>
            
            <div className="canvas-container" onClick={handleCanvasClick}>
              <canvas ref={canvasRef} className="life-canvas"></canvas>
              <div className="canvas-overlay">
                <div className="viz-stats">
                  <div className="viz-stat">
                    <span className="stat-label">Generation</span>
                    <span className="stat-value">{generation.toLocaleString()}</span>
                  </div>
                  <div className="viz-stat">
                    <span className="stat-label">Population</span>
                    <span className="stat-value">{cellCount}</span>
                  </div>
                  <div className="viz-stat">
                    <span className="stat-label">Density</span>
                    <span className="stat-value">{((cellCount / (gridSize * gridSize)) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Self-Optimization Dashboard */}
          <section className="card dashboard-card">
            <h2 className="card-title-main">
              <span className="card-icon">⚡</span>
              Self-Optimization Dashboard
            </h2>
            <p className="card-desc">Real-time system improvement metrics showing continuous evolution</p>
            
            <div className="metrics-grid">
              <div className="metric-card metric-primary">
                <div className="metric-icon">🧬</div>
                <div className="metric-content">
                  <span className="metric-label">Current Generation</span>
                  <span className="metric-value-gen">#{currentGen.toLocaleString()}</span>
                </div>
                <div className="metric-sparkline">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i} 
                      className="spark-bar"
                      style={{ height: `${30 + Math.random() * 70}%` }}
                    ></div>
                  ))}
                </div>
              </div>
              
              <div className="metric-card metric-success">
                <div className="metric-icon">📈</div>
                <div className="metric-content">
                  <span className="metric-label">Fitness Score</span>
                  <div className="fitness-display">
                    <span className="metric-value-fit">{fitnessScore.toFixed(1)}%</span>
                    <span className={`fitness-delta ${Number(fitnessDelta) >= 0 ? 'positive' : 'negative'}`}>
                      {Number(fitnessDelta) >= 0 ? '+' : ''}{fitnessDelta}%
                    </span>
                  </div>
                </div>
                <div className="fitness-ring">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path
                      className="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="2"
                    />
                    <path
                      className="circle-fg"
                      strokeDasharray={`${fitnessScore}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">🔬</div>
                <div className="metric-content">
                  <span className="metric-label">Strategies Tested</span>
                  <span className="metric-value">{strategiesTested.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">✨</div>
                <div className="metric-content">
                  <span className="metric-label">Successful Adaptations</span>
                  <span className="metric-value">{successfulAdaptations.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Feedback Loop Visualization */}
          <section className="card feedback-card">
            <div className="card-header-row">
              <h2 className="card-title-main">
                <span className="card-icon">🔄</span>
                Adaptive Feedback Loop
              </h2>
              <div className="speed-controls">
                <span className="speed-label">Speed:</span>
                {(['slow', 'normal', 'fast'] as const).map(speed => (
                  <button
                    key={speed}
                    className={`speed-btn ${loopSpeed === speed ? 'active' : ''}`}
                    onClick={() => setLoopSpeed(speed)}
                  >
                    {speed.charAt(0).toUpperCase() + speed.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="feedback-loop">
              <svg viewBox="0 0 500 200" className="loop-svg">
                {/* Connection paths */}
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Main loop path */}
                <ellipse cx="250" cy="100" rx="220" ry="70" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="2" strokeDasharray="8,4"/>
                
                {/* Animated flow particles */}
                {[0, 90, 180, 270].map((offset, i) => (
                  <circle key={i} r="4" fill="#10b981" filter="url(#glow)" opacity="0.8">
                    <animateMotion
                      dur={loopSpeed === 'slow' ? '8s' : loopSpeed === 'normal' ? '5s' : '2.5s'}
                      repeatCount="indefinite"
                      begin={`${i * (loopSpeed === 'slow' ? 2 : loopSpeed === 'normal' ? 1.25 : 0.625)}s`}
                    >
                      <mpath href="#loopPath"/>
                    </animateMotion>
                  </circle>
                ))}
                
                <path id="loopPath" d="M 250 30 A 220 70 0 1 1 249.9 30" fill="none" stroke="none"/>
                
                {/* Stage nodes */}
                {stageNames.map((name, i) => {
                  const angle = (i * 90 - 90) * Math.PI / 180
                  const x = 250 + 200 * Math.cos(angle)
                  const y = 100 + 60 * Math.sin(angle)
                  const isActive = activeStage === i
                  
                  return (
                    <g key={name} transform={`translate(${x}, ${y})`}>
                      <circle 
                        r="28" 
                        fill={isActive ? '#10b981' : '#1e293b'} 
                        stroke={isActive ? '#34d399' : '#334155'} 
                        strokeWidth="2"
                        filter={isActive ? 'url(#glow)' : undefined}
                        className={isActive ? 'stage-pulse' : ''}
                      />
                      <text 
                        textAnchor="middle" 
                        dy="4" 
                        fill={isActive ? '#fff' : '#94a3b8'} 
                        fontSize="11" 
                        fontWeight="600"
                      >
                        {name}
                      </text>
                      
                      {/* Metric bubble */}
                      <g transform={`translate(0, 45)`}>
                        <rect x="-45" y="-10" width="90" height="22" rx="11" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.3)" strokeWidth="1"/>
                        <text textAnchor="middle" dy="4" fill="#10b981" fontSize="9" fontWeight="500">
                          {stageMetrics[i].label}: {stageMetrics[i].value}
                        </text>
                      </g>
                    </g>
                  )
                })}
              </svg>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="column-right">
          {/* Pattern Discovery Feed */}
          <section className="card pattern-card">
            <h2 className="card-title-main">
              <span className="card-icon">🔍</span>
              Pattern Discovery Feed
              <span className="live-indicator">● LIVE</span>
            </h2>
            
            <div className="pattern-feed">
              {patterns.map(pattern => (
                <div key={pattern.id} className="pattern-item">
                  <div className="pattern-header">
                    <span className={`pattern-category cat-${pattern.category.toLowerCase()}`}>
                      {pattern.category}
                    </span>
                    <span className={`pattern-impact impact-${pattern.impact.toLowerCase()}`}>
                      {pattern.impact} Impact
                    </span>
                    <span className="pattern-time">{pattern.timestamp}</span>
                  </div>
                  <p className="pattern-text">#{pattern.id}: {pattern.text}</p>
                  <div className="pattern-footer">
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill" 
                        style={{ width: `${pattern.confidence}%` }}
                      ></div>
                    </div>
                    <span className="confidence-text">{pattern.confidence.toFixed(1)}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Autonomous Agents */}
          <section className="card agents-card">
            <h2 className="card-title-main">
              <span className="card-icon">🤖</span>
              Autonomous Agent Swarm
            </h2>
            <p className="card-desc">Multiple AI agents adapting strategies in real-time</p>
            
            <div className="agents-grid">
              {agents.map(agent => (
                <div key={agent.id} className="agent-card" style={{ borderColor: agent.color }}>
                  <div className="agent-avatar" style={{ background: `linear-gradient(135deg, ${agent.color}, ${agent.color}44)` }}>
                    {agent.name.charAt(0)}
                  </div>
                  <div className="agent-info">
                    <span className="agent-name">{agent.name}</span>
                    <span className="agent-strategy">{agent.strategy}</span>
                  </div>
                  <div className="agent-metrics">
                    <div className="agent-perf">
                      <span className="perf-value" style={{ color: agent.color }}>
                        {agent.performance.toFixed(1)}%
                      </span>
                    </div>
                    <span className="agent-adaptations">
                      {agent.adaptations} adapts
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="leaderboard">
              <h4 className="leaderboard-title">🏆 Top Strategies</h4>
              <div className="leaderboard-list">
                {agents.sort((a, b) => b.performance - a.performance).slice(0, 3).map((agent, i) => (
                  <div key={agent.id} className="leaderboard-item">
                    <span className={`rank rank-${i + 1}`}>#{i + 1}</span>
                    <span className="lb-name">{agent.name}</span>
                    <span className="lb-strategy">{agent.strategy}</span>
                    <span className="lb-score">{agent.performance.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Safe Guardrails Panel */}
          <section className="card safety-card">
            <h2 className="card-title-main">
              <span className="card-icon">🛡️</span>
              Safety Guardrails
            </h2>
            
            <div className="safety-score-container">
              <div className="safety-ring-large">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
                  <circle 
                    cx="50" cy="50" r="40" fill="none" 
                    stroke="#10b981" strokeWidth="8"
                    strokeDasharray={`${safetyScore * 2.51}, 251`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="safety-score-text">
                  <span className="score-value">{safetyScore}%</span>
                  <span className="score-label">Safety Score</span>
                </div>
              </div>
              
              <div className="safety-stats">
                <div className="safety-stat">
                  <span className="ss-value">{violationsBlocked}</span>
                  <span className="ss-label">Violations Blocked</span>
                </div>
                <div className="safety-stat">
                  <span className="ss-value">{rollbacksPerformed}</span>
                  <span className="ss-label">Rollbacks Performed</span>
                </div>
              </div>
            </div>
            
            <div className="guardrails-list">
              <h4>Active Guardrails</h4>
              {[
                { icon: '🔒', text: 'No data exfiltration allowed', status: 'active' },
                { icon: '⚡', text: 'Response latency < 500ms enforced', status: 'active' },
                { icon: '💾', text: 'User preferences preserved', status: 'active' },
                { icon: '📊', text: 'Resource limits strictly enforced', status: 'active' },
                { icon: '🔐', text: 'Encryption at rest & transit', status: 'active' }
              ].map((rail, i) => (
                <div key={i} className="guardrail-item">
                  <span className="gr-icon">{rail.icon}</span>
                  <span className="gr-text">{rail.text}</span>
                  <span className="gr-status gr-active">✓ Active</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-grid">
        {/* Adaptive Strategy Viewer */}
        <section className="card strategy-card">
          <h2 className="card-title-main">
            <span className="card-icon">📊</span>
            Adaptive Strategy Evolution
          </h2>
          <p className="card-desc">Track how the system evolves its approach over time</p>
          
          <div className="strategy-timeline">
            {strategyChanges.map(change => (
              <div key={change.id} className="strategy-change">
                <div className="change-arrow">
                  <div className="strategy-from">{change.from}</div>
                  <span className="arrow">→</span>
                  <div className="strategy-to">{change.to}</div>
                </div>
                <div className="change-details">
                  <span className="change-reason">{change.reason}</span>
                  <span className={`change-delta ${change.delta > 0 ? 'positive' : 'negative'}`}>
                    {change.delta > 0 ? '+' : ''}{change.delta}%
                  </span>
                  <span className="change-time">{change.time}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="performance-graph">
            <h4>Strategy Effectiveness Over Time</h4>
            <svg viewBox="0 0 400 100" className="graph-svg">
              <defs>
                <linearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {/* Generate smooth curve */}
              <path
                d={`M 0,${80 - Math.random() * 20} ${[...Array(19)].map((_, i) => 
                  `Q ${(i+1)*21},${80 - Math.random() * 30 - 20} ${(i+1)*21.05},${80 - Math.random() * 30 - 20}`
                ).join(' ')}`}
                fill="url(#graphGradient)"
                stroke="#10b981"
                strokeWidth="2"
              />
              {/* Baseline */}
              <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </svg>
            <div className="graph-labels">
              <span>Start</span>
              <span>Current →</span>
            </div>
          </div>
        </section>

        {/* Interactive Experiment Lab */}
        <section className="card experiment-card">
          <h2 className="card-title-main">
            <span className="card-icon">🧪</span>
            Experiment Lab
          </h2>
          <p className="card-desc">Trigger adaptation events and watch the system respond</p>
          
          <div className="experiment-type-selector">
            <label className="exp-label">Experiment Type:</label>
            <div className="type-buttons">
              {(['Performance', 'Resource', 'Accuracy'] as const).map(type => (
                <button
                  key={type}
                  className={`type-btn ${experimentType === type ? 'active' : ''}`}
                  onClick={() => setExperimentType(type)}
                >
                  {type === 'Performance' && '⚡'}
                  {type === 'Resource' && '💾'}
                  {type === 'Accuracy' && '🎯'}
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            className="run-experiment-btn"
            onClick={runExperiment}
            disabled={isExperimenting || adaptationEvents >= 25 || simulationRuns >= 100}
          >
            {isExperimenting ? (
              <>
                <span className="spinner"></span>
                Running Experiment...
              </>
            ) : adaptationEvents >= 25 ? (
              'Daily Limit Reached'
            ) : simulationRuns >= 100 ? (
              'Simulation Limit Reached'
            ) : (
              '🚀 Trigger Adaptation Event'
            )}
          </button>
          
          {(isExperimenting || experimentResult) && (
            <div className="experiment-result">
              {isExperimenting ? (
                <>
                  <div className="progress-container-exp">
                    <div className="progress-bar-exp">
                      <div 
                        className="progress-fill-exp" 
                        style={{ width: `${Math.min(experimentProgress, 100)}%` }}
                      ></div>
                    </div>
                    <span className="progress-text-exp">{Math.min(Math.round(experimentProgress), 100)}%</span>
                  </div>
                  <p className="result-status">Analyzing system state...</p>
                </>
              ) : (
                <p className="result-success">{experimentResult}</p>
              )}
            </div>
          )}
          
          <div className="experiment-limits">
            <div className="limit-item">
              <span className="limit-label">Daily Adaptations</span>
              <div className="limit-bar">
                <div className="limit-fill" style={{ width: `${(adaptationEvents / 25) * 100}%` }}></div>
              </div>
              <span className="limit-value">{adaptationEvents}/25</span>
            </div>
            <div className="limit-item">
              <span className="limit-label">Simulation Runs</span>
              <div className="limit-bar">
                <div className="limit-fill" style={{ width: `${simulationRuns}%` }}></div>
              </div>
              <span className="limit-value">{simulationRuns}/100</span>
            </div>
          </div>
          
          <div className="pro-upgrade">
            <span className="pro-badge">PRO</span>
            <span className="pro-text">Unlock custom experiments & unlimited simulations</span>
            <a href="https://github.com/sponsors/testdemoqwenai2025-creator" target="_blank" rel="noopener noreferrer" className="pro-link">
              Upgrade →
            </a>
          </div>
        </section>
      </div>

      {/* Navigation */}
      <section className="nav-section">
        <Link href="/" className="nav-btn nav-back">← Back to Overview</Link>
        <Link href="/plugin-system" className="nav-btn nav-next">View Plugin System →</Link>
      </section>

      <style jsx>{`
        .emergent-page {
          animation: fadeInUp 0.6s ease-out;
          min-height: 100vh;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Hero Section */
        .hero-section {
          text-align: center;
          padding: 2.5rem 0 2rem;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(16, 185, 129, 0.15);
          margin-bottom: 2rem;
        }

        .hero-glow {
          position: absolute;
          top: -50%;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(16, 185, 129, 0.15), transparent 70%);
          pointer-events: none;
          animation: pulse-glow 4s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
        }

        .badge-emerald {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3));
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.4);
          animation: badge-pulse 2s ease-in-out infinite;
        }

        @keyframes badge-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 20px 4px rgba(16, 185, 129, 0.2); }
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          margin: 1rem 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          background: linear-gradient(135deg, #10b981, #34d399, #6ee7b7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .title-icon {
          font-size: 2.5rem;
          animation: spin-slow 8s linear infinite;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .hero-subtitle {
          color: #94a3b8;
          max-width: 650px;
          margin: 0 auto 1.5rem;
          font-size: 1.05rem;
        }

        .status-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          background: rgba(16, 185, 129, 0.05);
          border-radius: 1rem;
          border: 1px solid rgba(16, 185, 129, 0.15);
        }

        .status-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .status-label {
          font-size: 0.7rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .status-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #e2e8f0;
        }

        .status-active {
          color: #10b981;
          animation: status-blink 2s ease-in-out infinite;
        }

        @keyframes status-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 150px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .progress-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: #10b981;
        }

        /* Main Grid */
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 1100px) {
          .main-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Cards */
        .card {
          background: linear-gradient(145deg, rgba(17, 24, 39, 0.95), rgba(15, 23, 42, 0.98));
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 1.25rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .card:hover {
          border-color: rgba(16, 185, 129, 0.35);
          box-shadow: 0 0 40px rgba(16, 185, 129, 0.1);
        }

        .card-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .card-title-main {
          font-size: 1.2rem;
          font-weight: 700;
          color: #f1f5f9;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .card-icon {
          font-size: 1.3rem;
        }

        .card-desc {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        /* Visualization Card */
        .visualization-card {
          overflow: hidden;
        }

        .viz-controls {
          display: flex;
          gap: 0.5rem;
        }

        .control-btn {
          padding: 0.4rem 0.85rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 0.5rem;
          color: #10b981;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .control-btn:hover, .control-btn.active {
          background: rgba(16, 185, 129, 0.25);
          border-color: #10b981;
        }

        .canvas-container {
          position: relative;
          border-radius: 0.75rem;
          overflow: hidden;
          background: #0a0f0d;
          border: 1px solid rgba(16, 185, 129, 0.2);
          cursor: crosshair;
        }

        .life-canvas {
          width: 100%;
          height: auto;
          display: block;
        }

        .canvas-overlay {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          pointer-events: none;
        }

        .viz-stats {
          display: flex;
          gap: 1rem;
          background: rgba(0, 0, 0, 0.7);
          padding: 0.5rem 0.85rem;
          border-radius: 0.5rem;
          backdrop-filter: blur(8px);
        }

        .viz-stat {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .stat-label {
          font-size: 0.6rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .stat-value {
          font-size: 0.85rem;
          font-weight: 700;
          color: #10b981;
          font-family: monospace;
        }

        /* Dashboard Metrics */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .metric-card {
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 1rem;
          padding: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          position: relative;
          overflow: hidden;
        }

        .metric-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #10b981, transparent);
          opacity: 0.5;
        }

        .metric-icon {
          font-size: 1.75rem;
        }

        .metric-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .metric-label {
          font-size: 0.72rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .metric-value {
          font-size: 1.35rem;
          font-weight: 800;
          color: #f1f5f9;
          font-family: monospace;
        }

        .metric-value-gen {
          font-size: 1.25rem;
          font-weight: 800;
          color: #10b981;
          font-family: monospace;
        }

        .metric-value-fit {
          font-size: 1.5rem;
          font-weight: 800;
          color: #10b981;
        }

        .fitness-display {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .fitness-delta {
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.15rem 0.4rem;
          border-radius: 0.35rem;
        }

        .fitness-delta.positive {
          color: #10b981;
          background: rgba(16, 185, 129, 0.15);
        }

        .fitness-delta.negative {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.15);
        }

        .metric-sparkline {
          position: absolute;
          bottom: 0.5rem;
          left: 0.5rem;
          right: 0.5rem;
          height: 24px;
          display: flex;
          align-items: flex-end;
          gap: 2px;
        }

        .spark-bar {
          flex: 1;
          background: linear-gradient(to top, #10b981, transparent);
          border-radius: 1px 1px 0 0;
          min-height: 3px;
          transition: height 0.3s ease;
        }

        .fitness-ring {
          position: absolute;
          bottom: 0.5rem;
          right: 0.5rem;
          width: 42px;
          height: 42px;
        }

        .circular-chart {
          width: 100%;
          height: 100%;
        }

        /* Feedback Loop */
        .feedback-loop {
          margin-top: 1rem;
        }

        .loop-svg {
          width: 100%;
          height: auto;
        }

        .stage-pulse {
          animation: stage-pulse 1.2s ease-in-out infinite;
        }

        @keyframes stage-pulse {
          0%, 100% { filter: url(#glow); }
          50% { filter: url(#glow) brightness(1.3); }
        }

        .speed-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .speed-label {
          font-size: 0.75rem;
          color: #64748b;
        }

        .speed-btn {
          padding: 0.3rem 0.6rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.35rem;
          color: #94a3b8;
          font-size: 0.72rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .speed-btn:hover, .speed-btn.active {
          background: rgba(16, 185, 129, 0.2);
          border-color: #10b981;
          color: #10b981;
        }

        /* Pattern Feed */
        .live-indicator {
          margin-left: auto;
          font-size: 0.7rem;
          color: #10b981;
          animation: live-pulse 1.5s ease-in-out infinite;
        }

        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .pattern-feed {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 320px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .pattern-feed::-webkit-scrollbar {
          width: 4px;
        }

        .pattern-feed::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 2px;
        }

        .pattern-feed::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 2px;
        }

        .pattern-item {
          background: rgba(16, 185, 129, 0.03);
          border: 1px solid rgba(16, 185, 129, 0.1);
          border-radius: 0.75rem;
          padding: 0.85rem;
          transition: all 0.2s ease;
        }

        .pattern-item:hover {
          background: rgba(16, 185, 129, 0.07);
          border-color: rgba(16, 185, 129, 0.25);
        }

        .pattern-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .pattern-category {
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .cat-performance { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .cat-usage { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .cat-optimization { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
        .cat-behavior { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }

        .pattern-impact {
          font-size: 0.62rem;
          font-weight: 600;
          padding: 0.15rem 0.45rem;
          border-radius: 0.25rem;
        }

        .impact-high { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
        .impact-medium { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        .impact-low { background: rgba(107, 114, 128, 0.2); color: #6b7280; }

        .pattern-time {
          margin-left: auto;
          font-size: 0.7rem;
          color: #64748b;
        }

        .pattern-text {
          font-size: 0.85rem;
          color: #cbd5e1;
          line-height: 1.4;
          margin-bottom: 0.6rem;
        }

        .pattern-footer {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .confidence-bar {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        .confidence-text {
          font-size: 0.72rem;
          color: #64748b;
        }

        /* Agents */
        .agents-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .agent-card {
          background: rgba(16, 185, 129, 0.03);
          border: 1px solid;
          border-radius: 0.75rem;
          padding: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          transition: all 0.2s ease;
        }

        .agent-card:hover {
          background: rgba(16, 185, 129, 0.08);
          transform: translateY(-2px);
        }

        .agent-avatar {
          width: 38px;
          height: 38px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: white;
          font-size: 1rem;
        }

        .agent-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .agent-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: #f1f5f9;
        }

        .agent-strategy {
          font-size: 0.68rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .agent-metrics {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .perf-value {
          font-size: 0.9rem;
          font-weight: 700;
          font-family: monospace;
        }

        .agent-adaptations {
          font-size: 0.65rem;
          color: #64748b;
        }

        .leaderboard {
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 0.75rem;
          padding: 0.85rem;
        }

        .leaderboard-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #f1f5f9;
          margin-bottom: 0.65rem;
        }

        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .leaderboard-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.82rem;
        }

        .rank {
          font-weight: 800;
          width: 28px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.35rem;
          font-size: 0.72rem;
        }

        .rank-1 { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; }
        .rank-2 { background: linear-gradient(135deg, #9ca3af, #6b7280); color: #000; }
        .rank-3 { background: linear-gradient(135deg, #cd7c32, #a16207); color: #fff; }

        .lb-name {
          font-weight: 600;
          color: #e2e8f0;
          width: 50px;
        }

        .lb-strategy {
          flex: 1;
          color: #64748b;
          font-size: 0.72rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .lb-score {
          font-weight: 700;
          color: #10b981;
          font-family: monospace;
        }

        /* Safety Card */
        .safety-score-container {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.25rem;
          padding: 1rem;
          background: rgba(16, 185, 129, 0.05);
          border-radius: 0.75rem;
        }

        .safety-ring-large {
          position: relative;
          width: 100px;
          height: 100px;
        }

        .safety-ring-large svg {
          width: 100%;
          height: 100%;
        }

        .safety-score-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .score-value {
          display: block;
          font-size: 1.4rem;
          font-weight: 800;
          color: #10b981;
        }

        .score-label {
          font-size: 0.6rem;
          color: #64748b;
          text-transform: uppercase;
        }

        .safety-stats {
          flex: 1;
          display: flex;
          gap: 1.5rem;
        }

        .safety-stat {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .ss-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #f1f5f9;
        }

        .ss-label {
          font-size: 0.72rem;
          color: #64748b;
        }

        .guardrails-list h4 {
          font-size: 0.85rem;
          color: #94a3b8;
          margin-bottom: 0.75rem;
        }

        .guardrail-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.55rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .guardrail-item:last-child {
          border-bottom: none;
        }

        .gr-icon {
          font-size: 1rem;
        }

        .gr-text {
          flex: 1;
          font-size: 0.82rem;
          color: #cbd5e1;
        }

        .gr-status {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: 0.25rem;
        }

        .gr-active {
          color: #10b981;
          background: rgba(16, 185, 129, 0.15);
        }

        /* Bottom Grid */
        .bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 900px) {
          .bottom-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Strategy Card */
        .strategy-timeline {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-bottom: 1.25rem;
        }

        .strategy-change {
          background: rgba(16, 185, 129, 0.03);
          border: 1px solid rgba(16, 185, 129, 0.1);
          border-radius: 0.75rem;
          padding: 0.85rem;
        }

        .change-arrow {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 0.5rem;
        }

        .strategy-from, .strategy-to {
          font-size: 0.82rem;
          font-weight: 600;
          padding: 0.3rem 0.65rem;
          border-radius: 0.4rem;
        }

        .strategy-from {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
        }

        .strategy-to {
          background: rgba(16, 185, 129, 0.15);
          color: #6ee7b7;
        }

        .arrow {
          color: #10b981;
          font-weight: bold;
        }

        .change-details {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .change-reason {
          flex: 1;
          font-size: 0.78rem;
          color: #94a3b8;
        }

        .change-delta {
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 0.35rem;
        }

        .change-delta.positive {
          color: #10b981;
          background: rgba(16, 185, 129, 0.15);
        }

        .change-delta.negative {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.15);
        }

        .change-time {
          font-size: 0.72rem;
          color: #64748b;
        }

        .performance-graph {
          background: rgba(16, 185, 129, 0.03);
          border: 1px solid rgba(16, 185, 129, 0.1);
          border-radius: 0.75rem;
          padding: 1rem;
        }

        .performance-graph h4 {
          font-size: 0.85rem;
          color: #94a3b8;
          margin-bottom: 0.75rem;
        }

        .graph-svg {
          width: 100%;
          height: 80px;
        }

        .graph-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: #64748b;
          margin-top: 0.5rem;
        }

        /* Experiment Card */
        .experiment-type-selector {
          margin-bottom: 1.25rem;
        }

        .exp-label {
          display: block;
          font-size: 0.85rem;
          color: #94a3b8;
          margin-bottom: 0.5rem;
        }

        .type-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .type-btn {
          flex: 1;
          padding: 0.65rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.6rem;
          color: #94a3b8;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }

        .type-btn:hover {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .type-btn.active {
          background: rgba(16, 185, 129, 0.2);
          border-color: #10b981;
          color: #10b981;
        }

        .run-experiment-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          border-radius: 0.75rem;
          color: white;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          margin-bottom: 1rem;
        }

        .run-experiment-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        }

        .run-experiment-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .experiment-result {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 0.75rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .progress-container-exp {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .progress-bar-exp {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill-exp {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 4px;
          transition: width 0.2s ease;
        }

        .progress-text-exp {
          font-size: 0.85rem;
          font-weight: 600;
          color: #10b981;
        }

        .result-status {
          font-size: 0.88rem;
          color: #94a3b8;
        }

        .result-success {
          font-size: 0.92rem;
          color: #10b981;
          font-weight: 600;
        }

        .experiment-limits {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .limit-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .limit-label {
          font-size: 0.78rem;
          color: #94a3b8;
          width: 130px;
        }

        .limit-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .limit-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .limit-value {
          font-size: 0.78rem;
          color: #64748b;
          width: 50px;
          text-align: right;
          font-family: monospace;
        }

        .pro-upgrade {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.1));
          border: 1px solid rgba(168, 85, 247, 0.25);
          border-radius: 0.75rem;
        }

        .pro-badge {
          background: linear-gradient(135deg, #a855f7, #8b5cf6);
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.25rem 0.55rem;
          border-radius: 0.3rem;
        }

        .pro-text {
          flex: 1;
          font-size: 0.82rem;
          color: #c4b5fd;
        }

        .pro-link {
          font-size: 0.82rem;
          color: #a855f7;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .pro-link:hover {
          color: #c4b5fd;
        }

        /* Navigation */
        .nav-section {
          display: flex;
          justify-content: space-between;
          padding: 1.5rem 0;
          border-top: 1px solid rgba(16, 185, 129, 0.15);
          margin-top: 1rem;
        }

        .nav-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.6rem;
          font-size: 0.92rem;
          font-weight: 500;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .nav-back {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #94a3b8;
        }

        .nav-back:hover {
          border-color: #10b981;
          color: #10b981;
        }

        .nav-next {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #10b981;
        }

        .nav-next:hover {
          background: rgba(16, 185, 129, 0.25);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 1.75rem;
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .status-bar {
            flex-direction: column;
            gap: 1rem;
          }
          
          .progress-container {
            width: 100%;
          }
          
          .metrics-grid {
            grid-template-columns: 1fr;
          }
          
          .agents-grid {
            grid-template-columns: 1fr;
          }
          
          .safety-score-container {
            flex-direction: column;
            text-align: center;
          }
          
          .safety-stats {
            justify-content: center;
          }
          
          .type-buttons {
            flex-direction: column;
          }
          
          .nav-section {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .nav-btn {
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}
