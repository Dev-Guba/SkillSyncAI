import { motion } from 'framer-motion'
import {
  BookOpen,
  Radar,
  TrendingUp,
  MapPin,
  Smile,
  MailCheck,
  Gauge,
  ShieldCheck,
} from 'lucide-react'

// Recent additions to SkillSyncAI
const updates = [
  {
    icon: BookOpen,
    tag: 'New',
    title: 'Curriculum alignment',
    text: "See how your program's skills compare with what Cebu employers ask for, with an alignment % and a TF-IDF cosine score.",
  },
  {
    icon: Radar,
    tag: 'New',
    title: 'Emerging skills from job postings',
    text: 'New skills found in real Cebu postings (like AI and QA) are reviewed by admins and added to the catalog.',
  },
  {
    icon: TrendingUp,
    tag: 'Improved',
    title: 'Fairer skill forecasts',
    text: "Forecasts now use each skill's share of job postings over time, so trends aren't skewed by how many jobs were collected.",
  },
  {
    icon: MapPin,
    tag: 'New',
    title: 'Jobs near you',
    text: 'Pick your Cebu city or town (or use your current location) and see jobs there first.',
  },
  {
    icon: Smile,
    tag: 'New',
    title: 'Profile photos & characters',
    text: "Add a photo, or choose a cartoon character if you'd rather not use your own picture.",
  },
  {
    icon: MailCheck,
    tag: 'New',
    title: 'Email verification',
    text: 'Your email is confirmed with a 6-digit code, so password reset codes always reach you.',
  },
  {
    icon: Gauge,
    tag: 'Improved',
    title: 'Faster learning plans',
    text: "Quick learning links show right away while the AI prepares your detailed plan.",
  },
  {
    icon: ShieldCheck,
    tag: 'Improved',
    title: 'Safer accounts',
    text: 'Protection against password guessing, plus admin tools to manage and deactivate accounts.',
  },
]

export default function WhatsNew() {
  return (
    <section id="whats-new" className="relative overflow-hidden py-20 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-10 -z-10 h-96 w-96 rounded-full bg-[#A98BF2]/15 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">What&apos;s new</span>
          <h2 className="mb-4 mt-3 text-balance text-3xl font-bold text-ink lg:text-4xl">
            Recently added to SkillSyncAI
          </h2>
          <p className="text-lg text-muted">
            New tools for students, and smarter analysis behind the scenes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {updates.map(({ icon: Icon, tag, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
              className="rounded-3xl border border-border bg-surface p-6 shadow-soft transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    tag === 'New'
                      ? 'bg-brand-gradient text-white'
                      : 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'
                  }`}
                >
                  {tag}
                </span>
              </div>
              <h3 className="mb-2 text-base font-semibold text-ink">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
