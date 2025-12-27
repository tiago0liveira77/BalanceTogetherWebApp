
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Records } from './pages/Records';
import { NewRecord } from './pages/NewRecord';
import { ImportCSV } from './pages/ImportCSV';
import { Recurring } from './pages/Recurring';
import { Categories } from './pages/Categories';
import { Settings } from './pages/Settings';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/records" element={<Records />} />
          <Route path="/records/new" element={<NewRecord />} />
          <Route path="/recurring" element={<Recurring />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/import" element={<ImportCSV />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
