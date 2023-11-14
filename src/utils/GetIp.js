import { useState, useEffect } from 'react';

const GetIp = () => {
  const [serverIp, setServerIp] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/server-ip')
      .then(response => {
        if (!response.ok) {
          throw new Error('Response not valid JSON');
        }
        return response.json();
      })
      .then(data => {
        setServerIp(data.ip);
      })
      .catch(error => {
        console.error(error);
        setError('Error fetching server IP');
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {serverIp ? serverIp : 'Loading...'}
    </div>
  );
};

export default GetIp;
