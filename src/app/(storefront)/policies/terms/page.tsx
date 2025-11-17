'use client'

import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-gray-600 leading-relaxed">
                Welcome to ModernStore. By accessing and using our website, you agree to be bound by these Terms of Service.
                Please read them carefully before making any purchase.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using ModernStore's services, you agree to comply with and be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">2. Use of Service</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Use the service in any way that violates any applicable law or regulation</li>
                <li>Engage in any conduct that restricts or inhibits anyone's use of the service</li>
                <li>Attempt to gain unauthorized access to any portion of the service</li>
                <li>Use the service to transmit any harmful or malicious code</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">3. Account Registration</h2>
              <p className="text-gray-600 leading-relaxed">
                To make purchases, you may need to create an account. You are responsible for maintaining the confidentiality
                of your account credentials and for all activities that occur under your account.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">4. Product Information</h2>
              <p className="text-gray-600 leading-relaxed">
                We strive to provide accurate product descriptions and pricing. However, we do not warrant that product
                descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">5. Pricing and Payment</h2>
              <p className="text-gray-600 leading-relaxed">
                All prices are subject to change without notice. We reserve the right to refuse or cancel any order for any reason.
                Payment must be received before order processing begins.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">6. Shipping and Delivery</h2>
              <p className="text-gray-600 leading-relaxed">
                We will make reasonable efforts to deliver products within the estimated timeframe. However, delivery times
                are estimates and not guaranteed. We are not liable for delays caused by circumstances beyond our control.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">7. Returns and Refunds</h2>
              <p className="text-gray-600 leading-relaxed">
                Please refer to our Return Policy for detailed information about returns, exchanges, and refunds.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">8. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">
                All content on this website, including text, graphics, logos, images, and software, is the property of
                ModernStore and is protected by copyright and other intellectual property laws.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                To the fullest extent permitted by law, ModernStore shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages arising out of or relating to your use of the service.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">10. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately
                upon posting. Your continued use of the service constitutes acceptance of the modified terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">11. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at support@modernstore.com
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
      </div>
      <Footer />
    </div>
  )
}

