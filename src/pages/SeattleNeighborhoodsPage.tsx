import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { getDemographicsSummary } from '../data/seattleDemographics';
import DemographicsModal from '../components/DemographicsModal';

const neighborhoods = [
  { id: 'ballard', name: 'Ballard', description: 'Historic maritime district known for craft breweries and the Hiram M. Chittenden Locks' },
  { id: 'capitol-hill', name: 'Capitol Hill', description: 'Vibrant arts and culture hub with diverse dining and nightlife' },
  { id: 'downtown', name: 'Downtown', description: 'Urban core featuring Pike Place Market and major shopping destinations' },
  { id: 'fremont', name: 'Fremont', description: 'Quirky area known as the "Center of the Universe" with public art and tech companies' },
  { id: 'queen-anne', name: 'Queen Anne', description: 'Historic neighborhood with stunning views and Kerry Park' },
  { id: 'u-district', name: 'University District', description: 'Academic hub around UW with youthful energy and diverse cuisines' },
  { id: 'west-seattle', name: 'West Seattle', description: 'Beachside community with Alki Beach and stunning city views' },
  { id: 'south-lake-union', name: 'South Lake Union', description: 'Modern tech hub with Amazon campus and Lake Union activities' }
];

const SeattleNeighborhoodsPage: React.FC = () => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [demographicsData, setDemographicsData] = useState<any | null>(null);

  const handleNeighborhoodClick = (name: string) => {
    const data = getDemographicsSummary(name);
    if (data) {
      setSelectedNeighborhood(name);
      setDemographicsData(data);
    } else {
      console.warn(`No demographic data found for neighborhood: ${name}`);
      // Optionally show a user-friendly error message here
    }
  };

  const handleCloseModal = () => {
    setSelectedNeighborhood(null);
    setDemographicsData(null);
  };

  const getDisplayName = (id: string): string => {
    switch (id) {
      case 'u-district':
        return 'University District';
      case 'capitol-hill':
        return 'Capitol Hill';
      case 'south-lake-union':
        return 'South Lake Union';
      default:
        return id.charAt(0).toUpperCase() + id.slice(1);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Seattle Neighborhoods</h1>
          <p className="text-xl text-gray-600">Explore demographic data across Seattle's diverse communities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {neighborhoods.map((neighborhood) => (
            <div
              key={neighborhood.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-indigo-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">{neighborhood.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{neighborhood.description}</p>
                <button
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 group-hover:shadow-md"
                  onClick={() => handleNeighborhoodClick(getDisplayName(neighborhood.id))}
                >
                  View Demographics
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedNeighborhood && demographicsData && (
        <DemographicsModal
          neighborhoodName={selectedNeighborhood}
          data={demographicsData}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
};

export default SeattleNeighborhoodsPage;