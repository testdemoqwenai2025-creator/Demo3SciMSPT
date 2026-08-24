'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChartWrapper, DashboardCharts } from '@/components/ChartWrapper'

// Types
interface Node {
  id: string
  label: string
  type: 'entity' | 'concept' | 'action' | 'property'
  x: number
  y: number
  vx?: number
  vy?: number
  vector?: [number, number, number]
  dayAdded: number
  description: string
}

interface Edge {
  id: string
  source: string
  target: string
  label: string
  strength: number
  dayAdded: number
}

interface QueryResult {
  path: string[]
  edges: Edge[]
  explanation: string
}

// Color scheme by node type
const NODE_COLORS = {
  entity: { fill: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.6)', text: '#fff' },
  concept: { fill: '#06b6d4', glow: 'rgba(6, 182, 212, 0.6)', text: '#fff' },
  action: { fill: '#10b981', glow: 'rgba(16, 185, 129, 0.6)', text: '#fff' },
  property: { fill: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)', text: '#fff' }
}

// Sample Knowledge Base Data
const INITIAL_NODES: Node[] = [
  // Core Entities
  { id: 'scimspt', label: 'SciMSPT', type: 'entity', x: 400, y: 300, vector: [0.9, 0.8, 0.7], dayAdded: 1, description: 'Semantic Multi-Agent System Platform - The core architecture orchestrating intelligent agents and knowledge graphs.' },
  { id: 'maol', label: 'MAOL', type: 'entity', x: 250, y: 200, vector: [0.85, 0.75, 0.65], dayAdded: 2, description: 'Multi-Agent Orchestrator Layer - Coordinates multiple AI agents with intent routing and memory management.' },
  { id: 'neural-tracking', label: 'Neural Tracking', type: 'entity', x: 550, y: 200, vector: [0.7, 0.9, 0.6], dayAdded: 3, description: 'Privacy-preserving neural network that tracks user patterns without storing personal data.' },
  { id: 'spatial-ui', label: 'Spatial UI', type: 'entity', x: 300, y: 420, vector: [0.75, 0.7, 0.85], dayAdded: 5, description: 'Three-dimensional interface system for immersive data visualization and interaction.' },
  
  // Technologies
  { id: 'tensorflowjs', label: 'TensorFlow.js', type: 'concept', x: 150, y: 150, vector: [0.6, 0.55, 0.5], dayAdded: 4, description: 'Browser-based machine learning framework for running ML models client-side.' },
  { id: 'nextjs', label: 'Next.js', type: 'concept', x: 650, y: 350, vector: [0.55, 0.5, 0.45], dayAdded: 1, description: 'React framework for production-grade applications with server-side rendering.' },
  { id: 'webgpu', label: 'WebGPU', type: 'concept', x: 600, y: 450, vector: [0.5, 0.6, 0.55], dayAdded: 10, description: 'Modern graphics API enabling high-performance GPU computing in browsers.' },
  { id: 'threejs', label: 'Three.js', type: 'concept', x: 200, y: 380, vector: [0.58, 0.52, 0.78], dayAdded: 6, description: 'JavaScript library for creating and displaying 3D graphics in web browsers.' },
  
  // Concepts
  { id: 'multi-agent', label: 'Multi-Agent Systems', type: 'concept', x: 100, y: 280, vector: [0.82, 0.72, 0.62], dayAdded: 2, description: 'Distributed AI systems where multiple autonomous agents collaborate to achieve complex goals.' },
  { id: 'vector-embeddings', label: 'Vector Embeddings', type: 'concept', x: 500, y: 120, vector: [0.88, 0.83, 0.77], dayAdded: 7, description: 'High-dimensional numerical representations capturing semantic meaning of concepts and entities.' },
  { id: 'semantic-search', label: 'Semantic Search', type: 'concept', x: 700, y: 220, vector: [0.79, 0.74, 0.68], dayAdded: 8, description: 'Search technology understanding query intent rather than just keyword matching.' },
  { id: 'intent-router', label: 'Intent Router', type: 'concept', x: 180, y: 280, vector: [0.76, 0.71, 0.64], dayAdded: 3, description: 'Intelligent routing system that classifies user intents and directs to appropriate handlers.' },
  { id: 'knowledge-graph', label: 'Knowledge Graph', type: 'concept', x: 450, y: 380, vector: [0.86, 0.81, 0.73], dayAdded: 5, description: 'Structured representation of facts using graph structure with entities and relationships.' },
  
  // Actions
  { id: 'classify', label: 'Classify', type: 'action', x: 80, y: 180, vector: [0.45, 0.42, 0.38], dayAdded: 4, description: 'Categorize inputs into predefined classes using trained models.' },
  { id: 'route', label: 'Route', type: 'action', x: 320, y: 130, vector: [0.48, 0.44, 0.40], dayAdded: 3, description: 'Direct requests to appropriate processing pipelines based on analysis.' },
  { id: 'analyze', label: 'Analyze', type: 'action', x: 520, y: 280, vector: [0.52, 0.48, 0.43], dayAdded: 6, description: 'Process and extract insights from complex data structures.' },
  { id: 'render', label: 'Render', type: 'action', x: 380, y: 480, vector: [0.46, 0.50, 0.72], dayAdded: 7, description: 'Generate visual output from processed data and models.' },
  { id: 'embed', label: 'Embed', type: 'action', x: 620, y: 150, vector: [0.54, 0.58, 0.52], dayAdded: 8, description: 'Transform concepts into dense vector representations for similarity computation.' },
  
  // Properties
  { id: 'privacy-first', label: 'Privacy-First', type: 'property', x: 680, y: 100, vector: [0.68, 0.63, 0.58], dayAdded: 3, description: 'Design principle ensuring user data protection at every processing stage.' },
  { id: 'realtime', label: 'Real-time', type: 'property', x: 70, y: 380, vector: [0.62, 0.57, 0.53], dayAdded: 5, description: 'Sub-millisecond response times for immediate user feedback.' },
  { id: 'scalable', label: 'Scalable', type: 'property', x: 720, y: 380, vector: [0.64, 0.59, 0.54], dayAdded: 12, description: 'Architecture supporting horizontal scaling to millions of concurrent operations.' },
  { id: 'adaptive', label: 'Adaptive', type: 'property', x: 150, y: 480, vector: [0.66, 0.61, 0.56], dayAdded: 15, description: 'Self-improving systems that learn from interactions over time.' }
]

const INITIAL_EDGES: Edge[] = [
  // Core relationships
  { id: 'e1', source: 'scimspt', target: 'maol', label: 'integrates', strength: 0.95, dayAdded: 2 },
  { id: 'e2', source: 'scimspt', target: 'neural-tracking', label: 'employs', strength: 0.88, dayAdded: 3 },
  { id: 'e3', source: 'scimspt', target: 'spatial-ui', label: 'renders via', strength: 0.82, dayAdded: 5 },
  { id: 'e4', source: 'maol', target: 'intent-router', label: 'uses', strength: 0.97, dayAdded: 3 },
  { id: 'e5', source: 'maol', target: 'multi-agent', label: 'implements', strength: 0.91, dayAdded: 2 },
  { id: 'e6', source: 'neural-tracking', target: 'privacy-first', label: 'ensures', strength: 0.99, dayAdded: 3 },
  { id: 'e7', source: 'spatial-ui', target: 'threejs', label: 'built with', strength: 0.89, dayAdded: 6 },
  { id: 'e8', source: 'spatial-ui', target: 'webgpu', label: 'accelerated by', strength: 0.76, dayAdded: 10 },
  
  // Technology connections
  { id: 'e9', source: 'tensorflowjs', target: 'classify', label: 'enables', strength: 0.85, dayAdded: 4 },
  { id: 'e10', source: 'tensorflowjs', target: 'embed', label: 'powers', strength: 0.83, dayAdded: 8 },
  { id: 'e11', source: 'nextjs', target: 'scimspt', label: 'hosts', strength: 0.90, dayAdded: 1 },
  { id: 'e12', source: 'webgpu', target: 'render', label: 'accelerates', strength: 0.80, dayAdded: 10 },
  { id: 'e13', source: 'threejs', target: 'spatial-ui', label: 'powers', strength: 0.87, dayAdded: 6 },
  
  // Concept relationships
  { id: 'e14', source: 'vector-embeddings', target: 'semantic-search', label: 'enables', strength: 0.94, dayAdded: 8 },
  { id: 'e15', source: 'vector-embeddings', target: 'knowledge-graph', label: 'stored in', strength: 0.92, dayAdded: 7 },
  { id: 'e16', source: 'multi-agent', target: 'maol', label: 'orchestrated by', strength: 0.93, dayAdded: 2 },
  { id: 'e17', source: 'intent-router', target: 'classify', label: 'performs', strength: 0.86, dayAdded: 4 },
  { id: 'e18', source: 'intent-router', target: 'route', label: 'executes', strength: 0.88, dayAdded: 3 },
  { id: 'e19', source: 'knowledge-graph', target: 'analyze', label: 'queried by', strength: 0.84, dayAdded: 6 },
  { id: 'e20', source: 'semantic-search', target: 'vector-embeddings', label: 'leverages', strength: 0.91, dayAdded: 8 },
  
  // Action flows
  { id: 'e21', source: 'classify', target: 'route', label: 'triggers', strength: 0.82, dayAdded: 4 },
  { id: 'e22', source: 'route', target: 'analyze', label: 'feeds', strength: 0.79, dayAdded: 6 },
  { id: 'e23', source: 'analyze', target: 'render', label: 'outputs to', strength: 0.81, dayAdded: 7 },
  { id: 'e24', source: 'embed', target: 'vector-embeddings', label: 'produces', strength: 0.90, dayAdded: 8 },
  
  // Property associations
  { id: 'e25', source: 'scimspt', target: 'privacy-first', label: 'prioritizes', strength: 0.96, dayAdded: 3 },
  { id: 'e26', source: 'scimspt', target: 'realtime', label: 'delivers', strength: 0.88, dayAdded: 5 },
  { id: 'e27', source: 'scimspt', target: 'scalable', label: 'designed as', strength: 0.85, dayAdded: 12 },
  { id: 'e28', source: 'maol', target: 'adaptive', label: 'is', strength: 0.83, dayAdded: 15 },
  { id: 'e29', source: 'neural-tracking', target: 'realtime', label: 'operates', strength: 0.86, dayAdded: 5 },
  { id: 'e30', source: 'spatial-ui', target: 'render', label: 'utilizes', strength: 0.84, dayAdded: 7 }
]

export default function IntelligenceGraphPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES)
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null)
  const [highlightedPath, setHighlightedPath] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'graph' | 'vectors' | 'timeline'>('graph')
  const [timelineDay, setTimelineDay] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragNode, setDragNode] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showProModal, setShowProModal] = useState(false)

  // Animation frame ref
  const animationRef = useRef<number>()
  const mousePos = useRef({ x: 0, y: 0 })

  // Get visible nodes based on timeline
  const getVisibleNodes = useCallback(() => {
    return nodes.filter(n => n.dayAdded <= timelineDay)
  }, [nodes, timelineDay])

  // Get visible edges based on timeline
  const getVisibleEdges = useCallback(() => {
    return edges.filter(e => e.source && e.target && 
      (nodes.find(n => n.id === e.source)?.dayAdded ?? 0) <= timelineDay &&
      (nodes.find(n => n.id === e.target)?.dayAdded ?? 0) <= timelineDay &&
      e.dayAdded <= timelineDay
    )
  }, [edges, nodes, timelineDay])

  // Process natural language queries
  const processQuery = useCallback((q: string) => {
    const lowerQ = q.toLowerCase()
    let results: QueryResult | null = null
    
    if (lowerQ.includes('maol') && (lowerQ.includes('use') || lowerQ.includes('uses'))) {
      results = {
        path: ['maol', 'intent-router', 'classify', 'route'],
        edges: [
          INITIAL_EDGES.find(e => e.id === 'e4')!,
          INITIAL_EDGES.find(e => e.id === 'e17')!,
          INITIAL_EDGES.find(e => e.id === 'e18')!
        ],
        explanation: 'MAOL uses Intent Router for classification and request routing across the multi-agent system.'
      }
    } else if (lowerQ.includes('privacy') || lowerQ.includes('private')) {
      results = {
        path: ['neural-tracking', 'privacy-first', 'scimspt'],
        edges: [
          INITIAL_EDGES.find(e => e.id === 'e6')!,
          INITIAL_EDGES.find(e => e.id === 'e25')!
        ],
        explanation: 'Neural Tracking ensures Privacy-First design, which SciMSPT prioritizes throughout its architecture.'
      }
    } else if (lowerQ.includes('vector') || lowerQ.includes('embedding')) {
      results = {
        path: ['embed', 'vector-embeddings', 'semantic-search', 'knowledge-graph'],
        edges: [
          INITIAL_EDGES.find(e => e.id === 'e24')!,
          INITIAL_EDGES.find(e => e.id === 'e14')!,
          INITIAL_EDGES.find(e => e.id === 'e15')!
        ],
        explanation: 'Embed action produces Vector Embeddings which enable Semantic Search and are stored in the Knowledge Graph.'
      }
    } else if (lowerQ.includes('scimspt')) {
      results = {
        path: ['scimspt', 'maol', 'neural-tracking', 'spatial-ui'],
        edges: [
          INITIAL_EDGES.find(e => e.id === 'e1')!,
          INITIAL_EDGES.find(e => e.id === 'e2')!,
          INITIAL_EDGES.find(e => e.id === 'e3')!
        ].filter(Boolean),
        explanation: 'SciMSPT integrates MAOL for orchestration, employs Neural Tracking for privacy, and renders via Spatial UI.'
      }
    } else if (lowerQ.includes('technology') || lowerQ.includes('tech stack')) {
      results = {
        path: ['nextjs', 'scimspt', 'tensorflowjs', 'webgpu', 'threejs'],
        edges: [
          INITIAL_EDGES.find(e => e.id === 'e11')!,
          INITIAL_EDGES.find(e => e.id === 'e9')!,
          INITIAL_EDGES.find(e => e.id === 'e12')!,
          INITIAL_EDGES.find(e => e.id === 'e13')!
        ],
        explanation: 'Tech stack includes Next.js hosting, TensorFlow.js for ML, WebGPU acceleration, and Three.js for 3D rendering.'
      }
    } else if (lowerQ.length > 0) {
      // Find matching nodes
      const matchedNodes = nodes.filter(n => 
        n.label.toLowerCase().includes(lowerQ) ||
        n.description.toLowerCase().includes(lowerQ)
      )
      if (matchedNodes.length > 0) {
        results = {
          path: matchedNodes.map(n => n.id),
          edges: [],
          explanation: `Found ${matchedNodes.length} matching concept(s): ${matchedNodes.map(n => n.label).join(', ')}`
        }
      }
    }

    setQueryResults(results)
    if (results) {
      setHighlightedPath(results.path)
    } else {
      setHighlightedPath([])
    }
  }, [nodes])

  // Get relationships for selected node
  const getNodeRelationships = useCallback((nodeId: string) => {
    const incoming = edges.filter(e => e.target === nodeId).map(e => ({
      ...e,
      sourceLabel: nodes.find(n => n.id === e.source)?.label || ''
    }))
    const outgoing = edges.filter(e => e.source === nodeId).map(e => ({
      ...e,
      targetLabel: nodes.find(n => n.id === e.target)?.label || ''
    }))
    return { incoming, outgoing }
  }, [edges, nodes])

  // Calculate similarity between two nodes
  const calculateSimilarity = (nodeA: Node, nodeB: Node): number => {
    if (!nodeA.vector || !nodeB.vector) return 0
    const dot = nodeA.vector[0] * nodeB.vector[0] + 
                nodeA.vector[1] * nodeB.vector[1] + 
                nodeA.vector[2] * nodeB.vector[2]
    const magA = Math.sqrt(nodeA.vector[0]**2 + nodeA.vector[1]**2 + nodeA.vector[2]**2)
    const magB = Math.sqrt(nodeB.vector[0]**2 + nodeB.vector[1]**2 + nodeB.vector[2]**2)
    return dot / (magA * magB)
  }

  // Draw the graph
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = rect.width
    const height = rect.height

    // Clear canvas with dark background
    ctx.fillStyle = '#0a0a1a'
    ctx.fillRect(0, 0, width, height)

    // Draw grid pattern
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)'
    ctx.lineWidth = 1
    const gridSize = 40
    for (let x = (pan.x % gridSize); x < width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = (pan.y % gridSize); y < height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    ctx.save()
    ctx.translate(pan.x, pan.y)
    ctx.scale(zoom, zoom)

    const visibleNodes = getVisibleNodes()
    const visibleEdges = getVisibleEdges()

    // Draw edges
    visibleEdges.forEach(edge => {
      const source = visibleNodes.find(n => n.id === edge.source)
      const target = visibleNodes.find(n => n.id === edge.target)
      if (!source || !target) return

      const isHighlighted = highlightedPath.includes(source.id) && highlightedPath.includes(target.id)
      
      ctx.beginPath()
      ctx.moveTo(source.x, source.y)
      
      // Curved edges
      const midX = (source.x + target.x) / 2
      const midY = (source.y + target.y) / 2 - 20
      ctx.quadraticCurveTo(midX, midY, target.x, target.y)
      
      if (isHighlighted) {
        ctx.strokeStyle = `rgba(139, 92, 246, ${edge.strength})`
        ctx.lineWidth = 3
        ctx.shadowColor = '#8b5cf6'
        ctx.shadowBlur = 10
      } else {
        ctx.strokeStyle = `rgba(99, 102, 241, ${edge.strength * 0.5})`
        ctx.lineWidth = 1.5
        ctx.shadowBlur = 0
      }
      ctx.stroke()
      ctx.shadowBlur = 0

      // Edge label
      if (zoom > 0.7) {
        ctx.fillStyle = isHighlighted ? '#c4b5fd' : 'rgba(148, 163, 184, 0.7)'
        ctx.font = `${isHighlighted ? 'bold ' : ''}${11 / zoom}px Inter, sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(edge.label, midX, midY - 5)
      }
    })

    // Draw nodes
    visibleNodes.forEach(node => {
      const isSelected = selectedNode?.id === node.id
      const isHovered = hoveredNode === node.id
      const isHighlighted = highlightedPath.includes(node.id)
      const colors = NODE_COLORS[node.type]
      
      const radius = (isSelected ? 28 : isHovered ? 26 : 22) / zoom
      
      // Glow effect
      if (isSelected || isHovered || isHighlighted) {
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2)
        gradient.addColorStop(0, colors.glow)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2)
        ctx.fill()
      }

      // Node circle
      const nodeGradient = ctx.createRadialGradient(
        node.x - radius * 0.3, node.y - radius * 0.3, 0,
        node.x, node.y, radius
      )
      nodeGradient.addColorStop(0, colors.fill)
      nodeGradient.addColorStop(1, shadeColor(colors.fill, -30))
      
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = nodeGradient
      ctx.fill()
      
      // Border
      ctx.strokeStyle = isSelected ? '#fff' : colors.fill
      ctx.lineWidth = isSelected ? 3 : 2
      ctx.stroke()

      // Label
      ctx.fillStyle = colors.text
      ctx.font = `${(isSelected || isHovered ? 'bold ' : '')}${Math.max(10, 12 / zoom)}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Truncate long labels
      const maxChars = Math.floor(radius * 2 / (12 / zoom))
      const displayLabel = node.label.length > maxChars ? node.label.slice(0, maxChars - 1) + '…' : node.label
      ctx.fillText(displayLabel, node.x, node.y)
    })

    ctx.restore()

    // Draw zoom indicator
    ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
    ctx.font = '12px Inter, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`${Math.round(zoom * 100)}%`, 15, height - 15)
  }, [nodes, edges, selectedNode, hoveredNode, highlightedPath, zoom, pan, timelineDay, getVisibleNodes, getVisibleEdges])

  // Animation loop
  useEffect(() => {
    const animate = () => {
      drawGraph()
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [drawGraph])

  // Handle mouse events
  const getMousePos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom
    }
  }

  const findNodeAtPos = (x: number, y: number): Node | undefined => {
    return getVisibleNodes().find(node => {
      const dx = node.x - x
      const dy = node.y - y
      return Math.sqrt(dx * dx + dy * dy) < 25
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e)
    const node = findNodeAtPos(pos.x, pos.y)
    
    if (node) {
      setDragNode(node.id)
      setSelectedNode(node)
      setIsDragging(true)
    } else {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getMousePos(e)
    mousePos.current = pos
    
    if (dragNode && isDragging) {
      setNodes(prev => prev.map(n => 
        n.id === dragNode ? { ...n, x: pos.x, y: pos.y } : n
      ))
    } else if (isDragging && !dragNode) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    } else {
      const node = findNodeAtPos(pos.x, pos.y)
      setHoveredNode(node?.id || null)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragNode(null)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.min(Math.max(prev * delta, 0.3), 3))
  }

  // Timeline auto-play
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setTimelineDay(prev => prev >= 30 ? 1 : prev + 1)
    }, 500)
    return () => clearInterval(interval)
  }, [isPlaying])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNode(null)
        setHighlightedPath([])
        setQueryResults(null)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '=') {
        setZoom(prev => Math.min(prev * 1.2, 3))
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        setZoom(prev => Math.max(prev * 0.8, 0.3))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Helper function to shade colors
  const shadeColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1)
  }

  const relationships = selectedNode ? getNodeRelationships(selectedNode.id) : null

  return (
    <div className="page">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-badge">
          <span className="badge-pulse"></span>
          <span className="badge-text">Semantic Intelligence</span>
        </div>
        <h1>
          <span className="icon-glow">◈</span> Intelligence Graph
        </h1>
        <p>Interactive Knowledge Network with Vector Embeddings &amp; Entity Relationship Mapping</p>
        
        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-value">1,247</span>
            <span className="stat-label">Nodes</span>
            <span className="stat-change positive">+12 today</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">3,891</span>
            <span className="stat-label">Edges</span>
            <span className="stat-change positive">+34 today</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">0.0041</span>
            <span className="stat-label">Density</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">2.3</span>
            <span className="stat-label">Avg Path</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="content-area">
        {/* Query Interface */}
        <div className="query-bar">
          <div className="query-input-wrapper">
            <span className="query-icon">⌘</span>
            <input
              type="text"
              placeholder='Ask the graph: "What does MAOL use?" or "Show privacy features"...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && processQuery(query)}
              className="query-input"
            />
            <button 
              onClick={() => processQuery(query)}
              className="query-btn"
            >
              Query
            </button>
          </div>
          
          {/* Query Results */}
          {queryResults && (
            <div className="query-results">
              <div className="result-header">
                <span className="result-icon">✦</span>
                <span>Traversal Result</span>
              </div>
              <p className="result-explanation">{queryResults.explanation}</p>
              <div className="result-path">
                {queryResults.path.map((id, i) => (
                  <span key={id}>
                    {i > 0 && <span className="path-arrow">→</span>}
                    <span className="path-node" style={{ 
                      color: NODE_COLORS[nodes.find(n => n.id === id)?.type || 'entity'].fill 
                    }}>
                      {nodes.find(n => n.id === id)?.label}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="tab-nav">
          <button 
            className={`tab-btn ${activeTab === 'graph' ? 'active' : ''}`}
            onClick={() => setActiveTab('graph')}
          >
            <span className="tab-icon">◉</span> Knowledge Graph
          </button>
          <button 
            className={`tab-btn ${activeTab === 'vectors' ? 'active' : ''}`}
            onClick={() => setActiveTab('vectors')}
          >
            <span className="tab-icon">⊞</span> Vector Space
          </button>
          <button 
            className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <span className="tab-icon">⟿</span> Evolution Timeline
          </button>
        </div>

        {/* Main Panel Layout */}
        <div className="main-panel">
          {/* Graph Canvas */}
          <div className={`canvas-container ${activeTab !== 'graph' ? 'hidden' : ''}`} ref={containerRef}>
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              className="graph-canvas"
            />
            
            {/* Canvas Controls */}
            <div className="canvas-controls">
              <button onClick={() => setZoom(z => Math.min(z * 1.2, 3))} title="Zoom In">+</button>
              <button onClick={() => setZoom(1)} title="Reset View">⟲</button>
              <button onClick={() => setZoom(z => Math.max(z * 0.8, 0.3))} title="Zoom Out">−</button>
              <button onClick={() => setPan({ x: 0, y: 0 })} title="Center View">⊙</button>
            </div>

            {/* Legend */}
            <div className="legend">
              <h4>Node Types</h4>
              {Object.entries(NODE_COLORS).map(([type, color]) => (
                <div key={type} className="legend-item">
                  <span className="legend-dot" style={{ background: color.fill }}></span>
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vector Space Visualization */}
          <div className={`canvas-container ${activeTab !== 'vectors' ? 'hidden' : ''}`}>
            <VectorSpaceVisualization 
              nodes={getVisibleNodes()} 
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
              calculateSimilarity={calculateSimilarity}
            />
          </div>

          {/* Timeline View */}
          <div className={`timeline-container ${activeTab !== 'timeline' ? 'hidden' : ''}`}>
            <TimelineVisualization 
              nodes={nodes}
              edges={edges}
              currentDay={timelineDay}
              onDayChange={setTimelineDay}
              isPlaying={isPlaying}
              onPlayToggle={() => setIsPlaying(!isPlaying)}
            />
          </div>

          {/* Side Panel */}
          <div className="side-panel">
            {/* Selected Node Info */}
            {selectedNode ? (
              <div className="panel-section node-info">
                <div className="node-header">
                  <span 
                    className="node-type-badge"
                    style={{ background: NODE_COLORS[selectedNode.type].fill }}
                  >
                    {selectedNode.type.toUpperCase()}
                  </span>
                  <h3>{selectedNode.label}</h3>
                  <button 
                    className="close-btn"
                    onClick={() => setSelectedNode(null)}
                  >✕</button>
                </div>
                <p className="node-description">{selectedNode.description}</p>
                
                {/* Vector Values */}
                {selectedNode.vector && (
                  <div className="vector-display">
                    <h4>Vector Embedding</h4>
                    <div className="vector-values">
                      {selectedNode.vector.map((v, i) => (
                        <span key={i} className="vector-component">
                          <span className="component-label">d{i}</span>
                          <span className="component-value">{v.toFixed(3)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relationships */}
                {relationships && (
                  <div className="relationships">
                    <h4>Relationships</h4>
                    
                    {relationships.outgoing.length > 0 && (
                      <div className="rel-group">
                        <span className="rel-label outgoing">Outgoing →</span>
                        {relationships.outgoing.slice(0, 5).map(rel => (
                          <div key={rel.id} className="rel-item">
                            <span className="rel-strength" style={{ width: `${rel.strength * 100}%` }}></span>
                            <span className="rel-text">
                              <strong>{rel.label}</strong> {rel.targetLabel}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {relationships.incoming.length > 0 && (
                      <div className="rel-group">
                        <span className="rel-label incoming">← Incoming</span>
                        {relationships.incoming.slice(0, 5).map(rel => (
                          <div key={rel.id} className="rel-item">
                            <span className="rel-strength" style={{ width: `${rel.strength * 100}%` }}></span>
                            <span className="rel-text">
                              {rel.sourceLabel} <strong>{rel.label}</strong>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Similar Nodes */}
                <div className="similar-nodes">
                  <h4>Similar Concepts</h4>
                  {nodes
                    .filter(n => n.id !== selectedNode.id)
                    .map(n => ({ node: n, sim: calculateSimilarity(selectedNode, n) }))
                    .sort((a, b) => b.sim - a.sim)
                    .slice(0, 4)
                    .map(({ node, sim }) => (
                      <button 
                        key={node.id}
                        className="similar-node-btn"
                        style={{ borderColor: NODE_COLORS[node.type].fill }}
                        onClick={() => setSelectedNode(node)}
                      >
                        <span className="sim-score">{(sim * 100).toFixed(0)}%</span>
                        <span className="sim-label">{node.label}</span>
                      </button>
                    ))}
                </div>
              </div>
            ) : (
              <div className="panel-section empty-state">
                <div className="empty-icon">◉</div>
                <h3>Select a Node</h3>
                <p>Click on any node in the graph to view its details, relationships, and vector embedding.</p>
                
                {/* Node List */}
                <div className="node-list">
                  <h4>All Entities</h4>
                  {nodes.map(node => (
                    <button 
                      key={node.id}
                      className="node-list-item"
                      onClick={() => setSelectedNode(node)}
                    >
                      <span className="list-dot" style={{ background: NODE_COLORS[node.type].fill }}></span>
                      <span>{node.label}</span>
                      <span className="list-type">{node.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Status Section */}
            <div className="panel-section status-section">
              <div className="status-header">
                <h4>Status</h4>
                <span className="status-badge in-progress">In Progress</span>
              </div>
              
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: '55%' }}>
                  <span className="progress-glow"></span>
                </div>
                <span className="progress-text">55% Complete</span>
              </div>

              <div className="limits-info">
                <div className="limit-row">
                  <span className="limit-label">Daily Queries</span>
                  <span className="limit-value">
                    <span className="used">45</span>/<span className="total">200</span>
                  </span>
                </div>
                <div className="limit-bar">
                  <div className="limit-fill" style={{ width: '22.5%' }}></div>
                </div>
                
                <button 
                  className="upgrade-btn"
                  onClick={() => setShowProModal(true)}
                >
                  ⬡ Upgrade to PRO
                </button>
                <p className="pro-features">Unlimited queries • Custom entity types • Advanced analytics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Data Visualization - Priority 1 Feature */}
      <section style={{ padding: '2rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '0.5rem' }}>
            📊 Knowledge Graph Analytics
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            Real-time visualization of graph metrics, node relationships, and system performance
          </p>
        </div>
        <DashboardCharts />
      </section>

      {/* Pro Modal */}
      {showProModal && (
        <div className="modal-overlay" onClick={() => setShowProModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowProModal(false)}>✕</button>
            <h2>Upgrade to SciMSPT Pro</h2>
            <div className="pro-features-list">
              <div className="pro-feature">
                <span className="feature-check">✓</span>
                <div>
                  <strong>Unlimited Graph Queries</strong>
                  <p>No daily limits on semantic traversals</p>
                </div>
              </div>
              <div className="pro-feature">
                <span className="feature-check">✓</span>
                <div>
                  <strong>Custom Entity Types</strong>
                  <p>Define your own node categories and relationships</p>
                </div>
              </div>
              <div className="pro-feature">
                <span className="feature-check">✓</span>
                <div>
                  <strong>Advanced Analytics</strong>
                  <p>Deep graph metrics and pattern detection</p>
                </div>
              </div>
              <div className="pro-feature">
                <span className="feature-check">✓</span>
                <div>
                  <strong>API Access</strong>
                  <p>Programmatic control of your knowledge graph</p>
                </div>
              </div>
            </div>
            <a 
              href="https://github.com/sponsors/testdemoqwenai2025-creator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="subscribe-btn"
            >
              Subscribe Now →
            </a>
          </div>
        </div>
      )}

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0a1a 0%, #0f0f23 50%, #0a0a1a 100%);
          color: #e2e8f0;
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Hero Section */
        .page-hero {
          text-align: center;
          padding: 2.5rem 1rem 1.5rem;
          border-bottom: 1px solid rgba(139, 92, 246, 0.15);
          position: relative;
          overflow: hidden;
        }

        .page-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 9999px;
          margin-bottom: 1rem;
        }

        .badge-pulse {
          width: 8px;
          height: 8px;
          background: #8b5cf6;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7); }
          50% { opacity: 0.7; box-shadow: 0 0 0 8px rgba(139, 92, 246, 0); }
        }

        .badge-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: #c4b5fd;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .page-hero h1 {
          font-size: 2.5rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin: 0.75rem 0;
          background: linear-gradient(135deg, #fff 0%, #c4b5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .icon-glow {
          font-size: 2rem;
          color: #8b5cf6;
          filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6));
          -webkit-text-fill-color: initial;
        }

        .page-hero p {
          color: #94a3b8;
          max-width: 600px;
          margin: 0 auto;
          font-size: 1rem;
        }

        /* Quick Stats */
        .quick-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }

        .stat-label {
          font-size: 0.7rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-change {
          font-size: 0.65rem;
          font-weight: 600;
        }

        .stat-change.positive {
          color: #10b981;
        }

        /* Content Area */
        .content-area {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.5rem;
        }

        /* Query Bar */
        .query-bar {
          margin-bottom: 1.5rem;
        }

        .query-input-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 12px;
          padding: 0.5rem 1rem;
          transition: all 0.3s ease;
        }

        .query-input-wrapper:focus-within {
          border-color: rgba(139, 92, 246, 0.6);
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);
        }

        .query-icon {
          color: #8b5cf6;
          font-size: 1.2rem;
        }

        .query-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #e2e8f0;
          font-size: 0.95rem;
          font-family: inherit;
        }

        .query-input::placeholder {
          color: #64748b;
        }

        .query-btn {
          padding: 0.5rem 1.25rem;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .query-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        }

        /* Query Results */
        .query-results {
          margin-top: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .result-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #c4b5fd;
          margin-bottom: 0.5rem;
        }

        .result-icon {
          color: #8b5cf6;
        }

        .result-explanation {
          color: #94a3b8;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }

        .result-path {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.35rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .path-arrow {
          color: #64748b;
        }

        .path-node {
          font-weight: 600;
          font-size: 0.85rem;
        }

        /* Tab Navigation */
        .tab-nav {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          background: rgba(30, 41, 59, 0.3);
          padding: 0.35rem;
          border-radius: 10px;
          width: fit-content;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          color: #e2e8f0;
          background: rgba(99, 102, 241, 0.1);
        }

        .tab-btn.active {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2));
          color: #c4b5fd;
        }

        .tab-icon {
          font-size: 1rem;
        }

        /* Main Panel */
        .main-panel {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1.5rem;
          min-height: 550px;
        }

        @media (max-width: 900px) {
          .main-panel {
            grid-template-columns: 1fr;
          }
        }

        /* Canvas Container */
        .canvas-container {
          position: relative;
          background: rgba(10, 10, 26, 0.8);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 16px;
          overflow: hidden;
          min-height: 550px;
        }

        .canvas-container.hidden {
          display: none;
        }

        .graph-canvas {
          width: 100%;
          height: 550px;
          cursor: grab;
          display: block;
        }

        .graph-canvas:active {
          cursor: grabbing;
        }

        /* Canvas Controls */
        .canvas-controls {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          display: flex;
          gap: 0.35rem;
          z-index: 10;
        }

        .canvas-controls button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(30, 41, 59, 0.9);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 6px;
          color: #e2e8f0;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .canvas-controls button:hover {
          background: rgba(99, 102, 241, 0.3);
          border-color: rgba(139, 92, 246, 0.5);
        }

        /* Legend */
        .legend {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(15, 15, 35, 0.95);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          z-index: 10;
        }

        .legend h4 {
          font-size: 0.7rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #94a3b8;
          padding: 0.2rem 0;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        /* Side Panel */
        .side-panel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .panel-section {
          background: rgba(15, 15, 35, 0.8);
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 16px;
          padding: 1.25rem;
        }

        /* Node Info */
        .node-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .node-type-badge {
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: white;
        }

        .node-header h3 {
          flex: 1;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
        }

        .close-btn {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(239, 68, 68, 0.2);
          border: none;
          border-radius: 4px;
          color: #ef4444;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .node-description {
          color: #94a3b8;
          font-size: 0.85rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        /* Vector Display */
        .vector-display {
          margin-bottom: 1rem;
        }

        .vector-display h4 {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .vector-values {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .vector-component {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.4rem 0.6rem;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 6px;
        }

        .component-label {
          font-size: 0.6rem;
          color: #64748b;
        }

        .component-value {
          font-size: 0.8rem;
          font-family: monospace;
          color: #c4b5fd;
        }

        /* Relationships */
        .relationships {
          margin-bottom: 1rem;
        }

        .relationships h4 {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .rel-group {
          margin-bottom: 0.75rem;
        }

        .rel-label {
          font-size: 0.7rem;
          font-weight: 600;
          display: block;
          margin-bottom: 0.4rem;
        }

        .rel-label.outgoing {
          color: #10b981;
        }

        .rel-label.incoming {
          color: #06b6d4;
        }

        .rel-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0;
          font-size: 0.8rem;
        }

        .rel-strength {
          height: 3px;
          width: 30px;
          min-width: 30px;
          background: rgba(139, 92, 246, 0.3);
          border-radius: 2px;
          position: relative;
        }

        .rel-strength::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: #8b5cf6;
          border-radius: 2px;
        }

        .rel-text {
          color: #94a3b8;
        }

        .rel-text strong {
          color: #e2e8f0;
        }

        /* Similar Nodes */
        .similar-nodes h4 {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .similar-node-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.4rem 0.6rem;
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid transparent;
          border-radius: 6px;
          color: #e2e8f0;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 0.35rem;
        }

        .similar-node-btn:hover {
          background: rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .sim-score {
          font-weight: 700;
          color: #8b5cf6;
          font-size: 0.75rem;
        }

        .sim-label {
          flex: 1;
          text-align: left;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
        }

        .empty-icon {
          font-size: 3rem;
          color: rgba(139, 92, 246, 0.3);
          margin-bottom: 0.75rem;
        }

        .empty-state h3 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #64748b;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .node-list {
          text-align: left;
          max-height: 250px;
          overflow-y: auto;
        }

        .node-list h4 {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .node-list-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          width: 100%;
          padding: 0.5rem 0.6rem;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: #e2e8f0;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .node-list-item:hover {
          background: rgba(99, 102, 241, 0.1);
        }

        .list-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .list-type {
          margin-left: auto;
          font-size: 0.65rem;
          color: #64748b;
          text-transform: capitalize;
        }

        /* Status Section */
        .status-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .status-header h4 {
          font-size: 0.85rem;
          margin: 0;
        }

        .status-badge {
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.in-progress {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .progress-bar-container {
          position: relative;
          margin-bottom: 1rem;
        }

        .progress-bar {
          height: 8px;
          background: linear-gradient(90deg, #8b5cf6, #6366f1);
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }

        .progress-glow {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 30px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4));
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          from { opacity: 0; }
          50% { opacity: 1; }
          to { opacity: 0; }
        }

        .progress-text {
          display: block;
          text-align: right;
          font-size: 0.7rem;
          color: #64748b;
          margin-top: 0.3rem;
        }

        .limits-info {
          margin-top: 1rem;
        }

        .limit-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          margin-bottom: 0.35rem;
        }

        .limit-label {
          color: #94a3b8;
        }

        .limit-value {
          color: #e2e8f0;
        }

        .limit-value .used {
          color: #8b5cf6;
          font-weight: 600;
        }

        .limit-value .total {
          color: #64748b;
        }

        .limit-bar {
          height: 6px;
          background: rgba(99, 102, 241, 0.2);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .limit-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #6366f1);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .upgrade-btn {
          width: 100%;
          padding: 0.65rem;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2));
          border: 1px solid rgba(139, 92, 246, 0.4);
          border-radius: 8px;
          color: #c4b5fd;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .upgrade-btn:hover {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(99, 102, 241, 0.3));
          border-color: rgba(139, 92, 246, 0.6);
        }

        .pro-features {
          font-size: 0.7rem;
          color: #64748b;
          text-align: center;
          margin-top: 0.5rem;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: linear-gradient(180deg, #151530 0%, #0f0f23 100%);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 20px;
          padding: 2rem;
          max-width: 450px;
          width: 100%;
          position: relative;
          animation: modalSlide 0.3s ease-out;
        }

        @keyframes modalSlide {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: none;
          border-radius: 8px;
          color: #94a3b8;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .modal-content h2 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #fff, #c4b5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .pro-features-list {
          margin-bottom: 1.5rem;
        }

        .pro-feature {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .pro-feature:last-child {
          border-bottom: none;
        }

        .feature-check {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(16, 185, 129, 0.2);
          border-radius: 50%;
          color: #10b981;
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        .pro-feature strong {
          display: block;
          color: #e2e8f0;
          font-size: 0.9rem;
          margin-bottom: 0.15rem;
        }

        .pro-feature p {
          color: #64748b;
          font-size: 0.8rem;
          margin: 0;
        }

        .subscribe-btn {
          display: block;
          width: 100%;
          padding: 0.85rem;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          border-radius: 10px;
          color: white;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .subscribe-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
        }

        /* Timeline Container */
        .timeline-container {
          background: rgba(10, 10, 26, 0.8);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          min-height: 550px;
        }

        .timeline-container.hidden {
          display: none;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .page-hero h1 {
            font-size: 1.75rem;
          }
          
          .quick-stats {
            gap: 1rem;
          }
          
          .stat-value {
            font-size: 1.2rem;
          }
          
          .main-panel {
            grid-template-columns: 1fr;
          }
          
          .side-panel {
            order: -1;
          }
        }
      `}</style>
    </div>
  )
}

// Vector Space Visualization Component
function VectorSpaceVisualization({ 
  nodes, 
  selectedNode, 
  onSelectNode,
  calculateSimilarity 
}: { 
  nodes: Node[]
  selectedNode: Node | null
  onSelectNode: (node: Node) => void
  calculateSimilarity: (a: Node, b: Node) => number
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Project 3D vectors to 2D for visualization
  const projectTo2D = (vector?: [number, number, number]): { x: number; y: number } => {
    if (!vector) return { x: 250, y: 250 }
    // Simple projection: use first two dimensions with scaling
    return {
      x: 250 + vector[0] * 180,
      y: 250 - vector[1] * 180
    }
  }

  const clusters = [
    { name: 'Core Systems', types: ['entity'], color: '#8b5cf6' },
    { name: 'Technologies', types: ['concept'], color: '#06b6d4' },
    { name: 'Operations', types: ['action'], color: '#10b981' },
    { name: 'Attributes', types: ['property'], color: '#f59e0b' }
  ]

  return (
    <div className="vector-space">
      <svg ref={svgRef} viewBox="0 0 500 500" className="vector-svg">
        {/* Background grid */}
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect width="500" height="500" fill="#0a0a1a" rx="12" />
        <rect width="500" height="500" fill="url(#centerGlow)" />
        
        {/* Axis lines */}
        <line x1="250" y1="20" x2="250" y2="480" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="20" y1="250" x2="480" y2="250" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
        
        {/* Cluster regions */}
        {clusters.map((cluster, i) => {
          const clusterNodes = nodes.filter(n => cluster.types.includes(n.type))
          if (clusterNodes.length === 0) return null
          
          const centerX = clusterNodes.reduce((sum, n) => sum + projectTo2D(n.vector).x, 0) / clusterNodes.length
          const centerY = clusterNodes.reduce((sum, n) => sum + projectTo2D(n.vector).y, 0) / clusterNodes.length
          
          return (
            <ellipse
              key={cluster.name}
              cx={centerX}
              cy={centerY}
              rx={100}
              ry={80}
              fill={`${cluster.color}10`}
              stroke={`${cluster.color}30`}
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          )
        })}
        
        {/* Connection lines between similar nodes */}
        {nodes.map((node, i) => 
          nodes.slice(i + 1).map(otherNode => {
            const similarity = calculateSimilarity(node, otherNode)
            if (similarity < 0.85) return null
            
            const p1 = projectTo2D(node.vector)
            const p2 = projectTo2D(otherNode.vector)
            
            return (
              <line
                key={`${node.id}-${otherNode.id}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={`rgba(139, 92, 246, ${(similarity - 0.85) * 3})`}
                strokeWidth="1"
              />
            )
          })
        )}
        
        {/* Nodes */}
        {nodes.map(node => {
          const pos = projectTo2D(node.vector)
          const isSelected = selectedNode?.id === node.id
          const isHovered = hoveredNode === node.id
          const colors = NODE_COLORS[node.type]
          const size = isSelected ? 14 : isHovered ? 12 : 10
          
          return (
            <g key={node.id}>
              {(isSelected || isHovered) && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={size + 8}
                  fill={`${colors.glow}30`}
                />
              )}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={size}
                fill={colors.fill}
                filter={isSelected ? 'url(#glow)' : undefined}
                className="vector-node"
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectNode(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text
                x={pos.x}
                y={pos.y + size + 14}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="9"
                className="vector-label"
                style={{ pointerEvents: 'none' }}
              >
                {node.label}
              </text>
            </g>
          )
        })}
        
        {/* Similarity tooltip */}
        {hoveredNode && selectedNode && hoveredNode !== selectedNode.id && (() => {
          const hoverNodeData = nodes.find(n => n.id === hoveredNode)
          if (!hoverNodeData) return null
          const sim = calculateSimilarity(selectedNode, hoverNodeData)
          const pos = projectTo2D(hoverNodeData.vector)
          
          return (
            <g>
              <rect
                x={pos.x - 30}
                y={pos.y - 35}
                width={60}
                height={22}
                rx={4}
                fill="rgba(15, 15, 35, 0.95)"
                stroke="rgba(139, 92, 246, 0.5)"
              />
              <text
                x={pos.x}
                y={pos.y - 20}
                textAnchor="middle"
                fill="#c4b5fd"
                fontSize="10"
                fontWeight="bold"
              >
                {(sim * 100).toFixed(0)}%
              </text>
            </g>
          )
        })()}
      </svg>
      
      {/* Legend */}
      <div className="vector-legend">
        <h4>Vector Space Clusters</h4>
        {clusters.map(cluster => (
          <div key={cluster.name} className="v-legend-item">
            <span className="v-legend-color" style={{ background: cluster.color }}></span>
            <span>{cluster.name}</span>
          </div>
        ))}
        <p className="vector-hint">Click nodes to compare similarities</p>
      </div>
      
      <style jsx>{`
        .vector-space {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }
        
        .vector-svg {
          flex: 1;
          max-width: 500px;
          background: #0a0a1a;
          border-radius: 12px;
        }
        
        .vector-node {
          transition: all 0.2s ease;
        }
        
        .vector-node:hover {
          filter: url(#glow);
        }
        
        .vector-legend {
          background: rgba(15, 15, 35, 0.8);
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 12px;
          padding: 1rem;
          min-width: 140px;
        }
        
        .vector-legend h4 {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }
        
        .v-legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #94a3b8;
          margin-bottom: 0.4rem;
        }
        
        .v-legend-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }
        
        .vector-hint {
          font-size: 0.7rem;
          color: #64748b;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  )
}

// Timeline Visualization Component
function TimelineVisualization({
  nodes,
  edges,
  currentDay,
  onDayChange,
  isPlaying,
  onPlayToggle
}: {
  nodes: Node[]
  edges: Edge[]
  currentDay: number
  onDayChange: (day: number) => void
  isPlaying: boolean
  onPlayToggle: () => void
}) {
  const visibleNodes = nodes.filter(n => n.dayAdded <= currentDay)
  const visibleEdges = edges.filter(e => 
    e.dayAdded <= currentDay &&
    visibleNodes.find(n => n.id === e.source) &&
    visibleNodes.find(n => n.id === e.target)
  )

  const milestones = [
    { day: 1, event: 'SciMSPT Core Initialized', icon: '🚀' },
    { day: 3, event: 'Neural Tracking Online', icon: '🧠' },
    { day: 7, event: 'Vector Embeddings Active', icon: '📊' },
    { day: 12, event: 'Scability Achieved', icon: '⚡' },
    { day: 15, event: 'Adaptive Learning Enabled', icon: '🔄' },
    { day: 30, event: 'Full System Operational', icon: '✨' }
  ]

  return (
    <div className="timeline-view">
      {/* Timeline Header */}
      <div className="timeline-header">
        <h3>Knowledge Evolution Timeline</h3>
        <div className="day-counter">
          <span className="day-label">Day</span>
          <span className="day-value">{currentDay}</span>
          <span className="day-total">/30</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="timeline-stats">
        <div className="tl-stat">
          <span className="tl-stat-value">{visibleNodes.length}</span>
          <span className="tl-stat-label">Active Nodes</span>
        </div>
        <div className="tl-stat">
          <span className="tl-stat-value">{visibleEdges.length}</span>
          <span className="tl-stat-label">Connections</span>
        </div>
        <div className="tl-stat">
          <span className="tl-stat-value">
            {visibleNodes.length > 1 ? (visibleEdges.length / (visibleNodes.length * (visibleNodes.length - 1) / 2)).toFixed(4) : '0'}
          </span>
          <span className="tl-stat-label">Density</span>
        </div>
      </div>

      {/* Milestones */}
      <div className="milestones">
        <h4>Growth Milestones</h4>
        <div className="milestone-list">
          {milestones.map(m => (
            <div 
              key={m.day} 
              className={`milestone-item ${currentDay >= m.day ? 'reached' : ''}`}
            >
              <span className="milestone-day">Day {m.day}</span>
              <span className="milestone-icon">{currentDay >= m.day ? m.icon : '○'}</span>
              <span className="milestone-event">{m.event}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Slider */}
      <div className="timeline-slider-container">
        <button 
          className="play-btn"
          onClick={onPlayToggle}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <input
          type="range"
          min="1"
          max="30"
          value={currentDay}
          onChange={(e) => onDayChange(parseInt(e.target.value))}
          className="timeline-slider"
        />
        <div className="slider-marks">
          {[1, 10, 20, 30].map(d => (
            <span key={d} className="slider-mark">{d}</span>
          ))}
        </div>
      </div>

      {/* Node Appearance List */}
      <div className="appearance-list">
        <h4>Recently Added</h4>
        {visibleNodes
          .slice(-5)
          .reverse()
          .map(node => (
            <div key={node.id} className="appearance-item">
              <span 
                className="appearance-dot" 
                style={{ background: NODE_COLORS[node.type].fill }}
              ></span>
              <span className="appearance-name">{node.label}</span>
              <span className="appearance-day">Day {node.dayAdded}</span>
            </div>
          ))}
      </div>

      <style jsx>{`
        .timeline-view {
          padding: 0.5rem;
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .timeline-header h3 {
          font-size: 1.1rem;
          margin: 0;
          background: linear-gradient(135deg, #fff, #c4b5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .day-counter {
          display: flex;
          align-items: baseline;
          gap: 0.15rem;
        }

        .day-label {
          font-size: 0.8rem;
          color: #64748b;
        }

        .day-value {
          font-size: 2rem;
          font-weight: 700;
          color: #8b5cf6;
        }

        .day-total {
          font-size: 1rem;
          color: #64748b;
        }

        .timeline-stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(30, 41, 59, 0.3);
          border-radius: 10px;
        }

        .tl-stat {
          display: flex;
          flex-direction: column;
        }

        .tl-stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }

        .tl-stat-label {
          font-size: 0.7rem;
          color: #64748b;
          text-transform: uppercase;
        }

        .milestones {
          margin-bottom: 1.5rem;
        }

        .milestones h4 {
          font-size: 0.8rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .milestone-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.5rem;
        }

        .milestone-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.8rem;
          background: rgba(30, 41, 59, 0.3);
          border-radius: 8px;
          opacity: 0.4;
          transition: all 0.3s ease;
        }

        .milestone-item.reached {
          opacity: 1;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .milestone-day {
          font-size: 0.65rem;
          color: #64748b;
          min-width: 38px;
        }

        .milestone-icon {
          font-size: 1rem;
        }

        .milestone-event {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .milestone-item.reached .milestone-event {
          color: #e2e8f0;
        }

        .timeline-slider-container {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(30, 41, 59, 0.3);
          border-radius: 10px;
        }

        .play-btn {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 0.9rem;
          cursor: pointer;
          margin-right: 1rem;
          transition: all 0.2s ease;
        }

        .play-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        }

        .timeline-slider {
          width: calc(100% - 56px);
          height: 6px;
          -webkit-appearance: none;
          appearance: none;
          background: rgba(99, 102, 241, 0.2);
          border-radius: 3px;
          outline: none;
          vertical-align: middle;
        }

        .timeline-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(139, 92, 246, 0.4);
          transition: all 0.2s ease;
        }

        .timeline-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .slider-marks {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          padding-left: 56px;
        }

        .slider-mark {
          font-size: 0.7rem;
          color: #64748b;
        }

        .appearance-list h4 {
          font-size: 0.8rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .appearance-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .appearance-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .appearance-name {
          flex: 1;
          font-size: 0.85rem;
          color: #e2e8f0;
        }

        .appearance-day {
          font-size: 0.7rem;
          color: #64748b;
        }
      `}</style>
    </div>
  )
}
