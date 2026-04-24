import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GenericCalculator from './GenericCalculator'
import FactorCalculator from './FactorCalculator'

interface CalculatorPanelProps {
  isOpen: boolean
  onClose: () => void
}

type CalcTab = 'basic' | 'econ'

export default function CalculatorPanel({ isOpen, onClose }: CalculatorPanelProps) {
  const [tab, setTab] = useState<CalcTab>('basic')

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-80 bg-slate-850 border-l border-slate-700 z-40 flex flex-col shadow-2xl"
          style={{ backgroundColor: '#1a1f2e' }}
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex gap-2">
              <button
                onClick={() => setTab('basic')}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  tab === 'basic'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Basic
              </button>
              <button
                onClick={() => setTab('econ')}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  tab === 'econ'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Econ Factors
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-lg"
            >
              x
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {tab === 'basic' ? <GenericCalculator /> : <FactorCalculator />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
