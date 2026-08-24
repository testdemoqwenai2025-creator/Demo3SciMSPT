'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

/**
 * Premium/Subscription System - SciMSPT
 * 
 * Features:
 * - Simulated user authentication state
 * - Free vs PRO tier feature gating
 * - Usage tracking with limits
 * - Upgrade flow with GitHub Sponsors integration
 * - Persistent subscription state
 */

// ============ TYPES ============

export type PlanType = 'free' | 'pro' | 'enterprise'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  plan: PlanType
  joinedAt: Date
  usageStats: UsageStats
  preferences: UserPreferences
}

export interface UsageStats {
  apiCalls: { used: number; limit: number; resetAt: Date }
  exports: { used: number; limit: number; resetAt: Date }
  storage: { used: number; limit: number; unit: 'MB' }
  teamMembers: { used: number; limit: number }
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system'
  notifications: boolean
  analytics: boolean
  betaFeatures: boolean
}

interface SubscriptionContextValue {
  user: UserProfile | null
  isAuthenticated: boolean
  isPro: boolean
  isEnterprise: boolean
  plan: PlanType
  usage: UsageStats
  login: (email: string) => void
  logout: () => void
  upgradePlan: (plan: PlanType) => void
  canUseFeature: (feature: string) => boolean
  recordUsage: (type: keyof UsageStats) => boolean
  getRemainingUsage: (type: keyof UsageStats) => number
}

// ============ PLAN CONFIGURATIONS ============

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    period: 'forever',
    features: [
      'basic_dashboard',
      '3_api_calls_per_day',
      '5_exports_per_day',
      '1_compliance_report',
      'community_support',
      'single_user'
    ],
    limits: {
        apiCalls: 100,
        exports: 5,
        storage: 100,
        teamMembers: 1
    },
    description: 'Perfect for exploring SciMSPT capabilities'
  },
  pro: {
    name: 'PRO',
    price: 19,
    period: 'month',
    features: [
      'full_dashboard',
      'unlimited_api_calls',
      'unlimited_exports',
      'unlimited_reports',
      'priority_support',
      'api_access',
      'custom_branding',
      '10_team_members',
      'advanced_analytics'
    ],
    limits: {
      apiCalls: Infinity,
      exports: Infinity,
      storage: 10000,
      teamMembers: 10
    },
    description: 'For professionals and small teams building production apps'
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    period: 'month',
    features: [
      'everything_in_pro',
      'unlimited_team_members',
      'dedicated_support',
      'custom_integrations',
      'sla_guarantee',
      'onpremise_option',
      'audit_logs_retention',
      'compliance_certification'
    ],
    limits: {
      apiCalls: Infinity,
      exports: Infinity,
      storage: 100000,
      teamMembers: Infinity
    },
    description: 'For organizations requiring enterprise-grade features'
  }
} as const

// ============ CONTEXT ============

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null)

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

// ============ PROVIDER ============

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('scimspt-user')
      if (savedUser) {
        const parsed = JSON.parse(savedUser)
        // Convert date strings back to Date objects
        parsed.joinedAt = new Date(parsed.joinedAt)
        parsed.usageStats.apiCalls.resetAt = new Date(parsed.usageStats.apiCalls.resetAt)
        parsed.usageStats.exports.resetAt = new Date(parsed.usageStats.exports.resetAt)
        setUser(parsed)
      }
    } catch (e) {
      console.error('Failed to load user:', e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('scimspt-user', JSON.stringify(user))
    }
  }, [user])

  // Login function (simulated)
  const login = useCallback((email: string) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=3b82f6&color=fff`,
      plan: 'free',
      joinedAt: new Date(),
      usageStats: {
        apiCalls: { used: 0, limit: PLANS.free.limits.apiCalls, resetAt: getNextReset() },
        exports: { used: 0, limit: PLANS.free.limits.exports, resetAt: getNextReset() },
        storage: { used: 12, limit: PLANS.free.limits.storage, unit: 'MB' },
        teamMembers: { used: 1, limit: PLANS.free.limits.teamMembers }
      },
      preferences: {
        theme: (localStorage.getItem('scimspt-theme') as any) || 'dark',
        notifications: true,
        analytics: true,
        betaFeatures: false
      }
    }
    setUser(newUser)
  }, [])

  // Logout function
  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('scimspt-user')
  }, [])

  // Upgrade plan
  const upgradePlan = useCallback((plan: PlanType) => {
    if (!user) return
    
    // Update user plan (in real app, this would also update limits via API)
    setUser({
      ...user,
      plan
    })
    
    // In real app, this would redirect to payment flow
    console.log(`Upgrading to ${PLANS[plan].name} plan`)
  }, [user])

  // Check if user can use a feature
  const canUseFeature = useCallback((feature: string): boolean => {
    if (!user) return false
    if (user.plan === 'enterprise') return true
    if (user.plan === 'pro') return !['single_user'].includes(feature as any)
    
    // Free tier features
    const freeFeatures = PLANS.free.features
    return freeFeatures.includes(feature as any)
  }, [user])

  // Record usage and check if limit reached
  const recordUsage = useCallback((type: keyof UsageStats): boolean => {
    if (!user) return false
    if (user.plan !== 'free') return true
    
    const stat = user.usageStats[type]
    stat.used += 1
    
    // Check if over limit
    if (stat.used >= stat.limit) {
      setUser({ ...user }) // Trigger re-render to show limit warning
      return false
    }
    
    setUser({ ...user })
    return true
  }, [user])

  // Get remaining usage
  const getRemainingUsage = useCallback((type: keyof UsageStats): number => {
    if (!user) return 0
    if (user.plan !== 'free') return Infinity
    return Math.max(0, user.usageStats[type].limit - user.usageStats[type].used)
  }, [user])

  const value: SubscriptionContextValue = {
    user,
    isAuthenticated: !!user,
    isPro: user?.plan === 'pro' || user?.plan === 'enterprise',
    isEnterprise: user?.plan === 'enterprise',
    plan: user?.plan || 'free',
    usage: user?.usageStats || {
      apiCalls: { used: 0, limit: 100, resetAt: new Date() },
      exports: { used: 0, limit: 5, resetAt: new Date() },
      storage: { used: 0, limit: 100, unit: 'MB' },
      teamMembers: { used: 0, limit: 1 }
    },
    login,
    logout,
    upgradePlan,
    canUseFeature,
    recordUsage,
    getRemainingUsage
  }

  if (isLoading) {
    return (
      <div className="subscription-loading">
        <div className="loading-spinner"></div>
        <style jsx>{`
          .subscription-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 200px;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--color-primary);
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 800ms linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

// ============ HELPER FUNCTIONS ============

function getNextReset(): Date {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow
}

// ============ FEATURE GATE COMPONENTS ============

interface FeatureGateProps {
  feature: string
  children: ReactNode
  fallback?: ReactNode
}

/**
 * FeatureGate - Wraps content that requires specific plan level
 */
export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { canUseFeature } = useSubscription()
  
  if (canUseFeature(feature)) {
    return <>{children}</>
  }
  
  return <>{fallback || null}</>
}

/**
 * ProOnly - Wrapper for PRO/Enterprise only features
 */
export function ProOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <FeatureGate feature="api_access" fallback={fallback}>
      {children}
    </FeatureGate>
  )
}

/**
 * UsageLimitWarning - Shows when approaching limits
 */
export function UsageLimitWarning({ type }: { type: keyof UsageStats }) {
  const { usage, plan, getRemainingUsage } = useSubscription()
  
  if (plan === 'pro' || plan === 'enterprise') return null
  
  const remaining = getRemainingUsage(type)
  const percentage = (usage[type].used / usage[type].limit * 100)
  
  if (percentage < 80) return null
  
  return (
    <div className={`usage-warning ${percentage >= 95 ? 'critical' : percentage >= 80 ? 'warning' : ''}`}>
      <span className="warning-icon">⚠️</span>
      <span className="warning-text">
        {percentage >= 95 
          ? `Daily ${type} limit almost reached!` 
          : `${remaining} ${type} calls remaining today`
        }
      </span>
      
      {percentage >= 90 && (
        <button 
          className="upgrade-inline"
          onClick={() => window.dispatchEvent(new CustomEvent('show-upgrade-modal'))}
        >
          Upgrade →
        </button>
      )}
      
      <style jsx>{`
        .usage-warning {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 10px;
          margin-top: 12px;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }

        .usage-warning.warning {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.2);
        }

        .usage-warning.critical {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.3);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .upgrade-inline {
          margin-left: auto;
          padding: 6px 14px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 150ms ease;
        }

        .upgrade-inline:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  )
}
