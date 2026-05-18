"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

const DEMO_NAMES = ["Caro", "Thomy", "Doug", "Olga"]

export default function SignIn() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    await signIn("credentials", { name: name.trim(), callbackUrl: "/" })
    setLoading(false)
  }

  const handleQuickLogin = async (n: string) => {
    setLoading(true)
    await signIn("credentials", { name: n, callbackUrl: "/" })
    setLoading(false)
  }

  return (
    <main className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md w-full">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-2xl mb-6">
          <svg
            className="w-10 h-10 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Food Expert
        </h2>
        <p className="text-slate-500 mb-8 text-base leading-relaxed">
          Registra y valora los restaurantes, hoteles y bares que has visitado.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4"
        >
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              ¿Cómo te llamas?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              autoFocus
              maxLength={40}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full py-3 px-4 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-40 shadow-sm"
          >
            {loading ? "Entrando..." : "Entrar a mis lugares"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-400">
                o entrá como
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {DEMO_NAMES.map((n) => (
              <button
                key={n}
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin(n)}
                className="py-2 px-3 text-sm text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 font-medium"
              >
                {n}
              </button>
            ))}
          </div>
        </form>
      </div>
    </main>
  )
}
