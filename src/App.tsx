import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import SeattleNeighborhoodsPage from './pages/SeattleNeighborhoodsPage';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors relative">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/seattle" element={<SeattleNeighborhoodsPage />} />
        </Routes>
        
        <footer className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white p-4 mt-10">
          <div className="container mx-auto">
            <p className="text-center text-sm">
              &copy; 2025 Inequality Forecast Dashboard | Data is simulated for demonstration purposes
            </p>
          </div>
        </footer>

        {/* Theme toggle button positioned above footer */}
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeToggle />
        </div>
      </div>
    </Router>
  );
}

export default App;