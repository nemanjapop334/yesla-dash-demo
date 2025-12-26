// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChargersPage from './pages/ChargersPage';
import TransactionsPage from './pages/TransactionsPage';
import ChargingNavigationTabs from './components/ChargingNavigationTabs';

function App() {
  return (
    <div>
      {/* TAB NAVIGATION */}
      <ChargingNavigationTabs />

      {/* PAGE CONTENT */}
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/chargers" replace />} />
          <Route path="/chargers" element={<ChargersPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
