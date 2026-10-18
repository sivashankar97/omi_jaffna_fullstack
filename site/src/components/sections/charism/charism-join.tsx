const tones = {
  hero: "charism-join-hero",
  ways: "charism-join-ways",
  vow: "charism-join-vow",
} as const

export function CharismJoin({ tone }: { tone: keyof typeof tones }) {
  return (
    <div className={`charism-join ${tones[tone]}`} aria-hidden="true">
      <div className="charism-join-track">
        <span className="charism-join-left" />
        <span className="charism-join-right" />
        <span className="charism-join-bead" />
      </div>
    </div>
  )
}
