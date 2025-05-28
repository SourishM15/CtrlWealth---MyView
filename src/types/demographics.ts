export interface NeighborhoodDemographics {
  name: string;
  childrenUnder18: number;
  workingAgeAdults: number;
  olderAdults: number;
  aggregateAgeTotal: number;
  aggregateAgeMale: number;
  aggregateAgeFemale: number;
  medianAgeTotal: number;
  medianAgeMale: number;
  medianAgeFemale: number;
  type: string;
  medianIncome?: number;
}

export interface DemographicsSummary {
  totalPopulation: number;
  ageDistribution: {
    children: number;
    workingAge: number;
    elderly: number;
  };
  medianAge: number;
  genderRatio: {
    male: number;
    female: number;
  };
  medianIncome: number;
}