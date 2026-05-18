import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json([], { status: 401 })

  const q = req.nextUrl.searchParams.get("q")
  if (!q || q.length < 2) return NextResponse.json([])

  if (!PLACES_API_KEY) {
    return NextResponse.json({ error: "no_api_key" }, { status: 503 })
  }

  const type = req.nextUrl.searchParams.get("type") ?? ""
  const textQuery = type && type !== "all" ? `${q} ${type}` : q

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": PLACES_API_KEY,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.primaryType,places.rating,places.priceLevel,places.photos,places.websiteUri,places.nationalPhoneNumber,places.location",
    },
    body: JSON.stringify({ textQuery, languageCode: "es" }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("Places API error:", err)
    return NextResponse.json({ error: "api_error" }, { status: 500 })
  }

  const data = await res.json()
  const places = (data.places ?? []).map((p: any) => ({
    googlePlaceId: p.id,
    name: p.displayName?.text ?? "",
    address: p.formattedAddress ?? "",
    type: mapGoogleType(p.primaryType),
    latitude: p.location?.latitude ?? null,
    longitude: p.location?.longitude ?? null,
    photoRef: p.photos?.[0]?.name ?? null,
    websiteUrl: p.websiteUri ?? null,
    phoneNumber: p.nationalPhoneNumber ?? null,
    googleRating: p.rating ?? null,
    googlePriceLevel: p.priceLevel ?? null,
  }))

  return NextResponse.json(places)
}

function mapGoogleType(t: string | undefined): string {
  if (!t) return "other"
  if (
    t.includes("restaurant") ||
    t.includes("food") ||
    t.includes("meal") ||
    t.includes("cafe") ||
    t.includes("bar") ||
    t.includes("bakery") ||
    t.includes("pizza") ||
    t.includes("burger") ||
    t.includes("sushi")
  )
    return "restaurant"
  if (
    t.includes("hotel") ||
    t.includes("lodging") ||
    t.includes("motel") ||
    t.includes("hostel") ||
    t.includes("resort")
  )
    return "hotel"
  if (t.includes("bar") || t.includes("night_club") || t.includes("pub")) return "bar"
  if (t.includes("cafe") || t.includes("coffee")) return "cafe"
  return "other"
}
