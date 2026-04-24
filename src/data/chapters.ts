export interface Chapter {
  id: string
  number: number
  title: string
  description: string
  walkthroughCount: number
  practiceCount: number
}

export const chapters: Chapter[] = [
  {
    id: 'ch1',
    number: 1,
    title: 'Making Economic Decisions',
    description:
      'The decision-making process, ethics, and the role of engineering economy.',
    walkthroughCount: 3,
    practiceCount: 5,
  },
  {
    id: 'ch2',
    number: 2,
    title: 'Engineering Costs and Cost Estimating',
    description:
      'Fixed vs variable costs, sunk costs, opportunity costs, and cost estimation techniques.',
    walkthroughCount: 4,
    practiceCount: 8,
  },
  {
    id: 'ch3',
    number: 3,
    title: 'Interest and Equivalence',
    description:
      'Simple and compound interest, the time value of money, and economic equivalence.',
    walkthroughCount: 5,
    practiceCount: 10,
  },
  {
    id: 'ch4',
    number: 4,
    title: 'More Interest Formulas',
    description:
      'Uniform series, gradient series, nominal vs effective interest rates.',
    walkthroughCount: 5,
    practiceCount: 10,
  },
  {
    id: 'ch5',
    number: 5,
    title: 'Present Worth Analysis',
    description:
      'Comparing alternatives using present worth for equal and unequal lives.',
    walkthroughCount: 4,
    practiceCount: 8,
  },
  {
    id: 'ch6',
    number: 6,
    title: 'Annual Cash Flow Analysis',
    description:
      'EUAC/EUAB methods, comparing alternatives with annual worth.',
    walkthroughCount: 4,
    practiceCount: 8,
  },
  {
    id: 'ch7',
    number: 7,
    title: 'Rate of Return Analysis',
    description:
      'Internal rate of return, calculating IRR, and evaluating single projects.',
    walkthroughCount: 4,
    practiceCount: 8,
  },
  {
    id: 'ch8',
    number: 8,
    title: 'Incremental Analysis',
    description:
      'Comparing mutually exclusive alternatives using incremental rate of return.',
    walkthroughCount: 3,
    practiceCount: 7,
  },
]
