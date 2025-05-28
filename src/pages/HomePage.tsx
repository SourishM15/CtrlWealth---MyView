import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import ChatInterface from '../components/ChatInterface';
import { usMetrics, washingtonMetrics } from '../data/inequalityData';

const HomePage: React.FC = () => {
  const mapRef = useRef<SVGSVGElement>(null);
  const [selectedState, setSelectedState] = useState<'US' | 'WA'>('US');
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const width = 960;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Clear previous content
    d3.select(mapRef.current).selectAll("*").remove();

    const svg = d3.select(mapRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", "100%");

    // Add a background rect for better UX
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#f8fafc");

    const projection = d3.geoAlbersUsa()
      .scale(1000)
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

      // Draw states
      g.selectAll("path")
        .data(states.features)
        .join("path")
        .attr("class", "state")
        .attr("fill", d => {
          const stateName = d.properties?.name;
          if (stateName === 'Washington') {
            return selectedState === 'WA' ? '#059669' : '#10B981';
          }
          return selectedState === 'US' ? '#4338CA' : '#6366F1';
        })
        .attr("d", path)
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .attr("opacity", d => {
          const stateName = d.properties?.name;
          return (stateName === 'Washington' || selectedState === 'US') ? 0.8 : 0.3;
        })
        .on("mouseover", (event, d) => {
          const stateName = d.properties?.name;
          setHoveredState(stateName);

          // Only show detailed tooltip for Washington or when viewing all states
          if (stateName === 'Washington' || selectedState === 'US') {
            d3.select(event.currentTarget)
              .attr("opacity", 1)
              .attr("stroke-width", 2);

            const metrics = stateName === 'Washington' ? washingtonMetrics : usMetrics;
            const gini = metrics.find(m => m.id === 'gini')?.currentValue.toFixed(2);
            const poverty = metrics.find(m => m.id === 'poverty-rate')?.currentValue.toFixed(1);
            const wealth = metrics.find(m => m.id === 'wealth-top1')?.currentValue.toFixed(1);

            tooltip
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 28) + "px")
              .html(`
                <div class="font-semibold text-gray-800 mb-2">${stateName}</div>
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
          }
        })
        .on("mouseout", (event) => {
          setHoveredState(null);
          d3.select(event.currentTarget)
            .attr("opacity", d => {
              const stateName = d.properties?.name;
              return (stateName === 'Washington' || selectedState === 'US') ? 0.8 : 0.3;
            })
            .attr("stroke-width", 0.5);
          
          tooltip.classed("hidden", true);
        })
        .on("click", (event, d) => {
          const stateName = d.properties?.name;
          if (stateName === 'Washington') {
            setSelectedState(prev => prev === 'WA' ? 'US' : 'WA');
            
            // Zoom to Washington when selected
            if (selectedState !== 'WA') {
              const bounds = path.bounds(d);
              const dx = bounds[1][0] - bounds[0][0];
              const dy = bounds[1][1] - bounds[0][1];
              const x = (bounds[0][0] + bounds[1][0]) / 2;
              const y = (bounds[0][1] + bounds[1][1]) / 2;
              const scale = Math.min(8, 0.9 / Math.max(dx / width, dy / height));
              const translate = [width / 2 - scale * x, height / 2 - scale * y];

              svg.transition()
                .duration(750)
                .call(
                  zoom.transform,
                  d3.zoomIdentity
                    .translate(translate[0], translate[1])
                    .scale(scale)
                );
            } else {
              // Reset zoom when deselecting
              svg.transition()
                .duration(750)
                .call(
                  zoom.transform,
                  d3.zoomIdentity
                );
            }
          }
        });

      // Add state labels for important states
      g.selectAll("text")
        .data(states.features)
        .join("text")
        .filter(d => d.properties?.name === 'Washington')
        .attr("x", d => path.centroid(d)[0])
        .attr("y", d => path.centroid(d)[1])
        .attr("text-anchor", "middle")
        .attr("fill", "#1F2937")
        .attr("font-size", "10px")
        .attr("font-weight", "500")
        .text(d => d.properties?.name);
    });

    return () => {
      // Cleanup tooltip
      d3.select("body").selectAll("div.tooltip").remove();
    };
  }, [selectedState]);

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
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedState === 'WA' ? 'Washington State' : 'United States'} Inequality Overview
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Click on Washington to focus</span>
                <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md">
                <h3 className="text-sm font-semibold text-indigo-800">Gini Coefficient</h3>
                <p className="text-2xl font-bold text-indigo-600">{stats.gini}</p>
                <p className="text-xs text-indigo-600 mt-1">Measure of income inequality</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md">
                <h3 className="text-sm font-semibold text-emerald-800">Poverty Rate</h3>
                <p className="text-2xl font-bold text-emerald-600">{stats.poverty}%</p>
                <p className="text-xs text-emerald-600 mt-1">Population below poverty line</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md">
                <h3 className="text-sm font-semibold text-amber-800">Top 1% Wealth Share</h3>
                <p className="text-2xl font-bold text-amber-600">{stats.wealth}%</p>
                <p className="text-xs text-amber-600 mt-1">Wealth owned by top 1%</p>
              </div>
            </div>
            
            <div className="relative w-full h-[500px] rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
              <svg ref={mapRef} className="w-full h-full" />
              {hoveredState && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md shadow-sm">
                  <p className="text-sm font-medium text-gray-800">{hoveredState}</p>
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