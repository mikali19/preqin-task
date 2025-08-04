import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';
import './InvestorDetails.css';
import type { Commitment, InvestorDetails as InvestorDetailsType } from './types';

const InvestorDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [investorDetails, setInvestorDetails] = useState<InvestorDetailsType | null>(null);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assetClassFilter, setAssetClassFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (!name) return;
    
    const fetchData = async () => {
      try {
        // Fetch investor details
        const detailsResponse = await fetch(`http://localhost:8000/investors/${name}/details`);
        if (!detailsResponse.ok) throw new Error('Failed to fetch investor details');
        const details = await detailsResponse.json();
        setInvestorDetails(details);

        // Fetch commitments
        const commitmentsResponse = await fetch(`http://localhost:8000/investors/${name}/commitments`);
        if (!commitmentsResponse.ok) throw new Error('Failed to fetch commitments');
        const commitmentsData = await commitmentsResponse.json();
        setCommitments(commitmentsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [name]);

  const assetClasses = ['All', ...Array.from(new Set(commitments.map(c => c.asset_class)))];

  const filteredCommitments = commitments
    .filter(c => assetClassFilter === 'All' || c.asset_class === assetClassFilter)
    .sort((a, b) => sortOrder === 'desc' ? b.commitment_amount - a.commitment_amount : a.commitment_amount - b.commitment_amount);

  if (!name) return <div>Investor not found</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      {investorDetails && (
        <div className="investor-header">
          <h2>{investorDetails.investor_name}</h2>
          <div className="investor-meta">
            <span>Type: {investorDetails.investor_type}</span>
            <span>Country: {investorDetails.investor_country}</span>
            <span>Added: {new Date(investorDetails.date_added).toLocaleDateString()}</span>
            <span>Updated: {new Date(investorDetails.last_updated).toLocaleDateString()}</span>
          </div>
        </div>
      )}

      <div className="filter-container">
        <div className="filter-group">
          <label htmlFor="assetClassFilter">Asset Class:</label>
          <select
            id="assetClassFilter"
            value={assetClassFilter}
            onChange={(e) => setAssetClassFilter(e.target.value)}
          >
            {assetClasses.map((ac) => (
              <option key={ac} value={ac}>{ac}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="sort-button"
        >
          {sortOrder === 'desc' ? '▼ Highest First' : '▲ Lowest First'}
        </button>
      </div>

      <div className="table-container">
        <table className="commitments-table">
          <thead>
            <tr>
              <th>Asset Class</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Date Added</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommitments.map((commitment, index) => (
              <tr key={index} className="commitment-row">
                <td>{commitment.asset_class}</td>
                <td className="amount-cell">
                  {commitment.currency === 'GBP' ? '£' : ''}
                  {commitment.commitment_amount.toLocaleString('en-GB')}
                </td>
                <td>{commitment.currency}</td>
                <td>{new Date(commitment.date_added).toLocaleDateString()}</td>
                <td>{new Date(commitment.last_updated).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvestorDetails;
