import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateShareCode } from '@/lib/ingredients'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, eventType, guestCount } = body

    let shareCode = generateShareCode()
    let attempts = 0
    while (attempts < 5) {
      const existing = await prisma.shoppingList.findUnique({ where: { shareCode } })
      if (!existing) break
      shareCode = generateShareCode()
      attempts++
    }

    const list = await prisma.shoppingList.create({
      data: {
        title: title || 'Mi Lista del Evento',
        eventType: eventType || null,
        guestCount: guestCount || 10,
        shareCode,
      },
      include: { items: true },
    })

    return NextResponse.json(list)
  } catch (error) {
    console.error('Error creating shopping list:', error)
    return NextResponse.json({ error: 'Error creating list' }, { status: 500 })
  }
}
