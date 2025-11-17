'use client'

import { motion } from 'framer-motion'
import Card, { CardContent } from '@/components/ui/Card'
import { ShoppingBag, Users, Award, TrendingUp } from 'lucide-react'

export default function AboutPage() {
  const features = [
    {
      icon: ShoppingBag,
      title: 'Wide Selection',
      description: 'Browse through thousands of products across multiple categories',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Dedicated support team available 24/7 to assist you',
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: 'All products are verified and come with quality assurance',
    },
    {
      icon: TrendingUp,
      title: 'Best Prices',
      description: 'Competitive pricing with regular discounts and offers',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">About ModernStore</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner for quality products and exceptional shopping experience
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="p-6 md:p-8 lg:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 text-base sm:text-lg leading-relaxed">
              <p>
                Founded in 2024, ModernStore has quickly become a leading destination for online shopping.
                We started with a simple mission: to make quality products accessible to everyone, everywhere.
              </p>
              <p>
                Today, we serve thousands of customers worldwide, offering a curated selection of products
                across electronics, fashion, home goods, and more. Our commitment to quality, affordability,
                and customer satisfaction remains at the heart of everything we do.
              </p>
              <p>
                We believe shopping should be easy, enjoyable, and trustworthy. That's why we've built a
                platform that combines cutting-edge technology with personalized service to deliver the
                best possible experience.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <Card className="p-6 text-center h-full hover:shadow-xl transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="p-6 md:p-8 lg:p-12 bg-gradient-to-br from-primary-50 to-primary-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Integrity</h3>
                <p className="text-gray-600">
                  We conduct business with honesty and transparency in all our dealings
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We continuously improve our platform to serve you better
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in every product and service we offer
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

