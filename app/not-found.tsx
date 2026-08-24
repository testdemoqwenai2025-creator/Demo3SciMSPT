'use client'

import { InProgressStatus } from '@/components/InProgressStatus'

/**
 * Custom 404 Not Found Page
 * 
 * Instead of showing a generic 404 error, this page displays
 * an "In Progress" status UI that looks professional and informative.
 * It guides users back to working features while showing that
 * the platform is actively under development.
 */

export default function NotFound() {
  return (
    <div className="not-found-page">
      <InProgressStatus
        featureName="Requested Feature"
        description="The page you're looking for doesn't exist yet or is being built right now. Our team is actively developing new features for the SciMSPT AI-Native Architecture."
        progress={35}
        estimatedCompletion="Q1 2026"
        features={[
          "Advanced API documentation",
          "Interactive tutorials",
          "Sandbox environment",
          "Developer SDK",
          "Community forum",
          "Mobile responsive apps"
        ]}
        showSubscriptionCTA={true}
      />

      <style jsx global>{`
        .not-found-page {
          min-height: calc(100vh - 200px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
      `}</style>
    </div>
  )
}
