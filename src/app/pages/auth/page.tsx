"use client";
import React, { useState } from 'react';
import { requested } from '~/utils/requested';

const ProtectedPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const response = await requested('/api/protectedData', {
        method: 'GET',
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching data');
    }
  };

  return (
    <div>
      <h1>Protected Page</h1>
      <button onClick={fetchData}>Fetch Protected Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default ProtectedPage;
