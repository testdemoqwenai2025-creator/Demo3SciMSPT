import Link from 'next/link'

/**
 * PillarCard Component - Reusable card for architecture pillars
 * 
 * This component is designed to:
 * 1. Display pillar information in a consistent format
 * 2. Be reusable across home page and individual pages
 * 3. Support navigation to detailed pillar pages
 * 4. Merge directly into SciMSPT component library
 */

interface PillarCardProps {
  id: string
  name: string
  fullName: string
  icon: string
  description: string
  status: 'Designed' | 'In Progress' | 'Complete'
  href: string
  features?: string[]
}

export function PillarCard({
  name,
  fullName,
  icon,
  description,
  status,
  href,
  features = [],
}: PillarCardProps) {
  const statusColors = {
    'Designed': 'badge-info',
    'In Progress': 'badge-warning',
    'Complete': 'badge-success',
  }

  return (
    <Link href={href} className="pillar-card-link">
      <article className="pillar-card">
        <div className="card-header">
          <div className="pillar-identity">
            <span className="pillar-icon">{icon}</span>
            <div>
              <h3 className="pillar-name">{name}</h3>
              <p className="pillar-full-name">{fullName}</p>
            </div>
          </div>
          <span className={`badge ${statusColors[status]}`}>{status}</span>
        </div>

        <p className="pillar-description">{description}</p>

        {features.length > 0 && (
          <div className="pillar-features">
            {features.map((feature) => (
              <span key={feature} className="feature-tag">
                {feature}
              </span>
            ))}
          </div>
        )}

        <div className="pillar-action">
          <span>Explore →</span>
        </div>
      </article>

      <style jsx>{`
        .pillar-card-link {
          text-decoration: none;
          color: inherit;
        }

        .pillar-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-xl);
          padding: var(--space-lg);
          transition: all var(--transition-normal);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .pillar-card:hover {
          transform: translateY(-4px);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: var(--shadow-lg), var(--shadow-glow);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-md);
        }

        .pillar-identity {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .pillar-icon {
          font-size: 2rem;
          line-height: 1;
        }

        .pillar-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #f1f5f9;
          line-height: 1.2;
        }

        .pillar-full-name {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.125rem;
        }

        .pillar-description {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.6;
          flex: 1;
          margin-bottom: var(--space-md);
        }

        .pillar-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: var(--space-md);
        }

        .feature-tag {
          padding: 0.25rem 0.625rem;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 9999px;
          font-size: 0.75rem;
          color: #60a5fa;
          font-weight: 500;
        }

        .pillar-action {
          padding-top: var(--space-md);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.9rem;
          color: #60a5fa;
          font-weight: 500;
          opacity: 0;
          transform: translateY(-0.5rem);
          transition: all var(--transition-fast);
        }

        .pillar-card:hover .pillar-action {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </Link>
  )
}
