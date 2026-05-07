'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from '@/components/recharts-wrapper'

interface GenreChartProps {
  genreBreakdown: Array<{ name: string; count: number }>
}

const COLORS = ['#1DB954', '#17A34A', '#15803D', '#3B82F6', '#8B5CF6', '#F59E0B', '#6B7280']

interface TooltipPayloadEntry {
  name: string
  value: number
  payload: { name: string; count: number }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadEntry[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  const total = payload.reduce((sum, p) => sum + p.value, 0) || 1
  const pct = Math.round((entry.value / total) * 100)
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm"
      style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff' }}
    >
      <span className="font-medium capitalize">{entry.name}</span>
      <span className="ml-2" style={{ color: '#1DB954' }}>
        {pct}%
      </span>
    </div>
  )
}

export function GenreChart({ genreBreakdown }: GenreChartProps) {
  const top6 = genreBreakdown.slice(0, 6)
  const otherCount = genreBreakdown.slice(6).reduce((sum, g) => sum + g.count, 0)

  const chartData = [
    ...top6,
    ...(otherCount > 0 ? [{ name: 'Other', count: otherCount }] : []),
  ]

  const total = chartData.reduce((sum, d) => sum + d.count, 0)

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: '#111111', border: '1px solid #222222' }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#666' }}>
        Genre DNA
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 justify-center">
        {chartData.slice(0, 6).map((entry, i) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="text-xs capitalize truncate max-w-[80px]" style={{ color: '#A0A0A0' }}>
              {entry.name}
            </span>
            <span className="text-xs" style={{ color: '#555' }}>
              {Math.round((entry.count / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
