'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

/**
 * Navigation Component - SciMSPT Phase 3
 * 
 * This component is designed to merge directly into the main SciMSPT application.
 * It uses Next.js 16 App Router with client-side navigation.
 */

const navigationItems = [
  { 
    name: 'Home', 
    href: '/', 
    icon: '🏠',
    description: 'Architecture Overview' 
  },
  { 
    name: 'MAOL', 
    href: '/maol', 
    icon: '🧠',
    description: 'Multi-Agent Orchestrator Layer' 
  },
  { 
    name: 'Neural Tracking', 
    href: '/neural-tracking', 
    icon: '🔮',
    description: 'Behavior Intelligence System' 
  },
  { 
    name: 'Spatial UI', 
    href: '/spatial-ui', 
    icon: '🎨',
    description: '3D Interface Components' 
  },
  { 
    name: 'Plugin System', 
    href: '/plugin-system', 
    icon: '🔌',
    description: 'Secure Extensible Ecosystem' 
  },
  { 
    name: 'Intelligence Graph', 
    href: '/intelligence-graph', 
    icon: '🕸️',
    description: 'Semantic Knowledge Network' 
  },
  { 
    name: 'Emergent Behavior', 
    href: '/emergent-behavior', 
    icon: '🔄',
    description: 'Self-Optimization Engine' 
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="navigation" role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        {/* Logo/Brand - Ready for SciMSPT branding */}
        <Link href="/" className="nav-brand">
          <span className="brand-icon">🚀</span>
          <span className="brand-text">
            <strong>SciMSPT</strong>
            <small>Phase 3</small>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links-desktop">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                title={item.description}
              >
                <span className="nav-link-icon">{item.icon}</span>
                <span className="nav-link-text">{item.name}</span>
              </Link>
            )
          })}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="nav-mobile-menu">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-mobile-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .navigation {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Brand/Logo */
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: inherit;
        }

        .brand-icon {
          font-size: 1.75rem;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .brand-text strong {
          font-size: 1.25rem;
          color: #f1f5f9;
        }

        .brand-text small {
          font-size: 0.7rem;
          color: #3b82f6;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        /* Desktop Links */
        .nav-links-desktop {
          display: flex;
          gap: 0.25rem;
        }

        @media (max-width: 1024px) {
          .nav-links-desktop {
            display: none;
          }
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.875rem;
          border-radius: 0.5rem;
          text-decoration: none;
          color: #94a3b8;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 150ms ease;
        }

        .nav-link:hover {
          color: #f1f5f9;
          background: rgba(59, 130, 246, 0.1);
        }

        .nav-link.active {
          color: #60a5fa;
          background: rgba(59, 130, 246, 0.15);
        }

        .nav-link-icon {
          font-size: 1rem;
        }

        .nav-link-text {
          white-space: nowrap;
        }

        /* Mobile Toggle */
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        @media (max-width: 1024px) {
          .mobile-menu-toggle {
            display: block;
          }
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 20px;
        }

        .hamburger span {
          width: 100%;
          height: 2px;
          background: #94a3b8;
          transition: all 300ms ease;
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translate(4px, 4px);
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(4px, -4px);
        }

        /* Mobile Menu */
        .nav-mobile-menu {
          position: absolute;
          top: 64px;
          left: 0;
          right: 0;
          background: rgba(15, 23, 42, 0.98);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          animation: slideDown 200ms ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav-mobile-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 0.5rem;
          text-decoration: none;
          color: #94a3b8;
          transition: all 150ms ease;
        }

        .nav-mobile-link:hover,
        .nav-mobile-link.active {
          background: rgba(59, 130, 246, 0.1);
          color: #f1f5f9;
        }

        .nav-mobile-link span:first-child {
          font-size: 1.5rem;
        }

        .nav-mobile-link div {
          display: flex;
          flex-direction: column;
        }

        .nav-mobile-link strong {
          color: inherit;
          font-weight: 600;
        }

        .nav-mobile-link small {
          font-size: 0.8rem;
          opacity: 0.7;
        }
      `}</style>
    </nav>
  )
}
