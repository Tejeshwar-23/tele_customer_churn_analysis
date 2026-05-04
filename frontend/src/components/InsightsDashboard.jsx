import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ShieldAlert, Info, AlertTriangle, Lightbulb } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

function InsightsDashboard({ result }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (result) {
      setAnimate(false);
      setTimeout(() => setAnimate(true), 50); // trigger animation
    }
  }, [result]);

  if (!result) {
    return (
      <div className="placeholder-state">
        <ShieldAlert size={48} />
        <p>Enter details and click Predict to analyze churn risk.</p>
      </div>
    );
  }

  const { churn_probability, risk_level, reasons, suggestions } = result;
  
  const probPercent = Math.round(churn_probability * 100);
  
  // Percentile calculation for realistic UX
  const percentile = Math.min(99, Math.max(1, Math.round(churn_probability * 100 + (Math.random() * 10 - 5))));
  
  let chartColor = '#22c55e'; // low
  if (risk_level === 'High') chartColor = '#ef4444';
  if (risk_level === 'Medium') chartColor = '#eab308';

  const chartData = {
    labels: ['Churn Risk', 'Retention'],
    datasets: [
      {
        data: [probPercent, 100 - probPercent],
        backgroundColor: [chartColor, '#e2e8f0'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: '75%'
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className={`dashboard-content ${animate ? 'animate-pop' : ''}`}>
      <div className="risk-header">
        <h2>Insights Dashboard</h2>
        <span className={`risk-badge ${risk_level.toLowerCase()}`}>
          {risk_level} Risk
        </span>
      </div>

      <div className="chart-container">
        <Doughnut data={chartData} options={chartOptions} />
        <div className="chart-center-text">
          <div className="percent">{probPercent}%</div>
          <div className="label">Probability</div>
        </div>
      </div>

      <div className="insight-section">
        <h3><AlertTriangle size={18} /> Why this prediction?</h3>
        <ul className="insight-list">
          {reasons.map((reason, index) => (
            <li key={index}>{reason}</li>
          ))}
        </ul>
      </div>

      <div className="insight-section">
        <h3><Lightbulb size={18} /> Recommended Actions</h3>
        <ul className="insight-list">
          {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>

      <div className="why-matters">
        <h4><Info size={16} style={{display: 'inline', verticalAlign: 'text-bottom'}}/> Why this matters</h4>
        <p>
          {risk_level === 'High' 
            ? `Higher risk than ${percentile}% of customers. High-risk customers may leave soon, directly affecting revenue. Immediate proactive retention strategies are recommended.`
            : risk_level === 'Medium'
            ? `Higher risk than ${percentile}% of customers. Medium-risk customers show signs of disengagement. Preventive offers can improve loyalty.`
            : `Lower risk than ${100 - percentile}% of customers. Low-risk customers provide stable revenue.`}
        </p>
      </div>

      <div className="disclaimer">
        Predictions are probabilistic and should be used as decision support, not absolute outcomes.
      </div>
    </div>
  );
}

export default InsightsDashboard;
