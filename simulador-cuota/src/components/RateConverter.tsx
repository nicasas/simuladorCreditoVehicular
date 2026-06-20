import { useState, useEffect } from 'react';
import { Tooltip } from './Tooltip';
import { convertAllRates, type RateType, type CapitalizationPeriod } from '../utils/financialMath';
import { formatPercent } from '../utils/formatters';

interface RateConverterProps {
  onEMChange: (em: number) => void;
}

const RATE_TYPES: { value: RateType; label: string; short: string }[] = [
  { value: 'EA', label: 'Efectiva Anual', short: 'E.A.' },
  { value: 'EM', label: 'Efectiva Mensual / M.V.', short: 'E.M.' },
  { value: 'NominalAnual', label: 'Nominal Anual', short: 'N.A.' },
  { value: 'NominalMensual', label: 'Nominal Mensual', short: 'N.M.' },
];

const CAPITALIZATION_OPTIONS: { value: CapitalizationPeriod; label: string }[] = [
  { value: 12, label: 'Mensual (M.V.)' },
  { value: 6, label: 'Bimestral' },
  { value: 4, label: 'Trimestral (T.V.)' },
  { value: 3, label: 'Cuatrimestral' },
  { value: 2, label: 'Semestral (S.V.)' },
  { value: 1, label: 'Anual (A.V.)' },
];

const TOOLTIPS: Record<RateType, string> = {
  EA: 'Tasa Efectiva Anual: incluye el efecto del interés compuesto durante un año. Es la tasa "real" anual que pagas.',
  EM: 'Tasa Efectiva Mensual (o Mes Vencido - M.V.): es la tasa mensual real, ya considera la capitalización. Es la que se usa directamente para calcular la cuota.',
  NominalAnual:
    'Tasa Nominal Anual: tasa anual que NO incluye el efecto del interés compuesto. Debes indicar la periodicidad de capitalización (cada cuánto se cobra el interés).',
  NominalMensual:
    'Tasa Nominal Mensual: equivale a dividir la tasa nominal anual entre 12. Para capitalización mensual, es igual a la tasa efectiva mensual.',
};

export function RateConverter({ onEMChange }: RateConverterProps) {
  const [rateType, setRateType] = useState<RateType>('EA');
  const [rateInput, setRateInput] = useState('');
  const [capitalization, setCapitalization] = useState<CapitalizationPeriod>(12);
  const [error, setError] = useState('');

  const rateNum = parseFloat(rateInput.replace(',', '.'));
  const isValid = !isNaN(rateNum) && rateNum > 0 && rateNum < 1000;
  const rates = isValid ? convertAllRates(rateNum / 100, rateType, capitalization) : null;

  useEffect(() => {
    if (rates) {
      onEMChange(rates.em);
    } else {
      onEMChange(NaN);
    }
  }, [rates?.em, rates?.ea]);

  const handleRateInput = (val: string) => {
    setRateInput(val);
    const num = parseFloat(val.replace(',', '.'));
    if (val === '' || isNaN(num)) {
      setError('');
    } else if (num <= 0) {
      setError('La tasa debe ser mayor a 0');
    } else if (num >= 1000) {
      setError('Ingresa la tasa en porcentaje (ej: 24 para 24%)');
    } else {
      setError('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversor de Tasas</h2>

      {/* Rate type selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de tasa que tienes
        </label>
        <div className="grid grid-cols-2 gap-2">
          {RATE_TYPES.map(rt => (
            <button
              key={rt.value}
              type="button"
              onClick={() => setRateType(rt.value)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                rateType === rt.value
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <span className="text-left leading-tight">{rt.label}</span>
              <Tooltip content={TOOLTIPS[rt.value]} />
            </button>
          ))}
        </div>
      </div>

      {/* Capitalization period (only for Nominal Anual) */}
      {rateType === 'NominalAnual' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Periodicidad de capitalización
          </label>
          <select
            value={capitalization}
            onChange={e => setCapitalization(Number(e.target.value) as CapitalizationPeriod)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {CAPITALIZATION_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Rate input */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Valor de la tasa (en %)
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            value={rateInput}
            onChange={e => handleRateInput(e.target.value)}
            placeholder="Ej: 24,5"
            className={`w-full rounded-xl border px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">
            %
          </span>
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        {!error && rateType === 'EM' && (
          <p className="mt-1.5 text-xs text-gray-500">
            M.V. (Mes Vencido) es equivalente a la tasa efectiva mensual.
          </p>
        )}
      </div>

      {/* Conversion results */}
      {rates && (
        <div className="rounded-xl bg-blue-50 border border-blue-100 overflow-hidden">
          <div className="px-4 py-2.5 bg-blue-100 border-b border-blue-200">
            <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">
              Tasas equivalentes
            </p>
          </div>
          <div className="divide-y divide-blue-100">
            <RateRow
              label="Efectiva Anual (E.A.)"
              value={formatPercent(rates.ea, 4)}
              highlight={rateType === 'EA'}
            />
            <RateRow
              label="Efectiva Mensual / M.V. (E.M.)"
              value={formatPercent(rates.em, 4)}
              highlight={rateType === 'EM' || rateType === 'NominalMensual'}
              accent
            />
            <RateRow
              label="Nominal Anual mensual (N.A.M.)"
              value={formatPercent(rates.nominalAnualMensual, 4)}
              highlight={rateType === 'NominalAnual' && capitalization === 12}
            />
            <RateRow
              label="Nominal Mensual (N.M.)"
              value={formatPercent(rates.nominalMensual, 4)}
              highlight={rateType === 'NominalMensual'}
            />
          </div>
          <div className="px-4 py-2 bg-blue-50">
            <p className="text-xs text-blue-700">
              ✦ La <strong>tasa usada para la cuota</strong> es la E.M.:{' '}
              <strong>{formatPercent(rates.em, 4)}</strong>
            </p>
          </div>
        </div>
      )}

      {!rates && rateInput === '' && (
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-400">Ingresa una tasa para ver las equivalencias</p>
        </div>
      )}
    </div>
  );
}

function RateRow({
  label,
  value,
  highlight,
  accent,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-2.5 ${
        highlight ? 'bg-white' : ''
      }`}
    >
      <span
        className={`text-sm ${
          accent ? 'font-semibold text-blue-900' : 'text-blue-800'
        } ${highlight ? 'font-medium' : ''}`}
      >
        {label}
        {highlight && (
          <span className="ml-1.5 text-xs bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded-full">
            ingresada
          </span>
        )}
      </span>
      <span
        className={`text-sm font-mono font-semibold ${
          accent ? 'text-blue-700' : 'text-blue-600'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
