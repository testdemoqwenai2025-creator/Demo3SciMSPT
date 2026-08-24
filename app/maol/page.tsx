'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

// Types
interface Agent {
  id: string
  name: string
  type: string
  status: 'IDLE' | 'PROCESSING' | 'BUSY' | 'OFFLINE'
  tasksCompleted: number
  avgTime: number
  queue: number
  efficiency?: number
  currentTask?: string
  position: { x: number; y: number }
}

interface IntentResult {
  status: 'analyzing' | 'classified'
  intent: string
  confidence: number
  entities: Array<{ type: string; value: string }>
  suggestedAgent: string
  reasoning: string
}

interface SubTask {
  id: string
  name: string
  status: 'pending' | 'active' | 'completed'
  priority: 'high' | 'medium' | 'low'
  estimatedTime: number
  dependencies: string[]
}

interface ContextMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface Insight {
  id: string
  text: string
  confidence: number
  category: string
  timestamp: Date
}

// Initial Agents Data
const initialAgents: Agent[] = [
  {
    id: 'code-agent',
    name: 'Code Agent',
    type: 'CODE',
    status: 'IDLE',
    tasksCompleted: 847,
    avgTime: 2.3,
    queue: 0,
    position: { x: 20, y: 30 }
  },
  {
    id: 'data-agent',
    name: 'Data Agent',
    type: 'DATA',
    status: 'PROCESSING',
    tasksCompleted: 234,
    avgTime: 1.8,
    queue: 3,
    position: { x: 70, y: 20 }
  },
  {
    id: 'creative-agent',
    name: 'Creative Agent',
    type: 'CREATIVE',
    status: 'IDLE',
    tasksCompleted: 156,
    avgTime: 4.1,
    queue: 0,
    position: { x: 15, y: 70 }
  },
  {
    id: 'analysis-agent',
    name: 'Analysis Agent',
    type: 'ANALYSIS',
    status: 'BUSY',
    tasksCompleted: 892,
    avgTime: 3.2,
    queue: 1,
    efficiency: 94,
    currentTask: 'Analyzing user behavior patterns...',
    position: { x: 75, y: 65 }
  },
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    type: 'ORCHESTRATOR',
    status: 'PROCESSING',
    tasksCompleted: 2129,
    avgTime: 0.5,
    queue: 5,
    position: { x: 50, y: 50 }
  }
]

const intentCategories = [
  'CODE_GENERATION',
  'DATA_ANALYSIS',
  'CONTENT_CREATION',
  'DEBUGGING',
  'REFACTORING',
  'DOCUMENTATION',
  'TESTING',
  'OPTIMIZATION'
]

const sampleTasks = [
  "Build a REST API for user authentication",
  "Analyze sales data and generate report",
  "Create a responsive landing page design",
  "Debug memory leak in React component",
  "Refactor legacy code to TypeScript",
  "Write unit tests for payment module"
]

export default function MAOLPage() {
  // State Management
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [activeConnections, setActiveConnections] = useState<Array<{from: string; to: string; active: boolean}>>([])
  const [intentInput, setIntentInput] = useState('')
  const [intentResult, setIntentResult] = useState<IntentResult | null>(null)
  const [isClassifying, setIsClassifying] = useState(false)
  const [taskInput, setTaskInput] = useState('')
  const [subtasks, setSubtasks] = useState<SubTask[]>([])
  const [isDecomposing, setIsDecomposing] = useState(false)
  const [contextMessages, setContextMessages] = useState<ContextMessage[]>([
    { role: 'system', content: 'Session initialized. Welcome to SciMSPT MAOL Dashboard.', timestamp: new Date(Date.now() - 300000) },
    { role: 'user', content: 'Help me understand the architecture', timestamp: new Date(Date.now() - 240000) },
    { role: 'assistant', content: 'The MAOL (Multi-Agent Orchestrator Layer) coordinates specialized AI agents...', timestamp: new Date(Date.now() - 180000) },
    { role: 'user', content: 'Show me how intent routing works', timestamp: new Date(Date.now() - 120000) },
    { role: 'assistant', content: 'The Intent Router classifies your request and routes it to the optimal agent...', timestamp: new Date(Date.now() - 60000) }
  ])
  const [contextUsage, setContextUsage] = useState(67)
  const [insights, setInsights] = useState<Insight[]>([
    { id: '1', text: 'Users prefer TypeScript examples over JavaScript', confidence: 89, category: 'Preference', timestamp: new Date() },
    { id: '2', text: 'API documentation requests peak on Tuesdays', confidence: 76, category: 'Pattern', timestamp: new Date() },
    { id: '3', text: 'Code generation tasks have 94% acceptance rate', confidence: 92, category: 'Performance', timestamp: new Date() }
  ])
  const [codeOutput, setCodeOutput] = useState<string[]>([])
  const [isRunningSimulation, setIsRunningSimulation] = useState(false)
  const [orchestrationCount, setOrchestrationCount] = useState(47)
  const [selectedTab, setSelectedTab] = useState<'orchestration' | 'intent' | 'planner' | 'dashboard'>('orchestration')

  // Simulate agent status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.type === 'ORCHESTRATOR') return agent
        
        const rand = Math.random()
        let newStatus = agent.status
        
        if (rand > 0.85 && agent.status === 'IDLE') {
          newStatus = 'PROCESSING'
        } else if (rand > 0.9 && agent.status === 'PROCESSING') {
          newStatus = 'BUSY'
        } else if (rand > 0.92 && (agent.status === 'BUSY' || agent.status === 'PROCESSING')) {
          newStatus = 'IDLE'
        }
        
        return {
          ...agent,
          status: newStatus,
          tasksCompleted: newStatus === 'IDLE' && agent.status !== 'IDLE' 
            ? agent.tasksCompleted + 1 
            : agent.tasksCompleted,
          queue: newStatus === 'PROCESSING' || newStatus === 'BUSY' 
            ? Math.min(agent.queue + (Math.random() > 0.7 ? 1 : 0), 5)
            : Math.max(0, agent.queue - 1)
        }
      }))
      
      // Update connections
      setActiveConnections(prev => {
        const newConnections = prev.map(conn => ({
          ...conn,
          active: Math.random() > 0.6
        }))
        
        // Randomly add/remove connections
        if (Math.random() > 0.95) {
          const fromAgent = agents[Math.floor(Math.random() * agents.length)]
          const toAgent = agents[Math.floor(Math.random() * agents.length)]
          if (fromAgent.id !== toAgent.id) {
            newConnections.push({ from: fromAgent.id, to: toAgent.id, active: true })
          }
        }
        
        return newConnections.slice(-8)
      })
      
      // Update context usage
      setContextUsage(prev => Math.min(95, Math.max(20, prev + (Math.random() - 0.5) * 5)))
      
      // Update orchestration count
      if (Math.random() > 0.9) {
        setOrchestrationCount(c => Math.min(100, c + 1))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [agents])

  // Initialize connections
  useEffect(() => {
    setActiveConnections([
      { from: 'orchestrator', to: 'code-agent', active: true },
      { from: 'orchestrator', to: 'data-agent', active: true },
      { from: 'orchestrator', to: 'creative-agent', active: true },
      { from: 'orchestrator', to: 'analysis-agent', active: true },
      { from: 'data-agent', to: 'analysis-agent', active: false },
      { from: 'code-agent', to: 'analysis-agent', active: false }
    ])
  }, [])

  // Intent Classification Handler
  const handleIntentClassify = useCallback(async () => {
    if (!intentInput.trim()) return
    
    setIsClassifying(true)
    setIntentResult({ status: 'analyzing', intent: '', confidence: 0, entities: [], suggestedAgent: '', reasoning: '' })
    
    // Simulate analysis phases
    await new Promise(r => setTimeout(r, 800))
    setIntentResult(prev => prev ? { ...prev, status: 'analyzing' } : null)
    
    await new Promise(r => setTimeout(r, 1200))
    
    // Generate result
    const randomIntent = intentCategories[Math.floor(Math.random() * intentCategories.length)]
    const confidence = 75 + Math.floor(Math.random() * 22)
    const entities = extractEntities(intentInput)
    const suggestedAgent = getSuggestedAgent(randomIntent)
    
    setIntentResult({
      status: 'classified',
      intent: randomIntent,
      confidence,
      entities,
      suggestedAgent,
      reasoning: `Detected keywords matching ${randomIntent.toLowerCase().replace('_', ' ')} patterns with high confidence. Entity extraction found ${entities.length} relevant items.`
    })
    
    setIsClassifying(false)
  }, [intentInput])

  // Task Decomposition Handler
  const handleTaskDecompose = useCallback(async () => {
    if (!taskInput.trim()) return
    
    setIsDecomposing(true)
    setSubtasks([])
    
    await new Promise(r => setTimeout(r, 500))
    
    const taskCount = 3 + Math.floor(Math.random() * 3)
    const newSubtasks: SubTask[] = []
    
    for (let i = 0; i < taskCount; i++) {
      await new Promise(r => setTimeout(r, 400))
      newSubtasks.push({
        id: `task-${i}`,
        name: generateSubtaskName(taskInput, i),
        status: i === 0 ? 'active' : 'pending',
        priority: i === 0 ? 'high' : i < 2 ? 'medium' : 'low',
        estimatedTime: 1 + Math.floor(Math.random() * 5),
        dependencies: i > 0 ? [`task-${i-1}`] : []
      })
      setSubtasks([...newSubtasks])
    }
    
    // Simulate completion
    for (let i = 0; i < newSubtasks.length; i++) {
      await new Promise(r => setTimeout(r, 800))
      setSubtasks(prev => prev.map((t, idx) => ({
        ...t,
        status: idx === i ? 'completed' : idx === i + 1 ? 'active' : t.status
      })))
    }
    
    setIsDecomposing(false)
  }, [taskInput])

  // Code Simulation Handler
  const handleRunSimulation = useCallback(async () => {
    setIsRunningSimulation(true)
    setCodeOutput([])
    
    const outputs = [
      '[INFO] Initializing MAOL Orchestrator v2.4.1...',
      '[INFO] Loading agent configurations...',
      '[INFO] Code Agent: Ready (847 tasks completed)',
      '[INFO] Data Agent: Processing (queue: 3)',
      '[INFO] Creative Agent: Idle',
      '[INFO] Analysis Agent: Busy (efficiency: 94%)',
      '',
      '[ROUTER] Analyzing intent: CODE_GENERATION',
      '[ROUTER] Confidence score: 87%',
      '[ROUTER] Entities extracted: API_ENDPOINT, AUTHENTICATION',
      '[ROUTER] Routing to: Code Agent',
      '',
      '[PLANNER] Decomposing task into subtasks:',
      '[PLANNER]   → Define authentication schema',
      '[PLANNER]   → Implement JWT token service',
      '[PLANNER]   → Create login/register endpoints',
      '[PLANNER]   → Add middleware protection',
      '',
      '[EXECUTION] Task #1: Define authentication schema ✓ (0.3s)',
      '[EXECUTION] Task #2: Implement JWT token service ✓ (1.2s)',
      '[EXECUTION] Task #3: Create login/register endpoints... (processing)',
      '[EXECUTION] Task #3: Create login/register endpoints ✓ (0.8s)',
      '[EXECUTION] Task #4: Add middleware protection ✓ (0.5s)',
      '',
      '[SUCCESS] All tasks completed in 2.8s',
      '[RESULT] Generated 4 files, 287 lines of code',
      '[CONTEXT] Session updated, tokens used: 1,247'
    ]
    
    for (const line of outputs) {
      await new Promise(r => setTimeout(r, 100))
      setCodeOutput(prev => [...prev, line])
    }
    
    setIsRunningSimulation(false)
  }, [])

  // Helper Functions
  function extractEntities(text: string): Array<{ type: string; value: string }> {
    const entities: Array<{ type: string; value: string }> = []
    if (/api|endpoint|rest|graphql/i.test(text)) entities.push({ type: 'TECHNOLOGY', value: 'API' })
    if (/react|vue|angular|component/i.test(text)) entities.push({ type: 'FRAMEWORK', value: 'Frontend' })
    if (/database|sql|mongo|query/i.test(text)) entities.push({ type: 'DATA_STORE', value: 'Database' })
    if (/test|unit|spec|coverage/i.test(text)) entities.push({ type: 'TASK_TYPE', value: 'Testing' })
    if (/auth|login|user|security/i.test(text)) entities.push({ type: 'DOMAIN', value: 'Authentication' })
    if (!entities.length) entities.push({ type: 'GENERAL', value: 'Development' })
    return entities
  }

  function getSuggestedAgent(intent: string): string {
    const map: Record<string, string> = {
      CODE_GENERATION: 'Code Agent',
      DEBUGGING: 'Code Agent',
      REFACTORING: 'Code Agent',
      DATA_ANALYSIS: 'Data Agent',
      OPTIMIZATION: 'Analysis Agent',
      CONTENT_CREATION: 'Creative Agent',
      DOCUMENTATION: 'Creative Agent',
      TESTING: 'Analysis Agent'
    }
    return map[intent] || 'Orchestrator'
  }

  function generateSubtaskName(task: string, index: number): string {
    const templates = [
      `Analyze requirements for: "${task.slice(0, 20)}..."`,
      `Design solution architecture`,
      `Implement core functionality`,
      `Add error handling & validation`,
      `Write unit tests`,
      `Generate documentation`,
      `Review & optimize performance`
    ]
    return templates[index % templates.length]
  }

  return (
    <div className="maol-dashboard">
      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            <span className="badge-text">LIVE DASHBOARD</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </span>
            MAOL Control Center
          </h1>
          
          <p className="hero-description">
            Multi-Agent Orchestrator Layer — Real-time visualization of intelligent agent coordination,
            intent routing, and task execution across the SciMSPT architecture.
          </p>

          <div className="hero-metrics">
            <div className="metric-card">
              <span className="metric-value">{agents.reduce((sum, a) => sum + a.tasksCompleted, 0).toLocaleString()}</span>
              <span className="metric-label">Total Tasks</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">{agents.filter(a => a.status !== 'IDLE').length}</span>
              <span className="metric-label">Active Agents</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">&lt;50ms</span>
              <span className="metric-label">Avg Latency</span>
            </div>
            <div className="metric-card metric-highlight">
              <span className="metric-value">{orchestrationCount}/100</span>
              <span className="metric-label">Free Tier</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="dashboard-tabs">
        {[
          { id: 'orchestration', label: 'Orchestration Flow', icon: '◈' },
          { id: 'intent', label: 'Intent Router', icon: '🎯' },
          { id: 'planner', label: 'Task Planner', icon: '📋' },
          { id: 'dashboard', label: 'Agent Status', icon: '◉' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${selectedTab === tab.id ? 'active' : ''}`}
            onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content Grid */}
      <main className="dashboard-grid">
        {/* LEFT COLUMN */}
        <div className="column-left">
          
          {/* Live Orchestration Visualization */}
          <section className={`panel panel-orchestration ${selectedTab === 'orchestration' ? 'panel-active' : ''}`}>
            <div className="panel-header">
              <h2 className="panel-title">
                <span className="title-indicator live"></span>
                Agent Orchestration Graph
              </h2>
              <span className="panel-status">REAL-TIME</span>
            </div>
            
            <div className="orchestration-canvas">
              <svg viewBox="0 0 400 300" className="graph-svg">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3"/>
                    <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3"/>
                  </linearGradient>
                  <radialGradient id="nodeGradient">
                    <stop offset="0%" stopColor="#a78bfa"/>
                    <stop offset="100%" stopColor="#7c3aed"/>
                  </radialGradient>
                </defs>
                
                {/* Connection Lines */}
                {activeConnections.map((conn, idx) => {
                  const fromAgent = agents.find(a => a.id === conn.from)
                  const toAgent = agents.find(a => a.id === conn.to)
                  if (!fromAgent || !toAgent) return null
                  
                  return (
                    <g key={idx}>
                      <line
                        x1={fromAgent.position.x * 4}
                        y1={fromAgent.position.y * 3}
                        x2={toAgent.position.x * 4}
                        y2={toAgent.position.y * 3}
                        stroke={conn.active ? '#a78bfa' : '#374151'}
                        strokeWidth={conn.active ? 2 : 1}
                        strokeOpacity={conn.active ? 0.8 : 0.3}
                        strokeDasharray={conn.active ? '5,5' : 'none'}
                        className={conn.active ? 'connection-active' : ''}
                      />
                      {conn.active && (
                        <circle r="3" fill="#c4b5fd" className="data-particle">
                          <animateMotion
                            dur="2s"
                            repeatCount="indefinite"
                            path={`M${fromAgent.position.x * 4},${fromAgent.position.y * 3} L${toAgent.position.x * 4},${toAgent.position.y * 3}`}
                          />
                        </circle>
                      )}
                    </g>
                  )
                })}
                
                {/* Agent Nodes */}
                {agents.map(agent => (
                  <g key={agent.id} transform={`translate(${agent.position.x * 4}, ${agent.position.y * 3})`} className="agent-node-group">
                    {/* Outer glow when active */}
                    {(agent.status === 'PROCESSING' || agent.status === 'BUSY') && (
                      <circle r="35" fill="#8b5cf6" opacity="0.2" className="pulse-ring" />
                    )}
                    
                    {/* Node circle */}
                    <circle
                      r={agent.type === 'ORCHESTRATOR' ? 30 : 24}
                      fill={agent.type === 'ORCHESTRATOR' ? 'url(#nodeGradient)' : '#1e1b4b'}
                      stroke={agent.status === 'IDLE' ? '#4c1d95' : '#8b5cf6'}
                      strokeWidth="2"
                      filter={agent.status !== 'IDLE' ? 'url(#glow)' : undefined}
                      className="node-circle"
                    />
                    
                    {/* Node icon */}
                    <text
                      textAnchor="middle"
                      dy={agent.type === 'ORCHESTRATOR' ? 5 : 4}
                      fontSize={agent.type === 'ORCHESTRATOR' ? 16 : 12}
                      fill="#e9d5ff"
                      className="node-icon"
                    >
                      {agent.type === 'CODE' ? '⚡' :
                       agent.type === 'DATA' ? '📊' :
                       agent.type === 'CREATIVE' ? '✨' :
                       agent.type === 'ANALYSIS' ? '🔍' : '🧠'}
                    </text>
                    
                    {/* Status indicator */}
                    <circle
                      cx={agent.type === 'ORCHESTRATOR' ? 22 : 18}
                      cy={agent.type === 'ORCHESTRATOR' ? -22 : -16}
                      r="5"
                      fill={
                        agent.status === 'IDLE' ? '#22c55e' :
                        agent.status === 'PROCESSING' ? '#eab308' :
                        agent.status === 'BUSY' ? '#ef4444' : '#6b7280'
                      }
                      className="status-dot"
                    />
                    
                    {/* Label */}
                    <text
                      textAnchor="middle"
                      y={agent.type === 'ORCHESTRATOR' ? 45 : 38}
                      fontSize="10"
                      fill="#c4b5fd"
                      fontWeight="500"
                    >
                      {agent.name}
                    </text>
                    <text
                      textAnchor="middle"
                      y={agent.type === 'ORCHESTRATOR' ? 56 : 48}
                      fontSize="8"
                      fill="#7c3aed"
                    >
                      {agent.status}
                    </text>
                  </g>
                ))}
              </svg>
              
              {/* Legend */}
              <div className="graph-legend">
                <div className="legend-item"><span className="legend-dot idle"></span>Idle</div>
                <div className="legend-item"><span className="legend-dot processing"></span>Processing</div>
                <div className="legend-item"><span className="legend-dot busy"></span>Busy</div>
                <div className="legend-item"><span className="legend-line"></span>Data Flow</div>
              </div>
            </div>
          </section>

          {/* Intent Router Simulator */}
          <section className={`panel panel-intent ${selectedTab === 'intent' ? 'panel-active' : ''}`}>
            <div className="panel-header">
              <h2 className="panel-title">
                <span className="title-indicator warning"></span>
                Intent Router Simulator
              </h2>
              <span className="panel-badge implemented">Implemented</span>
            </div>
            
            <div className="intent-simulator">
              <div className="input-group">
                <input
                  type="text"
                  className="intent-input"
                  placeholder="Enter a request (e.g., 'Build a REST API for user auth')"
                  value={intentInput}
                  onChange={(e) => setIntentInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleIntentClassify()}
                />
                <button 
                  className="btn-classify"
                  onClick={handleIntentClassify}
                  disabled={isClassifying || !intentInput.trim()}
                >
                  {isClassifying ? (
                    <span className="spinner"></span>
                  ) : 'Classify'}
                </button>
              </div>
              
              {intentResult && (
                <div className="intent-result">
                  <div className="result-header">
                    <span className={`result-status ${intentResult.status}`}>
                      {intentResult.status === 'analyzing' ? '🔍 Analyzing intent...' : '✓ Classified'}
                    </span>
                  </div>
                  
                  {intentResult.status === 'classified' && (
                    <div className="result-details animate-in">
                      <div className="result-row">
                        <span className="result-label">Intent Type</span>
                        <span className="result-value intent-type">{intentResult.intent}</span>
                      </div>
                      
                      <div className="result-row">
                        <span className="result-label">Confidence</span>
                        <div className="confidence-bar">
                          <div 
                            className="confidence-fill" 
                            style={{width: `${intentResult.confidence}%`}}
                          ></div>
                          <span className="confidence-text">{intentResult.confidence}%</span>
                        </div>
                      </div>
                      
                      <div className="result-row">
                        <span className="result-label">Entities</span>
                        <div className="entity-tags">
                          {intentResult.entities.map((ent, i) => (
                            <span key={i} className="entity-tag">
                              <span className="entity-type">{ent.type}</span>
                              {ent.value}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="result-row">
                        <span className="result-label">Routed To</span>
                        <span className="result-value agent-assigned">{intentResult.suggestedAgent}</span>
                      </div>
                      
                      <div className="reasoning-box">
                        <span className="reasoning-label">Routing Reasoning:</span>
                        <p className="reasoning-text">{intentResult.reasoning}</p>
                      </div>
                    </div>
                  )}
                  
                  {intentResult.status === 'analyzing' && (
                    <div className="analyzing-animation">
                      <div className="scan-line"></div>
                      <div className="analyzing-steps">
                        <span className="step active">Tokenizing input...</span>
                        <span className="step">Extracting features...</span>
                        <span className="step">Matching patterns...</span>
                        <span className="step">Calculating confidence...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {!intentResult && !isClassifying && (
                <div className="intent-placeholder">
                  <span className="placeholder-icon">🎯</span>
                  <p>Enter a request above to see real-time intent classification</p>
                  <div className="sample-requests">
                    <span className="sample-label">Try:</span>
                    {sampleTasks.slice(0, 3).map((task, i) => (
                      <button 
                        key={i} 
                        className="sample-btn"
                        onClick={() => setIntentInput(task)}
                      >
                        {task}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Task Planner Visualization */}
          <section className={`panel panel-planner ${selectedTab === 'planner' ? 'panel-active' : ''}`}>
            <div className="panel-header">
              <h2 className="panel-title">
                <span className="title-indicator progress"></span>
                Task Planner
              </h2>
              <span className="panel-badge in-progress">In Progress</span>
            </div>
            
            <div className="planner-container">
              <div className="planner-input">
                <textarea
                  className="task-textarea"
                  placeholder="Enter a complex task to decompose (e.g., 'Build a complete e-commerce platform with user authentication, product catalog, shopping cart, and payment processing')"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  rows={3}
                />
                <button 
                  className="btn-decompose"
                  onClick={handleTaskDecompose}
                  disabled={isDecomposing || !taskInput.trim()}
                >
                  {isDecomposing ? 'Decomposing...' : 'Decompose Task'}
                </button>
              </div>
              
              {subtasks.length > 0 && (
                <div className="subtasks-container">
                  <div className="gantt-header">
                    <span>Task Decomposition</span>
                    <span className="task-count">{subtasks.length} subtasks</span>
                  </div>
                  
                  {/* Gantt-style Timeline */}
                  <div className="gantt-chart">
                    {subtasks.map((task, index) => (
                      <div key={task.id} className={`gantt-row ${task.status}`}>
                        <div className="task-info">
                          <span className={`task-status-indicator ${task.status}`}></span>
                          <span className="task-name">{task.name}</span>
                          <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                        </div>
                        <div className="timeline-bar-container">
                          <div 
                            className={`timeline-bar ${task.status}`}
                            style={{
                              width: `${task.estimatedTime * 15}%`,
                              marginLeft: `${index * 18}%`
                            }}
                          >
                            <span className="time-label">{task.estimatedTime}s</span>
                          </div>
                        </div>
                        <span className="task-time">{task.estimatedTime}s est.</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Dependency Graph Mini */}
                  <div className="dependency-graph">
                    <span className="dep-label">Dependency Flow:</span>
                    <div className="dep-nodes">
                      {subtasks.map((task, i) => (
                        <div key={task.id} className={`dep-node ${task.status}`}>
                          <span className="dep-node-id">{i + 1}</span>
                          {i < subtasks.length - 1 && (
                            <svg className="dep-arrow" width="24" height="12">
                              <path d="M0,6 L18,6 M14,2 L18,6 L14,10" 
                                stroke={task.status === 'completed' ? '#22c55e' : '#4c1d95'} 
                                strokeWidth="2" fill="none"/>
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {subtasks.length === 0 && !isDecomposing && (
                <div className="planner-placeholder">
                  <span className="placeholder-icon">📋</span>
                  <p>Enter a complex task to see automatic decomposition</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="column-right">
          
          {/* Agent Status Dashboard */}
          <section className={`panel panel-dashboard ${selectedTab === 'dashboard' ? 'panel-active' : ''}`}>
            <div className="panel-header">
              <h2 className="panel-title">
                <span className="title-indicator info"></span>
                Agent Status Dashboard
              </h2>
              <span className="refresh-indicator">Auto-refresh: 3s</span>
            </div>
            
            <div className="agents-list">
              {agents.filter(a => a.type !== 'ORCHESTRATOR').map(agent => (
                <div key={agent.id} className={`agent-card ${agent.status.toLowerCase()}`}>
                  <div className="agent-card-header">
                    <div className="agent-avatar">
                      <span className="avatar-icon">
                        {agent.type === 'CODE' ? '⚡' :
                         agent.type === 'DATA' ? '📊' :
                         agent.type === 'CREATIVE' ? '✨' : '🔍'}
                      </span>
                      <span className={`avatar-status ${agent.status.toLowerCase()}`}></span>
                    </div>
                    <div className="agent-meta">
                      <h3 className="agent-name">{agent.name}</h3>
                      <span className={`status-badge ${agent.status.toLowerCase()}`}>
                        {agent.status === 'PROCESSING' && <span className="status-pulse"></span>}
                        {agent.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="agent-metrics">
                    <div className="metric">
                      <span className="metric-value-small">{agent.tasksCompleted}</span>
                      <span className="metric-label-small">Completed</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value-small">{agent.avgTime}s</span>
                      <span className="metric-label-small">Avg Time</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value-small">{agent.queue}</span>
                      <span className="metric-label-small">Queue</span>
                    </div>
                    {agent.efficiency && (
                      <div className="metric">
                        <span className="metric-value-small">{agent.efficiency}%</span>
                        <span className="metric-label-small">Efficiency</span>
                      </div>
                    )}
                  </div>
                  
                  {agent.currentTask && (
                    <div className="current-task">
                      <span className="current-task-label">Current:</span>
                      <span className="current-task-text">{agent.currentTask}</span>
                    </div>
                  )}
                  
                  {/* Sparkline simulation */}
                  <div className="sparkline-container">
                    <svg width="100%" height="24" className="sparkline">
                      <polyline
                        points={generateSparklinePoints()}
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Context Manager Panel */}
          <section className="panel panel-context">
            <div className="panel-header">
              <h2 className="panel-title">
                <span className="title-indicator neutral"></span>
                Context Manager
              </h2>
              <span className="panel-badge designed">Designed</span>
            </div>
            
            <div className="context-panel">
              {/* Context Window Meter */}
              <div className="context-meter">
                <div className="meter-header">
                  <span>Context Window Usage</span>
                  <span className="meter-value">{Math.round(contextUsage)}%</span>
                </div>
                <div className="meter-bar">
                  <div 
                    className={`meter-fill ${contextUsage > 80 ? 'warning' : ''}`}
                    style={{width: `${contextUsage}%`}}
                  ></div>
                </div>
                <div className="meter-footer">
                  <span>{Math.round(contextUsage * 80)}/8000 tokens</span>
                  <span>{contextUsage > 80 ? '⚠️ Approaching limit' : '✓ Optimal range'}</span>
                </div>
              </div>
              
              {/* Session History */}
              <div className="session-history">
                <span className="history-label">Recent Messages</span>
                <div className="messages-list">
                  {contextMessages.slice(-4).map((msg, i) => (
                    <div key={i} className={`message ${msg.role}`}>
                      <span className="message-role">{msg.role}</span>
                      <span className="message-text">{msg.content.slice(0, 40)}...</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Entity Memory */}
              <div className="entity-memory">
                <span className="memory-label">Tracked Entities</span>
                <div className="entity-chips">
                  <span className="chip">User_Preference: TypeScript</span>
                  <span className="chip">Domain: Architecture</span>
                  <span className="chip">Topic: MAOL</span>
                  <span class="chip">Session: Active</span>
                </div>
              </div>
            </div>
          </section>

          {/* Memory Synthesizer Insights */}
          <section className="panel panel-memory">
            <div className="panel-header">
              <h2 className="panel-title">
                <span className="title-indicator success"></span>
                Memory Synthesizer
              </h2>
              <span className="insight-count">{insights.length} insights</span>
            </div>
            
            <div className="memory-panel">
              <div className="knowledge-growth">
                <span className="growth-label">Knowledge Graph Growth</span>
                <div className="growth-bar">
                  <div className="growth-fill" style={{width: '68%'}}></div>
                </div>
                <span className="growth-value">2,847 nodes · 12,456 edges</span>
              </div>
              
              <div className="insights-list">
                {insights.map(insight => (
                  <div key={insight.id} className="insight-card">
                    <div className="insight-header">
                      <span className="insight-category">{insight.category}</span>
                      <span className="insight-confidence">{insight.confidence}%</span>
                    </div>
                    <p className="insight-text">{insight.text}</p>
                    <div className="confidence-mini-bar">
                      <div style={{width: `${insight.confidence}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pattern-categories">
                <span className="categories-label">Pattern Categories</span>
                <div className="category-bars">
                  <div className="category-item">
                    <span>Preferences</span><div className="cat-bar"><div style={{width: '89%'}}></div></div><span>89</span>
                  </div>
                  <div className="category-item">
                    <span>Patterns</span><div className="cat-bar"><div style={{width: '76%'}}></div></div><span>76</span>
                  </div>
                  <div className="category-item">
                    <span>Performance</span><div className="cat-bar"><div style={{width: '92%'}}></div></div><span>92</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Code Playground Section */}
      <section className="panel panel-codeplayground full-width">
        <div className="panel-header">
          <h2 className="panel-title">
            <span className="title-indicator code"></span>
            Interactive Code Playground
          </h2>
          <button 
            className="btn-run"
            onClick={handleRunSimulation}
            disabled={isRunningSimulation}
          >
            {isRunningSimulation ? (
              <>
                <span className="spinner-small"></span>
                Running...
              </>
            ) : (
              <>▶ Run Simulation</>
            )}
          </button>
        </div>
        
        <div className="playground-container">
          <div className="code-editor">
            <div className="editor-header">
              <span className="file-name">maol-orchestration.ts</span>
              <span className="file-type">TypeScript</span>
            </div>
            <pre className="code-content">
              <code>{`// MAOL Orchestrator - Production Integration Example
import { IntentRouter, TaskPlanner, AgentPool } from '@scimspt/maol'

// Initialize the Multi-Agent Orchestrator Layer
const maol = new MAOLOrchestrator({
  maxConcurrentTasks: 10,
  enableMemorySynthesis: true,
  contextWindowTokens: 8000,
})

// Configure intent classification
const router = new IntentRouter({
  model: 'classification-v2.4',
  minConfidence: 0.7,
  enableEntityExtraction: true,
  supportedIntents: [
    'CODE_GENERATION', 'DATA_ANALYSIS',
    'CONTENT_CREATION', 'DEBUGGING'
  ],
})

// Register specialized agents
const agentPool = new AgentPool()
agentPool.register(new CodeAgent({ maxTasks: 5 }))
agentPool.register(new DataAgent({ cacheEnabled: true }))
agentPool.register(new CreativeAgent({ style: 'professional' }))
agentPool.register(new AnalysisAgent({ deepMode: true }))

// Main orchestration loop
async function orchestrate(userRequest: string) {
  // Step 1: Classify user intent
  const intent = await router.classify(userRequest)
  
  console.log(\`[ROUTER] Intent: \${intent.primaryIntent}\`)
  console.log(\`[ROUTER] Confidence: \${(intent.confidence * 100).toFixed(1)}%\`)
  
  // Step 2: Plan task decomposition
  const plan = await TaskPlanner.decompose(intent)
  
  console.log(\`[PLANNER] \${plan.subtasks.length} subtasks created\`)
  
  // Step 3: Execute via agent pool
  const results = []
  for (const subtask of plan.subtasks) {
    const agent = agentPool.acquire(subtask.requiredCapability)
    const result = await agent.execute(subtask)
    results.push(result)
    agentPool.release(agent)
  }
  
  // Step 4: Synthesize results & update memory
  return await maol.synthesize(results, { storeMemory: true })
}`}</code>
            </pre>
          </div>
          
          <div className="output-console">
            <div className="console-header">
              <span className="console-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </span>
              <span className="console-title">Output Console</span>
            </div>
            <div className="console-output">
              {codeOutput.length === 0 ? (
                <div className="console-placeholder">
                  <span>Click &quot;Run Simulation&quot; to execute the orchestration demo</span>
                </div>
              ) : (
                codeOutput.map((line, i) => (
                  <div key={i} className={`output-line ${
                    line.includes('[SUCCESS]') ? 'success' :
                    line.includes('[ERROR]') ? 'error' :
                    line.includes('[INFO]') ? 'info' :
                    line.includes('[ROUTER]') ? 'router' :
                    line.includes('[PLANNER]') ? 'planner' :
                    line.includes('[EXECUTION]') ? 'execution' : ''
                  }`}>
                    <span className="line-number">{i + 1}</span>
                    <span className="line-content">{line}</span>
                  </div>
                ))
              )}
              {isRunningSimulation && (
                <div className="output-line cursor-line">
                  <span className="cursor-blink">▋</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Status & Limits Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="component-statuses">
            <h3>Component Status</h3>
            <div className="statuses-grid">
              <div className="status-item implemented">
                <span className="status-dot-green"></span>
                Intent Router — Implemented
              </div>
              <div className="status-item in-progress">
                <span className="status-dot-yellow"></span>
                Task Planner — In Progress
              </div>
              <div className="status-item designed">
                <span className="status-dot-blue"></span>
                Context Manager — Designed
              </div>
              <div className="status-item designed">
                <span className="status-dot-blue"></span>
                Memory Synthesizer — Designed
              </div>
            </div>
          </div>
          
          <div className="tier-info">
            <div className="free-tier">
              <span className="tier-label">Free Tier</span>
              <span className="tier-usage">
                <strong>{orchestrationCount}/100</strong> orchestrations today
              </span>
              <div className="tier-progress">
                <div className="tier-progress-fill" style={{width: `${orchestrationCount}%`}}></div>
              </div>
            </div>
            
            <div className="pro-features">
              <span className="pro-label">✨ PRO Features</span>
              <ul className="pro-list">
                <li>Advanced analytics dashboard</li>
                <li>Custom agent creation</li>
                <li>Priority task routing</li>
                <li>Extended context window</li>
              </ul>
              <a 
                href="https://github.com/sponsors/testdemoqwenai2025-creator" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-upgrade"
              >
                Upgrade to PRO →
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-nav">
          <Link href="/" className="btn-back">
            ← Back to Overview
          </Link>
          <a 
            href="https://github.com/testdemoqwenai2025-creator/Demo3SciMSPT/tree/feature/maol-intent-router/src/maol"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-source"
          >
            View Source Code →
          </a>
        </div>
      </footer>

      <style jsx>{`
        /* ===== BASE STYLES ===== */
        .maol-dashboard {
          min-height: 100vh;
          background: linear-gradient(180deg, #0f0a1a 0%, #130b1e 50%, #0d0815 100%);
          color: #e9d5ff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }

        /* ===== HERO SECTION ===== */
        .dashboard-hero {
          padding: 3rem 2rem 2rem;
          text-align: center;
          border-bottom: 1px solid rgba(139, 92, 246, 0.15);
          background: radial-gradient(ellipse at top, rgba(139, 92, 246, 0.15) 0%, transparent 60%);
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.3);
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          margin-bottom: 1.5rem;
        }

        .badge-pulse {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6); }
          50% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
        }

        .badge-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: #a78bfa;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #e9d5ff 0%, #a78bfa 50%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .title-icon {
          display: flex;
          color: #8b5cf6;
        }

        .hero-description {
          font-size: 1.1rem;
          color: #a78bfa;
          max-width: 700px;
          margin: 0 auto 2rem;
          line-height: 1.7;
          opacity: 0.9;
        }

        .hero-metrics {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .metric-card {
          background: rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.2);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          text-align: center;
          min-width: 120px;
        }

        .metric-highlight {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.1));
          border-color: rgba(168, 85, 247, 0.4);
        }

        .metric-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #e9d5ff;
        }

        .metric-label {
          font-size: 0.75rem;
          color: #a78bfa;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        /* ===== NAVIGATION TABS ===== */
        .dashboard-tabs {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          padding: 1.5rem 2rem 0;
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
          overflow-x: auto;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 8px;
          color: #a78bfa;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .tab-btn:hover {
          background: rgba(139, 92, 246, 0.1);
          color: #e9d5ff;
        }

        .tab-btn.active {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.4);
          color: #fff;
        }

        .tab-icon {
          font-size: 1rem;
        }

        /* ===== MAIN GRID ===== */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          padding: 1.5rem 2rem;
          max-width: 1600px;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        .column-left, .column-right {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* ===== PANEL STYLES ===== */
        .panel {
          background: linear-gradient(135deg, rgba(30, 20, 50, 0.9), rgba(20, 10, 35, 0.95));
          border: 1px solid rgba(139, 92, 246, 0.15);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .panel:hover {
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);
        }

        .panel-active {
          border-color: rgba(139, 92, 246, 0.4);
          box-shadow: 0 0 40px rgba(139, 92, 246, 0.15);
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
          background: rgba(139, 92, 246, 0.05);
        }

        .panel-title {
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #e9d5ff;
        }

        .title-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .title-indicator.live { background: #22c55e; animation: pulse-glow 2s ease-in-out infinite; }
        .title-indicator.warning { background: #eab308; }
        .title-indicator.progress { background: #3b82f6; animation: pulse-glow 1.5s ease-in-out infinite; }
        .title-indicator.info { background: #8b5cf6; }
        .title-indicator.neutral { background: #6b7280; }
        .title-indicator.success { background: #10b981; }
        .title-indicator.code { background: #ec4899; }

        .panel-status {
          font-size: 0.7rem;
          color: #22c55e;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .panel-badge {
          font-size: 0.65rem;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .panel-badge.implemented { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
        .panel-badge.in-progress { background: rgba(234, 179, 8, 0.2); color: #facc15; }
        .panel-badge.designed { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }

        .refresh-indicator {
          font-size: 0.7rem;
          color: #6b7280;
        }

        .insight-count {
          font-size: 0.75rem;
          color: #a78bfa;
        }

        /* ===== ORCHESTRATION CANVAS ===== */
        .orchestration-canvas {
          padding: 1rem;
          position: relative;
          min-height: 320px;
        }

        .graph-svg {
          width: 100%;
          height: 280px;
        }

        .connection-active {
          animation: data-flow 2s linear infinite;
        }

        @keyframes data-flow {
          0% { stroke-opacity: 0.4; }
          50% { stroke-opacity: 1; }
          100% { stroke-opacity: 0.4; }
        }

        .data-particle {
          filter: drop-shadow(0 0 4px #c4b5fd);
        }

        .pulse-ring {
          animation: ring-pulse 2s ease-out infinite;
        }

        @keyframes ring-pulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .node-circle {
          transition: all 0.3s ease;
        }

        .agent-node-group:hover .node-circle {
          filter: url(#glow);
          transform: scale(1.1);
        }

        .status-dot {
          animation: dot-pulse 2s ease-in-out infinite;
        }

        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .graph-legend {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(139, 92, 246, 0.1);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          color: #a78bfa;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .legend-dot.idle { background: #22c55e; }
        .legend_dot.processing { background: #eab308; }
        .legend-dot.busy { background: #ef4444; }

        .legend-line {
          width: 16px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #a78bfa, transparent);
        }

        /* ===== INTENT SIMULATOR ===== */
        .intent-simulator {
          padding: 1.25rem;
        }

        .input-group {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .intent-input {
          flex: 1;
          background: rgba(15, 8, 25, 0.8);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #e9d5ff;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .intent-input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
        }

        .intent-input::placeholder {
          color: #6b5a8a;
        }

        .btn-classify {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          color: white;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-classify:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        .btn-classify:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .intent-result {
          background: rgba(15, 8, 25, 0.6);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          overflow: hidden;
        }

        .result-header {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
        }

        .result-status {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .result-status.analyzing { color: #facc15; }
        .result-status.classified { color: #4ade80; }

        .result-details {
          padding: 1rem;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .result-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 0;
          border-bottom: 1px solid rgba(139, 92, 246, 0.08);
        }

        .result-label {
          font-size: 0.8rem;
          color: #a78bfa;
        }

        .result-value {
          font-size: 0.9rem;
          font-weight: 500;
          color: #e9d5ff;
        }

        .intent-type {
          color: #c4b5fd;
          font-family: monospace;
          background: rgba(139, 92, 246, 0.15);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .agent-assigned {
          color: #4ade80;
        }

        .confidence-bar {
          flex: 1;
          max-width: 150px;
          height: 6px;
          background: rgba(139, 92, 246, 0.2);
          border-radius: 3px;
          position: relative;
          margin-left: 1rem;
        }

        .confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #a78bfa);
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .confidence-text {
          position: absolute;
          right: 0;
          top: -18px;
          font-size: 0.7rem;
          color: #a78bfa;
        }

        .entity-tags {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .entity-tag {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .entity-type {
          color: #60a5fa;
          font-size: 0.65rem;
          text-transform: uppercase;
        }

        .reasoning-box {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: rgba(139, 92, 246, 0.08);
          border-radius: 8px;
          border-left: 3px solid #8b5cf6;
        }

        .reasoning-label {
          font-size: 0.7rem;
          color: #a78bfa;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .reasoning-text {
          margin-top: 0.4rem;
          font-size: 0.85rem;
          color: #c4b5fd;
          line-height: 1.5;
        }

        .analyzing-animation {
          padding: 2rem 1rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .scan-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
          animation: scan 1.5s ease-in-out infinite;
        }

        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .analyzing-steps {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .step {
          font-size: 0.85rem;
          color: #6b5a8a;
          transition: all 0.3s ease;
        }

        .step.active {
          color: #facc15;
          animation: stepPulse 1s ease-in-out infinite;
        }

        @keyframes stepPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .intent-placeholder {
          text-align: center;
          padding: 2rem 1rem;
        }

        .placeholder-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 0.75rem;
        }

        .intent-placeholder p {
          color: #6b5a8a;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .sample-requests {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .sample-label {
          font-size: 0.75rem;
          color: #6b5a8a;
        }

        .sample-btn {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 6px;
          padding: 0.35rem 0.6rem;
          color: #a78bfa;
          font-size: 0.72rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sample-btn:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.4);
        }

        /* ===== TASK PLANNER ===== */
        .planner-container {
          padding: 1.25rem;
        }

        .planner-input {
          margin-bottom: 1rem;
        }

        .task-textarea {
          width: 100%;
          background: rgba(15, 8, 25, 0.8);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 8px;
          padding: 0.75rem;
          color: #e9d5ff;
          font-size: 0.85rem;
          resize: vertical;
          outline: none;
          font-family: inherit;
          margin-bottom: 0.75rem;
        }

        .task-textarea:focus {
          border-color: #8b5cf6;
        }

        .task-textarea::placeholder {
          color: #6b5a8a;
        }

        .btn-decompose {
          width: 100%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          border-radius: 8px;
          padding: 0.75rem;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-decompose:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .btn-decompose:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .subtasks-container {
          animation: slideIn 0.3s ease-out;
        }

        .gantt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-weight: 600;
          color: #e9d5ff;
        }

        .task-count {
          font-size: 0.8rem;
          color: #a78bfa;
          font-weight: normal;
        }

        .gantt-chart {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .gantt-row {
          display: grid;
          grid-template-columns: 1fr 2fr auto;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(139, 92, 246, 0.08);
        }

        .task-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .task-status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .task-status-indicator.pending { background: #6b7280; }
        .task-status-indicator.active { background: #facc15; animation: pulse-glow 1s ease-in-out infinite; }
        .task-status-indicator.completed { background: #22c55e; }

        .task-name {
          font-size: 0.8rem;
          color: #c4b5fd;
        }

        .priority-badge {
          font-size: 0.6rem;
          padding: 0.15rem 0.4rem;
          border-radius: 3px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .priority-badge.high { background: rgba(239, 68, 68, 0.2); color: #f87171; }
        .priority-badge.medium { background: rgba(234, 179, 8, 0.2); color: #facc15; }
        .priority-badge.low { background: rgba(34, 197, 94, 0.2); color: #4ade80; }

        .timeline-bar-container {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 4px;
          height: 24px;
          position: relative;
        }

        .timeline-bar {
          height: 100%;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 0.4rem;
          transition: all 0.3s ease;
        }

        .timeline-bar.pending { background: rgba(107, 114, 128, 0.4); }
        .timeline-bar.active { background: linear-gradient(90deg, #3b82f6, #8b5cf6); animation: barPulse 1.5s ease-in-out infinite; }
        .timeline-bar.completed { background: linear-gradient(90deg, #22c55e, #4ade80); }

        @keyframes barPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .time-label {
          font-size: 0.65rem;
          color: white;
          font-weight: 600;
        }

        .task-time {
          font-size: 0.75rem;
          color: #6b5a8a;
          width: 45px;
          text-align: right;
        }

        .dependency-graph {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(139, 92, 246, 0.1);
        }

        .dep-label {
          font-size: 0.75rem;
          color: #a78bfa;
          display: block;
          margin-bottom: 0.5rem;
        }

        .dep-nodes {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
        }

        .dep-node {
          display: flex;
          align-items: center;
        }

        .dep-node-id {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(139, 92, 246, 0.2);
          border: 2px solid #4c1d95;
          color: #e9d5ff;
        }

        .dep-node.completed .dep-node-id {
          background: rgba(34, 197, 94, 0.2);
          border-color: #22c55e;
          color: #4ade80;
        }

        .dep-node.active .dep-node-id {
          background: rgba(234, 179, 8, 0.2);
          border-color: #eab308;
          color: #facc15;
          animation: pulse-glow 1s ease-in-out infinite;
        }

        .dep-arrow {
          margin: 0 0.25rem;
        }

        .planner-placeholder {
          text-align: center;
          padding: 2rem 1rem;
        }

        .planner-placeholder .placeholder-icon {
          font-size: 2.5rem;
        }

        .planner-placeholder p {
          color: #6b5a8a;
          font-size: 0.9rem;
        }

        /* ===== AGENT STATUS DASHBOARD ===== */
        .agents-list {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 480px;
          overflow-y: auto;
        }

        .agent-card {
          background: rgba(15, 8, 25, 0.6);
          border: 1px solid rgba(139, 92, 246, 0.15);
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .agent-card:hover {
          border-color: rgba(139, 92, 246, 0.3);
          transform: translateX(4px);
        }

        .agent-card.processing { border-left: 3px solid #eab308; }
        .agent-card.busy { border-left: 3px solid #ef4444; }
        .agent-card.idle { border-left: 3px solid #22c55e; }

        .agent-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .agent-avatar {
          position: relative;
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #4c1d95, #7c3aed);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-icon {
          font-size: 1.2rem;
        }

        .avatar-status {
          position: absolute;
          bottom: -3px;
          right: -3px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid #130b1e;
        }

        .avatar-status.idle { background: #22c55e; }
        .avatar-status.processing { background: #eab308; animation: pulse-glow 1.5s ease-in-out infinite; }
        .avatar-status.busy { background: #ef4444; animation: pulse-glow 1s ease-in-out infinite; }

        .agent-meta {
          flex: 1;
        }

        .agent-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #e9d5ff;
          margin-bottom: 0.2rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.idle { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
        .status-badge.processing { background: rgba(234, 179, 8, 0.15); color: #facc15; }
        .status-badge.busy { background: rgba(239, 68, 68, 0.15); color: #f87171; }

        .status-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse-glow 1s ease-in-out infinite;
        }

        .agent-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .metric {
          text-align: center;
        }

        .metric-value-small {
          display: block;
          font-size: 0.9rem;
          font-weight: 700;
          color: #e9d5ff;
        }

        .metric-label-small {
          font-size: 0.65rem;
          color: #6b5a8a;
          text-transform: uppercase;
        }

        .current-task {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.5rem;
          background: rgba(139, 92, 246, 0.08);
          border-radius: 6px;
          margin-bottom: 0.5rem;
        }

        .current-task-label {
          font-size: 0.7rem;
          color: #a78bfa;
          white-space: nowrap;
        }

        .current-task-text {
          font-size: 0.8rem;
          color: #c4b5fd;
        }

        .sparkline-container {
          height: 24px;
        }

        .sparkline {
          display: block;
        }

        /* ===== CONTEXT MANAGER ===== */
        .context-panel {
          padding: 1.25rem;
        }

        .context-meter {
          margin-bottom: 1.25rem;
        }

        .meter-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
        }

        .meter-header span:first-child { color: #e9d5ff; }
        .meter-value { color: #a78bfa; font-weight: 600; }

        .meter-bar {
          height: 8px;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 4px;
          overflow: hidden;
        }

        .meter-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #a78bfa);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .meter-fill.warning {
          background: linear-gradient(90deg, #eab308, #f59e0b);
        }

        .meter-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 0.4rem;
          font-size: 0.7rem;
          color: #6b5a8a;
        }

        .session-history {
          margin-bottom: 1.25rem;
        }

        .history-label {
          font-size: 0.8rem;
          color: #a78bfa;
          display: block;
          margin-bottom: 0.5rem;
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: rgba(15, 8, 25, 0.5);
          border-radius: 6px;
          font-size: 0.8rem;
        }

        .message-role {
          font-size: 0.65rem;
          padding: 0.15rem 0.4rem;
          border-radius: 3px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .message.system .message-role { background: rgba(107, 114, 128, 0.3); color: #9ca3af; }
        .message.user .message-role { background: rgba(59, 130, 246, 0.3); color: #60a5fa; }
        .message.assistant .message-role { background: rgba(34, 197, 94, 0.3); color: #4ade80; }

        .message-text {
          color: #c4b5fd;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .entity-memory {
          margin-bottom: 1rem;
        }

        .memory-label {
          font-size: 0.8rem;
          color: #a78bfa;
          display: block;
          margin-bottom: 0.5rem;
        }

        .entity-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .chip {
          font-size: 0.7rem;
          padding: 0.3rem 0.6rem;
          background: rgba(139, 92, 246, 0.12);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 4px;
          color: #c4b5fd;
        }

        /* ===== MEMORY SYNTHESIZER ===== */
        .memory-panel {
          padding: 1.25rem;
        }

        .knowledge-growth {
          margin-bottom: 1.25rem;
        }

        .growth-label {
          font-size: 0.8rem;
          color: #a78bfa;
          display: block;
          margin-bottom: 0.5rem;
        }

        .growth-bar {
          height: 6px;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.4rem;
        }

        .growth-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 3px;
        }

        .growth-value {
          font-size: 0.7rem;
          color: #6b5a8a;
        }

        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .insight-card {
          background: rgba(15, 8, 25, 0.5);
          border: 1px solid rgba(139, 92, 246, 0.12);
          border-radius: 8px;
          padding: 0.75rem;
        }

        .insight-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.4rem;
        }

        .insight-category {
          font-size: 0.7rem;
          padding: 0.15rem 0.4rem;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 3px;
          color: #a78bfa;
          text-transform: uppercase;
        }

        .insight-confidence {
          font-size: 0.75rem;
          font-weight: 600;
          color: #4ade80;
        }

        .insight-text {
          font-size: 0.85rem;
          color: #c4b5fd;
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }

        .confidence-mini-bar {
          height: 3px;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 2px;
          overflow: hidden;
        }

        .confidence-mini-bar div {
          height: 100%;
          background: #4ade80;
          border-radius: 2px;
        }

        .pattern-categories {
          margin-top: 0.5rem;
        }

        .categories-label {
          font-size: 0.8rem;
          color: #a78bfa;
          display: block;
          margin-bottom: 0.5rem;
        }

        .category-bars {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .category-item {
          display: grid;
          grid-template-columns: 70px 1fr 30px;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
        }

        .category-item span:first-child { color: #a78bfa; }
        .category-item span:last-child { color: #c4b5ff; text-align: right; }

        .cat-bar {
          height: 6px;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 3px;
          overflow: hidden;
        }

        .cat-bar div {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #c4b5fd);
          border-radius: 3px;
        }

        /* ===== CODE PLAYGROUND ===== */
        .panel-codeplayground {
          margin: 0 2rem 1.5rem;
          max-width: calc(1600px - 4rem);
          margin-left: auto;
          margin-right: auto;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        @media (max-width: 1024px) {
          .panel-codeplayground {
            margin: 0 1rem 1.5rem;
            max-width: none;
          }
        }

        .btn-run {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          border-radius: 8px;
          padding: 0.6rem 1.25rem;
          color: white;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-run:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .btn-run:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner-small {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .playground-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }

        @media (max-width: 900px) {
          .playground-container {
            grid-template-columns: 1fr;
          }
        }

        .code-editor {
          border-right: 1px solid rgba(139, 92, 246, 0.15);
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 1rem;
          background: rgba(15, 8, 25, 0.8);
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
        }

        .file-name {
          font-size: 0.8rem;
          color: #e9d5ff;
          font-family: 'Fira Code', monospace;
        }

        .file-type {
          font-size: 0.7rem;
          color: #6b5a8a;
          padding: 0.2rem 0.5rem;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 4px;
        }

        .code-content {
          padding: 1rem;
          margin: 0;
          background: #0d0a14;
          overflow-x: auto;
          max-height: 380px;
          overflow-y: auto;
        }

        .code-content code {
          font-family: 'Fira Code', 'JetBrains Mono', Consolas, monospace;
          font-size: 0.8rem;
          line-height: 1.6;
          color: #c4b5fd;
          white-space: pre;
        }

        .output-console {
          display: flex;
          flex-direction: column;
        }

        .console-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          background: rgba(15, 8, 25, 0.8);
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
        }

        .console-dots {
          display: flex;
          gap: 4px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot.red { background: #ef4444; }
        .dot.yellow { background: #eab308; }
        .dot.green { background: #22c55e; }

        .console-title {
          font-size: 0.8rem;
          color: #a78bfa;
        }

        .console-output {
          flex: 1;
          padding: 1rem;
          background: #0a0810;
          overflow-y: auto;
          max-height: 340px;
          font-family: 'Fira Code', monospace;
          font-size: 0.78rem;
        }

        .console-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 200px;
          color: #4a3a5a;
        }

        .output-line {
          display: flex;
          gap: 0.75rem;
          padding: 2px 0;
          line-height: 1.5;
        }

        .line-number {
          color: #4a3a5a;
          min-width: 24px;
          text-align: right;
          user-select: none;
        }

        .line-content {
          color: #c4b5fd;
        }

        .output-line.success .line-content { color: #4ade80; }
        .output-line.error .line-content { color: #f87171; }
        .output-line.info .line-content { color: #60a5fa; }
        .output-line.router .line-content { color: #c084fc; }
        .output-line.planner .line-content { color: #38bdf8; }
        .output-line.execution .line-content { color: #facc15; }

        .cursor-line {
          padding: 0;
        }

        .cursor-blink {
          color: #8b5cf6;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* ===== FOOTER ===== */
        .dashboard-footer {
          margin: 0 2rem 2rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(30, 20, 50, 0.8), rgba(20, 10, 35, 0.9));
          border: 1px solid rgba(139, 92, 246, 0.15);
          border-radius: 16px;
          max-width: calc(1600px - 4rem);
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 1024px) {
          .dashboard-footer {
            margin: 0 1rem 1.5rem;
            max-width: none;
          }
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
          }
        }

        .component-statuses h3,
        .tier-info > *:first-child {
          font-size: 0.9rem;
          color: #e9d5ff;
          margin-bottom: 0.75rem;
        }

        .statuses-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #a78bfa;
        }

        .status-dot-green, .status-dot-yellow, .status-dot-blue {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-dot-green { background: #22c55e; }
        .status-dot-yellow { background: #eab308; }
        .status-dot-blue { background: #3b82f6; }

        .tier-info {
          display: flex;
          gap: 2rem;
        }

        @media (max-width: 640px) {
          .tier-info {
            flex-direction: column;
            gap: 1.5rem;
          }
        }

        .free-tier {
          flex: 1;
        }

        .tier-label {
          display: block;
          font-size: 0.8rem;
          color: #a78bfa;
          margin-bottom: 0.4rem;
        }

        .tier-usage {
          display: block;
          font-size: 0.9rem;
          color: #e9d5ff;
          margin-bottom: 0.5rem;
        }

        .tier-usage strong {
          color: #c4b5fd;
        }

        .tier-progress {
          height: 6px;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 3px;
          overflow: hidden;
        }

        .tier-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #a78bfa);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .pro-features {
          flex: 1;
        }

        .pro-label {
          display: block;
          font-size: 0.85rem;
          color: #facc15;
          margin-bottom: 0.5rem;
        }

        .pro-list {
          list-style: none;
          padding: 0;
          margin: 0 0 0.75rem;
        }

        .pro-list li {
          font-size: 0.8rem;
          color: #a78bfa;
          padding: 0.2rem 0;
          padding-left: 1rem;
          position: relative;
        }

        .pro-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #4ade80;
        }

        .btn-upgrade {
          display: inline-block;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #000;
          font-weight: 600;
          font-size: 0.85rem;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-upgrade:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }

        .footer-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        @media (max-width: 640px) {
          .footer-nav {
            flex-direction: column;
            gap: 1rem;
          }
        }

        .btn-back, .btn-source {
          padding: 0.6rem 1.25rem;
          border-radius: 8px;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-back {
          background: transparent;
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #a78bfa;
        }

        .btn-back:hover {
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.5);
        }

        .btn-source {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border: none;
          color: white;
        }

        .btn-source:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        /* ===== SCROLLBAR STYLES ===== */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 8, 25, 0.5);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }

        /* ===== RESPONSIVE ADJUSTMENTS ===== */
        @media (max-width: 768px) {
          .dashboard-hero {
            padding: 2rem 1rem 1.5rem;
          }

          .hero-metrics {
            gap: 0.75rem;
          }

          .metric-card {
            min-width: 100px;
            padding: 0.75rem 1rem;
          }

          .dashboard-tabs {
            padding: 1rem;
          }

          .tab-btn {
            padding: 0.6rem 1rem;
            font-size: 0.85rem;
          }

          .dashboard-grid {
            padding: 1rem;
            gap: 1rem;
          }

          .agent-metrics {
            grid-template-columns: repeat(2, 1fr);
          }

          .panel-codeplayground {
            margin: 0 1rem 1rem;
          }

          .dashboard-footer {
            margin: 0 1rem 1rem;
          }
        }
      `}</style>
    </div>
  )
}

// Helper function for sparkline generation
function generateSparklinePoints(): string {
  const points: string[] = []
  let y = 15
  for (let x = 0; x <= 100; x += 10) {
    y += (Math.random() - 0.5) * 12
    y = Math.max(4, Math.min(20, y))
    points.push(`${x},${y}`)
  }
  return points.join(' ')
}
