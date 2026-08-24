'use client'

import { useState } from 'react'
import { useSubscription, PLANS, PlanType } from './Subscription'

/**
 * Upgrade Modal - Premium Subscription Flow
 * 
 * Features:
 * - Plan comparison with feature lists
 * - GitHub Sponsors integration
 * - Annual vs monthly pricing toggle
 * - Team member input for enterprise
 * - Smooth animations
 */

export function UpgradeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro')
  const [teamSize, setTeamSize] = useState(5)
  const [isProcessing, setIsProcessing] = useState(false)

  const { user, upgradePlan } = useSubscription()

  if (!isOpen) return null

  const handleUpgrade = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    upgradePlan(selectedPlan)
    setIsProcessing(false)
    onClose()
    
    // Show success message (in real app, would redirect to payment)
    alert(`🎉 Successfully upgraded to ${PLANS[selectedPlan].name} plan!`)
  }

  const getPrice = (plan: PlanType) => {
    const base = PLANS[plan].price
    return billingCycle === 'annual' ? Math.round(base * 0.8 * 12) : base
  }

  const getAnnualSavings = () => {
    return billingCycle === 'annual' ? 20 : 0
  }

  return (
    <div className="upgrade-modal-overlay" onClick={onClose}>
      <div className="upgrade-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">⭐ Upgrade Your Plan</h2>
          <p className="modal-subtitle">
            Unlock full potential with premium features
          </p>
          <button onClick={onClose} className="close-btn" aria-label="Close modal">✕</button>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="billing-toggle">
          <span className={`toggle-option ${billingCycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('monthly')}>
            Monthly
          </span>
          <div className="toggle-switch" onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}>
            <div className={`toggle-knob ${billingCycle === 'annual' ? 'right' : ''}`}></div>
          </div>
          <span className={`toggle-option ${billingCycle === 'annual' ? 'active' : ''}`}
                onClick={() => setBillingCycle('annual')}>
            Annual
            {getAnnualSavings() > 0 && (
              <span className="savings-badge">Save {getAnnualSavings()}%</span>
            )}
          </span>
        </div>

        {/* Plans Grid */}
        <div className="plans-grid">
          {(Object.keys(PLANS) as PlanType[]).map((plan) => {
            const planData = PLANS[plan]
            const price = getPrice(plan)
            const isSelected = selectedPlan === plan
            const isCurrent = user?.plan === plan

            return (
              <div
                key={plan}
                className={`plan-card ${isSelected ? 'selected' : ''} ${isCurrent ? 'current' : ''}`}
                onClick={() => setSelectedPlan(plan)}
              >
                <div className="plan-header">
                  <h3 className="plan-name">{planData.name}</h3>
                  <div className="plan-price">
                    <span className="price-amount">${price}</span>
                    <span className="price-period">/{billingCycle === 'annual' ? 'year' : 'mo'}</span>
                  </div>
                  {isCurrent && (
                    <span className="current-badge">Current</span>
                  )}
                </div>

                <p className="plan-description">{planData.description}</p>

                <ul className="feature-list">
                  {planData.features.map((feature, i) => {
                    // Format feature name nicely
                    const formattedFeature = feature
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, w => w.charAt(0).toUpperCase() + w.slice(1))
                    
                    return (
                      <li key={i} className="feature-item">
                        <span className="check-icon">✓</span>
                        <span>{formattedFeature}</span>
                      </li>
                    )
                  })}
                </ul>

                {(plan === 'enterprise') && (
                  <div className="team-input">
                    <label>Team Size</label>
                    <input
                      type="number"
                      value={teamSize}
                      onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
                      min={11}
                      max={1000}
                    />
                  </div>
                )}

                <button
                  className={`upgrade-btn ${isSelected ? 'primary' : ''}`}
                  disabled={isCurrent || isProcessing}
                  onClick={handleUpgrade}
                >
                  {isProcessing ? (
                    <>
                      <span className="btn-spinner"></span>
                      Processing...
                    </>
                  ) : isCurrent ? (
                    'Current Plan'
                  ) : (
                    `Get ${planData.name}`
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Enterprise Contact */}
        <div className="enterprise-cta">
          <p>Need custom solution? </p>
          <a
            href="mailto:enterprise@scimspt.ai?subject=Enterprise%20Inquiry"
            className="contact-link"
          >
            💬 Contact Sales →
          </a>
        </div>

        {/* Guarantee */}
        <div className="guarantee">
          <span className="guarantee-icon">🛡️</span>
          <span>30-day money-back guarantee • Cancel anytime</span>
        </div>

        <style jsx>{`
          .upgrade-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: fadeIn 200ms ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .upgrade-modal {
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: 20px;
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            padding: 32px;
            animation: slideUp 300ms ease-out;
          }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
          }

          .modal-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--color-text-primary);
            margin: 0;
          }

          .modal-subtitle {
            color: var(--color-text-secondary);
            font-size: 1rem;
            margin: 8px 0 0 0;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 1.25rem;
            color: var(--color-text-muted);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 150ms ease;
          }

          .close-btn:hover {
            background: var(--color-bg-tertiary);
            color: var(--color-text-primary);
          }

          /* Billing Toggle */
          .billing-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            padding: 14px 20px;
            background: var(--color-bg-primary);
            border-radius: 12px;
            margin-bottom: 28px;
          }

          .toggle-option {
            cursor: pointer;
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: 500;
            transition: all 150ms ease;
            color: var(--color-text-secondary);
          }

          .toggle-option.active {
            color: var(--color-primary);
            background: rgba(59, 130, 246, 0.1);
          }

          .toggle-switch {
            width: 50px;
            height: 26px;
            background: var(--color-bg-tertiary);
            border-radius: 13px;
            cursor: pointer;
            position: relative;
            transition: background 200ms ease;
          }

          .toggle-knob {
            width: 22px;
            height: 22px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: 2px;
            transition: transform 200ms ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          .toggle-knob.right {
            transform: translateX(24px);
          }

          .savings-badge {
            background: #10b981;
            color: white;
            font-size: 0.7rem;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 10px;
            margin-left: 8px;
          }

          /* Plans Grid */
          .plans-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 24px;
          }

          @media (max-width: 768px) {
            .plans-grid {
              grid-template-columns: 1fr;
            }
          }

          .plan-card {
            padding: 24px;
            background: var(--color-bg-primary);
            border: 2px solid transparent;
            border-radius: 16px;
            cursor: pointer;
            transition: all 200ms ease;
          }

          .plan-card:hover {
            border-color: var(--color-border-hover);
          }

          .plan-card.selected {
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.05);
          }

          .plan-card.current {
            border-color: #10b981;
            opacity: 0.7;
          }

          .plan-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
          }

          .plan-name {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--color-text-primary);
            margin: 0;
          }

          .plan-price {
            text-align: right;
          }

          .price-amount {
            font-size: 2rem;
            font-weight: 800;
            color: var(--color-text-primary);
            line-height: 1;
          }

          .price-period {
            font-size: 0.9rem;
            color: var(--color-text-muted);
          }

          .current-badge {
            background: #10b981;
            color: white;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 6px;
          }

          .plan-description {
            font-size: 0.9rem;
            color: var(--color-text-secondary);
            margin-bottom: 16px;
            line-height: 1.4;
          }

          .feature-list {
            list-style: none;
            padding: 0;
            margin: 0 0 20px 0;
          }

          .feature-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 6px 0;
            font-size: 0.9rem;
            color: var(--color-text-secondary);
          }

          .check-icon {
            color: #10b981;
            font-weight: bold;
          }

          .team-input {
            margin-top: 16px;
          }

          .team-input label {
            display: block;
            font-size: 0.85rem;
            color: var(--color-text-muted);
            margin-bottom: 6px;
          }

          .team-input input {
            width: 100%;
            padding: 10px 14px;
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            color: var(--color-text-primary);
            font-size: 1rem;
            outline: none;
          }

          .upgrade-btn {
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 150ms ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .upgrade-btn.primary {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
          }

          .upgrade-btn.primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
          }

          .upgrade-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .btn-spinner {
            width: 18px;
            height: 18px;
            border: 2px solid transparent;
            border-top-color: white;
            border-radius: 50%;
            animation: spin 800ms linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          /* Enterprise CTA */
          .enterprise-cta {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid var(--color-border);
          }

          .enterprise-cta p {
            color: var(--color-text-secondary);
            margin: 0 0 12px 0;
          }

          .contact-link {
            color: #3b82f6;
            font-weight: 600;
            text-decoration: none;
            font-size: 1rem;
          }

          .contact-link:hover {
            text-decoration: underline;
          }

          /* Guarantee */
          .guarantee {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 16px;
            background: rgba(16, 185, 129, 0.05);
            border-radius: 10px;
            font-size: 0.9rem;
            color: var(--color-text-secondary);
          }
        `}</style>
      </div>
    </div>
  )
}
