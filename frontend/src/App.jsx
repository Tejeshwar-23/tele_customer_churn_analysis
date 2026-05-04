import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import InsightsDashboard from './components/InsightsDashboard';

function App() {
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setPredictionResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the prediction service. Please ensure the backend is running and try again.");
      setPredictionResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="card">
          <h2>Customer Profile</h2>
          {error && <div className="error-message">{error}</div>}
          <InputForm onSubmit={handlePredict} isLoading={isLoading} />
        </div>
        <div className="card">
          <InsightsDashboard result={predictionResult} />
        </div>
      </main>
    </div>
  );
}

export default App;
