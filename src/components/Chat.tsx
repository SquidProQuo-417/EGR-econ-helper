import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import MermaidDiagram from './MermaidDiagram'
import { sendChat } from '../utils/ai'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatProps {
  context?: string
}

type ViewMode = 'rendered' | 'raw'

export default function Chat({ context }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('rendered')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function handleSend() {
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const response = await sendChat(newMessages, context)
      setMessages([...newMessages, { role: 'assistant', content: response }])
    } catch {
      setError(
        'Could not reach the AI tutor. Make sure the server is running (npm run server).'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: '300px' }}>
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Ask Your Tutor</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode('rendered')}
            className={`text-xs px-3 py-1 rounded transition-colors ${
              viewMode === 'rendered'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            Rendered
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`text-xs px-3 py-1 rounded transition-colors ${
              viewMode === 'raw'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 text-sm py-8">
            Ask any question about engineering economy. Your tutor covers
            Chapters 1-8 of Newnan's textbook.
          </div>
        )}
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-200'
              }`}
            >
              {msg.role === 'user' || viewMode === 'raw' ? (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              ) : (
                <div className="markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        if (match && match[1] === 'mermaid') {
                          return (
                            <MermaidDiagram
                              chart={String(children).replace(/\n$/, '')}
                            />
                          )
                        }
                        return (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">
            {error}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
