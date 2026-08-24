import type { Metadata } from 'next'
import { PillarCard } from '@/components/PillarCard'
import Link from 'next/link'

/**
 * MAOL Page - Multi-Agent Orchestrator Layer
 * 
 * This is a dedicated page for the MAOL architecture component.
 * It's designed to:
 * 1. Show detailed information about MAOL
 * 2. Be mergeable into SciMSPT as /maol route
 * 3. Include interactive components and code examples
 * 4. Display the architecture diagram with context
 */

export const metadata: Metadata = {
  title: 'MAOL - Multi-Agent Orchestrator Layer | SciMSPT',
  description: 'Detailed view of the Multi-Agent Orchestrator Layer architecture, components, and integration guide.',
}

const maolComponents = [
  {
    name: 'Intent Router',
    icon: '🎯',
    description: 'Classifies and routes user intentions to appropriate agents with confidence scoring',
    status: 'Implemented' as const,
    features: ['Multi-model classification', 'Entity extraction', 'Confidence scoring', 'Context-aware routing'],
  },
  {
    name: 'Task Planner',
    icon: '📋',
    description: 'Decomposes complex requests into executable subtasks via chain-of-thought',
    status: 'In Progress' as const,
    features: ['Task decomposition', 'Dependency mapping', 'Priority assignment', 'Execution planning'],
  },
  {
    name: 'Context Manager',
    icon: '📝',
    description: 'Maintains conversation state and user context across sessions',
    status: 'Designed' as const,
    features: ['Session state', 'User preferences', 'Conversation history', 'Context window'],
  },
  {
    name: 'Memory Synthesizer',
    icon: '🧠',
    description: 'Aggregates insights across sessions for continuous learning and improvement',
    status: 'Designed' as const,
    features: ['Episodic memory', 'Semantic knowledge', 'Pattern recognition', 'Insight extraction'],
  },
]

const relatedPillars = [
  { id: 'neural-tracking', name: 'Neural Tracking', href: '/neural-tracking', icon: '🔮' },
  { id: 'intelligence-graph', name: 'Intelligence Graph', href: '/intelligence-graph', icon: '🕸️' },
  { id: 'emergent-behavior', name: 'Emergent Behavior', href: '/emergent-behavior', icon: '🔄' },
]

export default function MAOLPage() {
  return (
    <div className="maol-page">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-badge">
          <span className="badge badge-primary">Core Component</span>
        </div>
        
        <h1 className="page-title">
          <span className="icon-large">🧠</span>
          MAOL
        </h1>
        
        <p className="page-subtitle">
          Multi-Agent Orchestrator Layer — The central nervous system of our AI-native architecture,
          coordinating multiple specialized agents to handle complex user intents intelligently.
        </p>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-value">4</span>
            <span className="stat-label">Core Components</span>
          </div>
          <div className="stat">
            <span className="stat-value">15+</span>
            <span className="stat-label">Intent Categories</span>
          </div>
          <div className="stat">
            <span className="stat-value">&lt;100ms</span>
            <span className="stat-label">Routing Latency</span>
          </div>
          <div className="stat">
            <span className="stat-value">1885</span>
            <span className="stat-label">Lines of TypeScript</span>
          </div>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="diagram-section">
        <h2>Architecture Overview</h2>
        <div className="diagram-container">
          <a 
            href="/phase3/diagrams/01-maol-architecture.png" 
            target="_blank" 
            rel="noopener noreferrer"
            className="diagram-link"
          >
            <div className="diagram-placeholder">
              <span className="placeholder-icon">🧠</span>
              <span className="placeholder-text">MAOL Architecture Diagram</span>
              <span className="placeholder-action">Click to view full resolution (241 KB)</span>
            </div>
          </a>
        </div>
      </section>

      {/* Components Grid */}
      <section className="components-section">
        <h2>Core Components</h2>
        <p className="section-description">
          The MAOL consists of four interconnected components that work together to provide
          intelligent task orchestration.
        </p>

        <div className="components-grid">
          {maolComponents.map((component) => (
            <article key={component.name} className="component-card">
              <div className="component-header">
                <span className="component-icon">{component.icon}</span>
                <div className="component-info">
                  <h3>{component.name}</h3>
                  <span className={`badge ${
                    component.status === 'Implemented' ? 'badge-success' : 
                    component.status === 'In Progress' ? 'badge-warning' : 'badge-info'
                  }`}>
                    {component.status}
                  </span>
                </div>
              </div>
              
              <p className="component-description">{component.description}</p>
              
              <ul className="feature-list">
                {component.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Code Example - Ready for SciMSPT Integration */}
      <section className="code-section">
        <h2>Integration Example</h2>
        <p className="section-description">
          Here's how MAOL integrates into the main SciMSPT application. This code is production-ready.
        </p>

        <div className="code-block">
          <pre>
            <code>{`// Import MAOL into your SciMSPT application
import { IntentRouter } from '@/maol/intent-router/IntentRouter'

// Initialize the router with custom configuration
const router = new IntentRouter({
  minConfidenceForRouting: 0.7,
  useMLClassifier: true,
  enableEntityExtraction: true,
})

// Classify user input and get structured intent
const intent = await router.classify(
  "Create a REST API endpoint for user authentication"
)

// Result: {
//   primaryIntent: IntentCategory.CODE_GENERATION,
//   confidence: 0.85,
//   suggestedAgents: [AgentType.CODE_AGENT],
//   entities: [{ type: EntityType.API_ENDPOINT, ... }],
//   complexity: TaskComplexity.MODERATE
// }

// Route to appropriate agent based on classification
const agent = selectAgent(intent.suggestedAgents)
const result = await agent.execute(intent)`}</code>
          </pre>
        </div>
      </section>

      {/* Related Pillars Navigation */}
      <section className="related-section">
        <h2>Related Architecture Pillars</h2>
        <p className="section-description">
          MAOL works in conjunction with other pillars to form the complete AI-native architecture.
        </p>

        <div className="related-grid">
          {relatedPillars.map((pillar) => (
            <PillarCard
              key={pillar.id}
              id={pillar.id}
              name={pillar.name}
              fullName=""
              icon={pillar.icon}
              description=""
              status="Designed"
              href={pillar.href}
            />
          ))}
        </div>
      </section>

      {/* Navigation Actions */}
      <section className="actions-section">
        <Link href="/" className="btn btn-outline">
          ← Back to Overview
        </Link>
        <a 
          href="https://github.com/testdemoqwenai2025-creator/Demo3SciMSPT/tree/feature/maol-intent-router/src/maol"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          View Source Code →
        </a>
      </section>

      <style jsx>{`
        .maol-page {
          animation: fadeInUp 0.5s ease-out;
        }

        /* Page Hero */
        .page-hero {
          text-align: center;
          padding: var(--space-2xl) 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: var(--space-2xl);
        }

        .hero-badge {
          margin-bottom: var(--space-md);
        }

        .page-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .icon-large {
          font-size: 3rem;
        }

        .page-subtitle {
          font-size: 1.125rem;
          color: #94a3b8;
          max-width: 800px;
          margin: 0 auto var(--space-xl);
          line-height: 1.7;
        }

        /* Stats */
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #60a5fa;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #64748b;
        }

        /* Diagram Section */
        .diagram-section h2,
        .components-section h2,
        .code-section h2,
        .related-section h2 {
          margin-bottom: var(--space-lg);
        }

        .diagram-container {
          background: rgba(30, 41, 59, 0.5);
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .diagram-link {
          display: block;
          text-decoration: none;
        }

        .diagram-placeholder {
          background: linear-gradient(135deg, #1e293b, #334155);
          border-radius: var(--radius-lg);
          padding: 4rem 2rem;
          text-align: center;
          border: 2px dashed rgba(59, 130, 246, 0.3);
          transition: all var(--transition-normal);
        }

        .diagram-placeholder:hover {
          border-color: rgba(59, 130, 246, 0.6);
          background: linear-gradient(135deg, #1e293b, #374151);
        }

        .placeholder-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: var(--space-md);
        }

        .placeholder-text {
          font-size: 1.25rem;
          color: #f1f5f9;
          font-weight: 600;
          display: block;
          margin-bottom: var(--space-sm);
        }

        .placeholder-action {
          font-size: 0.9rem;
          color: #60a5fa;
        }

        /* Components Grid */
        .section-description {
          color: #94a3b8;
          margin-bottom: var(--space-xl);
          font-size: 1.05rem;
        }

        .components-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-lg);
        }

        .component-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-xl);
          padding: var(--space-lg);
          transition: all var(--transition-normal);
        }

        .component-card:hover {
          transform: translateY(-4px);
          border-color: rgba(139, 92, 246, 0.4);
        }

        .component-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: var(--space-md);
        }

        .component-icon {
          font-size: 2rem;
          margin-right: var(--space-md);
        }

        .component-info {
          flex: 1;
        }

        .component-info h3 {
          font-size: 1.125rem;
          margin-bottom: 0.25rem;
        }

        .component-description {
          color: #94a3b8;
          font-size: 0.95rem;
          margin-bottom: var(--space-md);
          line-height: 1.6;
        }

        .feature-list {
          list-style: none;
          padding: 0;
        }

        .feature-list li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .feature-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: 600;
        }

        /* Code Block */
        .code-block {
          background: #0d1117;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .code-block pre {
          padding: var(--space-xl);
          overflow-x: auto;
        }

        .code-block code {
          font-family: 'Fira Code', 'JetBrains Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.7;
          color: #e2e8f0;
        }

        /* Related Section */
        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-lg);
        }

        /* Actions */
        .actions-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-2xl) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          margin-top: var(--space-2xl);
        }

        @media (max-width: 768px) {
          .actions-section {
            flex-direction: column;
            gap: var(--space-md);
          }
          
          .hero-stats {
            gap: var(--space-lg);
          }
          
          .components-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
