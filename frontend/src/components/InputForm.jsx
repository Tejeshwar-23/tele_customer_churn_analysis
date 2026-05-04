import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

function InputForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    gender: "Male",
    SeniorCitizen: 0,
    Partner: "No",
    Dependents: "No",
    tenure: 12,
    PhoneService: "Yes",
    MultipleLines: "No",
    InternetService: "Fiber optic",
    OnlineSecurity: "No",
    OnlineBackup: "No",
    DeviceProtection: "No",
    TechSupport: "No",
    StreamingTV: "No",
    StreamingMovies: "No",
    Contract: "Month-to-month",
    PaperlessBilling: "Yes",
    PaymentMethod: "Electronic check",
    MonthlyCharges: 70.0,
    TotalCharges: 840.0
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <div className="form-group">
        <label>Gender</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="form-group">
        <label>Senior Citizen</label>
        <select name="SeniorCitizen" value={formData.SeniorCitizen} onChange={handleChange}>
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>
      </div>

      <div className="form-group">
        <label>Partner</label>
        <select name="Partner" value={formData.Partner} onChange={handleChange}>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div className="form-group">
        <label>Dependents</label>
        <select name="Dependents" value={formData.Dependents} onChange={handleChange}>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div className="form-group">
        <label>Contract Type</label>
        <select name="Contract" value={formData.Contract} onChange={handleChange}>
          <option value="Month-to-month">Month-to-month</option>
          <option value="One year">One year</option>
          <option value="Two year">Two year</option>
        </select>
      </div>

      <div className="form-group">
        <label>Internet Service</label>
        <select name="InternetService" value={formData.InternetService} onChange={handleChange}>
          <option value="DSL">DSL</option>
          <option value="Fiber optic">Fiber optic</option>
          <option value="No">No</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Payment Method</label>
        <select name="PaymentMethod" value={formData.PaymentMethod} onChange={handleChange}>
          <option value="Electronic check">Electronic check</option>
          <option value="Mailed check">Mailed check</option>
          <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
          <option value="Credit card (automatic)">Credit card (automatic)</option>
        </select>
      </div>

      <div className="form-group">
        <label>Tenure (Months)</label>
        <input type="number" name="tenure" min="0" value={formData.tenure} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Monthly Charges ($)</label>
        <input type="number" step="0.01" name="MonthlyCharges" min="0" value={formData.MonthlyCharges} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Total Charges ($)</label>
        <input type="number" step="0.01" name="TotalCharges" min="0" value={formData.TotalCharges} onChange={handleChange} required />
      </div>

      <div className="form-group full-width">
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? <><Loader2 className="spinner" size={20} /> Analyzing Risk...</> : 'Predict Churn'}
        </button>
      </div>
    </form>
  );
}

export default InputForm;
