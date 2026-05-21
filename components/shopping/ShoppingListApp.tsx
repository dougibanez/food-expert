'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { CATEGORIES, searchIngredients, type Ingredient, type SearchResult } from '@/lib/ingredients'

interface ListItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  pricePerUnit: number
  checked: boolean
  isCustom: boolean
}

interface ShoppingList {
  id: string
  title: string
  eventType: string | null
  shareCode: string
  guestCount: number
  items: ListItem[]
}

const COLOR_MAP: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  green: 'bg-green-100 text-green-700 border-green-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  lime: 'bg-lime-100 text-lime-700 border-lime-200',
  pink: 'bg-pink-100 text-pink-700 border-pink-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
}

const BADGE_COLOR: Record<string, string> = {
  amber: 'bg-amber-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  lime: 'bg-lime-500',
  pink: 'bg-pink-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  slate: 'bg-slate-500',
}

export default function ShoppingListApp({ initialList }: { initialList: ShoppingList }) {
  const [list, setList] = useState<ShoppingList>(initialList)
  const [activeCategory, setActiveCategory] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showShareModal, setShowShareModal] = useState(false)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [mobileTab, setMobileTab] = useState<'catalog' | 'list'>('catalog')
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(list.title)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [addingItemId, setAddingItemId] = useState<string | null>(null)
  const [customItem, setCustomItem] = useState({
    name: '',
    category: 'extras',
    quantity: 1,
    unit: 'unidad',
    pricePerUnit: 0,
  })

  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingTitle && titleRef.current) titleRef.current.focus()
  }, [editingTitle])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    setSearchResults(searchIngredients(searchQuery))
  }, [searchQuery])

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/shopping/${list.shareCode}`
    : `/shopping/${list.shareCode}`

  const totalCost = list.items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0)
  const checkedCount = list.items.filter((i) => i.checked).length
  const itemsInCategory = (catId: string) =>
    list.items.filter((i) => i.category === catId).length

  const updateGuestCount = useCallback(async (count: number) => {
    setList((prev) => ({ ...prev, guestCount: count }))
    await fetch(`/api/shopping/${list.shareCode}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestCount: count }),
    })
  }, [list.shareCode])

  const saveTitle = useCallback(async () => {
    setEditingTitle(false)
    if (titleDraft === list.title) return
    setList((prev) => ({ ...prev, title: titleDraft }))
    await fetch(`/api/shopping/${list.shareCode}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titleDraft }),
    })
  }, [list.shareCode, list.title, titleDraft])

  const addIngredient = useCallback(async (ingredient: Ingredient & { categoryId?: string; categoryName?: string }) => {
    const alreadyIn = list.items.find((i) => i.name === ingredient.name)
    if (alreadyIn) {
      const newQty = alreadyIn.quantity + 1
      setList((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.id === alreadyIn.id ? { ...i, quantity: newQty } : i
        ),
      }))
      await fetch(`/api/shopping/${list.shareCode}/items/${alreadyIn.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }),
      })
      return
    }

    const suggestedQty = ingredient.perPerson
      ? Math.max(1, Math.ceil(ingredient.perPerson * list.guestCount * 10) / 10)
      : 1

    const tempId = `temp-${Date.now()}`
    const tempItem: ListItem = {
      id: tempId,
      name: ingredient.name,
      category: ingredient.categoryId || 'extras',
      quantity: suggestedQty,
      unit: ingredient.unit,
      pricePerUnit: ingredient.pricePerUnit,
      checked: false,
      isCustom: false,
    }

    setAddingItemId(ingredient.id)
    setList((prev) => ({ ...prev, items: [...prev.items, tempItem] }))
    setMobileTab('list')

    try {
      const res = await fetch(`/api/shopping/${list.shareCode}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ingredient.name,
          category: ingredient.categoryId || 'extras',
          quantity: suggestedQty,
          unit: ingredient.unit,
          pricePerUnit: ingredient.pricePerUnit,
          isCustom: false,
        }),
      })
      const saved = await res.json()
      setList((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.id === tempId ? { ...saved } : i)),
      }))
    } catch {
      setList((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== tempId) }))
    } finally {
      setAddingItemId(null)
    }
  }, [list.items, list.guestCount, list.shareCode])

  const addCustomItem = useCallback(async () => {
    if (!customItem.name.trim()) return

    const tempId = `temp-${Date.now()}`
    const tempItem: ListItem = {
      id: tempId,
      name: customItem.name.trim(),
      category: customItem.category,
      quantity: customItem.quantity,
      unit: customItem.unit,
      pricePerUnit: customItem.pricePerUnit,
      checked: false,
      isCustom: true,
    }

    setList((prev) => ({ ...prev, items: [...prev.items, tempItem] }))
    setShowCustomForm(false)
    setCustomItem({ name: '', category: 'extras', quantity: 1, unit: 'unidad', pricePerUnit: 0 })
    setMobileTab('list')

    try {
      const res = await fetch(`/api/shopping/${list.shareCode}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tempItem, id: undefined }),
      })
      const saved = await res.json()
      setList((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.id === tempId ? { ...saved } : i)),
      }))
    } catch {
      setList((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== tempId) }))
    }
  }, [customItem, list.shareCode])

  const updateItemQty = useCallback(async (itemId: string, quantity: number) => {
    if (quantity <= 0) return removeItem(itemId)
    setList((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
    }))
    await fetch(`/api/shopping/${list.shareCode}/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    })
  }, [list.shareCode])

  const updateItemPrice = useCallback(async (itemId: string, pricePerUnit: number) => {
    setList((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === itemId ? { ...i, pricePerUnit } : i)),
    }))
    await fetch(`/api/shopping/${list.shareCode}/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pricePerUnit }),
    })
  }, [list.shareCode])

  const toggleCheck = useCallback(async (itemId: string) => {
    const item = list.items.find((i) => i.id === itemId)
    if (!item) return
    const checked = !item.checked
    setList((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === itemId ? { ...i, checked } : i)),
    }))
    await fetch(`/api/shopping/${list.shareCode}/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checked }),
    })
  }, [list.items, list.shareCode])

  const removeItem = useCallback(async (itemId: string) => {
    setList((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== itemId) }))
    await fetch(`/api/shopping/${list.shareCode}/items/${itemId}`, { method: 'DELETE' })
  }, [list.shareCode])

  const copyToClipboard = useCallback((text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text)
    if (type === 'link') { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000) }
    else { setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000) }
  }, [])

  const displayedIngredients = activeCategory === 'todos'
    ? []
    : CATEGORIES.find((c) => c.id === activeCategory)?.ingredients ?? []

  const activeCategoryData = CATEGORIES.find((c) => c.id === activeCategory)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/shopping" className="text-slate-400 hover:text-slate-600 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {editingTitle ? (
            <input
              ref={titleRef}
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => { if (e.key === 'Enter') saveTitle() }}
              className="flex-1 font-bold text-slate-900 text-lg border-b-2 border-emerald-400 outline-none bg-transparent"
              maxLength={80}
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              className="flex-1 text-left font-bold text-slate-900 text-lg hover:text-emerald-600 truncate"
            >
              {list.title}
            </button>
          )}

          {/* Guest count */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl px-2 py-1 flex-shrink-0">
            <button onClick={() => updateGuestCount(Math.max(1, list.guestCount - 1))} className="w-6 h-6 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">−</button>
            <span className="text-sm font-semibold text-slate-700 px-1 min-w-[2rem] text-center">{list.guestCount}</span>
            <button onClick={() => updateGuestCount(list.guestCount + 1)} className="w-6 h-6 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">+</button>
            <span className="text-xs text-slate-400 ml-1 hidden sm:inline">personas</span>
          </div>

          {/* Share button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="hidden sm:inline">Compartir</span>
          </button>
        </div>
      </header>

      {/* Mobile tab bar */}
      <div className="lg:hidden bg-white border-b border-slate-200 flex">
        <button
          onClick={() => setMobileTab('catalog')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${mobileTab === 'catalog' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-slate-500'}`}
        >
          Catálogo
        </button>
        <button
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${mobileTab === 'list' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-slate-500'}`}
        >
          Mi Lista
          {list.items.length > 0 && (
            <span className="absolute top-2 right-8 w-5 h-5 bg-emerald-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
              {list.items.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full flex lg:flex-row flex-col">
        {/* LEFT: Catalog */}
        <div className={`lg:w-[55%] xl:w-[58%] lg:border-r border-slate-200 flex flex-col ${mobileTab === 'list' ? 'hidden lg:flex' : 'flex'}`}>

          {/* Search bar */}
          <div className="p-4 bg-white border-b border-slate-100 sticky top-[57px] lg:top-[73px] z-30">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar ingredientes..."
                className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          {!searchQuery && (
            <div className="bg-white border-b border-slate-100 px-4 py-2 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 w-max">
                {CATEGORIES.map((cat) => {
                  const inList = itemsInCategory(cat.id)
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap relative ${
                        activeCategory === cat.id
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-200'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                      {inList > 0 && (
                        <span className={`w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center ${activeCategory === cat.id ? 'bg-white/30' : 'bg-emerald-500'}`}>
                          {inList}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Search results */}
          {searchQuery && (
            <div className="flex-1 overflow-y-auto p-4">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((ingredient) => (
                    <IngredientRow
                      key={ingredient.id}
                      ingredient={ingredient}
                      categoryName={ingredient.categoryName}
                      categoryEmoji={ingredient.categoryEmoji}
                      inList={!!list.items.find((i) => i.name === ingredient.name)}
                      adding={addingItemId === ingredient.id}
                      guestCount={list.guestCount}
                      onAdd={() => addIngredient(ingredient)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">🔍</div>
                  <p className="text-slate-600 font-semibold mb-1">No encontrado: "{searchQuery}"</p>
                  <p className="text-slate-400 text-sm mb-4">¿Quieres agregarlo como ítem personalizado?</p>
                  <button
                    onClick={() => {
                      setCustomItem((prev) => ({ ...prev, name: searchQuery }))
                      setSearchQuery('')
                      setShowCustomForm(true)
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
                  >
                    + Agregar "{searchQuery}"
                  </button>
                </div>
              )}
              <div className="pt-4 border-t border-slate-200 mt-4">
                <button
                  onClick={() => {
                    setCustomItem((prev) => ({ ...prev, name: searchQuery }))
                    setSearchQuery('')
                    setShowCustomForm(true)
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar ítem personalizado
                </button>
              </div>
            </div>
          )}

          {/* Category grid */}
          {!searchQuery && activeCategory === 'todos' && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-center py-10 text-slate-400">
                <div className="text-4xl mb-3">👆</div>
                <p className="font-medium">Selecciona una categoría</p>
                <p className="text-sm">o busca un ingrediente arriba</p>
              </div>
              <button
                onClick={() => setShowCustomForm(true)}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar ítem personalizado
              </button>
            </div>
          )}

          {!searchQuery && activeCategory !== 'todos' && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {displayedIngredients.map((ingredient) => (
                  <IngredientRow
                    key={ingredient.id}
                    ingredient={ingredient}
                    categoryName={activeCategoryData?.name || ''}
                    categoryEmoji={activeCategoryData?.emoji || ''}
                    inList={!!list.items.find((i) => i.name === ingredient.name)}
                    adding={addingItemId === ingredient.id}
                    guestCount={list.guestCount}
                    onAdd={() => addIngredient({ ...ingredient, categoryId: activeCategory })}
                  />
                ))}
                <button
                  onClick={() => setShowCustomForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors text-sm font-medium mt-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar ítem personalizado
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Shopping list */}
        <div className={`lg:flex-1 flex flex-col ${mobileTab === 'catalog' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-4 bg-white border-b border-slate-200 sticky top-[57px] lg:top-[73px] z-30">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-base">
                  {list.items.length === 0 ? 'Tu lista está vacía' : `${list.items.length} ítems`}
                  {checkedCount > 0 && (
                    <span className="ml-2 text-sm text-emerald-600 font-normal">({checkedCount} comprado{checkedCount !== 1 ? 's' : ''})</span>
                  )}
                </h2>
                <p className="text-2xl font-bold text-emerald-600 leading-tight">
                  ${totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-sm font-normal text-slate-400 ml-1">estimado</span>
                </p>
              </div>
              {list.items.length > 0 && (
                <div className="text-right">
                  <p className="text-xs text-slate-400">{list.guestCount} personas</p>
                  <p className="text-sm font-semibold text-slate-600">
                    ${(totalCost / list.guestCount).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/persona
                  </p>
                </div>
              )}
            </div>

            {list.items.length > 0 && (
              <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all"
                  style={{ width: `${(checkedCount / list.items.length) * 100}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {list.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <div className="text-5xl mb-4">🛒</div>
                <p className="font-semibold text-slate-600 mb-1">Agrega ingredientes desde el catálogo</p>
                <p className="text-sm text-slate-400">O usa la búsqueda para encontrar lo que necesitas</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {CATEGORIES.map((cat) => {
                  const catItems = list.items.filter((i) => i.category === cat.id)
                  if (catItems.length === 0) return null
                  return (
                    <div key={cat.id}>
                      <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${COLOR_MAP[cat.color] || COLOR_MAP.slate}`}>
                        <span>{cat.emoji}</span>
                        <span>{cat.name}</span>
                      </div>
                      {catItems.map((item) => (
                        <ListItemRow
                          key={item.id}
                          item={item}
                          onToggleCheck={() => toggleCheck(item.id)}
                          onUpdateQty={(q) => updateItemQty(item.id, q)}
                          onUpdatePrice={(p) => updateItemPrice(item.id, p)}
                          onRemove={() => removeItem(item.id)}
                        />
                      ))}
                    </div>
                  )
                })}
                {/* Custom items without category match */}
                {(() => {
                  const catIds = CATEGORIES.map(c => c.id)
                  const orphans = list.items.filter((i) => !catIds.includes(i.category))
                  if (orphans.length === 0) return null
                  return (
                    <div>
                      <div className="px-4 py-2 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 bg-slate-100 text-slate-600">
                        <span>📦</span><span>Personalizados</span>
                      </div>
                      {orphans.map((item) => (
                        <ListItemRow
                          key={item.id}
                          item={item}
                          onToggleCheck={() => toggleCheck(item.id)}
                          onUpdateQty={(q) => updateItemQty(item.id, q)}
                          onUpdatePrice={(p) => updateItemPrice(item.id, p)}
                          onRemove={() => removeItem(item.id)}
                        />
                      ))}
                    </div>
                  )
                })()}
              </div>
            )}
          </div>

          {/* Bottom total bar (mobile) */}
          {list.items.length > 0 && (
            <div className="lg:hidden bg-white border-t border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Total estimado</p>
                  <p className="text-xl font-bold text-emerald-600">${totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                </div>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Compartir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <Modal onClose={() => setShowShareModal(false)}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Compartir Lista</h3>
            <p className="text-slate-500 text-sm mt-1">Cualquiera con el link o código puede ver y editar esta lista</p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Código de acceso</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-100 rounded-xl px-4 py-3 font-mono font-bold text-2xl text-slate-900 tracking-widest text-center">
                  {list.shareCode}
                </div>
                <button
                  onClick={() => copyToClipboard(list.shareCode, 'code')}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${copiedCode ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                >
                  {copiedCode ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Link directo</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-100 rounded-xl px-4 py-3 text-sm text-slate-600 truncate font-mono">
                  {shareUrl}
                </div>
                <button
                  onClick={() => copyToClipboard(shareUrl, 'link')}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${copiedLink ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                >
                  {copiedLink ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`🛒 Te comparto mi lista de compras para el evento: ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.531 5.845L.057 23.454a.5.5 0 00.489.546l5.788-1.516A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.663-.524-5.178-1.434l-.372-.222-3.858 1.012 1.029-3.757-.242-.387A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                WhatsApp
              </a>
              <button
                onClick={() => copyToClipboard(shareUrl, 'link')}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Copiar link
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Custom item modal */}
      {showCustomForm && (
        <Modal onClose={() => setShowCustomForm(false)}>
          <h3 className="text-xl font-bold text-slate-900 mb-5">Agregar ítem personalizado</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre del ítem</label>
              <input
                type="text"
                value={customItem.name}
                onChange={(e) => setCustomItem((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ej: Piñata, Globos, Velas..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cantidad</label>
                <input
                  type="number"
                  value={customItem.quantity}
                  onChange={(e) => setCustomItem((p) => ({ ...p, quantity: parseFloat(e.target.value) || 1 }))}
                  min="0.1"
                  step="0.5"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Unidad</label>
                <input
                  type="text"
                  value={customItem.unit}
                  onChange={(e) => setCustomItem((p) => ({ ...p, unit: e.target.value }))}
                  placeholder="kg, litro, pieza..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Precio estimado por unidad ($)</label>
              <input
                type="number"
                value={customItem.pricePerUnit}
                onChange={(e) => setCustomItem((p) => ({ ...p, pricePerUnit: parseFloat(e.target.value) || 0 }))}
                min="0"
                step="5"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Categoría</label>
              <select
                value={customItem.category}
                onChange={(e) => setCustomItem((p) => ({ ...p, category: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowCustomForm(false)}
                className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-semibold text-sm hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={addCustomItem}
                disabled={!customItem.name.trim()}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm"
              >
                Agregar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// Ingredient row component
function IngredientRow({
  ingredient,
  categoryName,
  categoryEmoji,
  inList,
  adding,
  guestCount,
  onAdd,
}: {
  ingredient: Ingredient
  categoryName: string
  categoryEmoji: string
  inList: boolean
  adding: boolean
  guestCount: number
  onAdd: () => void
}) {
  const suggested = ingredient.perPerson
    ? Math.ceil(ingredient.perPerson * guestCount * 10) / 10
    : null

  return (
    <div className={`flex items-center gap-3 bg-white rounded-xl border p-3 transition-all ${inList ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-800 text-sm truncate">{ingredient.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-400">{ingredient.unit}</span>
          {suggested && (
            <span className="text-xs text-emerald-600 font-medium">~{suggested} para {guestCount} pers.</span>
          )}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-slate-700">${ingredient.pricePerUnit}</p>
        <p className="text-xs text-slate-400">/{ingredient.unit.split(' ')[0]}</p>
      </div>
      <button
        onClick={onAdd}
        disabled={adding}
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
          inList
            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
            : 'bg-slate-100 text-slate-500 hover:bg-emerald-500 hover:text-white'
        }`}
      >
        {adding ? (
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : inList ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
      </button>
    </div>
  )
}

// List item row component
function ListItemRow({
  item,
  onToggleCheck,
  onUpdateQty,
  onUpdatePrice,
  onRemove,
}: {
  item: ListItem
  onToggleCheck: () => void
  onUpdateQty: (q: number) => void
  onUpdatePrice: (p: number) => void
  onRemove: () => void
}) {
  const [editingPrice, setEditingPrice] = useState(false)
  const [priceDraft, setPriceDraft] = useState(String(item.pricePerUnit))

  const total = item.quantity * item.pricePerUnit

  return (
    <div className={`flex items-center gap-3 px-4 py-3 border-b border-slate-50 transition-opacity ${item.checked ? 'opacity-50' : ''}`}>
      <button
        onClick={onToggleCheck}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-emerald-400'}`}
      >
        {item.checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium text-slate-800 truncate ${item.checked ? 'line-through text-slate-400' : ''}`}>
          {item.name}
          {item.isCustom && <span className="ml-1 text-xs text-slate-400 font-normal">(personalizado)</span>}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {/* Quantity controls */}
          <div className="flex items-center gap-1">
            <button onClick={() => onUpdateQty(Math.max(0.5, item.quantity - 0.5))} className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs text-slate-600 font-bold">−</button>
            <span className="text-xs font-semibold text-slate-700 min-w-[2.5rem] text-center">
              {item.quantity % 1 === 0 ? item.quantity : item.quantity.toFixed(1)} {item.unit.split(' ')[0]}
            </span>
            <button onClick={() => onUpdateQty(item.quantity + 0.5)} className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs text-slate-600 font-bold">+</button>
          </div>
          <span className="text-slate-300">×</span>
          {/* Price edit */}
          {editingPrice ? (
            <input
              type="number"
              value={priceDraft}
              onChange={(e) => setPriceDraft(e.target.value)}
              onBlur={() => { setEditingPrice(false); onUpdatePrice(parseFloat(priceDraft) || 0) }}
              onKeyDown={(e) => { if (e.key === 'Enter') { setEditingPrice(false); onUpdatePrice(parseFloat(priceDraft) || 0) } }}
              className="w-16 text-xs border border-emerald-400 rounded-md px-1 py-0.5 focus:outline-none"
              autoFocus
            />
          ) : (
            <button onClick={() => { setEditingPrice(true); setPriceDraft(String(item.pricePerUnit)) }} className="text-xs text-slate-400 hover:text-emerald-600 underline-offset-2 hover:underline">
              ${item.pricePerUnit}
            </button>
          )}
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-slate-800">${total.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
      </div>

      <button onClick={onRemove} className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// Generic modal
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto p-6 z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}
