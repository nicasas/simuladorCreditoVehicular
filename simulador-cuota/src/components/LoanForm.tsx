import { formatCOP } from '../utils/formatters';

interface LoanFormProps {
  amount: string;
  term: string;
  onAmountChange: (val: string) => void;
  onTermChange: (val: string) => void;
  hasValidRate: boolean;
}

export function LoanForm({ amount, term, onAmountChange, onTermChange, hasValidRate }: LoanFormProps) {
  const amountNum = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
  const termNum = parseInt(term, 10);

  const amountError =
    amount !== '' && (isNaN(amountNum) || amountNum <= 0)
      ? 'Ingresa un monto válido mayor a $0'
      : '';
  const termError =
    term !== ''
      ? isNaN(termNum) || termNum <= 0
        ? 'Ingresa un plazo válido'
        : termNum > 600
        ? 'Máximo 600 meses (50 años)'
        : ''
      : '';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Datos del Crédito</h2>
      <p className="text-sm text-gray-500 mb-4">
        Sistema de amortización: <strong>cuota fija (francés)</strong>
      </p>

      {!hasValidRate && (
        <div className="mb-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <span className="text-amber-500 text-base mt-0.5">⚠</span>
          <p className="text-xs text-amber-700">
            Ingresa primero una tasa de interés válida en el conversor de arriba para calcular la
            cuota.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto a financiar
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              $
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={e => {
                // Only allow digits and dots (for thousand separators)
                const val = e.target.value.replace(/[^0-9.]/g, '');
                onAmountChange(val);
              }}
              placeholder="50.000.000"
              className={`w-full rounded-xl border pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                amountError ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
          </div>
          {amountError && <p className="mt-1.5 text-xs text-red-600">{amountError}</p>}
          {!amountError && amountNum > 0 && !isNaN(amountNum) && (
            <p className="mt-1.5 text-xs text-gray-500">{formatCOP(amountNum)}</p>
          )}
        </div>

        {/* Term */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Plazo</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={term}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                onTermChange(val);
              }}
              placeholder="60"
              className={`w-full rounded-xl border px-4 py-3 pr-20 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                termError ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              meses
            </span>
          </div>
          {termError && <p className="mt-1.5 text-xs text-red-600">{termError}</p>}
          {!termError && termNum > 0 && !isNaN(termNum) && (
            <p className="mt-1.5 text-xs text-gray-500">
              {termNum >= 12
                ? `${Math.floor(termNum / 12)} año${Math.floor(termNum / 12) !== 1 ? 's' : ''}${
                    termNum % 12 > 0 ? ` y ${termNum % 12} mes${termNum % 12 !== 1 ? 'es' : ''}` : ''
                  }`
                : `${termNum} mes${termNum !== 1 ? 'es' : ''}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
