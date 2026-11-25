import { motion } from 'framer-motion'
import {
  ArrowRight,
  Target,
  GraduationCap,
  MapPin,
  BookOpen,
  ShieldCheck,
  Briefcase,
} from 'lucide-react'
import Button from '../common/Button.jsx'
import heroImage from '../../assets/images/hero.png'

// Plain facts about the system (no user counts or made-up numbers)
const TRUST_POINTS = [
  { icon: Briefcase, text: 'Real Cebu job postings' },
  { icon: Target, text: 'TF-IDF + cosine skill matching' },
  { icon: ShieldCheck, text: 'Free for UCLM students' },
]

function FloatingCard({ delay, floatDelay, className, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`absolute z-20 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
        className="rounded-2xl border border-border bg-surface p-4 shadow-soft-lg"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-12 pt-8 lg:pb-16 lg:pt-10">
      {/* Blue-violet glow */}
      <div className="absolute right-0 top-0 -z-10 h-150 w-150 -translate-y-1/3 translate-x-1/3 rounded-full bg-[#A98BF2]/25 blur-3xl" />
      <div className="absolute -left-40 top-1/2 -z-10 h-96 w-96 rounded-full bg-[#7FA6F5]/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-8">
          {/* Left column */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary"
            >
              <GraduationCap className="h-4 w-4" />
              For UCLM students · Cebu job market
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-7 text-5xl font-extrabold leading-[0.98] tracking-[-2px] text-ink sm:text-6xl xl:text-7xl"
            >
              AI that connects
              <br />
              your skills to the
              <br />
              <span className="text-brand-gradient">right opportunities.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-9 max-w-lg text-lg leading-8 text-muted sm:text-xl sm:leading-9"
            >
              SkillSyncAI compares your skills with real Cebu job postings, shows your skill
              gaps, tells you what to learn next, and checks how well your program matches what
              employers want.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-10 flex flex-wrap items-center gap-4"
            >
              <Button to="/register" variant="primary" size="lg" icon={ArrowRight}>
                Get Started
              </Button>
              <Button href="#how-it-works" variant="secondary" size="lg">
                See how it works
              </Button>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-x-6 gap-y-3"
            >
              {TRUST_POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-sm font-medium text-ink/80">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </span>
                  {text}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right column — illustration with example cards of real features */}
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
                className="h-auto w-full object-contain lg:w-[118%] lg:max-w-none lg:translate-x-8"
              />
            </motion.div>

            {/* Example: skill match */}
            <FloatingCard delay={0.6} floatDelay={1} className="-left-2 top-4 w-48 sm:left-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="bg-brand-gradient flex h-8 w-8 items-center justify-center rounded-lg text-white">
                  <Target className="h-4 w-4" />
                </span>
                <span className="text-xs font-medium text-muted">Skill match</span>
              </div>
              <p className="mb-0.5 text-2xl font-bold text-ink">78%</p>
              <p className="text-xs text-muted">Frontend Developer</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-alt">
                <div className="bg-brand-gradient h-full w-[78%] rounded-full" />
              </div>
            </FloatingCard>

            {/* Example: what to learn */}
            <FloatingCard delay={0.8} floatDelay={1.3} className="-right-2 top-1/3 w-44 sm:right-0">
              <p className="mb-2.5 text-xs font-medium text-muted">Skills to learn next</p>
              <div className="flex flex-wrap gap-1.5">
                {['TypeScript', 'Testing', 'SQL'].map((skill) => (
                  <span key={skill} className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                    {skill}
                  </span>
                ))}
              </div>
            </FloatingCard>

            {/* Example: job near you */}
            <FloatingCard delay={1} floatDelay={1.6} className="-bottom-4 left-1/4 w-52 sm:left-1/3">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                </span>
                <span className="text-xs font-medium text-muted">Near you</span>
              </div>
              <p className="mb-0.5 text-sm font-semibold text-ink">Web Developer</p>
              <p className="text-xs font-medium text-emerald-600">Mandaue City</p>
            </FloatingCard>

            {/* Example: curriculum alignment */}
            <FloatingCard delay={1.2} floatDelay={1.9} className="bottom-1/3 -left-3 hidden w-44 sm:block">
              <div className="mb-1.5 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted">Curriculum fit</span>
              </div>
              <p className="text-sm font-semibold text-ink">Program vs market</p>
            </FloatingCard>
          </div>
        </div>
      </div>
    </section>
  )
}
