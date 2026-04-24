const STORAGE_KEY = 'egr-econ-progress'

export interface Progress {
  completedLessons: string[]
  practiceAttempts: Record<string, number>
  practiceCorrect: Record<string, number>
}

const defaultProgress: Progress = {
  completedLessons: [],
  practiceAttempts: {},
  practiceCorrect: {},
}

export function getProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress
    return { ...defaultProgress, ...JSON.parse(raw) }
  } catch {
    return defaultProgress
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function markLessonComplete(chapterId: string): void {
  const progress = getProgress()
  if (!progress.completedLessons.includes(chapterId)) {
    progress.completedLessons.push(chapterId)
    saveProgress(progress)
  }
}

export function recordPracticeAttempt(
  chapterId: string,
  correct: boolean
): void {
  const progress = getProgress()
  progress.practiceAttempts[chapterId] =
    (progress.practiceAttempts[chapterId] ?? 0) + 1
  if (correct) {
    progress.practiceCorrect[chapterId] =
      (progress.practiceCorrect[chapterId] ?? 0) + 1
  }
  saveProgress(progress)
}
