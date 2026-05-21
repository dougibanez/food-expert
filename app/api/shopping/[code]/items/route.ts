import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const body = await req.json()
    const { name, category, quantity, unit, pricePerUnit, isCustom } = body

    const list = await prisma.shoppingList.findUnique({
      where: { shareCode: params.code.toUpperCase() },
    })
    if (!list) return NextResponse.json({ error: 'List not found' }, { status: 404 })

    const item = await prisma.shoppingListItem.create({
      data: {
        name,
        category: category || 'extras',
        quantity: quantity || 1,
        unit: unit || 'unidad',
        pricePerUnit: pricePerUnit || 0,
        isCustom: isCustom || false,
        listId: list.id,
      },
    })

    await prisma.shoppingList.update({
      where: { id: list.id },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error adding item:', error)
    return NextResponse.json({ error: 'Error adding item' }, { status: 500 })
  }
}
