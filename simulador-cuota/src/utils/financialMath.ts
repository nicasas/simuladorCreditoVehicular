export type RateType = 'EA' | 'EM' | 'NominalAnual' | 'NominalMensual';

// n = number of compounding periods per year
export type CapitalizationPeriod = 1 | 2 | 3 | 4 | 6 | 12;

export interface ConversionResult {
  em: number;
  ea: number;
  // Nominal anual with monthly compounding = EM * 12
  nominalAnualMensual: number;
  // Nominal mensual = EM (same for monthly compounding)
  nominalMensual: number;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: AmortizationRow[];
}

/**
 * Convert any rate type to Efectiva Mensual (EM).
 * @param rate  - rate as decimal (e.g. 0.24 for 24%)
 * @param type  - input rate type
 * @param n     - compounding periods per year (only used for NominalAnual)
 */
export function convertToEM(rate: number, type: RateType, n: CapitalizationPeriod = 12): number {
  switch (type) {
    case 'EA':
      return Math.pow(1 + rate, 1 / 12) - 1;
    case 'EM':
    case 'NominalMensual':
      // Nominal mensual == EM for monthly compounding
      return rate;
    case 'NominalAnual': {
      // periodic rate per compounding period = rate / n
      // months per compounding period = 12 / n
      // EM = (1 + rate/n)^(n/12) - 1
      const periodicRate = rate / n;
      return Math.pow(1 + periodicRate, n / 12) - 1;
    }
  }
}

export function convertAllRates(
  rate: number,
  type: RateType,
  n: CapitalizationPeriod = 12
): ConversionResult {
  const em = convertToEM(rate, type, n);
  const ea = Math.pow(1 + em, 12) - 1;
  return {
    em,
    ea,
    nominalAnualMensual: em * 12,
    nominalMensual: em,
  };
}

/**
 * French amortization (cuota fija).
 * PMT = PV * [i / (1 - (1+i)^-n)]
 */
export function calculateLoan(principal: number, em: number, term: number): LoanResult {
  const monthlyPayment =
    em === 0
      ? principal / term
      : principal * (em / (1 - Math.pow(1 + em, -term)));

  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= term; month++) {
    const interest = balance * em;
    const principalPmt = monthlyPayment - interest;
    balance = balance - principalPmt;

    schedule.push({
      month,
      payment: monthlyPayment,
      interest,
      principal: principalPmt,
      balance: Math.max(0, balance),
    });
  }

  return {
    monthlyPayment,
    totalPayment: monthlyPayment * term,
    totalInterest: monthlyPayment * term - principal,
    schedule,
  };
}
