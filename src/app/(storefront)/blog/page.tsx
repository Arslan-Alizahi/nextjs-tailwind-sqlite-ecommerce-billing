'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import { BookOpen, Calendar, User } from 'lucide-react'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Tips, trends, and stories from the world of e-commerce
          </p>
        </motion.div>

        {/* Coming Soon */}
        <Card className="p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600 text-lg mb-6">
              We're working on bringing you exciting content about shopping trends, product guides, and company updates. Stay tuned!
            </p>
            <div className="bg-primary-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">Want to be notified when we launch our blog?</p>
              <a href="/contact" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Subscribe for Updates
              </a>
            </div>
          </div>
        </Card>

        {/* Placeholder Blog Posts */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { title: 'Shopping Guide 2024', category: 'Guides' },
            { title: 'Product Care Tips', category: 'Tips' },
            { title: 'Company News', category: 'News' },
          ].map((post, index) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Card className="p-6 opacity-50">
                <div className="bg-gray-200 h-40 rounded mb-4"></div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Coming Soon</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                <span className="text-sm text-primary-600">{post.category}</span>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
