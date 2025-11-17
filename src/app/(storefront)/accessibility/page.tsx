'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import { Accessibility, Eye, Keyboard, Volume2, MousePointer, Smile } from 'lucide-react'

export default function AccessibilityPage() {
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
            <Accessibility className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">Accessibility Statement</h1>
          <p className="text-gray-600 text-center">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 space-y-8">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                ModernStore is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to ensure we provide equal access to all of our users.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe that everyone, regardless of ability, should be able to browse, shop, and interact with our website with ease. We strive to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Accessibility Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                  <Eye className="h-8 w-8 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Visual Accessibility</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• High contrast color scheme</li>
                      <li>• Resizable text</li>
                      <li>• Clear visual focus indicators</li>
                      <li>• Alternative text for images</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-green-50 rounded-lg">
                  <Keyboard className="h-8 w-8 text-green-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Keyboard Navigation</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Full keyboard accessibility</li>
                      <li>• Skip navigation links</li>
                      <li>• Logical tab order</li>
                      <li>• Keyboard shortcuts</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-purple-50 rounded-lg">
                  <Volume2 className="h-8 w-8 text-purple-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Screen Reader Support</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• ARIA labels and landmarks</li>
                      <li>• Semantic HTML structure</li>
                      <li>• Descriptive link text</li>
                      <li>• Form labels and instructions</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-amber-50 rounded-lg">
                  <MousePointer className="h-8 w-8 text-amber-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Navigation & Interaction</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Clear page structure</li>
                      <li>• Consistent navigation</li>
                      <li>• Large clickable areas</li>
                      <li>• Clear error messages</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Conformance Status</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We are actively working towards WCAG 2.1 Level AA conformance. Our efforts include:
              </p>
              <div className="bg-primary-50 p-6 rounded-lg space-y-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <p className="text-gray-800"><strong>Perceivable:</strong> Content is available to all senses</p>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <p className="text-gray-800"><strong>Operable:</strong> Interface forms and controls are usable</p>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <p className="text-gray-800"><strong>Understandable:</strong> Information is easy to comprehend</p>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <p className="text-gray-800"><strong>Robust:</strong> Content works with current and future technologies</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Assistive Technologies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our website is designed to be compatible with the following assistive technologies:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-gray-700"><strong>Screen Readers:</strong> JAWS, NVDA, VoiceOver</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-gray-700"><strong>Screen Magnifiers:</strong> ZoomText, MAGic</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-gray-700"><strong>Speech Recognition:</strong> Dragon NaturallySpeaking</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-gray-700"><strong>Alternative Input:</strong> Switch devices, eye trackers</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Known Limitations</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Despite our best efforts, some pages or sections may have accessibility issues that we're actively working to address:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Some PDF documents may not be fully accessible</li>
                <li>Third-party embedded content may not meet all accessibility standards</li>
                <li>Some older product images may lack detailed alternative text</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                We are committed to resolving these issues as quickly as possible.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Ongoing Efforts</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We continuously monitor and improve our website's accessibility through:
              </p>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <p>Regular accessibility audits and testing</p>
                </div>
                <div className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <p>Staff training on accessibility best practices</p>
                </div>
                <div className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <p>User testing with people who use assistive technologies</p>
                </div>
                <div className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <p>Incorporating accessibility into our development process</p>
                </div>
                <div className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <p>Responding promptly to user feedback</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Feedback & Contact</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We welcome your feedback on the accessibility of ModernStore. If you encounter any accessibility barriers on our website, please let us know:
              </p>
              <div className="bg-primary-50 p-6 rounded-lg space-y-3">
                <div className="flex items-center">
                  <Smile className="h-6 w-6 text-primary-600 mr-3" />
                  <div>
                    <p className="text-gray-800"><strong>Email:</strong> accessibility@modernstore.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Volume2 className="h-6 w-6 text-primary-600 mr-3" />
                  <div>
                    <p className="text-gray-800"><strong>Phone:</strong> +1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="mt-4">
                  <a href="/contact" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                    Contact Our Accessibility Team
                  </a>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-4">
                We aim to respond to accessibility feedback within 2 business days and propose a solution within 10 business days.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Technical Specifications</h2>
              <p className="text-gray-600 leading-relaxed">
                Accessibility of ModernStore relies on the following technologies:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4 mt-2">
                <li>HTML5</li>
                <li>WAI-ARIA</li>
                <li>CSS3</li>
                <li>JavaScript (Progressive Enhancement)</li>
              </ul>
            </section>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
