'use client'

import { useState, useEffect } from 'react'
import {
  LineChart, Line, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'

// Color palette for charts - works with both light and dark themes
const COLORS = {
  primary: '#06b6d4',    // cyan-500
  secondary: '#8b5cf6',  // violet-500
  tertiary: '#10b981',   // emerald-500
  quaternary: '#f59e0b', // amber-500
  quinary: '#ef4444',    // red-500
  senary: '#ec4899',     // pink-500
}

const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.quaternary, COLORS.quinary, COLORS.senary]

// Generate simulated real-time data
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
      value3: Math.round((baseValue * 0.7 + Math.random() * 20) * 10) / 10,
    })
  }
  return data
}

// Sample data for different chart types
const agentPerformanceData = [
  { name: 'Orchestrator', efficiency: 95, tasks: 240, accuracy: 98 },
  { name: 'Researcher', efficiency: 88, tasks: 180, accuracy: 94 },
  { name: 'Analyst', efficiency: 92, tasks: 210, accuracy: 96 },
  { name: 'Executor', efficiency: 85, tasks: 300, accuracy: 91 },
  { name: 'Validator', efficiency: 90, tasks: 150, accuracy: 99 },
]

const systemMetricsData = [
  { name: 'CPU Usage', value: 65 },
  { name: 'Memory', value: 78 },
  { name: 'Network I/O', value: 45 },
  { name: 'Disk I/O', value: 32 },
  { name: 'GPU Load', value: 88 },
]

const taskDistributionData = [
  { name: 'Completed', value: 1240, color: '#10b981' },
  { name: 'In Progress', value: 340, color: '#f59e0b' },
  { name: 'Queued', value: 120, color: '#3b82f6' },
  { name: 'Failed', value: 23, color: '#ef4444' },
]

const neuralActivityData = [
  { region: 'Cortex', activation: 92, connections: 450, load: 78 },
  { region: 'Hippocampus', activation: 85, connections: 320, load: 65 },
  { region: 'Thalamus', activation: 78, connections: 280, load: 55 },
  { region: 'Cerebellum', activation: 88, connections: 380, load: 72 },
  { region: 'Brainstem', activation: 95, connections: 520, load: 88 },
]

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur-md">
        <p className="text-sm font-medium text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white/60">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Chart type variants
export type ChartType = 'line' | 'area' | 'bar' | 'pie' | 'radar'

interface ChartWrapperProps {
  type?: ChartType
  title?: string
  subtitle?: string
  height?: number
  showGrid?: boolean
  animate?: boolean
  realtime?: boolean
  className?: string
}

export function ChartWrapper({ 
  type = 'line',
  title,
  subtitle,
  height = 300,
  showGrid = true,
  animate = true,
  realtime = false,
  className = ''
}: ChartWrapperProps) {
  const [data, setData] = useState(generateTimeSeriesData())
  const [isLoading, setIsLoading] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
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
          value3: Math.round((newValue * 0.7 + Math.random() * 20) * 10) / 10,
        })
        
        return newData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [realtime])

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={`bg-slate-900/50 border border-white/5 rounded-2xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-white/5 rounded w-1/4 mb-6"></div>
          <div style={{ height }} className="bg-white/5 rounded-lg"></div>
        </div>
      </div>
    )
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />}
              <XAxis 
                dataKey="time" 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={COLORS.primary}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: COLORS.primary }}
                animationDuration={animate ? 1000 : 0}
                name="Primary Metric"
              />
              <Line 
                type="monotone" 
                dataKey="value2" 
                stroke={COLORS.secondary}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: COLORS.secondary }}
                animationDuration={animate ? 1000 : 0}
                name="Secondary Metric"
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />}
              <XAxis 
                dataKey="time" 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={COLORS.primary}
                fill={`url(#colorGradient)`}
                strokeWidth={2}
                animationDuration={animate ? 1500 : 0}
                name="Activity"
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={agentPerformanceData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />}
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={11}
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}
              />
              <Bar 
                dataKey="efficiency" 
                fill={COLORS.primary}
                radius={[4, 4, 0, 0]}
                animationDuration={animate ? 1000 : 0}
                name="Efficiency %"
              />
              <Bar 
                dataKey="accuracy" 
                fill={COLORS.secondary}
                radius={[4, 4, 0, 0]}
                animationDuration={animate ? 1200 : 0}
                name="Accuracy %"
              />
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
                animationDuration={animate ? 1000 : 0}
              >
                {taskDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart data={neuralActivityData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis 
                dataKey="region" 
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                axisLine={false}
              />
              <Radar
                name="Activation"
                dataKey="activation"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.3}
                animationDuration={animate ? 1000 : 0}
              />
              <Radar
                name="Load"
                dataKey="load"
                stroke={COLORS.secondary}
                fill={COLORS.secondary}
                fillOpacity={0.2}
                animationDuration={animate ? 1200 : 0}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <div className={`bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors duration-300 ${className}`}>
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
      <ChartWrapper
        type="line"
        title="System Performance"
        subtitle="Real-time metrics across all agents"
        height={280}
        realtime
      />
      <ChartWrapper
        type="area"
        title="Neural Activity"
        subtitle="Brain-region activation levels"
        height={280}
      />
      <ChartWrapper
        type="bar"
        title="Agent Efficiency"
        subtitle="Performance by agent role"
        height={280}
      />
      <ChartWrapper
        type="radar"
        title="Neural Network Analysis"
        subtitle="Multi-dimensional brain metrics"
        height={280}
      />
      <div className="lg:col-span-2">
        <ChartWrapper
          type="pie"
          title="Task Distribution"
          subtitle="Current task status overview"
          height={300}
        />
      </div>
    </div>
  )
}

export default ChartWrapper
