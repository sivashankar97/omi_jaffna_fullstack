import { HashScroll } from "@/components/layout/hash-scroll"
import { PageMotion } from "@/components/motion/page-motion"

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <PageMotion>
      <HashScroll />
      {children}
    </PageMotion>
  )
}
