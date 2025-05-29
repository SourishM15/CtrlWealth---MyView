import { NeighborhoodDemographics, DemographicsSummary, NeighborhoodForecast, NeighborhoodHistory } from '../types/demographics';

// Generate historical data from 2000 to 2019
const generateHistoricalData = (startValue: number, endValue: number, startYear = 2000) => {
  const years = 2020 - startYear;
  const yearlyGrowth = (endValue - startValue) / years;
  
  return Array.from({ length: years }, (_, i) => ({
    year: startYear + i,
    value: Math.round(startValue + yearlyGrowth * i)
  }));
};

const rawData = {
  "Ballard": {
    combined: {
      childrenUnder18: 1088 + 2599,
      workingAgeAdults: 9152 + 17128,
      olderAdults: 925 + 1638,
      aggregateAgeTotal: 369056.7 + 706129.1,
      aggregateAgeMale: 173536 + 352190.6,
      aggregateAgeFemale: 197761.1 + 356414.6,
      medianAgeTotal: (33 + 33) / 2,
      medianAgeMale: (32 + 32.5) / 2,
      medianAgeFemale: (34.3 + 33.7) / 2,
      medianIncome: 94250,
      history: {
        population: [
          ...generateHistoricalData(20000, 29000),
          { year: 2020, value: 29800 },
          { year: 2021, value: 30450 },
          { year: 2022, value: 31200 },
          { year: 2023, value: 32050 }
        ],
        medianIncome: [
          ...generateHistoricalData(65000, 87000),
          { year: 2020, value: 88500 },
          { year: 2021, value: 90270 },
          { year: 2022, value: 92075 },
          { year: 2023, value: 94250 }
        ]
      },
      forecast: {
        population: [
          { year: 2024, value: 32730 },
          { year: 2025, value: 33450 },
          { year: 2026, value: 34200 }
        ],
        medianIncome: [
          { year: 2024, value: 96135 },
          { year: 2025, value: 98058 },
          { year: 2026, value: 100019 }
        ]
      }
    }
  },
  // ... (rest of the neighborhoods with similar historical data structure)
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
    },
    medianIncome: data.medianIncome,
    history: data.history,
    forecast: data.forecast
  };
};