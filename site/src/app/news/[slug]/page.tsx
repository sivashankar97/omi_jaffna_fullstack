import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { NewsCard } from "@/components/sections/news/news-card"
import { newsSectionTitle } from "@/content/news"
import { getNews, getNewsArticle } from "@/lib/cms"

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
  const article = await getNewsArticle(slug)
  if (!article) notFound()

  const related = (await getNews()).filter((item) => item.slug !== article.slug).slice(0, 3)
  const [lead, ...rest] = article.paragraphs

  return (
    <article className="bg-white text-[#023e8a]">
      <header className="mx-auto max-w-3xl px-4 pt-12 pb-8 sm:px-8">
        <Link href="/news" className="text-sm font-semibold tracking-wide text-[#0077b6] hover:underline">
          News
        </Link>
        <p className="mt-6 font-heading text-4xl leading-tight font-semibold text-balance text-[#023e8a] sm:text-5xl">
          {newsSectionTitle(article.section)}
        </p>
        <h1 className="mt-3 text-sm font-semibold tracking-[0.18em] text-[#0077b6] uppercase">
          {article.title}
        </h1>
        <p className="mt-4 text-sm font-semibold tracking-wide text-[#5c6b7a]">
          {article.dateLabel}
          <span aria-hidden="true"> · </span>
          {article.place}
        </p>
        {article.sample ? (
          <p className="mt-5 rounded-xl border border-[#90e0ef] bg-[#e7fbff] px-4 py-3 text-sm leading-6 text-[#0e5a6b]">
            Sample story. This text previews the news layout and is not a published Province report.
          </p>
        ) : null}
        <p className="mt-6 text-xl leading-9 font-medium text-balance">{lead}</p>
      </header>

      <figure className="mx-auto max-w-5xl px-4 sm:px-8">
        <img
          src={article.gallery[0]?.src}
          alt={article.gallery[0]?.alt}
          className="max-h-[36rem] w-full rounded-2xl object-cover"
        />
        <figcaption className="mt-3 text-sm leading-6 text-[#5c6b7a]">
          {article.gallery[0]?.caption}
        </figcaption>
      </figure>

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-12 text-lg leading-9 sm:px-8">
        {rest.map((paragraph, index) => (
          <div key={paragraph} className="space-y-8">
            <p>{paragraph}</p>
            {article.gallery[index + 1] ? (
              <figure className="-mx-0 sm:mx-0">
                <img
                  src={article.gallery[index + 1].src}
                  alt={article.gallery[index + 1].alt}
                  className="w-full rounded-2xl object-cover"
                />
                <figcaption className="mt-3 text-sm leading-6 text-[#5c6b7a]">
                  {article.gallery[index + 1].caption}
                </figcaption>
              </figure>
            ) : null}
          </div>
        ))}
        <p className="text-sm font-semibold tracking-wide text-[#0077b6]">Oblate Province of Jaffna</p>
      </div>

      <section className="border-t border-[#d5dee6] bg-[#f7fbff] px-4 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-3xl font-semibold">More from the Province</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <NewsCard key={item.slug} article={item} />
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
