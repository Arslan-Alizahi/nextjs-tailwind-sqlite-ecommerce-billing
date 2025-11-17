'use client'

import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ReturnsPage() {
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Return Policy</h1>
          
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-gray-700 leading-relaxed">
                We want you to be completely satisfied with your purchase. If you're not happy with your order,
                we're here to help with returns and exchanges.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">1. Return Window</h2>
              <p className="text-gray-600 leading-relaxed">
                You have 30 days from the date of delivery to return most items for a full refund or exchange.
                Items must be in their original condition with all tags and packaging intact.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">2. Eligible Items</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Most items can be returned, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Clothing and accessories (with tags attached)</li>
                <li>Electronics (in original packaging, unopened)</li>
                <li>Home goods and furniture (unassembled and unused)</li>
                <li>Books and media (in resalable condition)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">3. Non-Returnable Items</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                The following items cannot be returned:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Personalized or custom-made items</li>
                <li>Perishable goods</li>
                <li>Intimate apparel and swimwear</li>
                <li>Health and personal care items (opened)</li>
                <li>Gift cards</li>
                <li>Downloadable software or digital products</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">4. How to Return an Item</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                To initiate a return:
              </p>
              <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
                <li>Contact our customer service team at returns@modernstore.com</li>
                <li>Provide your order number and reason for return</li>
                <li>Receive a return authorization number and shipping label</li>
                <li>Pack the item securely in its original packaging</li>
                <li>Attach the return label and ship the package</li>
              </ol>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">5. Return Shipping</h2>
              <p className="text-gray-600 leading-relaxed">
                Return shipping costs are the responsibility of the customer unless the item is defective or we made
                an error in your order. We recommend using a trackable shipping service for returns.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">6. Refund Processing</h2>
              <p className="text-gray-600 leading-relaxed">
                Once we receive your return, we will inspect the item and process your refund within 5-7 business days.
                Refunds will be issued to the original payment method. Please allow additional time for your bank to
                process the refund.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">7. Exchanges</h2>
              <p className="text-gray-600 leading-relaxed">
                If you need to exchange an item for a different size, color, or product, please contact our customer
                service team. We'll help you process the exchange and arrange for the new item to be shipped.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">8. Damaged or Defective Items</h2>
              <p className="text-gray-600 leading-relaxed">
                If you receive a damaged or defective item, please contact us immediately with photos of the damage.
                We will arrange for a replacement or full refund, including return shipping costs.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">9. Late or Missing Refunds</h2>
              <p className="text-gray-600 leading-relaxed">
                If you haven't received your refund within the expected timeframe, please check with your bank first.
                If you still haven't received it, contact us at support@modernstore.com
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">10. Questions?</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about our return policy, please don't hesitate to contact us at
                returns@modernstore.com or call our customer service team.
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

