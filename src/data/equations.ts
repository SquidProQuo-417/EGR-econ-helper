export interface Variable {
  symbol: string
  meaning: string
}

export interface Equation {
  id: string
  name: string
  formula: string
  description: string
  category: string
  variables: Variable[]
  unlockedByChapter?: string
}

export const equations: Equation[] = [
  // Chapter 3: Interest and Equivalence
  {
    id: 'simple-interest',
    name: 'Simple Interest',
    formula: 'I = P * i * n',
    description:
      'Interest is calculated only on the original principal. Used rarely in engineering economy but important to understand as a baseline.',
    category: 'Interest',
    variables: [
      { symbol: 'I', meaning: 'Total interest earned' },
      { symbol: 'P', meaning: 'Principal (initial amount)' },
      { symbol: 'i', meaning: 'Interest rate per period' },
      { symbol: 'n', meaning: 'Number of periods' },
    ],
    unlockedByChapter: 'ch3',
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest (F/P)',
    formula: 'F = P(1 + i)^n',
    description:
      'Find the future value of a present amount. Interest earns interest each period. This is the single most fundamental formula in engineering economy.',
    category: 'Single Payment',
    variables: [
      { symbol: 'F', meaning: 'Future value' },
      { symbol: 'P', meaning: 'Present value' },
      { symbol: 'i', meaning: 'Interest rate per period' },
      { symbol: 'n', meaning: 'Number of periods' },
    ],
    unlockedByChapter: 'ch3',
  },
  {
    id: 'present-worth-factor',
    name: 'Present Worth Factor (P/F)',
    formula: 'P = F / (1 + i)^n',
    description:
      'Find the present value of a future amount. Discounts a future sum back to today.',
    category: 'Single Payment',
    variables: [
      { symbol: 'P', meaning: 'Present value' },
      { symbol: 'F', meaning: 'Future value' },
      { symbol: 'i', meaning: 'Interest rate per period' },
      { symbol: 'n', meaning: 'Number of periods' },
    ],
    unlockedByChapter: 'ch3',
  },

  // Chapter 4: More Interest Formulas
  {
    id: 'uniform-series-future',
    name: 'Uniform Series Future Worth (F/A)',
    formula: 'F = A * [(1 + i)^n - 1] / i',
    description:
      'Find the future value of a series of equal payments. Use when you have the same cash flow each period and want to know the total at the end.',
    category: 'Uniform Series',
    variables: [
      { symbol: 'F', meaning: 'Future value' },
      { symbol: 'A', meaning: 'Uniform periodic payment' },
      { symbol: 'i', meaning: 'Interest rate per period' },
      { symbol: 'n', meaning: 'Number of periods' },
    ],
    unlockedByChapter: 'ch4',
  },
  {
    id: 'sinking-fund',
    name: 'Sinking Fund Factor (A/F)',
    formula: 'A = F * i / [(1 + i)^n - 1]',
    description:
      'Find the equal payment needed each period to accumulate a future amount. "How much do I need to save each year to have $X in n years?"',
    category: 'Uniform Series',
    variables: [
      { symbol: 'A', meaning: 'Uniform periodic payment' },
      { symbol: 'F', meaning: 'Target future value' },
      { symbol: 'i', meaning: 'Interest rate per period' },
      { symbol: 'n', meaning: 'Number of periods' },
    ],
    unlockedByChapter: 'ch4',
  },
  {
    id: 'capital-recovery',
    name: 'Capital Recovery Factor (A/P)',
    formula: 'A = P * [i(1 + i)^n] / [(1 + i)^n - 1]',
    description:
      'Find the equal periodic payment to repay a present amount. This is how loan payments are calculated.',
    category: 'Uniform Series',
    variables: [
      { symbol: 'A', meaning: 'Uniform periodic payment' },
      { symbol: 'P', meaning: 'Present value (loan amount)' },
      { symbol: 'i', meaning: 'Interest rate per period' },
      { symbol: 'n', meaning: 'Number of periods' },
    ],
    unlockedByChapter: 'ch4',
  },
  {
    id: 'series-present-worth',
    name: 'Series Present Worth (P/A)',
    formula: 'P = A * [(1 + i)^n - 1] / [i(1 + i)^n]',
    description:
      'Find the present value of a series of equal payments. "What is a stream of annual payments worth right now?"',
    category: 'Uniform Series',
    variables: [
      { symbol: 'P', meaning: 'Present value' },
      { symbol: 'A', meaning: 'Uniform periodic payment' },
      { symbol: 'i', meaning: 'Interest rate per period' },
      { symbol: 'n', meaning: 'Number of periods' },
    ],
    unlockedByChapter: 'ch4',
  },
  {
    id: 'arithmetic-gradient-pw',
    name: 'Arithmetic Gradient Present Worth (P/G)',
    formula: 'P = G * [(1 + i)^n - in - 1] / [i^2 * (1 + i)^n]',
    description:
      'Find the present value of a linearly increasing series. The gradient G is the constant increase each period (payments are 0, G, 2G, 3G, ...).',
    category: 'Gradient Series',
    variables: [
      { symbol: 'P', meaning: 'Present value' },
      { symbol: 'G', meaning: 'Constant gradient increase per period' },
      { symbol: 'i', meaning: 'Interest rate per period' },
      { symbol: 'n', meaning: 'Number of periods' },
    ],
    unlockedByChapter: 'ch4',
  },
  {
    id: 'arithmetic-gradient-annual',
    name: 'Arithmetic Gradient to Annual (A/G)',
    formula: 'A = G * [1/i - n / ((1 + i)^n - 1)]',
    description:
      'Convert a gradient series into an equivalent uniform annual series.',
    category: 'Gradient Series',
    variables: [
      { symbol: 'A', meaning: 'Equivalent uniform annual amount' },
      { symbol: 'G', meaning: 'Constant gradient increase per period' },
      { symbol: 'i', meaning: 'Interest rate per period' },
      { symbol: 'n', meaning: 'Number of periods' },
    ],
    unlockedByChapter: 'ch4',
  },
]
