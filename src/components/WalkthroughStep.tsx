import { motion } from 'framer-motion'
import type { WalkthroughStep as StepType } from '../data/problems'

interface WalkthroughStepProps {
  step: StepType
  stepNumber: number
  isVisible: boolean
}

export default function WalkthroughStep({
  step,
  stepNumber,
  isVisible,
}: WalkthroughStepProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-slate-800 rounded-lg p-5 border border-slate-700"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
          {stepNumber}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-white mb-2">{step.title}</h4>
          <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
            {step.content}
          </div>
          {step.highlight && (
            <div className="mt-3 bg-yellow-900/20 border border-yellow-800/30 rounded px-3 py-2">
              <span className="text-xs text-yellow-400 uppercase tracking-wide">
                Key Insight:{' '}
              </span>
              <span className="text-sm text-yellow-200">{step.highlight}</span>
            </div>
          )}
          {step.equation && (
            <div className="mt-3 bg-slate-900 rounded px-4 py-2 text-center">
              <span className="font-mono text-blue-300">{step.equation}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
