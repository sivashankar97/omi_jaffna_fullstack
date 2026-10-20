export type MapKind = "parish" | "house" | "ministry" | "formation"

export type MapLocation = {
  id: string
  name: string
  district: string
  address: string
  purpose: string
  contact?: string
  phone?: string
  email?: string
  kind: MapKind
  lat: number
  lng: number
  lastVerified: string
}
