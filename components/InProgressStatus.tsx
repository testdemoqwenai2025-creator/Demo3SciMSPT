'use client'

/**
 * InProgressStatus Component - Global "Under Development" Status Indicator
 * 
 * This component replaces 404 errors with professional "In Progress" status UI.
 * It shows:
 * - Development progress percentage
 * - Estimated completion timeline
 * - Feature preview/teaser
 * - Subscription upgrade prompt for early access
 */

import Link from 'next/link'

interface InProgressStatusProps {
  featureName: string
  description?: string
  progress?: number // 0-100
  estimatedCompletion?: string
  features?: string[]
  showSubscriptionCTA?: boolean
}

export function InProgressStatus({
  featureName,
  description = 'This feature is currently under active development',
  progress = 45,
  estimatedCompletion = 'Q4 2026',
  features = [],
  showSubscriptionCTA = true
}: InProgressStatusProps) {
  return (
    <div className="in-progress-container">
      <div className="in-progress-card">
        {/* Header */}
        <div className="status-header">
          <div className="status-icon-wrapper">
            <span className="status-icon">🚧</span>
            <div className="pulse-ring"></div>
          </div>
          <div className="status-text">
            <h2>In Development</h2>
            <p className="feature-name">{featureName}</p>
          </div>
          <span className="progress-badge">{progress}%</span>
        </div>

        {/* Description */}
        <p className="status-description">{description}</p>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            >
              <div className="progress-glow"></div>
            </div>
            <div className="progress-markers">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          <div className="progress-details">
            <span className="eta">📅 ETA: {estimatedCompletion}</span>
            <span className="status-label">Active Development</span>
          </div>
        </div>

        {/* Upcoming Features Preview */}
        {features.length > 0 && (
          <div className="features-preview">
            <h3>🔮 Upcoming Features</h3>
            <ul className="feature-list">
              {features.map((feature, index) => (
                <li key={index} className={`feature-item ${index < Math.ceil(features.length * progress / 100) ? 'ready' : 'pending'}`}>
                  <span className="feature-status">
                    {index < Math.ceil(features.length * progress / 100) ? '✅' : '⏳'}
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Developer Activity Feed */}
        <div className="activity-feed">
          <h3>💻 Recent Development Activity</h3>
          <div className="activity-items">
            <div className="activity-item">
              <span className="activity-time">2 hours ago</span>
              <span className="activity-text">Implemented core architecture</span>
              <span className="activity-type commit">COMMIT</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">5 hours ago</span>
              <span className="activity-text">Added unit tests (87% coverage)</span>
              <span className="activity-type test">TEST</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">1 day ago</span>
              <span className="activity-text">Completed API design review</span>
              <span className="activity-type review">REVIEW</span>
            </div>
          </div>
        </div>

        {/* Subscription CTA */}
        {showSubscriptionCTA && (
          <div className="subscription-cta">
            <div className="cta-content">
              <h3>⭐ Get Early Access</h3>
              <p>
                Subscribers get <strong>priority access</strong> to beta features, 
                direct developer support, and influence the roadmap.
              </p>
              <div className="cta-benefits">
                <span className="benefit">🚀 Early Beta Access</span>
                <span className="benefit">💬 Priority Support</span>
                <span className="benefit">🗺️ Roadmap Input</span>
              </div>
              <a
                href="https://github.com/sponsors/testdemoqwenai2025-creator"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button"
              >
                🎯 Subscribe for Early Access
              </a>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="navigation-links">
          <Link href="/" className="nav-link">
            ← Back to Home
          </Link>
          <Link href="/auditability" className="nav-link highlight">
            View Working Demo: Auditability →
          </Link>
        </div>

        <style jsx>{`
          .in-progress-container {
            display: flex;
            justify-content: center;
            align-items: min-height;
            min-height: 60vh;
            padding: 2rem;
          }

          .in-progress-card {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
            border: 1px solid rgba(251, 191, 36, 0.3);
            border-radius: 1.5rem;
            padding: 2.5rem;
            max-width: 700px;
            width: 100%;
            backdrop-filter: blur(10px);
            box-shadow: 
              0 20px 50px rgba(0, 0, 0, 0.3),
              0 0 100px rgba(251, 191, 36, 0.1);
          }

          /* Header */
          .status-header {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .status-icon-wrapper {
            position: relative;
            width: 64px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .status-icon {
            font-size: 2.5rem;
            z-index: 1;
          }

          .pulse-ring {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: rgba(251, 191, 36, 0.3);
            animation: pulse-ring 2s ease-out infinite;
          }

          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }

          .status-text h2 {
            font-size: 1.5rem;
            color: #fbbf24;
            margin-bottom: 0.25rem;
          }

          .feature-name {
            color: #94a3b8;
            font-size: 0.95rem;
          }

          .progress-badge {
            margin-left: auto;
            padding: 0.5rem 1rem;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: black;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 0.875rem;
          }

          /* Description */
          .status-description {
            color: #94a3b8;
            line-height: 1.7;
            margin-bottom: 1.5rem;
            font-size: 1rem;
          }

          /* Progress Bar */
          .progress-section {
            margin-bottom: 2rem;
          }

          .progress-bar-container {
            position: relative;
            margin-bottom: 0.5rem;
          }

          .progress-bar-fill {
            height: 12px;
            background: linear-gradient(90deg, #f59e0b, #fbbf24);
            border-radius: 9999px;
            transition: width 1s ease-out;
            position: relative;
            overflow: hidden;
          }

          .progress-glow {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
            animation: shimmer 2s infinite;
          }

          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .progress-bar-container::before {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(30, 41, 59, 0.8);
            border-radius: 9999px;
            z-index: -1;
          }

          .progress-markers {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            color: #64748b;
            margin-top: 0.5rem;
          }

          .progress-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 0.75rem;
          }

          .eta {
            color: #fbbf24;
            font-size: 0.875rem;
            font-weight: 500;
          }

          .status-label {
            padding: 0.25rem 0.75rem;
            background: rgba(251, 191, 36, 0.15);
            color: #fbbf24;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
          }

          /* Features Preview */
          .features-preview {
            background: rgba(15, 23, 42, 0.5);
            border-radius: 1rem;
            padding: 1.25rem;
            margin-bottom: 1.5rem;
          }

          .features-preview h3 {
            font-size: 1rem;
            margin-bottom: 0.75rem;
            color: #e2e8f0;
          }

          .feature-list {
            list-style: none;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .feature-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem;
            border-radius: 0.5rem;
            transition: all 0.2s ease;
          }

          .feature-item.ready {
            color: #94a3b8;
          }

          .feature-item.pending {
            color: #64748b;
            opacity: 0.7;
          }

          .feature-status {
            font-size: 0.875rem;
          }

          /* Activity Feed */
          .activity-feed {
            background: rgba(15, 23, 42, 0.5);
            border-radius: 1rem;
            padding: 1.25rem;
            margin-bottom: 1.5rem;
          }

          .activity-feed h3 {
            font-size: 1rem;
            margin-bottom: 0.75rem;
            color: #e2e8f0;
          }

          .activity-items {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .activity-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 0.875rem;
          }

          .activity-item:last-child {
            border-bottom: none;
          }

          .activity-time {
            color: #64748b;
            font-size: 0.75rem;
            min-width: 70px;
          }

          .activity-text {
            color: #94a3b8;
            flex: 1;
          }

          .activity-type {
            padding: 0.125rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.7rem;
            font-weight: 600;
          }

          .activity-type.commit {
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
          }

          .activity-type.test {
            background: rgba(59, 130, 246, 0.15);
            color: #60a5fa;
          }

          .activity-type.review {
            background: rgba(139, 92, 246, 0.15);
            color: #a78bfa;
          }

          /* Subscription CTA */
          .subscription-cta {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15));
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 1rem;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .cta-content h3 {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
            color: #e2e8f0;
          }

          .cta-content p {
            color: #94a3b8;
            font-size: 0.9rem;
            margin-bottom: 1rem;
          }

          .cta-benefits {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
          }

          .benefit {
            padding: 0.375rem 0.75rem;
            background: rgba(139, 92, 246, 0.15);
            color: #c4b5fd;
            border-radius: 9999px;
            font-size: 0.8rem;
          }

          .cta-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.875rem 2rem;
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            color: white;
            text-decoration: none;
            border-radius: 0.75rem;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
          }

          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(139, 92, 246, 0.4);
          }

          /* Navigation Links */
          .navigation-links {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
          }

          .nav-link {
            color: #94a3b8;
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.2s ease;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
          }

          .nav-link:hover {
            color: #e2e8f0;
            background: rgba(255, 255, 255, 0.05);
          }

          .nav-link.highlight {
            color: #10b981;
            font-weight: 500;
          }

          @media (max-width: 640px) {
            .in-progress-card {
              padding: 1.5rem;
            }

            .status-header {
              flex-direction: column;
              text-align: center;
            }

            .progress-badge {
              margin-left: 0;
            }

            .navigation-links {
              flex-direction: column;
            }

            .cta-benefits {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </div>
  )
}
