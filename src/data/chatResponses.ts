// Pre-defined responses for the chat interface
import { getDemographicsSummary } from './seattleDemographics';

interface ResponseTemplate {
  keywords: string[];
  response: string;
}

const neighborhoods = [
  'Ballard',
  'Capitol Hill',
  'Downtown',
  'Fremont',
  'Queen Anne',
  'University District',
  'South Lake Union'
];

export const generalResponses: ResponseTemplate[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response: 'Hello! I can help you explore demographic data and income trends for Seattle neighborhoods. What would you like to know?'
  },
  {
    keywords: ['help', 'how', 'use', 'guide'],
    response: 'You can ask me about specific neighborhoods, compare demographics, or inquire about population trends, income levels, and forecasts. Try asking about "median income", "population growth", or specific neighborhoods like "South Lake Union" or "Capitol Hill".'
  },
  {
    keywords: ['thanks', 'thank you', 'thx', 'appreciate'],
    response: "You're welcome! Let me know if you need more information about Seattle's neighborhoods, including historical trends or future projections."
  }
];

const getIncomeComparison = () => {
  const neighborhoodData = neighborhoods.map(name => ({
    name,
    data: getDemographicsSummary(name)
  })).filter(n => n.data);

  const sorted = [...neighborhoodData].sort((a, b) => 
    (b.data?.medianIncome || 0) - (a.data?.medianIncome || 0)
  );

  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];
  
  return {
    highest,
    lowest,
    difference: (highest.data?.medianIncome || 0) - (lowest.data?.medianIncome || 0)
  };
};

const getGrowthRates = () => {
  return neighborhoods.map(name => {
    const data = getDemographicsSummary(name);
    if (!data?.forecast?.medianIncome) return null;

    const lastValue = data.forecast.medianIncome[data.forecast.medianIncome.length - 1].value;
    const firstValue = data.forecast.medianIncome[0].value;
    const years = data.forecast.medianIncome.length;
    const annualGrowth = ((lastValue / firstValue) ** (1 / years) - 1) * 100;

    return {
      name,
      growthRate: annualGrowth
    };
  }).filter(Boolean).sort((a, b) => b.growthRate - a.growthRate);
};

export const getResponseForInput = (input: string): string => {
  const normalizedInput = input.toLowerCase();
  
  // Check for neighborhood-specific queries
  for (const neighborhood of neighborhoods) {
    if (normalizedInput.includes(neighborhood.toLowerCase())) {
      const data = getDemographicsSummary(neighborhood);
      if (data) {
        const forecast = data.forecast?.medianIncome;
        const history = data.history?.medianIncome;
        
        let response = `${neighborhood} currently has a median income of $${data.medianIncome.toLocaleString()} `;
        
        if (history && history.length > 0) {
          const startYear = history[0].year;
          const startValue = history[0].value;
          const growth = ((data.medianIncome - startValue) / startValue * 100).toFixed(1);
          response += `which represents a ${growth}% increase since ${startYear}. `;
        }
        
        if (forecast && forecast.length > 0) {
          const endYear = forecast[forecast.length - 1].year;
          const projectedValue = forecast[forecast.length - 1].value;
          response += `By ${endYear}, the median income is projected to reach $${Math.round(projectedValue).toLocaleString()}. `;
        }
        
        return response;
      }
    }
  }
  
  // Handle income-related queries
  if (normalizedInput.includes('income') || normalizedInput.includes('salary') || normalizedInput.includes('earnings')) {
    const comparison = getIncomeComparison();
    const growthRates = getGrowthRates();
    
    return `Currently, ${comparison.highest.name} has the highest median income at $${comparison.highest.data?.medianIncome.toLocaleString()}, ` +
           `while ${comparison.lowest.name} has the lowest at $${comparison.lowest.data?.medianIncome.toLocaleString()}. ` +
           `The income gap between these neighborhoods is $${comparison.difference.toLocaleString()}. ` +
           `Looking ahead, ${growthRates[0].name} shows the strongest income growth potential at ${growthRates[0].growthRate.toFixed(1)}% annually.`;
  }

  // Handle growth/trend queries
  if (normalizedInput.includes('growth') || normalizedInput.includes('trend') || normalizedInput.includes('forecast')) {
    const growthRates = getGrowthRates();
    return `Based on our forecasts, ${growthRates[0].name} shows the highest projected income growth at ${growthRates[0].growthRate.toFixed(1)}% annually, ` +
           `followed by ${growthRates[1].name} at ${growthRates[1].growthRate.toFixed(1)}%. ` +
           `${growthRates[growthRates.length - 1].name} shows more modest growth at ${growthRates[growthRates.length - 1].growthRate.toFixed(1)}% annually.`;
  }

  // Handle comparison queries
  if (normalizedInput.includes('compare') || normalizedInput.includes('difference') || normalizedInput.includes('gap')) {
    const comparison = getIncomeComparison();
    return `The income gap between Seattle neighborhoods is significant. ${comparison.highest.name} leads with $${comparison.highest.data?.medianIncome.toLocaleString()}, ` +
           `while ${comparison.lowest.name} has a median income of $${comparison.lowest.data?.medianIncome.toLocaleString()}. ` +
           `This represents a difference of $${comparison.difference.toLocaleString()}.`;
  }

  // Check for general responses
  for (const template of generalResponses) {
    if (template.keywords.some(keyword => normalizedInput.includes(keyword))) {
      return template.response;
    }
  }
  
  // Default response
  return "I can help you explore income trends and forecasts across Seattle's neighborhoods. Try asking about specific neighborhoods, income comparisons, or growth trends.";
};