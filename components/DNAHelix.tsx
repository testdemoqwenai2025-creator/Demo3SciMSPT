'use client'

import { useEffect, useRef } from 'react'

/**
 * DNAHelix Decorative Component
 * 
 * Renders an animated DNA double helix on the sides of pages
 * Features:
 * - Canvas-based rendering for performance
 * - Animated nucleotides (A, T, G, C)
 * - Smooth rotation animation
 * - Responsive to theme changes
 * - Subtle, non-intrusive design
 */

interface Nucleotide {
  x: number
  y: number
  type: 'A' | 'T' | 'G' | 'C'
  angle: number
  opacity: number
}

export function DNAHelix({ side = 'left' }: { side?: 'left' | 'right' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const nucleotidesRef = useRef<Nucleotide[]>([])

  // Initialize nucleotides
  useEffect(() => {
    const types: Array<'A' | 'T' | 'G' | 'C'> = ['A', 'T', 'G', 'C']
    nucleotidesRef.current = Array.from({ length: 12 }, (_, i) => ({
      x: 0,
      y: i * 60 + Math.random() * 20,
      type: types[Math.floor(Math.random() * 4)],
      angle: (i / 12) * Math.PI * 4,
      opacity: 0.3 + Math.random() * 0.5
    }))
  }, [])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = 80
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let time = 0
    
    const animate = () => {
      if (!ctx || !canvas) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Get current theme
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
      
      // Draw helix strands
      const amplitude = 25
      const frequency = 0.02
      
      // Draw backbone lines
      ctx.strokeStyle = isDark 
        ? 'rgba(99, 102, 241, 0.2)' 
        : 'rgba(99, 102, 241, 0.15)'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      for (let y = 0; y < canvas.height; y += 5) {
        const x1 = side === 'left' 
          ? 40 + Math.sin(y * frequency + time) * amplitude 
          : 40 - Math.sin(y * frequency + time) * amplitude
        
        if (y === 0) {
          ctx.moveTo(x1, y)
        } else {
          ctx.lineTo(x1, y)
        }
      }
      ctx.stroke()

      // Draw second strand
      ctx.beginPath()
      for (let y = 0; y < canvas.height; y += 5) {
        const x2 = side === 'left'
          ? 40 - Math.sin(y * frequency + time) * amplitude
          : 40 + Math.sin(y * frequency + time) * amplitude
        
        if (y === 0) {
          ctx.moveTo(x2, y)
        } else {
          ctx.lineTo(x2, y)
        }
      }
      ctx.stroke()

      // Draw nucleotides and connections
      nucleotidesRef.current.forEach((nuc, i) => {
        const yOffset = (time * 30) % 60
        const adjustedY = ((nuc.y + yOffset) % canvas.height)
        
        const x1 = side === 'left'
          ? 40 + Math.sin(adjustedY * frequency + time) * amplitude
          : 40 - Math.sin(adjustedY * frequency + time) * amplitude
        
        const x2 = side === 'left'
          ? 40 - Math.sin(adjustedY * frequency + time) * amplitude
          : 40 + Math.sin(adjustedY * frequency + time) * amplitude

        // Draw connection line (base pair)
        ctx.strokeStyle = isDark
          ? `rgba(147, 197, 253, ${nuc.opacity * 0.3})`
          : `rgba(99, 102, 241, ${nuc.opacity * 0.2})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x1, adjustedY)
        ctx.lineTo(x2, adjustedY)
        ctx.stroke()

        // Draw nucleotide circles
        const colors = {
          A: isDark ? '#60a5fa' : '#3b82f6',   // Adenine - Blue
          T: isDark ? '#f472b6' : '#ec4899',   // Thymine - Pink  
          G: isDark ? '#4ade80' : '#22c55e',   // Guanine - Green
          C: isDark ? '#facc15' : '#eab308',   // Cytosine - Yellow
        }

        // Left nucleotide
        ctx.fillStyle = colors[nuc.type]
        ctx.globalAlpha = nuc.opacity
        ctx.beginPath()
        ctx.arc(x1, adjustedY, 8, 0, Math.PI * 2)
        ctx.fill()

        // Right nucleotide (complementary)
        ctx.fillStyle = colors[getComplement(nuc.type)]
        ctx.beginPath()
        ctx.arc(x2, adjustedY, 8, 0, Math.PI * 2)
        ctx.fill()

        // Draw letter
        ctx.fillStyle = isDark ? '#fff' : '#000'
        ctx.globalAlpha = nuc.opacity
        ctx.font = 'bold 10px Inter, system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(nuc.type, x1, adjustedY)
        ctx.fillText(getComplement(nuc.type), x2, adjustedY)
        
        ctx.globalAlpha = 1
      })

      time += 0.02
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [side])

  return (
    <div className={`dna-helix dna-helix-${side}`}>
      <canvas
        ref={canvasRef}
        className="dna-canvas"
        aria-hidden="true"
      />
      
      <style jsx>{`
        .dna-helix {
          position: fixed;
          top: 80px;
          bottom: 0;
          width: 80px;
          pointer-events: none;
          z-index: 1;
          opacity: 0.6;
          transition: opacity 300ms ease;
        }

        .dna-helix-left {
          left: 0;
        }

        .dna-helix-right {
          right: 0;
        }

        .dna-canvas {
          width: 100%;
          height: 100%;
        }

        /* Hide on mobile */
        @media (max-width: 1200px) {
          .dna-helix {
            display: none;
          }
        }

        /* Reduce opacity when hovering over main content */
        @media (hover: hover) {
          .dna-helix:hover {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  )
}

/**
 * Get complementary nucleotide
 */
function getComplement(nucleotide: 'A' | 'T' | 'G' | 'C'): 'T' | 'A' | 'C' | 'G' {
  switch (nucleotide) {
    case 'A': return 'T'
    case 'T': return 'A'
    case 'G': return 'C'
    case 'C': return 'G'
  }
}

/**
 * Static DNA Decoration (non-animated fallback)
 */
export function StaticDNADecoration({ side = 'left' }: { side?: 'left' | 'right' }) {
  return (
    <div className={`static-dna static-dna-${side}`}>
      <div className="dna-strand">
        {Array.from({ length: 20 }, (_, i) => {
          const types = ['A', 'T', 'G', 'C']
          const type = types[i % 4] as 'A' | 'T' | 'G' | 'C'
          const complement = getComplement(type)
          
          return (
            <div key={i} className="base-pair" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="nucleotide">{type}</span>
              <span className="bond"></span>
              <span className="nucleotide complement">{complement}</span>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .static-dna {
          position: fixed;
          top: 100px;
          bottom: 50px;
          width: 60px;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .static-dna-left {
          left: 10px;
        }

        .static-dna-right {
          right: 10px;
        }

        .dna-strand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          padding: 20px 0;
        }

        .base-pair {
          display: flex;
          align-items: center;
          gap: 4px;
          animation: float 3s ease-in-out infinite;
        }

        .nucleotide {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .nucleotide:nth-child(odd) {
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
        }

        .complement {
          background: linear-gradient(135deg, #f472b6, #ec4899);
        }

        .bond {
          width: 16px;
          height: 2px;
          background: rgba(148, 163, 184, 0.4);
          border-radius: 1px;
        }

        @keyframes float {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(3px);
          }
        }

        @media (max-width: 1200px) {
          .static-dna {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
