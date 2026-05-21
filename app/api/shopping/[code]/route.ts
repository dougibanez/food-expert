import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const list = await prisma.shoppingList.findUnique({
      where: { shareCode: params.code.toUpperCase() },
      include: { items: { orderBy: { createdAt: 'asc' } } },
    })
    if (!list) return NextResponse.json({ error: 'List not found' }, { status: 404 })
    return NextResponse.json(list)
  } catch (error) {
    console.error('Error fetching list:', error)
    return NextResponse.json({ error: 'Error fetching list' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const body = await req.json()
    const { title, eventType, guestCount } = body
    const list = await prisma.shoppingList.update({
      where: { shareCode: params.code.toUpperCase() },
      data: {
        ...(title !== undefined && { title }),
        ...(eventType !== undefined && { eventType }),
        ...(guestCount !== undefined && { guestCount }),
      },
      include: { items: { orderBy: { createdAt: 'asc' } } },
    })
    return NextResponse.json(list)
  } catch (error) {
    console.error('Error updating list:', error)
    return NextResponse.json({ error: 'Error updating list' }, { status: 500 })
  }
}
