'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { Search, ChevronDown, HelpCircle, Package, CreditCard, Truck, RotateCcw } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'returns', name: 'Returns', icon: RotateCcw },
  ]

  const faqs: FAQItem[] = [
    // Orders
    {
      category: 'orders',
      question: 'How do I place an order?',
      answer: 'Browse our products, add items to your cart, and proceed to checkout. Fill in your shipping and payment information, then confirm your order. You\'ll receive a confirmation email with your order details.'
    },
    {
      category: 'orders',
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 1 hour of placing it. After that, your order enters our processing system. Please contact our support team immediately if you need to make changes.'
    },
    {
      category: 'orders',
      question: 'How do I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can use this to track your package on the carrier\'s website. You can also check your order status in your account dashboard.'
    },
    {
      category: 'orders',
      question: 'Do I need an account to place an order?',
      answer: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save favorites, and enjoy a faster checkout experience for future purchases.'
    },

    // Payment
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay. All payments are processed securely through Stripe.'
    },
    {
      category: 'payment',
      question: 'Is my payment information secure?',
      answer: 'Yes! We use industry-standard SSL encryption and never store your credit card information. All payments are processed through Stripe, a PCI-compliant payment processor.'
    },
    {
      category: 'payment',
      question: 'When will I be charged?',
      answer: 'Your payment method will be charged immediately when you place your order. You\'ll receive a payment confirmation email within minutes.'
    },
    {
      category: 'payment',
      question: 'Can I use multiple payment methods?',
      answer: 'Currently, we only support one payment method per order. If you need to split payment, please contact our customer support team.'
    },

    // Shipping
    {
      category: 'shipping',
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days, and overnight shipping delivers the next business day. International shipping times vary by location.'
    },
    {
      category: 'shipping',
      question: 'Do you offer free shipping?',
      answer: 'Yes! We offer free standard shipping on all orders over $50 within the United States. No code needed - the discount is applied automatically at checkout.'
    },
    {
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 50 countries worldwide including Canada, UK, Australia, and more. International shipping costs and delivery times vary by destination.'
    },
    {
      category: 'shipping',
      question: 'What if my package is lost or damaged?',
      answer: 'If your package is lost or arrives damaged, please contact us immediately with your order number and photos (if damaged). We\'ll work with the carrier to resolve the issue and send a replacement if needed.'
    },

    // Returns
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy on most items. Products must be unused, in original packaging, and in the same condition you received them. Some items like personalized products are non-returnable.'
    },
    {
      category: 'returns',
      question: 'How do I return an item?',
      answer: 'Contact our support team to initiate a return. We\'ll provide you with a return shipping label and instructions. Once we receive and inspect the item, we\'ll process your refund within 5-7 business days.'
    },
    {
      category: 'returns',
      question: 'Who pays for return shipping?',
      answer: 'For defective or incorrect items, we cover return shipping costs. For other returns, customers are responsible for return shipping unless the item qualifies for free returns.'
    },
    {
      category: 'returns',
      question: 'Can I exchange an item?',
      answer: 'Yes! Contact our support team to arrange an exchange. We\'ll send you a replacement item and provide instructions for returning the original item.'
    },
    {
      category: 'returns',
      question: 'How long do refunds take?',
      answer: 'Once we receive and inspect your return, refunds are processed within 5-7 business days. The refund will appear on your original payment method within 3-10 business days, depending on your bank.'
    },
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about orders, shipping, payments, and returns
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-4">
            <Input
              placeholder="Search for answers..."
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Card>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {category.name}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {filteredFAQs.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 text-lg">No questions found matching your search.</p>
              <p className="text-gray-400 mt-2">Try different keywords or browse all categories.</p>
            </Card>
          ) : (
            filteredFAQs.map((faq, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform ${
                      expandedIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))
          )}
        </motion.div>

        {/* Still Have Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="p-6 md:p-8 bg-gradient-to-r from-primary-50 to-blue-50 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our customer support team is here to help.
            </p>
            <a href="/contact">
              <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Contact Support
              </button>
            </a>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
