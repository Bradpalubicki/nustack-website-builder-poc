import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 text-center">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold mb-4">
            N
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-4">
          NuStack Website Builder
        </h1>

        <p className="text-xl text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
          Build beautiful websites with AI. Describe what you want, and watch your site come to life in real-time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-600 hover:bg-slate-700">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-slate-400">Describe your vision and let Claude build it for you</p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold mb-2">Instant Deploy</h3>
            <p className="text-sm text-slate-400">One-click deployment to Vercel with custom domains</p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl mb-2">🎨</div>
            <h3 className="font-semibold mb-2">Live Preview</h3>
            <p className="text-sm text-slate-400">See changes in real-time as you build</p>
          </div>
        </div>
      </div>
    </main>
  )
}
