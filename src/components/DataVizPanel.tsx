import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts'

const correlationData = [
  { name: 'age', age: 1.0, tenure: 0.42, charges: 0.65, churn: -0.23 },
  { name: 'tenure', age: 0.42, tenure: 1.0, charges: 0.78, churn: -0.56 },
  { name: 'charges', age: 0.65, tenure: 0.78, charges: 1.0, churn: 0.31 },
  { name: 'churn', age: -0.23, tenure: -0.56, charges: 0.31, churn: 1.0 },
]

const distributionData = [
  { range: '0-20', count: 1240 },
  { range: '20-40', count: 3890 },
  { range: '40-60', count: 3120 },
  { range: '60-80', count: 1450 },
  { range: '80-100', count: 300 },
]

const pieData = [
  { name: 'Month-to-month', value: 55, color: '#00D68F' },
  { name: 'One year', value: 25, color: '#3B82F6' },
  { name: 'Two year', value: 20, color: '#F5A623' },
]

const scatterData = Array.from({ length: 50 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 200 + Math.random() * 50,
  z: Math.random() * 100,
}))

const tabs = ['Distribution', 'Correlations', 'Scatter', 'Pie Chart']

export default function DataVizPanel() {
  const [activeTab, setActiveTab] = useState('Distribution')

  return (
    <div className="rounded-lg border border-border bg-bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-[13px] font-semibold text-fg">Data Visualization</h3>
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3 py-1.5 text-[12px] transition-colors ${
                activeTab === tab
                  ? 'bg-accent-dim text-accent'
                  : 'text-fg-muted hover:bg-bg-hover hover:text-fg'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'Distribution' && (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2D36" vertical={false} />
                <XAxis dataKey="range" tick={{ fill: '#5C616B', fontSize: 11 }} axisLine={{ stroke: '#2A2D36' }} tickLine={false} />
                <YAxis tick={{ fill: '#5C616B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1C1E26', border: '1px solid #2A2D36', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#EAEAEA', fontWeight: 600 }}
                />
                <Bar dataKey="count" fill="#00D68F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'Correlations' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 text-left text-[11px] font-medium uppercase tracking-wider text-fg-muted"></th>
                  {['age', 'tenure', 'charges', 'churn'].map((h) => (
                    <th key={h} className="p-2 text-left text-[11px] font-medium uppercase tracking-wider text-fg-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {correlationData.map((row) => (
                  <tr key={row.name}>
                    <td className="p-2 text-[13px] font-medium text-fg">{row.name}</td>
                    {['age', 'tenure', 'charges', 'churn'].map((col) => {
                      const val = row[col as keyof typeof row] as number
                      const intensity = Math.abs(val)
                      const bg = val > 0
                        ? `rgba(0, 214, 143, ${intensity * 0.3})`
                        : `rgba(255, 77, 79, ${intensity * 0.3})`
                      return (
                        <td key={col} className="p-2">
                          <span
                            className="inline-block rounded px-2 py-1 text-[13px] font-mono font-medium"
                            style={{ background: bg, color: val > 0 ? '#00D68F' : '#FF4D4F' }}
                          >
                            {val.toFixed(2)}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Scatter' && (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2D36" />
                <XAxis type="number" dataKey="x" name="Feature X" tick={{ fill: '#5C616B', fontSize: 11 }} axisLine={{ stroke: '#2A2D36' }} />
                <YAxis type="number" dataKey="y" name="Feature Y" tick={{ fill: '#5C616B', fontSize: 11 }} axisLine={{ stroke: '#2A2D36' }} />
                <ZAxis type="number" dataKey="z" range={[50, 200]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ background: '#1C1E26', border: '1px solid #2A2D36', borderRadius: '8px', fontSize: '12px' }}
                />
                <Scatter data={scatterData} fill="#00D68F" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'Pie Chart' && (
          <div className="flex h-[300px] items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1C1E26', border: '1px solid #2A2D36', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
