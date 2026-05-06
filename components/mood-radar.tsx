'use client'

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import type { DimensionScores } from '@/lib/spotify/personality'

interface MoodRadarProps {
  dimensions: DimensionScores
}

export function MoodRadar({ dimensions }: MoodRadarProps) {
  const data = [
    { axis: 'Energy',       value: Math.round(dimensions.energy * 100) },
    { axis: 'Mood',         value: Math.round(dimensions.mood * 100) },
    { axis: 'Danceability', value: Math.round(dimensions.danceability * 100) },
    { axis: 'Acousticness', value: Math.round(dimensions.acousticness * 100) },
    { axis: 'Diversity',    value: Math.round(dimensions.diversity * 100) },
  ]

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: '#111111', border: '1px solid #222222' }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#666' }}>
        Mood Radar
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius={100}>
          <PolarGrid stroke="#222222" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: '#A0A0A0', fontSize: 12 }}
          />
          <Radar
            dataKey="value"
            fill="rgba(29,185,84,0.2)"
            stroke="#1DB954"
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
