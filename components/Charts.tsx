'use client'

import { useState, useEffect } from 'react'
import {
  LineChart, Line, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'

/**
 * Interactive Charts Component - SciMSPT
 * 
 * Features:
 * - Multiple chart types (Line, Bar, Area, Pie, Radar)
 * - Real-time data simulation
 * - Theme-aware styling
 * - Interactive tooltips
 * - Animated transitions
 */

// Color palettes
const COLORS = {
  primary: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
}

// Safe theme colors function (works in SSR)
const getThemeColors = () => {
  if (typeof document === 'undefined') {
    // Default dark theme colors for SSR
    return {
      text: '#94a3b8',
      grid: 'rgba(255,255,255,0.05)',
      tooltip: { 
        background: '#1e293b',
        border: 'rgba(255,255,255,0.1)',
        text: '#f1f5f9'
      }
    }
  }
  
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
  return {
    text: isDark ? '#94a3b8' : '#64748b',
    grid: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    tooltip: { 
      background: isDark ? '#1e293b' : '#ffffff',
      border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      text: isDark ? '#f1f5f9' : '#0f172a'
    }
  }
}

// Sample datasets for demonstration
export const performanceData = [
  { name: 'Mon', agents: 12, tasks: 45, efficiency: 89 },
  { name: 'Tue', agents: 15, tasks: 52, efficiency: 92 },
  { name: 'Wed', agents: 18, tasks: 48,效率: 87 },
  { name: 'Thu', agents: 22, tasks: 61, efficiency: 95 },
  { name: 'Fri', agents: 20, tasks: 55, efficiency: 91 },
  { name: 'Sat', agents: 14, tasks: 38, efficiency: 88 },
  { name: 'Sun', agents: 10, tasks: 32, efficiency: 85 },
]

export const systemHealthData = [
  { name: 'CPU', value: 65, max: 100 },
  { name: 'Memory', value: 78, max: 100 },
  { name: 'Network', value: 45, max: 100 },
  { name: 'Storage', value: 82, max: 100 },
]

export const agentDistribution = [
  { name: 'MAOL Core', value: 35, color: '#3b82f6' },
  { name: 'Neural Trackers', value: 25, color: '#8b5cf6' },
  { name: 'Spatial Renderers', value: 20, color: '#10b981' },
  { name: 'Plugin Handlers', value: 12, color: '#f59e0b' },
  { name: 'Audit Loggers', value: 8, color: '#ef4444' },
]

export const capabilityRadarData = [
  { subject: 'Orchestration', A: 95, B: 80, fullMark: 100 },
  { subject: 'Tracking', A: 88, B: 75, fullMark: 100 },
  { subject: 'Rendering', A: 82, B: 70, fullMark: 100 },
  { subject: 'Extensibility', A: 90, B: 85, fullMark: 100 },
  { subject: 'Intelligence', A: 75, B: 60, fullMark: 100 },
  { subject: 'Security', A: 92, B: 88, fullMark: 100 },
]

// Real-time data simulation
function useRealTimeData(initialData: any[], interval = 2000) {
  const [data, setData] = useState(initialData)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    if (!isLive) return

    const timer = setInterval(() => {
      setData(prev => prev.map((item: any) => ({
        ...item,
        ...(item.agents !== undefined && { 
          agents: Math.max(5, item.agents + Math.floor(Math.random() * 7 - 3)),
          tasks: Math.max(10, item.tasks + Math.floor(Math.random() * 15 - 7)),
          efficiency: Math.min(99, Math.max(60, item.efficiency + (Math.random() * 6 - 3)))
        }),
        ...(item.value !== undefined && {
          value: Math.max(10, Math.min(98, item.value + (Math.random() * 10 - 5)))
        })
      })))
    }, interval)

    return () => clearInterval(timer)
  }, [isLive, interval])

  return { data, isLive, setIsLive }
}

/**
 * Performance Chart - Line/Area combo
 */
export function PerformanceChart() {
  const { data, isLive, setIsLive } = useRealTimeData(performanceData)
  const theme = getThemeColors()

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h4 className="chart-title">📈 System Performance</h4>
        <button
          className={`live-toggle ${isLive ? 'active' : ''}`}
          onClick={() => setIsLive(!isLive)}
        >
          {isLive ? '⏸ Pause' : '▶ Live'}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAgents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis dataKey="name" stroke={theme.text} fontSize={12} />
          <YAxis stroke={theme.text} fontSize={12} />
          <Tooltip
            contentStyle={{
              background: theme.tooltip.background,
              border: `1px solid ${theme.tooltip.border}`,
              borderRadius: '8px',
              color: theme.tooltip.text
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="agents"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorAgents)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="tasks"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorTasks)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="efficiency"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: '#f59e0b', r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <style jsx>{`
        .chart-container {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 20px;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .chart-title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          color: var(--color-text-primary);
        }

        .live-toggle {
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-text-secondary);
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 150ms ease;
        }

        .live-toggle:hover {
          border-color: var(--color-primary);
        }

        .live-toggle.active {
          background: rgba(16, 185, 129, 0.1);
          border-color: #10b981;
          color: #10b981;
        }
      `}</style>
    </div>
  )
}

/**
 * System Health Gauge - Bar Chart
 */
export function SystemHealthChart() {
  const { data, isLive, setIsLive } = useRealTimeData(systemHealthData, 3000)
  const theme = getThemeColors()

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h4 className="chart-title">🖥️ System Health</h4>
        <button
          className={`live-toggle ${isLive ? 'active' : ''}`}
          onClick={() => setIsLive(!isLive)}
        >
          {isLive ? '⏸ Pause' : '▶ Live'}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} horizontal={false} />
          <XAxis type="number" domain={[0, 100]} stroke={theme.text} fontSize={12} unit="%" />
          <YAxis dataKey="name" type="category" stroke={theme.text} fontSize={12} width={60} />
          <Tooltip
            contentStyle={{
              background: theme.tooltip.background,
              border: `1px solid ${theme.tooltip.border}`,
              borderRadius: '8px',
              color: theme.tooltip.text
            }}
            formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Usage']}
          />
          <Bar
            dataKey="value"
            radius={[0, 4, 4, 0]}
            fill="#3b82f6"
            animationDuration={500}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.value > 80 ? '#ef4444' :
                  entry.value > 60 ? '#f59e0b' :
                  '#10b981'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <style jsx>{`
        .chart-container {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 20px;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .chart-title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          color: var(--color-text-primary);
        }

        .live-toggle {
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-text-secondary);
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 150ms ease;
        }

        .live-toggle.active {
          background: rgba(16, 185, 129, 0.1);
          border-color: #10b981;
          color: #10b981;
        }
      `}</style>
    </div>
  )
}

/**
 * Agent Distribution - Donut/Pie Chart
 */
export function AgentDistributionChart() {
  const [activeIndex, setActiveIndex] = useState(0)
  const theme = getThemeColors()

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  return (
    <div className="chart-container">
      <h4 className="chart-title">🤖 Agent Distribution</h4>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={agentDistribution}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            onMouseEnter={onPieEnter}
            animationBegin={0}
            animationDuration={800}
          >
            {agentDistribution.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={activeIndex === index ? 1 : 0.7}
                stroke={activeIndex === index ? entry.color : 'none'}
                strokeWidth={activeIndex === index ? 2 : 0}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: theme.tooltip.background,
              border: `1px solid ${theme.tooltip.border}`,
              borderRadius: '8px',
              color: theme.tooltip.text
            }}
            formatter={(value, name) => [`${value}%`, name]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {agentDistribution[activeIndex] && (
        <div className="pie-detail">
          <span className="detail-color" style={{ background: agentDistribution[activeIndex].color }}></span>
          <span className="detail-name">{agentDistribution[activeIndex].name}</span>
          <span className="detail-value">{agentDistribution[activeIndex].value}%</span>
        </div>
      )}

      <style jsx>{`
        .chart-container {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 20px;
        }

        .chart-title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: var(--color-text-primary);
        }

        .pie-detail {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--color-border);
        }

        .detail-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }

        .detail-name {
          flex: 1;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        .detail-value {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--color-text-primary);
        }
      `}</style>
    </div>
  )
}

/**
 * Capability Radar - Spider/Radar Chart
 */
export function CapabilityRadarChart() {
  const theme = getThemeColors()

  return (
    <div className="chart-container">
      <h4 className="chart-title">🎯 Capability Matrix</h4>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={capabilityRadarData}>
          <PolarGrid stroke={theme.grid} />
          <PolarAngleAxis dataKey="subject" stroke={theme.text} fontSize={12} />
          <PolarRadiusAxis stroke={theme.text} fontSize={10} />
          <Radar
            name="SciMSPT v3.0"
            dataKey="A"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Industry Avg"
            dataKey="B"
            stroke="#94a3b8"
            fill="#94a3b8"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Legend />
          <Tooltip
            contentStyle={{
              background: theme.tooltip.background,
              border: `1px solid ${theme.tooltip.border}`,
              borderRadius: '8px',
              color: theme.tooltip.text
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      <style jsx>{`
        .chart-container {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 20px;
        }

        .chart-title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: var(--color-text-primary);
        }
      `}</style>
    </div>
  )
}

/**
 * Dashboard Grid - All charts combined
 */
export function DashboardCharts() {
  return (
    <div className="dashboard-grid">
      <div className="dashboard-row">
        <PerformanceChart />
        <SystemHealthChart />
      </div>
      <div className="dashboard-row">
        <AgentDistributionChart />
        <CapabilityRadarChart />
      </div>

      <style jsx>{`
        .dashboard-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
        }

        .dashboard-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        @media (max-width: 900px) {
          .dashboard-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
