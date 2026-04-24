import { useState } from 'react'
import DraggableCard from './DraggableCard'
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

type FactorKey = 'F/P' | 'P/F' | 'F/A' | 'A/F' | 'A/P' | 'P/A' | 'P/G' | 'A/G'
type VarKey = 'P' | 'F' | 'A' | 'G'

interface FactorInfo {
  name: string
  formula: string
  know: string
  find: string
  knowVars: VarKey[]
  findVar: VarKey
  conditions: string[]
  clueWords: string[]
  fn: (i: number, n: number) => number
}

const factors: Record<FactorKey, FactorInfo> = {
  'F/P': {
    name: 'Single Payment Compound Amount',
    formula: 'F = P(1 + i)^n',
    know: 'Present amount (P), interest rate (i), periods (n)',
    find: 'Future amount (F)',
    knowVars: ['P'],
    findVar: 'F',
    conditions: [
      'Single lump sum (not a series of payments)',
      'Compound interest (not simple)',
      'Interest rate is constant over all periods',
    ],
    clueWords: [
      '"how much will it be worth in X years"',
      '"grows to" or "accumulates to"',
      '"future value of a deposit"',
      '"invest today...how much later"',
    ],
    fn: fGivenP,
  },
  'P/F': {
    name: 'Single Payment Present Worth',
    formula: 'P = F / (1 + i)^n',
    know: 'Future amount (F), interest rate (i), periods (n)',
    find: 'Present amount (P)',
    knowVars: ['F'],
    findVar: 'P',
    conditions: [
      'Single lump sum in the future',
      'Want to know its value today',
      'Constant interest rate',
    ],
    clueWords: [
      '"how much should you invest/deposit today"',
      '"present value of" a future sum',
      '"what is it worth now"',
      '"need $X in Y years, how much now"',
    ],
    fn: pGivenF,
  },
  'F/A': {
    name: 'Uniform Series Compound Amount',
    formula: 'F = A[(1 + i)^n - 1] / i',
    know: 'Annual payment (A), interest rate (i), periods (n)',
    find: 'Future amount (F)',
    knowVars: ['A'],
    findVar: 'F',
    conditions: [
      'Equal payments each period',
      'Payments occur at end of each period',
      'Want the total accumulated at the end',
    ],
    clueWords: [
      '"deposit $X per year...how much after N years"',
      '"save annually" or "annual contribution"',
      '"total accumulated" from regular payments',
    ],
    fn: fGivenA,
  },
  'A/F': {
    name: 'Sinking Fund',
    formula: 'A = Fi / [(1 + i)^n - 1]',
    know: 'Future amount needed (F), interest rate (i), periods (n)',
    find: 'Annual payment (A)',
    knowVars: ['F'],
    findVar: 'A',
    conditions: [
      'Need to accumulate a specific future amount',
      'Will make equal periodic deposits',
      'Deposits at end of each period',
    ],
    clueWords: [
      '"how much to save each year to have $X"',
      '"annual deposit needed to accumulate"',
      '"sinking fund" or "set aside annually"',
    ],
    fn: aGivenF,
  },
  'A/P': {
    name: 'Capital Recovery',
    formula: 'A = P[i(1 + i)^n] / [(1 + i)^n - 1]',
    know: 'Present amount / loan (P), interest rate (i), periods (n)',
    find: 'Annual payment (A)',
    knowVars: ['P'],
    findVar: 'A',
    conditions: [
      'Borrowing or investing a lump sum now',
      'Repaying/recovering with equal periodic payments',
      'Payments at end of each period',
    ],
    clueWords: [
      '"annual payment on a loan"',
      '"equal yearly payments to repay"',
      '"mortgage/loan payment"',
      '"EUAC" or "equivalent uniform annual cost"',
    ],
    fn: aGivenP,
  },
  'P/A': {
    name: 'Series Present Worth',
    formula: 'P = A[(1 + i)^n - 1] / [i(1 + i)^n]',
    know: 'Annual payment (A), interest rate (i), periods (n)',
    find: 'Present amount (P)',
    knowVars: ['A'],
    findVar: 'P',
    conditions: [
      'Equal payments each period',
      'Want to know the lump-sum equivalent today',
      'Payments at end of each period',
    ],
    clueWords: [
      '"present worth of annual payments"',
      '"what is a stream of payments worth today"',
      '"how much would you pay now instead of $X/year"',
      '"NPW" or "net present worth" with uniform costs',
    ],
    fn: pGivenA,
  },
  'P/G': {
    name: 'Arithmetic Gradient Present Worth',
    formula: 'P = G[(1+i)^n - in - 1] / [i\u00b2(1+i)^n]',
    know: 'Gradient amount (G), interest rate (i), periods (n)',
    find: 'Present amount (P)',
    knowVars: ['G'],
    findVar: 'P',
    conditions: [
      'Cash flows increase by a constant amount each period',
      'Gradient starts at period 2 (period 1 cash flow = 0)',
      'Often combined with a uniform series (A + gradient)',
    ],
    clueWords: [
      '"increases by $X each year"',
      '"maintenance costs grow by"',
      '"arithmetic gradient" or "linear increase"',
      '"costs rise $G per year"',
    ],
    fn: pGivenG,
  },
  'A/G': {
    name: 'Arithmetic Gradient to Annual',
    formula: 'A = G[1/i - n/((1+i)^n - 1)]',
    know: 'Gradient amount (G), interest rate (i), periods (n)',
    find: 'Equivalent annual amount (A)',
    knowVars: ['G'],
    findVar: 'A',
    conditions: [
      'Cash flows increase by constant amount each period',
      'Want equivalent uniform annual amount',
      'Gradient starts at period 2',
    ],
    clueWords: [
      '"convert increasing costs to equivalent annual"',
      '"equivalent annual cost of a gradient"',
      '"uniform annual equivalent of increasing series"',
    ],
    fn: aGivenG,
  },
}

const varLabels: Record<VarKey, string> = {
  P: 'Present amount (P)',
  F: 'Future amount (F)',
  A: 'Annual/uniform payment (A)',
  G: 'Gradient increase (G)',
}

interface FactorReferenceProps {
  interestRate: number // as percentage, e.g. 8
  periods: number
}

export default function FactorReference({ interestRate, periods }: FactorReferenceProps) {
  const [openCard, setOpenCard] = useState<FactorKey | null>(null)
  const [lookupKnow, setLookupKnow] = useState<VarKey | ''>('')
  const [lookupFind, setLookupFind] = useState<VarKey | ''>('')

  const i = interestRate / 100
  const allKeys = Object.keys(factors) as FactorKey[]

  // Reverse lookup: find matching factors
  let matchedFactors: FactorKey[] = []
  if (lookupKnow && lookupFind && lookupKnow !== lookupFind) {
    matchedFactors = allKeys.filter((k) => {
      const f = factors[k]
      return f.knowVars.includes(lookupKnow as VarKey) && f.findVar === lookupFind
    })
  }

  const openInfo = openCard ? factors[openCard] : null

  return (
    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 w-full">
      <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">
        Factor Reference
      </div>

      {/* Reverse Lookup */}
      <div className="bg-slate-900 rounded p-2 mb-3">
        <div className="text-[10px] text-slate-500 mb-1.5">Which factor do I use?</div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400">I know</span>
          <select
            value={lookupKnow}
            onChange={(e) => setLookupKnow(e.target.value as VarKey | '')}
            className="bg-slate-800 border border-slate-600 rounded px-1.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">...</option>
            <option value="P">P</option>
            <option value="F">F</option>
            <option value="A">A</option>
            <option value="G">G</option>
          </select>
          <span className="text-slate-400">need</span>
          <select
            value={lookupFind}
            onChange={(e) => setLookupFind(e.target.value as VarKey | '')}
            className="bg-slate-800 border border-slate-600 rounded px-1.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">...</option>
            <option value="P">P</option>
            <option value="F">F</option>
            <option value="A">A</option>
            <option value="G">G</option>
          </select>
        </div>
        {matchedFactors.length > 0 && (
          <div className="mt-1.5 text-[11px] text-green-400">
            Use: {matchedFactors.map((k) => `(${k})`).join(', ')}
          </div>
        )}
        {lookupKnow && lookupFind && lookupKnow === lookupFind && (
          <div className="mt-1.5 text-[11px] text-slate-500">
            Pick different variables
          </div>
        )}
        {lookupKnow && lookupFind && lookupKnow !== lookupFind && matchedFactors.length === 0 && (
          <div className="mt-1.5 text-[11px] text-yellow-400">
            No direct factor — may need multiple steps
          </div>
        )}
      </div>

      {/* Factor list */}
      <div className="space-y-1">
        {allKeys.map((key) => {
          const f = factors[key]
          const value = f.fn(i, periods)
          const isMatch = matchedFactors.includes(key)
          return (
            <button
              key={key}
              onClick={() => setOpenCard(openCard === key ? null : key)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors ${
                isMatch
                  ? 'bg-green-900/30 border border-green-700/50 text-green-300'
                  : 'bg-slate-900/50 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span className="font-mono font-medium">({key})</span>
              <span className="font-mono text-blue-300">{value.toFixed(4)}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-2 text-[10px] text-slate-600 text-center">
        at i={interestRate}%, n={periods} — click for details
      </div>

      {/* Draggable detail card */}
      {openCard && openInfo && (
        <DraggableCard title={`(${openCard}) ${openInfo.name}`} onClose={() => setOpenCard(null)}>
          {/* Formula */}
          <div className="bg-slate-900 rounded px-3 py-2 text-center font-mono text-blue-300 text-sm mb-3">
            {openInfo.formula}
          </div>

          {/* Variables */}
          <div className="mb-3">
            <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
              Variables
            </div>
            <div className="text-xs text-slate-300 space-y-0.5">
              <div><span className="font-mono text-slate-400">i</span> — interest rate per period</div>
              <div><span className="font-mono text-slate-400">n</span> — number of periods</div>
              {openInfo.knowVars.map((v) => (
                <div key={v}><span className="font-mono text-slate-400">{v}</span> — {varLabels[v].replace(` (${v})`, '')}</div>
              ))}
              <div><span className="font-mono text-slate-400">{openInfo.findVar}</span> — {varLabels[openInfo.findVar].replace(` (${openInfo.findVar})`, '')}</div>
            </div>
          </div>

          {/* You know / You find */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-slate-900 rounded p-2">
              <div className="text-[10px] text-green-400 uppercase tracking-wide mb-0.5">You know</div>
              <div className="text-xs text-slate-300">{openInfo.know}</div>
            </div>
            <div className="bg-slate-900 rounded p-2">
              <div className="text-[10px] text-blue-400 uppercase tracking-wide mb-0.5">You find</div>
              <div className="text-xs text-slate-300">{openInfo.find}</div>
            </div>
          </div>

          {/* Conditions */}
          <div className="mb-3">
            <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
              Conditions for use
            </div>
            <ul className="space-y-0.5">
              {openInfo.conditions.map((c, i) => (
                <li key={i} className="text-xs text-slate-300 flex gap-1.5">
                  <span className="text-slate-500 shrink-0">&bull;</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Clue words */}
          <div>
            <div className="text-[10px] text-yellow-400 uppercase tracking-wide mb-1">
              Clue words in problems
            </div>
            <ul className="space-y-0.5">
              {openInfo.clueWords.map((c, i) => (
                <li key={i} className="text-xs text-yellow-200/80 flex gap-1.5">
                  <span className="text-yellow-500 shrink-0">&rarr;</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </DraggableCard>
      )}
    </div>
  )
}
