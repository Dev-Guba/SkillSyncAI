import { motion } from 'framer-motion'
import { Sparkles, Radar, LineChart, Check } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI Matching',
    description:
      'Our machine learning model compares your profile against real job requirements to surface roles you are genuinely qualified for.',
    points: ['Real-time job matching', 'Continuously learning model'],
  },
  {
    icon: Radar,
    title: 'Skill Analysis',
    description:
      'Understand exactly where your strengths lie and which in-demand skills are worth learning next to grow your career.',
    points: ['Skill gap detection', 'Personalized growth paths'],
  },
  {
    icon: LineChart,
    title: 'Career Insights',
    description:
      'Get data-backed insight on salary ranges, market demand, and growth trajectories for every recommended role.',
    points: ['Salary benchmarking', 'Market demand trends'],
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-surface-alt">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wide">
            Features
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-ink mt-3 mb-4 text-balance">
            Everything you need to find your fit
          </h2>
          <p className="text-lg text-muted">
            Built for job seekers who want more than a keyword search.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map(({ icon: Icon, title, description, points }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-surface rounded-2xl border border-border p-8 shadow-soft hover:shadow-soft-lg hover:border-primary-200 transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-6">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">{title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-6">{description}</p>
              <ul className="space-y-2.5">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm text-ink">
                    <span className="w-4 h-4 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-primary" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}