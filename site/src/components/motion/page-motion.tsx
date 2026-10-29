/** Page wrapper. Entrance motion lives in the sections (MotionReveal / Reveal), never on every text node. */
export function PageMotion({ children }: { children: React.ReactNode }) {
  return <div className="page-stage relative">{children}</div>
}
