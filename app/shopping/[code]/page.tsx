import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ShoppingListApp from '@/components/shopping/ShoppingListApp'

export const dynamic = 'force-dynamic'

export default async function ShoppingListPage({ params }: { params: { code: string } }) {
  const list = await prisma.shoppingList.findUnique({
    where: { shareCode: params.code.toUpperCase() },
    include: { items: { orderBy: { createdAt: 'asc' } } },
  })

  if (!list) notFound()

  return <ShoppingListApp initialList={list} />
}
