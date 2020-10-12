///<reference path="../typings/calculation.d.ts" />
import * as Util from '../util/util';

// NOTE: Generates the final report
export function generateReport(calculationData: CalculationData): Report {
  let report: Report = {
    dependency: "",
    EFC: 0,
    Pell: 0,
    TAG: 0,
    Merit: 0,
    Needs: 0,
    POA: {
      totaladmissioncost: 0,
      tuitionfees: 0,
      bookssupplies: 0,
      roomboard: 0,
      otherexpenses: 0
    }
  };

  //console.log(calculationData);
  /* NOTE: determine our dependency status to we can calculate
  *  our EFC value which most subsequent calculations depend
  *  on. 
  */ 
  let _dependency: string = determineDependency(
    calculationData.userInput['form-student-age'],
    calculationData.userInput['form-children'],
    calculationData.userInput['marital-status']
  );

  report['dependency'] = (_dependency === "efcDependent")? "Dependent": "Not Dependent";

  /* NOTE: given the table indicated by _dependency, match up
  *  the number in family and number in college (of that family),
  *  and then use the associated incomeRanges array to find the value
  *  at the index corresponding to the user's income range. This value
  *  will be their EFC value 
  */ 
  let _efcValue: number = calculateEFC(
    _dependency, 
    calculationData.calculationTables.EFC.default[`${_dependency}`],
    Util.resolveNumberInCollege(calculationData.userInput['form-people-in-college']),
    Util.resolveNumberInFamily(calculationData.userInput['form-people-in-household']),
    Util.resolveIncomeRange(calculationData.userInput['form-household-income'])
  );

  report['EFC'] = _efcValue;

  // NOTE: Given EFC, calculate Pell Grant award amount
  let _pellValue: number = calculatePell(
    _efcValue, 
    calculationData.calculationTables.Pell.default
  );

  report['Pell'] = _pellValue;

  // NOTE: Given EFC and residency status, calculate Tuition Assistance Grant
  let _tagValue: number = calculateTAG(
    _efcValue, 
    calculationData.userInput['form-current-residence'], calculationData.calculationTables.TAG.default
  );

  report['TAG'] = _tagValue;

  // NOTE: GPA, freshman/transfer status, and test scores, calculate the user's Merit Award
  let _meritValue: number = calculateMerit(
    parseFloat(calculationData.userInput['form-current-gpa']),
    calculationData.userInput['form-highschool-transfer'],
    calculationData.calculationTables.Merit.default,
    {
      SAT: parseInt(calculationData.userInput['form-erw-sat']) + parseInt(calculationData.userInput['form-math-sat']),
      ACT: parseInt(calculationData.userInput['form-act'])
    }
  ); 

  report['Merit'] = _meritValue;

  // NOTE: calculate user's Needs-Based Award based on GPA, current state residence and transfer status
  //console.log(calculationData.calculationTables.EFC.default.needsBasedEFC);
  let _needsValue: number = calculateNeeds(
    _efcValue,
    parseFloat(calculationData.userInput['form-current-gpa']),
    calculationData.calculationTables.EFC.default.needsBasedEFC,
    calculationData.userInput['form-current-residence'],
    calculationData.userInput['form-highschool-transfer']
  );

  report['Needs'] = _needsValue;

  // NOTE: calculate Price of Attending
  let _poaValue: LooseObject = calculatePOA(calculationData.userInput['form-planned-residence'],
  calculationData.userInput['form-current-residence'],
    calculationData.calculationTables.POA.default
  );

  report['POA'] = _poaValue;

  // NOTE: return our final report
  console.log(report);
  return report;
}

/* NOTE: determineDependency
*  given user's age, marital status, and whether they
*  support children, determine if they are a dependent.
* 
*  returns: the key name of the table to look at to determine
*  the user's EFC value.
*/
function determineDependency(age: string, childSupport: string, married: string): string {
  let dependent: string = "";

  // NOTE: check if age <= 24
  if((parseInt(age) <= 24) || (married === "No")) {
    dependent = "efcDependent";
  } else {
    if(childSupport === "Yes") {
      dependent = "efcNotDependentButHasDependent";
    } else {
      dependent = "efcNotDependentAndNoDependent";
    }
  }

  return dependent;
}


/* NOTE:  calculatedPell
*  given EFC value and Pell Table, returns the Pell
*  Grant amout the user can be awarded 
*/ 
function calculatePell(efc: number, pellTable: number[][]): number {
  let calculatedPell = 0;

  //console.log(`EFC: ${efc}`);
  //console.log(pellTable);

  for(let row of pellTable) {
    if((efc >= row[0]) && efc <= row[1]) {
      calculatedPell = row[2];
      break; 
    }
  }
  
  return calculatedPell;
}

/* NOTE: calculateTAG
*  given the user's EFC value, use the TAG Table to 
*  determine their Tuition Assistance Grant, if any
*/
function calculateTAG(efc: number, residency: string, tagTable: number[][]): number {
  // NOTE: will remain 0 if user does not reside in New Jersey
  let calculatedTAG = 0; 
  //console.log(tagTable);
  if(residency === "New Jersey") {
    for(let r of tagTable) {
      if((efc >= r[0]) && efc <= r[1]) {
        calculatedTAG = r[2];
        break;
      }
    }
  }

  return calculatedTAG;
}

/* NOTE: calculateMerit
*  given user's EFC, GPA and Freshman/Transfer status,
*  as well as SAT/ACT test scores (if supplied, and user 
*  is a Freshman), determine their Merit award
*/
function calculateMerit(gpa: number, hsOrTransfer: string,  meritTables: MeritTables, testScores?: TestScores): number {
  let calculatedMerit = 0;
  //console.log(testScores);
  // NOTE: first determine if the user is Freshman or Transfer
  if(hsOrTransfer === "High School") {
    /* NOTE: user is incoming freshman, now determine if we are using
    *  SAT/ACT test scores to calculate merit, or GPA, as supplying test
    *  scores is optional. We use GPA if the user chose not to supply
    *  standardized test scores
    */
    if(typeof testScores !== "undefined") {
      // NOTE: we are using test scores, now determine which the user has provided, SAT or ACT
      if(typeof testScores.SAT !== "undefined") {
        // NOTE: we are using SAT scores
        for(let r of meritTables.meritSAT) {
          // NOTE: Find the row based on SAT score
          if((testScores.SAT >= r[0]) && (testScores.SAT <= r[1])) {
            // NOTE: find the correct GPA range
            if((gpa >= r[2]) && (gpa <= r[3])) {
              // NOTE: last value in row is our merit value
              calculatedMerit = r[4];
              break; // NOTE: we found the value, break FOR loop
            }
          } 
        }
      } else {
        // NOTE: we are using ACT scores
        if(typeof testScores.ACT !== "undefined") {
          for(let r of meritTables.meritACT) {
            // NOTE: Find the row based on ACT score
            if((testScores.ACT >= r[0]) && (testScores.ACT <= r[1])) {
              // NOTE: Find the correct GPA range 
              if((gpa >= r[2]) && (gpa <= r[3])) {
                calculatedMerit = r[4];
                break;
              }
            }
          }
        }
      }
    } else {
      // NOTE: user is not using test scores, use "test optional", only GPA needed
      for(let r of meritTables.merittestoptional) {
        if((gpa >= r[0]) && (gpa <= r[1])) {
          calculatedMerit = r[2];
          break;
        }
      }
    }
  } else {
    // NOTE: user is a transfer, use transfer table (GPA only, but differnet ranges)
    //console.log(meritTables.merittransfer);
    for(let r of meritTables.merittransfer) {
      if((gpa >= r[0]) && (gpa <= r[1])) {
        calculatedMerit = r[2];
        break;
      }
    }
  }

  // NOTE: return the value we found
  return calculatedMerit;
}

/* NOTE: calculateNeeds
*  given EFC, GPA, needs table values, residency status and
*  HS/Transfer status, determine any needs-based award amount
*/
function calculateNeeds(efc: number, gpa: number, needsTables: NeedsTables, residency: string, hsOrTransfer: string): number {
  let calculatedNeeds = 0;

  console.log(hsOrTransfer);
  // NOTE: determine residency
  if(residency === "New Jersey") {
    // NOTE: user is New Jersey resident, determine if transfer or freshman
    if(hsOrTransfer === "High School") {
      // NOTE: user is NJ resident AND Freshman
      console.log("Needs: NJ Freshman");
      for(let r of needsTables.freshmanNeedsBasedEFCNJResident) {
        if((efc >= r[0]) && (efc <= r[1])) {
          calculatedNeeds = r[2];
          break; // NOTE: faound the value, break out of FOR loop
        }
      }
    } else {
      console.log("Needs: NJ Transfer");
      // NOTE: User is NJ Resident, but Transfer Student
      //console.log(needsTables.transferNeedsBasedEFCNJResident);
      for(let r of needsTables.transferNeedsBasedEFCNJResident) {
        // NOTE: transfer calculations are based on EFC & GPA ranges
        if((efc >= r[0]) && (efc <= r[1])) {
          if(gpa < 3) {
            calculatedNeeds = r[2];
            break;
          }
          if((gpa >=3) && (gpa <= 3.49)) {
            calculatedNeeds = r[3];
            break;
          }
          if(gpa >= 3.5) {
            calculatedNeeds = r[4];
            break;
          }
        }
      }
    }
  } else {
    // NOTE: User is not NJ resident
    console.log("Needs: OOS Freshman");
    if(hsOrTransfer === "High School") {
      // NOTE: user is NJ resident AND Freshman
      for(let r of needsTables.freshmanNeedsBasedEFCNonNJResident) {
        if((efc >= r[0]) && (efc <= r[1])) {
          calculatedNeeds = r[2];
          break; // NOTE: faound the value, break out of FOR loop
        }
      }
    } else {
      console.log("Needs: OOS Transfer");
      // NOTE: final case: user is non NJ resident and transfer
      for(let r of needsTables.transferNeedsBasedEFCNonNJResident) {
        if((efc >= r[0]) && (efc <= r[1])) {
          calculatedNeeds = r[2];
          break; // NOTE: faound the value, break out of FOR loop
        }
      }
    }
  }

  return calculatedNeeds;
}

/* NOTE: calculateEFC
*  given depenency status, income range, number in family, 
*  number in college, determine Expect Family Contribution
*  income range is a number of the array index of the value 
*  corresponding to the income range option the user selected:
*     < $30,000 = 0
*     $30,000 - 39,999 = 1
*     ...
*     $90,000 - 99,999 = 7
*     $100,000 and up = 8
*/
function calculateEFC(dependency: string, dependentTable: EFCTable[], numberInCollege: number, numberInFamily: number, incomeRange: number): number {
  
  let calculatedEFC = 0;
  // NOTE: user is dependent or non-dependent with dependencies
  if((dependency === "efcDependent") || (dependency === "efcNotDependentButHasDependent")) {
    console.log(dependentTable);
    console.log(`${numberInCollege} in college, ${numberInFamily} in family, ${incomeRange} income range index`);
    for(let r of dependentTable) {
      if(numberInCollege === r.numberInCollege) {
        if(numberInFamily === r.numberInFamily) {
            // NOTE: we have the "row", return the value at the array index corresponding to the income range
            console.log(r.incomeRanges);
            calculatedEFC = r.incomeRanges[incomeRange];
            break; // NOTE: break FOR loop, found our value
        }
      } 
    }
  } else {
    // NOTE: for efcNotDependentAndNoDependent, the table only goes up to 2 in family and 2 in college, to account for more of each, consider 2 and 2 as "2 or more - 2 or more"
    let incomeRanges: number[] = [];
    if((numberInCollege > 2) || (numberInFamily > 2)) {
      incomeRanges = dependentTable[2].incomeRanges;
    } else {
      for(let r of dependentTable) {
        if(numberInCollege === r.numberInCollege) {
          if(numberInFamily === r.numberInFamily) {
            incomeRanges = r.incomeRanges;
          }
        }
      }
    }

    // NOTE: determine value by same method as above, index value in incomeRanges corresponding to the matching income range
    calculatedEFC = incomeRanges[incomeRange];
  }

  return calculatedEFC;
}

/* NOTE: calculatePOA  
*  given whether user is planning to live on campus,
*  off-campus with family, or on their own-off campus,
*  and their status as a current NJ or Non-NJ resident, 
*  determine their Price of Admission from the table
*/
function calculatePOA(plannedLivingStatus: string, residency: string, poaTable:POATable): object {
  let calculatedPOA: object = {};
  let poaIndex: number = 0;

  if(plannedLivingStatus === "On-Campus") {
    poaIndex = 0;
    if(residency === "New Jersey") {
      poaIndex = 1;
    } else {
      poaIndex = 2;
    }
  }
  
  calculatedPOA = {
    totalCost: poaTable.poatotaladmissioncost[poaIndex],
    tuitionAndFees: poaTable.poatuitionfees[poaIndex],
    booksAndSupplies: poaTable.poabookssupplies[poaIndex],
    roomAndBoard: poaTable.poaroomboard[poaIndex],
    otherExpenses: poaTable.poaotherexpenses[poaIndex]
  }

  return calculatedPOA;
} 
