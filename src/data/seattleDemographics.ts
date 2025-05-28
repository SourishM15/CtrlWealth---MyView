import { NeighborhoodDemographics, DemographicsSummary } from '../types/demographics';

const rawData = {
  "Ballard": {
    combined: {
      childrenUnder18: 1088 + 2599,
      workingAgeAdults: 9152 + 17128,
      olderAdults: 925 + 1638,
      aggregateAgeTotal: 369056.7 + 706129.1,
      aggregateAgeMale: 173536 + 352190.6,
      aggregateAgeFemale: 197761.1 + 356414.6,
      medianAgeTotal: (33 + 33) / 2, // Average of both entries
      medianAgeMale: (32 + 32.5) / 2,
      medianAgeFemale: (34.3 + 33.7) / 2
    }
  },
  "Capitol Hill": {
    combined: {
      childrenUnder18: 579 + 1394,
      workingAgeAdults: 24726 + 43533,
      olderAdults: 1423 + 4290,
      aggregateAgeTotal: 851028.9 + 1609883.4,
      aggregateAgeMale: 505584.5 + 903901.6,
      aggregateAgeFemale: 343317.8 + 746375,
      medianAgeTotal: (31.8 + 32.7) / 2,
      medianAgeMale: (32.4 + 32.8) / 2,
      medianAgeFemale: (30.7 + 34.4) / 2
    }
  },
  "Downtown": {
    data: {
      childrenUnder18: 1021,
      workingAgeAdults: 36389,
      olderAdults: 5378,
      aggregateAgeTotal: 1589150.5,
      aggregateAgeMale: 894624.1,
      aggregateAgeFemale: 704138.1,
      medianAgeTotal: 37.1,
      medianAgeMale: 36.9,
      medianAgeFemale: 37.9
    }
  },
  "Fremont": {
    combined: {
      childrenUnder18: 1700 + 501,
      workingAgeAdults: 15408 + 6391,
      olderAdults: 1511 + 429,
      aggregateAgeTotal: 622398.5 + 234744.3,
      aggregateAgeMale: 305926.4 + 116531.4,
      aggregateAgeFemale: 316414.8 + 116644.2,
      medianAgeTotal: (33.4 + 32) / 2,
      medianAgeMale: (33.6 + 31.4) / 2,
      medianAgeFemale: (33.1 + 32.2) / 2
    }
  },
  "Queen Anne": {
    data: {
      childrenUnder18: 4314,
      workingAgeAdults: 36166,
      olderAdults: 5025,
      aggregateAgeTotal: 1598747,
      aggregateAgeMale: 782431.9,
      aggregateAgeFemale: 815743.8,
      medianAgeTotal: 35.1,
      medianAgeMale: 34.1,
      medianAgeFemale: 36.0
    }
  },
  "University District": {
    combined: {
      childrenUnder18: 912 + 793,
      workingAgeAdults: 21708 + 27843,
      olderAdults: 628 + 774,
      aggregateAgeTotal: 537324.5 + 668862.8,
      aggregateAgeMale: 276428.4 + 337312.9,
      aggregateAgeFemale: 268841.7 + 335317.6,
      medianAgeTotal: (23.1 + 22.7) / 2,
      medianAgeMale: (24.3 + 23.4) / 2,
      medianAgeFemale: (22.5 + 22.2) / 2
    }
  },
  "South Lake Union": {
    data: {
      childrenUnder18: 322,
      workingAgeAdults: 10739,
      olderAdults: 915,
      aggregateAgeTotal: 361128.8,
      aggregateAgeMale: 208120.8,
      aggregateAgeFemale: 181019.4,
      medianAgeTotal: 30.1,
      medianAgeMale: 30.2,
      medianAgeFemale: 35.4
    }
  }
};

export const getDemographicsSummary = (neighborhoodName: string): DemographicsSummary | null => {
  const neighborhood = rawData[neighborhoodName as keyof typeof rawData];
  if (!neighborhood) return null;

  const data = neighborhood.data || neighborhood.combined;
  if (!data) return null;

  const totalPopulation = data.childrenUnder18 + data.workingAgeAdults + data.olderAdults;

  return {
    totalPopulation,
    ageDistribution: {
      children: Math.round((data.childrenUnder18 / totalPopulation) * 100),
      workingAge: Math.round((data.workingAgeAdults / totalPopulation) * 100),
      elderly: Math.round((data.olderAdults / totalPopulation) * 100)
    },
    medianAge: data.medianAgeTotal,
    genderRatio: {
      male: Math.round((data.aggregateAgeMale / data.aggregateAgeTotal) * 100),
      female: Math.round((data.aggregateAgeFemale / data.aggregateAgeTotal) * 100)
    }
  };
};