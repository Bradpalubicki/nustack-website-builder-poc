export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 text-center">
      <h1 className="text-5xl font-bold mb-4">
        NuStack Builder POC
      </h1>
      <p className="text-xl opacity-90 max-w-xl leading-relaxed">
        This site was created automatically via the GitHub + Vercel API pipeline.
        The entire process was automated!
      </p>
      <div className="mt-8 p-6 bg-white/15 rounded-xl backdrop-blur-sm text-left">
        <p className="my-2">GitHub repo created programmatically</p>
        <p className="my-2">Next.js files committed via API</p>
        <p className="my-2">Vercel project created and linked</p>
        <p className="my-2">Auto-deployed on push</p>
      </div>
      <p className="mt-8 opacity-60 text-sm">
        Pipeline test completed successfully
      </p>
    </main>
  )
}
