'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import { Truck, Package, Clock, MapPin, DollarSign, CheckCircle } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Fast, reliable shipping to your doorstep
          </p>
        </motion.div>

        {/* Shipping Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Shipping Methods</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Truck className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard Shipping</h3>
              <p className="text-gray-600 mb-2">5-7 Business Days</p>
              <p className="text-2xl font-bold text-primary-600">$5.99</p>
              <p className="text-sm text-gray-500 mt-2">Free on orders over $50</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-primary-500">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary-100 rounded-full">
                  <Package className="h-8 w-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Express Shipping</h3>
              <p className="text-gray-600 mb-2">2-3 Business Days</p>
              <p className="text-2xl font-bold text-primary-600">$12.99</p>
              <p className="text-sm text-gray-500 mt-2">Most popular</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Overnight</h3>
              <p className="text-gray-600 mb-2">Next Business Day</p>
              <p className="text-2xl font-bold text-primary-600">$24.99</p>
              <p className="text-sm text-gray-500 mt-2">Order before 2 PM</p>
            </Card>
          </div>
        </motion.div>

        {/* Shipping Zones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="p-6 md:p-8">
            <div className="flex items-center mb-6">
              <MapPin className="h-7 w-7 sm:h-8 sm:w-8 text-primary-600 mr-3" />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Shipping Zones</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">United States (Domestic)</h3>
                  <p className="text-gray-600">We ship to all 50 states including Alaska and Hawaii</p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">International Shipping</h3>
                  <p className="text-gray-600">Available to Canada, UK, Australia, and 50+ countries. Additional fees may apply.</p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">APO/FPO Addresses</h3>
                  <p className="text-gray-600">We're proud to ship to military addresses worldwide</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Processing Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <Card className="p-6 md:p-8 bg-gradient-to-r from-blue-50 to-primary-50">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Processing Time</h2>
            <p className="text-gray-600 mb-4">
              Orders are typically processed within 1-2 business days. You'll receive a confirmation email with tracking information once your order ships.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Orders placed before 2 PM EST ship same day</li>
              <li>Orders placed after 2 PM EST ship next business day</li>
              <li>Weekend orders process on Monday</li>
              <li>Holiday processing times may vary</li>
            </ul>
          </Card>
        </motion.div>

        {/* Free Shipping */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <Card className="p-6 md:p-8 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center mb-4">
              <DollarSign className="h-7 w-7 sm:h-8 sm:w-8 text-green-600 mr-3" />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Free Shipping</h2>
            </div>
            <p className="text-gray-600 text-base sm:text-lg">
              <strong>Get FREE Standard Shipping on all orders over $50!</strong>
            </p>
            <p className="text-gray-600 mt-2">
              No code needed. Discount applied automatically at checkout.
            </p>
          </Card>
        </motion.div>

        {/* Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Order Tracking</h2>
            <p className="text-gray-600 mb-4">
              Once your order ships, you'll receive an email with a tracking number. You can use this to monitor your package's journey to your doorstep.
            </p>
            <div className="space-y-3 text-gray-600">
              <p><strong>Track your order:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Click the tracking link in your shipping confirmation email</li>
                <li>Visit the carrier's website and enter your tracking number</li>
                <li>Check your order status in your account dashboard</li>
              </ul>
            </div>
          </Card>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">
            Have questions about shipping? We're here to help!
          </p>
          <a href="/contact" className="text-primary-600 hover:text-primary-700 font-semibold underline">
            Contact Our Support Team
          </a>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
