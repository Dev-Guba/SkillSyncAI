/*
| Shared header for dashboard pages: soft blue-lavender band with a
| gradient icon tile, a small label, the title, a subtitle and optional
| actions (buttons) on the right.
*/
export default function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  actions = null,
  children = null,
}) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-primary/10 bg-brand-soft p-6 sm:p-7">
      {/* soft shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#A98BF2]/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-[#7FA6F5]/20 blur-3xl" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {Icon && (
            <span className="bg-brand-gradient flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/25">
              <Icon className="h-6 w-6" />
            </span>
          )}
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 max-w-2xl text-sm text-muted sm:text-base">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>

      {children && <div className="relative mt-5">{children}</div>}
    </header>
  );
}
