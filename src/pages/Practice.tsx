import { useState } from 'react'
import { chapters } from '../data/chapters'
import { practiceProblems } from '../data/problems'
import { getProgress, recordPracticeAttempt } from '../utils/storage'
import { getFeedback } from '../utils/ai'
import AIFeedback from '../components/AIFeedback'
import CalculatorPanel from '../components/CalculatorPanel'

export default function Practice() {
  const [progress, setProgress] = useState(getProgress)
  const [calcOpen, setCalcOpen] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)
  const [currentProblem, setCurrentProblem] = useState<string | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackLoading, setFeedbackLoading] = useState(false)

  const chapterProblems = practiceProblems.filter(
    (p) => p.chapterId === selectedChapter
  )
  const problem = practiceProblems.find((p) => p.id === currentProblem)
  const chapter = chapters.find((c) => c.id === selectedChapter)

  async function handleSubmit() {
    if (!problem || !userAnswer) return
    const numAnswer = parseFloat(userAnswer)
    if (isNaN(numAnswer)) return

    const isCorrect = Math.abs(numAnswer - problem.answer) <= problem.tolerance
    setResult(isCorrect ? 'correct' : 'incorrect')
    recordPracticeAttempt(problem.chapterId, isCorrect)
    setProgress(getProgress())

    if (!isCorrect) {
      setFeedbackLoading(true)
      try {
        const fb = await getFeedback(
          problem.problemStatement,
          userAnswer,
          String(problem.answer),
          chapters.find((c) => c.id === problem.chapterId)?.number ?? 0
        )
        setFeedback(fb)
      } catch {
        // AI feedback unavailable — show solution steps instead
        setShowSolution(true)
      } finally {
        setFeedbackLoading(false)
      }
    }
  }

  function handleNextProblem() {
    const idx = chapterProblems.findIndex((p) => p.id === currentProblem)
    const next = chapterProblems[idx + 1]
    if (next) {
      setCurrentProblem(next.id)
    } else {
      setCurrentProblem(null)
    }
    setUserAnswer('')
    setResult(null)
    setShowHint(false)
    setShowSolution(false)
    setFeedback('')
  }

  // Problem solving view
  if (problem && chapter) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              setCurrentProblem(null)
              setResult(null)
              setUserAnswer('')
              setShowHint(false)
              setShowSolution(false)
              setFeedback('')
            }}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            &larr; Back to Problems
          </button>
          <button
            onClick={() => setCalcOpen(!calcOpen)}
            className={`text-sm px-4 py-2 rounded-lg transition-colors ${
              calcOpen
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            Calculator
          </button>
        </div>

        <div className="max-w-2xl">
          <h3 className="text-lg font-medium text-white mb-4">
            {problem.title}
          </h3>

          <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 mb-4">
            <p className="text-slate-200">{problem.problemStatement}</p>
          </div>

          {/* Answer input */}
          <div className="flex gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-slate-400">$</span>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !result && handleSubmit()}
                placeholder="Enter your answer"
                disabled={result !== null}
                className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 w-full focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
            </div>
            {result === null ? (
              <button
                onClick={handleSubmit}
                disabled={!userAnswer}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNextProblem}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Next
              </button>
            )}
          </div>

          {/* Result */}
          {result === 'correct' && (
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-4 mb-4">
              <span className="text-green-400 font-medium">Correct!</span>
              <span className="text-slate-400 ml-2">
                The answer is {problem.answer.toLocaleString()}.
              </span>
            </div>
          )}
          {result === 'incorrect' && (
            <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4 mb-4">
              <span className="text-red-400 font-medium">Not quite.</span>
              <span className="text-slate-400 ml-2">
                The correct answer is {problem.answer.toLocaleString()}.
              </span>
            </div>
          )}

          {/* AI Feedback */}
          <AIFeedback feedback={feedback} loading={feedbackLoading} />

          {/* Hint */}
          {!result && (
            <button
              onClick={() => setShowHint(true)}
              className="text-sm text-slate-500 hover:text-slate-300 mt-2"
            >
              {showHint ? '' : 'Show hint'}
            </button>
          )}
          {showHint && !result && (
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mt-2">
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                Hint
              </div>
              <p className="text-sm text-slate-300">{problem.hint}</p>
            </div>
          )}

          {/* Solution steps (fallback when AI is unavailable) */}
          {showSolution && (
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mt-4">
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                Solution
              </div>
              <div className="space-y-1">
                {problem.solutionSteps.map((step, i) => (
                  <div key={i} className="text-sm text-slate-300 font-mono">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}
          {result === 'incorrect' && !showSolution && !feedback && !feedbackLoading && (
            <button
              onClick={() => setShowSolution(true)}
              className="text-sm text-blue-400 hover:text-blue-300 mt-2"
            >
              Show solution steps
            </button>
          )}
        </div>

        <CalculatorPanel isOpen={calcOpen} onClose={() => setCalcOpen(false)} />
      </div>
    )
  }

  // Problem list for a chapter
  if (selectedChapter && chapter) {
    return (
      <div>
        <button
          onClick={() => setSelectedChapter(null)}
          className="text-sm text-blue-400 hover:text-blue-300 mb-4 inline-block"
        >
          &larr; Back to Chapters
        </button>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Chapter {chapter.number}: {chapter.title}
            </h2>
            <p className="text-slate-400 text-sm mt-1">Practice problems</p>
          </div>
          <button
            onClick={() => setCalcOpen(!calcOpen)}
            className={`text-sm px-4 py-2 rounded-lg transition-colors ${
              calcOpen
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            Calculator
          </button>
        </div>
        {chapterProblems.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            Practice problems for this chapter are coming soon.
          </div>
        ) : (
          <div className="grid gap-4">
            {chapterProblems.map((p) => (
              <div
                key={p.id}
                onClick={() => setCurrentProblem(p.id)}
                className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer"
              >
                <h3 className="font-medium text-white">{p.title}</h3>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                  {p.problemStatement}
                </p>
              </div>
            ))}
          </div>
        )}
        <CalculatorPanel isOpen={calcOpen} onClose={() => setCalcOpen(false)} />
      </div>
    )
  }

  // Chapter list
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-2">
        Practice Problems
      </h2>
      <p className="text-slate-400 mb-6">
        Test your understanding with practice problems. Get feedback when you
        make mistakes.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {chapters.map((ch) => {
          const count = practiceProblems.filter(
            (p) => p.chapterId === ch.id
          ).length
          const attempted = progress.practiceAttempts[ch.id] ?? 0
          const correct = progress.practiceCorrect[ch.id] ?? 0
          return (
            <div
              key={ch.id}
              onClick={() => setSelectedChapter(ch.id)}
              className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer"
            >
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                Chapter {ch.number}
              </div>
              <h3 className="font-medium text-white">{ch.title}</h3>
              <p className="text-sm text-slate-400 mt-2">
                {count} problem{count !== 1 ? 's' : ''} available
              </p>
              {attempted > 0 && (
                <div className="mt-3 text-xs text-slate-500">
                  {correct}/{attempted} correct
                  <div className="mt-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${(correct / attempted) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
