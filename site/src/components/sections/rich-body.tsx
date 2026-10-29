import type { RichBlock } from "@/lib/cms"

/** Renders CMS body text parsed by `richText` (headings, paragraphs, labelled lists). */
export function RichBody({ blocks }: { blocks: RichBlock[] }) {
  return (
    <div className="space-y-6 text-lg leading-9 text-[#22313f]">
      {blocks.map((block, index) => {
        if (block.kind === "heading") {
          return (
            <h2
              key={index}
              className="pt-6 font-heading text-2xl leading-snug font-semibold text-[#023e8a] first:pt-0 sm:text-[1.75rem]"
            >
              {block.text}
            </h2>
          )
        }
        if (block.kind === "list") {
          const labelled = block.items.every((item) => item.label)
          return (
            <ul key={index} className={labelled ? "grid gap-3 sm:grid-cols-2" : "list-disc space-y-2 pl-6 marker:text-[#17b3c6]"}>
              {block.items.map((item, itemIndex) =>
                labelled ? (
                  <li
                    key={itemIndex}
                    className="rounded-[1.25rem] border border-[#d5e8ef] bg-[#f4fbfd] p-4 text-base leading-7 text-[#3d4b59]"
                  >
                    <span className="block font-heading text-base font-semibold text-[#0a5062]">{item.label}</span>
                    {item.text}
                  </li>
                ) : (
                  <li key={itemIndex}>
                    {item.label ? <strong className="font-semibold text-[#0a5062]">{item.label}: </strong> : null}
                    {item.text}
                  </li>
                )
              )}
            </ul>
          )
        }
        return <p key={index}>{block.text}</p>
      })}
    </div>
  )
}
