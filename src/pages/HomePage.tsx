import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import ChatInterface from '../components/ChatInterface';
import { usMetrics, washingtonMetrics } from '../data/inequalityData';

const HomePage: React.FC = () => {
  const mapRef = useRef<SVGSVGElement>(null);
  const [selectedState, setSelectedState] = useState<'US' | 'WA'>('US');
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapRef.current) return;

    const width = 960;
    const height = 500;

    // Clear previous content
    d3.select(mapRef.current).selectAll("*").remove();

    const svg = d3.select(mapRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", "100%");

    const projection = d3.geoAlbersUsa()
      .scale(1000)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Load US map data
    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
      .then((us: any) => {
        if (!us) return;

        const states = feature(us, us.objects.states);

        // Draw states
        svg.append("g")
          .selectAll("path")
          .data(states.features)
          .join("path")
          .attr("fill", d => {
            const stateName = d.properties?.name;
            return stateName === 'Washington' ? '#10B981' : '#4F46E5';
          })
          .attr("d", path)
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.5)
          .attr("opacity", 0.8)
          .on("mouseover", (event) => {
            d3.select(event.currentTarget)
              .attr("opacity", 1)
              .attr("stroke-width", 1.5);
          })
          .on("mouseout", (event) => {
            d3.select(event.currentTarget)
              .attr("opacity", 0.8)
              .attr("stroke-width", 0.5);
          })
          .on("click", (event, d: any) => {
            const stateName = d.properties?.name;
            if (stateName === 'Washington') {
              navigate('/seattle');
            } else {
              setSelectedState(stateName === 'Washington' ? 'WA' : 'US');
            }
          });
      })
      .catch(error => {
        console.error("Error loading map data:", error);
      });
  }, [navigate]);

  const getQuickStats = () => {
    const metrics = selectedState === 'WA' ? washingtonMetrics : usMetrics;
    return {
      gini: metrics.find(m => m.id === 'gini')?.currentValue.toFixed(2),
      poverty: metrics.find(m => m.id === 'poverty-rate')?.currentValue.toFixed(1),
      wealth: metrics.find(m => m.id === 'wealth-top1')?.currentValue.toFixed(1)
    };
  };

  const stats = getQuickStats();

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar with chat */}
        <div className="lg:col-span-3">
          <ChatInterface onChatQuery={() => {}} />
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-9">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {selectedState === 'WA' ? 'Washington State' : 'United States'} Inequality Overview
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-indigo-800 dark:text-indigo-200">Gini Coefficient</h3>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">{stats.gini}</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Poverty Rate</h3>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">{stats.poverty}%</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">Top 1% Wealth Share</h3>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-300">{stats.wealth}%</p>
              </div>
            </div>
            <div className="w-full h-[500px] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <svg ref={mapRef} className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;