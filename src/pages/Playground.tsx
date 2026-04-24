import { useState } from 'react'
import CashFlowDiagram from '../components/CashFlowDiagram'
import StandardCalculator from '../components/StandardCalculator'
import FactorReference from '../components/FactorReference'
import {
  presentWorth,
  futureWorth,
  annualWorth,
  irr,
  paybackPeriod,
  formatCurrency,
  formatPercent,
  fGivenP,
  pGivenF,
  fGivenA,
  aGivenF,
  aGivenP,
  pGivenA,
  pGivenG,
  aGivenG,
  type CashFlow,
} from '../utils/calc'

type FactorType = 'F/P' | 'P/F' | 'F/A' | 'A/F' | 'A/P' | 'P/A' | 'P/G' | 'A/G'

export default function Playground() {
  const [interestRate, setInterestRate] = useState(8)
  const [periods, setPeriods] = useState(5)
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([])
  const [showResults, setShowResults] = useState(false)

  // Add cash flow modal state
  const [addingPeriod, setAddingPeriod] = useState<number | null>(null)
  const [addAmount, setAddAmount] = useState('')
  const [addLabel, setAddLabel] = useState('')

  // Factor calculator state
  const [factorType, setFactorType] = useState<FactorType>('F/P')
  const [factorI, setFactorI] = useState(8)
  const [factorN, setFactorN] = useState(5)

  const i = interestRate / 100

  function handleAddCashFlow() {
    if (addingPeriod === null || !addAmount) return
    const amount = parseFloat(addAmount)
    if (isNaN(amount)) return
    setCashFlows((prev) => [
      ...prev,
      { period: addingPeriod, amount, label: addLabel || undefined },
    ])
    setAddingPeriod(null)
    setAddAmount('')
    setAddLabel('')
    setShowResults(false)
  }

  function removeCashFlow(index: number) {
    setCashFlows((prev) => prev.filter((_, idx) => idx !== index))
    setShowResults(false)
  }

  function calculate() {
    setShowResults(true)
  }

  function clearAll() {
    setCashFlows([])
    setShowResults(false)
  }

  const pw = showResults ? presentWorth(cashFlows, i) : null
  const fw = showResults ? futureWorth(cashFlows, i, periods) : null
  const aw = showResults ? annualWorth(cashFlows, i, periods) : null
  const irrVal = showResults ? irr(cashFlows) : null
  const pbp = showResults ? paybackPeriod(cashFlows) : null

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
  const factorResult = factorFns[factorType](factorI / 100, factorN)

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-2">Playground</h2>
      <p className="text-slate-400 mb-6">
        Build cash flow diagrams, calculate present/future/annual worth, and
        look up interest factors.
      </p>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inputs Panel */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
            <h3 className="font-medium text-white mb-4">Parameters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Interest Rate (i)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => {
                      setInterestRate(Number(e.target.value))
                      setShowResults(false)
                    }}
                    className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 w-full focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-slate-400">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Number of Periods (n)
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={periods}
                  onChange={(e) => {
                    setPeriods(Number(e.target.value))
                    setShowResults(false)
                  }}
                  className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 w-full focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Cash Flow List */}
          <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
            <h3 className="font-medium text-white mb-3">Cash Flows</h3>
            {cashFlows.length === 0 ? (
              <p className="text-sm text-slate-500">
                Click on the diagram timeline to add cash flows.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cashFlows.map((cf, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm bg-slate-900 rounded px-3 py-2"
                  >
                    <span>
                      <span className="text-slate-400">n={cf.period}:</span>{' '}
                      <span
                        className={
                          cf.amount >= 0 ? 'text-green-400' : 'text-red-400'
                        }
                      >
                        {formatCurrency(cf.amount)}
                      </span>
                      {cf.label && (
                        <span className="text-slate-500 ml-2">
                          ({cf.label})
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => removeCashFlow(idx)}
                      className="text-slate-500 hover:text-red-400 ml-2"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Diagram + Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
            <h3 className="font-medium text-white mb-4">Cash Flow Diagram</h3>
            <div className="bg-slate-900 rounded-lg p-2">
              <CashFlowDiagram
                cashFlows={cashFlows}
                periods={periods}
                onClickPeriod={(p) => setAddingPeriod(p)}
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={calculate}
                disabled={cashFlows.length === 0}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Calculate
              </button>
              <button
                onClick={clearAll}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                label: 'Present Worth (PW)',
                value: pw !== null ? formatCurrency(pw) : '—',
              },
              {
                label: 'Future Worth (FW)',
                value: fw !== null ? formatCurrency(fw) : '—',
              },
              {
                label: 'Annual Worth (AW)',
                value: aw !== null ? formatCurrency(aw) : '—',
              },
              {
                label: 'IRR',
                value: irrVal !== null ? formatPercent(irrVal) : '—',
              },
              {
                label: 'Payback Period',
                value:
                  pbp !== null ? `${pbp} period${pbp !== 1 ? 's' : ''}` : '—',
              },
            ].map((result) => (
              <div
                key={result.label}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700"
              >
                <div className="text-xs text-slate-500 uppercase tracking-wide">
                  {result.label}
                </div>
                <div className="text-lg font-mono text-white mt-1">
                  {result.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calculator Strip: Standard | Factor Calculator | Standard */}
      <div className="mt-8 grid lg:grid-cols-3 gap-4">
        {/* Left Calculator */}
        <StandardCalculator />

        {/* Factor Calculator (compact) */}
        <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 w-full">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">
            Interest Factor Calculator
          </div>
          <div className="space-y-2">
            <div>
              <label className="block text-[10px] text-slate-500 mb-0.5">Factor</label>
              <select
                value={factorType}
                onChange={(e) => setFactorType(e.target.value as FactorType)}
                className="bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 w-full focus:outline-none focus:border-blue-500"
              >
                {(['F/P', 'P/F', 'F/A', 'A/F', 'A/P', 'P/A', 'P/G', 'A/G'] as FactorType[]).map(
                  (f) => (
                    <option key={f} value={f}>
                      ({f}, i, n)
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">i (%)</label>
                <input
                  type="number"
                  value={factorI}
                  onChange={(e) => setFactorI(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 w-full focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">n</label>
                <input
                  type="number"
                  value={factorN}
                  onChange={(e) => setFactorN(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 w-full focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="bg-slate-900 rounded px-3 py-2 border border-slate-600 text-center">
              <div className="text-[10px] text-slate-500">
                ({factorType}, {factorI}%, {factorN})
              </div>
              <div className="font-mono text-blue-300 font-bold text-lg mt-0.5">
                {factorResult.toFixed(4)}
              </div>
            </div>
          </div>
        </div>

        {/* Factor Reference */}
        <FactorReference interestRate={interestRate} periods={periods} />
      </div>

      {/* Add Cash Flow Modal */}
      {addingPeriod !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-600 w-full max-w-sm mx-4">
            <h3 className="text-white font-medium mb-4">
              Add Cash Flow at Period {addingPeriod}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Amount (positive = inflow, negative = outflow)
                </label>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="-10000"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCashFlow()}
                  className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 w-full focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Label (optional)
                </label>
                <input
                  type="text"
                  value={addLabel}
                  onChange={(e) => setAddLabel(e.target.value)}
                  placeholder="Initial investment"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCashFlow()}
                  className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 w-full focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleAddCashFlow}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors flex-1"
              >
                Add
              </button>
              <button
                onClick={() => setAddingPeriod(null)}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm px-4 py-2 rounded-lg transition-colors flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
