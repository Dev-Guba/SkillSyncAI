import { motion } from 'framer-motion'
import { UserPlus, Tags, BrainCircuit, Compass } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up in seconds and set up your personal career profile.',
  },
  {
    icon: Tags,
    title: 'Add Skills',
    description: 'Tell us what you know — from programming to communication.',
  },
  {
    icon: BrainCircuit,
    title: 'AI Analysis',
    description: 'Our AI evaluates your strengths against thousands of job roles.',
  },
  {
    icon: Compass,
    title: 'Receive Recommendations',
    description: 'Get a ranked list of careers tailored to your unique skill set.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wide">
            How It Works
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-ink mt-3 mb-4 text-balance">
            Four steps to your next career
          </h2>
          <p className="text-lg text-muted">
            From sign-up to recommendation, SkillSyncAI makes finding the right role effortless.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="hidden lg:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-border" />

          {steps.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="relative w-18 h-18 rounded-2xl bg-surface border border-border shadow-soft flex items-center justify-center mb-5">
                <Icon className="w-7 h-7 text-primary" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">{title}</h3>
              <p className="text-sm text-muted leading-relaxed max-w-55">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}