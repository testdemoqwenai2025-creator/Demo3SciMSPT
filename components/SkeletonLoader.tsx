'use client'

import { useState, useEffect } from 'react'

// Base skeleton pulse animation
const skeletonPulse = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.03) 25%,
      rgba(255,255,255,0.08) 50%,
      rgba(255,255,255,0.03) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
  }
`

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({ 
  className = '', 
  variant = 'text',
  width,
  height 
}: SkeletonProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const baseClasses = mounted ? 'skeleton-shimmer' : 'bg-white/5'
  
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  }

  return (
    <>
      <style>{skeletonPulse}</style>
      <div 
        className={`${baseClasses} ${variants[variant]} ${className}`}
        style={{ width, height }}
      />
    </>
  )
}

// Page-level skeleton loader
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <style>{skeletonPulse}</style>
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Skeleton width="300px" height="32px" className="mb-4" />
        <Skeleton width="500px" height="20px" />
      </div>

      {/* Content grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1 */}
          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
            <Skeleton width="200px" height="24px" />
            <Skeleton width="100%" height="16px" />
            <Skeleton width="90%" height="16px" />
            <Skeleton width="95%" height="16px" />
            <div className="flex gap-4 pt-4">
              <Skeleton width="120px" height="40px" variant="rectangular" />
              <Skeleton width="120px" height="40px" variant="rectangular" />
            </div>
          </div>

          {/* Card 2 - Chart placeholder */}
          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
            <Skeleton width="180px" height="24px" />
            <Skeleton width="100%" height={280} variant="rectangular" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-3">
              <Skeleton width="80px" height="16px" />
              <Skeleton width="60%" height="36px" />
              <Skeleton width="100%" height="12px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Dashboard-specific skeleton
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <style>{skeletonPulse}</style>
      
      {/* Stats row */}
      <div className="max-w-7xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-900/50 border border-white/5 rounded-xl p-5 space-y-3">
            <Skeleton width="80px" height="14px" />
            <Skeleton width="50%" height="28px" />
            <Skeleton width="60%" height="12px" />
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
            <Skeleton width="200px" height="24px" />
            <Skeleton width="100%" height={250} variant="rectangular" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Card skeleton component
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
      <style>{skeletonPulse}</style>
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton width="60%" height="20px" />
          <Skeleton width="40%" height="14px" />
        </div>
        <Skeleton width="40px" height="40px" variant="circular" />
      </div>

      {/* Content lines */}
      <div className="space-y-3 pt-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i} 
            width={i === lines - 1 ? '70%' : '100%'} 
            height="14px" 
          />
        ))}
      </div>

      {/* Footer actions */}
      <div className="flex gap-3 pt-4">
        <Skeleton width="80px" height="32px" variant="rectangular" />
        <Skeleton width="80px" height="32px" variant="rectangular" />
      </div>
    </div>
  )
}

// Table skeleton
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden">
      <style>{skeletonPulse}</style>
      
      {/* Table header */}
      <div className="flex gap-4 p-4 border-b border-white/5 bg-white/[0.02]">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} width={`${100 / cols}%`} height="16px" className="flex-1" />
        ))}
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border-b border-white/5 last:border-0">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              width={`${100 / cols}%`} 
              height="14px" 
              className="flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// List skeleton with avatars
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      <style>{skeletonPulse}</style>
      
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-slate-900/30 rounded-xl">
          <Skeleton width="48px" height="48px" variant="circular" />
          
          <div className="flex-1 space-y-2">
            <Skeleton width="30%" height="16px" />
            <Skeleton width="60%" height="12px" />
          </div>
          
          <div className="flex items-center gap-3">
            <Skeleton width="60px" height="24px" variant="rectangular" />
            <Skeleton width="24px" height="24px" variant="circular" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Full page loading overlay
export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated spinner */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        
        <p className="text-white/60 font-medium">{message}</p>
        
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div 
              key={i}
              className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Skeleton
