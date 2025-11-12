'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <div className="relative">
            <input
              type="checkbox"
              ref={ref}
              className={cn(
                'appearance-none h-4 w-4 rounded border border-gray-300 bg-white',
                'checked:bg-primary-600 checked:border-primary-600',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'disabled:bg-gray-100 disabled:cursor-not-allowed',
                'transition-colors duration-200 cursor-pointer',
                error && 'border-red-500',
                className
              )}
              {...props}
            />
            <Check
              className="absolute top-0 left-0 h-4 w-4 text-white pointer-events-none hidden peer-checked:block"
              strokeWidth={3}
            />
          </div>
        </div>
        {label && (
          <div className="ml-3">
            <label
              htmlFor={props.id}
              className={cn(
                'text-sm font-medium text-gray-700 cursor-pointer',
                props.disabled && 'text-gray-400 cursor-not-allowed'
              )}
            >
              {label}
            </label>
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox