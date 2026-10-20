"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { LayerGroup, Map as LeafletMap } from "leaflet"

import type { MapKind, MapLocation } from "@/content/map-locations"
import { useSiteInfo } from "@/components/layout/site-info"
import { cn } from "cn"

const filters: { id: "all" | MapKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "parish", label: "Parishes" },
  { id: "house", label: "Houses" },
  { id: "ministry", label: "Ministries" },
  { id: "formation", label: "Formation" },
]

const pinColor: Record<MapKind, string> = {
  parish: "#ffbf00",
  house: "#023e8a",
  ministry: "#0096c7",
  formation: "#03045e",
}

function mapsSearch(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, Sri Lanka`)}`
}

function mapsEmbed(address: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(`${address}, Sri Lanka`)}&z=14&output=embed`
}

function directions(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${address}, Sri Lanka`)}`
}

type LeafletApi = {
  L: typeof import("leaflet")
  map: LeafletMap
  layer: LayerGroup
}

export function ProvinceMap({ locations: mapLocations }: { locations: MapLocation[] }) {
  const provincialHouse = mapLocations.find((place) => /provincial house/i.test(place.name)) ?? mapLocations[0]
  const [query, setQuery] = useState("")
  const [kind, setKind] = useState<(typeof filters)[number]["id"]>("all")
  const [selectedId, setSelectedId] = useState(provincialHouse?.id ?? "")
  const [ready, setReady] = useState(false)
  const mapNode = useRef<HTMLDivElement>(null)
  const apiRef = useRef<LeafletApi | null>(null)
  const fittedKey = useRef("")
  const selectRef = useRef(setSelectedId)
  selectRef.current = setSelectedId

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    return mapLocations.filter((place) => {
      if (kind !== "all" && place.kind !== kind) return false
      if (!term) return true
      return [place.name, place.district, place.address, place.purpose, place.contact, place.kind]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    })
  }, [mapLocations, query, kind])

  const selected = results.find((place) => place.id === selectedId) ?? results[0]
  const resultKey = results.map((place) => place.id).join("|")

  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#place-/, ""))
      if (id === window.location.hash.slice(1) || !mapLocations.some((place) => place.id === id)) return
      setKind("all")
      setQuery("")
      setSelectedId(id)
      document.getElementById("mission-map")?.scrollIntoView({ behavior: "smooth" })
    }
    const frame = window.requestAnimationFrame(openFromHash)
    window.addEventListener("hashchange", openFromHash)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("hashchange", openFromHash)
    }
  }, [mapLocations])

  useEffect(() => {
    let alive = true
    const node = mapNode.current
    if (!node) return

    ;(async () => {
      const mod = await import("leaflet")
      const L = mod.default ?? mod
      if (!alive || apiRef.current) return
      const map = L.map(node, { scrollWheelZoom: false }).setView([7.6, 80.7], 7)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)
      const layer = L.layerGroup().addTo(map)
      apiRef.current = { L, map, layer }
      window.setTimeout(() => map.invalidateSize(), 80)
      setReady(true)
    })()

    return () => {
      alive = false
      apiRef.current?.map.remove()
      apiRef.current = null
      setReady(false)
    }
  }, [])

  useEffect(() => {
    const api = apiRef.current
    if (!api || !ready) return
    const { L, map, layer } = api
    layer.clearLayers()

    results.forEach((place) => {
      const active = place.id === (selected?.id ?? "")
      const size = active ? 18 : 13
      const marker = L.marker([place.lat, place.lng], {
        icon: L.divIcon({
          className: "omi-pin-wrap",
          html: `<span class="omi-pin${active ? " is-active" : ""}" style="background:${pinColor[place.kind]}"></span>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        }),
        zIndexOffset: active ? 500 : 0,
        title: place.name,
        keyboard: true,
      })
      marker.bindTooltip(place.name, { direction: "top", offset: [0, -8] })
      marker.on("click", () => selectRef.current(place.id))
      marker.addTo(layer)
    })

    if (!results.length) return
    if (fittedKey.current !== resultKey) {
      const bounds = L.latLngBounds(results.map((place) => [place.lat, place.lng] as [number, number]))
      map.fitBounds(bounds.pad(0.25), { maxZoom: 11, animate: false })
      fittedKey.current = resultKey
      return
    }
    if (selected) map.panTo([selected.lat, selected.lng])
  }, [ready, resultKey, results, selected])

  return (
    <section id="mission-map" className="scroll-mt-80 border-t border-[#90e0ef] bg-[#f4fcfe] text-[#023e8a]">
      <link rel="stylesheet" href="/vendor/leaflet.css" />
      <style>{`
        .omi-pin-wrap { background: transparent; border: none; }
        .omi-pin {
          display: block;
          width: 13px;
          height: 13px;
          border-radius: 999px;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(3, 4, 94, 0.45);
        }
        .omi-pin.is-active {
          width: 18px;
          height: 18px;
          box-shadow: 0 0 0 3px #ffbf00, 0 1px 4px rgba(3, 4, 94, 0.45);
        }
        #mission-map .leaflet-container { font-family: inherit; z-index: 0; background: #dff6fb; }
      `}</style>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-heading text-4xl font-semibold text-[#023e8a] sm:text-5xl">Mission map</p>
            <h2 className="mt-2 text-sm font-semibold tracking-[0.18em] text-[#0077b6] uppercase">
              Houses and parishes across Sri Lanka
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70">
              {mapLocations.length} houses, parishes and ministries. Choose a pin for the public contact and Google Maps directions.
            </p>
          </div>
          <a
            href={mapsSearch(provincialHouse?.address ?? "")}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border-2 border-[#023e8a] bg-white px-4 py-2 text-sm font-semibold text-[#023e8a] transition hover:bg-[#e7fbff]"
          >
            Open Provincial House in Google Maps
          </a>
        </div>

        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Oblate, parish, house, ministry or place"
            aria-label="Search map locations"
            className="h-11 w-full rounded-full border border-[#90e0ef] bg-white px-4 text-sm text-black outline-none focus:border-[#0077b6] lg:max-w-md"
          />
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setKind(filter.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-semibold transition",
                  kind === filter.id
                    ? "border-2 border-[#023e8a] bg-[#e7fbff] text-[#023e8a]"
                    : "border-2 border-[#90e0ef] bg-white text-[#023e8a]"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[20rem_1fr]">
          <ul className="order-2 flex max-h-[34rem] flex-col gap-2 overflow-y-auto p-1 lg:order-1">
            {results.length === 0 ? (
              <li className="flex h-[4.75rem] items-center rounded-2xl border-2 border-[#d5dee6] bg-white px-3 text-sm text-black/70">
                No matching place
              </li>
            ) : (
              results.map((place) => (
                <li key={place.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedId(place.id)}
                    className={cn(
                      "flex h-[4.75rem] w-full flex-col justify-center rounded-2xl border-2 border-[#d5dee6] bg-white px-3 text-left transition hover:border-[#90e0ef]",
                      selected?.id === place.id && "border-[#0077b6] bg-[#f4fcfe]"
                    )}
                  >
                    <span className="text-[10px] font-semibold tracking-[0.16em] text-[#0077b6] uppercase">
                      {place.kind} · {place.district}
                    </span>
                    <span className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[#023e8a]">
                      {place.name}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="order-1 grid gap-4 lg:order-2">
            <div className="overflow-hidden rounded-3xl shadow-sm ring-1 ring-[#90e0ef]">
              <div ref={mapNode} className="h-[22rem] w-full sm:h-[28rem]" role="img" aria-label="Sri Lanka mission map" />
            </div>
            {selected ? <PlaceCard place={selected} /> : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function PlaceCard({ place }: { place: MapLocation }) {
  const site = useSiteInfo()
  return (
    <article className="grid overflow-hidden rounded-3xl bg-white shadow-md lg:grid-cols-[1fr_1.2fr]">
      <div className="p-5">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[#0077b6] uppercase">
          {place.kind} · {place.district}
        </p>
        <h3 className="mt-2 font-heading text-2xl font-semibold text-[#023e8a]">{place.name}</h3>
        <p className="mt-2 text-sm leading-6 text-black/80">{place.address}</p>
        <p className="mt-3 text-sm text-black">{place.purpose}</p>
        {place.contact ? <p className="mt-2 text-sm font-medium">{place.contact}</p> : null}
        {place.phone ? (
          <a className="mt-2 block text-sm font-semibold hover:underline" href={`tel:${place.phone.replace(/\s/g, "")}`}>
            {place.phone}
          </a>
        ) : (
          <p className="mt-2 text-sm text-black/70">
            Public enquiries:{" "}
            <a className="font-semibold hover:underline" href={site.contact.phoneHref}>
              {site.contact.phone}
            </a>
          </p>
        )}
        {place.email ? (
          <a className="mt-1 block text-sm hover:underline" href={`mailto:${place.email}`}>
            {place.email}
          </a>
        ) : null}
        <p className="mt-3 text-xs text-black/50">Last verified: {place.lastVerified}</p>
        <a
          href={directions(place.address)}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block rounded-full border-2 border-[#023e8a] bg-white px-4 py-2 text-sm font-semibold text-[#023e8a] hover:bg-[#e7fbff]"
        >
          Get Directions
        </a>
      </div>
      <iframe
        title={`Google Map of ${place.name}`}
        src={mapsEmbed(place.address)}
        className="h-72 w-full border-0 lg:h-full lg:min-h-80"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </article>
  )
}
