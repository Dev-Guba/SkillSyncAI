import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '../common/Button.jsx'

export default function CTA() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 lg:py-20 text-center"
        >
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary-400 rounded-full blur-3xl opacity-40" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary-800 rounded-full blur-3xl opacity-40" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 text-balance leading-tight">
              Ready to discover your next opportunity?
            </h2>
            <p className="text-primary-100 text-lg mb-10">
              Join thousands of job seekers who found their perfect match with SkillSyncAI.
            </p>
            <Button to="/register" variant="secondary" size="lg" icon={ArrowRight}>
              Create Free Account
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}