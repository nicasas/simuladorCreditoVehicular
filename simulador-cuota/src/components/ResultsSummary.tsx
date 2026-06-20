import { formatCOP, formatPercent } from '../utils/formatters';
import type { LoanResult } from '../utils/financialMath';

interface ResultsSummaryProps {
  result: LoanResult;
  principal: number;
  em: number;
  termMonths: number;
  insuranceMonthly: number;
  soatMonthly: number;
}

export function ResultsSummary({
  result,
  principal,
  em,
  termMonths,
  insuranceMonthly,
  soatMonthly,
}: ResultsSummaryProps) {
  const additionalMonthly = insuranceMonthly + soatMonthly;
  const totalMonthly = result.monthlyPayment + additionalMonthly;
  const hasAdditional = additionalMonthly > 0;

  const totalPaidWithCosts = result.totalPayment + additionalMonthly * termMonths;
  const interestRatio = result.totalInterest / result.totalPayment;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Crédito</h2>

      {/* Main highlight: monthly payment */}
      <div className={`rounded-2xl p-5 mb-4 text-white text-center ${hasAdditional ? 'bg-gray-700' : 'bg-blue-600'}`}>
        {hasAdditional && (
          <p className="text-gray-300 text-xs font-medium mb-1">Cuota base del crédito</p>
        )}
        {!hasAdditional && (
          <p className="text-blue-200 text-sm font-medium mb-1">Cuota mensual</p>
        )}
        <p className={`font-bold tracking-tight ${hasAdditional ? 'text-2xl text-gray-100' : 'text-4xl'}`}>
          {formatCOP(result.monthlyPayment)}
        </p>
        <p className={`text-xs mt-1 ${hasAdditional ? 'text-gray-400' : 'text-blue-300'}`}>
          durante {termMonths} mes{termMonths !== 1 ? 'es' : ''}
        </p>
      </div>

      {/* Additional costs breakdown */}
      {hasAdditional && (
        <div className="space-y-2 mb-4">
          {insuranceMonthly > 0 && (
            <CostRow icon="🛡️" label="Seguro todo riesgo / mes" value={formatCOP(insuranceMonthly)} color="emerald" />
          )}
          {soatMonthly > 0 && (
            <CostRow icon="📋" label="SOAT / mes" value={formatCOP(soatMonthly)} color="emerald" />
          )}

          {/* Total monthly highlight */}
          <div className="bg-blue-600 rounded-2xl p-4 text-white text-center mt-3">
            <p className="text-blue-200 text-xs font-medium mb-1">Cuota mensual total</p>
            <p className="text-3xl font-bold tracking-tight">{formatCOP(totalMonthly)}</p>
            <p className="text-blue-300 text-xs mt-1">
              crédito + seguros · {termMonths} mes{termMonths !== 1 ? 'es' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <MetricCard
          label="Total intereses"
          value={formatCOP(result.totalInterest)}
          sub={`${(interestRatio * 100).toLocaleString('es-CO', { maximumFractionDigits: 1 })}% del total`}
          color="amber"
        />
        <MetricCard
          label={hasAdditional ? 'Total pagado (sin seguros)' : 'Total pagado'}
          value={formatCOP(result.totalPayment)}
          sub="capital + intereses"
          color="gray"
        />
      </div>

      {hasAdditional && (
        <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-100 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-800">
              Total seguros ({termMonths} meses)
            </span>
            <span className="text-sm font-bold text-emerald-700 font-mono">
              {formatCOP(additionalMonthly * termMonths)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-emerald-200">
            <span className="text-sm font-semibold text-gray-900">
              Costo total del vehículo
            </span>
            <span className="text-sm font-bold text-gray-900 font-mono">
              {formatCOP(totalPaidWithCosts)}
            </span>
          </div>
        </div>
      )}

      {/* Detail breakdown */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 divide-y divide-gray-100">
        <DetailRow label="Capital financiado" value={formatCOP(principal)} />
        <DetailRow label="Intereses totales" value={formatCOP(result.totalInterest)} />
        <DetailRow label="Total a pagar (crédito)" value={formatCOP(result.totalPayment)} bold />
        {hasAdditional && (
          <>
            <DetailRow label="Cuota base crédito" value={formatCOP(result.monthlyPayment)} />
            {insuranceMonthly > 0 && (
              <DetailRow label="Seguro todo riesgo / mes" value={formatCOP(insuranceMonthly)} />
            )}
            {soatMonthly > 0 && (
              <DetailRow label="SOAT / mes" value={formatCOP(soatMonthly)} />
            )}
            <DetailRow label="Cuota total mensual" value={formatCOP(totalMonthly)} bold accent />
          </>
        )}
        <DetailRow label="Tasa E.M. aplicada" value={formatPercent(em, 4)} />
        <DetailRow
          label="Tasa E.A. equivalente"
          value={formatPercent(Math.pow(1 + em, 12) - 1, 4)}
        />
      </div>
    </div>
  );
}

function CostRow({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: 'emerald';
}) {
  return (
    <div className={`flex items-center justify-between rounded-xl px-3 py-2.5 bg-${color}-50 border border-${color}-100`}>
      <span className="text-sm text-emerald-800">
        {icon} {label}
      </span>
      <span className="text-sm font-semibold text-emerald-700 font-mono">+ {value}</span>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: 'amber' | 'gray';
}) {
  const bg = color === 'amber' ? 'bg-amber-50 border-amber-100' : 'bg-gray-50 border-gray-100';
  const text = color === 'amber' ? 'text-amber-700' : 'text-gray-900';
  const subText = color === 'amber' ? 'text-amber-500' : 'text-gray-500';

  return (
    <div className={`rounded-xl border p-3 ${bg}`}>
      <p className="text-xs font-medium text-gray-600 mb-1">{label}</p>
      <p className={`text-base font-bold ${text} leading-tight`}>{value}</p>
      <p className={`text-xs mt-0.5 ${subText}`}>{sub}</p>
    </div>
  );
}

function DetailRow({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between px-4 py-2.5 ${accent ? 'bg-blue-50' : ''}`}>
      <span
        className={`text-sm ${
          accent ? 'font-bold text-blue-900' : bold ? 'font-semibold text-gray-900' : 'text-gray-600'
        }`}
      >
        {label}
      </span>
      <span
        className={`text-sm font-mono ${
          accent
            ? 'font-bold text-blue-700'
            : bold
            ? 'font-bold text-gray-900'
            : 'font-medium text-gray-800'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
