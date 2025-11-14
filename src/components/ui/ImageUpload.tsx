'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from './Button'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  disabled?: boolean
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  className = '',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      onChange(data.url)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = async () => {
    if (!value || !onRemove) return

    try {
      // Extract filename from URL
      const filename = value.split('/').pop()
      if (filename) {
        await fetch(`/api/upload?filename=${filename}`, {
          method: 'DELETE',
        })
      }
      onRemove()
    } catch (err) {
      console.error('Error removing image:', err)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {value ? (
        <div className="relative group">
          <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-contain"
            />
          </div>
          {!disabled && onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`
            relative w-full h-64 border-2 border-dashed border-gray-300 rounded-lg
            flex flex-col items-center justify-center
            ${!disabled ? 'cursor-pointer hover:border-primary-500 hover:bg-primary-50' : 'opacity-50 cursor-not-allowed'}
            transition-all duration-200
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <Upload className="w-5 h-5" />
                <span className="font-medium">Click to upload image</span>
              </div>
              <p className="text-sm text-gray-500">PNG, JPG, GIF, WEBP up to 5MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

