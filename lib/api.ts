// API Integration Utilities for SciMSPT
// Simulates real-time data streams and provides mock API interfaces

export interface AgentStatus {
  id: string
  name: string
  role: string
  status: 'online' | 'offline' | 'busy' | 'error'
  tasksCompleted: number
  tasksQueued: number
  efficiency: number
  lastActivity: Date
}

export interface SystemMetric {
  timestamp: Date
  cpuUsage: number
  memoryUsage: number
  networkIO: number
  activeConnections: number
  messagesPerSecond: number
}

export interface NeuralData {
  region: string
  activation: number
  connections: number
  signalStrength: number
  timestamp: Date
}

export interface TaskUpdate {
  id: string
  type: 'created' | 'completed' | 'failed' | 'queued'
  agentId: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
}

// Generate random value within range
const randomInRange = (min: number, max: number) => 
  Math.random() * (max - min) + min

// Generate realistic fluctuating value
const generateFluctuatingValue = (base: number, variance: number, current?: number) => {
  if (current === undefined) return base + randomInRange(-variance, variance)
  const change = (Math.random() - 0.5) * variance * 0.3
  return Math.max(0, Math.min(100, current + change))
}

// Mock agent data
const AGENTS: Omit<AgentStatus, 'status' | 'tasksCompleted' | 'tasksQueued' | 'efficiency' | 'lastActivity'>[] = [
  { id: 'agent-1', name: 'Orchestrator', role: 'coordination' },
  { id: 'agent-2', name: 'Researcher', role: 'analysis' },
  { id: 'agent-3', name: 'Analyst', role: 'processing' },
  { id: 'agent-4', name: 'Executor', role: 'execution' },
  { id: 'agent-5', name: 'Validator', role: 'validation' },
]

const STATUSES: AgentStatus['status'][] = ['online', 'online', 'online', 'busy', 'offline']

// Generate initial agent statuses
export const generateAgentStatuses = (): AgentStatus[] => 
  AGENTS.map(agent => ({
    ...agent,
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    tasksCompleted: Math.floor(randomInRange(50, 500)),
    tasksQueued: Math.floor(randomInRange(0, 20)),
    efficiency: Math.round(randomInRange(70, 99)),
    lastActivity: new Date(Date.now() - randomInRange(0, 3600000)),
  }))

// Generate system metrics
export const generateSystemMetrics = (): SystemMetric => ({
  timestamp: new Date(),
  cpuUsage: Math.round(randomInRange(30, 85) * 10) / 10,
  memoryUsage: Math.round(randomInRange(40, 75) * 10) / 10,
  networkIO: Math.round(randomInRange(10, 60) * 10) / 10,
  activeConnections: Math.floor(randomInRange(100, 500)),
  messagesPerSecond: Math.round(randomInRange(50, 200)),
})

// Generate neural activity data
export const generateNeuralData = (): NeuralData[] => {
  const regions = ['Cortex', 'Hippocampus', 'Thalamus', 'Cerebellum', 'Brainstem', 'Amygdala']
  return regions.map(region => ({
    region,
    activation: Math.round(randomInRange(40, 98) * 10) / 10,
    connections: Math.floor(randomInRange(200, 600)),
    signalStrength: Math.round(randomInRange(60, 99) * 10) / 10,
    timestamp: new Date(),
  }))
}

// Generate task update
export const generateTaskUpdate = (): TaskUpdate => {
  const types: TaskUpdate['type'][] = ['created', 'completed', 'failed', 'queued']
  const agents = AGENTS.map(a => a.id)
  const priorities: TaskUpdate['priority'][] = ['low', 'medium', 'high', 'critical']
  
  const descriptions = [
    'Processing neural pathway analysis',
    'Validating research methodology',
    'Executing distributed computation',
    'Coordinating multi-agent task',
    'Analyzing emergent patterns',
    'Updating knowledge graph',
    'Running simulation model',
    'Optimizing resource allocation',
  ]

  return {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: types[Math.floor(Math.random() * types.length)],
    agentId: agents[Math.floor(Math.random() * agents.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    timestamp: new Date(),
  }
}

// Real-time data stream simulator
type DataCallback<T> = (data: T) => void

class DataStreamSimulator<T> {
  private intervalId: NodeJS.Timeout | null = null
  private callbacks: Set<DataCallback<T>> = new Set()
  private currentValue: T | null = null

  constructor(
    private generator: () => T,
    private intervalMs: number = 2000
  ) {}

  subscribe(callback: DataCallback<T>): () => void {
    this.callbacks.add(callback)
    
    if (this.currentValue) {
      callback(this.currentValue)
    }
    
    if (!this.intervalId) {
      this.start()
    }

    return () => {
      this.callbacks.delete(callback)
      if (this.callbacks.size === 0) {
        this.stop()
      }
    }
  }

  private start() {
    this.intervalId = setInterval(() => {
      this.currentValue = this.generator()
      this.callbacks.forEach(cb => cb(this.currentValue as T))
    }, this.intervalMs)
  }

  private stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  // Force immediate update
  trigger() {
    this.currentValue = this.generator()
    this.callbacks.forEach(cb => cb(this.currentValue as T))
  }

  destroy() {
    this.stop()
    this.callbacks.clear()
  }
}

// Pre-configured data streams
export const dataStreams = {
  systemMetrics: new DataStreamSimulator(generateSystemMetrics, 3000),
  neuralActivity: new DataStreamSimulator(generateNeuralData, 4000),
  taskUpdates: new DataStreamSimulator(generateTaskUpdate, 5000),
  agentStatuses: new DataStreamSimulator(generateAgentStatuses, 6000),
}

// Hook-like utility for React components (to be used with useEffect)
export function createDataStreamHook<T>(
  stream: DataStreamSimulator<T>,
  initialValue: T | null = null
) {
  return {
    subscribe: stream.subscribe.bind(stream),
    trigger: stream.trigger.bind(stream),
  }
}

// API response wrapper
export interface ApiResponse<T> {
  data: T
  success: boolean
  timestamp: Date
  message?: string
}

// Simulate API call with delay
export async function simulateApiCall<T>(
  data: T,
  delay: number = 500,
  errorRate: number = 0
): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        reject({ success: false, message: 'Simulated API error', timestamp: new Date() })
      } else {
        resolve({
          data,
          success: true,
          timestamp: new Date(),
        })
      }
    }, delay + Math.random() * delay * 0.5)
  })
}

// Batch data fetcher for dashboard initialization
export async function fetchDashboardData() {
  const [metrics, neural, agents] = await Promise.all([
    simulateApiCall(generateSystemMetrics(), 800),
    simulateApiCall(generateNeuralData(), 600),
    simulateApiCall(generateAgentStatuses(), 700),
  ])

  return {
    metrics: metrics.data,
    neural: neural.data,
    agents: agents.data,
    lastUpdated: new Date(),
  }
}

// Utility functions for data transformation
export const dataUtils = {
  // Calculate percentage change
  calculateChange(current: number, previous: number): number {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  },

  // Format large numbers
  formatNumber(num: number): string {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return num.toString()
  },

  // Get trend direction
  getTrend(current: number, previous: number): 'up' | 'down' | 'stable' {
    const change = Math.abs(this.calculateChange(current, previous))
    if (change < 2) return 'stable'
    return current > previous ? 'up' : 'down'
  },

  // Moving average calculation
  movingAverage(values: number[], windowSize: number): number[] {
    const result: number[] = []
    for (let i = 0; i < values.length; i++) {
      const start = Math.max(0, i - windowSize + 1)
      const window = values.slice(start, i + 1)
      result.push(window.reduce((a, b) => a + b, 0) / window.length)
    }
    return result
  },

  // Normalize values to 0-100 scale
  normalize(values: number[]): number[] {
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min
    if (range === 0) return values.map(() => 50)
    return values.map(v => ((v - min) / range) * 100)
  }
}

// Export singleton instances
export default {
  generateAgentStatuses,
  generateSystemMetrics,
  generateNeuralData,
  generateTaskUpdate,
  dataStreams,
  simulateApiCall,
  fetchDashboardData,
  dataUtils,
}
