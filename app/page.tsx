import { PillarCard } from '@/components/PillarCard'
import { DiagramGallery } from '@/components/DiagramGallery'
import Link from 'next/link'

/**
 * Home Page - SciMSPT Phase 3 AI-Native Architecture
 * 
 * This is the main landing page that showcases all architecture pillars.
 * Designed to merge directly into the main SciMSPT application.
 */

const pillars = [
  {
    id: 'maol',
    name: 'MAOL',
    fullName: 'Multi-Agent Orchestrator Layer',
    icon: '🧠',
    description: 'Central nervous system coordinating multiple specialized AI agents for intelligent task orchestration',
    status: 'Designed' as const,
    href: '/maol',
    features: ['Intent Router', 'Task Planner', 'Context Manager', 'Memory Synthesizer'],
  },
  {
    id: 'neural-tracking',
    name: 'Neural Tracking',
    fullName: 'Behavior Intelligence System',
    icon: '🔮',
    description: 'Privacy-first user intelligence with on-device TensorFlow.js processing and zero data export',
    status: 'Designed' as const,
    href: '/neural-tracking',
    features: ['On-device ML', 'Privacy by Design', 'Behavioral Patterns', 'Zero Exfiltration'],
  },
  {
    id: 'spatial-ui',
    name: 'Spatial UI',
    fullName: 'Immersive Interface Components',
    icon: '🎨',
    description: 'Three.js & WebGPU powered 3D interfaces breaking free from flat design limitations',
    status: 'Designed' as const,
    href: '/spatial-ui',
    features: ['Three.js Rendering', 'WebGPU Compute', 'Spatial Navigation', '60fps Target'],
  },
  {
    id: 'plugin-system',
    name: 'Plugin System',
    fullName: 'Secure Extensible Ecosystem',
    icon: '🔌',
    description: 'Isolated iframe sandbox execution with granular permission scopes for safe extensibility',
    status: 'Designed' as const,
    href: '/plugin-system',
    features: ['Sandbox Isolation', 'Permission Scopes', 'API Gateway', 'Manifest Validation'],
  },
  {
    id: 'intelligence-graph',
    name: 'Intelligence Graph',
    fullName: 'Semantic Knowledge Network',
    icon: '🕸️',
    description: 'Unified semantic knowledge network with vector embeddings and entity relationship mapping',
    status: 'Designed' as const,
    href: '/intelligence-graph',
    features: ['Vector Embeddings', 'Entity Relations', 'Query Understanding', 'Continuous Evolution'],
  },
  {
    id: 'emergent-behavior',
    name: 'Emergent Behavior',
    fullName: 'Self-Optimization Engine',
    icon: '🔄',
    description: 'Autonomous system improvement through continuous learning feedback loops and pattern discovery',
    status: 'Designed' as const,
    href: '/emergent-behavior',
    features: ['Feedback Loops', 'Adaptive Strategies', 'Pattern Discovery', 'Self-Tuning'],
  },
]

export default function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero section">
        <div className="hero-content">
          <div className="hero-badges">
            <span className="badge badge-primary">Phase 3</span>
            <span className="badge badge-success">AI-Native</span>
            <span className="badge badge-warning">Design Complete</span>
          </div>
          
          <h1 className="hero-title">
            <span className="text-gradient">SciMSPT</span> Architecture
          </h1>
          
          <p className="hero-subtitle">
            Next-generation application framework with built-in artificial intelligence, 
            machine learning, and self-evolving capabilities — designed to merge seamlessly 
            into production systems.
          </p>

          <div className="hero-actions">
            <Link href="/maol" className="btn btn-primary">
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

        <div className="hero-visual">
          <div className="architecture-preview">
            <div className="preview-layer presentation-layer">
              <span>Presentation Layer</span>
              <div className="layer-items">
                <div className="layer-item">Chat Interface</div>
                <div className="layer-item">Dashboard</div>
                <div className="layer-item">Spatial UI</div>
              </div>
            </div>
            <div className="preview-layer orchestration-layer">
              <span>Orchestration Core</span>
              <div className="layer-items">
                <div className="layer-item core">MAOL Engine</div>
              </div>
            </div>
            <div className="preview-layer agent-layer">
              <span>Specialist Agents</span>
              <div className="layer-items">
                <div className="layer-item agent">Code Agent</div>
                <div className="layer-item agent">Data Agent</div>
                <div className="layer-item agent">Creative Agent</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Pillars Grid */}
      <section className="pillars section" id="pillars">
        <h2 className="section-title">Architecture Pillars</h2>
        <p className="section-description">
          Six foundational components that form the AI-native architecture, 
          each designed as an independent module ready for integration.
        </p>
        
        <div className="grid grid-3">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.id} {...pillar} />
          ))}
        </div>
      </section>

      {/* Diagrams Gallery */}
      <DiagramGallery />

      {/* Quick Start / Integration Guide */}
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

      <style jsx>{`
        .home-page {
          animation: fadeInUp 0.5s ease-out;
        }

        /* Hero Section */
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          padding: var(--space-2xl) 0;
        }

        @media (max-width: 1024px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }

        .hero-badges {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-start;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        @media (max-width: 1024px) {
          .hero-badges {
            justify-content: center;
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

        @media (max-width: 1024px) {
          .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        @media (max-width: 1024px) {
          .hero-actions {
            justify-content: center;
          }
        }

        /* Architecture Preview Visual */
        .architecture-preview {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .preview-layer {
          padding: 1rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .presentation-layer {
          background: rgba(59, 130, 246, 0.1);
        }

        .orchestration-layer {
          background: rgba(139, 92, 246, 0.15);
        }

        .agent-layer {
          background: rgba(16, 185, 129, 0.1);
        }

        .preview-layer span {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.5rem;
        }

        .layer-items {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .layer-item {
          padding: 0.5rem 0.875rem;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 0.5rem;
          font-size: 0.85rem;
          color: #e2e8f0;
        }

        .layer-item.core {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          font-weight: 600;
        }

        .layer-item.agent {
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
        }

        /* Section Styles */
        .section-description {
          color: #94a3b8;
          max-width: 800px;
          margin-bottom: 2rem;
          font-size: 1.05rem;
        }

        /* Integration Steps */
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
      `}</style>
    </div>
  )
}
