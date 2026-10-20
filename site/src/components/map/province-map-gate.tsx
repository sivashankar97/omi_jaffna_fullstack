"use client"

import { usePathname } from "next/navigation"

import type { MapLocation } from "@/content/map-locations"

import { ProvinceMap } from "./province-map"

const mapPages = new Set(["/", "/contact"])

export function ProvinceMapGate({ locations }: { locations: MapLocation[] }) {
  const pathname = usePathname()
  if (!mapPages.has(pathname)) return null
  return <ProvinceMap locations={locations} />
}
