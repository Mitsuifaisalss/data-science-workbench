import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

const data = [
  { date: 'Apr 18', model: 0.58, baseline: 0.42 },
  { date: 'Apr 19', model: 0.62, baseline: 0.43 },
  { date: 'Apr 20', model: 0.60, baseline: 0.41 },
  { date: 'Apr 21', model: 0.64, baseline: 0.44 },
  { date: 'Apr 22', model: 0.63, baseline: 0.43 },
  { date: 'Apr 23', model: 0.67, baseline: 0.45 },
  { date: 'Apr 24', model: 0.66, baseline: 0.44 },
  { date: 'Apr 25', model: 0.69, baseline: 0.46 },
  { date: 'Apr 26', model: 0.68, baseline: 0.45 },
  { date: 'Apr 27', model: 0.71, baseline: 0.47 },
  { date: 'Apr 28', model: 0.70, baseline: 0.46 },
  { date: 'Apr 29', model: 0.73, baseline: 0.48 },
  { date: 'Apr 30', model: 0.72, baseline: 0.47 },
  { date: 'May 1', model: 0.75, baseline: 0.49 },
  { date: 'May 2', model: 0.74, baseline: 0.48 },
  { date: 'May 3', model: 0.77, baseline: 0.50 },
  { date: 'May 4', model: 0.76, baseline: 0.49 },
  { date: 'May 5', model: 0.79, baseline: 0.51 },
  { date: 'May 6', model: 0.78, baseline: 0.50 },
  { date: 'May 7', model: 0.81, baseline: 0.52 },
  { date: 'May 8', model: 0.80, baseline: 0.51 },
  { date: 'May 9', model: 0.83, baseline: 0.53 },
  { date: 'May 10', model: 0.82, baseline: 0.52 },
  { date: 'May 11', model: 0.85, baseline: 0.54 },
  { date: 'May 12', model: 0.84, baseline: 0.53 },
  { date: 'May 13', model: 0.86, baseline: 0.55 },
  { date: 'May 14', model: 0.85, baseline: 0.54 },
  { date: 'May 15', model: 0.87, baseline: 0.55 },
  { date: 'May 16', model: 0.86, baseline: 0.52 },
]

export default function PredictionChart() {
  return (
    <div className="rounded-lg border border-border bg-bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-[13px] font-semibold text-fg">Prediction Score Over Time</h3>
          <button className="flex h-5 w-5 items-center justify-center rounded-full text-fg-dim hover:text-fg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-md border border-border bg-bg-input px-2.5 py-1 text-[12px] text-fg outline-none focus:border-accent">
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
          <select className="rounded-md border border-border bg-bg-input px-2.5 py-1 text-[12px] text-fg outline-none focus:border-accent">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-fg-dim hover:bg-bg-hover hover:text-fg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
              <circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 pt-3">
        <div className="flex items-center gap-1.5">
          <span className="h-[2px] w-4 bg-accent" />
          <span className="text-[12px] text-fg-muted">Model: Churn Predictor (v3)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-[2px] w-4 border-t border-dashed border-fg-dim" />
          <span className="text-[12px] text-fg-dim">Baseline</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] px-2 pb-2 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2D36" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#5C616B', fontSize: 11 }}
              axisLine={{ stroke: '#2A2D36' }}
              tickLine={false}
              interval={4}
            />
            <YAxis
              domain={[0, 1]}
              tick={{ fill: '#5C616B', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v.toFixed(2)}
            />
            <Tooltip
              contentStyle={{
                background: '#1C1E26',
                border: '1px solid #2A2D36',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#EAEAEA', fontWeight: 600 }}
              itemStyle={{ color: '#8B8F99' }}
            />
            <Line
              type="monotone"
              dataKey="model"
              stroke="#00D68F"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#00D68F', stroke: '#111318', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="#5C616B"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />

            <ReferenceLine
              y={0.86}
              stroke="#00D68F"
              strokeDasharray=""
              label={{
                value: '0.86',
                position: 'right',
                fill: '#00D68F',
                fontSize: 11,
                fontWeight: 600,
              }}
            />
            <ReferenceLine
              y={0.52}
              stroke="#5C616B"
              strokeDasharray=""
              label={{
                value: '0.52',
                position: 'right',
                fill: '#5C616B',
                fontSize: 11,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
