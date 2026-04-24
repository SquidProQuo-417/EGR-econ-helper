import { useState, useRef, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'

interface DraggableCardProps {
  children: ReactNode
  onClose: () => void
  title: string
}

export default function DraggableCard({ children, onClose, title }: DraggableCardProps) {
  const [pos, setPos] = useState({ x: 100, y: 100 })
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select, a')) return
    setDragging(true)
    const rect = cardRef.current?.getBoundingClientRect()
    if (rect) {
      dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return
    setPos({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    })
  }, [dragging])

  const handleMouseUp = useCallback(() => {
    setDragging(false)
  }, [])

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragging, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      style={{ left: pos.x, top: pos.y }}
      className="fixed z-50 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl w-80 cursor-move select-none"
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700 bg-slate-750 rounded-t-xl">
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-lg leading-none cursor-pointer"
        >
          x
        </button>
      </div>
      <div className="p-4 cursor-default" onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
