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
    response: 'Hello! I can help you explore demographic data for Seattle neighborhoods. What would you like to know?'
  },
  {
    keywords: ['help', 'how', 'use', 'guide'],
    response: 'You can ask me about specific neighborhoods, compare demographics, or inquire about population, age distribution, and median income across different areas of Seattle.'
  },
  {
    keywords: ['thanks', 'thank you', 'thx', 'appreciate'],
    response: "You're welcome! Let me know if you have any other questions about Seattle's neighborhoods."
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'farewell'],
    response: "Goodbye! Feel free to come back if you need more information about Seattle's neighborhoods."
  },
  {
    keywords: ['great', 'awesome', 'excellent', 'perfect', 'nice'],
    response: "I'm glad I could help! Is there anything else you'd like to know about Seattle's neighborhoods?"
  }
];

export const neighborhoodResponses: ResponseTemplate[] = [
  {
    keywords: ['richest', 'wealthiest', 'highest income', 'most expensive'],
    response: 'South Lake Union has the highest median income at $115,620, followed by Queen Anne at $109,750. These neighborhoods are known for their luxury housing and proximity to tech companies.'
  },
  {
    keywords: ['youngest', 'youngest neighborhood', 'student', 'college'],
    response: 'The University District is the youngest neighborhood with a median age of 22.9 years, largely due to its student population. South Lake Union also has a relatively young population with a median age of 30.1 years.'
  },
  {
    keywords: ['population', 'biggest', 'largest', 'most people'],
    response: 'Queen Anne has the largest population among the major neighborhoods with over 45,000 residents, followed by Capitol Hill with approximately 42,000 residents.'
  },
  {
    keywords: ['compare', 'comparison', 'difference', 'versus', 'vs'],
    response: 'The neighborhoods show significant demographic variations. For example, South Lake Union and Queen Anne have the highest median incomes ($115,620 and $109,750 respectively), while the University District has the lowest ($52,180). Age distributions also vary widely, from the University District\'s young median age of 22.9 years to more established neighborhoods.'
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
        return `${neighborhood} has a population of ${data.totalPopulation.toLocaleString()} people, with a median age of ${data.medianAge.toFixed(1)} years and a median income of $${data.medianIncome.toLocaleString()}. The age distribution is ${data.ageDistribution.children}% children, ${data.ageDistribution.workingAge}% working-age adults, and ${data.ageDistribution.elderly}% elderly residents.`;
      }
    }
  }
  
  // Check neighborhood-specific responses
  for (const template of neighborhoodResponses) {
    if (template.keywords.some(keyword => normalizedInput.includes(keyword))) {
      return template.response;
    }
  }
  
  // Default response if no match found
  return "I can help you learn about Seattle's neighborhoods. You can ask about specific areas like Capitol Hill or Ballard, or ask about demographics, income levels, and population statistics across different neighborhoods.";
};