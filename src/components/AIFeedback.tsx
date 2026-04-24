import { motion } from 'framer-motion'

interface AIFeedbackProps {
  feedback: string
  loading: boolean
}

export default function AIFeedback({ feedback, loading }: AIFeedbackProps) {
  if (loading) {
    return (
      <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 mt-4">
        <div className="flex items-center gap-2 text-blue-400 text-sm">
          <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full" />
          Your tutor is reviewing your answer...
        </div>
      </div>
    )
  }

  if (!feedback) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 mt-4"
    >
      <div className="text-xs text-blue-400 uppercase tracking-wide mb-2">
        Tutor Feedback
      </div>
      <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
        {feedback}
      </div>
    </motion.div>
  )
}
