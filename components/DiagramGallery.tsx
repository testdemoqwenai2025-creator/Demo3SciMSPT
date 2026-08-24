/**
 * DiagramGallery Component - Displays architecture diagrams
 * 
 * Shows all 6 architecture diagrams with links to full-resolution versions.
 * Designed to be reusable and mergeable into SciMSPT.
 */

const diagrams = [
  {
    id: 'maol-architecture',
    name: 'MAOL Architecture',
    subtitle: 'Multi-Agent Orchestrator Layer',
    icon: '🧠',
    filename: '01-maol-architecture.png',
    path: '/phase3/diagrams/01-maol-architecture.png',
    description: 'Central orchestration system coordinating AI agents',
  },
  {
    id: 'neural-tracking',
    name: 'Neural Tracking',
    subtitle: 'Behavior Intelligence Pipeline',
    icon: '🔮',
    filename: '02-neural-tracking.png',
    path: '/phase3/diagrams/02-neural-tracking.png',
    description: 'Privacy-first on-device behavior analysis',
  },
  {
    id: 'spatial-ui',
    name: 'Spatial UI',
    subtitle: '3D Interface Components',
    icon: '🎨',
    filename: '03-spatial-ui.png',
    path: '/phase3/diagrams/03-spatial-ui.png',
    description: 'Immersive Three.js/WebGPU interfaces',
  },
  {
    id: 'plugin-system',
    name: 'Plugin System',
    subtitle: 'Secure Sandbox Design',
    icon: '🔌',
    filename: '04-plugin-system.png',
    path: '/phase3/diagrams/04-plugin-system.png',
    description: 'Isolated extensible ecosystem architecture',
  },
  {
    id: 'intelligence-graph',
    name: 'Intelligence Graph',
    subtitle: 'Knowledge Network Visualization',
    icon: '🕸️',
    filename: '05-intelligence-graph.png',
    path: '/phase3/diagrams/05-intelligence-graph.png',
    description: 'Semantic knowledge with vector embeddings',
  },
  {
    id: 'emergent-behavior',
    name: 'Emergent Behavior',
    subtitle: 'Self-Optimization Engine',
    icon: '🔄',
    filename: '06-emergent-behavior.png',
    path: '/phase3/diagrams/06-emergent-behavior.png',
    description: 'Continuous learning feedback loops',
  },
]

export function DiagramGallery() {
  return (
    <section className="diagrams-section section" id="diagrams">
      <h2 className="section-title">Architecture Diagrams</h2>
      <p className="section-description">
        High-resolution visualizations of each architectural component, 
        ready for technical review and stakeholder presentations.
      </p>

      <div className="diagrams-container">
        <div className="diagrams-grid">
          {diagrams.map((diagram) => (
            <a
              key={diagram.id}
              href={diagram.path}
              target="_blank"
              rel="noopener noreferrer"
              className="diagram-card"
            >
              <div className="diagram-preview">
                <span className="diagram-icon">{diagram.icon}</span>
              </div>
              <div className="diagram-info">
                <h4 className="diagram-title">{diagram.name}</h4>
                <p className="diagram-subtitle">{diagram.subtitle}</p>
                <p className="diagram-description">{diagram.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .diagrams-section {
          background: rgba(30, 41, 59, 0.3);
          border-radius: var(--radius-2xl);
          padding: var(--space-2xl);
          border: 1px solid rgba(255, 255, 255, 0.05);
          margin-top: var(--space-2xl);
        }

        .section-description {
          color: #94a3b8;
          margin-bottom: 2rem;
          font-size: 1.05rem;
        }

        .diagrams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: var(--space-lg);
        }

        .diagram-card {
          background: rgba(15, 23, 42, 0.6);
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all var(--transition-normal);
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .diagram-card:hover {
          transform: scale(1.02);
          border-color: rgba(139, 92, 246, 0.4);
          box-shadow: var(--shadow-lg);
        }

        .diagram-preview {
          height: 180px;
          background: linear-gradient(135deg, #1e293b, #334155);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .diagram-preview::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            45deg,
            transparent 40%,
            rgba(139, 92, 246, 0.1) 50%,
            transparent 60%
          );
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }

        .diagram-card:hover .diagram-preview::before {
          transform: translateX(100%);
        }

        .diagram-icon {
          font-size: 3.5rem;
          line-height: 1;
          z-index: 1;
        }

        .diagram-info {
          padding: var(--space-lg);
        }

        .diagram-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #f1f5f9;
          margin-bottom: 0.25rem;
        }

        .diagram-subtitle {
          font-size: 0.85rem;
          color: #60a5fa;
          margin-bottom: 0.5rem;
        }

        .diagram-description {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .diagrams-grid {
            grid-template-columns: 1fr;
          }
          
          .diagrams-section {
            padding: var(--space-lg);
          }
        }
      `}</style>
    </section>
  )
}
