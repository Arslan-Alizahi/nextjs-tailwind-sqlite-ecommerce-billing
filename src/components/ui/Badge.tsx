'use client'

import { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-800',
        secondary: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
        outline: 'border border-gray-300 bg-transparent text-gray-700',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
      },
      pulse: {
        true: 'badge-pulse',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export default function Badge({
  className,
  variant,
  size,
  pulse,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size, pulse }), className)}
      {...props}
    />
  )
}

export function StatusBadge({ status }: { status: string }) {
  const getVariant = () => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'paid':
      case 'delivered':
        return 'success'
      case 'pending':
      case 'processing':
        return 'warning'
      case 'inactive':
      case 'cancelled':
      case 'failed':
      case 'refunded':
        return 'danger'
      default:
        return 'default'
    }
  }

  return (
    <Badge variant={getVariant()}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export function StockBadge({ quantity, threshold = 5 }: { quantity: number; threshold?: number }) {
  const getVariant = () => {
    if (quantity <= 0) return 'danger'
    if (quantity <= threshold) return 'warning'
    return 'success'
  }

  const getText = () => {
    if (quantity <= 0) return 'Out of Stock'
    if (quantity <= threshold) return `Low Stock (${quantity})`
    return `In Stock (${quantity})`
  }

  return (
    <Badge variant={getVariant()} pulse={quantity <= 0}>
      {getText()}
    </Badge>
  )
}