import React, { useEffect, useState } from 'react';

function App() {
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/investors')
      .then(res => res.json())
      .then(data => setInvestors(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Investors</h1>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Total Commitment</th>
          </tr>
        </thead>
        <tbody>
          {investors.map((inv, idx) => (
            <tr key={idx}>
              <td>{inv.investor_name}</td>
              <td>£{Number(inv.total_commitment).toLocaleString('en-UK')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
