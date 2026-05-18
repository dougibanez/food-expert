import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const photoName = req.nextUrl.searchParams.get("ref")
  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!photoName || !apiKey) {
    return new NextResponse(null, { status: 404 })
  }

  try {
    const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&skipHttpRedirect=true&key=${apiKey}`
    const res = await fetch(url)
    if (!res.ok) return new NextResponse(null, { status: 404 })
    const data = await res.json()
    if (data.photoUri) {
      return NextResponse.redirect(data.photoUri)
    }
    return new NextResponse(null, { status: 404 })
  } catch {
    return new NextResponse(null, { status: 500 })
  }
}
