import React from 'react';

const StatCard = ({ label, value, color = 'maroon' }) => {
  const valueClass = `stat-card-value ${color}`;
  return (
    <div className="stat-card">
      <div className={valueClass}>{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
};

export default StatCard;