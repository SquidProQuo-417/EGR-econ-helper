import { motion } from 'framer-motion'
import type { CashFlow } from '../utils/calc'

interface CashFlowDiagramProps {
  cashFlows: CashFlow[]
  periods: number
  onClickPeriod?: (period: number) => void
  animated?: boolean
}

export default function CashFlowDiagram({
  cashFlows,
  periods,
  onClickPeriod,
  animated = false,
}: CashFlowDiagramProps) {
  const width = 700
  const height = 300
  const padding = { top: 60, bottom: 60, left: 50, right: 50 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  const midY = padding.top + chartHeight / 2

  const maxAbs = Math.max(
    1,
    ...cashFlows.map((cf) => Math.abs(cf.amount))
  )
  const maxArrowHeight = chartHeight / 2 - 10

  const periodSpacing = periods > 0 ? chartWidth / periods : chartWidth

  function getX(period: number) {
    return padding.left + period * periodSpacing
  }

  function getArrowHeight(amount: number) {
    return (Math.abs(amount) / maxAbs) * maxArrowHeight
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      style={{ maxHeight: '300px' }}
    >
      {/* Timeline */}
      <line
        x1={padding.left}
        y1={midY}
        x2={width - padding.right}
        y2={midY}
        stroke="#475569"
        strokeWidth={2}
      />

      {/* Period markers and click zones */}
      {Array.from({ length: periods + 1 }, (_, i) => {
        const x = getX(i)
        return (
          <g key={i}>
            <line
              x1={x}
              y1={midY - 5}
              x2={x}
              y2={midY + 5}
              stroke="#64748b"
              strokeWidth={1.5}
            />
            <text
              x={x}
              y={midY + 22}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize={12}
            >
              {i}
            </text>
            {/* Clickable zone */}
            {onClickPeriod && (
              <rect
                x={x - periodSpacing / 2}
                y={0}
                width={periodSpacing}
                height={height}
                fill="transparent"
                className="cursor-pointer"
                onClick={() => onClickPeriod(i)}
              />
            )}
          </g>
        )
      })}

      {/* Cash flow arrows */}
      {cashFlows.map((cf, idx) => {
        const x = getX(cf.period)
        const arrowH = getArrowHeight(cf.amount)
        const isPositive = cf.amount >= 0
        const y1 = midY
        const y2 = isPositive ? midY - arrowH : midY + arrowH
        const color = isPositive ? '#22c55e' : '#ef4444'
        const arrowDir = isPositive ? -1 : 1

        const Arrow = animated ? motion.g : 'g'
        const animProps = animated
          ? {
              initial: { opacity: 0, scaleY: 0 },
              animate: { opacity: 1, scaleY: 1 },
              transition: { delay: idx * 0.15, duration: 0.4 },
            }
          : {}

        return (
          <Arrow
            key={`${cf.period}-${idx}`}
            style={{ transformOrigin: `${x}px ${midY}px` }}
            {...animProps}
          >
            {/* Arrow shaft */}
            <line
              x1={x}
              y1={y1}
              x2={x}
              y2={y2}
              stroke={color}
              strokeWidth={2.5}
            />
            {/* Arrow head */}
            <polygon
              points={`${x},${y2} ${x - 5},${y2 + arrowDir * 8} ${x + 5},${y2 + arrowDir * 8}`}
              fill={color}
            />
            {/* Amount label */}
            <text
              x={x}
              y={isPositive ? y2 - 8 : y2 + 18}
              textAnchor="middle"
              fill={color}
              fontSize={11}
              fontWeight="bold"
            >
              {cf.label || `$${Math.abs(cf.amount).toLocaleString()}`}
            </text>
          </Arrow>
        )
      })}

      {/* Axis labels */}
      <text
        x={width / 2}
        y={height - 5}
        textAnchor="middle"
        fill="#64748b"
        fontSize={12}
      >
        Period (n)
      </text>
    </svg>
  )
}
