// Engineering Economy Calculation Functions

/** Single Payment Compound Amount (F/P, i, n) */
export function fGivenP(i: number, n: number): number {
  return Math.pow(1 + i, n)
}

/** Single Payment Present Worth (P/F, i, n) */
export function pGivenF(i: number, n: number): number {
  return 1 / Math.pow(1 + i, n)
}

/** Uniform Series Compound Amount (F/A, i, n) */
export function fGivenA(i: number, n: number): number {
  if (i === 0) return n
  return (Math.pow(1 + i, n) - 1) / i
}

/** Sinking Fund (A/F, i, n) */
export function aGivenF(i: number, n: number): number {
  if (i === 0) return 1 / n
  return i / (Math.pow(1 + i, n) - 1)
}

/** Capital Recovery (A/P, i, n) */
export function aGivenP(i: number, n: number): number {
  if (i === 0) return 1 / n
  const factor = Math.pow(1 + i, n)
  return (i * factor) / (factor - 1)
}

/** Series Present Worth (P/A, i, n) */
export function pGivenA(i: number, n: number): number {
  if (i === 0) return n
  const factor = Math.pow(1 + i, n)
  return (factor - 1) / (i * factor)
}

/** Arithmetic Gradient Present Worth (P/G, i, n) */
export function pGivenG(i: number, n: number): number {
  if (i === 0) return (n * (n - 1)) / 2
  const factor = Math.pow(1 + i, n)
  return (factor - i * n - 1) / (i * i * factor)
}

/** Arithmetic Gradient to Annual (A/G, i, n) */
export function aGivenG(i: number, n: number): number {
  if (i === 0) return (n - 1) / 2
  return 1 / i - n / (Math.pow(1 + i, n) - 1)
}

export interface CashFlow {
  period: number
  amount: number
  label?: string
}

/** Calculate Present Worth of a set of cash flows */
export function presentWorth(cashFlows: CashFlow[], i: number): number {
  return cashFlows.reduce((sum, cf) => {
    return sum + cf.amount * pGivenF(i, cf.period)
  }, 0)
}

/** Calculate Future Worth of a set of cash flows at period n */
export function futureWorth(
  cashFlows: CashFlow[],
  i: number,
  n: number
): number {
  return cashFlows.reduce((sum, cf) => {
    return sum + cf.amount * fGivenP(i, n - cf.period)
  }, 0)
}

/** Calculate Annual Worth from Present Worth */
export function annualWorth(
  cashFlows: CashFlow[],
  i: number,
  n: number
): number {
  const pw = presentWorth(cashFlows, i)
  return pw * aGivenP(i, n)
}

/** Calculate IRR using Newton's method */
export function irr(cashFlows: CashFlow[], guess = 0.1): number | null {
  let rate = guess
  for (let iter = 0; iter < 100; iter++) {
    let npv = 0
    let dnpv = 0
    for (const cf of cashFlows) {
      npv += cf.amount / Math.pow(1 + rate, cf.period)
      dnpv += (-cf.period * cf.amount) / Math.pow(1 + rate, cf.period + 1)
    }
    if (Math.abs(npv) < 0.0001) return rate
    if (Math.abs(dnpv) < 1e-12) return null
    rate = rate - npv / dnpv
    if (rate < -1 || rate > 10) return null
  }
  return null
}

/** Simple payback period (ignores time value of money) */
export function paybackPeriod(cashFlows: CashFlow[]): number | null {
  const sorted = [...cashFlows].sort((a, b) => a.period - b.period)
  let cumulative = 0
  for (const cf of sorted) {
    cumulative += cf.amount
    if (cumulative >= 0) return cf.period
  }
  return null
}

/** Format a number as currency */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/** Format a number as percentage */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}
