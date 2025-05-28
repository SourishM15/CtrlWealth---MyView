import React from 'react';
import { FilterState } from '../types';
import { getDemographicsSummary } from '../data/seattleDemographics';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import Analysis from './Analysis';

interface VisualizationPanelProps {
  filters: FilterState;
}

const neighborhoods = [
  'Ballard',
  'Capitol Hill',
  'Downtown',
  'Fremont',
  'Queen Anne',
  'University District',
  'West Seattle',
  'South Lake Union'
];

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ filters }) => {
  const getNeighborhoodMetrics = () => {
    return neighborhoods.map(name => {
      const data = getDemographicsSummary(name);
      if (!data) return null;

      return {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        currentValue: data.medianIncome / 1000, // Convert to thousands for better display
        description: `Median income and demographics for ${name}`,
        unit: 'k',
        domain: [0, 120],
        historicalValues: [], // We could add historical data here if available
        forecastValues: [] // We could add forecast data here if available
      };
    }).filter(Boolean);
  };

  const metrics = getNeighborhoodMetrics();

  // Render appropriate charts based on timeframe
  const renderCharts = () => {
    if (filters.timeframe === 'current') {
      // Show bar charts for current values
      return (
        <div className="grid grid-cols-1 gap-6 mb-6">
          <BarChart 
            metrics={metrics}
            title="Median Income by Neighborhood ($K)"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {neighborhoods.map(name => {
              const data = getDemographicsSummary(name);
              if (!data) return null;

              return (
                <div key={name} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{name}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Population</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {data.totalPopulation.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Median Age</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {data.medianAge.toFixed(1)} years
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Age Distribution</p>
                      <div className="flex gap-2 mt-1">
                        <div className="flex-1 bg-blue-100 dark:bg-blue-900 rounded p-2">
                          <p className="text-xs text-blue-800 dark:text-blue-200">Children</p>
                          <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                            {data.ageDistribution.children}%
                          </p>
                        </div>
                        <div className="flex-1 bg-purple-100 dark:bg-purple-900 rounded p-2">
                          <p className="text-xs text-purple-800 dark:text-purple-200">Working</p>
                          <p className="text-sm font-bold text-purple-900 dark:text-purple-100">
                            {data.ageDistribution.workingAge}%
                          </p>
                        </div>
                        <div className="flex-1 bg-amber-100 dark:bg-amber-900 rounded p-2">
                          <p className="text-xs text-amber-800 dark:text-amber-200">Elderly</p>
                          <p className="text-sm font-bold text-amber-900 dark:text-amber-100">
                            {data.ageDistribution.elderly}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div>
      {renderCharts()}
      <Analysis filters={filters} />
    </div>
  );
};

export default VisualizationPanel;