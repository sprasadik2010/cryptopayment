// useDatabaseValue.js
import { useState, useEffect } from 'react';

const WithDrawableAmount = () => {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating fetching data from a database
    const fetchData = async () => {
      try {
        // Replace this with your actual database fetching logic
        const response = await fetch('/api/getValue');
        const data = await response.json();
        setValue(data.value);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty array ensures this runs only once after the component mounts

  return { value, loading };
};

export default WithDrawableAmount;
