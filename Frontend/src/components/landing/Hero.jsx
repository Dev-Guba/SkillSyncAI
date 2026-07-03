import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react'
import Button from '../common/Button.jsx'
import heroImage from '../../assets/images/hero.png'

const trustedAvatars = [
  "https://i.pravatar.cc/100?img=12",
  "https://i.pravatar.cc/100?img=13",
  "https://i.pravatar.cc/100?img=14",
  "https://i.pravatar.cc/100?img=15",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 lg:pt-10 lg:pb-16">
      <div className="absolute top-0 right-0 w-150 h-150 bg-primary-100 dark:bg-primary-900 rounded-full blur-3xl opacity-40 dark:opacity-30 -z-10 translate-x-1/3 -translate-y-1/3" />

      <div className="mx-auto max-w-7xl px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left column */}
          <div>

            <motion.h1
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
  className="text-6xl xl:text-7xl font-extrabold leading-[0.95] tracking-[-2px] text-ink mb-8"
>
  AI that connects
  <br />
  your skills to
  <br />
  the <span className="text-primary">right</span>
  <br />
  <span className="text-primary">opportunities.</span>
</motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted max-w-md mb-10 leading-9"
            >
              Tell us your skills, and our AI will recommend
jobs that match your strengths, goals, and
career potential.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-5 mb-12"
            >
              <Button to="/register" variant="primary" size="lg" icon={ArrowRight}>
                Get Started
              </Button>
              <Button href="#how-it-works" variant="secondary" size="lg">
                Learn More
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-3">
  {trustedAvatars.map((avatar, index) => (
    <img
      key={index}
      src={avatar}
      alt=""
      className="w-10 h-10 rounded-full border-2 border-surface object-cover"
    />
  ))}
</div>
              <p className="text-sm text-muted">
                <span className="font-semibold text-ink">10,000+</span> job seekers trust SkillSyncAI
              </p>
            </motion.div>
          </div>

          {/* Right column - hero image + floating cards */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10"
            >
              <img
                src={heroImage}
                alt="SkillSyncAI career matching illustration"
                className="w-[118%] max-w-none h-auto object-contain translate-x-8"
              />
            </motion.div>

            {/* Floating card 1 - AI Match */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute top-6 -left-4 sm:left-0 z-20"
            >
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="bg-surface rounded-2xl shadow-soft-lg border border-border p-4 w-44"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted">AI Match</span>
                </div>
                <p className="text-2xl font-bold text-ink mb-0.5">95%</p>
                <p className="text-xs text-muted">Frontend Developer</p>
              </motion.div>
            </motion.div>

            {/* Floating card 2 - Top Skills */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute top-1/3 -right-2 sm:right-0 z-20"
            >
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                className="bg-surface rounded-2xl shadow-soft-lg border border-border p-4 w-40"
              >
                <p className="text-xs font-medium text-muted mb-2.5">Top Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {['React', 'JavaScript', 'SQL'].map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-medium px-2 py-1 rounded-md bg-primary-50 text-primary-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Floating card 3 - Recommended */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute -bottom-4 left-1/4 sm:left-1/3 z-20"
            >
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
                className="bg-surface rounded-2xl shadow-soft-lg border border-border p-4 w-48"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-xs font-medium text-muted">Recommended</span>
                </div>
                <p className="text-sm font-semibold text-ink mb-0.5">UI/UX Designer</p>
                <p className="text-xs text-emerald-600 font-medium">90% Match</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}