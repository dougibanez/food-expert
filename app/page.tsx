import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Header from "@/components/Header"
import SignIn from "@/components/SignIn"
import PlacesApp from "@/components/PlacesApp"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      {session ? <PlacesApp /> : <SignIn />}
    </div>
  )
}
