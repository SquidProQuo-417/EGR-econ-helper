import { useState } from 'react'
import { chapters } from '../data/chapters'
import { getProgress, markLessonComplete } from '../utils/storage'
import Chat from '../components/Chat'

export default function Lessons() {
  const [progress, setProgress] = useState(getProgress)
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)

  const chapter = chapters.find((c) => c.id === selectedChapter)

  function handleComplete(chapterId: string) {
    markLessonComplete(chapterId)
    setProgress(getProgress())
  }

  if (chapter) {
    return (
      <div>
        <button
          onClick={() => setSelectedChapter(null)}
          className="text-sm text-blue-400 hover:text-blue-300 mb-4 inline-block"
        >
          &larr; Back to Chapters
        </button>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Chapter {chapter.number}: {chapter.title}
            </h2>
            <p className="text-slate-400 mt-1">{chapter.description}</p>
          </div>
          {!progress.completedLessons.includes(chapter.id) && (
            <button
              onClick={() => handleComplete(chapter.id)}
              className="bg-green-600 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-lg transition-colors shrink-0"
            >
              Mark Complete
            </button>
          )}
          {progress.completedLessons.includes(chapter.id) && (
            <span className="text-green-400 text-sm bg-green-900/20 px-3 py-2 rounded-lg shrink-0">
              Completed
            </span>
          )}
        </div>

        <Chat
          context={`The student is studying Chapter ${chapter.number}: ${chapter.title}. ${chapter.description}`}
        />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-2">Chapters</h2>
      <p className="text-slate-400 mb-6">
        Select a chapter to start learning. Your AI tutor will guide you through
        the material.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {chapters.map((ch) => {
          const completed = progress.completedLessons.includes(ch.id)
          return (
            <div
              key={ch.id}
              onClick={() => setSelectedChapter(ch.id)}
              className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    completed
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {completed ? '\u2713' : ch.number}
                </div>
                <div>
                  <h3 className="font-medium text-white">{ch.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {ch.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
