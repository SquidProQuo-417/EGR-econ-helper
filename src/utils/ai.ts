const API_BASE = 'http://localhost:3001'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function sendChat(
  messages: ChatMessage[],
  context?: string
): Promise<string> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context }),
  })
  if (!res.ok) throw new Error('AI request failed')
  const data = await res.json()
  return data.response
}

export async function getFeedback(
  problem: string,
  userAnswer: string,
  correctAnswer: string,
  chapter: number
): Promise<string> {
  const res = await fetch(`${API_BASE}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem, userAnswer, correctAnswer, chapter }),
  })
  if (!res.ok) throw new Error('Feedback request failed')
  const data = await res.json()
  return data.feedback
}
