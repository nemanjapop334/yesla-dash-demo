// src/App.js
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import ChargersPage from './pages/ChargersPage';
import TransactionsPage from './pages/TransactionsPage';

function App() {
  return (
    <div>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
        <Link to="/chargers" style={{ marginRight: 16 }}>Chargers</Link>
        <Link to="/transactions">Transactions</Link>
      </nav>

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
