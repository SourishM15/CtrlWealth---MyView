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
    response: 'You can ask me about specific neighborhoods, compare demographics, or inquire about population trends, income forecasts, and historical data across different areas of Seattle.'
  },
  {
    keywords: ['thanks', 'thank you', 'thx', 'appreciate'],
    response: "You're welcome! Let me know if you need more information about Seattle's neighborhoods, including historical trends or future projections."
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'farewell'],
    response: "Goodbye! Feel free to return if you need more insights about Seattle's neighborhoods and their demographic trends."
  },
  {
    keywords: ['great', 'awesome', 'excellent', 'perfect', 'nice'],
    response: "I'm glad I could help! Would you like to explore more detailed trends or forecasts for any specific neighborhood?"
  }
];

export const neighborhoodResponses: ResponseTemplate[] = [
  {
    keywords: ['richest', 'wealthiest', 'highest income', 'most expensive'],
    response: 'South Lake Union currently has the highest median income at $115,620, followed by Queen Anne at $109,750. Based on our forecasts, South Lake Union is expected to maintain the highest income growth rate at 4.5% annually, potentially reaching $150,000 by 2026.'
  },
  {
    keywords: ['youngest', 'youngest neighborhood', 'student', 'college'],
    response: 'The University District maintains the youngest demographic with a median age of 22.9 years. Historical data shows this has been consistent since 2000, primarily due to the student population. South Lake Union has seen its median age decrease from 35 to 30.1 years over the past decade due to the influx of young tech workers.'
  },
  {
    keywords: ['population', 'biggest', 'largest', 'most people'],
    response: 'Queen Anne has the largest population with over 45,000 residents, followed by Capitol Hill with approximately 42,000 residents. Historical data shows Queen Anne has grown steadily at 2% annually since 2000, while Capitol Hill has seen more rapid growth at 2.8% annually.'
  },
  {
    keywords: ['compare', 'comparison', 'difference', 'versus', 'vs'],
    response: 'The neighborhoods show significant demographic and income variations. South Lake Union and Queen Anne lead in median incomes ($115,620 and $109,750) with the strongest growth trends. The University District has maintained the lowest median income ($52,180) but shows stable growth. Population growth has been highest in South Lake Union (3.5% annually) and Capitol Hill (2.8% annually).'
  },
  {
    keywords: ['trend', 'forecast', 'future', 'prediction', 'growth'],
    response: 'Our forecasts show South Lake Union leading income growth at 4.5% annually, followed by Capitol Hill at 3.8%. Population growth is expected to be highest in South Lake Union (3.5%) and Ballard (2.5%). The University District is projected to maintain steady but slower growth in both metrics.'
  },
  {
    keywords: ['historical', 'history', 'past', 'previous', 'before'],
    response: 'Since 2000, the most dramatic changes have been in South Lake Union, where median income has increased from $75,000 to $115,620, and population has grown from 8,000 to nearly 12,000 residents. Capitol Hill has seen the second-highest historical growth, with income rising from $55,000 to $89,120.'
  }
];

export const getResponseForInput = (input: string): string => {
  // Normalize input
  const normalizedInput = input.toLowerCase();
  
  // Check for friendly interactions first
  for (const template of generalResponses) {
    if (template.keywords.some(keyword => normalizedInput.includes(keyword))) {
      return template.response;
    }
  }
  
  // Check for specific neighborhood mentions
  for (const neighborhood of neighborhoods) {
    if (normalizedInput.includes(neighborhood.toLowerCase())) {
      const data = getDemographicsSummary(neighborhood);
      if (data) {
        // Include historical and forecast information if available
        let response = `${neighborhood} currently has a population of ${data.totalPopulation.toLocaleString()} people, with a median age of ${data.medianAge.toFixed(1)} years and a median income of $${data.medianIncome.toLocaleString()}. `;
        
        if (data.history && data.forecast) {
          const historicalStart = data.history.population[0];
          const historicalEnd = data.history.population[data.history.population.length - 1];
          const forecastEnd = data.forecast.population[data.forecast.population.length - 1];
          
          const populationGrowth = ((historicalEnd.value - historicalStart.value) / historicalStart.value * 100).toFixed(1);
          const projectedGrowth = ((forecastEnd.value - historicalEnd.value) / historicalEnd.value * 100).toFixed(1);
          
          response += `Since ${historicalStart.year}, the population has grown ${populationGrowth}% and is projected to grow another ${projectedGrowth}% by ${forecastEnd.year}. `;
          response += `The median income is forecast to reach $${Math.round(data.forecast.medianIncome[data.forecast.medianIncome.length - 1].value).toLocaleString()} by ${forecastEnd.year}.`;
        }
        
        return response;
      }
    }
  }
  
  // Check for trend-related keywords
  if (normalizedInput.includes('trend') || normalizedInput.includes('forecast') || 
      normalizedInput.includes('future') || normalizedInput.includes('prediction')) {
    return neighborhoodResponses.find(r => r.keywords.includes('trend'))?.response || '';
  }
  
  // Check for historical data keywords
  if (normalizedInput.includes('historical') || normalizedInput.includes('history') || 
      normalizedInput.includes('past')) {
    return neighborhoodResponses.find(r => r.keywords.includes('historical'))?.response || '';
  }
  
  // Check other neighborhood-specific responses
  for (const template of neighborhoodResponses) {
    if (template.keywords.some(keyword => normalizedInput.includes(keyword))) {
      return template.response;
    }
  }
  
  // Default response if no match found
  return "I can help you learn about Seattle's neighborhoods, including historical trends and future projections. You can ask about specific areas like Capitol Hill or Ballard, or inquire about demographics, income levels, and population trends across different neighborhoods.";
};