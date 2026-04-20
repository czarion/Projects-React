import React from 'react';
import DonorCard from './DonorCard';
import EmptyState from './EmptyState';

const DonorList = ({ donors, onRequestHelp }) => {
  if (donors.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="donor-grid">
      {donors.map(donor => (
        <DonorCard 
          key={donor.id} 
          donor={donor} 
          onRequestHelp={onRequestHelp} 
        />
      ))}
    </div>
  );
};

export default DonorList;
