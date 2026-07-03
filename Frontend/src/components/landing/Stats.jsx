import { motion } from 'framer-motion'
import { Users, Briefcase, Building2, Target } from 'lucide-react'

const stats = [
  { icon: Users, value: '10,000+', label: 'Active Users' },
  { icon: Briefcase, value: '5,000+', label: 'Job Listings' },
  { icon: Building2, value: '250+', label: 'Partner Companies' },
  { icon: Target, value: '95%', label: 'AI Match Accuracy' },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Stats() {
  return (
    <section className="py-20 lg:py-24 border-y border-border bg-surface-alt">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <motion.div
              key={label}
              variants={item}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="bg-surface rounded-2xl border border-border p-6 lg:p-8 shadow-soft hover:shadow-soft-lg hover:border-primary-200 transition-shadow"
            >
              <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl lg:text-4xl font-bold text-ink mb-1">{value}</p>
              <p className="text-sm text-muted">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}