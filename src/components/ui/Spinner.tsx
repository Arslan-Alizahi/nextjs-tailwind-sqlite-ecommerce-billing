'use client'

import { cn } from '@/lib/cn'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  label?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

export function Spinner({ size = 'md', className, label }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div
          className={cn(
            'animate-spin rounded-full border-2 border-gray-200',
            sizeClasses[size],
            className
          )}
        >
          <div className="absolute inset-0 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
        </div>
      </div>
      {label && (
        <p className="text-sm text-gray-600 animate-pulse">{label}</p>
      )}
    </div>
  )
}

// Default export for convenience
export default Spinner

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn('loading-dots', className)}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}

export function FullPageSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
      <div className="text-center">
        <Spinner size="xl" />
        {label && (
          <p className="mt-4 text-lg text-gray-600 animate-pulse">{label}</p>
        )}
      </div>
    </div>
  )
}

export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div className={cn('skeleton', className)} />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <SkeletonLoader className="h-64 w-full" />
      <div className="p-4">
        <SkeletonLoader className="h-6 w-3/4 mb-2" />
        <SkeletonLoader className="h-4 w-full mb-4" />
        <div className="flex justify-between items-center">
          <SkeletonLoader className="h-6 w-20" />
          <SkeletonLoader className="h-10 w-24" />
        </div>
      </div>
    </div>
  )
}