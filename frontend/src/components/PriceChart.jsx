import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { COLORS, shortName, tooltipStyle } from '../chartTheme.js'
import { useMaxWidth } from '../hooks.js'
import { fmt } from '../utils.js'
import ChartCard from './ChartCard.jsx'

export default function PriceChart({ markets }) {
  const mobile = useMaxWidth(600)
  const data = markets.map((m) => ({
    name: m.market,
    'Average price': m.avgPrice,
    'Min price': m.minPrice,
    'Max price': m.maxPrice,
    'Std deviation': m.stdPrice,
  }))

  const hasRange = data.some((d) => d['Min price'] != null && d['Max price'] != null)
  const hasStd = data.some((d) => d['Std deviation'] != null)
  const axis = { stroke: COLORS.axis, fontSize: 12, tickLine: false }
  const yw = mobile ? 100 : 150

  const make = (bars, h) => (
    <div style={{ height: h, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 0, bottom: 8 }}
          barCategoryGap="24%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={COLORS.grid} />
          <XAxis type="number" {...axis} tickFormatter={(v) => `₹${fmt(v, 0)}`} />
          <YAxis
            type="category"
            dataKey="name"
            width={yw}
            interval={0}
            {...axis}
            tickFormatter={(s) => shortName(s, mobile ? 13 : 22)}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: 'rgba(22, 163, 74, 0.06)' }}
            formatter={(v) => (v == null ? '—' : `₹${fmt(v, 2)}`)}
          />
          {bars}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )

  const rowH = hasRange ? 68 : 42

  return (
    <>
      <ChartCard
        title="Historical Price Range by Market"
        note={
          hasRange
            ? 'Comparison of minimum, average, and peak historical prices (₹/quintal) for each market.'
            : 'Average historical price per market (₹/quintal).'
        }
      >
        {make(
          hasRange ? (
            <>
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar dataKey="Min price" fill={COLORS.light} radius={[0, 4, 4, 0]} />
              <Bar dataKey="Average price" fill={COLORS.green} radius={[0, 4, 4, 0]} />
              <Bar dataKey="Max price" fill={COLORS.forest} radius={[0, 4, 4, 0]} />
            </>
          ) : (
            <Bar dataKey="Average price" fill={COLORS.green} radius={[0, 6, 6, 0]} />
          ),
          Math.max(280, data.length * rowH + 60)
        )}
      </ChartCard>

      {hasStd && (
        <ChartCard
          title="Price Volatility (Standard Deviation)"
          note="Higher standard deviation indicates greater historical price fluctuations in that market."
        >
          {make(
            <Bar dataKey="Std deviation" fill={COLORS.amber} radius={[0, 6, 6, 0]} />,
            Math.max(280, data.length * 42 + 60)
          )}
        </ChartCard>
      )}
    </>
  )
}
