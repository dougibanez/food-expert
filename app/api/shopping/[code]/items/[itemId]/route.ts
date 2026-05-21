import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { code: string; itemId: string } }) {
  try {
    const body = await req.json()
    const { quantity, pricePerUnit, checked, name, unit } = body
    const item = await prisma.shoppingListItem.update({
      where: { id: params.itemId },
      data: {
        ...(quantity !== undefined && { quantity }),
        ...(pricePerUnit !== undefined && { pricePerUnit }),
        ...(checked !== undefined && { checked }),
        ...(name !== undefined && { name }),
        ...(unit !== undefined && { unit }),
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating item:', error)
    return NextResponse.json({ error: 'Error updating item' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { code: string; itemId: string } }) {
  try {
    await prisma.shoppingListItem.delete({ where: { id: params.itemId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json({ error: 'Error deleting item' }, { status: 500 })
  }
}
