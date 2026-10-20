import { Reveal } from "@/components/motion/reveal"
import type { Publication } from "@/lib/cms"

const tones = [
  "bg-gradient-to-br from-[#0f9fb4] via-[#17b3c6] to-[#0e98ac] text-white",
  "bg-[#f7fbff] text-[#023e8a] ring-1 ring-[#cfe9ef]",
]

export function MediaPublications({ publications }: { publications: Publication[] }) {
  return (
    <section id="publications" className="scroll-mt-80 bg-white px-4 py-20 text-[#023e8a] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal from="up">
          <p className="text-sm font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">Read</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">Publications of the Province</h2>
          <p className="mt-3 max-w-2xl leading-7 text-[#3d4b59]">
            Covers, editions and downloads will be added as each issue is approved for the website.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {publications.map((item, index) => (
            <Reveal key={item.id} from={index === 0 ? "left" : "right"} delay={index * 120} className="h-full">
              <article
                id={item.id}
                className={`flex h-full min-h-[18rem] scroll-mt-80 flex-col justify-end rounded-[2rem] p-8 shadow-sm ${tones[index % tones.length]}`}
              >
                <p className="text-xs tracking-[0.24em] uppercase opacity-80">{item.subtitle}</p>
                <h3 className="mt-3 font-heading text-5xl">{item.title}</h3>
                <p className="mt-4 max-w-sm leading-7 opacity-90">{item.text}</p>
                {item.href ? (
                  <a href={item.href} className="mt-5 inline-block self-start border-b-2 border-current pb-0.5 text-sm font-semibold">
                    Read the latest issue
                  </a>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
