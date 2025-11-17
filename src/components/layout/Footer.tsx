'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Heart,
} from 'lucide-react'
import type { SocialMediaLink } from '@/types/social-media'

const iconMap: { [key: string]: any } = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
}

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([])

  useEffect(() => {
    // Fetch social media links
    fetch('/api/social-media?active_only=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSocialLinks(data.data.links || [])
        }
      })
      .catch((error) => console.error('Error fetching social links:', error))
  }, [])

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', href: '/products' },
        { label: 'Featured', href: '/products?featured=true' },
        { label: 'Categories', href: '/categories' },
        { label: 'New Arrivals', href: '/products?sort=newest' },
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'Shipping Info', href: '/shipping' },
        { label: 'Returns', href: '/policies/returns' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
        { label: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/policies/privacy' },
        { label: 'Terms of Service', href: '/policies/terms' },
        { label: 'Cookie Policy', href: '/policies/cookies' },
        { label: 'Accessibility', href: '/accessibility' },
      ],
    },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center space-x-2 mb-4 group">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                ModernStore
              </span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted destination for quality products and exceptional service.
              Shop with confidence and discover amazing deals every day.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:support@modernstore.com"
                className="flex items-center text-gray-400 hover:text-primary-400 transition-colors group"
              >
                <Mail className="h-4 w-4 mr-3 text-primary-500 group-hover:scale-110 transition-transform" />
                <span className="text-sm">support@modernstore.com</span>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center text-gray-400 hover:text-primary-400 transition-colors group"
              >
                <Phone className="h-4 w-4 mr-3 text-primary-500 group-hover:scale-110 transition-transform" />
                <span className="text-sm">+1 (234) 567-890</span>
              </a>
              <div className="flex items-start text-gray-400">
                <MapPin className="h-4 w-4 mr-3 text-primary-500 mt-1 flex-shrink-0" />
                <span className="text-sm">123 Commerce Street, Suite 456<br />New York, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-white font-semibold mb-4 text-lg">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors text-sm inline-block hover:translate-x-1 duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-700"
        >
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Subscribe to our newsletter for exclusive deals and updates
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-500"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-primary-500/30">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center text-gray-400 text-sm">
              <span>© {new Date().getFullYear()} ModernStore. Made with</span>
              <Heart className="h-4 w-4 mx-1 text-red-500 fill-current animate-pulse" />
              <span>All rights reserved.</span>
            </div>

            {/* Social Media Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm mr-2">Follow us:</span>
                <div className="flex space-x-3">
                  {socialLinks.map((link) => {
                    const IconComponent = iconMap[link.icon.toLowerCase()] || ShoppingBag
                    return (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-gray-800 hover:bg-gradient-to-br hover:from-primary-600 hover:to-primary-700 p-2.5 rounded-lg transition-all duration-300 group"
                        title={link.platform}
                      >
                        <IconComponent className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                      </motion.a>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Payment Methods */}
            <div className="flex flex-wrap items-center gap-2 text-gray-500 text-xs">
              <span className="whitespace-nowrap">We accept:</span>
              <div className="flex flex-wrap gap-2">
                {['VISA', 'MC', 'AMEX', 'PayPal'].map((method) => (
                  <div
                    key={method}
                    className="px-2 py-1 bg-gray-800 rounded text-xs font-semibold whitespace-nowrap"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button (Optional) */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 p-3 rounded-full shadow-lg shadow-primary-500/50 text-white hover:scale-110 transition-transform duration-200 z-50"
        aria-label="Scroll to top"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </footer>
  )
}
