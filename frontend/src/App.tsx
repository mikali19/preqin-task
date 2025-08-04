import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InvestorDetails from './InvestorDetails';
import './styles.css';
import './App.css';

import type { Investor } from './types';

function InvestorsList() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await fetch('http://localhost:8000/investors');
        if (!response.ok) throw new Error('Failed to fetch investors');
        const data = await response.json();
        setInvestors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error)   return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1 className="header">Investors</h1>
      <div className="table-container">
        <table className="table">
          <colgroup>
            <col style={{ width: '30%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>
          <thead className="table-header">
            <tr>
              <th>Investor Name</th>
              <th>Type</th>
              <th>Country</th>
              <th>Date Added</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((investor, idx) => (
              <tr key={idx} className="table-row">
                <td className="table-cell">
                  <Link
                    to={`/investor/${encodeURIComponent(investor.investor_name)}`}
                    className="investor-name"
                  >
                    {investor.investor_name}
                  </Link>
                </td>
                <td className="table-cell">{investor.investor_type}</td>
                <td className="table-cell">{investor.investor_country}</td>
                <td className="table-cell">
                  {new Date(investor.date_added).toLocaleDateString()}
                </td>
                <td className="table-cell">
                  {new Date(investor.last_updated).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<InvestorsList />} />
          <Route path="/investor/:name" element={<InvestorDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
