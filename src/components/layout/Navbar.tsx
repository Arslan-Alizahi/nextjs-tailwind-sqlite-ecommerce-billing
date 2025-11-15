'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingCart, Menu, X, Package, Heart } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/lib/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { NavItem } from '@/types/nav'
import * as LucideIcons from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [navLinks, setNavLinks] = useState<NavItem[]>([])
  const { itemCount } = useCart()
  const { count: favoritesCount } = useFavorites()

  useEffect(() => {
    // Fetch navigation items from API
    fetch('/api/nav?location=header&active_only=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Filter to only show top-level items (no parent_id)
          const topLevelItems = (data.data || []).filter((item: NavItem) => !item.parent_id)
          setNavLinks(topLevelItems)
        }
      })
      .catch((error) => console.error('Error fetching nav items:', error))
  }, [])

  // Get icon component from lucide-react
  const getIcon = (iconName?: string) => {
    if (!iconName) return null
    const Icon = (LucideIcons as any)[iconName]
    return Icon ? Icon : null
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold gradient-text">ModernStore</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const Icon = getIcon(link.icon)
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  target={link.target || '_self'}
                  className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium flex items-center gap-1"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Favorites, Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link
              href="/favorites"
              className="relative p-2 text-gray-700 hover:text-red-500 transition-colors"
              title="Favorites"
            >
              <Heart className="h-6 w-6" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-scale-in">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-scale-in">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="px-4 py-2 space-y-1">
              {navLinks.map((link) => {
                const Icon = getIcon(link.icon)
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    target={link.target || '_self'}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    <span>{link.label}</span>
                  </Link>
                )
              })}

              {/* Favorites & Cart Links */}
              <div className="border-t pt-2 mt-2">
                <Link
                  href="/favorites"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5" />
                    <span>Favorites</span>
                  </div>
                  {favoritesCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Shopping Cart</span>
                  </div>
                  {itemCount > 0 && (
                    <span className="bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}