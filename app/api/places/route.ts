import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json([], { status: 401 })

  const type = req.nextUrl.searchParams.get("type")
  const where: any = { userId: session.user.id }
  if (type && type !== "all") where.type = type

  const places = await prisma.place.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(places)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const place = await prisma.place.create({
    data: {
      userId: session.user.id,
      googlePlaceId: body.googlePlaceId ?? null,
      name: body.name,
      address: body.address ?? null,
      type: body.type ?? "restaurant",
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
      photoRef: body.photoRef ?? null,
      websiteUrl: body.websiteUrl ?? null,
      phoneNumber: body.phoneNumber ?? null,
      googleRating: body.googleRating ?? null,
      googlePriceLevel: body.googlePriceLevel ?? null,
      visitedAt: body.visitedAt ? new Date(body.visitedAt) : null,
    },
  })
  return NextResponse.json(place)
}
