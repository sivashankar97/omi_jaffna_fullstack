import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CalendarDays, ChevronRight, Clock, MapPin } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { NewsCard, NewsCategory, NewsCompact, readingMinutes } from "@/components/sections/news/news-card"
import { ShareButtons } from "@/components/sections/news/share-buttons"
import { newsSectionTitle } from "@/content/news"
import { getNews, getNewsArticle, getSiteInfo } from "@/lib/cms"

type NewsPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return (await getNews()).map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getNewsArticle(slug)
  if (!article) return { title: "News" }
  return {
    title: article.title,
    description: article.description,
  }
}

export default async function NewsArticlePage({ params }: NewsPageProps) {
  const { slug } = await params
  const [article, siteInfo] = await Promise.all([getNewsArticle(slug), getSiteInfo()])
  if (!article) notFound()

  const allNews = await getNews()
  const others = allNews.filter((item) => item.slug !== article.slug)
  const sameSection = others.filter((item) => item.section === article.section)
  const related = [...sameSection, ...others.filter((item) => item.section !== article.section)].slice(0, 3)
  const latest = others.filter((item) => !related.includes(item)).slice(0, 4)
  const [lead, ...rest] = article.paragraphs
  const hero = article.gallery[0] ?? article.cover

  return (
    <article className="bg-white text-[#102a43]">
      <ScrollProgress />
      <header className="mx-auto max-w-4xl px-4 pt-10 pb-8 sm:px-8 sm:pt-14">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#6b7a88]">
          <Link href="/" className="transition hover:text-[#0a5062]">
            Home
          </Link>
          <ChevronRight aria-hidden="true" className="size-3.5" />
          <Link href="/news" className="transition hover:text-[#0a5062]">
            News
          </Link>
          <ChevronRight aria-hidden="true" className="size-3.5" />
          <Link href={`/news#${article.section}`} className="text-[#0a8ea0] transition hover:text-[#0a5062]">
            {newsSectionTitle(article.section)}
          </Link>
        </nav>

        <div className="history-rise mt-8" style={{ "--rise-delay": "80ms" } as React.CSSProperties}>
          <NewsCategory article={article} />
        </div>
        <h1
          className="history-rise mt-3 font-heading text-4xl leading-[1.12] font-semibold text-balance text-[#03202b] sm:text-5xl"
          style={{ "--rise-delay": "180ms" } as React.CSSProperties}
        >
          {article.title}
        </h1>
        <p
          className="history-rise mt-5 text-lg leading-8 text-[#3d4b59] sm:text-xl"
          style={{ "--rise-delay": "300ms" } as React.CSSProperties}
        >
          {article.description}
        </p>

        <div
          className="history-rise mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-[#e6edf2] py-4"
          style={{ "--rise-delay": "420ms" } as React.CSSProperties}
        >
          <div className="flex items-center gap-3">
            <img
              src={siteInfo.logos.emblemImage}
              alt=""
              className="size-10 rounded-full bg-white object-contain ring-1 ring-[#e1e8ee]"
            />
            <div>
              <p className="text-sm font-semibold text-[#03202b]">Oblate Province of Jaffna</p>
              <p className="flex flex-wrap gap-x-4 text-xs text-[#6b7a88]">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays aria-hidden="true" className="size-3.5" />
                  {article.dateLabel}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin aria-hidden="true" className="size-3.5" />
                  {article.place}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock aria-hidden="true" className="size-3.5" />
                  {readingMinutes(article)} min read
                </span>
              </p>
            </div>
          </div>
          <ShareButtons title={article.title} />
        </div>

        {article.sample ? (
          <p className="mt-6 rounded-xl border border-[#f3dd94] bg-[#fff9e6] px-4 py-3 text-sm leading-6 text-[#7a5800]">
            Sample story. This text previews the news layout and is not a published Province report.
          </p>
        ) : null}
      </header>

      <figure
        className="history-rise mx-auto max-w-6xl px-4 sm:px-8"
        style={{ "--rise-delay": "520ms" } as React.CSSProperties}
      >
        <div className="overflow-hidden rounded-[1.75rem]">
          <img src={hero.src} alt={hero.alt} className="max-h-[38rem] w-full object-cover" />
        </div>
        <figcaption className="mt-3 border-l-2 border-[#17b3c6] pl-3 text-sm leading-6 text-[#6b7a88]">
          {hero.caption}
        </figcaption>
      </figure>

      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-14 sm:px-8 lg:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full max-w-[42rem] space-y-7 text-lg leading-9 text-[#22313f]">
          {lead ? <p className="news-dropcap">{lead}</p> : null}
          {rest.map((paragraph, index) => (
            <div key={paragraph} className="space-y-7">
              <p>{paragraph}</p>
              {article.gallery[index + 1] ? (
                <Reveal from="up">
                  <figure>
                    <img
                      src={article.gallery[index + 1].src}
                      alt={article.gallery[index + 1].alt}
                      className="w-full rounded-2xl object-cover"
                    />
                    <figcaption className="mt-3 border-l-2 border-[#17b3c6] pl-3 text-sm leading-6 text-[#6b7a88]">
                      {article.gallery[index + 1].caption}
                    </figcaption>
                  </figure>
                </Reveal>
              ) : null}
            </div>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e6edf2] pt-6">
            <Link
              href={`/news#${article.section}`}
              className="rounded-full bg-[#eef6f8] px-3.5 py-1.5 text-xs font-semibold text-[#0a5062] transition hover:bg-[#dff1f5]"
            >
              {newsSectionTitle(article.section)}
            </Link>
            <ShareButtons title={article.title} />
          </div>
        </div>

        {latest.length ? (
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center justify-between border-b-2 border-[#03202b] pb-3">
              <h2 className="font-heading text-lg font-semibold text-[#03202b]">Latest news</h2>
              <Link href="/news" className="text-xs font-semibold text-[#0a8ea0] hover:underline">
                View all
              </Link>
            </div>
            <div className="divide-y divide-[#e6edf2]">
              {latest.map((item) => (
                <NewsCompact key={item.slug} article={item} />
              ))}
            </div>
          </aside>
        ) : null}
      </div>

      <section className="border-t border-[#e1e8ee] bg-[#f6f9fb] px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4 border-b border-[#dbe4ea] pb-3">
            <h2 className="flex items-center gap-3 font-heading text-2xl font-semibold text-[#03202b] sm:text-3xl">
              <span
                aria-hidden="true"
                className="h-7 w-1.5 rounded-full bg-gradient-to-b from-[#ffcf4a] to-[#17b3c6]"
              />
              More from the Province
            </h2>
            <Link href="/news" className="shrink-0 text-sm font-semibold text-[#0a8ea0] hover:underline">
              All news
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <Reveal key={item.slug} from="up" delay={index * 120} className="h-full">
                <NewsCard article={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
