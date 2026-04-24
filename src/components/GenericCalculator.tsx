import { useState } from 'react'

const buttons = [
  ['C', '(', ')', '/'],
  ['7', '8', '9', '*'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '^', '='],
]

export default function GenericCalculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')

  function handleButton(btn: string) {
    if (btn === 'C') {
      setDisplay('0')
      setExpression('')
      return
    }

    if (btn === '=') {
      try {
        // Replace ^ with ** for exponentiation
        const expr = expression.replace(/\^/g, '**')
        // Evaluate safely
        const result = new Function(`"use strict"; return (${expr})`)()
        const formatted =
          typeof result === 'number' ? String(parseFloat(result.toFixed(10))) : 'Error'
        setDisplay(formatted)
        setExpression(formatted)
      } catch {
        setDisplay('Error')
        setExpression('')
      }
      return
    }

    const newExpr = expression === '0' ? btn : expression + btn
    setExpression(newExpr)
    setDisplay(newExpr)
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 w-full max-w-xs">
      <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">
        Calculator
      </div>
      <div className="bg-slate-900 rounded px-3 py-2 mb-3 text-right font-mono text-lg text-slate-200 min-h-[2.5rem] overflow-x-auto">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {buttons.flat().map((btn) => (
          <button
            key={btn}
            onClick={() => handleButton(btn)}
            className={`py-2 rounded text-sm font-medium transition-colors ${
              btn === '='
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : btn === 'C'
                  ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                  : ['+', '-', '*', '/', '^', '(', ')'].includes(btn)
                    ? 'bg-slate-700 hover:bg-slate-600 text-blue-300'
                    : 'bg-slate-700/50 hover:bg-slate-600 text-slate-200'
            }`}
          >
            {btn}
          </button>
        ))}
      </div>
      {/* Extra functions */}
      <div className="grid grid-cols-3 gap-1.5 mt-1.5">
        {[
          { label: 'ln', fn: 'Math.log(' },
          { label: 'log', fn: 'Math.log10(' },
          { label: 'sqrt', fn: 'Math.sqrt(' },
        ].map(({ label, fn }) => (
          <button
            key={label}
            onClick={() => {
              const newExpr =
                expression === '0' ? fn : expression + fn
              setExpression(newExpr)
              setDisplay(newExpr)
            }}
            className="py-2 rounded text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-300"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
