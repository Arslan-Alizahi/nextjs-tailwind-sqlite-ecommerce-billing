'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import { Newspaper, Download, Mail } from 'lucide-react'

export default function PressPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Newspaper className="h-12 w-12 sm:h-16 sm:w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Press & Media</h1>
          <p className="text-lg sm:text-xl text-gray-600">Latest news and media resources</p>
        </motion.div>

        <div className="space-y-6">
          <Card className="p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">About ModernStore</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              ModernStore is a leading e-commerce platform dedicated to providing exceptional shopping experiences. Founded in 2024, we've grown to serve thousands of customers with a wide range of quality products.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to make online shopping accessible, enjoyable, and trustworthy for everyone.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <div className="flex items-center mb-4">
              <Download className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Media Kit</h2>
            </div>
            <p className="text-gray-600 mb-4">Download our brand assets and media kit</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600">Brand logos, product images, and company information coming soon</p>
            </div>
          </Card>

          <Card className="p-6 md:p-8 bg-primary-50">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Media Inquiries</h2>
            </div>
            <p className="text-gray-600 mb-2">For press and media inquiries, please contact:</p>
            <p className="text-gray-900 font-semibold">press@modernstore.com</p>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
