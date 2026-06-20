import { useState, useMemo } from 'react';
import { RateConverter } from './components/RateConverter';
import { LoanForm } from './components/LoanForm';
import { AdditionalCosts } from './components/AdditionalCosts';
import { ResultsSummary } from './components/ResultsSummary';
import { AmortizationTable } from './components/AmortizationTable';
import { AmortizationChart } from './components/AmortizationChart';
import { calculateLoan } from './utils/financialMath';

function parseCOP(val: string): number {
  return parseFloat(val.replace(/\./g, '').replace(',', '.'));
}

export default function App() {
  const [em, setEM] = useState<number>(NaN);
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [insuranceAnnual, setInsuranceAnnual] = useState('');
  const [soatAnnual, setSoatAnnual] = useState('');

  const principal = parseCOP(amount);
  const termNum = parseInt(term, 10);

  const isReady =
    !isNaN(em) &&
    em > 0 &&
    !isNaN(principal) &&
    principal > 0 &&
    !isNaN(termNum) &&
    termNum > 0 &&
    termNum <= 600;

  const loanResult = useMemo(() => {
    if (!isReady) return null;
    return calculateLoan(principal, em, termNum);
  }, [isReady, principal, em, termNum]);

  const insuranceNum = parseCOP(insuranceAnnual);
  const soatNum = parseCOP(soatAnnual);
  const insuranceMonthly = !isNaN(insuranceNum) && insuranceNum > 0 ? insuranceNum / 12 : 0;
  const soatMonthly = !isNaN(soatNum) && soatNum > 0 ? soatNum / 12 : 0;

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">
              Simulador de Crédito
            </h1>
            <p className="text-xs text-gray-500 leading-tight">Vehicular · Colombia</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        <StepLabel number={1} text="Ingresa la tasa de interés" />
        <RateConverter onEMChange={setEM} />

        <StepLabel number={2} text="Datos del crédito" />
        <LoanForm
          amount={amount}
          term={term}
          onAmountChange={setAmount}
          onTermChange={setTerm}
          hasValidRate={!isNaN(em) && em > 0}
        />

        <StepLabel number={3} text="Costos adicionales (opcional)" />
        <AdditionalCosts
          insuranceAnnual={insuranceAnnual}
          soatAnnual={soatAnnual}
          onInsuranceChange={setInsuranceAnnual}
          onSoatChange={setSoatAnnual}
        />

        {/* Results */}
        {loanResult && (
          <>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2">
                Resultados
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <ResultsSummary
              result={loanResult}
              principal={principal}
              em={em}
              termMonths={termNum}
              insuranceMonthly={insuranceMonthly}
              soatMonthly={soatMonthly}
            />
            <AmortizationChart schedule={loanResult.schedule} />
            <AmortizationTable schedule={loanResult.schedule} />
          </>
        )}

        <footer className="text-center py-6">
          <p className="text-xs text-gray-400">
            Los resultados son aproximados. Consulta con tu entidad financiera.
          </p>
        </footer>
      </main>
    </div>
  );
}

function StepLabel({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
        {number}
      </span>
      <span className="text-sm font-semibold text-gray-700">{text}</span>
    </div>
  );
}
