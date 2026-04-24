import { useState } from 'react'
import {
  fGivenP,
  pGivenF,
  fGivenA,
  aGivenF,
  aGivenP,
  pGivenA,
  pGivenG,
  aGivenG,
} from '../utils/calc'

type FactorType = 'F/P' | 'P/F' | 'F/A' | 'A/F' | 'A/P' | 'P/A' | 'P/G' | 'A/G'

const factorDescriptions: Record<FactorType, string> = {
  'F/P': 'Future given Present — compound amount',
  'P/F': 'Present given Future — present worth',
  'F/A': 'Future given Annual — series compound amount',
  'A/F': 'Annual given Future — sinking fund',
  'A/P': 'Annual given Present — capital recovery',
  'P/A': 'Present given Annual — series present worth',
  'P/G': 'Present given Gradient — gradient present worth',
  'A/G': 'Annual given Gradient — gradient to annual',
}

const factorFns: Record<FactorType, (i: number, n: number) => number> = {
  'F/P': fGivenP,
  'P/F': pGivenF,
  'F/A': fGivenA,
  'A/F': aGivenF,
  'A/P': aGivenP,
  'P/A': pGivenA,
  'P/G': pGivenG,
  'A/G': aGivenG,
}

export default function FactorCalculator() {
  const [factorType, setFactorType] = useState<FactorType>('F/P')
  const [i, setI] = useState(8)
  const [n, setN] = useState(5)
  const [amount, setAmount] = useState(1000)

  const factor = factorFns[factorType](i / 100, n)
  const result = amount * factor

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 w-full">
      <div className="text-xs text-slate-500 uppercase tracking-wide mb-3">
        Interest Factor Calculator
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Factor</label>
          <select
            value={factorType}
            onChange={(e) => setFactorType(e.target.value as FactorType)}
            className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 w-full focus:outline-none focus:border-blue-500"
          >
            {(Object.keys(factorFns) as FactorType[]).map((f) => (
              <option key={f} value={f}>
                ({f}, i, n)
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">
            {factorDescriptions[factorType]}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">i (%)</label>
            <input
              type="number"
              value={i}
              onChange={(e) => setI(Number(e.target.value))}
              className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">n</label>
            <input
              type="number"
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 w-full focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 w-full focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="bg-slate-900 rounded p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Factor:</span>
            <span className="font-mono text-blue-300">{factor.toFixed(4)}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-slate-700 pt-2">
            <span className="text-slate-400">Result:</span>
            <span className="font-mono text-green-400 font-bold">
              ${result.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
