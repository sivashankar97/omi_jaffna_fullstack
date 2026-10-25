import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

export type WelcomeCard = {
  badge: string
  title: string
  text?: string
  image: string
  href: string
  tone?: "teal" | "gold"
}

type WelcomeSceneProps = {
  badge: string
  eyebrow?: string
  title: string
  highlight?: string
  lede: string
  cards: WelcomeCard[]
}

function TitleWithHighlight({ title, highlight }: { title: string; highlight?: string }) {
  if (!highlight) return <>{title}</>
  const needle = highlight.trim()
  const index = title.toLowerCase().indexOf(needle.toLowerCase())
  if (index < 0) return <>{title}</>
  const before = title.slice(0, index)
  const mark = title.slice(index, index + needle.length)
  const after = title.slice(index + needle.length)
  return (
    <>
      {before}
      <span className="welcome-seg-mark">{mark}</span>
      {after}
    </>
  )
}

export function WelcomeScene({ badge, eyebrow, title, highlight, lede, cards }: WelcomeSceneProps) {
  const items = cards.slice(0, 3)

  return (
    <div className="welcome-seg">
      <div className="welcome-seg-top">
        <span className="welcome-seg-badge">{badge}</span>
        {eyebrow ? <p className="welcome-seg-eyebrow">{eyebrow}</p> : null}
      </div>

      <div className="welcome-seg-grid">
        <div className="welcome-seg-copy">
          <h2 className="welcome-seg-title font-heading">
            <TitleWithHighlight title={title} highlight={highlight} />
          </h2>
          <p className="welcome-seg-lede">{lede}</p>
          <Link href={items[0]?.href ?? "/charism"} className="welcome-seg-arrow" aria-label="Explore">
            <ArrowUpRight className="size-10 stroke-[2.4]" aria-hidden />
          </Link>
        </div>

        <ul className="welcome-seg-cards">
          {items.map((card, index) => (
            <li key={card.badge + card.href} className="welcome-seg-card">
              <img src={card.image} alt="" className="welcome-seg-photo" />
              <span className="welcome-seg-shade" aria-hidden="true" />
              <span className="welcome-seg-num">{index + 1}</span>
              <p className="welcome-seg-card-title">{card.title}</p>
              <Link
                href={card.href}
                className={
                  card.tone === "gold" ? "welcome-seg-cta welcome-seg-cta-gold" : "welcome-seg-cta welcome-seg-cta-teal"
                }
              >
                <span>{card.badge}</span>
                <span className="welcome-seg-cta-icon" aria-hidden="true">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
