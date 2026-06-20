import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCOP } from '../utils/formatters';
import type { AmortizationRow } from '../utils/financialMath';

interface AmortizationChartProps {
  schedule: AmortizationRow[];
}

// Sample data for very long loans so the chart stays readable
function sampleSchedule(schedule: AmortizationRow[], maxPoints = 60): AmortizationRow[] {
  if (schedule.length <= maxPoints) return schedule;
  const step = Math.ceil(schedule.length / maxPoints);
  return schedule.filter((_, i) => i % step === 0 || i === schedule.length - 1);
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl min-w-[160px]">
      <p className="font-semibold mb-2">Mes {label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4 mb-1">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono">{formatCOP(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function AmortizationChart({ schedule }: AmortizationChartProps) {
  const data = sampleSchedule(schedule).map(row => ({
    month: row.month,
    Interés: Math.round(row.interest),
    Capital: Math.round(row.principal),
    Saldo: Math.round(row.balance),
  }));

  const formatYAxis = (value: number) => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
    return `$${value}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Evolución del Crédito</h2>
      <p className="text-xs text-gray-500 mb-4">
        Composición de cada cuota y saldo pendiente por mes
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Mes', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#94a3b8' }}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={formatYAxis}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={formatYAxis}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
            iconType="circle"
            iconSize={8}
          />
          <Bar yAxisId="left" dataKey="Interés" stackId="payment" fill="#f59e0b" radius={[0, 0, 0, 0]} />
          <Bar yAxisId="left" dataKey="Capital" stackId="payment" fill="#10b981" radius={[2, 2, 0, 0]} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="Saldo"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-3 mt-3 justify-center">
        <LegendItem color="#f59e0b" label="Interés (eje izq.)" />
        <LegendItem color="#10b981" label="Capital (eje izq.)" />
        <LegendItem color="#2563eb" label="Saldo (eje der.)" line />
      </div>
    </div>
  );
}

function LegendItem({ color, label, line }: { color: string; label: string; line?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-600">
      {line ? (
        <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: color }} />
      ) : (
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
      )}
      <span>{label}</span>
    </div>
  );
}
