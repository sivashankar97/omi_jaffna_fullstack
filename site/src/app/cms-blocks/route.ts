import { blocks } from "@/content/blocks"
import { newsSections } from "@/content/news"

export const dynamic = "force-static"

/** Shape of the editable website text, used by the CMS to build its edit forms. */
export function GET() {
  return Response.json({
    blocks: Object.fromEntries(Object.entries(blocks).map(([id, { label, defaults }]) => [id, { label, defaults }])),
    newsSections: newsSections.map(({ id, title }) => ({ id, title })),
  })
}
