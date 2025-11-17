'use client'

import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function PrivacyPage() {
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-gray-600 leading-relaxed">
                At ModernStore, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
                and safeguard your information when you visit our website.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Name, email address, and contact information</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely through third-party payment processors)</li>
                <li>Order history and preferences</li>
                <li>Communications with customer support</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and account</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Detect and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">3. Information Sharing</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Service providers who assist in operating our website and business</li>
                <li>Payment processors to complete transactions</li>
                <li>Shipping companies to deliver your orders</li>
                <li>Law enforcement when required by law</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                We do not sell your personal information to third parties.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">4. Cookies and Tracking</h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic,
                and understand where our visitors are coming from. You can control cookies through your browser settings.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information.
                However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to processing of your information</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">7. Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal
                information from children under 13.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">8. International Data Transfers</h2>
              <p className="text-gray-600 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence.
                We ensure appropriate safeguards are in place for such transfers.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new policy on this page and updating the "Last updated" date.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">10. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at privacy@modernstore.com
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

