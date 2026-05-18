"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Header() {
  const { data: session } = useSession()
  const [userColor, setUserColor] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.user?.id) return
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => { if (data?.color) setUserColor(data.color) })
  }, [session?.user?.id])

  const initial = session?.user?.name?.[0]?.toUpperCase() ?? "?"

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">Food Expert</h1>
            <p className="text-xs text-slate-400">Mis lugares visitados</p>
          </div>
        </div>

        {/* User area */}
        {session ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm transition-colors duration-300"
                style={{ backgroundColor: userColor ?? "#94a3b8" }}
              >
                {initial}
              </div>
              <div className="leading-tight">
                <p className="text-xs text-slate-400">Hola,</p>
                <p className="text-sm font-semibold text-slate-800">{session.user?.name}</p>
              </div>
            </div>

            <div className="w-px h-6 bg-slate-200" />

            <button
              onClick={() => signOut()}
              className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Salir
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm"
          >
            Iniciar sesión
          </button>
        )}
      </div>
    </header>
  )
}
