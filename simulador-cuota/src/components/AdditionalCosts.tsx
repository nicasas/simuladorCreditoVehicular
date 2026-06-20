import { useState } from 'react';
import { formatCOP } from '../utils/formatters';

interface AdditionalCostsProps {
  insuranceAnnual: string;
  soatAnnual: string;
  onInsuranceChange: (val: string) => void;
  onSoatChange: (val: string) => void;
}

function parseCOP(val: string): number {
  return parseFloat(val.replace(/\./g, '').replace(',', '.'));
}

export function AdditionalCosts({
  insuranceAnnual,
  soatAnnual,
  onInsuranceChange,
  onSoatChange,
}: AdditionalCostsProps) {
  const [open, setOpen] = useState(false);

  const insuranceNum = parseCOP(insuranceAnnual);
  const soatNum = parseCOP(soatAnnual);

  const insuranceMonthly = !isNaN(insuranceNum) && insuranceNum > 0 ? insuranceNum / 12 : 0;
  const soatMonthly = !isNaN(soatNum) && soatNum > 0 ? soatNum / 12 : 0;
  const totalMonthly = insuranceMonthly + soatMonthly;

  const hasValues = insuranceMonthly > 0 || soatMonthly > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Costos adicionales</p>
            <p className="text-xs text-gray-500">
              {hasValues && !open
                ? `+ ${formatCOP(totalMonthly)} / mes`
                : 'Seguro todo riesgo y SOAT · opcional'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasValues && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
              activo
            </span>
          )}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {/* Expandable content */}
      {open && (
        <div className="px-4 md:px-6 pb-5 space-y-4 border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            Ingresa el valor <strong>anual</strong> de cada costo. Se dividirá entre 12 para sumarlo
            a la cuota mensual del crédito.
          </p>

          <CostInput
            label="Seguro todo riesgo"
            description="Póliza que cubre daños propios, robo y responsabilidad civil"
            icon="🛡️"
            value={insuranceAnnual}
            monthlyValue={insuranceMonthly}
            onChange={onInsuranceChange}
          />

          <CostInput
            label="SOAT"
            description="Seguro Obligatorio de Accidentes de Tránsito (valor vigencia anual)"
            icon="📋"
            value={soatAnnual}
            monthlyValue={soatMonthly}
            onChange={onSoatChange}
          />

          {/* Mini summary */}
          {hasValues && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-800">
                  Total costos adicionales / mes
                </span>
                <span className="text-sm font-bold text-emerald-700 font-mono">
                  + {formatCOP(totalMonthly)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CostInput({
  label,
  description,
  icon,
  value,
  monthlyValue,
  onChange,
}: {
  label: string;
  description: string;
  icon: string;
  value: string;
  monthlyValue: number;
  onChange: (val: string) => void;
}) {
  const num = parseFloat(value.replace(/\./g, '').replace(',', '.'));
  const hasError = value !== '' && (isNaN(num) || num < 0);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {icon} {label}{' '}
        <span className="font-normal text-gray-400">(anual)</span>
      </label>
      <p className="text-xs text-gray-400 mb-2">{description}</p>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
          $
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
          placeholder="0"
          className={`w-full rounded-xl border pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            hasError ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
      </div>
      {hasError && <p className="mt-1 text-xs text-red-600">Ingresa un valor válido</p>}
      {!hasError && monthlyValue > 0 && (
        <p className="mt-1.5 text-xs text-gray-500">
          {formatCOP(num)} ÷ 12 ={' '}
          <strong className="text-emerald-700">{formatCOP(monthlyValue)} / mes</strong>
        </p>
      )}
    </div>
  );
}
