import Image from "next/image"

type BannerStat = { value: string; label: string }

export function PageBanner({
  id,
  kicker,
  title,
  summary,
  image,
  imageAlt,
  stats,
  children,
}: {
  id: string
  kicker: string
  title: string
  summary: string
  image?: string
  imageAlt?: string
  stats?: BannerStat[]
  children?: React.ReactNode
}) {
  return (
    <header
      id={id}
      className="relative isolate scroll-mt-80 overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 py-20 text-white sm:px-8 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="charism-orb pointer-events-none absolute -bottom-40 -left-32 -z-10 size-[28rem] rounded-full bg-[#17b3c6] opacity-25 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="charism-orb pointer-events-none absolute -top-32 right-0 -z-10 size-[24rem] rounded-full bg-[#ffcf4a] opacity-10 blur-[120px] [animation-delay:-7s]"
      />
      {image ? null : (
        <svg
          aria-hidden="true"
          className="charism-cross-mark pointer-events-none absolute top-1/2 right-[8%] -z-10 hidden h-72 -translate-y-1/2 text-white/10 lg:block"
          viewBox="0 0 100 160"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path d="M50 6v148M18 46h64" strokeLinecap="round" />
        </svg>
      )}
      <div
        className={`mx-auto grid max-w-6xl items-center gap-12 lg:gap-16 ${image ? "lg:grid-cols-[1.1fr_0.9fr]" : "sm:py-6"}`}
      >
        <div className={image ? undefined : "max-w-3xl"}>
          <p
            className="history-rise flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase sm:text-sm"
            style={{ "--rise-delay": "100ms" } as React.CSSProperties}
          >
            <span aria-hidden="true" className="history-line h-px w-10 bg-[#ffcf4a]" />
            {kicker}
          </p>
          <h1
            className="history-rise mt-4 font-heading text-4xl leading-[1.1] font-semibold text-balance sm:text-6xl"
            style={{ "--rise-delay": "250ms", color: "#ffffff" } as React.CSSProperties}
          >
            {title}
          </h1>
          <p
            className="history-rise mt-6 max-w-xl text-base leading-8 text-white/85 sm:text-lg"
            style={{ "--rise-delay": "450ms" } as React.CSSProperties}
          >
            {summary}
          </p>
          {stats?.length ? (
            <dl
              className="history-rise mt-10 grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-3"
              style={{ "--rise-delay": "600ms" } as React.CSSProperties}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-sm"
                >
                  <dt className="text-[11px] font-semibold tracking-[0.18em] text-white/60 uppercase">{stat.label}</dt>
                  <dd className="mt-1 font-heading text-3xl font-semibold text-[#ffcf4a]">{stat.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {children ? (
            <div
              className="history-rise mt-10 flex flex-wrap gap-3"
              style={{ "--rise-delay": "700ms" } as React.CSSProperties}
            >
              {children}
            </div>
          ) : null}
        </div>

        {image ? (
          <div
            className="history-rise relative mx-auto w-full max-w-md"
            style={{ "--rise-delay": "350ms" } as React.CSSProperties}
          >
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#17b3c6]/40 to-[#ffcf4a]/30 blur-2xl"
            />
            <div className="charism-float relative overflow-hidden rounded-[2rem] bg-white p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/20">
              <div className="group relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <Image
                  src={image}
                  alt={imageAlt ?? ""}
                  fill
                  priority
                  sizes="(min-width: 1024px) 28rem, 90vw"
                  className="object-cover transition duration-[1200ms] ease-out group-hover:scale-105"
                />
                <span aria-hidden="true" className="history-shine pointer-events-none absolute inset-0" />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
