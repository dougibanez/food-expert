"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const EVENT_TYPES = [
  { id: 'cumpleanos', label: 'Cumpleaños', emoji: '🎂' },
  { id: 'reunion', label: 'Reunión', emoji: '🎉' },
  { id: 'bbq', label: 'BBQ / Asado', emoji: '🔥' },
  { id: 'futbol', label: 'Ver el fútbol', emoji: '⚽' },
  { id: 'cena', label: 'Cena familiar', emoji: '🍽️' },
  { id: 'playa', label: 'Día de playa', emoji: '🏖️' },
  { id: 'boda', label: 'Boda / Evento', emoji: '💍' },
  { id: 'otro', label: 'Otro', emoji: '📋' },
]

export default function ShoppingLandingPage() {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [selectedEventType, setSelectedEventType] = useState('')
  const [guestCount, setGuestCount] = useState(10)
  const [openCode, setOpenCode] = useState('')
  const [openingCode, setOpeningCode] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'home' | 'create' | 'open'>('home')

  async function handleCreate() {
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/shopping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || `${EVENT_TYPES.find(e => e.id === selectedEventType)?.label || 'Mi Evento'}`,
          eventType: selectedEventType || null,
          guestCount,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/shopping/${data.shareCode}`)
    } catch {
      setError('Ocurrió un error al crear la lista. Intenta de nuevo.')
      setCreating(false)
    }
  }

  async function handleOpen() {
    const code = openCode.trim().toUpperCase()
    if (!code || code.length < 6) {
      setError('Ingresa un código válido (mínimo 6 caracteres).')
      return
    }
    setOpeningCode(true)
    setError('')
    try {
      const res = await fetch(`/api/shopping/${code}`)
      if (!res.ok) {
        setError('Código no encontrado. Verifica e intenta de nuevo.')
        setOpeningCode(false)
        return
      }
      router.push(`/shopping/${code}`)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
      setOpeningCode(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-green-100 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-lg">🛒</span>
          </div>
          <span className="font-bold text-slate-800">Listas de Compra para Eventos</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {step === 'home' && (
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
              <span className="text-5xl">🛒</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Listas para tu Evento</h1>
            <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto">
              Organiza las compras de tu evento, calcula costos y comparte la lista con todos.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <button
                onClick={() => setStep('create')}
                className="group bg-white hover:bg-emerald-500 border-2 border-emerald-200 hover:border-emerald-500 rounded-2xl p-6 text-left transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-emerald-200"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">✨</div>
                <h2 className="font-bold text-slate-900 group-hover:text-white text-lg mb-1">Nueva Lista</h2>
                <p className="text-sm text-slate-500 group-hover:text-emerald-100">Crea una lista para tu próximo evento</p>
              </button>

              <button
                onClick={() => setStep('open')}
                className="group bg-white hover:bg-blue-500 border-2 border-blue-200 hover:border-blue-500 rounded-2xl p-6 text-left transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-blue-200"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🔗</div>
                <h2 className="font-bold text-slate-900 group-hover:text-white text-lg mb-1">Abrir Lista</h2>
                <p className="text-sm text-slate-500 group-hover:text-blue-100">Ingresa el código de una lista existente</p>
              </button>
            </div>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { emoji: '🌮', label: 'Tacos, ceviche, sushi y más' },
                { emoji: '🍺', label: 'Bebidas y tragos incluidos' },
                { emoji: '💰', label: 'Costo estimado por ítem' },
                { emoji: '🔗', label: 'Comparte con un link' },
              ].map((f) => (
                <div key={f.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="text-2xl mb-1">{f.emoji}</div>
                  <p className="text-xs text-slate-500">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'create' && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <button onClick={() => { setStep('home'); setError('') }} className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Nueva Lista de Compras</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ¿Para qué evento? <span className="font-normal text-slate-400">(opcional)</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {EVENT_TYPES.map((et) => (
                    <button key={et.id} onClick={() => setSelectedEventType(et.id === selectedEventType ? '' : et.id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                        selectedEventType === et.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200'
                      }`}>
                      <span className="text-xl">{et.emoji}</span>
                      <span className="leading-tight text-center">{et.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nombre de la lista <span className="font-normal text-slate-400">(opcional)</span>
                </label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Ej: ${EVENT_TYPES.find(e => e.id === selectedEventType)?.label || 'Mi Fiesta'} - Junio 2025`}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  maxLength={80} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Número de invitados</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setGuestCount(Math.max(1, guestCount - 5))} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold transition-colors">−</button>
                  <div className="flex-1 text-center">
                    <input type="number" value={guestCount} onChange={(e) => setGuestCount(Math.max(1, Math.min(500, parseInt(e.target.value) || 1)))}
                      className="w-24 text-center border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                    <p className="text-xs text-slate-400 mt-1">personas</p>
                  </div>
                  <button onClick={() => setGuestCount(Math.min(500, guestCount + 5))} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold transition-colors">+</button>
                </div>
              </div>
              {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}
              <button onClick={handleCreate} disabled={creating}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200 text-lg">
                {creating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creando...
                  </span>
                ) : '✨ Crear Lista'}
              </button>
            </div>
          </div>
        )}

        {step === 'open' && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <button onClick={() => { setStep('home'); setError('') }} className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Abrir Lista Existente</h2>
            <p className="text-slate-500 mb-6">Ingresa el código de 8 caracteres que te compartieron.</p>
            <div className="space-y-4">
              <input type="text" value={openCode}
                onChange={(e) => setOpenCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
                placeholder="Ej: ABCD1234" maxLength={8}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-4 text-slate-800 text-center text-2xl font-mono font-bold tracking-widest placeholder:text-slate-300 placeholder:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent uppercase" />
              {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}
              <button onClick={handleOpen} disabled={openingCode}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 text-lg">
                {openingCode ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Abriendo...
                  </span>
                ) : '🔗 Abrir Lista'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
