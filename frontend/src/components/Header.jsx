import React from 'react';
import { Activity } from 'lucide-react';

function Header() {
  return (
    <header>
      <h1>
        <Activity color="var(--primary-color)" size={28} />
        Customer Churn Prediction
      </h1>
    </header>
  );
}

export default Header;
