import { useState } from 'react'
import { chapters } from '../data/chapters'
import { walkthroughs } from '../data/problems'
import WalkthroughStep from '../components/WalkthroughStep'
import CashFlowDiagram from '../components/CashFlowDiagram'

export default function Walkthroughs() {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)
  const [selectedWalkthrough, setSelectedWalkthrough] = useState<string | null>(
    null
  )
  const [visibleSteps, setVisibleSteps] = useState(1)

  const chapterWalkthroughs = walkthroughs.filter(
    (w) => w.chapterId === selectedChapter
  )
  const walkthrough = walkthroughs.find((w) => w.id === selectedWalkthrough)

  function handleNextStep() {
    if (walkthrough && visibleSteps < walkthrough.steps.length) {
      setVisibleSteps(visibleSteps + 1)
    }
  }

  function handlePrevStep() {
    if (visibleSteps > 1) {
      setVisibleSteps(visibleSteps - 1)
    }
  }

  // Walkthrough detail view
  if (walkthrough) {
    return (
      <div>
        <button
          onClick={() => {
            setSelectedWalkthrough(null)
            setVisibleSteps(1)
          }}
          className="text-sm text-blue-400 hover:text-blue-300 mb-4 inline-block"
        >
          &larr; Back to Walkthroughs
        </button>

        <h2 className="text-xl font-semibold text-white mb-2">
          {walkthrough.title}
        </h2>

        {/* Problem Statement */}
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 mb-6">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">
            Problem
          </div>
          <p className="text-slate-200">{walkthrough.problemStatement}</p>
        </div>

        {/* Cash Flow Diagram */}
        {walkthrough.cashFlows && walkthrough.periods && (
          <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 mb-6">
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">
              Cash Flow Diagram
            </div>
            <div className="bg-slate-900 rounded-lg p-2">
              <CashFlowDiagram
                cashFlows={walkthrough.cashFlows}
                periods={walkthrough.periods}
                animated
              />
            </div>
          </div>
        )}

        {/* Steps */}
        <div className="space-y-4 mb-6">
          {walkthrough.steps.map((step, i) => (
            <WalkthroughStep
              key={i}
              step={step}
              stepNumber={i + 1}
              isVisible={i < visibleSteps}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            disabled={visibleSteps <= 1}
            className="bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-slate-200 text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Previous Step
          </button>
          <span className="text-sm text-slate-500">
            Step {visibleSteps} of {walkthrough.steps.length}
          </span>
          {visibleSteps < walkthrough.steps.length ? (
            <button
              onClick={handleNextStep}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Next Step
            </button>
          ) : (
            <div className="bg-green-900/20 text-green-400 text-sm px-4 py-2 rounded-lg">
              Answer: {walkthrough.answer}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Chapter walkthrough list
  if (selectedChapter) {
    const chapter = chapters.find((c) => c.id === selectedChapter)!
    return (
      <div>
        <button
          onClick={() => setSelectedChapter(null)}
          className="text-sm text-blue-400 hover:text-blue-300 mb-4 inline-block"
        >
          &larr; Back to Chapters
        </button>
        <h2 className="text-xl font-semibold text-white mb-2">
          Chapter {chapter.number}: {chapter.title}
        </h2>
        <p className="text-slate-400 mb-6">
          Step-by-step walkthroughs for this chapter.
        </p>
        {chapterWalkthroughs.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            Walkthroughs for this chapter are coming soon.
          </div>
        ) : (
          <div className="grid gap-4">
            {chapterWalkthroughs.map((w) => (
              <div
                key={w.id}
                onClick={() => setSelectedWalkthrough(w.id)}
                className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer"
              >
                <h3 className="font-medium text-white">{w.title}</h3>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                  {w.problemStatement}
                </p>
                <div className="text-xs text-slate-500 mt-2">
                  {w.steps.length} steps
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Chapter list
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-2">
        Problem Walkthroughs
      </h2>
      <p className="text-slate-400 mb-6">
        Step-by-step solutions showing how to identify the problem type, pick
        the right equation, and work through the math.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {chapters.map((chapter) => {
          const count = walkthroughs.filter(
            (w) => w.chapterId === chapter.id
          ).length
          return (
            <div
              key={chapter.id}
              onClick={() => setSelectedChapter(chapter.id)}
              className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer"
            >
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                Chapter {chapter.number}
              </div>
              <h3 className="font-medium text-white">{chapter.title}</h3>
              <p className="text-sm text-slate-400 mt-2">
                {count} walkthrough{count !== 1 ? 's' : ''} available
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
