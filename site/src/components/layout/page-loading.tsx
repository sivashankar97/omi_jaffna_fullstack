/** Instant feedback while a route’s server data loads (nav clicks). */
export function PageLoading() {
  return (
    <div className="bg-[var(--bg,#F8FBFF)]" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <div className="relative isolate min-h-[14rem] overflow-hidden bg-[#03202b] sm:min-h-[16rem]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#17b3c6]/35 via-transparent to-[#03202b]"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-end gap-3 px-4 py-10 sm:px-8 sm:py-14">
          <div className="h-3 w-28 animate-pulse rounded bg-white/25" />
          <div className="h-8 w-2/3 max-w-md animate-pulse rounded bg-white/35 sm:h-10" />
          <div className="h-4 w-1/2 max-w-sm animate-pulse rounded bg-white/20" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-10 sm:px-8 sm:py-14">
        <div className="h-4 w-40 animate-pulse rounded bg-[#17b3c6]/20" />
        <div className="h-3 w-full max-w-2xl animate-pulse rounded bg-[#2B3A42]/10" />
        <div className="h-3 w-full max-w-xl animate-pulse rounded bg-[#2B3A42]/10" />
        <div className="h-3 w-3/4 max-w-lg animate-pulse rounded bg-[#2B3A42]/10" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="h-36 animate-pulse rounded-lg bg-[#17b3c6]/10" />
          <div className="h-36 animate-pulse rounded-lg bg-[#17b3c6]/10" />
        </div>
      </div>
    </div>
  )
}
