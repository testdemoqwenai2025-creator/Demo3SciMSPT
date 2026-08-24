'use client'

import Link from 'next/link'


export default function IntelligenceGraphPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <span className="badge badge-primary">Semantic</span>
        <h1><span className="icon">🕸️</span> Intelligence Graph</h1>
        <p>Semantic Knowledge Network with vector embeddings and entity relationship mapping</p>
      </section>

      <section className="content">
        <h2>Architecture Overview</h2>
        <a href="/phase3/diagrams/05-intelligence-graph.png" target="_blank" className="diagram-link">
          <div className="diagram-preview">🕸️ View Intelligence Graph Diagram (145 KB)</div>
        </a>

        <h2>Key Features</h2>
        <ul className="feature-list">
          <li>✓ High-dimensional vector embeddings storage</li>
          <li>✓ Knowledge entity and concept linking</li>
          <li>✓ Natural language to graph traversal queries</li>
          <li>✓ Continuous knowledge base evolution</li>
          <li>✓ Access control at node/edge level</li>
        </ul>

        <h2>Status: Designed</h2>
        <p>Scheduled for Phase 3B integration with MAOL memory systems.</p>
      </section>

      <section className="actions">
        <Link href="/" className="btn btn-outline">← Back to Overview</Link>
        <Link href="/maol" className="btn btn-outline">View MAOL →</Link>
      </section>

      <style jsx>{`
        .page { animation: fadeInUp 0.5s ease-out; }
        .page-hero { text-align: center; padding: 3rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 2rem; }
        .page-hero h1 { font-size: 2.5rem; display: flex; align-items: center; justify-content: center; gap: 1rem; margin: 1rem 0; }
        .icon { font-size: 3rem; }
        .page-hero p { color: #94a3b8; max-width: 700px; margin: 0 auto; }
        .content { max-width: 900px; }
        .content h2 { margin: 2rem 0 1rem; }
        .diagram-link { display: block; text-decoration: none; color: inherit; }
        .diagram-preview { background: rgba(30,41,59,0.5); border: 2px dashed rgba(139,92,246,0.3); border-radius: 1rem; padding: 3rem; text-align: center; margin: 1.5rem 0; transition: all 0.3s ease; }
        .diagram-preview:hover { border-color: rgba(139,92,246,0.6); }
        .feature-list { list-style: none; padding: 0; }
        .feature-list li { padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #94a3b8; }
        .actions { display: flex; justify-content: space-between; padding: 2rem 0; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 3rem; }
      `}</style>
    </div>
  )
}
