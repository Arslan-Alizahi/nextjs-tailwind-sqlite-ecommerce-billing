'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Briefcase, Users, TrendingUp, Heart, Coffee, Award } from 'lucide-react'

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Build your career with ModernStore and help us create amazing shopping experiences
          </p>
        </motion.div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Users, title: 'Great Team', desc: 'Work with talented people' },
            { icon: TrendingUp, title: 'Growth', desc: 'Opportunities to advance' },
            { icon: Heart, title: 'Work-Life Balance', desc: 'Flexible schedules' },
            { icon: Coffee, title: 'Remote Options', desc: 'Work from anywhere' },
            { icon: Award, title: 'Competitive Pay', desc: 'Market-leading salaries' },
            { icon: Briefcase, title: 'Benefits', desc: 'Health, dental, and more' },
          ].map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 text-center h-full">
                <benefit.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Open Positions */}
        <Card className="p-8 text-center">
          <Briefcase className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Current Openings</h2>
          <p className="text-gray-600 mb-6">
            We're currently not hiring but we're always looking for talented individuals to join our team.
            Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <a href="/contact">
            <Button variant="primary" size="lg">
              Send Your Resume
            </Button>
          </a>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
