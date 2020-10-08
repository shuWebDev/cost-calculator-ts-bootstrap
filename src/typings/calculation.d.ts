interface TestScores {
  SAT?: number,
  ACT?: number
}  

interface MeritTables {
  meritSAT: number[][],
  meritACT: number[][],
  merittransfer: number[][],
  merittestoptional: number[][]
}

interface NeedsTables {
  freshmanNeedsBasedEFCNJResident: number[][],
  freshmanNeedsBasedEFCNonNJResident: number[][],
  transferNeedsBasedEFCNJResident: number[][],
  transferNeedsBasedEFCNonNJResident: number[][]
}

interface EFCTable {
  numberInCollege: number,
  numberInFamily: number,
  incomeRanges: number[]
}  

interface POATable {
  poatotaladmissioncost: number[]
  poatuitionfees: number[],
  poabookssupplies: number[],
  poaroomboard: number[],
  poaotherexpenses: number[]
}

interface CalculationData {
  calculationTables: {
    EFC: {
      default: any
    }
    Merit: {
      default: MeritTables
    },
    Pell: {
      default: number[][]
    }
    TAG: {
      default: number[][]
    },
    POA: {
      default: POATable
    }
  },
  userInput: {
    [key: string]: string
  }
}

interface Report {
  dependency: string,
  EFC: number,
  Pell: number,
  TAG: number,
  Merit: number,
  Needs: number,
  POA: {}
}