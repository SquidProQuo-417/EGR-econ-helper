import { useState } from 'react'

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

function toFraction(decimal: number, mixed: boolean): string {
  if (!isFinite(decimal)) return 'Error'
  if (decimal === 0) return '0'

  const sign = decimal < 0 ? '-' : ''
  const abs = Math.abs(decimal)

  const precision = 1e10
  let num = Math.round(abs * precision)
  let den = precision
  const g = gcd(num, den)
  num = num / g
  den = den / g

  if (den === 1) return `${sign}${num}`

  if (mixed && num > den) {
    const whole = Math.floor(num / den)
    const remainder = num - whole * den
    if (remainder === 0) return `${sign}${whole}`
    return `${sign}${whole} ${remainder}/${den}`
  }

  return `${sign}${num}/${den}`
}

interface HistoryEntry {
  expression: string
  result: number
}

export default function StandardCalculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [decimalPlaces, setDecimalPlaces] = useState(4)
  const [showFraction, setShowFraction] = useState(false)
  const [mixedNumbers, setMixedNumbers] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [lastAnswer, setLastAnswer] = useState<number | null>(null)

  const buttons = [
    ['C', '(', ')', '\u00f7'],
    ['7', '8', '9', '\u00d7'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '^', '='],
  ]

  function handleButton(btn: string) {
    if (btn === 'C') {
      setDisplay('0')
      setExpression('')
      setResult(null)
      return
    }

    if (btn === '=') {
      try {
        const expr = expression
          .replace(/\u00f7/g, '/')
          .replace(/\u00d7/g, '*')
          .replace(/\^/g, '**')
        const val = new Function(`"use strict"; return (${expr})`)() as number
        setResult(val)
        setLastAnswer(val)
        setHistory((prev) => [
          { expression, result: val },
          ...prev.slice(0, 19),
        ])
        const formatted = formatResult(val)
        setDisplay(formatted)
        setExpression(String(val))
      } catch {
        setDisplay('Error')
        setExpression('')
        setResult(null)
      }
      return
    }

    const newExpr = expression === '' || expression === '0' ? btn : expression + btn
    setExpression(newExpr)
    setDisplay(newExpr)
    setResult(null)
  }

  function handleAns() {
    if (lastAnswer === null) return
    const ansStr = String(lastAnswer)
    const newExpr = expression === '' || expression === '0' ? ansStr : expression + ansStr
    setExpression(newExpr)
    setDisplay(newExpr)
    setResult(null)
  }

  function handleHistoryCopy(entry: HistoryEntry) {
    const valStr = String(entry.result)
    const newExpr = expression === '' || expression === '0' ? valStr : expression + valStr
    setExpression(newExpr)
    setDisplay(newExpr)
    setResult(null)
    setHistoryOpen(false)
  }

  function formatResult(val: number): string {
    if (!isFinite(val)) return 'Error'
    if (showFraction) return toFraction(val, mixedNumbers)
    return val.toFixed(decimalPlaces)
  }

  const displayValue =
    result !== null ? formatResult(result) : display

  return (
    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 w-full relative">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-slate-500 uppercase tracking-wide">
          Calculator
        </div>
        <button
          onClick={() => setHistoryOpen(!historyOpen)}
          className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
            historyOpen
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          History {history.length > 0 && `(${history.length})`}
        </button>
      </div>

      {/* History dropdown */}
      {historyOpen && (
        <div className="absolute right-3 top-10 z-10 bg-slate-900 border border-slate-600 rounded-lg shadow-xl w-56 max-h-48 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-xs text-slate-500 p-3 text-center">
              No history yet
            </div>
          ) : (
            history.map((entry, i) => (
              <button
                key={i}
                onClick={() => handleHistoryCopy(entry)}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 transition-colors border-b border-slate-700/50 last:border-0"
              >
                <div className="text-[10px] text-slate-500 truncate">
                  {entry.expression}
                </div>
                <div className="text-xs font-mono text-blue-300">
                  = {entry.result.toFixed(decimalPlaces)}
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Display */}
      <div className="bg-slate-900 rounded px-3 py-2 mb-2 text-right font-mono text-base text-slate-200 min-h-[2.2rem] overflow-x-auto whitespace-nowrap">
        {displayValue}
      </div>

      {/* Settings row */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-1">
          <label className="text-[10px] text-slate-500">Decimals:</label>
          <select
            value={decimalPlaces}
            onChange={(e) => {
              setDecimalPlaces(Number(e.target.value))
              setShowFraction(false)
            }}
            className="bg-slate-900 border border-slate-600 rounded px-1.5 py-0.5 text-[11px] text-slate-300 focus:outline-none focus:border-blue-500"
          >
            {[0, 1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowFraction(!showFraction)}
          className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
            showFraction
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          Fraction
        </button>
        {showFraction && (
          <button
            onClick={() => setMixedNumbers(!mixedNumbers)}
            className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
              mixedNumbers
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            Mixed
          </button>
        )}
      </div>

      {/* Button grid */}
      <div className="grid grid-cols-4 gap-1">
        {buttons.flat().map((btn) => (
          <button
            key={btn}
            onClick={() => handleButton(btn)}
            className={`py-1.5 rounded text-xs font-medium transition-colors ${
              btn === '='
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : btn === 'C'
                  ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                  : ['+', '-', '\u00d7', '\u00f7', '^', '(', ')'].includes(btn)
                    ? 'bg-slate-700 hover:bg-slate-600 text-blue-300'
                    : 'bg-slate-700/50 hover:bg-slate-600 text-slate-200'
            }`}
          >
            {btn}
          </button>
        ))}
      </div>

      {/* Extra functions + ANS */}
      <div className="grid grid-cols-4 gap-1 mt-1">
        {[
          { label: 'ln', fn: 'Math.log(' },
          { label: 'log', fn: 'Math.log10(' },
          { label: '\u221a', fn: 'Math.sqrt(' },
        ].map(({ label, fn }) => (
          <button
            key={label}
            onClick={() => {
              const newExpr = expression === '0' || expression === '' ? fn : expression + fn
              setExpression(newExpr)
              setDisplay(newExpr)
              setResult(null)
            }}
            className="py-1.5 rounded text-[10px] font-medium bg-slate-700 hover:bg-slate-600 text-slate-300"
          >
            {label}
          </button>
        ))}
        <button
          onClick={handleAns}
          disabled={lastAnswer === null}
          className="py-1.5 rounded text-[10px] font-medium bg-green-800/30 hover:bg-green-800/50 text-green-400 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ANS
        </button>
      </div>
    </div>
  )
}
