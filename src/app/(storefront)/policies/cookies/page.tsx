'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import { Cookie } from 'lucide-react'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <Cookie className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">Cookie Policy</h1>
          <p className="text-gray-600 text-center">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 space-y-8">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the site owners.
              </p>
              <p className="text-gray-600 leading-relaxed">
                At ModernStore, we use cookies to enhance your shopping experience, remember your preferences, and provide you with personalized content and advertisements.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Essential Cookies</h3>
                  <p className="text-gray-700">
                    These cookies are necessary for the website to function properly. They enable basic functions like page navigation, shopping cart functionality, and secure access to certain areas of the website.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Examples:</strong> Session cookies, security cookies, shopping cart cookies
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Performance Cookies</h3>
                  <p className="text-gray-700">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the website's performance.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Examples:</strong> Google Analytics, page load time tracking
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Functionality Cookies</h3>
                  <p className="text-gray-700">
                    These cookies enable enhanced functionality and personalization, such as remembering your language preference, recently viewed products, and saved items in your cart.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Examples:</strong> Language preferences, region settings, favorites list
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Targeting/Advertising Cookies</h3>
                  <p className="text-gray-700">
                    These cookies are used to deliver advertisements more relevant to you and your interests. They may also limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Examples:</strong> Retargeting pixels, ad network cookies
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website, deliver advertisements, and provide social media features.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Third-party services we use:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Google Analytics - for website analytics</li>
                  <li>Stripe - for payment processing</li>
                  <li>Social media platforms - for social sharing features</li>
                  <li>Advertising partners - for targeted advertisements</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Managing Your Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Setting your browser to refuse all cookies or to indicate when a cookie is being sent</li>
                <li>Deleting cookies that have already been stored on your device</li>
                <li>Using browser extensions that manage cookies</li>
              </ul>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <p className="text-gray-800">
                  <strong>Please note:</strong> If you choose to reject or delete certain cookies, some features of our website may not function properly, and you may not be able to complete purchases or access certain areas of the site.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Browser-Specific Instructions</h2>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-gray-700"><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-gray-700"><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-gray-700"><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-gray-700"><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update our Cookie Policy from time to time to reflect changes in technology, legislation, or our business operations. We will notify you of any significant changes by posting the new policy on this page with an updated "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="bg-primary-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> privacy@modernstore.com</p>
                <p className="text-gray-700"><strong>Address:</strong> 123 Commerce Street, Suite 100, New York, NY 10001</p>
                <p className="text-gray-700 mt-2">
                  <a href="/contact" className="text-primary-600 hover:text-primary-700 underline">
                    Contact Support
                  </a>
                </p>
              </div>
            </section>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
