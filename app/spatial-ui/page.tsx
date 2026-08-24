'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

// Types for our state management
interface FPSSamples {
  values: number[]
}

interface SceneState {
  rotationX: number
  rotationY: number
  zoom: number
  depthIntensity: number
  perspectiveMode: 'standard' | 'dramatic' | 'isometric'
  layout: 'grid' | 'sphere' | 'stack'
}

export default function SpatialUIPage() {
  // Core state
  const [fps, setFps] = useState(60)
  const [fpsSamples, setFpsSamples] = useState<FPSSamples>({ values: Array(30).fill(60) })
  const [drawCalls, setDrawCalls] = useState(124)
  const [memoryUsage, setMemoryUsage] = useState(48.2)
  const [gpuInfo, setGpuInfo] = useState({ vendor: 'Detecting...', renderer: 'Detecting...', webglSupport: false })
  const [progress, setProgress] = useState(65)
  
  // Scene state
  const [sceneState, setSceneState] = useState<SceneState>({
    rotationX: -15,
    rotationY: 25,
    zoom: 1,
    depthIntensity: 1,
    perspectiveMode: 'standard',
    layout: 'grid'
  })

  // Interaction states
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null)
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedScene, setSelectedScene] = useState('main')
  const [scrollY, setScrollY] = useState(0)

  // Refs
  const sceneRef = useRef<HTMLDivElement>(null)
  const fpsIntervalRef = useRef<NodeJS.Timeout>()
  const animationFrameRef = useRef<number>()

  // Detect GPU capabilities
  useEffect(() => {
    const detectGPU = () => {
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
          if (debugInfo) {
            const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown Vendor'
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown Renderer'
            setGpuInfo({
              vendor,
              renderer: renderer.length > 50 ? renderer.substring(0, 50) + '...' : renderer,
              webglSupport: true
            })
          } else {
            setGpuInfo({
              vendor: 'WebGL Available',
              renderer: 'Hardware Accelerated',
              webglSupport: true
            })
          }
        } else {
          setGpuInfo({
            vendor: 'Not Available',
            renderer: 'Software Rendering',
            webglSupport: false
          })
        }
      } catch {
        setGpuInfo({
          vendor: 'Detection Failed',
          renderer: 'Fallback Mode',
          webglSupport: false
        })
      }
    }

    detectGPU()
  }, [])

  // FPS counter simulation
  useEffect(() => {
    fpsIntervalRef.current = setInterval(() => {
      const newFps = Math.floor(58 + Math.random() * 4) // 58-62fps range
      setFps(newFps)
      
      setFpsSamples(prev => ({
        values: [...prev.values.slice(1), newFps]
      }))
      
      // Simulate varying metrics
      setDrawCalls(prev => prev + Math.floor(Math.random() * 10) - 5)
      setMemoryUsage(prev => Math.max(40, Math.min(56, prev + (Math.random() - 0.5) * 2)))
    }, 1000)

    return () => clearInterval(fpsIntervalRef.current)
  }, [])

  // Scroll handler for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mouse drag handlers for 3D scene
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    
    setSceneState(prev => ({
      ...prev,
      rotationY: prev.rotationY + deltaX * 0.3,
      rotationX: Math.max(-45, Math.min(45, prev.rotationX - deltaY * 0.3))
    }))
    
    setDragStart({ x: e.clientX, y: e.clientY })
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return
    const deltaX = e.touches[0].clientX - dragStart.x
    const deltaY = e.touches[0].clientY - dragStart.y
    
    setSceneState(prev => ({
      ...prev,
      rotationY: prev.rotationY + deltaX * 0.3,
      rotationX: Math.max(-45, Math.min(45, prev.rotationX - deltaY * 0.3))
    }))
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }, [isDragging, dragStart])

  // Zoom handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setSceneState(prev => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(2, prev.zoom - e.deltaY * 0.001))
    }))
  }, [])

  // Card flip handler
  const toggleCardFlip = (index: number) => {
    setFlippedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  // Get perspective value based on mode
  const getPerspectiveValue = () => {
    switch (sceneState.perspectiveMode) {
      case 'dramatic': return 300
      case 'isometric': return 1000
      default: return 600
    }
  }

  // Generate sparkline path from FPS samples
  const generateSparklinePath = () => {
    const { values } = fpsSamples
    if (values.length < 2) return ''
    
    const width = 120
    const height = 40
    const minVal = Math.min(...values) - 2
    const maxVal = Math.max(...values) + 2
    const range = maxVal - minVal || 1
    
    return values.map((val, i) => {
      const x = (i / (values.length - 1)) * width
      const y = height - ((val - minVal) / range) * height
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  // Component gallery items
  const galleryItems = [
    { title: 'Neural Network', icon: '🧠', color: '#3b82f6', depth: 0 },
    { title: 'Data Pipeline', icon: '📊', color: '#8b5cf6', depth: 1 },
    { title: 'Compute Shader', icon: '⚡', color: '#06b6d4', depth: 2 },
    { title: 'Memory Buffer', icon: '💾', color: '#10b981', depth: 3 },
    { title: 'Render Queue', icon: '🎨', color: '#f59e0b', depth: 4 },
    { title: 'Physics Engine', icon: '🔮', color: '#ef4444', depth: 5 },
  ]

  return (
    <div className="spatial-container">
      {/* Hero Section with 3D Background */}
      <section className="spatial-hero">
        <div className="hero-bg-grid" style={{ transform: `translateY(${scrollY * 0.3}px)` }} />
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        
        <div className="hero-content">
          <span className="badge badge-glow">Immersive 3D Experience</span>
          <h1>
            <span className="hero-icon">🌐</span>
            Spatial UI Architecture
          </h1>
          <p className="hero-subtitle">
            Next-generation interfaces powered by CSS 3D transforms, WebGPU compute shaders, 
            and hardware-accelerated rendering at 60fps
          </p>
          
          {/* Status Bar */}
          <div className="status-bar">
            <div className="status-item">
              <span className="status-dot status-active" />
              <span>Development Progress</span>
              <span className="status-value">{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="status-meta">
              <span>🆓 3D scenes today: <strong>7/20 free</strong></span>
              <a href="https://github.com/sponsors/testdemoqwenai2025-creator" target="_blank" rel="noopener noreferrer" className="upgrade-link">
                ⬆️ Upgrade to Pro
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics Dashboard */}
      <section className="metrics-section">
        <h2 className="section-title">
          <span className="title-icon">📈</span>
          Real-Time Performance Metrics
        </h2>
        
        <div className="metrics-grid">
          {/* FPS Counter */}
          <div className="metric-card metric-primary">
            <div className="metric-header">
              <span className="metric-label">Frame Rate</span>
              <span className={`metric-status ${fps >= 58 ? 'status-good' : 'status-warning'}`}>
                ● Target: 60fps
              </span>
            </div>
            <div className="metric-value fps-value">{fps}</div>
            <div className="metric-unit">FPS</div>
            <svg className="sparkline" viewBox="0 0 120 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={generateSparklinePath()} fill="none" stroke="#3b82f6" strokeWidth="2" />
              <path d={`${generateSparklinePath()} L 120 40 L 0 40 Z`} fill="url(#sparkGradient)" />
            </svg>
          </div>

          {/* Draw Calls */}
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Draw Calls</span>
              <span className="metric-status">Per Frame</span>
            </div>
            <div className="metric-value">{drawCalls}</div>
            <div className="metric-unit">calls/frame</div>
            <div className="mini-chart">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="chart-bar"
                  style={{ height: `${20 + Math.random() * 80}%`, opacity: 0.3 + Math.random() * 0.7 }}
                />
              ))}
            </div>
          </div>

          {/* Memory Usage */}
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">GPU Memory</span>
              <span className="metric-status">3D Assets</span>
            </div>
            <div className="metric-value">{memoryUsage.toFixed(1)}</div>
            <div className="metric-unit">MB allocated</div>
            <div className="memory-bar">
              <div className="memory-fill" style={{ width: `${memoryUsage}%` }} />
            </div>
          </div>

          {/* Compute Shaders */}
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Compute Units</span>
              <span className="metric-status status-active-text">Active</span>
            </div>
            <div className="metric-value">8</div>
            <div className="metric-unit">shaders running</div>
            <div className="compute-indicators">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="compute-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GPU Capability Showcase */}
      <section className="capability-section">
        <h2 className="section-title">
          <span className="title-icon">🖥️</span>
          Browser & GPU Capabilities
        </h2>
        
        <div className="capability-grid">
          <div className="cap-card cap-webgl">
            <div className="cap-icon">{gpuInfo.webglSupport ? '✅' : '❌'}</div>
            <div className="cap-title">WebGL Support</div>
            <div className="cap-status">{gpuInfo.webglSupport ? 'Hardware Accelerated' : 'Software Fallback'}</div>
          </div>
          
          <div className="cap-card">
            <div className="cap-icon">🏭</div>
            <div className="cap-title">GPU Vendor</div>
            <div className="cap-value">{gpuInfo.vendor}</div>
          </div>
          
          <div className="cap-card">
            <div className="cap-icon">🎮</div>
            <div className="cap-title">Renderer</div>
            <div className="cap-value small-text">{gpuInfo.renderer}</div>
          </div>
          
          <div className="cap-card">
            <div className="cap-icon">⚙️</div>
            <div className="cap-title">WebGPU API</div>
            <div className="cap-status">Experimental Support</div>
          </div>
          
          <div className="cap-card">
            <div className="cap-icon">🧮</div>
            <div className="cap-title">Compute Shaders</div>
            <div className="cap-status status-active-text">Simulated Active</div>
          </div>
          
          <div className="cap-card">
            <div className="cap-icon">🔄</div>
            <div className="cap-title">V-Sync</div>
            <div className="cap-status">Adaptive Enabled</div>
          </div>
        </div>
      </section>

      {/* Interactive 3D Spatial Demo */}
      <section className="demo-section">
        <h2 className="section-title">
          <span className="title-icon">🎮</span>
          Interactive 3D Spatial Demo
        </h2>
        <p className="section-desc">Drag to rotate • Scroll to zoom • Explore depth</p>
        
        <div 
          ref={sceneRef}
          className="scene-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsDragging(false)}
          onWheel={handleWheel}
        >
          <div 
            className="scene-viewport"
            style={{
              perspective: getPerspectiveValue(),
              transform: `scale(${sceneState.zoom})`
            }}
          >
            <div 
              className="scene-cube"
              style={{
                transform: `rotateX(${sceneState.rotationX}deg) rotateY(${sceneState.rotationY}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Cube Faces */}
              <div className="cube-face cube-front">
                <div className="face-content">
                  <span className="face-icon">🎨</span>
                  <span className="face-label">Front</span>
                  <span className="face-detail">Render Layer</span>
                </div>
              </div>
              <div className="cube-face cube-back">
                <div className="face-content">
                  <span className="face-icon">🔧</span>
                  <span className="face-label">Back</span>
                  <span className="face-detail">Compute Layer</span>
                </div>
              </div>
              <div className="cube-face cube-left">
                <div className="face-content">
                  <span className="face-icon">⬅️</span>
                  <span className="face-label">Left</span>
                  <span className="face-detail">Input Buffer</span>
                </div>
              </div>
              <div className="cube-face cube-right">
                <div className="face-content">
                  <span className="face-icon">➡️</span>
                  <span className="face-label">Right</span>
                  <span className="face-detail">Output Buffer</span>
                </div>
              </div>
              <div className="cube-face cube-top">
                <div className="face-content">
                  <span className="face-icon">⬆️</span>
                  <span className="face-label">Top</span>
                  <span className="face-detail">Z+ Depth</span>
                </div>
              </div>
              <div className="cube-face cube-bottom">
                <div className="face-content">
                  <span className="face-icon">⬇️</span>
                  <span className="face-label">Bottom</span>
                  <span className="face-detail">Z- Base</span>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div 
              className="floating-element float-1"
              style={{ 
                transform: `translateZ(${80 * sceneState.depthIntensity}px)`,
                animationDelay: '0s'
              }}
            >
              <span>🚀</span>
            </div>
            <div 
              className="floating-element float-2"
              style={{ 
                transform: `translateZ(${-60 * sceneState.depthIntensity}px)`,
                animationDelay: '0.5s'
              }}
            >
              <span>💫</span>
            </div>
            <div 
              className="floating-element float-3"
              style={{ 
                transform: `translateZ(${100 * sceneState.depthIntensity}px) translateX(100px)`,
                animationDelay: '1s'
              }}
            >
              <span>✨</span>
            </div>
          </div>

          {/* Scene Controls Overlay */}
          <div className="scene-controls">
            <div className="control-group">
              <label>Perspective</label>
              <select 
                value={sceneState.perspectiveMode}
                onChange={(e) => setSceneState(s => ({ ...s, perspectiveMode: e.target.value as any }))}
              >
                <option value="standard">Standard (600px)</option>
                <option value="dramatic">Dramatic (300px)</option>
                <option value="isometric">Isometric (1000px)</option>
              </select>
            </div>
            
            <div className="control-group">
              <label>Depth Intensity</label>
              <input 
                type="range" 
                min="0" 
                max="2" 
                step="0.1"
                value={sceneState.depthIntensity}
                onChange={(e) => setSceneState(s => ({ ...s, depthIntensity: parseFloat(e.target.value) }))}
              />
            </div>
            
            <button 
              className="reset-btn"
              onClick={() => setSceneState({ rotationX: -15, rotationY: 25, zoom: 1, depthIntensity: 1, perspectiveMode: 'standard', layout: 'grid' })}
            >
              ↺ Reset View
            </button>
          </div>
        </div>
      </section>

      {/* Z-Depth Layered Navigation */}
      <section className="layers-section">
        <h2 className="section-title">
          <span className="title-icon">📚</span>
          Z-Depth Layered Navigation
        </h2>
        <p className="section-desc">Cards positioned at different depths along the Z-axis</p>
        
        <div className="layers-container">
          {galleryItems.map((item, index) => (
            <div
              key={item.title}
              className={`depth-card ${hoveredCard === index ? 'card-hovered' : ''}`}
              style={{
                zIndex: item.depth,
                transform: `
                  translateZ(${(item.depth - 2.5) * 50 * sceneState.depthIntensity}px)
                  ${hoveredCard === index ? 'scale(1.05)' : ''}
                  translateY(${hoveredCard === index && hoveredCard > index ? '-10px' : hoveredCard === index && hoveredCard < index ? '10px' : '0'})
                `,
                transition: hoveredCard === index ? 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.3s ease',
                '--card-color': item.color
              } as React.CSSProperties}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="card-glow" />
              <div className="card-content">
                <span className="card-icon">{item.icon}</span>
                <span className="card-title">{item.title}</span>
                <span className="card-depth">z-index: {item.depth}</span>
              </div>
              <div className="card-edge card-edge-top" />
              <div className="card-edge card-edge-right" />
              <div className="card-edge card-edge-bottom" />
              <div className="card-edge card-edge-left" />
            </div>
          ))}
        </div>
      </section>

      {/* Spatial Component Gallery */}
      <section className="gallery-section">
        <h2 className="section-title">
          <span className="title-icon">🧩</span>
          Spatial Component Gallery
        </h2>
        
        <div className="gallery-grid">
          {/* 3D Flip Cards */}
          <div className="gallery-item">
            <h3 className="gallery-label">3D Flip Cards</h3>
            <p className="gallery-desc">Click to flip</p>
            <div className="flip-cards-container">
              {[0, 1, 2].map((idx) => (
                <div 
                  key={idx}
                  className={`flip-card ${flippedCards.includes(idx) ? 'flipped' : ''}`}
                  onClick={() => toggleCardFlip(idx)}
                >
                  <div className="flip-card-inner">
                    <div className="flip-card-front" style={{ background: `linear-gradient(135deg, ${['#3b82f6', '#8b5cf6', '#06b6d4'][idx]}, ${['#1d4ed8', '#6d28d9', '#0891b2'][idx]})` }}>
                      <span className="flip-icon">{['🎴', '🃏', '🎴'][idx]}</span>
                      <span className="flip-label">Front</span>
                    </div>
                    <div className="flip-card-back" style={{ background: `linear-gradient(135deg, #1e293b, #0f172a)` }}>
                      <span className="flip-icon">ℹ️</span>
                      <span className="flip-label">Details</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Action Buttons */}
          <div className="gallery-item">
            <h3 className="gallery-label">Floating Actions</h3>
            <p className="gallery-desc">Depth-aware buttons</p>
            <div className="fab-container">
              <button className="fab fab-primary" style={{ transform: 'translateZ(20px)' }}>
                <span>+</span>
              </button>
              <button className="fab fab-secondary" style={{ transform: 'translateZ(10px)', left: '-50px' }}>
                <span>✏️</span>
              </button>
              <button className="fab fab-secondary" style={{ transform: 'translateZ(10px)', right: '-50px' }}>
                <span>📁</span>
              </button>
              <button className="fab fab-tertiary" style={{ transform: 'translateZ(0px)', top: '-50px' }}>
                <span>⚙️</span>
              </button>
            </div>
          </div>

          {/* Spatial Menu */}
          <div className="gallery-item">
            <h3 className="gallery-label">Spatial Menu</h3>
            <p className="gallery-desc">Opens in 3D space</p>
            <div className="menu-demo">
              <button 
                className={`menu-trigger ${menuOpen ? 'active' : ''}`}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                ☰ Open Menu
              </button>
              <div className={`spatial-menu ${menuOpen ? 'open' : ''}`}>
                {['Dashboard', 'Analytics', 'Settings', 'Profile'].map((item, idx) => (
                  <div 
                    key={item}
                    className="menu-item"
                    style={{ 
                      transform: menuOpen ? `rotateX(0deg) translateZ(${(3 - idx) * 10}px)` : 'rotateX(-90deg)',
                      transitionDelay: menuOpen ? `${idx * 0.05}s` : `${(3 - idx) * 0.03}s`
                    }}
                  >
                    <span>{['📊', '📈', '⚙️', '👤'][idx]}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Depth-Aware Tooltips */}
          <div className="gallery-item">
            <h3 className="gallery-label">Depth Tooltips</h3>
            <p className="gallery-desc">Hover to reveal</p>
            <div className="tooltip-demo">
              {[0, 1, 2, 3].map((idx) => (
                <div 
                  key={idx}
                  className="tooltip-trigger"
                  onMouseEnter={() => setActiveTooltip(idx)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <span>{['🔍', '💡', '🎯', '📍'][idx]}</span>
                  <div 
                    className={`depth-tooltip ${activeTooltip === idx ? 'visible' : ''}`}
                    style={{ transform: `translateZ(${20 + idx * 10}px)` }}
                  >
                    <strong>Layer {idx + 1}</strong>
                    <p>This tooltip exists at z-depth {20 + idx * 10}px</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Scene Builder */}
      <section className="builder-section">
        <h2 className="section-title">
          <span className="title-icon">🏗️</span>
          Interactive Scene Builder
        </h2>
        
        <div className="builder-container">
          {/* Layout Selector */}
          <div className="builder-controls">
            <div className="control-panel">
              <h4>Layout Mode</h4>
              <div className="layout-buttons">
                {(['grid', 'sphere', 'stack'] as const).map((layout) => (
                  <button
                    key={layout}
                    className={`layout-btn ${sceneState.layout === layout ? 'active' : ''}`}
                    onClick={() => setSceneState(s => ({ ...s, layout }))}
                  >
                    {layout.charAt(0).toUpperCase() + layout.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="control-panel">
              <h4>Coordinate Transform</h4>
              <div className="coord-display">
                <div className="coord-row">
                  <span className="coord-label">Rotation X:</span>
                  <span className="coord-value">{sceneState.rotationX.toFixed(1)}°</span>
                </div>
                <div className="coord-row">
                  <span className="coord-label">Rotation Y:</span>
                  <span className="coord-value">{sceneState.rotationY.toFixed(1)}°</span>
                </div>
                <div className="coord-row">
                  <span className="coord-label">Zoom:</span>
                  <span className="coord-value">{sceneState.zoom.toFixed(2)}x</span>
                </div>
                <div className="coord-row">
                  <span className="coord-label">Perspective:</span>
                  <span className="coord-value">{getPerspectiveValue()}px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="builder-preview">
            <div 
              className="preview-scene"
              style={{ perspective: getPerspectiveValue() }}
            >
              <div 
                className="preview-elements"
                style={{
                  transform: `rotateX(${sceneState.rotationX}deg) rotateY(${sceneState.rotationY}deg) scale(${sceneState.zoom})`,
                  display: sceneState.layout === 'grid' ? 'grid' : sceneState.layout === 'sphere' ? 'flex' : 'flex',
                  gap: sceneState.layout === 'grid' ? '1rem' : undefined,
                  flexWrap: sceneState.layout !== 'stack' ? 'wrap' : 'nowrap'
                }}
              >
                {galleryItems.map((item, idx) => (
                  <div
                    key={item.title}
                    className="preview-block"
                    style={{
                      background: `linear-gradient(135deg, ${item.color}40, ${item.color}20)`,
                      border: `1px solid ${item.color}60`,
                      transform: sceneState.layout === 'sphere' 
                        ? `translateZ(${Math.cos(idx / galleryItems.length * Math.PI * 2) * 60}px) translateY(${Math.sin(idx / galleryItems.length * Math.PI * 2) * 30}px)`
                        : sceneState.layout === 'stack'
                        ? `translateZ(${idx * 20}px)`
                        : undefined,
                      boxShadow: `0 0 20px ${item.color}30`
                    }}
                  >
                    <span>{item.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parallax Demo Section */}
      <section className="parallax-section">
        <h2 className="section-title">
          <span className="title-icon">🌊</span>
          Parallax Scrolling Effect
        </h2>
        <p className="section-desc">Scroll to see layers move at different speeds</p>
        
        <div className="parallax-container">
          <div className="parallax-layer layer-bg" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
            <div className="layer-shape shape-1" />
            <div className="layer-shape shape-2" />
          </div>
          <div className="parallax-layer layer-mid" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
            <div className="layer-shape shape-3" />
            <div className="layer-shape shape-4" />
          </div>
          <div className="parallax-layer layer-fg" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
            <div className="layer-content">
              <span className="layer-emoji">🚀</span>
              <span>Foreground Element</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="actions">
        <Link href="/" className="nav-btn nav-btn-outline">← Back to Overview</Link>
        <Link href="/maol" className="nav-btn nav-btn-outline">View MAOL →</Link>
      </section>

      <style jsx>{`
        /* ===== BASE STYLES ===== */
        .spatial-container {
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0a1a 0%, #0d1033 50%, #0a0a1a 100%);
          color: #ffffff;
          position: relative;
          overflow-x: hidden;
        }

        /* ===== HERO SECTION ===== */
        .spatial-hero {
          position: relative;
          padding: 4rem 2rem 3rem;
          text-align: center;
          overflow: hidden;
        }

        .hero-bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          transition: transform 0.1s ease-out;
        }

        .hero-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }

        .hero-glow-1 {
          width: 400px;
          height: 400px;
          background: rgba(59, 130, 246, 0.3);
          top: -100px;
          left: -100px;
        }

        .hero-glow-2 {
          width: 500px;
          height: 500px;
          background: rgba(139, 92, 246, 0.2);
          bottom: -150px;
          right: -150px;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
        }

        .badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .badge-glow {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
          border: 1px solid rgba(139, 92, 246, 0.4);
          color: #c4b5fd;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
        }

        .spatial-hero h1 {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          margin: 1rem 0;
          background: linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #c4b5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .hero-icon {
          font-size: 3rem;
          filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5));
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .hero-subtitle {
          color: #94a3b8;
          font-size: 1.1rem;
          line-height: 1.7;
          max-width: 650px;
          margin: 0 auto 2rem;
        }

        /* Status Bar */
        .status-bar {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1rem;
          padding: 1.25rem 1.5rem;
          margin-top: 2rem;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
          color: #94a3b8;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-active {
          background: #10b981;
          box-shadow: 0 0 10px #10b981;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .status-value {
          margin-left: auto;
          color: #3b82f6;
          font-weight: 700;
        }

        .progress-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 3px;
          transition: width 0.5s ease;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        .status-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: #64748b;
        }

        .upgrade-link {
          color: #8b5cf6;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .upgrade-link:hover {
          color: #a78bfa;
          text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }

        /* ===== SECTION STYLES ===== */
        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .title-icon {
          font-size: 1.5rem;
        }

        .section-desc {
          color: #64748b;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        section {
          padding: 3rem 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ===== METRICS DASHBOARD ===== */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1rem;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.1);
        }

        .metric-primary {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
          border-color: rgba(59, 130, 246, 0.2);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .metric-label {
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .metric-status {
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.05);
          color: #64748b;
        }

        .status-good { color: #10b981; background: rgba(16, 185, 129, 0.1); }
        .status-warning { color: #f59e0b; background: rgba(245, 158, 11, 0.1); }
        .status-active-text { color: #3b82f6; background: rgba(59, 130, 246, 0.1); }

        .metric-value {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1;
          background: linear-gradient(135deg, #fff, #93c5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .fps-value {
          animation: fpsPulse 1s ease-in-out infinite;
        }

        @keyframes fpsPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .metric-unit {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.5rem;
        }

        .sparkline {
          width: 100%;
          height: 40px;
          margin-top: 1rem;
        }

        .mini-chart {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 30px;
          margin-top: 1rem;
        }

        .chart-bar {
          flex: 1;
          background: linear-gradient(to top, #3b82f6, #8b5cf6);
          border-radius: 2px;
          min-height: 4px;
          transition: height 0.3s ease;
        }

        .memory-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          margin-top: 1rem;
          overflow: hidden;
        }

        .memory-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .compute-indicators {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .compute-pulse {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          animation: computeGlow 1.5s ease-in-out infinite;
        }

        @keyframes computeGlow {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1); box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
        }

        /* ===== CAPABILITY SECTION ===== */
        .capability-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }

        .cap-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 0.75rem;
          padding: 1.25rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .cap-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(59, 130, 246, 0.3);
          transform: translateY(-2px);
        }

        .cap-webgl {
          border-color: rgba(16, 185, 129, 0.3);
        }

        .cap-icon {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .cap-title {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-bottom: 0.25rem;
        }

        .cap-status, .cap-value {
          font-size: 0.85rem;
          color: #e2e8f0;
          font-weight: 500;
        }

        .small-text {
          font-size: 0.75rem !important;
          word-break: break-word;
        }

        /* ===== 3D SCENE DEMO ===== */
        .demo-section {
          position: relative;
        }

        .scene-container {
          background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 1.5rem;
          padding: 3rem 2rem;
          cursor: grab;
          user-select: none;
          touch-action: none;
          position: relative;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .scene-container:active {
          cursor: grabbing;
        }

        .scene-viewport {
          width: 200px;
          height: 200px;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.1s ease-out, perspective 0.3s ease;
        }

        .scene-cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.05s ease-out;
        }

        .cube-face {
          position: absolute;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid;
          border-radius: 12px;
          backface-visibility: visible;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(5px);
        }

        .cube-front {
          transform: translateZ(100px);
          border-color: rgba(59, 130, 246, 0.5);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05));
        }

        .cube-back {
          transform: rotateY(180deg) translateZ(100px);
          border-color: rgba(139, 92, 246, 0.5);
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05));
        }

        .cube-left {
          transform: rotateY(-90deg) translateZ(100px);
          border-color: rgba(6, 182, 212, 0.5);
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(6, 182, 212, 0.05));
        }

        .cube-right {
          transform: rotateY(90deg) translateZ(100px);
          border-color: rgba(16, 185, 129, 0.5);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
        }

        .cube-top {
          transform: rotateX(90deg) translateZ(100px);
          border-color: rgba(245, 158, 11, 0.5);
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05));
        }

        .cube-bottom {
          transform: rotateX(-90deg) translateZ(100px);
          border-color: rgba(239, 68, 68, 0.5);
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
        }

        .face-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .face-icon {
          font-size: 2rem;
        }

        .face-label {
          font-size: 1rem;
          font-weight: 600;
        }

        .face-detail {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        /* Floating Elements */
        .floating-element {
          position: absolute;
          font-size: 1.5rem;
          animation: floatElement 3s ease-in-out infinite;
        }

        .float-1 { top: 10%; left: 10%; }
        .float-2 { bottom: 10%; right: 10%; }
        .float-3 { top: 20%; right: 15%; }

        @keyframes floatElement {
          0%, 100% { transform: translateY(0) translateZ(var(--tz, 80px)); }
          50% { transform: translateY(-15px) translateZ(var(--tz, 80px)); }
        }

        /* Scene Controls */
        .scene-controls {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1rem;
          align-items: center;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          padding: 0.75rem 1.25rem;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .control-group label {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .control-group select,
        .control-group input[type="range"] {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          padding: 0.35rem 0.5rem;
          color: white;
          font-size: 0.75rem;
          outline: none;
        }

        .control-group input[type="range"] {
          width: 80px;
          accent-color: #3b82f6;
        }

        .reset-btn {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.4);
          color: #93c5fd;
          padding: 0.4rem 0.8rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .reset-btn:hover {
          background: rgba(59, 130, 246, 0.3);
        }

        /* ===== DEPTH LAYERS NAVIGATION ===== */
        .layers-container {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          perspective: 800px;
          padding: 2rem 0;
          min-height: 280px;
        }

        .depth-card {
          width: 140px;
          height: 180px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-color, rgba(59, 130, 246, 0.3));
          border-radius: 1rem;
          position: relative;
          cursor: pointer;
          transform-style: preserve-3d;
          transition: all 0.3s ease;
        }

        .depth-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background: linear-gradient(135deg, var(--card-color, #3b82f6), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .card-hovered::before {
          opacity: 0.5;
        }

        .card-hovered {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px color-mix(in srgb, var(--card-color, #3b82f6) 30%, transparent);
        }

        .card-glow {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at center, var(--card-color, #3b82f6), transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card-hovered .card-glow {
          opacity: 0.1;
        }

        .card-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          position: relative;
          z-index: 1;
        }

        .card-icon {
          font-size: 2.5rem;
        }

        .card-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #e2e8f0;
        }

        .card-depth {
          font-size: 0.7rem;
          color: #64748b;
          font-family: monospace;
        }

        .card-edge {
          position: absolute;
          background: var(--card-color, #3b82f6);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card-hovered .card-edge {
          opacity: 0.6;
        }

        .card-edge-top { top: 0; left: 10%; right: 10%; height: 2px; }
        .card-edge-right { right: 0; top: 10%; bottom: 10%; width: 2px; }
        .card-edge-bottom { bottom: 0; left: 10%; right: 10%; height: 2px; }
        .card-edge-left { left: 0; top: 10%; bottom: 10%; width: 2px; }

        /* ===== COMPONENT GALLERY ===== */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
        }

        .gallery-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 1rem;
          padding: 1.5rem;
        }

        .gallery-label {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .gallery-desc {
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 1rem;
        }

        /* Flip Cards */
        .flip-cards-container {
          display: flex;
          gap: 1rem;
          justify-content: center;
          perspective: 1000px;
        }

        .flip-card {
          width: 80px;
          height: 110px;
          cursor: pointer;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .flip-card.flipped {
          transform: rotateY(180deg);
        }

        .flip-card-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }

        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 0.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .flip-card-back {
          transform: rotateY(180deg);
        }

        .flip-icon {
          font-size: 1.5rem;
        }

        .flip-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.8);
        }

        /* Floating Action Buttons */
        .fab-container {
          position: relative;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 500px;
        }

        .fab {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .fab:hover {
          transform: translateZ(30px) scale(1.1) !important;
        }

        .fab-primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          z-index: 3;
        }

        .fab-secondary {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          width: 42px;
          height: 42px;
          font-size: 1rem;
          z-index: 2;
        }

        .fab-tertiary {
          background: linear-gradient(135deg, #64748b, #475569);
          width: 38px;
          height: 38px;
          font-size: 0.9rem;
          z-index: 1;
        }

        /* Spatial Menu */
        .menu-demo {
          position: relative;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 500px;
        }

        .menu-trigger {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          z-index: 10;
        }

        .menu-trigger.active {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .spatial-menu {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transform-origin: top center;
        }

        .menu-item {
          background: rgba(30, 41, 59, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1.25rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
          white-space: nowrap;
          transform-origin: top center;
          transform: rotateX(-90deg);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .spatial-menu.open .menu-item {
          transform: rotateX(0deg);
          opacity: 1;
        }

        .menu-item:hover {
          background: rgba(51, 65, 85, 0.95);
          border-color: rgba(59, 130, 246, 0.3);
        }

        /* Depth Tooltips */
        .tooltip-demo {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
          perspective: 500px;
        }

        .tooltip-trigger {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }

        .tooltip-trigger:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .depth-tooltip {
          position: absolute;
          top: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%) translateZ(20px);
          background: rgba(15, 23, 42, 0.98);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          width: 160px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 100;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .depth-tooltip.visible {
          opacity: 1;
          visibility: visible;
        }

        .depth-tooltip strong {
          display: block;
          font-size: 0.8rem;
          color: #93c5fd;
          margin-bottom: 0.25rem;
        }

        .depth-tooltip p {
          font-size: 0.7rem;
          color: #94a3b8;
          margin: 0;
          line-height: 1.4;
        }

        /* ===== SCENE BUILDER ===== */
        .builder-container {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
          align-items: start;
        }

        @media (max-width: 900px) {
          .builder-container {
            grid-template-columns: 1fr;
          }
        }

        .builder-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .control-panel {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 0.75rem;
          padding: 1rem;
        }

        .control-panel h4 {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .layout-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .layout-btn {
          flex: 1;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: #94a3b8;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .layout-btn.active {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.4);
          color: #93c5fd;
        }

        .coord-display {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .coord-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
        }

        .coord-label {
          color: #64748b;
        }

        .coord-value {
          color: #93c5fd;
          font-family: monospace;
        }

        .builder-preview {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 1rem;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .preview-scene {
          perspective: 600px;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .preview-elements {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          transform-style: preserve-3d;
          transition: transform 0.3s ease;
        }

        .preview-block {
          width: 70px;
          height: 70px;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          transition: all 0.3s ease;
        }

        /* ===== PARALLAX SECTION ===== */
        .parallax-container {
          position: relative;
          height: 350px;
          border-radius: 1rem;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .parallax-layer {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.1s ease-out;
        }

        .layer-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
        }

        .shape-1 {
          width: 200px;
          height: 200px;
          background: rgba(59, 130, 246, 0.3);
          top: 20%;
          left: 10%;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          background: rgba(139, 92, 246, 0.3);
          bottom: 20%;
          right: 15%;
        }

        .shape-3 {
          width: 120px;
          height: 120px;
          background: rgba(6, 182, 212, 0.3);
          top: 40%;
          right: 30%;
        }

        .shape-4 {
          width: 100px;
          height: 100px;
          background: rgba(16, 185, 129, 0.3);
          bottom: 30%;
          left: 25%;
        }

        .layer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          padding: 1.5rem 2rem;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .layer-emoji {
          font-size: 2.5rem;
        }

        /* ===== ACTIONS / NAVIGATION ===== */
        .actions {
          display: flex;
          justify-content: space-between;
          padding: 2rem 1.5rem 3rem;
          max-width: 1200px;
          margin: 0 auto;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .nav-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .nav-btn-outline {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #e2e8f0;
        }

        .nav-btn-outline:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(59, 130, 246, 0.5);
          color: #93c5fd;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .spatial-hero {
            padding: 3rem 1rem 2rem;
          }

          .spatial-hero h1 {
            font-size: 1.75rem;
            flex-wrap: wrap;
            justify-content: center;
          }

          .hero-icon {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 0.95rem;
          }

          .scene-container {
            padding: 2rem 1rem;
            min-height: 320px;
          }

          .scene-viewport {
            width: 150px;
            height: 150px;
          }

          .cube-face {
            width: 150px;
            height: 150px;
          }

          .cube-front { transform: translateZ(75px); }
          .cube-back { transform: rotateY(180deg) translateZ(75px); }
          .cube-left { transform: rotateY(-90deg) translateZ(75px); }
          .cube-right { transform: rotateY(90deg) translateZ(75px); }
          .cube-top { transform: rotateX(90deg) translateZ(75px); }
          .cube-bottom { transform: rotateX(-90deg) translateZ(75px); }

          .scene-controls {
            flex-direction: column;
            width: calc(100% - 2rem);
            border-radius: 1rem;
          }

          .layers-container {
            gap: 1rem;
          }

          .depth-card {
            width: 110px;
            height: 150px;
          }

          .metrics-grid {
            grid-template-columns: 1fr 1fr;
          }

          .metric-value {
            font-size: 2.25rem;
          }

          .actions {
            flex-direction: column;
            gap: 1rem;
          }

          .nav-btn {
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .gallery-grid {
            grid-template-columns: 1fr;
          }

          .capability-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  )
}
