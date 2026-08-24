'use client'

import { useState, useEffect } from 'react'
import {
  LineChart, Line, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'

// Color palette for charts - works with both light and dark themes
const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

// Generate simulated time series data
const generateTimeSeriesData = (points = 20) => {
  const data = []
  const now = Date.now()
  let baseValue = 50 + Math.random() * 30
  
  for (let i = points; i >= 0; i--) {
    baseValue += (Math.random() - 0.5) * 15
    baseValue = Math.max(10, Math.min(100, baseValue))
    data.push({
      time: new Date(now - i * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: Math.round(baseValue * 10) / 10,
      value2: Math.round((baseValue + (Math.random() - 0.5) * 20) * 10) / 10,
    })
  }
  return data
}

// Sample data for different chart types
const agentPerformanceData = [
  { name: 'Orchestrator', efficiency: 95, accuracy: 98 },
  { name: 'Researcher', efficiency: 88, accuracy: 94 },
  { name: 'Analyst', efficiency: 92, accuracy: 96 },
  { name: 'Executor', efficiency: 85, accuracy: 91 },
  { name: 'Validator', efficiency: 90, accuracy: 99 },
]

const taskDistributionData = [
  { name: 'Completed', value: 1240, color: '#10b981' },
  { name: 'In Progress', value: 340, color: '#f59e0b' },
  { name: 'Queued', value: 120, color: '#3b82f6' },
  { name: 'Failed', value: 23, color: '#ef4444' },
]

const neuralActivityData = [
  { region: 'Cortex', activation: 92, load: 78 },
  { region: 'Hippocampus', activation: 85, load: 65 },
  { region: 'Thalamus', activation: 78, load: 55 },
  { region: 'Cerebellum', activation: 88, load: 72 },
  { region: 'Brainstem', activation: 95, load: 88 },
]

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  
  return (
    <div className="bg-slate-900/95 border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur-md">
      <p className="text-sm font-medium text-white mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-white/60">{entry.name}:</span>
          <span className="text-white font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export type ChartType = 'line' | 'area' | 'bar' | 'pie'

interface ChartWrapperProps {
  type?: ChartType
  title?: string
  subtitle?: string
  height?: number
  realtime?: boolean
}

export function ChartWrapper({ 
  type = 'line',
  title,
  subtitle,
  height = 300,
  realtime = false 
}: ChartWrapperProps) {
  const [data, setData] = useState(generateTimeSeriesData())
  const [mounted, setMounted] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    setMounted(true)
    
    if (!realtime) return
    
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)]
        const lastValue = prev[prev.length - 1].value
        const newValue = Math.max(10, Math.min(100, lastValue + (Math.random() - 0.5) * 10))
        
        newData.push({
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          value: Math.round(newValue * 10) / 10,
          value2: Math.round((newValue + (Math.random() - 0.5) * 20) * 10) / 10,
        })
        
        return newData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [realtime])

  // Loading state
  if (!mounted) {
    return (
      <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="bg-white/5 rounded" style={{ height }}></div>
      </div>
    )
  }

  const renderChart = () => {
    try {
      switch (type) {
        case 'line':
          return (
            <ResponsiveContainer width="100%" height={height}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} name="Primary" />
                <Line type="monotone" dataKey="value2" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Secondary" />
              </LineChart>
            </ResponsiveContainer>
          )

        case 'area':
          return (
            <ResponsiveContainer width="100%" height={height}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#06b6d4" fill="url(#colorGradient)" strokeWidth={2} name="Activity" />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          )

        case 'bar':
          return (
            <ResponsiveContainer width="100%" height={height}>
              <BarChart data={agentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="efficiency" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Efficiency %" />
                <Bar dataKey="accuracy" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Accuracy %" />
              </BarChart>
            </ResponsiveContainer>
          )

        case 'pie':
          return (
            <ResponsiveContainer width="100%" height={height}>
              <PieChart>
                <Pie
                  data={taskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {taskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )

        default:
          return <div className="flex items-center justify-center text-white/40" style={{ height }}>Unknown chart type</div>
      }
    } catch (error) {
      console.error('Chart rendering error:', error)
      return <div className="flex items-center justify-center text-red-400" style={{ height }}>Error rendering chart</div>
    }
  }

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors duration-300">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {subtitle && <p className="text-sm text-white/50 mt-1">{subtitle}</p>}
        </div>
      )}
      
      {/* Real-time indicator */}
      {realtime && (
        <div className="flex items-center gap-2 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-emerald-400 font-medium">Live</span>
        </div>
      )}
      
      {renderChart()}
    </div>
  )
}

// Dashboard with multiple charts
export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartWrapper type="line" title="System Performance" subtitle="Real-time metrics across all agents" height={280} realtime />
      <ChartWrapper type="area" title="Neural Activity" subtitle="Brain-region activation levels" height={280} />
      <ChartWrapper type="bar" title="Agent Efficiency" subtitle="Performance by agent role" height={280} />
      <div className="lg:col-span-2">
        <ChartWrapper type="pie" title="Task Distribution" subtitle="Current task status overview" height={300} />
      </div>
    </div>
  )
}

export default ChartWrapper
