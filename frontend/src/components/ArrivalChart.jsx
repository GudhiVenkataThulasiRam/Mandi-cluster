import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { COLORS, shortName, tooltipStyle } from '../chartTheme.js'
import { useMaxWidth } from '../hooks.js'
import { fmt } from '../utils.js'
import ChartCard from './ChartCard.jsx'

export default function ArrivalChart({ markets }) {
  const mobile = useMaxWidth(600)
  const data = markets
    .filter((m) => m.avgArrival != null)
    .map((m) => ({ name: m.market, 'Average arrival': m.avgArrival }))

  if (!data.length) return null

  const axis = { stroke: COLORS.axis, fontSize: 12, tickLine: false }

  return (
    <ChartCard
      title="Average Produce Arrivals by Market"
      note="Historical average volume of produce arriving at each mandi."
    >
      <div style={{ height: Math.max(280, data.length * 42 + 60), width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 24, left: 0, bottom: 8 }}
            barCategoryGap="24%"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={COLORS.grid} />
            <XAxis type="number" {...axis} tickFormatter={(v) => fmt(v, 0)} />
            <YAxis
              type="category"
              dataKey="name"
              width={mobile ? 100 : 150}
              interval={0}
              {...axis}
              tickFormatter={(s) => shortName(s, mobile ? 13 : 22)}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: 'rgba(22, 163, 74, 0.06)' }}
              formatter={(v) => [fmt(v, 1), 'Arrivals']}
            />
            <Bar dataKey="Average arrival" fill={COLORS.fresh} radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
