import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#1e293b',
    primaryColor: '#3b82f6',
    primaryTextColor: '#e2e8f0',
    primaryBorderColor: '#475569',
    lineColor: '#64748b',
    secondaryColor: '#1e3a5f',
    tertiaryColor: '#1e293b',
    noteBkgColor: '#1e3a5f',
    noteTextColor: '#e2e8f0',
  },
})

let mermaidCounter = 0

interface MermaidDiagramProps {
  chart: string
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const idRef = useRef(`mermaid-${++mermaidCounter}`)

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        const { svg: rendered } = await mermaid.render(idRef.current, chart.trim())
        if (!cancelled) {
          setSvg(rendered)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to render diagram')
          setSvg(null)
        }
        // Clean up any leftover error element mermaid may have injected
        const errorEl = document.getElementById('d' + idRef.current)
        if (errorEl) errorEl.remove()
      }
    }

    render()
    return () => { cancelled = true }
  }, [chart])

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800/50 rounded p-3 text-xs text-red-400">
        Mermaid diagram error: {error}
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="bg-slate-900 rounded p-4 text-center text-slate-500 text-xs">
        Rendering diagram...
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="bg-slate-900 rounded p-4 overflow-x-auto my-2"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
