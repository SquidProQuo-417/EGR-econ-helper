import { equations } from '../data/equations'
import { getProgress } from '../utils/storage'
import { useState } from 'react'

export default function Equations() {
  const progress = getProgress()
  const [filter, setFilter] = useState('')

  const visibleEquations = equations.filter((eq) => {
    const unlocked =
      !eq.unlockedByChapter ||
      progress.completedLessons.includes(eq.unlockedByChapter)
    const matchesFilter =
      !filter ||
      eq.name.toLowerCase().includes(filter.toLowerCase()) ||
      eq.category.toLowerCase().includes(filter.toLowerCase())
    return unlocked && matchesFilter
  })

  const lockedCount = equations.length - visibleEquations.length

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Equations Reference
          </h2>
          {lockedCount > 0 && (
            <p className="text-sm text-slate-500 mt-1">
              {lockedCount} equation{lockedCount !== 1 ? 's' : ''} locked —
              complete more lessons to unlock
            </p>
          )}
        </div>
        <input
          type="text"
          placeholder="Search equations..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full sm:w-64"
        />
      </div>

      {visibleEquations.length === 0 ? (
        <div className="text-center text-slate-500 py-12">
          {filter
            ? 'No equations match your search.'
            : 'Complete your first lesson to unlock equations.'}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visibleEquations.map((eq) => (
            <div
              key={eq.id}
              className="bg-slate-800 rounded-lg p-5 border border-slate-700"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-white">{eq.name}</h3>
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded shrink-0">
                  {eq.category}
                </span>
              </div>
              <div className="mt-3 bg-slate-900 rounded p-3 font-mono text-blue-300 text-center">
                {eq.formula}
              </div>
              <p className="text-sm text-slate-400 mt-3">{eq.description}</p>
              <div className="mt-3 space-y-1">
                {eq.variables.map((v) => (
                  <div key={v.symbol} className="text-xs text-slate-500">
                    <span className="font-mono text-slate-300">{v.symbol}</span>{' '}
                    — {v.meaning}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
