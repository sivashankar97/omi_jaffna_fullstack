import { blocks } from "@/content/blocks"
import { newsSections } from "@/content/news"

export const dynamic = "force-static"

/** Shape of the editable website text, used by the CMS to build its edit forms. */
export function GET() {
  return Response.json({
    blocks: Object.fromEntries(
      Object.entries(blocks).map(([id, block]) => [
        id,
        { label: block.label, defaults: block.defaults, labels: "labels" in block ? block.labels : undefined },
      ])
    ),
    newsSections: newsSections.map(({ id, title }) => ({ id, title })),
  })
}
