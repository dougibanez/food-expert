"use client"

import { useState, useEffect, useCallback, useRef } from "react"

type PlaceType = "all" | "restaurant" | "hotel" | "bar" | "cafe" | "other"

interface Place {
  id: string
  googlePlaceId: string | null
  name: string
  address: string | null
  type: string
  latitude: number | null
  longitude: number | null
  photoRef: string | null
  websiteUrl: string | null
  phoneNumber: string | null
  googleRating: number | null
  googlePriceLevel: number | null
  userRating: number | null
  userNotes: string | null
  visitedAt: string | null
  createdAt: string
}

interface SearchResult {
  googlePlaceId: string
  name: string
  address: string
  type: string
  latitude: number | null
  longitude: number | null
  photoRef: string | null
  websiteUrl: string | null
  phoneNumber: string | null
  googleRating: number | null
  googlePriceLevel: number | null
}

const TYPE_LABELS: Record<string, string> = {
  restaurant: "Restaurante",
  hotel: "Hotel",
  bar: "Bar",
  cafe: "Café",
  other: "Otro",
  all: "Todos",
}

const TYPE_ICONS: Record<string, string> = {
  restaurant: "🍽️",
  hotel: "🏨",
  bar: "🍸",
  cafe: "☕",
  other: "📍",
}

const TYPE_COLORS: Record<string, string> = {
  restaurant: "bg-orange-100 text-orange-700",
  hotel: "bg-blue-100 text-blue-700",
  bar: "bg-purple-100 text-purple-700",
  cafe: "bg-amber-100 text-amber-700",
  other: "bg-slate-100 text-slate-700",
}

function StarRating({
  value,
  onChange,
  size = "md",
}: {
  value: number | null
  onChange?: (v: number) => void
  size?: "sm" | "md" | "lg"
}) {
  const sizes = { sm: "w-3 h-3", md: "w-5 h-5", lg: "w-7 h-7" }
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`${sizes[size]} ${onChange ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"} flex-shrink-0`}
          disabled={!onChange}
        >
          <svg
            viewBox="0 0 24 24"
            fill={star <= (value ?? 0) ? "#f59e0b" : "none"}
            stroke={star <= (value ?? 0) ? "#f59e0b" : "#cbd5e1"}
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </button>
      ))}
    </div>
  )
}

function PriceLevel({ level }: { level: number | null }) {
  if (!level) return null
  return <span className="text-xs text-slate-500">{"$".repeat(level)}</span>
}

function PlaceCard({
  place,
  onRate,
  onDelete,
}: {
  place: Place
  onRate: (p: Place) => void
  onDelete: (id: string) => void
}) {
  const photoUrl = place.photoRef
    ? `/api/places/photo?ref=${encodeURIComponent(place.photoRef)}`
    : null
  const typeColor = TYPE_COLORS[place.type] ?? TYPE_COLORS.other
  const typeIcon = TYPE_ICONS[place.type] ?? TYPE_ICONS.other

  const visitedDate = place.visitedAt
    ? new Date(place.visitedAt).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Photo */}
      <div className="h-40 bg-slate-100 relative overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={place.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {typeIcon}
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColor}`}>
            {typeIcon} {TYPE_LABELS[place.type] ?? place.type}
          </span>
        </div>
        {!place.userRating && (
          <div className="absolute top-2 right-2 bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-full">
            Sin valorar
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-base leading-tight mb-1">
          {place.name}
        </h3>
        {place.address && (
          <p className="text-xs text-slate-500 mb-2 line-clamp-1">{place.address}</p>
        )}

        <div className="flex items-center gap-3 mb-3">
          {place.googleRating && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500">Google:</span>
              <span className="text-xs font-semibold text-amber-600">
                {place.googleRating.toFixed(1)} ★
              </span>
              <PriceLevel level={place.googlePriceLevel} />
            </div>
          )}
        </div>

        {/* User rating */}
        <div className="mb-3">
          <p className="text-xs text-slate-400 mb-1">Tu valoración</p>
          <StarRating value={place.userRating} size="sm" />
        </div>

        {place.userNotes && (
          <p className="text-xs text-slate-600 italic mb-3 line-clamp-2">
            "{place.userNotes}"
          </p>
        )}

        {visitedDate && (
          <p className="text-xs text-slate-400 mb-3">Visitado: {visitedDate}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onRate(place)}
            className="flex-1 text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl py-2 transition-colors"
          >
            {place.userRating ? "Editar valoración" : "Valorar"}
          </button>
          {place.websiteUrl && (
            <a
              href={place.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Ver web"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
          <button
            onClick={() => onDelete(place.id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            title="Eliminar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function RateModal({
  place,
  onClose,
  onSave,
}: {
  place: Place
  onClose: () => void
  onSave: (rating: number, notes: string, visitedAt: string) => void
}) {
  const [rating, setRating] = useState(place.userRating ?? 0)
  const [notes, setNotes] = useState(place.userNotes ?? "")
  const [visitedAt, setVisitedAt] = useState(
    place.visitedAt
      ? new Date(place.visitedAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{place.name}</h2>
            <p className="text-sm text-slate-500">{place.address}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400"
          >
            ✕
          </button>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">Tu valoración</label>
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de visita</label>
          <input
            type="date"
            value={visitedAt}
            onChange={(e) => setVisitedAt(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tu opinión (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="¿Qué te pareció? Escribe tus impresiones..."
            rows={3}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(rating, notes, visitedAt)}
            disabled={rating === 0}
            className="flex-1 py-3 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Guardar valoración
          </button>
        </div>
      </div>
    </div>
  )
}

function AddPlaceModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (place: Partial<Place>) => void
}) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<PlaceType>("all")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [noApiKey, setNoApiKey] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [manualName, setManualName] = useState("")
  const [manualAddress, setManualAddress] = useState("")
  const [manualType, setManualType] = useState<PlaceType>("restaurant")
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const search = useCallback(async (q: string, type: PlaceType) => {
    if (q.length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    const res = await fetch(
      `/api/places/search?q=${encodeURIComponent(q)}&type=${type}`
    )
    if (res.status === 503) {
      setNoApiKey(true)
      setLoading(false)
      return
    }
    const data = await res.json()
    setResults(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query, filter), 400)
    return () => clearTimeout(debounceRef.current)
  }, [query, filter, search])

  const handleManualAdd = () => {
    if (!manualName.trim()) return
    onAdd({
      name: manualName.trim(),
      address: manualAddress.trim() || undefined,
      type: manualType,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Añadir lugar visitado</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400"
            >
              ✕
            </button>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setManualMode(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-xl transition-colors ${
                !manualMode
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Buscar en Google Maps
            </button>
            <button
              onClick={() => setManualMode(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-xl transition-colors ${
                manualMode
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Añadir manualmente
            </button>
          </div>

          {!manualMode && (
            <>
              <div className="relative mb-3">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  autoFocus
                  type="text"
                  placeholder="Buscar restaurante, hotel..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {(["all", "restaurant", "hotel", "bar", "cafe"] as PlaceType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                      filter === t
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {TYPE_ICONS[t] ?? ""} {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {manualMode ? (
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre *
                </label>
                <input
                  autoFocus
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Nombre del lugar"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="Dirección (opcional)"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["restaurant", "hotel", "bar", "cafe", "other"] as PlaceType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setManualType(t)}
                      className={`py-2 text-sm rounded-xl transition-colors ${
                        manualType === t
                          ? "bg-blue-500 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {TYPE_ICONS[t]} {TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleManualAdd}
                disabled={!manualName.trim()}
                className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                Añadir lugar
              </button>
            </div>
          ) : noApiKey ? (
            <div className="p-6 text-center">
              <p className="text-4xl mb-3">🔑</p>
              <p className="text-sm font-medium text-slate-800 mb-1">
                Google Places API no configurada
              </p>
              <p className="text-xs text-slate-500 mb-4">
                Añade GOOGLE_PLACES_API_KEY en las variables de entorno para activar la búsqueda
                automática.
              </p>
              <button
                onClick={() => setManualMode(true)}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-xl"
              >
                Añadir manualmente
              </button>
            </div>
          ) : loading ? (
            <div className="p-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {results.map((r) => (
                <button
                  key={r.googlePlaceId}
                  onClick={() => onAdd(r)}
                  className="w-full text-left p-4 hover:bg-slate-50 transition-colors flex gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center text-xl overflow-hidden">
                    {r.photoRef ? (
                      <img
                        src={`/api/places/photo?ref=${encodeURIComponent(r.photoRef)}`}
                        alt=""
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      TYPE_ICONS[r.type] ?? "📍"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm leading-tight">{r.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{r.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-md ${
                          TYPE_COLORS[r.type] ?? TYPE_COLORS.other
                        }`}
                      >
                        {TYPE_LABELS[r.type] ?? r.type}
                      </span>
                      {r.googleRating && (
                        <span className="text-xs text-amber-600 font-medium">
                          {r.googleRating.toFixed(1)} ★
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              Sin resultados para "{query}"
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <p className="text-3xl mb-2">🗺️</p>
              <p className="text-sm">Busca un restaurante u hotel que hayas visitado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PlacesApp() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<PlaceType>("all")
  const [showAdd, setShowAdd] = useState(false)
  const [ratingPlace, setRatingPlace] = useState<Place | null>(null)
  const [sortBy, setSortBy] = useState<"date" | "name" | "rating">("date")

  const fetchPlaces = useCallback(async () => {
    setLoading(true)
    const url = filter === "all" ? "/api/places" : `/api/places?type=${filter}`
    const res = await fetch(url)
    const data = await res.json()
    setPlaces(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [filter])

  useEffect(() => {
    fetchPlaces()
  }, [fetchPlaces])

  const handleAdd = async (placeData: Partial<Place>) => {
    await fetch("/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(placeData),
    })
    setShowAdd(false)
    fetchPlaces()
  }

  const handleSaveRating = async (rating: number, notes: string, visitedAt: string) => {
    if (!ratingPlace) return
    await fetch(`/api/places/${ratingPlace.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userRating: rating, userNotes: notes, visitedAt }),
    })
    setRatingPlace(null)
    fetchPlaces()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este lugar de tu lista?")) return
    await fetch(`/api/places/${id}`, { method: "DELETE" })
    fetchPlaces()
  }

  const sorted = [...places].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name)
    if (sortBy === "rating") return (b.userRating ?? 0) - (a.userRating ?? 0)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const unrated = places.filter((p) => !p.userRating).length
  const rated = places.filter((p) => p.userRating).length

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
      {/* Stats bar */}
      {places.length > 0 && (
        <div className="flex gap-3 mb-6">
          <div className="bg-white rounded-2xl px-4 py-3 flex-1 text-center shadow-sm border border-slate-100">
            <p className="text-2xl font-bold text-slate-900">{places.length}</p>
            <p className="text-xs text-slate-500">Lugares</p>
          </div>
          <div className="bg-white rounded-2xl px-4 py-3 flex-1 text-center shadow-sm border border-slate-100">
            <p className="text-2xl font-bold text-amber-500">{rated}</p>
            <p className="text-xs text-slate-500">Valorados</p>
          </div>
          <div className="bg-white rounded-2xl px-4 py-3 flex-1 text-center shadow-sm border border-slate-100">
            <p className="text-2xl font-bold text-slate-400">{unrated}</p>
            <p className="text-xs text-slate-500">Sin valorar</p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* Type filters */}
        <div className="flex gap-1.5 overflow-x-auto flex-1">
          {(["all", "restaurant", "hotel", "bar", "cafe", "other"] as PlaceType[]).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                filter === t
                  ? "bg-blue-500 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {TYPE_ICONS[t] ?? ""} {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-600 focus:outline-none"
        >
          <option value="date">Más recientes</option>
          <option value="name">Nombre A-Z</option>
          <option value="rating">Mejor valorado</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🗺️</p>
          <p className="text-lg font-semibold text-slate-700 mb-2">
            Aún no hay lugares guardados
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Añade restaurantes y hoteles que hayas visitado para llevar el seguimiento y
            valorarlos
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-2xl hover:bg-blue-600 transition-colors shadow-sm"
          >
            Añadir primer lugar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onRate={setRatingPlace}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* FAB */}
      {sorted.length > 0 && (
        <button
          onClick={() => setShowAdd(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-2xl shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-2xl z-30"
        >
          +
        </button>
      )}

      {showAdd && (
        <AddPlaceModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      )}
      {ratingPlace && (
        <RateModal
          place={ratingPlace}
          onClose={() => setRatingPlace(null)}
          onSave={handleSaveRating}
        />
      )}
    </main>
  )
}
