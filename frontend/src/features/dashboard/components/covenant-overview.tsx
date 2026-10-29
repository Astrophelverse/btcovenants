import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

const data = [
  { month: 'May', volumeUsd: 14200, btc: 0.15 },
  { month: 'Jun', volumeUsd: 22800, btc: 0.24 },
  { month: 'Jul', volumeUsd: 38400, btc: 0.41 },
  { month: 'Aug', volumeUsd: 51200, btc: 0.54 },
  { month: 'Sep', volumeUsd: 68900, btc: 0.73 },
  { month: 'Oct', volumeUsd: 94850, btc: 1.00 },
]

export function CovenantOverview() {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey='month'
          stroke='currentColor'
          className='text-xs text-muted-foreground'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='currentColor'
          className='text-xs text-muted-foreground'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--popover)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--popover-foreground)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
          }}
          formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'TVL Settled']}
        />
        {/* Pure monochrome bar styling */}
        <Bar
          dataKey='volumeUsd'
          fill='currentColor'
          className='fill-foreground hover:opacity-85 transition-opacity'
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
