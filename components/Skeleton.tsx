'use client'

/**
 * Skeleton Loading Components - SciMSPT
 * 
 * Provides loading placeholders that match actual content layout
 * Features:
 * - Multiple skeleton types (text, card, chart, table)
 * - Pulse animation
 * - Theme-aware colors
 * - Accessible (aria-busy, role="status")
 */

export function Skeleton({ 
  className = '', 
  width, 
  height,
  rounded = 'md',
  count = 1 
}: {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  count?: number
}) {
  const radiusMap = {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px'
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${className}`}
          style={{
            width: width || (count > 1 ? '100%' : undefined),
            height: height || '20px',
            borderRadius: radiusMap[rounded],
          }}
          role="status"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      ))}
      
      <style jsx>{`
        .skeleton {
          background: linear-gradient(
            90deg,
            var(--color-bg-tertiary) 25%,
            rgba(255, 255, 255, 0.1) 50%,
            var(--color-bg-tertiary) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          display: inline-block;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </>
  )
}

/**
 * Card Skeleton - For card components
 */
export function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <Skeleton height={180} rounded="lg" />
      <div className="card-skeleton-content">
        <Skeleton width="60%" height={24} />
        <Skeleton width="100%" height={14} />
        <Skeleton width="80%" height={14} />
        <div className="card-skeleton-footer">
          <Skeleton width={60} height={28} rounded="full" />
          <Skeleton width={80} height={28} rounded="full" />
        </div>
      </div>

      <style jsx>{`
        .card-skeleton {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .card-skeleton-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .card-skeleton-footer {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  )
}

/**
 * Table Skeleton - For data tables
 */
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="table-skeleton">
      {/* Header */}
      <div className="table-header">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`h-${i}`} height={32} rounded="md" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`r-${rowIndex}`} className="table-row">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton 
              key={`${rowIndex}-${colIndex}`} 
              height={40} 
              rounded="md"
              width={colIndex === 0 ? '70%' : colIndex === cols - 1 ? '50%' : '90%'}
            />
          ))}
        </div>
      ))}

      <style jsx>{`
        .table-skeleton {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          gap: 12px;
          padding: 16px;
          border-bottom: 1px solid var(--color-border);
          grid-template-columns: repeat(var(--cols, 4), 1fr);
          --cols: ${cols};
        }

        .table-row {
          display: grid;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--color-border);
          align-items: center;
          grid-template-columns: repeat(${cols}, 1fr);
        }

        .table-row:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  )
}

/**
 * Chart Skeleton - For charts/graphs
 */
export function ChartSkeleton({ type = 'bar' }: { type?: 'bar' | 'line' | 'pie' }) {
  if (type === 'pie') {
    return (
      <div className="chart-skeleton pie">
        <Skeleton width={200} height={200} rounded="full" />
        <div className="chart-legend">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="legend-item">
              <Skeleton width={12} height={12} rounded="full" />
              <Skeleton width={60} height={14} />
            </div>
          ))}
        </div>

        <style jsx>{`
          .chart-skeleton.pie {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            padding: 30px;
          }

          .chart-legend {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: center;
          }

          .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="chart-skeleton">
      {/* Y-axis labels */}
      <div className="chart-y-axis">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} width={30} height={14} />
        ))}
      </div>
      
      {/* Chart area */}
      <div className="chart-area">
        {type === 'bar' ? (
          <div className="bars-container">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton 
                key={i} 
                width={30} 
                height={Math.random() * 150 + 50} 
                rounded="sm"
              />
            ))}
          </div>
        ) : (
          <div className="line-container">
            <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path
                d="M0,150 Q50,120 100,130 T200,80 T300,100 T400,50"
                fill="none"
                stroke="var(--color-bg-tertiary)"
                strokeWidth="2"
                strokeDasharray="8 4"
              />
            </svg>
          </div>
        )}
        
        {/* X-axis */}
        <div className="x-axis">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} width={40} height={14} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .chart-skeleton {
          display: flex;
          gap: 12px;
          padding: 20px;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 12px;
        }

        .chart-y-axis {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 10px 0;
        }

        .chart-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 10px;
        }

        .bars-container {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 200px;
          gap: 15px;
        }

        .line-container {
          height: 200px;
          position: relative;
        }

        .x-axis {
          display: flex;
          justify-content: space-around;
          padding-top: 10px;
          border-top: 1px solid var(--color-border);
        }
      `}</style>
    </div>
  )
}

/**
 * Page Skeleton - Full page loading state
 */
export function PageSkeleton() {
  return (
    <div className="page-skeleton">
      {/* Header */}
      <div className="page-header">
        <Skeleton width={300} height={36} />
        <Skeleton width={500} height={18} />
      </div>

      {/* Stats row */}
      <div className="stats-row">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="stat-card">
            <Skeleton width={40} height={40} rounded="lg" />
            <div className="stat-content">
              <Skeleton width={60} height={24} />
              <Skeleton width={80} height={14} />
            </div>
          </div>
        ))}
      </div>

      {/* Content area */}
      <div className="content-area">
        <CardSkeleton />
        <ChartSkeleton type="bar" />
      </div>

      <style jsx>{`
        .page-skeleton {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .page-header {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 12px;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .content-area {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        @media (max-width: 768px) {
          .stats-row {
            grid-template-columns: 1fr;
          }

          .content-area {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
