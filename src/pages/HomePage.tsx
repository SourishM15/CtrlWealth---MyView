import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import ChatInterface from '../components/ChatInterface';
import { washingtonMetrics } from '../data/inequalityData';

const HomePage: React.FC = () => {
  const mapRef = useRef<SVGSVGElement>(null);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const width = 960;
    const height = 700;
    
    // Clear previous content
    d3.select(mapRef.current).selectAll("*").remove();

    const svg = d3.select(mapRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", "100%");

    // Add a background rect
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#f8fafc");

    // Custom projection centered on Washington
    const projection = d3.geoAlbers()
      .center([-120.7, 47.4])
      .scale(5000)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    // Add zoom behavior to SVG
    svg.call(zoom);

    // Create a container for the map
    const g = svg.append("g");

    // Load US map data
    Promise.all([
      d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
    ]).then(([us]) => {
      if (!us) return;

      const states = feature(us, us.objects.states);
      
      // Create tooltip
      const tooltip = d3.select("body").append("div")
        .attr("class", "absolute hidden bg-white shadow-lg rounded-lg p-4 text-sm border border-gray-200")
        .style("pointer-events", "none")
        .style("z-index", "1000");

      // Draw only Washington
      g.selectAll("path")
        .data(states.features.filter(d => d.properties?.name === 'Washington'))
        .join("path")
        .attr("fill", "#10B981")
        .attr("d", path)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .attr("opacity", 0.8)
        .on("mouseover", (event, d) => {
          d3.select(event.currentTarget)
            .attr("opacity", 1)
            .attr("stroke-width", 2);

          const metrics = washingtonMetrics;
          const gini = metrics.find(m => m.id === 'gini')?.currentValue.toFixed(2);
          const poverty = metrics.find(m => m.id === 'poverty-rate')?.currentValue.toFixed(1);
          const wealth = metrics.find(m => m.id === 'wealth-top1')?.currentValue.toFixed(1);

          tooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
            .html(`
              <div class="font-semibold text-gray-800 mb-2">Washington State</div>
              <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span class="text-gray-600">Gini Coefficient:</span>
                <span class="font-medium text-indigo-600">${gini}</span>
                <span class="text-gray-600">Poverty Rate:</span>
                <span class="font-medium text-emerald-600">${poverty}%</span>
                <span class="text-gray-600">Top 1% Wealth:</span>
                <span class="font-medium text-amber-600">${wealth}%</span>
              </div>
            `)
            .classed("hidden", false);
        })
        .on("mouseout", (event) => {
          d3.select(event.currentTarget)
            .attr("opacity", 0.8)
            .attr("stroke-width", 1);
          
          tooltip.classed("hidden", true);
        });

      // Add Washington label
      g.selectAll("text")
        .data(states.features.filter(d => d.properties?.name === 'Washington'))
        .join("text")
        .attr("x", d => path.centroid(d)[0])
        .attr("y", d => path.centroid(d)[1])
        .attr("text-anchor", "middle")
        .attr("fill", "#1F2937")
        .attr("font-size", "14px")
        .attr("font-weight", "500")
        .text("Washington");
    });

    return () => {
      // Cleanup tooltip
      d3.select("body").selectAll("div.tooltip").remove();
    };
  }, []);

  const stats = {
    gini: washingtonMetrics.find(m => m.id === 'gini')?.currentValue.toFixed(2),
    poverty: washingtonMetrics.find(m => m.id === 'poverty-rate')?.currentValue.toFixed(1),
    wealth: washingtonMetrics.find(m => m.id === 'wealth-top1')?.currentValue.toFixed(1)
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar with chat */}
        <div className="lg:col-span-3">
          <ChatInterface onChatQuery={() => {}} />
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Washington State Inequality Overview
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Hover for details</span>
                <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div 
                className="bg-indigo-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md"
                onMouseEnter={() => setHoveredMetric('gini')}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <h3 className="text-sm font-semibold text-indigo-800">Gini Coefficient</h3>
                <p className="text-2xl font-bold text-indigo-600">{stats.gini}</p>
                <p className="text-xs text-indigo-600 mt-1">Measure of income inequality</p>
              </div>
              <div 
                className="bg-emerald-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md"
                onMouseEnter={() => setHoveredMetric('poverty')}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <h3 className="text-sm font-semibold text-emerald-800">Poverty Rate</h3>
                <p className="text-2xl font-bold text-emerald-600">{stats.poverty}%</p>
                <p className="text-xs text-emerald-600 mt-1">Population below poverty line</p>
              </div>
              <div 
                className="bg-amber-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md"
                onMouseEnter={() => setHoveredMetric('wealth')}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <h3 className="text-sm font-semibold text-amber-800">Top 1% Wealth Share</h3>
                <p className="text-2xl font-bold text-amber-600">{stats.wealth}%</p>
                <p className="text-xs text-amber-600 mt-1">Wealth owned by top 1%</p>
              </div>
            </div>
            
            <div className="relative w-full h-[600px] rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
              <svg ref={mapRef} className="w-full h-full" />
              {hoveredMetric && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md shadow-sm">
                  <p className="text-sm font-medium text-gray-800">
                    {hoveredMetric === 'gini' && 'Gini Coefficient: Income inequality measure'}
                    {hoveredMetric === 'poverty' && 'Poverty Rate: Population below poverty line'}
                    {hoveredMetric === 'wealth' && 'Top 1% Wealth Share: Concentration of wealth'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;