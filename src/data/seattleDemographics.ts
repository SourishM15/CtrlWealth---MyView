import { NeighborhoodDemographics, DemographicsSummary, NeighborhoodForecast, NeighborhoodHistory } from '../types/demographics';

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
          { year: 2020, value: 29800 },
          { year: 2021, value: 30450 },
          { year: 2022, value: 31200 },
          { year: 2023, value: 32050 }
        ],
        medianIncome: [
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
      medianAgeFemale: (30.7 + 34.4) / 2,
      medianIncome: 89120,
      history: {
        population: [
          { year: 2020, value: 71200 },
          { year: 2021, value: 72800 },
          { year: 2022, value: 74350 },
          { year: 2023, value: 75250 }
        ],
        medianIncome: [
          { year: 2020, value: 83500 },
          { year: 2021, value: 85170 },
          { year: 2022, value: 87300 },
          { year: 2023, value: 89120 }
        ]
      },
      forecast: {
        population: [
          { year: 2024, value: 76545 },
          { year: 2025, value: 77890 },
          { year: 2026, value: 79250 }
        ],
        medianIncome: [
          { year: 2024, value: 90902 },
          { year: 2025, value: 92720 },
          { year: 2026, value: 94574 }
        ]
      }
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
      medianAgeFemale: 37.9,
      medianIncome: 82460,
      history: {
        population: [
          { year: 2020, value: 40200 },
          { year: 2021, value: 41350 },
          { year: 2022, value: 42500 },
          { year: 2023, value: 43080 }
        ],
        medianIncome: [
          { year: 2020, value: 77200 },
          { year: 2021, value: 78744 },
          { year: 2022, value: 80715 },
          { year: 2023, value: 82460 }
        ]
      },
      forecast: {
        population: [
          { year: 2024, value: 43890 },
          { year: 2025, value: 44750 },
          { year: 2026, value: 45620 }
        ],
        medianIncome: [
          { year: 2024, value: 84109 },
          { year: 2025, value: 85791 },
          { year: 2026, value: 87507 }
        ]
      }
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
      medianAgeFemale: (33.1 + 32.2) / 2,
      medianIncome: 98340,
      history: {
        population: [
          { year: 2020, value: 23800 },
          { year: 2021, value: 24350 },
          { year: 2022, value: 24950 },
          { year: 2023, value: 25450 }
        ],
        medianIncome: [
          { year: 2020, value: 92100 },
          { year: 2021, value: 94125 },
          { year: 2022, value: 96240 },
          { year: 2023, value: 98340 }
        ]
      },
      forecast: {
        population: [
          { year: 2024, value: 25940 },
          { year: 2025, value: 26450 },
          { year: 2026, value: 26970 }
        ],
        medianIncome: [
          { year: 2024, value: 100307 },
          { year: 2025, value: 102313 },
          { year: 2026, value: 104359 }
        ]
      }
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
      medianAgeFemale: 36.0,
      medianIncome: 109750,
      history: {
        population: [
          { year: 2020, value: 43200 },
          { year: 2021, value: 44150 },
          { year: 2022, value: 45300 },
          { year: 2023, value: 45850 }
        ],
        medianIncome: [
          { year: 2020, value: 102800 },
          { year: 2021, value: 104856 },
          { year: 2022, value: 107270 },
          { year: 2023, value: 109750 }
        ]
      },
      forecast: {
        population: [
          { year: 2024, value: 46720 },
          { year: 2025, value: 47650 },
          { year: 2026, value: 48600 }
        ],
        medianIncome: [
          { year: 2024, value: 111945 },
          { year: 2025, value: 114184 },
          { year: 2026, value: 116468 }
        ]
      }
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
      medianAgeFemale: (22.5 + 22.2) / 2,
      medianIncome: 52180,
      history: {
        population: [
          { year: 2020, value: 48900 },
          { year: 2021, value: 49850 },
          { year: 2022, value: 50950 },
          { year: 2023, value: 51650 }
        ],
        medianIncome: [
          { year: 2020, value: 48900 },
          { year: 2021, value: 49878 },
          { year: 2022, value: 51025 },
          { year: 2023, value: 52180 }
        ]
      },
      forecast: {
        population: [
          { year: 2024, value: 52658 },
          { year: 2025, value: 53700 },
          { year: 2026, value: 54770 }
        ],
        medianIncome: [
          { year: 2024, value: 53224 },
          { year: 2025, value: 54288 },
          { year: 2026, value: 55374 }
        ]
      }
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
      medianAgeFemale: 35.4,
      medianIncome: 115620,
      history: {
        population: [
          { year: 2020, value: 11200 },
          { year: 2021, value: 11550 },
          { year: 2022, value: 11850 },
          { year: 2023, value: 12050 }
        ],
        medianIncome: [
          { year: 2020, value: 108400 },
          { year: 2021, value: 110568 },
          { year: 2022, value: 113100 },
          { year: 2023, value: 115620 }
        ]
      },
      forecast: {
        population: [
          { year: 2024, value: 12280 },
          { year: 2025, value: 12520 },
          { year: 2026, value: 12770 }
        ],
        medianIncome: [
          { year: 2024, value: 117932 },
          { year: 2025, value: 120291 },
          { year: 2026, value: 122697 }
        ]
      }
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
    },
    medianIncome: data.medianIncome,
    history: data.history,
    forecast: data.forecast
  };
};