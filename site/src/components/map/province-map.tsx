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
  parish: "#e8a317",
  house: "#0b3d91",
  ministry: "#0ea5c9",
  formation: "#16325c",
}

const kindBar: Record<MapKind, string> = {
  parish: "bg-[#e8a317]",
  house: "bg-[#0b3d91]",
  ministry: "bg-[#0ea5c9]",
  formation: "bg-[#16325c]",
}

function mapsSearch(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, Sri Lanka`)}`
}

function directions(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${address}, Sri Lanka`)}`
}

type LeafletApi = {
  L: typeof import("leaflet")
  map: LeafletMap
  layer: LayerGroup
}

const glass =
  "rounded-[1.75rem] border border-white/60 bg-white/72 shadow-[0_18px_50px_-28px_rgba(2,40,80,0.45)] backdrop-blur-xl"

export function ProvinceMap({ locations: mapLocations }: { locations: MapLocation[] }) {
  const provincialHouse = mapLocations.find((place) => /provincial house/i.test(place.name)) ?? mapLocations[0]
  const [query, setQuery] = useState("")
  const [kind, setKind] = useState<(typeof filters)[number]["id"]>("all")
  const [district, setDistrict] = useState<string>("all")
  const [selectedId, setSelectedId] = useState(provincialHouse?.id ?? "")
  const [ready, setReady] = useState(false)
  const [panel, setPanel] = useState<"map" | "list">("map")
  const mapNode = useRef<HTMLDivElement>(null)
  const apiRef = useRef<LeafletApi | null>(null)
  const fittedKey = useRef("")
  const selectRef = useRef(setSelectedId)
  selectRef.current = setSelectedId

  const counts = useMemo(() => {
    const tally: Record<MapKind, number> = { parish: 0, house: 0, ministry: 0, formation: 0 }
    for (const place of mapLocations) tally[place.kind] += 1
    return tally
  }, [mapLocations])

  const districts = useMemo(() => {
    const names = [...new Set(mapLocations.map((place) => place.district).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b)
    )
    return names
  }, [mapLocations])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    return mapLocations.filter((place) => {
      if (kind !== "all" && place.kind !== kind) return false
      if (district !== "all" && place.district !== district) return false
      if (!term) return true
      return [place.name, place.district, place.address, place.purpose, place.contact, place.kind]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    })
  }, [mapLocations, query, kind, district])

  const selected = results.find((place) => place.id === selectedId) ?? results[0]
  const resultKey = results.map((place) => place.id).join("|")
  const total = mapLocations.length || 1

  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#place-/, ""))
      if (id === window.location.hash.slice(1) || !mapLocations.some((place) => place.id === id)) return
      setKind("all")
      setDistrict("all")
      setQuery("")
      setSelectedId(id)
      setPanel("map")
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
      const map = L.map(node, {
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false,
      }).setView([7.6, 80.7], 7)
      L.control.zoom({ position: "bottomright" }).addTo(map)
      // Esri World Street Map — free tiles, no API key (Carto basemaps now require one)
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        attribution:
          'Tiles &copy; <a href="https://www.esri.com/">Esri</a> · &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
      const size = active ? 20 : 14
      const marker = L.marker([place.lat, place.lng], {
        icon: L.divIcon({
          className: "omi-pin-wrap",
          html: `<span class="omi-pin${active ? " is-active" : ""}" style="--pin:${pinColor[place.kind]}"></span>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        }),
        zIndexOffset: active ? 500 : 0,
        title: place.name,
        keyboard: true,
      })
      marker.bindTooltip(place.name, { direction: "top", offset: [0, -10], className: "omi-map-tip" })
      marker.on("click", () => selectRef.current(place.id))
      marker.addTo(layer)
    })

    if (!results.length) return
    if (fittedKey.current !== resultKey) {
      const bounds = L.latLngBounds(results.map((place) => [place.lat, place.lng] as [number, number]))
      map.fitBounds(bounds.pad(0.28), { maxZoom: 11, animate: true })
      fittedKey.current = resultKey
      return
    }
    if (selected) map.panTo([selected.lat, selected.lng], { animate: true })
  }, [ready, resultKey, results, selected])

  useEffect(() => {
    if (!ready) return
    window.setTimeout(() => apiRef.current?.map.invalidateSize(), 120)
  }, [ready, panel, selectedId])

  return (
    <section
      id="mission-map"
      className="relative scroll-mt-80 overflow-hidden border-t border-white/40 text-[#0b2c5c]"
    >
      <link rel="stylesheet" href="/vendor/leaflet.css" />
      <style>{`
        .omi-pin-wrap { background: transparent; border: none; }
        .omi-pin {
          --pin: #0ea5c9;
          display: block;
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: var(--pin);
          border: 2px solid #fff;
          box-shadow: 0 0 0 6px color-mix(in srgb, var(--pin) 28%, transparent), 0 4px 12px rgba(8, 30, 70, 0.35);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .omi-pin.is-active {
          width: 20px;
          height: 20px;
          box-shadow: 0 0 0 8px color-mix(in srgb, var(--pin) 35%, transparent), 0 6px 18px rgba(8, 30, 70, 0.4);
          transform: scale(1.05);
        }
        #mission-map .leaflet-container {
          font-family: inherit;
          z-index: 0;
          background: #d7eaf5;
          border-radius: 0;
        }
        #mission-map .leaflet-control-zoom {
          border: none !important;
          box-shadow: none !important;
          margin: 0 1rem 5.5rem 0 !important;
        }
        #mission-map .leaflet-control-zoom a {
          width: 2.25rem !important;
          height: 2.25rem !important;
          line-height: 2.15rem !important;
          border: 1px solid rgba(255,255,255,0.7) !important;
          background: rgba(255,255,255,0.78) !important;
          backdrop-filter: blur(12px);
          color: #0b2c5c !important;
          border-radius: 0.85rem !important;
          margin-bottom: 0.4rem !important;
        }
        #mission-map .omi-map-tip {
          border: none;
          border-radius: 999px;
          background: rgba(255,255,255,0.92);
          color: #0b2c5c;
          font-weight: 600;
          font-size: 11px;
          padding: 0.35rem 0.7rem;
          box-shadow: 0 8px 24px rgba(8,30,70,0.18);
        }
        #mission-map .omi-map-tip::before { display: none; }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(14,165,201,0.22),transparent_45%),radial-gradient(ellipse_at_85%_80%,rgba(232,163,23,0.16),transparent_40%),linear-gradient(180deg,#e8f4fb_0%,#f4f8fc_55%,#eef3f8_100%)]"
      />

      <div className="relative mx-auto max-w-[92rem] px-3 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 px-1">
          <div>
            <p className="font-heading text-4xl font-semibold tracking-tight text-[#0b2c5c] sm:text-5xl">
              Mission map
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#3d5a7a]">
              {mapLocations.length} Oblate houses, parishes, ministries and formation centres across Sri Lanka.
            </p>
          </div>
          <a
            href={mapsSearch(provincialHouse?.address ?? "")}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#12263f] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#12263f]/20 transition hover:-translate-y-0.5"
          >
            Open Provincial House
          </a>
        </div>

        <div className="relative min-h-[36rem] overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-40px_rgba(8,30,70,0.55)] ring-1 ring-white/70 sm:min-h-[42rem]">
          {/* Map plane */}
          <div
            ref={mapNode}
            className={cn(
              "absolute inset-0 h-full w-full transition-opacity duration-300",
              panel === "list" ? "pointer-events-none opacity-40 lg:pointer-events-auto lg:opacity-100" : "opacity-100"
            )}
            role="img"
            aria-label="Sri Lanka mission map"
          />

          {/* Soft vignette so glass panels read clearly */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(232,244,251,0.55)_0%,transparent_28%,transparent_72%,rgba(232,244,251,0.5)_100%),linear-gradient(180deg,rgba(255,255,255,0.35)_0%,transparent_18%,transparent_78%,rgba(232,244,251,0.55)_100%)]"
          />

          {/* Left glass: counts */}
          <aside className={cn(glass, "absolute top-4 left-4 z-20 hidden w-[15.5rem] p-4 lg:block")}>
            <p className="text-[10px] font-bold tracking-[0.18em] text-[#5b7594] uppercase">Province presence</p>
            <p className="mt-2 font-heading text-3xl font-semibold tabular-nums text-[#0b2c5c]">
              {mapLocations.length}
            </p>
            <p className="text-xs text-[#5b7594]">places on the map</p>
            <ul className="mt-4 space-y-3">
              {(Object.keys(counts) as MapKind[]).map((key) => {
                const n = counts[key]
                const pct = Math.round((n / total) * 100)
                return (
                  <li key={key}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setKind(kind === key ? "all" : key)}
                        className="font-semibold capitalize text-[#0b2c5c] hover:underline"
                      >
                        {key}
                      </button>
                      <span className="tabular-nums text-[#5b7594]">
                        {n} · {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#d9e6f0]">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", kindBar[key])}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </aside>

          {/* Right glass: list */}
          <aside
            className={cn(
              glass,
              "absolute top-4 right-4 bottom-28 z-20 flex w-[min(100%-2rem,22rem)] flex-col overflow-hidden max-lg:left-4 max-lg:w-auto",
              panel === "map" ? "max-lg:hidden" : ""
            )}
          >
            <div className="border-b border-[#d7e4ef]/80 px-4 pt-4 pb-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold tracking-[0.18em] text-[#5b7594] uppercase">Places</p>
                <span className="rounded-full bg-[#12263f] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  {results.length}
                </span>
              </div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, district or ministry"
                aria-label="Search map locations"
                className="mt-3 h-10 w-full rounded-full border border-[#cfe0ec] bg-white/80 px-3.5 text-sm text-[#0b2c5c] outline-none placeholder:text-[#8aa0b5] focus:border-[#0ea5c9]"
              />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setKind(filter.id)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-semibold transition",
                      kind === filter.id
                        ? "bg-[#12263f] text-white"
                        : "bg-white/80 text-[#3d5a7a] ring-1 ring-[#d5e3ef] hover:bg-white"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            <ul className="flex-1 space-y-2 overflow-y-auto p-3">
              {results.length === 0 ? (
                <li className="rounded-2xl bg-white/70 px-3 py-6 text-center text-sm text-[#5b7594]">
                  No matching place
                </li>
              ) : (
                results.map((place) => {
                  const active = selected?.id === place.id
                  return (
                    <li key={place.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(place.id)
                          setPanel("map")
                        }}
                        className={cn(
                          "w-full rounded-2xl border px-3 py-3 text-left transition",
                          active
                            ? "border-[#0ea5c9]/50 bg-white shadow-md shadow-[#0ea5c9]/10"
                            : "border-transparent bg-white/55 hover:bg-white/90"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold tracking-[0.14em] text-[#5b7594] uppercase">
                            {place.kind}
                          </span>
                          <span
                            className="size-2 rounded-full"
                            style={{ background: pinColor[place.kind] }}
                            aria-hidden
                          />
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[#0b2c5c]">
                          {place.name}
                        </p>
                        <p className="mt-1 text-xs text-[#5b7594]">{place.district}</p>
                        <div className="mt-2.5 flex items-center gap-2" aria-hidden>
                          <span className="size-1.5 rounded-full bg-[#0ea5c9]" />
                          <span className="h-px flex-1 border-t border-dashed border-[#b9cddd]" />
                          <span className="size-1.5 rounded-full bg-[#e8a317]" />
                        </div>
                      </button>
                    </li>
                  )
                })
              )}
            </ul>
          </aside>

          {/* Bottom: district pills + selected detail */}
          <div className="absolute right-4 bottom-4 left-4 z-20 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className={cn(glass, "max-w-full p-2 lg:max-w-[38rem]")}>
              <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                <button
                  type="button"
                  onClick={() => setDistrict("all")}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                    district === "all" ? "bg-[#12263f] text-white" : "bg-white/80 text-[#3d5a7a]"
                  )}
                >
                  All districts
                </button>
                {districts.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setDistrict(district === name ? "all" : name)}
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                      district === name ? "bg-[#12263f] text-white" : "bg-white/80 text-[#3d5a7a]"
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {selected ? <SelectedSheet place={selected} /> : null}
          </div>

          {/* Mobile map/list toggle */}
          <div className={cn(glass, "absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 p-1 lg:hidden")}>
            {(
              [
                ["map", "Map"],
                ["list", "List"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPanel(id)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition",
                  panel === id ? "bg-[#12263f] text-white" : "text-[#3d5a7a]"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SelectedSheet({ place }: { place: MapLocation }) {
  const site = useSiteInfo()
  return (
    <article className={cn(glass, "w-full max-w-md p-4 lg:w-[22rem]")}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-bold tracking-[0.16em] text-[#5b7594] uppercase">
          {place.kind} · {place.district}
        </p>
        <span
          className="mt-0.5 size-2.5 shrink-0 rounded-full ring-4 ring-white"
          style={{ background: pinColor[place.kind] }}
          aria-hidden
        />
      </div>
      <h3 className="mt-1 font-heading text-xl font-semibold text-[#0b2c5c]">{place.name}</h3>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#3d5a7a]">{place.address}</p>
      {place.purpose ? (
        <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#0b2c5c]/80">{place.purpose}</p>
      ) : null}
      {place.phone ? (
        <a
          className="mt-2 block text-xs font-semibold text-[#0b2c5c] hover:underline"
          href={`tel:${place.phone.replace(/\s/g, "")}`}
        >
          {place.phone}
        </a>
      ) : (
        <p className="mt-2 text-xs text-[#5b7594]">
          Enquiries:{" "}
          <a className="font-semibold text-[#0b2c5c] hover:underline" href={site.contact.phoneHref}>
            {site.contact.phone}
          </a>
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={directions(place.address)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full bg-[#12263f] px-3.5 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5"
        >
          Get directions
        </a>
        <a
          href={mapsSearch(place.address)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full bg-white/90 px-3.5 py-2 text-xs font-semibold text-[#0b2c5c] ring-1 ring-[#d5e3ef] transition hover:bg-white"
        >
          Open in Maps
        </a>
      </div>
    </article>
  )
}
