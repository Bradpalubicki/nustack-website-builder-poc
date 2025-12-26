export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 700 }}>
        🚀 NuStack Builder POC
      </h1>
      <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', lineHeight: 1.6 }}>
        This site was created automatically via the GitHub + Vercel API pipeline.
        The entire process was automated!
      </p>
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem 2rem',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        textAlign: 'left',
      }}>
        <p style={{ margin: '0.5rem 0' }}>✅ GitHub repo created programmatically</p>
        <p style={{ margin: '0.5rem 0' }}>✅ Next.js files committed via API</p>
        <p style={{ margin: '0.5rem 0' }}>✅ Vercel project created and linked</p>
        <p style={{ margin: '0.5rem 0' }}>✅ Auto-deployed on push</p>
      </div>
      <p style={{ marginTop: '2rem', opacity: 0.6, fontSize: '0.875rem' }}>
        Pipeline test completed successfully
      </p>
    </main>
  )
}
