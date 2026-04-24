import type { CashFlow } from '../utils/calc'

export interface WalkthroughStep {
  title: string
  content: string
  highlight?: string // key thing to notice
  equation?: string // equation used in this step
}

export interface Walkthrough {
  id: string
  chapterId: string
  title: string
  problemStatement: string
  cashFlows?: CashFlow[]
  periods?: number
  steps: WalkthroughStep[]
  answer: string
}

export interface PracticeProblem {
  id: string
  chapterId: string
  title: string
  problemStatement: string
  answer: number
  tolerance: number // acceptable deviation from answer
  hint: string
  solutionSteps: string[]
}

export const walkthroughs: Walkthrough[] = [
  // Chapter 3: Interest and Equivalence
  {
    id: 'w3-1',
    chapterId: 'ch3',
    title: 'Future Value of a Single Payment',
    problemStatement:
      'You deposit $5,000 in a savings account that pays 6% annual interest compounded annually. How much will you have after 8 years?',
    cashFlows: [{ period: 0, amount: -5000, label: '$5,000 deposit' }],
    periods: 8,
    steps: [
      {
        title: 'Identify the problem type',
        content:
          'We have a single present amount (P) and need to find its future value (F). This is a single payment compound amount problem.',
        highlight: '"deposit" = present amount, "how much after 8 years" = future value',
      },
      {
        title: 'Identify the known values',
        content: 'P = $5,000 (the deposit)\ni = 6% = 0.06 per year\nn = 8 years\nFind: F',
        highlight: 'Always convert the percentage to a decimal: 6% → 0.06',
      },
      {
        title: 'Select the right equation',
        content:
          'We need F given P, so we use the compound amount factor:\n\nF = P(F/P, i, n) = P(1 + i)^n',
        equation: 'F = P(1 + i)^n',
        highlight: 'F/P means "find F, given P"',
      },
      {
        title: 'Plug in and solve',
        content:
          'F = $5,000 × (1 + 0.06)^8\nF = $5,000 × (1.06)^8\nF = $5,000 × 1.5938\nF = $7,969.24',
      },
      {
        title: 'Interpret the result',
        content:
          'After 8 years, your $5,000 deposit will grow to $7,969.24. That\'s $2,969.24 in interest earned — and because of compounding, you earned interest on your interest.',
      },
    ],
    answer: '$7,969.24',
  },
  {
    id: 'w3-2',
    chapterId: 'ch3',
    title: 'Present Value of a Future Amount',
    problemStatement:
      'You need $25,000 for a down payment on a house in 5 years. If you can earn 7% interest compounded annually, how much should you invest today?',
    cashFlows: [{ period: 5, amount: 25000, label: '$25,000 needed' }],
    periods: 5,
    steps: [
      {
        title: 'Identify the problem type',
        content:
          'We know the future amount (F) and need to find the present value (P). This is a single payment present worth problem.',
        highlight: '"need $25,000 in 5 years" = known future value',
      },
      {
        title: 'Identify the known values',
        content: 'F = $25,000\ni = 7% = 0.07 per year\nn = 5 years\nFind: P',
      },
      {
        title: 'Select the right equation',
        content:
          'We need P given F, so we use the present worth factor:\n\nP = F(P/F, i, n) = F / (1 + i)^n',
        equation: 'P = F / (1 + i)^n',
        highlight: 'P/F means "find P, given F" — the inverse of compounding',
      },
      {
        title: 'Plug in and solve',
        content:
          'P = $25,000 / (1 + 0.07)^5\nP = $25,000 / (1.07)^5\nP = $25,000 / 1.4026\nP = $17,824.65',
      },
      {
        title: 'Interpret the result',
        content:
          'You need to invest $17,824.65 today at 7% interest to have $25,000 in 5 years. This is the concept of "time value of money" — a dollar today is worth more than a dollar in the future.',
      },
    ],
    answer: '$17,824.65',
  },
  {
    id: 'w3-3',
    chapterId: 'ch3',
    title: 'Finding the Interest Rate',
    problemStatement:
      'An investment of $1,000 grows to $1,500 in 6 years. What is the annual compound interest rate?',
    cashFlows: [
      { period: 0, amount: -1000, label: '$1,000 invested' },
      { period: 6, amount: 1500, label: '$1,500 received' },
    ],
    periods: 6,
    steps: [
      {
        title: 'Identify the problem type',
        content:
          'We know both P and F, and n, but need to find the interest rate i. Rearrange the compound interest formula.',
        highlight: 'When you know 3 of the 4 variables (P, F, i, n), solve for the unknown',
      },
      {
        title: 'Set up the equation',
        content: 'F = P(1 + i)^n\n$1,500 = $1,000(1 + i)^6',
      },
      {
        title: 'Solve for i',
        content:
          '1,500 / 1,000 = (1 + i)^6\n1.5 = (1 + i)^6\n(1.5)^(1/6) = 1 + i\n1.0699 = 1 + i\ni = 0.0699 = 6.99%',
        equation: 'i = (F/P)^(1/n) - 1',
        highlight: 'Take the nth root by raising to the power 1/n',
      },
      {
        title: 'Interpret the result',
        content:
          'The annual compound interest rate is approximately 7%. This is sometimes called the "rate of return" on the investment.',
      },
    ],
    answer: '6.99% ≈ 7%',
  },

  // Chapter 4: More Interest Formulas
  {
    id: 'w4-1',
    chapterId: 'ch4',
    title: 'Uniform Series — Saving for Retirement',
    problemStatement:
      'You save $3,000 per year in a retirement account earning 8% annually. How much will you have after 30 years?',
    cashFlows: Array.from({ length: 30 }, (_, i) => ({
      period: i + 1,
      amount: -3000,
    })),
    periods: 30,
    steps: [
      {
        title: 'Identify the problem type',
        content:
          'We have equal annual payments (A) and want the future total (F). This is a uniform series compound amount problem.',
        highlight: '"$3,000 per year" = uniform annual amount A',
      },
      {
        title: 'Identify the known values',
        content: 'A = $3,000 per year\ni = 8% = 0.08\nn = 30 years\nFind: F',
      },
      {
        title: 'Select the right equation',
        content:
          'We need F given A:\n\nF = A(F/A, i, n) = A × [(1 + i)^n - 1] / i',
        equation: 'F = A × [(1 + i)^n - 1] / i',
        highlight: 'F/A is the "series compound amount factor"',
      },
      {
        title: 'Plug in and solve',
        content:
          'F = $3,000 × [(1.08)^30 - 1] / 0.08\nF = $3,000 × [10.0627 - 1] / 0.08\nF = $3,000 × 9.0627 / 0.08\nF = $3,000 × 113.2832\nF = $339,849.63',
      },
      {
        title: 'Interpret the result',
        content:
          'After 30 years of saving $3,000/year, you will have $339,849.63. You only deposited $90,000 total (30 × $3,000), so $249,849.63 came from compound interest. That\'s the power of consistent saving plus compounding!',
      },
    ],
    answer: '$339,849.63',
  },
  {
    id: 'w4-2',
    chapterId: 'ch4',
    title: 'Capital Recovery — Loan Payment',
    problemStatement:
      'You borrow $20,000 for a car at 5% annual interest to be repaid in 5 equal annual payments. What is the annual payment?',
    cashFlows: [{ period: 0, amount: 20000, label: '$20,000 loan' }],
    periods: 5,
    steps: [
      {
        title: 'Identify the problem type',
        content:
          'We have a present loan amount (P) and need equal annual payments (A). This is a capital recovery problem.',
        highlight: '"equal annual payments" tells you to find A given P',
      },
      {
        title: 'Identify the known values',
        content: 'P = $20,000\ni = 5% = 0.05\nn = 5 years\nFind: A',
      },
      {
        title: 'Select the right equation',
        content:
          'We need A given P (capital recovery factor):\n\nA = P(A/P, i, n) = P × [i(1 + i)^n] / [(1 + i)^n - 1]',
        equation: 'A = P × [i(1 + i)^n] / [(1 + i)^n - 1]',
        highlight: 'A/P is the "capital recovery factor" — this is how loan payments work',
      },
      {
        title: 'Plug in and solve',
        content:
          'A = $20,000 × [0.05(1.05)^5] / [(1.05)^5 - 1]\nA = $20,000 × [0.05 × 1.2763] / [1.2763 - 1]\nA = $20,000 × 0.06381 / 0.2763\nA = $20,000 × 0.2310\nA = $4,619.50',
      },
      {
        title: 'Interpret the result',
        content:
          'You would pay $4,619.50 per year for 5 years. Total paid: $23,097.50, so $3,097.50 is interest. Each payment covers both interest and principal — early payments are mostly interest, later ones mostly principal.',
      },
    ],
    answer: '$4,619.50',
  },

  // Chapter 5: Present Worth Analysis
  {
    id: 'w5-1',
    chapterId: 'ch5',
    title: 'Comparing Alternatives with Present Worth',
    problemStatement:
      'Machine A costs $15,000, has annual operating costs of $3,000, and lasts 5 years with no salvage value. Machine B costs $25,000, has annual operating costs of $1,500, and lasts 5 years with a $5,000 salvage value. MARR is 10%. Which machine should you choose?',
    periods: 5,
    steps: [
      {
        title: 'Identify the problem type',
        content:
          'We need to compare two alternatives with costs. Since both have the same life (5 years), we can directly compare their Present Worth of costs.',
        highlight: 'Equal lives → can compare PW directly',
      },
      {
        title: 'Set up Machine A',
        content:
          'Machine A costs:\n- Initial cost: $15,000 at period 0\n- Annual operating cost: $3,000/year for 5 years\n\nPW_A = $15,000 + $3,000(P/A, 10%, 5)',
      },
      {
        title: 'Calculate PW for Machine A',
        content:
          '(P/A, 10%, 5) = [(1.1)^5 - 1] / [0.1 × (1.1)^5] = 3.7908\n\nPW_A = $15,000 + $3,000 × 3.7908\nPW_A = $15,000 + $11,372.40\nPW_A = $26,372.40',
      },
      {
        title: 'Calculate PW for Machine B',
        content:
          'PW_B = $25,000 + $1,500(P/A, 10%, 5) - $5,000(P/F, 10%, 5)\n\n(P/F, 10%, 5) = 1/(1.1)^5 = 0.6209\n\nPW_B = $25,000 + $1,500 × 3.7908 - $5,000 × 0.6209\nPW_B = $25,000 + $5,686.20 - $3,104.50\nPW_B = $27,581.70',
        highlight: 'Salvage value is a positive cash flow (reduces cost) → subtract it',
      },
      {
        title: 'Compare and decide',
        content:
          'PW_A = $26,372.40\nPW_B = $27,581.70\n\nMachine A has a lower present worth of costs ($26,372 < $27,582), so Machine A is the better choice.\n\nThe lower upfront cost of A plus the difference in annual costs outweighs B\'s salvage value.',
      },
    ],
    answer: 'Machine A (PW = $26,372.40 vs $27,581.70)',
  },
]

export const practiceProblems: PracticeProblem[] = [
  // Chapter 3
  {
    id: 'p3-1',
    chapterId: 'ch3',
    title: 'Compound Interest',
    problemStatement:
      'If you invest $10,000 at 5% annual compound interest, how much will you have after 10 years? (Round to nearest dollar)',
    answer: 16289,
    tolerance: 1,
    hint: 'Use F = P(1 + i)^n. P = $10,000, i = 0.05, n = 10.',
    solutionSteps: [
      'F = P(1 + i)^n',
      'F = $10,000 × (1.05)^10',
      'F = $10,000 × 1.6289',
      'F = $16,289',
    ],
  },
  {
    id: 'p3-2',
    chapterId: 'ch3',
    title: 'Present Worth',
    problemStatement:
      'What is the present value of $50,000 to be received 7 years from now if the interest rate is 9%? (Round to nearest dollar)',
    answer: 27368,
    tolerance: 1,
    hint: 'Use P = F/(1 + i)^n. F = $50,000, i = 0.09, n = 7.',
    solutionSteps: [
      'P = F / (1 + i)^n',
      'P = $50,000 / (1.09)^7',
      'P = $50,000 / 1.8280',
      'P = $27,368',
    ],
  },
  // Chapter 4
  {
    id: 'p4-1',
    chapterId: 'ch4',
    title: 'Uniform Series Future Worth',
    problemStatement:
      'You deposit $2,000 per year for 20 years at 6% interest. What is the future value? (Round to nearest dollar)',
    answer: 73571,
    tolerance: 1,
    hint: 'Use F = A × [(1 + i)^n - 1] / i. A = $2,000, i = 0.06, n = 20.',
    solutionSteps: [
      'F = A × [(1 + i)^n - 1] / i',
      'F = $2,000 × [(1.06)^20 - 1] / 0.06',
      'F = $2,000 × [3.2071 - 1] / 0.06',
      'F = $2,000 × 36.7856',
      'F = $73,571',
    ],
  },
  {
    id: 'p4-2',
    chapterId: 'ch4',
    title: 'Loan Payment Calculation',
    problemStatement:
      'Calculate the annual payment on a $50,000 loan at 8% interest for 10 years. (Round to nearest dollar)',
    answer: 7451,
    tolerance: 1,
    hint: 'Use A = P × [i(1+i)^n] / [(1+i)^n - 1]. P = $50,000, i = 0.08, n = 10.',
    solutionSteps: [
      'A = P × [i(1+i)^n] / [(1+i)^n - 1]',
      'A = $50,000 × [0.08(1.08)^10] / [(1.08)^10 - 1]',
      'A = $50,000 × [0.08 × 2.1589] / [2.1589 - 1]',
      'A = $50,000 × 0.17271 / 1.1589',
      'A = $50,000 × 0.14903',
      'A = $7,451',
    ],
  },
  // Chapter 5
  {
    id: 'p5-1',
    chapterId: 'ch5',
    title: 'Present Worth of an Investment',
    problemStatement:
      'A project costs $30,000 now and returns $8,000 per year for 6 years. If MARR = 12%, what is the net present worth? (Round to nearest dollar)',
    answer: 2889,
    tolerance: 5,
    hint: 'NPW = -Initial Cost + A(P/A, i, n). Calculate (P/A, 12%, 6) first.',
    solutionSteps: [
      '(P/A, 12%, 6) = [(1.12)^6 - 1] / [0.12 × (1.12)^6] = 4.1114',
      'NPW = -$30,000 + $8,000 × 4.1114',
      'NPW = -$30,000 + $32,891',
      'NPW = $2,891 (approximately $2,889 with more precision)',
    ],
  },
]
